using Amazon.S3;
using Amazon.S3.Model;
using api.Exceptions;

namespace api.Services;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly IConfiguration _configuration;
    private readonly string _bucketName;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _configuration = configuration;
        _bucketName = _configuration["AWS_S3_BUCKET_NAME"] ?? throw new InvalidOperationException("AWS_S3_BUCKET_NAME is not configured");
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        // Validate file type (only images allowed for cover images)
        var allowedImageTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedImageTypes.Contains(file.ContentType))
        {
            throw new ApiException(415, "Invalid file type.");
        }
        
        const int maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.Length > maxFileSize)
        {
            throw new ApiException(413, "File too large.");;
        }
        
        try
        {
            using var stream = file.OpenReadStream();
            var fileUrl = await UploadFileAsync(stream, file.FileName, file.ContentType);
            return fileUrl;
        }
        catch
        {
            throw new ApiException(500, "Failed to upload image.");
        }
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        try
        {
            // Generate a unique filename to avoid conflicts
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = uniqueFileName,
                InputStream = fileStream,
                ContentType = contentType,
                CannedACL = S3CannedACL.PublicRead // Make the file publicly accessible
            };

            var response = await _s3Client.PutObjectAsync(request);

            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                // Return the public URL of the uploaded file
                return $"https://{_bucketName}.s3.amazonaws.com/{uniqueFileName}";
            }

            throw new Exception($"Failed to upload file. Status code: {response.HttpStatusCode}");
        }
        catch (Exception ex)
        {
            throw new Exception($"Error uploading file to S3: {ex.Message}", ex);
        }
    }

    public async Task<bool> DeleteFileAsync(string fileName)
    {
        try
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName
            };

            var response = await _s3Client.DeleteObjectAsync(request);
            return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error deleting file from S3: {ex.Message}", ex);
        }
    }
}

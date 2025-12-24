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
        _bucketName = _configuration["MINIO_BUCKET_NAME"] ?? throw new InvalidOperationException("MINIO_BUCKET_NAME is not configured");
        
        EnsureBucketExistsAsync().GetAwaiter().GetResult();
    }

    private async Task EnsureBucketExistsAsync()
    {
        try
        {
            try
            {
                await _s3Client.GetBucketLocationAsync(_bucketName);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                await _s3Client.PutBucketAsync(_bucketName);
                
                var policy = $@"{{
                    ""Version"": ""2012-10-17"",
                    ""Statement"": [
                        {{
                            ""Effect"": ""Allow"",
                            ""Principal"": {{""AWS"": [""*""]}},
                            ""Action"": [""s3:GetObject""],
                            ""Resource"": [""arn:aws:s3:::{_bucketName}/*""]
                        }}
                    ]
                }}";
                
                await _s3Client.PutBucketPolicyAsync(new PutBucketPolicyRequest
                {
                    BucketName = _bucketName,
                    Policy = policy
                });
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error ensuring bucket exists: {ex.Message}", ex);
        }
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
                ContentType = contentType
            };

            var response = await _s3Client.PutObjectAsync(request);

            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                // Return a path that will be proxied by the frontend to MinIO
                return $"/minio/{_bucketName}/{uniqueFileName}";
            }

            throw new Exception($"Failed to upload file. Status code: {response.HttpStatusCode}");
        }
        catch (Exception ex)
        {
            throw new Exception($"Error uploading file to MinIO: {ex.Message}", ex);
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
            throw new Exception($"Error deleting file from MinIO: {ex.Message}", ex);
        }
    }
}

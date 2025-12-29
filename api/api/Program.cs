using Amazon.S3;
using api.Data;
using api.Models;
using api.Services;
using api.Middleware;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.DataProtection;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var s3Config = new Amazon.S3.AmazonS3Config
    {
        ServiceURL = config["MINIO_ENDPOINT"],
        ForcePathStyle = true // Required for MinIO
    };
    
    return new AmazonS3Client(
        config["MINIO_ACCESS_KEY"],
        config["MINIO_SECRET_KEY"],
        s3Config
    );
});

builder.Services.AddAuthentication()
    .AddCookie()
    .AddGitHub(options =>
    {
        options.ClientId = builder.Configuration["GITHUB_CLIENT_ID"];
        options.ClientSecret = builder.Configuration["GITHUB_CLIENT_SECRET"];
        options.Scope.Add("user:email");
        options.SaveTokens = true;
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errorMessage = string.Join("; ", context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage));

            return new BadRequestObjectResult(new { message = errorMessage });
        };
    });

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var host = builder.Configuration["HOST"];
    var port = builder.Configuration["DB_PORT"];
    var database = builder.Configuration["DATABASE"];
    var username = builder.Configuration["USERNAME"];
    var password = builder.Configuration["PASSWORD"];
    
    var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
    
    options.UseNpgsql(connectionString);
});

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<SecurityStampValidatorOptions>(options =>
{
    options.ValidationInterval = TimeSpan.FromMinutes(30);
});

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo("/app/keys"))
    .SetApplicationName("Waffle");

builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.MaxAge = TimeSpan.FromDays(30);
    options.Cookie.IsEssential = true;
    
    options.Events.OnRedirectToLogin = ctx =>
    {
        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = ctx =>
    {
        ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.LicenseKey = builder.Configuration["MEDIATR_LICENSE_KEY"];
});

builder.Services.AddScoped<S3Service>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CurrentUserService>();


var app = builder.Build();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
        throw;
    }
}

app.UseMiddleware<GlobalErrorHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
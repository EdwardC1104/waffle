using Amazon.S3;
using api.Data;
using api.Models;
using api.Services;
using api.Middleware;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

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

builder.Services.ConfigureApplicationCookie(options =>
{
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

app.UseMiddleware<GlobalErrorHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
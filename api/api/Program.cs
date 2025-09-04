using Amazon.S3;
using api.Data;
using api.Features.Auth.GetCurrentUser;
using api.Features.Auth.GitHubLogin;
using api.Features.Auth.Login;
using api.Features.Auth.Logout;
using api.Features.Auth.Register;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using api.Features.Post.CreatePost;
using api.Features.Feed.GetFollowingFeed;
using api.Features.Feed.GetFypFeed;
using api.Features.Feed.GetPopularFeed;
using api.Features.Follow.CreateFollow;
using api.Features.Follow.DeleteFollow;
using api.Features.Like.CreateLike;
using api.Features.Like.DeleteLike;
using api.Features.Post.DeletePost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.Post.UpdatePost;
using api.Features.Post.WordCount;
using api.Features.Search.SearchUsersAndPosts;
using api.Features.User.DeleteUser;
using api.Features.User.GetUser;
using api.Features.User.UpdateUser;
using api.Models;
using api.Services;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

builder.Services.AddAuthentication()
    .AddCookie() // You already have Identity cookies
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

builder.Services.AddScoped<S3Service>();

builder.Services.AddScoped<GetPostsHandler>();
builder.Services.AddScoped<CreatePostHandler>();
builder.Services.AddScoped<GetPostHandler>();
builder.Services.AddScoped<UpdatePostHandler>();
builder.Services.AddScoped<DeletePostHandler>();
builder.Services.AddScoped<TodaysWordCountHandler>();

builder.Services.AddScoped<GetUserHandler>();
builder.Services.AddScoped<UpdateUserHandler>();
builder.Services.AddScoped<DeleteUserHandler>();

builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<RegisterHandler>();
builder.Services.AddScoped<GetCurrentUserHandler>();
builder.Services.AddScoped<LogoutHandler>();
builder.Services.AddScoped<GitHubLoginHandler>();

builder.Services.AddScoped<GetFollowingFeedHandler>();
builder.Services.AddScoped<GetFypFeedHandler>();
builder.Services.AddScoped<GetPopularFeedHandler>();

builder.Services.AddScoped<GetSuggestionsHandler>();
builder.Services.AddScoped<GetFollowersHandler>();
builder.Services.AddScoped<GetFollowingHandler>();
builder.Services.AddScoped<CreateFollowHandler>();
builder.Services.AddScoped<DeleteFollowHandler>();

builder.Services.AddScoped<CreateLikeHandler>();
builder.Services.AddScoped<DeleteLikeHandler>();

builder.Services.AddScoped<SearchUsersAndPostsHandler>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
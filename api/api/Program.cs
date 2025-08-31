using api.Data;
using api.Features.Auth.GetCurrentUser;
using api.Features.Auth.Login;
using api.Features.Auth.Logout;
using api.Features.Auth.Register;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using api.Features.Post.CreatePost;
using api.Features.Post.GetFollowingFeed;
using api.Features.Post.GetFypFeed;
using api.Features.Post.GetPopularFeed;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.User.GetUser;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<GetPostsHandler>();
builder.Services.AddScoped<CreatePostHandler>();
builder.Services.AddScoped<GetPostHandler>();
builder.Services.AddScoped<GetUserHandler>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<RegisterHandler>();
builder.Services.AddScoped<GetCurrentUserHandler>();
builder.Services.AddScoped<LogoutHandler>();
builder.Services.AddScoped<GetFollowingFeedHandler>();
builder.Services.AddScoped<GetFypFeedHandler>();
builder.Services.AddScoped<GetPopularFeedHandler>();
builder.Services.AddScoped<GetSuggestionsHandler>();
builder.Services.AddScoped<GetFollowersHandler>();
builder.Services.AddScoped<GetFollowingHandler>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
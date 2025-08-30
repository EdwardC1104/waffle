using api.Data;
using api.Features.Auth;
using api.Features.Post;
using api.Features.User;
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

builder.Services.AddScoped<GetPosts>();
builder.Services.AddScoped<CreatePost>();
builder.Services.AddScoped<GetPost>();
builder.Services.AddScoped<GetUser>();
builder.Services.AddScoped<Login>();
builder.Services.AddScoped<Register>();
builder.Services.AddScoped<GetCurrentUser>();
builder.Services.AddScoped<Logout>();
builder.Services.AddScoped<GetFollowingFeed>();
builder.Services.AddScoped<GetFypFeed>();
builder.Services.AddScoped<GetPopularFeed>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
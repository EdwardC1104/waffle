FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY api/api.csproj ./api/
RUN dotnet restore api/api.csproj

COPY api/ ./api/
RUN dotnet build api/api.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish api/api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "api.dll"]

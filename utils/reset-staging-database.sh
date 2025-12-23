#!/bin/bash
set -e

source .env

echo "[$(date)] Starting database sync from production to staging..."

docker exec waffle-postgres psql -U $DB_USER -d postgres -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE datname = 'waffle_staging' AND pid <> pg_backend_pid();"

docker exec waffle-postgres psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS waffle_staging;"
docker exec waffle-postgres psql -U $DB_USER -d postgres -c "CREATE DATABASE waffle_staging;"

docker exec waffle-postgres pg_dump -U $DB_USER waffle_prod | \
  docker exec -i waffle-postgres psql -U $DB_USER waffle_staging

echo "[$(date)] Data copied successfully"

docker exec waffle-api-staging dotnet ef database update

echo "[$(date)] Staging migrations applied - sync complete"

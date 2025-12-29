#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

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

echo "[$(date)] Syncing MinIO images from production to staging..."
docker exec waffle-minio mc alias set local http://localhost:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD > /dev/null 2>&1 || true
docker exec waffle-minio mc mb local/$MINIO_BUCKET_NAME --ignore-existing > /dev/null 2>&1 || true
docker exec waffle-minio mc mb local/$MINIO_BUCKET_NAME_STAGING --ignore-existing > /dev/null 2>&1 || true

echo "[$(date)] Setting public read access on staging bucket..."
docker exec waffle-minio mc anonymous set download local/$MINIO_BUCKET_NAME_STAGING

docker exec waffle-minio mc mirror --overwrite --remove local/$MINIO_BUCKET_NAME local/$MINIO_BUCKET_NAME_STAGING

echo "[$(date)] Images synced successfully"

echo "[$(date)] Restarting staging API to apply migrations..."
docker compose restart api-staging

echo "[$(date)] Staging database and images sync complete"

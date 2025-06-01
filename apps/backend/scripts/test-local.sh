#!/bin/bash
set -e

# Define constants
CONTAINER_NAME="fightclub-db"

# Check if the container is running
if ! docker ps --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
  echo "Starting Postgres container..."
  docker-compose up -d db

  echo "Waiting for DB to be healthy..."
  until docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" | grep -q "healthy"; do
    sleep 1
  done
else
  echo "Postgres container already running."
fi

# Run Prisma generate and migrations
echo "Generating Prisma client..."
npx prisma generate

echo "Applying DB migrations..."
npx prisma migrate deploy

# Run the tests
echo "Running tests..."
npm run test

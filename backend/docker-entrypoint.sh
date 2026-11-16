#!/bin/sh
# Runs every time the backend container starts:
# 1. wait until the database accepts connections
# 2. apply any database migrations that have not been applied yet
# 3. put in the starting content (admin account, page copy, works, prices) the first time only
# 4. start the API
# If a migration or seeder fails the container stops, so a half-built site never goes live.
set -e

echo "Waiting for the database..."
node src/utils/waitForDatabase.js

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  ./node_modules/.bin/sequelize-cli db:migrate

  # Seeders that already ran are remembered in the database and skipped, so this is safe on every start.
  echo "Adding starting content (first start only)..."
  ./node_modules/.bin/sequelize-cli db:seed:all
fi

# exec hands the process over to Node so Docker's stop signal reaches it directly.
exec node src/server.js

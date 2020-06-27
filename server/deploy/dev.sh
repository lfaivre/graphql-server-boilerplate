#!/usr/bin/env bash

set -o errexit

npm install
./deploy/wait-for-it.sh db:5432 -- echo "Database ready on port 5432..."
exec npm start

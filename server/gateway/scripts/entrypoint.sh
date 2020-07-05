#!/bin/sh

set -e

echo 'Printing /usr/src/...'
ls /usr/src/

echo 'Instantiating node_modules...'
mkdir -p /usr/src/gateway/node_modules
rsync -aqP -delete /usr/src/cache/node_modules/ /usr/src/gateway/node_modules

echo 'Waiting for other connected services...'
exec dockerize -wait tcp://gateway-db-dev:5432 -wait tcp://gateway-redis-dev:6379 -timeout 60m npm run start:dev

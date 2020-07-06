#!/bin/sh

set -e

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RESET=$(tput sgr0)

echo "
${BLUE}Instantiating project dependencies...${RESET}

${YELLOW}Note:${RESET}

The dependencies will take some time to install
during the first run of this service after its initial build.
Future runs will utilize a caching system to reduce this
overhead.

This process is using the ${GREEN}rsync${RESET} utility to
sync a cached version of the node_modules directory
(made during the initial build of the container) to the
container's working directory(${GREEN}/usr/src/gateway${RESET}).

Because of the bind mount specified within the docker-compose
file, the node_modules directory is being written to the
container (${GREEN}/usr/src/gateway/node_modules${RESET})
and also the host (${GREEN}gateway/node_modules${RESET}).
Because of this, dependencies only need to be installed once,
and in one location!

This also allows changes to synchronize between the container
and host, i.e. installing a new package within the docker container
(via docker-compose exec gateway-dev sh => npm install ...) will
update the host dependencies as well.

However, any changes made to the package.json/package-lock.json
files will require a manual rebuild of the container the next time
it is run because the cached dependencies will need to be updated.

This can be done via the command:

${YELLOW}docker-compose up --build gateway-dev${RESET}
"

mkdir -p /usr/src/gateway/node_modules
rsync -aq --partial -delete /usr/src/cache/node_modules/ /usr/src/gateway/node_modules

echo -e "${GREEN}Synchronization complete.${RESET}\n\n"

echo -e "${BLUE}Waiting for other connected services...${RESET}\n\n"

dockerize \
  -wait tcp://gateway-db-dev:5432 \
  -wait tcp://gateway-redis-dev:6379 \
  -timeout 60m

exec npm run start:dev

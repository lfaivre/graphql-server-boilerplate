#!/bin/bash

set -e

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RESET=$(tput sgr0)

echo "
${BLUE}In order to get this project up and running this script will:${RESET}

- Check out the 'master' branch (Git)
- Run command 'git reset --hard origin/master' (Git/GitHub)
- Run command 'git clean -dfx' (Git)
- Initialize shared packages (temporary implementation)
- Run command 'docker-compose down --rmi=all -v --remove-orphans' (Docker Compose)
- Run command 'docker-compose build --no-cache' (Docker Compose)

${RED}IMPORTANT: BEFORE RUNNING THIS SCRIPT${RESET}

- Set up a 'master' branch on GitHub and add a remote 'origin' (or alter this script)
- Stash or commit/push any unsaved changes
- Make sure Docker/Docker Compose is running on your host machine
- Run this in the project's 'graphql-server-boilerplate/server' directory
"

read -n1 -p "Continue? [yY, nN]: " SELECTION
case $SELECTION in
y | Y) echo -e "\n\n\n${GREEN}Building project...${RESET}\n\n" ;;
n | N) echo -e "\n\n${BLUE}Terminating process...${RESET}" && exit 0 ;;
*) echo -e "\n\n${RED}Invalid selection${RESET}" && exit 2 ;;
esac

PARENTNAME="graphql-server-boilerplate"
BASENAME="server"
COMPUTED_PARENTNAME="$(basename "$(dirname "$PWD")")"
COMPUTED_BASENAME="${PWD##*/}"

echo -e "${BLUE}Checking the working directory...${RESET}\n"
if [ "$PARENTNAME" != "$COMPUTED_PARENTNAME" ] || [ "$BASENAME" != "$COMPUTED_BASENAME" ]; then
  echo "${RED}ERROR: This script must be run in the 'graphql-server-boilerplate/server' directory${RESET}"
  exit 2
fi
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Stashing files (just in case)...${RESET}\n"
git add . >/dev/null 2>&1 || (echo "${RED}ERROR (Git): Failed command 'git add .'${RESET}" && exit 2)
git stash >/dev/null 2>&1 || (echo "${RED}ERROR (Git): Failed command 'git stash'${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Checking out the 'master' branch...${RESET}\n"
git checkout master >/dev/null 2>&1 || (echo "${RED}ERROR (Git): Failed command 'git checkout master'${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Resetting the master branch...${RESET}\n"
git reset --hard origin/master >/dev/null 2>&1 || (echo "${RED}ERROR (Git): Failed command 'git reset --hard origin/master'${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Removing untracked files...${RESET}\n"
git clean -dfx || (echo "${RED}ERROR (Git): Failed command 'git clean -dfx'${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Initializing shared packages...${RESET}\n"
mkdir -p ./gateway/shared/src && chmod +x ./gateway/shared/src
mkdir -p ./tests/shared/src && chmod +x ./tests/shared/src
rsync -aq --partial -delete ./shared/src/ ./gateway/shared/src
rsync -aq --partial -delete ./shared/src/ ./tests/shared/src
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Installing node_modules in 'shared' directory...${RESET}\n"
(
  cd ./shared
  npm install --quiet
) || (echo "${RED}ERROR (npm): Failed command 'npm install' in 'shared' directory${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${BLUE}Building Docker Compose services...${RESET}\n"
docker-compose top >/dev/null 2>&1 || (echo "${RED}ERROR: Docker Compose must be running${RESET}" && exit 2)
docker-compose down --rmi=all -v --remove-orphans >/dev/null 2>&1 || (echo "${RED}ERROR (Docker Compose): Failed command 'docker-compose down --rmi=all -v --remove-orphans'${RESET}" && exit 2)
docker-compose build --no-cache || (echo "${RED}ERROR (Docker Compose): Failed command 'docker-compose build --no-cache'${RESET}" && exit 2)
echo -e "${GREEN}Done${RESET}\n\n"

echo -e "${GREEN}Success.${RESET}\n\n${BLUE}Run 'docker-compose up gateway-dev' to run the development service.${RESET}" && exit 0

# Server Boilerplate

The server utilizes [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) to containerize its dependencies and processes along with an associated PostgreSQL database.

# Installation

1. Clone the repository

```shell
git clone https://github.com/lfaivre/graphql-server-boilerplate.git
```

2. Install dependencies

Note: Docker maps the node dependencies to the host machine as part of its build. However, there are certain scripts within the package.json file that don't run correctly without also installing the dependencies locally. This is temporary, I plan to fix this issue later.

```shell
cd graphql-server-boilerplate/server
npm install
```

3. Start Docker Compose

Ensure that you have the latest version of [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your computer.

```shell
docker-compose up
```

This will create the server and database images and map the server to http://localhost:4000/.

# Utility Commands

1. Stop Docker Compose

```shell
docker-compose down
docker-compose down -v
```

2. Restart Docker Compose

```shell
docker-compose restart
docker-compose restart server
docker-compose restart db
```

3. View container logs

service: server
```shell
docker-compose logs -f server
```

service: db
```shell
docker-compose logs -f db
```

4. Use `psql` within database container

````shell
 docker-compose exec -u postgres db psql
````

5. Troubleshooting

Note: Currently I have the server container configured to ignore any changes to the node_modules folder for perforance reasons. If new dependencies are added or there are any unexpected errors try the command below.

```shell
docker-compose down -v && \
docker system prune --volumes -f && \
docker image rm -f lorenzofaivre/graphql-server-boilerplate/server:latest && \
docker-compose up
```
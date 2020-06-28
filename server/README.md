# About

This is a first attempt at creating microservices while also simultaneously learning GraphQL. The goal is to iteratively improve this boilerplate, and use it for projects where scale is a priority.

# Overview

Docker and Docker Compose are being used to containerize and network all services.

# Architecture

This server is (currently) split into two services. Well, one is not quite a service, but still important.

1. `gateway`

This service will act as a gateway for all (? TBD) client API requests.

2. `tests`

This is a node process that will evaluate API tests for each service.

# Installation

TODO

# Deployment

TODO

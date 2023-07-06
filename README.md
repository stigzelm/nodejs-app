# Node.js recruitment task - senior

This repository contains the base code for recruitment exercise. Complete the tasks listed below and publish the solution on your github. Send us a link to your repository at least 1 day before the interview. 
We will discuss the proposed solution during the interview. You should be ready to present the working application on your local machine.

There is some key features that must be implemented in the recruitment task:

- CRUD operations for customers (get, update, delete) by id or email;

- login and signup operations for customers;

- access token;

- refresh token;

- restrict access to get customers operation from unauthenticated users;

- roles USER and ADMIN;

- restrict access to delete customer and update customer operations from unauthenticated users and customers with USER role;

- ability to verify customer's account after signup with activation code;

## Installation

```bash
# Install packages
npm install

npx prisma generate
```

## Local database

```bash
# Setup local postgres
docker run --name recruitment-task -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11.16

#create .env file with your local database credentials

# Run migration
npx prisma migrate dev

# Run db seed
npx prisma db seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```


## Tools

Access the swagger documentation by going to the url: http://localhost:8080/api
Access the GraphQL playground by going to the url: http://localhost:8080/graphql
Start the UI for the prisma database with the command: npx prisma studio

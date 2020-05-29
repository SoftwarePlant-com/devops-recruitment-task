# DevOps Interview Exercise

## Introduction

Your team has developed an application and you have been handed over the responsibility of deploying it (a DevOps task).

The application consists of a simple API that checks whether it's possible to connect to a Postgres and a Redis database. You don't know much about how the application is coded (it also doesn't matter), but you know that it has a configuration file, how to build it and you have an API endpoint to check that it works.

The exercise consist of 5 tasks.

## Evaluation rules / criteria

The evaluation will be carried out through a quick interview in which you will present the solutions. Please have the following in mind:

- You will be allowed to have any kind of notes or command snippets with you.
- You can make use of Google at any time.
- There are no passing conditions or requirements. This means that it's possible to pass the interview without solving all of the tasks correctly. In this case, It's highly appreciated to understand why the task could not be solved.
- You cannot edit the application's code, unless there's a justfied reason to do it.
- The interview will be carried out in English.

## Feel free to ask questions

If during the task completion you are blocked, you can submit your questions to juan.pascale@softwareplant.com with copy to bartlomiej.janczak@softwareplant.com. We value the capacity of learning and asking the right question.

## Minimum requirements

- Node.js@12.16.3
- npm@6.14.4
- Git
- Docker

Suggestion: Use nvm for node and npm.

## Task 1 - Warming up

Task 1 consists of creating all the resources/configuration to run the application. You can download the application by cloning this repository.

The application will need a postgres and a redis database to run, that you should make available in your local environment.

You will find a configuration file in `./config.json` in the project's directory, with the following format:

```JSON
{
  "development": {
    "postgres": {
      "host": "hostname",
      "port": 1234,
      "database": "databasename",
      "user": "username",
      "password": ""
    },
    "redis": {
      "host": "hostname",
      "port": 1234
    }
  },
  "production": ...
}
```

The application will, by default, use the `development` configuration.

Once the application is configured with the location of the databases that you previously created, to run it you should:

- Install the application dependencies: `npm install`
- Compile the application: `npx tsc`
- Run the application: `node build/index.js`

Note: Run these commands in the project's directory.

The application listens on the port 3000. To check that the application is correctly running enter http://localhost:3000/ , and you can check whether the application correctly connects to the databases entering to http://localhost:3000/postgres and http://localhost:3000/redis .

The task is completed when you get an `OK` status in both endpoints.

## Task 2 - Dockerize DBs

Run the necessary databases in Docker containers and connect the application. You can also do this directly while doing Task 1, which will probably save you time.

The task is completed when the application runs in development mode and consumes containerized databases.

Suggestion: Use containers that don't exit when stopped (so they can be started up again later).

## Task 3 - Dockerize the application

Create a Dockerfile that will help you generate a docker image with the application. Build this image with a tag that you like. Start the container with the application.

It is a requirement to use the `production` configuration from the `config.json` file. The application loads this configuration when the environment variable `NODE_ENV` is set to `production`.

The task is completed when the application runs in a container in production mode and connects to databases running in containers. The application should return status `OK` in both endpoints.

Hint: use `host.docker.internal` as DNS to refer to the host machine. This will help you communicating with other containers whose ports are binded with host machine. For example, any service that is accessible as `http://localhost:1234` from the host machine, is accessible as `http://host.docker.internal:1234` from any container.

## Task 4 - Container healer

Write a script `fix.sh` (Preferably written in bash, but you may use any other programming language).

This script, when executed manually, should access the application's API through HTTP and get the current state of the database. If the state of any (or both) of the databases is `FAIL`, it should fix the database.

A successful valid use case is:

- Stopping the container of a database.
- Checking through the API that the state is `FAIL`.
- Running ./fix.sh.
- Checking through the API that the state is `OK`.

Suggestion: It's valid to restart the container to fix the database.

Note: This script runs in the host machine, it should NOT be containerized.

## Task 5

Prepare to explain the folliwing concepts:

- What is a process? What is a thread? What's the difference?
- What happens through the OS when you send SIGTERM to the server? (When pressing Ctrl^C).
- What is the .dockerignore file and why is it important?

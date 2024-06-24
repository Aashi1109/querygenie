# QueryGenie

## Description

A web application to chat with your projects by creating projects for your pdf files

## Usage

Simply signin with app using signin button using google signin, and you are all set to use the application.

## Implementations

- We have 2 separate running applications for our client and server(bullmq is here)

### Client

- Create using NextJs and for authentication NextAuth is being used(for now only google signin).
- Make requests to server for getting data.

### Server

- Created using NodeJs and ExpressJS, database being used is Postgresql
- We have used Prisma ORM for querying our database.
- BullMQ is used for handling long extensive processes like extracting text from pdf, generating embedding, splitting
  into chunks and saving it into qdrant.
- Cloudinary is being used as cloud storage for storing our file data.

## Detailed flow of what happens when user uploads project

- User creates project from QueryGenie (frontend/client) and the request is sent to server.
- Server uploads the file on Cloudinary cloud storage and sends back response to client that project has been created.
  At the same time it sends the file to bullmq worker too.
- BullMQ has 2 separate queues for handling processing of file. First one extracts text from the file using pdf-parse
  package. After successfully parsing the text from file it send it to another bullmq queue which now on this extracted
  text splits them into chunks (mak chunks token size is **200** for now). This split texts is then send for embedding
  to openai. Currently, we are using **text-embedding-ada-002** model for embedding purpose. After creating embedding
  collections are created for project and embedding are saved in Qdrant database.

## Docker deployment setup

- For client required env variables
    - `HOST`
    - `PORT`
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`
    - `NEXTAUTH_URL`
    - `NEXTAUTH_SECRET`
    - `API_URL`
    - `EMBED_QUERY_URL`
- For server required env variables
    - `DATABASE_URL`
    - `PORT`
    - `HOSTNAME`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
    - `NODE_ENV`
    - `CORS_ORIGIN`
    - `REDIS_HOST`
    - `REDIS_PORT`
    - `OPEN_API_KEY`
    - `MODEL_MAX_TOKENS`
    - `CHUNK_TOKEN_SIZE`
    - `EMBED_QUERY_URL`
    - `QDRANT_HOST`
    - `QDRANT_PORT`
- Make sure that you either docker version of redis, qdrant and postgresql are installed. If running as installable
  remove depends from querygenie-server.
- To up the services, run the following command.
- ```shell
  docker compose up
  ```
- If services are running as docker containers include path of the docker file too.
- ```shell
  docker compose -f <path to services compose.yml> -f <querygenie compose.yml path> up

```
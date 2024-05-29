FROM node:22-alpine3.20

ARG DATABASE_URL

RUN apk --no-cache add curl

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package*.json ./

USER root

RUN chown -R app:app .

USER app

RUN npm install

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

# initialize prisma schema
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
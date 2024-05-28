FROM node:22-alpine3.20

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package*.json ./

USER root

RUN chown -R app:app .

USER app

RUN npm install

COPY . .

#ENV DATABASE_URL="postgresql://root:root@localhost:5432/querygenie?connect_timeout=300"

# initialize prisma schema
RUN #npx prisma migrate deploy

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=2s --start-period=15s CMD node /app/healthcheck.js

CMD npm run server:dev
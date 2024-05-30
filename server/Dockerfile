FROM node:22-alpine3.20

RUN apk --no-cache add curl

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package*.json ./

USER root

RUN chown -R app:app .

USER app

RUN npm install --production

COPY ./dist .

COPY ./prisma prisma

# initialize prisma schema
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]
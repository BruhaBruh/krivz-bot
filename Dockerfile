FROM node:alpine as builder

WORKDIR /builder

RUN apk add --update nodejs npm

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:alpine as app

WORKDIR /app

RUN apk add --update nodejs npm

COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/dist .

CMD node ./src/index.js
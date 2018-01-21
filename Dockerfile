FROM node:alpine

WORKDIR /usr/travel-bid/src

COPY . .

RUN yarn install --production

ENTRYPOINT [ "yarn", "start" ]

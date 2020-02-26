# we should have a fully fledged linux
FROM node:10.16.0
# FROM node:12

WORKDIR /app

# install some depenendencies
COPY ./package.json ./

RUN yarn install

COPY . .

# default command
CMD ["yarn", "start"]
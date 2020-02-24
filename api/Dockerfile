# we should have a fully fledged linux
FROM node:12

WORKDIR /app

# install node-gyp for bcrypt
RUN npm install -g --force node-gyp

# install some depenendencies
COPY ./package.json ./

# bcrypt is a little b***h
RUN yarn install && \
  yarn remove bcrypt jsonwebtoken && \
  yarn add bcrypt jsonwebtoken

COPY . .

# default command
CMD ["yarn", "start"]
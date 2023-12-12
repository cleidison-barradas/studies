FROM node:16.14.2

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

CMD [ "node", "--expose-gc", "build/app.js" ]

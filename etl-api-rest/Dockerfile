FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 3020

CMD [ "node", "--expose-gc", "build/app.js" ]
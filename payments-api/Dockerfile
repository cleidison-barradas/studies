FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 6002

CMD [ "node", "build/app.js" ]
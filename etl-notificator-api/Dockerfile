
FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 6002

CMD [ "node", "build/index.js" ]
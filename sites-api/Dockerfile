FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 6001

CMD [ "node", "build/app.js" ]


FROM node:16

# Create app directory
WORKDIR /var/www/app

# Bundle app source
COPY . .

EXPOSE 6003

CMD [ "node", "build/app.js" ]
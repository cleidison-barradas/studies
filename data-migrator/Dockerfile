FROM node:16

# Create app directory
WORKDIR /var/www/app

# Bundle app source
COPY . .

CMD [ "node", "--max-old-space-size=16384 src/app.js" ]

FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 8186
EXPOSE 8187
EXPOSE 8188

CMD [ "node", "--expose-gc", "build/app.js" ]
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

CMD [ "node","--max-old-space-size=10240" ,"--expose-gc", "build/app.js" ]
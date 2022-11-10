FROM node:latest
RUN npm install pm2 -g


COPY ./ app/

COPY pm2.config.js app/

WORKDIR app/

RUN npm install 

EXPOSE 8080


CMD [ "pm2-runtime", "start"   , "pm2.config.js" ]
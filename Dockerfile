FROM node:latest

WORKDIR /ping-pong-ui
ENV PATH /node_modules/.bin:$PATH
COPY package*.json /ping-pong-ui
RUN npm i -g @ionic/cli native-run cordova-res
RUN npm i
COPY . /ping-pong-ui
EXPOSE 8100
CMD ionic serve --host 0.0.0.0
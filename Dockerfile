FROM node:latest

WORKDIR /retroGame
ENV PATH /node_modules/.bin:$PATH
COPY package*.json /retroGame
RUN npm i -g @ionic/cli native-run cordova-res
RUN npm i
COPY . /retroGame
EXPOSE 8100
CMD ionic serve --host 0.0.0.0
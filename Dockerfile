FROM node:latest

WORKDIR /retropong
ENV PATH /node_modules/.bin:$PATH
COPY package*.json /retropong
RUN npm i -g @ionic/cli native-run cordova-res
RUN npm i
COPY . /retropong
EXPOSE 8100
CMD ionic serve --host 0.0.0.0

FROM node:14

WORKDIR /usr/app

COPY package.json .

RUN npm i nodemon -g
RUN npm install

COPY src ./src

EXPOSE $APP_PORT

CMD npm run start

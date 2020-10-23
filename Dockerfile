FROM node:14

WORKDIR /usr/app

COPY package.json .

RUN npm i nodemon -g
RUN npm install

COPY src ./src

EXPOSE 9000

CMD npm run start

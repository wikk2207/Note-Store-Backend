# Note-Store-Backend

## Technologies

<table>
<tr>
<td> <img src="./public/readme/nodejs.svg" height="30"></td>
<td>Node.js (Express.js)</td>
</tr>
<tr>
<td> <img src="./public/readme/mongo.png" height="30"></td>
<td>Mongo</td>
</tr>
<tr>
<td> <img src="./public/readme/docker.png" height="30"></td>
<td>Docker</td>
</tr>
<tr>
<td> <img src="./public/readme/docker-compose.png" height="30"></td>
<td>Docker Compose</td>
</tr>
</table>

## How to run this app

```
docker-compose build
docker-compose up
```

## Tests

To run tests you have to install mongoDB server and have it active.

```
$ sudo systemctl start mongod
$ npm run test
```

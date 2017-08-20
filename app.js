const http = require('http');
const fs = require('fs');
require('dotenv-safe').load({
    path: `${__dirname}/config/.env`,
    sample: `${__dirname}/config/.env.example`,
    allowEmptyValues: false,
});

const server = http.createServer((req, res) => {
    fs.readFile('./index.html', 'utf-8', (error, content) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
});
const io = require('socket.io').listen(server);

server.listen(process.env.PORT);

const radioFrequenceControl = require('home-center-radio-frequence-control');

radioFrequenceControl.initSocket(io);
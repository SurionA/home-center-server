const http = require('http');
const fs = require('fs');
const alert = require('./lib/alert/index');
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
const musicControl = require('home-center-music-control');
const hydrometriesArduino = require('home-center-hydrometries-arduino');

hydrometriesArduino.initSocket(io);
musicControl.initSocket(io);
radioFrequenceControl.initSocket(io);

const cronJobs = require('./lib/cron');

cronJobs.start(hydrometriesArduino);

process.on('exit', () => {
    const type = 'alert';
    const content = 'process Home-center server down. Catch by event "exit"';

    alert.sms.send(type, content)
        .then(() => process.exit())
        .catch(() => process.exit());
});

process.on('SIGINT', () => {
    const type = 'alert';
    const content = 'process Home-center server down. Catch by event SIGINT';

    alert.sms.send(type, content)
        .then(() => process.exit())
        .catch(() => process.exit());
});

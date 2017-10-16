const http = require('http');
const fs = require('fs');

require('dotenv-safe').load({
    path: `${__dirname}/config/.env`,
    sample: `${__dirname}/config/.env.example`,
    allowEmptyValues: false,
});

const CONSTANTS = require('./lib/constants');
const logger = require('./lib/logger/index')(CONSTANTS.loggerLabelMain);
const alert = require('./lib/alert/index');

const server = http.createServer((req, res) => {
    fs.readFile('./index.html', 'utf-8', (error, content) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    });
});
const io = require('socket.io').listen(server);

server.listen(process.env.PORT);
logger.info('HomeCenter Server start...');

const radioFrequenceControl = require('home-center-radio-frequence-control');
const musicControl = require('home-center-music-control');
const hydrometriesArduino = require('home-center-hydrometries-arduino');

hydrometriesArduino.initSocket(io);
musicControl.initSocket(io);
radioFrequenceControl.initSocket(io);

const cronJobs = require('./lib/cron/index');

cronJobs.start(hydrometriesArduino);

process.on('exit', () => {
    const type = 'alert';
    const content = 'process Home-center server down. Catch by event "exit"';

    logger.error(content);
    alert.sms.send(type, content)
        .then(() => process.exit())
        .catch(() => process.exit());
});

process.on('SIGINT', () => {
    const type = 'alert';
    const content = 'process Home-center server down. Catch by event SIGINT';

    logger.error(content);
    alert.sms.send(type, content)
        .then(() => process.exit())
        .catch(() => process.exit());
});

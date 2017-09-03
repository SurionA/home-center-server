const CronJob = require('cron').CronJob;
const winston = require('winston');

module.exports = {
    start,
};

function start(hydrometriesArduino) {
    const task = new CronJob('0 0 * * * *',
        () => {
            hydrometriesArduino.save({ name: 'openweathermap', place_id: '6455259' })
                .then(localResources => winston.log('info', 'Home-center hydrometries CRON save local resources', localResources))
                .catch(err => winston.log('error', 'Home-center hydrometries CRON save local resources', err));
        },
        () => {
            winston.log('warning', 'Home-center hydrometries CRON save local resources EXIT task');
        },
        true);

    console.log('task running', task.running);
}

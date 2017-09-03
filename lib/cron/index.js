const CronJob = require('cron').CronJob;
const axios = require('axios');
const winston = require('winston');
const alert = require('../alert/index');

module.exports = {
    start,
};

function start(hydrometriesArduino) {
    const saveLocalHydrometriesTask = new CronJob('0 0 * * * *',
        () => {
            hydrometriesArduino.save({ name: 'openweathermap', place_id: '6455259' })
                .then(localResources => winston.log('info', 'Home-center hydrometries CRON save local resources', localResources))
                .catch(err => winston.log('error', 'Home-center hydrometries CRON save local resources', err));
        },
        () => {
            winston.log('warning', 'Home-center hydrometries CRON save local resources EXIT task');
        },
        true);

    const checkAliveApiServerTask = new CronJob('0,15,30,45 * * * *',
        () => {
            axios.get(process.env.HYDRMETRIES_API_URL)
                .then((res) => {
                    console.log('res', res.status);
                })
                .catch((err) => {
                    const type = 'alert';
                    const content = `Error ${(err.response && err.response.status) || err.code} on checkAlive ${process.env.HYDRMETRIES_API_URL}`;

                    console.log('err', err);
                    alert.sms.send(type, content);
                });
        },
        () => {
            winston.log('warning', 'Home-center hydrometries CRON checkAlive EXIT task');
        },
        true);

    console.log('saveLocalHydrometriesTask task running', saveLocalHydrometriesTask.running);
    console.log('checkAliveApiServerTask task running', checkAliveApiServerTask.running);
}

const CronJob = require('cron').CronJob;
const axios = require('axios');
const CONSTANTS = require('../constants');
const logger = require('../logger/index')(CONSTANTS.loggerLabelCron);
const alert = require('../alert/index');

module.exports = {
    start,
};

function start(hydrometriesArduino) {
    const saveLocalHydrometriesTask = new CronJob('30 0 * * * *',
        () => {
            hydrometriesArduino.save({ name: 'openweathermap', place_id: process.env.OPENWEATHERMAP_CITY_ID })
                .then(localResources => logger.log('info', 'Home-center hydrometries CRON save local resources', localResources))
                .catch(err => logger.log('error', 'Home-center hydrometries CRON save local resources', err));
        },
        () => {
            logger.log('warning', 'Home-center hydrometries CRON save local resources EXIT task');
        },
        true);

    const checkAliveApiServerTask = new CronJob('0,15,30,45 * * * *',
        () => {
            axios.get(process.env.HYDRMETRIES_API_URL)
                .then((res) => {
                    logger.info(`Check alive API ${process.env.HYDRMETRIES_API_URL} respond with status code: ${res.status}`);
                })
                .catch((err) => {
                    const type = 'alert';
                    const content = `Error ${(err.response && err.response.status) || err.code} on checkAlive ${process.env.HYDRMETRIES_API_URL}`;

                    logger.error(content, err);
                    alert.sms.send(type, content);
                });
        },
        () => {
            logger.log('warning', 'Home-center hydrometries CRON checkAlive EXIT task');
        },
        true);

    logger.info('saveLocalHydrometriesTask task running', saveLocalHydrometriesTask.running);
    logger.info('checkAliveApiServerTask task running', checkAliveApiServerTask.running);
}

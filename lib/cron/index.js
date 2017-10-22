const CronJob = require('cron').CronJob;
const axios = require('axios');
const CONSTANTS = require('../constants');
const { HClogger, HCalert: alert } = require('home-center-core');

const logger = HClogger(CONSTANTS.loggerLabelCron);

module.exports = {
    start,
};

function start(hydrometriesArduino) {
    const saveLocalHydrometriesTask = new CronJob(
        '30 0 * * * *',
        () => {
            hydrometriesArduino
                .save({ name: 'openweathermap', place_id: process.env.OPENWEATHERMAP_CITY_ID })
                .then(localResources => logger.log('info', 'Save local resources', localResources))
                .catch(err => logger.log('error', 'Save local resources', err));
        },
        () => {
            logger.log('warning', 'save local resources EXIT task');
        },
        true,
    );

    const checkAliveApiServerTask = new CronJob(
        '10 * * * * *',
        () => {
            axios
                .get(process.env.HYDROMETRIES_API_URL)
                .then((res) => {
                    logger.info(
                        `Check alive API ${process.env
                            .HYDROMETRIES_API_URL} respond with status code: ${res.status}`,
                    );
                })
                .catch((err) => {
                    const type = 'alert';
                    const content = `Error ${(err.response && err.response.status) ||
                        err.code} on checkAlive ${process.env.HYDROMETRIES_API_URL}`;

                    logger.error(content, err);
                    alert.sms.send(type, content);
                });
        },
        () => {
            logger.log('warning', 'checkAlive EXIT task');
        },
        true,
    );

    logger.info('saveLocalHydrometriesTask task running', saveLocalHydrometriesTask.running);
    logger.info('checkAliveApiServerTask task running', checkAliveApiServerTask.running);
}

const axios = require('axios');
const CONSTANTS = require('../constants');
const logger = require('../logger/index')(CONSTANTS.loggerLabelAlert);

module.exports = {
    send,
};

function send(type, content) {
    const message = getMessageFromTemplate(type, content);

    return axios.post('https://smsapi.free-mobile.fr/sendmsg', {
        user: process.env.FREE_USER,
        pass: process.env.FREE_TOKEN,
        msg: message,
    })
        .then((res) => {
            logger.info(`Send SMS type ${type} status code: ${res.status}`);
        })
        .catch((err) => {
            logger.error('Error while sending SMS:', (err.response && err.response.status) || err.code);
        });
}

function getMessageFromTemplate(type, content) {
    return `${type.toUpperCase()}:
${content}`;
}

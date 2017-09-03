const axios = require('axios');

module.exports = {
    send,
};

function send(type, content) {
    const message = getMessageFromTemplate(type, content);

    axios.post('https://smsapi.free-mobile.fr/sendmsg', {
        user: 33381694,
        pass: 'TFo6FfNlsa9Dcn',
        msg: message,
    });
}

function getMessageFromTemplate(type, content) {
    return `${type.toUpperCase()}:
${content}`;
}

const axios = require('axios');

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
            console.log('res', res.status);
        })
        .catch((err) => {
            console.log('res', (err.response && err.response.status) || err.code);
        });
}

function getMessageFromTemplate(type, content) {
    return `${type.toUpperCase()}:
${content}`;
}

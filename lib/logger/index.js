const { Container, transports, format } = require('winston');
const chalk = require('chalk');
const WrapLogger = require('./WrapLogger');

const { combine, timestamp, label, printf } = format;

const consoleFormat = printf((params) => {
    const options = Object.assign(params);
    let colorized;
    let messages = '';
    const labelFormat = `[${options.label}]`;

    (options.message || []).map((message) => {
        if (typeof message === 'object') {
            messages += `${message.stack} `;

            return message;
        }
        messages += `${JSON.stringify(message)} `;

        return message;
    });

    switch (options.level) {
        case 'info':
            colorized = chalk.greenBright;
            break;
        case 'debug':
            colorized = chalk.cyanBright;
            messages = chalk.cyan(messages)
            break;
        case 'verbose':
            colorized = chalk.blueBright;
            break;
        case 'warn':
            colorized = chalk.yellowBright;
            messages = chalk.yellow(messages)
            break;
        case 'error':
            colorized = chalk.redBright;
            messages = chalk.red(messages);
            break;

        default:
            colorized = message => message;
            break;
    }

    return `${new Date(options.timestamp).toLocaleString()} ${chalk.blueBright(labelFormat)} ${colorized(options.level.toUpperCase())}: ${messages}`;
});
const container = new Container();

module.exports = (name) => {
    if (container.has(name)) {
        return container.get(name);
    }

    container.add(name, {

        format: combine(
            label({ label: name }),
            timestamp(),
            format.json(),
        ),
        transports: [
            new transports.Console({
                level: process.env.NODE_ENV === 'DEV' ? 'debug' : 'info',
                format: combine(
                    label({ label: name }),
                    timestamp(),
                    format.splat(),
                    consoleFormat,
                ),
            }),
            new transports.File({
                filename: 'application.log',
                level: 'info',
            }),
            new transports.File({
                filename: 'errors.log',
                level: 'error',
            }),
        ],
    });

    const logger = container.get(name);

    return new WrapLogger(logger);
};

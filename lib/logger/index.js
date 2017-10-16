const { Container, transports } = require('winston');
const chalk = require('chalk');

const labels = [];
const container = new Container();

module.exports = (label) => {
    if (container.has(label)) {
        return container.get(label);
    }

    container.add(label, {
        transports:
        [
            new (transports.Console)({
                handleExceptions: false,
                level: process.env.NODE_ENV === 'DEV' ? 'debug' : 'info',
                timestamp: () => Date.now(),
                label,
                formatter: (options) => {
                    const params = Object.create(options);

                    params.message = params.message || '';
                    params.meta = params.meta || '';

                    if (params.meta && Object.keys(params.meta).length) {
                        params.message = params.meta.stack ? `${params.message} ${params.meta.stack}` : `${params.message} ${JSON.stringify(params.meta)}`;
                    }

                    return consoleFormat(params);
                },
            }),
            new (transports.File)({
                filename: 'application.log',
                handleExceptions: false,
                level: process.env.NODE_ENV === 'DEV' ? 'debug' : 'info',
                timestamp: () => Date.now(),
                label,
            }),
        ],
    });

    labels.push(label);

    const logger = container.get(label);

    logger.exitOnError = false;

    return logger;
};

function consoleFormat(options) {
    let colorized;

    switch (options.level) {
        case 'info':
            colorized = chalk.greenBright;
            break;
        case 'debug':
            colorized = chalk.blueBright;
            break;
        case 'verbose':
            colorized = chalk.cyanBright;
            break;
        case 'warn':
            colorized = chalk.yellowBright;
            break;
        case 'error':
            colorized = chalk.redBright;
            break;

        default:
            colorized = chalk.cyanBright;
            break;
    }

    return `${new Date(options.timestamp()).toLocaleString()} ${chalk.magentaBright('[' + options.label + ']')} ${colorized(options.level.toUpperCase())}: ${options.level === 'error' ? chalk.red(options.message) : options.message}`;
};

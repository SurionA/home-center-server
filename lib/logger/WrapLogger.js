class WrapLogger {
    constructor(logger) {
        this.logger = logger;
    }

    log(...params) {
        return this.logger.log(params);
    }

    info(...params) {
        return this.logger.info(params);
    }

    debug(...params) {
        return this.logger.debug(params);
    }

    warn(...params) {
        return this.logger.warn(params);
    }

    error(...params) {
        const extractParams = params.map(((param) => {
            if (typeof param !== 'object') {
                return param;
            }

            return Object.assign(param);
        }));

        return this.logger.error(extractParams);
    }
}

module.exports = WrapLogger;

const Config = require('../../constant/config');

class Logger {
    /**
     * 
     * @param {{config: Config, level: String}} param0 
     */
    constructor({config, level}) {
        this.winston = require('winston');
        const remoteLog = new this.winston.transports.Http({
            // host: 'localhost',
            port: config.server.port,
            path: '/logs/error'
        });
        const consoleLog = new this.winston.transports.Console({
            colorize: true,
            name: 'console',
            timestamp: () => (new Date()).toUTCString(),
           });
        const fileLog = new this.winston.transports.File({filename: `${__dirname}/../../../../public/logs`});
        this.level = level;

        this.errorLogger = this._errorInit(fileLog, consoleLog);
        this.infoLogger = this._infoInit(consoleLog);
    }

    /**
     * 
     * @param {String} message 
     */

    info = (message) => {
        this.infoLogger.info(message);
    }

    /**
     * 
     * @param {String} message 
     */
    debug = (message) => {
        if (process.env.NODE_ENV === 'development')
            console.log(message);
    }

    /**
     * 
     * @param {String} message 
     */
    error = (message) => {
        this.errorLogger.error(message);
    }

    /**
     * 
     * @param {String} message 
     */
    setUp = (message) => {
        console.log(message);
    }

    /**
     * 
     * @param {String} message 
     */
    inform = (message) => {
        if (process.env.NODE_ENV !== 'test'){
            console.log(message);
        }
    }

    /**
     * 
     * @param {{use: Function}} app
     */

    useExpressMonganMiddleWare = (app) => {
        let toggleColor = (message) => {
            if (message.search(' 200') > 0) {
                return '✅';
            }
            if (message.search(' 500') > 0) {
                return '❗';
            }
            if (message.search(' 201') > 0) {
                return '✅';
            }
            return '🔔';
        }
        
        const morgan = require('morgan');
        let middleWare = morgan(
            'tiny',
            {
                stream: {
                    write: (message) => this.winston.createLogger({
                        format: this.winston.format.combine(
                            this.winston.format.colorize(),
                            this.winston.format.label({label: `${toggleColor(message.trim())}`, message: true}),
                            this.winston.format.timestamp(),
                            this.winston.format.printf((info) => {
                                return `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.message}`;
                            })
                        ),
                        transports: [new this.winston.transports.Console({level: 'http'})],}).http(message.trim()),
                },
            }
        );
        app.use(middleWare);
    }

    _errorInit = (fileLog, consoleLog) => {
        return this.winston.createLogger({
            format: this.winston.format.combine(
                this.winston.format.timestamp({}),
                this.winston.format.label({label: "!!🐞", message: true}),
                this.winston.format.colorize(),
                this.winston.format.simple(),
                this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [${info.message}]`)
            ),
            transports: [
                consoleLog,
                fileLog
            ]
        })
    }

    _infoInit = (consoleLog) => {
        return this.winston.createLogger({
            format: this.winston.format.combine(
                this.winston.format.timestamp({}),
                // this.winston.format.label({label: "message ❗", message: true}),
                this.winston.format.colorize(),
                this.winston.format.simple(),
                this.winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
                this.winston.format.printf(info => `[${info.level}] ${(new Date(info.timestamp)).toUTCString()} ${info.filename} [ ${info.message} ]`)
            ),
            transports: [
                consoleLog
            ]
        })
    }
}

module.exports = Logger;
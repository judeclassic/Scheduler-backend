//@ts-check
const http = require('http');
const Logger = require('../logger/index')
const App = require('express')();

class Server {

    /**
     * 
     * @param {{app: App, port: string | Number, logger: Logger }} param0 
     */
    constructor({app, port, logger}) {
        this.http = http;
        this.app = app;
        this.port = port
        this.logger = logger;
    }

    production = (message) => {
        const port = process.env.PORT || this.port;
        this.server = this.http.createServer(this.app);
        this.server.listen(port, ()=> {
            this.isWorking = true;
            this.logger.info(`${message} mode on port ${port}`);
        });
    }

    development = (message) => {
        const port = process.env.PORT || this.port;
        this.server = this.http.createServer(this.app);
        this.server.listen(port, ()=> {
            this.isWorking = true;
            this.logger.info(`${message} on port ${port}`);
        });
    }

    close = () => {
        this.server.close();
        this.isWorking = false;
    }
}

module.exports = Server;
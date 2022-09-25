//@ts-check
const server = require("./src/lib/repositories/server");
const Logger = require("./src/lib/repositories/logger");
const DBConnection = require('./src/lib/repositories/DB');
const scheduleRouter = require('./src/routes/schedule');
const UserRouter = require('./src/routes/user');
const config = require('./src/lib/constant/config');

const port = config.server.port;
const dbUrl = config.db.host

const logger = new Logger({config, level: "MAIN APP"});

const dBConnection = new DBConnection(logger);

dBConnection.connect({config});

const callback = (route)=> {
    logger.useExpressMonganMiddleWare(route);
    scheduleRouter(route, logger);
    UserRouter(route, logger);
}

module.exports = server({logger, port, callback});
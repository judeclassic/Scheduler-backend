//@ts-check

const express = require('express');
const Router = express.Router()
const cors = require('cors');
const Server = require('./server');

const starter = ({logger, port, callback}) => {
    const app = express();

    app.use(cors());
    app.use(express.static('public'));

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json());

    const server = new Server({app, port, logger});
    process.env.NODE_ENV === 'production'
        ?
        server.production('Running on production')
        :
        server.development(`Running on ${process.env.NODE_ENV}`);

    callback(app);

    return {app, server};
}

module.exports = starter;
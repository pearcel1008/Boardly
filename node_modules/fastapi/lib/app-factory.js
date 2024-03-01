'use strict';

const Promise = require('bluebird');

module.exports = (config) => {

    config.log = typeof config.log === 'boolean' ? config.log : true;

    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');

    if (config.log) {
        if (config.id) {
            app.use(require('morgan')(`${config.id} :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`));
        } else {
            app.use(require('morgan')(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`));
        }
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        'extended': true
    }));

    for (let route in config.routes) {
        let appRoute = app.route(route);
        let methods = config.routes[route];
        for (let method in methods) {
            let routeFn = methods[method];
            appRoute[method](routeFn);
        }
    }

    return new Promise((resolve, reject) => {
        let server = app.listen(config.port, (err) => {
            if (err) return reject(err);
            console.log(`App is listening on port: ${config.port}`);
            return resolve(server);
        });
    });

};

'use strict';

const Err = require('./err');

module.exports = {
    'MissingConfigurationError': Err.extend('MissingConfigurationError', function() {
        console.log(`Unable to load configuration file: ${this.data}`);
    }),
    'InvalidPortError': Err.extend('InvalidPortError', function() {
        console.log(`Invalid port specified: ${this.data}`);
    })
};

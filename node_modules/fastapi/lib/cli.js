#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');
const Promise = require('bluebird');
const program = require('commander');
const assert = require('assert');
const path = require('path');
const errors = require('./errors');
const appFactory = require('./app-factory');
const _ = require('lodash');

program
    .version(pkg.version)
    .option('-c, --config <configuration file>', 'The path to a configuration file')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

program.config = path.resolve(program.config);

let config;

try {
    config = require(program.config);
} catch(e) {
    throw new errors.MissingConfigurationError(undefined, program.config);
}

config = _.isArray(config) ? config : [config];

Promise.resolve(config)
    .each(appFactory);

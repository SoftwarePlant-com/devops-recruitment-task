import logging from './logging';
import * as config from './config';
import {redis, postgres} from './db';
import { REPL_MODE_SLOPPY } from 'repl';

const path = require('path');

if (process.argv.length <= 2) {
    logging.error("No config file provided");
    logging.error(`USAGE: ${process.argv[0]} build/index.js config.json`);
    process.exit(1);
}

// Load config
const configPath: string = path.resolve('.', process.argv[2]);
const globalConfig = config.loadConfig(configPath);


logging.info(`Starting ${globalConfig.environment} server...`);

// Config validations
const hasRedis: boolean = config.has(globalConfig, 'redis');
const hasPostgres: boolean = config.has(globalConfig, 'postgres');

if (hasPostgres) {
    postgres.config(globalConfig.postgres);
} else {
    logging.warn(`Postgres credentials not set.`);
}

if (hasRedis) {
    redis.config(globalConfig.redis);
} else {
    logging.warn(`Redis credentials not set.`);
}

if (!hasPostgres || !hasRedis) {
    logging.warn('Credentials for one of the databases are missing.');
    logging.warn('In order to set up the credentials, edit the configuration file.');
    logging.warn('');
    logging.warn(`Example:`); 
    logging.warn(`${JSON.stringify({ development: { postgres: { user: "dbuser", host: "localhost", database: "db", password: "pass", port: 5432 }, redis: "..."}, production: "..."}, null, 4)}`);
}

if (!hasPostgres && !hasRedis) {
    logging.error('Exiting because no database credentials were provided.');
    process.exit(1);
}

// Handle SIGTERM
process.on('SIGTERM', () => {
    logging.info('SIGTERM received');
    process.exit(0);
});

// Start app
require('./app');
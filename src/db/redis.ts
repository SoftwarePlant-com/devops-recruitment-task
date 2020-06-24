import logging from '../logging';
import { DBConfig } from '../types';
const redis = require("redis");

let client;
let isReady = false;

const config = (config: DBConfig ) => {
	if (client) return;
    logging.info('Configuring pool');
    
    const params = {
        url: `redis://${config.host}:${config.port}/`,
        retry_strategy: () => 3000
    }
    client = redis.createClient(params);
    
    client.on('error', function(err) {
        isReady = false;
        logging.info('redis is not running');
        logging.info(err);
    });
    client.on('ready', function() {
        isReady = true;
        logging.info('redis is running');
    });
};

const set = function (...args: any[]) {
	if (!client) {
		logging.error('Redis module has no config');
	}
	logging.info('Setting value on redis');
	return client.set.apply(client, args);
};

const get = function (...args: any[]) {
	if (!client) {
		logging.error('Redis module has no config');
	}
	logging.info('Getting value from redis');
	return client.get.apply(client, args);
};

const redisCl = {
    config,
    set,
    get,
    isReady: () => client.connected ? true : false
};

export default redisCl;
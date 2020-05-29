import logging from '../logging';
import { DBConfig } from '../types';
const { Pool } = require('pg');

let pool;

const config = (config: DBConfig ) => {
	if (pool) return;
	logging.info('Configuring postgres pool');
	pool = new Pool(config);

	pool.on('error', (err, client) => {
		logging.error('Unexpected error on idle client');
		logging.error(err);
	})
};

const query = function (...args: any[]) {
	if (!pool) {
		logging.error('Postgres module has no config');
	}
	logging.info('Querying postgres');
	return pool.query.apply(pool, args);
};

const postgresCl = {
	config,
	query
};

export default postgresCl;
import logging from './logging';
import { redis, postgres } from './db';
import postgresCl from './db/postgres';

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send({ status: "OK", postgres_endpoint: "/postgres", redis_endpoint: "/redis"});
});

app.get('/postgres', (req, res) => {
    postgres.query('SELECT 1;', (err, resp) => {
        if (err) {
            logging.error('Error while processing postgres database');
            return res.send({ status: "FAIL"});
        }
        logging.info("Successfuly queried postgres");
        return res.send({ status: "OK", response: resp });
    });
});

app.get('/redis', async (req, res) => {

    if (redis.isReady()) {
        redis.set('foo', 'bar', (err) => {
            if (err) {
                logging.error(err);
                logging.error("Error while setting value on redis");
                return res.send({ status: "FAIL"});
            }
            redis.get('foo', (err, result) => {
                if (err) {
                    logging.error(err);
                    logging.error("Error while getting value from redis");
                    return res.send({ status: "FAIL"});
                }
                return res.send({ status: 'OK', value: result});
            });
        });
    } else {
        return res.send({ status: 'FAIL' })
    }
    
});

app.listen(PORT, () => {
    logging.info(`Server listening on port ${PORT} 🚀. Press Ctrl^C to exit...`);
});
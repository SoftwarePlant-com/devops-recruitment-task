import logging from '../logging';
import { EnvConfig, Config, DBConfig } from '../types';

export const loadConfig: (path: string) => EnvConfig = (path: string) => {
  try {
    const environment: keyof Config = process.env.NODE_ENV === 'production'? process.env.NODE_ENV : 'development';
    const config: Config = require(path);
    return {...config[environment], environment } as EnvConfig;
  } catch (e) {
    logging.error('Error while loading config');
    logging.error(e);
    process.exit(1);
  }
}

export const has: (config: EnvConfig, type: 'postgres' | 'redis') => boolean = (config: EnvConfig, type: 'postgres' | 'redis') => {
  const params: DBConfig = config[type];
  
  if (params && params.host && params.port) {
    return true;
  }
  
  return false;
}
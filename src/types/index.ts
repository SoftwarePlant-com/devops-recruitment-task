export interface DBConfig {
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
}

export interface EnvConfig {
    redis: DBConfig;
    postgres: DBConfig;
    environment: 'development' | 'production' 
}

export interface Config {
    production: EnvConfig;
    development: EnvConfig;
}
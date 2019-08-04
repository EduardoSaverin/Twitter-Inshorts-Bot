const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: __dirname+'/error.log', level: 'error' }),
        new winston.transports.File({ filename: __dirname+'/combined.log', level: 'info' })
    ],
    exitOnError: false
});

module.exports = logger;
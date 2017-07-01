const bunyan = require('bunyan');

const rootLogger = bunyan.createLogger({ name: 'WeatherService' });

class Logger {
  constructor() {
    this.logger = rootLogger;
  }

  info(message, metadata) {
    this.logger.info(metadata, message);
  }
}

module.exports = Logger;

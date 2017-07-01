const request = require('request-promise');
const config = require('./config');

class WeatherService {
  constructor(logger) {
    this.logger = logger;
  }

  getWeather(country, city) {
    this.logger.info('Getting weather information', { country, city });

    return request({
      uri: 'http://api.openweathermap.org/data/2.5/weather',
      qs: {
        q: `${city},${country}`,
        appid: config.getOpenWeatherMapAppId(),
      },
      json: true,
    });
  }
}

module.exports = WeatherService;

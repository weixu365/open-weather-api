const request = require('request-promise');

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
        appid: '4d703c2fcea2d3a8461da9cc30e69ef5',
      },
      json: true,
    });
  }
}

module.exports = WeatherService;

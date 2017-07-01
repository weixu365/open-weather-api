const chai = require('chai');
const WeatherService = require('../lib/WeatherService');
const Logger = require('../lib/Logger');

const expect = chai.expect;

describe('WeatherService integration test', function test() {
  this.timeout(5000);
  const logger = new Logger();

  it('should get weather info for a city', () => {
    const result = new WeatherService(logger).getWeather('au', 'melbourne');

    return result
      .then((response) => {
        expect(response.sys.country).equals('AU');
        expect(response.weather).be.an('array');
        expect(response.weather.length).at.least(1);
        expect(response.weather[0]).have.property('description');
      });
  });
});

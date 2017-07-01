const Bluebird = require('bluebird');
const chai = require('chai');
const request = require('supertest');
const server = require('../app');
const config = require('../lib/config');

const expect = chai.expect;

describe('Weather app rest api test', () => {
  let savedAppId = null;

  beforeEach(() => {
    savedAppId = config.getOpenWeatherMapAppId();
  });

  afterEach(() => {
    process.env.OpenWeatherAppId = savedAppId;
  });

  it('Should return 403 when api key not provided', () => {
    const result = request(server)
      .get('/weather/australia/melbourne');

    return result
      .expect(403);
  });

  it('Should return 401 when api key is invalid', () => {
    const result = request(server)
      .get('/weather/australia/melbourne')
      .set('Authorization', 'invalid-token');

    return result
      .expect(401);
  });

  it('Should return 200 when api key is valid', () => {
    const result = request(server)
      .get('/weather/australia/melbourne')
      .set('Authorization', 'test-api-key-fake');

    return result
      .expect(200)
      .then(response => expect(response.text).contains('weather'));
  });

  it('Should return 500 when error occurred', () => {
    process.env.OpenWeatherAppId = 'invalid-app-id';
    const result = request(server)
      .get('/weather/any/any')
      .set('Authorization', 'test-api-key-fake');

    return result
      .expect(500)
      .then(response => expect(response.body.message).equals('Internal Server Error'));
  });

  it('Should return rate limit information in header', () => {
    const result = request(server)
      .get('/weather/au/melbourne')
      .set('Authorization', `test-api-key-fake${new Date().getTime()}`);

    return result
      .expect(200)
      .expect('X-RateLimit-Limit', '5')
      .expect('X-RateLimit-Remaining', '4')
      .then((response) => {
        expect(response.body).have.property('weather');
      });
  });

  it('Should return 429 when requests exceeded rate limit', () => {
    const apiKey = `test-api-key-exceeded-${new Date().getTime()}`;

    return Bluebird.each([...new Array(5)], (item, index) => {
      const result = request(server)
        .get('/weather/au/melbourne')
        .set('Authorization', apiKey);

      return result
        .expect(200)
        .expect('X-RateLimit-Remaining', String(5 - index - 1))
        .then((response) => {
          expect(response.body).have.property('weather');
        });
    })
      .then(() => {
        const result = request(server)
          .get('/weather/au/melbourne')
          .set('Authorization', apiKey);

        return result
          .expect(429)
          .expect('X-RateLimit-Limit', '5')
          .expect('X-RateLimit-Remaining', '0')
          .then((response) => {
            expect(response.body.message).equals('Too many requests');
          });
      });
  });
});

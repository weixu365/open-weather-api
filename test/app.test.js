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
});

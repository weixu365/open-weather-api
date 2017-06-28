const chai = require('chai');
const RateLimit = require('../lib/RateLimit');

const expect = chai.expect;
const assert = chai.assert;

class ResponseStub {
  status(code) {
    this.statusCode = code;
    return this;
  }

  set(headers) {
    this.headers = Object.assign({}, this.headers, headers);
    return this;
  }

  json(obj) {
    this.body = obj;
  }
}

describe('RateLimit unit test', () => {
  const ONE_SECOND = 1 * 1000;
  const request = { headers: { authorization: 'testKey' } };
  let response;

  beforeEach(() => {
    response = new ResponseStub();
  });

  it('should return rate limit headers after received a request', (done) => {
    const rateLimit = new RateLimit({ maxRequests: 2, timeWindowInMs: ONE_SECOND });
    const now = new Date().getTime();

    rateLimit(request, response, () => {
      expect(response.headers['X-RateLimit-Limit']).equals(2);
      expect(response.headers['X-RateLimit-Remaining']).equals(1);
      expect(response.headers['X-RateLimit-Reset']).within(now + ONE_SECOND, now + ONE_SECOND + 1);
      done();
    });
  });

  it('should return 429 with rate limit headers after rate exceeded', (done) => {
    const rateLimit = new RateLimit({ maxRequests: 1, timeWindowInMs: ONE_SECOND });
    const now = new Date().getTime();

    rateLimit(request, response, () => {
      rateLimit(request, response, () => {
        assert.fail('Should not execute next method when rate exceeded');
      });

      expect(response.statusCode).equals(429);
      expect(response.headers['X-RateLimit-Limit']).equals(1);
      expect(response.headers['X-RateLimit-Remaining']).equals(0);
      expect(response.headers['X-RateLimit-Reset']).within(now + ONE_SECOND, now + ONE_SECOND + 1);
      expect(response.body).deep.equals({ message: 'Too many requests' });
      done();
    });
  });
});

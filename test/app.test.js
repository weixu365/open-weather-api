const chai = require('chai');
const request = require('supertest-as-promised');
const express = require('../app');

const expect = chai.expect;

describe('Weather server integration test', () => {
  it('Should return 403 when api key not provided', () => {
    const result = request(express)
      .get('/');

    return result
      .expect(403);
  });

  it('Should return 401 when api key is invalid', () => {
    const result = request(express)
      .get('/')
      .set('Authorization', 'invalid-token');

    return result
      .expect(401);
  });

  it('Should return 200 when api key is valid', () => {
    const result = request(express)
      .get('/')
      .set('Authorization', 'test-api-key-fake');

    return result
      .expect(200)
      .then(response => expect(response.text).contains('fake'));
  });
});

const chai = require('chai');
const request = require('supertest-as-promised');
const express = require('../app');

const expect = chai.expect;

describe('Weather server integration test', () =>{

  it('Should return 403 when api key not provided', () =>{
    return request(express)
      .get('/')
      .expect(403);
  });

  it('Should return 401 when api key is invalid', () =>{
    return request(express)
      .get('/')
      .set('Authorization', 'invalid-token')
      .expect(401);
  });

  it('Should return 200 when api key is valid', () =>{
    return request(express)
      .get('/')
      .set('Authorization', 'test-api-key-fake')
      .expect(200)
      .then(response => expect(response.text).contains('fake'));
  });
});

const PassportStrategy = require('passport-strategy');

class APIKeyStrategy extends PassportStrategy {
  constructor() {
    super();
    this.validKeyPrefix = 'test-api-key-';
    this.name = 'API Key';
  }

  verify(key) {
    if(key && key.startsWith(this.validKeyPrefix)){
      const clientId = key.substring(this.validKeyPrefix.length);

      return this.success({ clientId });
    }

    return this.fail(this.name, 401)
  }

  authenticate(request, options) {
    let apiKey = null;

    if(request.headers && request.headers.authorization){
      apiKey = request.headers.authorization;
    }

    if(!apiKey) {
      this.fail(this.name, 403);
    }

    this.verify(apiKey);
  }
}

module.exports = APIKeyStrategy;

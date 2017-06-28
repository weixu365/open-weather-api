const passport = require('passport');
const express = require('express');

const APIKeyStrategy = require('./lib/APIKeyStrategy');
const RateLimit = require('./lib/RateLimit');

const ONE_HOUR = 1 * 60 * 60 * 1000;

const apiKeyStrategy = new APIKeyStrategy();
passport.use(apiKeyStrategy);

const app = express();
app.use(passport.authenticate(apiKeyStrategy.name, { session: false }));
app.use(new RateLimit({ maxRequests: 5, timeWindowInMs: ONE_HOUR }));

app.get('/', (req, res) => {
  res.send(`Hello ${req.user.clientId}`);
});

app.listen(3000);

module.exports = app;

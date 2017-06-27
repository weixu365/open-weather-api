const passport = require('passport');
const express = require('express');

const APIKeyStrategy = require('./lib/APIKeyStrategy');

const apiKeyStrategy = new APIKeyStrategy();
passport.use(apiKeyStrategy);

const app = express();
app.use(passport.authenticate(apiKeyStrategy.name, { session: false }));

app.get('/', (req, res) => {
  res.send(`Hello ${req.user.clientId}`);
});

app.listen(3000);

module.exports = app;

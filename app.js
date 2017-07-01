const _ = require('lodash');
const passport = require('passport');
const express = require('express');

const Logger = require('./lib/Logger');
const APIKeyStrategy = require('./lib/APIKeyStrategy');
const RateLimit = require('./lib/RateLimit');
const WeatherService = require('./lib/WeatherService');

const ONE_HOUR = 1 * 60 * 60 * 1000;
const logger = new Logger();

const apiKeyStrategy = new APIKeyStrategy();
passport.use(apiKeyStrategy);

const app = express();
app.use(passport.authenticate(apiKeyStrategy.name, { session: false }));

const rateLimit = new RateLimit({ maxRequests: 5, timeWindowInMs: ONE_HOUR });
const weatherService = new WeatherService(logger);

app.get('/weather/:country/:city', rateLimit, (req, res, next) => {
  const country = req.params.country;
  const city = req.params.city;

  weatherService.getWeather(country, city)
    .then((result) => {
      const weather = _.get(result, 'weather[0].description', 'N/A');

      res.json({ weather });
    })
    .catch(next);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  logger.error('Error occurred', { error });
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3000);

module.exports = app;

/* eslint-disable no-console */
const bent = require('bent');
const jwt = require('jsonwebtoken');

const getJSON = bent('json');

const API_BASE = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.APP_ID}`;

let publicKeysCache;
let publicKeysExpiry;
const getPublicKeys = async () => {
  // get a fresh set if needed
  if (!publicKeysCache || publicKeysExpiry < Date.now()) {
    const resp = await getJSON('https://api.trello.com/1/resource/jwt-public-keys');
    publicKeysCache = resp.keys;
    // cache for 4 hours
    publicKeysExpiry = Date.now() + 14400000;
  }

  return publicKeysCache;
};

const decodeAndValidate = async (token) => {
  const publicKeys = await getPublicKeys();

  // the vast majority of the time, Trello will provide a single public key
  // but should Trello need to rotate our keys we may for brief periods serve
  // two public keys
  const errors = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of publicKeys) {
    try {
      return jwt.verify(token, key);
    } catch (err) {
      errors.push(err);
    }
  }

  // there are a variety of reasons it might not be valid
  // the JWT could be expired, or the signature could be invalid for example
  throw errors[0];
};

const fetchWeatherForecast = async (units, lang, latitude, longitude) => {
  // see: https://openweathermap.org/weather-data for more parameters
  const data = await getJSON(
    `${API_BASE}&units=${units}&lang=${lang}&lat=${latitude}&lon=${longitude}`
  );
  // we only care about a bit of the data
  const weather = {};
  weather.temp = data.main.temp;
  weather.wind = data.wind.speed;
  weather.conditions = data.weather[0].id;
  weather.icon = data.weather[0].icon;
  return weather;
};

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const { units, lang, latitude, longitude } = event.queryStringParameters;
    if (!units || !lang || !latitude || !longitude) {
      return { statusCode: 400, body: 'Bad request' };
    }

    const { authorization, referer } = event.headers;

    if (referer !== 'https://weather-power-up.netlify.app/') {
      console.log('Rejected request from referer', referer);
      return { statusCode: 403, body: 'Forbidden' };
    }

    let context;
    try {
      context = await decodeAndValidate(authorization);
    } catch (err) {
      console.log('Rejected request with invalid JWT', authorization);
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const forecast = await fetchWeatherForecast(units, lang, latitude, longitude);
    console.log('Fetched forecast for member', context.idMember);
    return {
      statusCode: 200,
      body: JSON.stringify(forecast),
      headers: {
        contentType: 'application/json; charset=utf-8',
      },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

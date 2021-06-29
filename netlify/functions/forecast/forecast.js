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

  console.log('Retrieved Trello public keys', publicKeysCache);
  return publicKeysCache;
};

const decodeAndValidate = async (token) => {
  // const publicKeys = await getPublicKeys();
  const publicKeys = [
    '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAx91oFFhiQ6IvvF3uidZO\nlqVvlyU90bJVLmR+gbIRJvCB+7m54PbYNgLBznRblJHCtzGAYhqiCRUeb+1nBLmu\nPG8FKbXL18YeIYUT2ykbcqNHd/Kj0HD2o6rBBMtU40a9DX6zzmm8eh7/80jLq6ZZ\n309YhalvWlQmKxDZFrH5A0eij/7lhAWUMXPpXD/++wvw6YrSaddIymEgO0g02Bhh\nA0Dq/UKwLyGzg3C4sgQkRjiuw2X8XoBobrFJhmUGD5M9rARGd8erh9bViiuyr73k\nTRVp4gutfZKL+Vsj4Ui27j/Rn+fV6EiPCNhNBsyAXyoB5YELjwSxZ6i8y80ZNTEF\nuPbEVbqEpygJAYAmgmsq/DRkWqOQWeIAToMVZjUXlefHhq7DzngyaeO6Tw5HBwJI\n+RmbzcTVPCyVT7qWDj8ON9+bBztOQNXB4bXcgI6bViRQwVcprutjDe5aQc8egmVl\nTlM4AILQEeJ8gW63Fdq7V4hfHiy+Z153idGyJ5/p/Yw5hyvUX0Brkc91PxpZqSNT\n/kRKzJyDS2mN2LX1uzyJVfCOS0piDNGyFefm3HbnZF4kL0wJQh8HnYMQRVM8eeEW\n7pOb6qSYZCTsNPUvbtcUGT5G3OjF6AIMKtXe233JOufoRWvFnZzBF2EvukFYcUO4\nLrjwCEYKPp4K3U9ufgpsk1kCAwEAAQ==\n-----END PUBLIC KEY-----',
  ];

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
      console.log(JSON.stringify(err));
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const forecast = await fetchWeatherForecast(units, lang, latitude, longitude);
    console.log('Fetched forecast for member', context.idMember);
    return {
      statusCode: 200,
      body: JSON.stringify(forecast),
      headers: {
        // note generally you wouldn't cache authenticated responses, but this
        // is just the weather not something private
        // 'Cache-Control': 'public, max-age=1800, immutable',
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

const { Promise } = window.TrelloPowerUp;

const clearCache = t => {
  if (t.memberCanWriteToModel('card')) {
    t.remove('card', 'shared', 'cache');
  }
};

const getCachedData = t =>
  Promise.all([t.card('coordinates'), t.get('card', 'shared', 'cache')]).spread((card, cache) => {
    if (!cache) {
      // nothing cached at the moment
      return null;
    }
    if (!card.coordinates) {
      // this card doesn't have a location, let's clear anything we may have cached
      clearCache(t);
      return null;
    }
    // this card does have coordinates and has some cached data
    if (!cache.expires || cache.expires <= Date.now()) {
      // the cached data has expired, we shouldn't use it
      clearCache(t);
      return null;
    }
    // the cache is still relevant (hasn't expired yet)
    const { latitude, longitude } = card.coordinates;
    const location = `${latitude}:${longitude}`;
    if (!cache.location || cache.location !== location) {
      // the location we have cached doesn't match the location of the card
      clearCache(t);
      return null;
    }
    // everything checks out, we have good cached data we can use
    return cache.weather;
  });

const cacheWeatherData = (t, coordinates, weatherData) => {
  // we can only cache it if the current Trello member has write access
  if (t.memberCanWriteToModel('card')) {
    const { latitude, longitude } = coordinates;
    const location = `${latitude}:${longitude}`;
    t.set('card', 'shared', {
      cache: {
        expires: Date.now() + 1000 * 60 * 30, // 30 minutes in the future
        location,
        weather: weatherData,
      },
    });
  }
};

// we don't want to accidentally make three requests to the weather API per card
// instead we will hold onto and reuse promises based on the id of the card
const weatherRequests = new Map();

const fetchWeatherData = t => {
  const idCard = t.getContext().card;
  if (weatherRequests.has(idCard)) {
    // we already have a request in progress for that card, let's reuse that
    return weatherRequests.get(idCard);
  }

  const weatherRequest = Promise.all([t.card('coordinates'), getCachedData(t)]).spread(
    (card, cache) => {
      if (!card.coordinates) {
        weatherRequests.delete(idCard);
        return null;
      }

      const { latitude, longitude } = card.coordinates;
      if (cache) {
        weatherRequests.delete(idCard);
        return cache;
      }

      // our card has a location, let's fetch the current weather
      const units = 'metric';
      // %%APP_ID%% is our openweathermapp appid which we store in an environment variable
      // see: https://openweathermap.org/weather-data for more parameters
      return fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=${units}&lat=${latitude}&lon=${longitude}&appid=%%APP_ID%%`
      )
        .then(response => response.json())
        .then(weatherData => {
          // we only care about a bit of the data
          const weather = {};
          weather.temp = weatherData.main.temp;
          weather.wind = weatherData.wind.speed;
          weather.conditions = weatherData.weather[0].main;
          weather.icon = weatherData.weather[0].icon;
          cacheWeatherData(t, card.coordinates, weather);
          weatherRequests.delete(idCard);
          return weather;
        });
    }
  );

  // store the outstanding request so it can be reused
  weatherRequests.set(idCard, weatherRequest);
  return weatherRequest;
};

const defaultUnit = locale => {
  if (locale === 'en-US') {
    return 'imperial';
  }
  return 'metric';
};

const getWeatherBadges = (t, opts) =>
  Promise.all([
    t.card('coordinates'),
    t.get('member', 'private', 'units', defaultUnit(opts.locale)),
  ]).spread((card, units) => {
    if (!card.coordinates) {
      // if the card doesn't have a location at all, we won't show any badges
      return [];
    }

    return [
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            let temperature = weatherData.temp;
            if (units === 'metric') {
              temperature = `${temperature.toFixed()} °C`;
            } else {
              temperature = `${(temperature * 1.8 + 32).toFixed()} °F`;
            }
            return {
              title: trello.localizeKey('temperature'),
              text: temperature,
              refresh: 30 * 60,
            };
          });
        },
      },
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            let windSpeed = weatherData.wind;
            if (units === 'metric') {
              windSpeed = `🌬️ ${windSpeed.toFixed()} kph`;
            } else {
              windSpeed = `🌬️ ${(windSpeed * 0.62).toFixed()} mph`;
            }
            return {
              title: trello.localizeKey('wind-speed'),
              text: windSpeed,
              refresh: 30 * 60,
            };
          });
        },
      },
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            return {
              title: trello.localizeKey('conditions'),
              icon: `https://openweathermap.org/img/w/${weatherData.icon}.png`,
              text: weatherData.conditions,
              refresh: 30 * 60,
            };
          });
        },
      },
    ];
  });

window.TrelloPowerUp.initialize(
  {
    // return an array of card badges for the given card
    'card-badges': getWeatherBadges,
    // return an array of card badges for the given card
    'card-detail-badges': getWeatherBadges,
    'show-settings': t => {
      return t.popup({
        title: t.localizeKey('weather-settings'),
        url: './settings.html',
      });
    },
  },
  {
    localization: {
      defaultLocale: 'en',
      supportedLocales: ['en', 'es'],
      resourceUrl: './{locale}.json',
    },
  }
);

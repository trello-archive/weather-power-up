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

const kelvinToFarhenheit = k => ((k - 273.15) * 1.8 + 32).toFixed();

const fetchWeatherData = t =>
  Promise.all([t.card('coordinates'), getCachedData(t)]).spread((card, cache) => {
    if (!card.coordinates) {
      return null;
    }

    const { latitude, longitude } = card.coordinates;
    if (cache) {
      return cache;
    }

    // our card has a location, let's fetch the current weather
    // %%APP_ID%% is our openweathermapp appid which we store in an environment variable
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=%%APP_ID%%`
    )
      .then(response => response.json())
      .then(weatherData => {
        // we only care about a bit of the data
        const weather = {};
        weather.temp = kelvinToFarhenheit(weatherData.main.temp);
        weather.wind = weatherData.wind.speed;
        weather.conditions = weatherData.weather[0].main;
        weather.icon = weatherData.weather[0].icon;
        cacheWeatherData(t, card.coordinates, weather);
        return weather;
      });
  });

const getWeatherBadges = t =>
  t.card('coordinates').then(card => {
    if (!card.coordinates) {
      return [];
    }

    return [
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            return {
              title: 'Temperature',
              text: `🌡 ${weatherData.temp} °F`,
              refresh: 30 * 60,
            };
          });
        },
      },
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            return {
              title: 'Wind Speed',
              text: `🌬️ ${weatherData.wind} knots`,
              refresh: 30 * 60,
            };
          });
        },
      },
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            return {
              title: 'Conditions',
              icon: `https://openweathermap.org/img/w/${weatherData.icon}.png`,
              text: weatherData.conditions,
              refresh: 30 * 60,
            };
          });
        },
      },
    ];
  });

window.TrelloPowerUp.initialize({
  // return an array of card badges for the given card
  'card-badges': t => getWeatherBadges(t),
  // return an array of card badges for the given card
  'card-detail-badges': t => getWeatherBadges(t),
});

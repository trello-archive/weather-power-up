const Promise = window.TrelloPowerUp.Promise;

const fetchWeatherData = function(t) {
  return Promise.all([t.card('coordinates'), t.get('card', 'shared')])
    .spread(function(card, cache) {
      if (!card.coordinates) {
        return null;
      }

      const { latitude, longitude } = card.coordinates;
      const location = `${latitude}:${longitude}`;
      if (cache && cache.location === location && cache.expires >= Date.now() && cache.weatherData) {
        console.log('Cache Hit', location);
        return cache.weatherData;
      }

      console.log('Cache Miss', location);
      // our card has a location, let's fetch the current weather
      return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=%%APP_ID%%`)
      .then(function(response) {
        return response.json();
      })
      .then(function(weatherData) {
        const freedomUnits = (weatherData.main.temp - 273.15) * 1.8 + 32;
        weatherData.main.formattedTemp = `${freedomUnits.toFixed()} °F`;
        if (t.memberCanWriteToModel('card')) {
          t.set('card', 'shared', {
            location: location,
            expires: Date.now() + (1000 * 60 * 30),
            weatherData,
          });
        }
        return weatherData;
      });
    });
};

const getWeatherBadges = function(t) {
  return t.card('coordinates')
  .then(function(card) {
    if (!card.coordinates) {
      return [];
    }

    return [{
      dynamic: function(t) {
        return fetchWeatherData(t)
        .then(function(weatherData) {
          return {
            title: 'Temperature',
            text: weatherData.main.formattedTemp,
            refresh: 30 * 60,
          };
        });
      }
    }, {
      dynamic: function(t) {
        return fetchWeatherData(t)
        .then(function(weatherData) {
          return {
            title: 'Wind Speed',
            text: `🌬️ ${weatherData.wind.speed} knots`,
            refresh: 30 * 60,
          };
        });
      }
    }, {
      dynamic: function(t) {
        return fetchWeatherData(t)
        .then(function(weatherData) {
          return {
            title: 'Conditions',
            icon: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
            text: weatherData.weather[0].main,
            refresh: 30 * 60,
          };
        });
      }
    }];
  })
};

window.TrelloPowerUp.initialize({
  'card-badges': function(t) {
    // return an array of card badges for the given card
    return getWeatherBadges(t);
  },
  'card-detail-badges': function(t) {
    // return an array of card badges for the given card
    return getWeatherBadges(t);
  },
});

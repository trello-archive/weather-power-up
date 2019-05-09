const fetchWeatherData = function(t) {
  return t.card('coordinates')
    .then(function(card) {
      if (card.coordinates) {
        const { latitude, longitude } = card.coordinates;
        // our card has a location, let's fetch the current weather
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=%%APP_ID%%`)
        .then(function(response) {
          return response.json();
        })
        .then(function(weatherData) {
          const freedomUnits = (weatherData.main.temp - 273.15) * 1.8 + 32;
          weatherData.main.formattedTemp = `${freedomUnits.toFixed()} °F`;
          return weatherData;
        });
      }
      return null;
    });
};

const getBadgesForWeatherData = function(weatherData) {
  if (weatherData == null) {
    return [];
  }
  return [{
    title: 'Temperature',
    text: weatherData.main.formattedTemp,
  }, {
    title: 'Wind Speed',
    text: `🌬️ ${weatherData.wind.speed} knots`,
  }, {
    title: 'Conditions',
    icon: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
    text: weatherData.weather[0].main,
  }]
};

window.TrelloPowerUp.initialize({
  'card-badges': function(t) {
    // return an array of card badges for the given card
    return fetchWeatherData(t)
    .then(function(weatherData) {
      const badges = getBadgesForWeatherData(weatherData);
      return badges;
    });
  },
  'card-detail-badges': function(t) {
    // return an array of card badges for the given card
    return fetchWeatherData(t)
    .then(function(weatherData) {
      const badges = getBadgesForWeatherData(weatherData);
      return badges;
    });
  },
});

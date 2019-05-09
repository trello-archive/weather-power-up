console.log('Hello World!');

window.TrelloPowerUp.initialize({
  'card-badges': function(t, opts) {
    // return an array of card badges for the given card
    return t.card('coordinates')
    .then(function(card) {
      console.log(card);
      if (card.coordinates) {
        const { latitude, longitude } = card.coordinates;
        // our card has a location, let's fetch the current weather
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=%%APP_ID%%`)
        .then(function(response) {
          return response.json();
        })
        .then(function(weatherData) {
          const freedomUnits = (weatherData.main.temp - 273.15) * 1.8 + 32;
          return [{
            text: `${freedomUnits} °F`,
          }, {
            text: `🌬️ ${weatherData.wind.speed} knots`,
          }, {
            icon: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
            text: weatherData.weather[0].main,
          }]
        });
      }
      return [];
    })
  }
});

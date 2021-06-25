const { Promise } = window.TrelloPowerUp;

const clearCache = (t) => {
  if (t.memberCanWriteToModel('card')) {
    t.remove('card', 'shared', 'cache');
  }
};

const getCachedData = (t) =>
  Promise.all([t.card('coordinates'), t.get('card', 'shared', 'cache')]).then(([card, cache]) => {
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

export default function fetchWeatherData(t, lang = 'en') {
  const idCard = t.getContext().card;
  if (weatherRequests.has(idCard)) {
    // we already have a request in progress for that card, let's reuse that
    return weatherRequests.get(idCard);
  }

  const weatherRequest = Promise.all([t.jwt(), t.card('coordinates'), getCachedData(t)]).then(
    ([jwt, card, cache]) => {
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
      return fetch(
        `/.netlify/functions/forecast?units=metric&lang=${lang}&latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
        .then((resp) => resp.json())
        .then((weatherData) => {
          cacheWeatherData(t, card.coordinates, weatherData);
          weatherRequests.delete(idCard);
          return weatherData;
        });
    }
  );

  // store the outstanding request so it can be reused
  weatherRequests.set(idCard, weatherRequest);
  return weatherRequest;
}

import { defaultUnitForLocale, celsiusToFahrenheit, kphToMph } from './modules/util';
import fetchWeatherData from './modules/api';
import localizationSettings from './modules/localizationSettings';

const { Promise } = window.TrelloPowerUp;
const REFRESH_INTERVAL = 1800; // 30 minutes in seconds

const getWeatherBadges = (t, opts) =>
  Promise.all([
    t.card('coordinates'),
    t.get('member', 'private', 'units', defaultUnitForLocale(opts.locale)),
  ]).spread((card, units) => {
    if (!card.coordinates) {
      // if the card doesn't have a location at all, we won't show any badges
      return [];
    }

    return [
      {
        dynamic(trello) {
          return fetchWeatherData(trello).then(weatherData => {
            let { temp } = weatherData;
            if (units === 'metric') {
              temp = `${temp.toFixed()} °C`;
            } else {
              temp = `${celsiusToFahrenheit(temp).toFixed()} °F`;
            }
            return {
              title: trello.localizeKey('temperature'),
              text: temp,
              refresh: REFRESH_INTERVAL,
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
              windSpeed = `🌬️ ${kphToMph(windSpeed).toFixed()} mph`;
            }
            return {
              title: trello.localizeKey('wind-speed'),
              text: windSpeed,
              refresh: REFRESH_INTERVAL,
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
              refresh: REFRESH_INTERVAL,
            };
          });
        },
      },
    ];
  });

window.TrelloPowerUp.initialize(
  {
    'card-badges': getWeatherBadges,
    'card-detail-badges': getWeatherBadges,
    'show-settings': t => {
      return t.popup({
        title: t.localizeKey('weather-settings'),
        url: './settings.html',
      });
    },
  },
  {
    localization: localizationSettings,
  }
);

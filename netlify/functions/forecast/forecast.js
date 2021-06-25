const bent = require('bent');

const getJSON = bent('json');

const API_BASE = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.APP_ID}`;

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
    const forecast = await fetchWeatherForecast(units, lang, latitude, longitude);
    return {
      statusCode: 200,
      body: JSON.stringify(forecast),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

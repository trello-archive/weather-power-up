// according to https://openweathermap.org/weather-conditions
export default function getConditionKey(id) {
  if (id >= 200 && id < 300) {
    return 'thunderstorm';
  }
  if (id < 400) {
    return 'drizzle';
  }
  if (id >= 500 && id < 600) {
    return 'rain';
  }
  if (id >= 600 && id < 700) {
    return 'snow';
  }
  if (id === 701) {
    return 'mist';
  }
  if (id === 711) {
    return 'smoke';
  }
  if (id === 721) {
    return 'haze';
  }
  if (id === 731) {
    return 'dust';
  }
  if (id === 741) {
    return 'fog';
  }
  if (id === 751) {
    return 'sand';
  }
  if (id === 761) {
    return 'dust';
  }
  if (id === 762) {
    return 'ash';
  }
  if (id === 771) {
    return 'squall';
  }
  if (id === 781) {
    return 'tornado';
  }
  if (id === 800) {
    return 'clear';
  }
  if (id > 800 && id < 810) {
    return 'clouds';
  }
  return null;
}

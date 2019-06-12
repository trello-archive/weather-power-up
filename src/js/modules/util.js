export function defaultUnitForLocale(locale) {
  if (locale === 'en-US') {
    return 'imperial';
  }
  return 'metric';
}

export function celsiusToFahrenheit(celsius) {
  return celsius * 1.8 + 32;
}

export function kphToMph(kph) {
  return kph * 0.62;
}

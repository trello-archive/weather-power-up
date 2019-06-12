const t = window.TrelloPowerUp.iframe({
  localization: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'es'],
    resourceUrl: './{locale}.json',
  },
});

const defaultUnit = locale => {
  if (locale === 'en-US') {
    return 'imperial';
  }
  return 'metric';
};

const metricBtn = document.getElementById('metric');
const imperialBtn = document.getElementById('imperial');

document.querySelectorAll('input[type=radio][name=units]').forEach(radioBtn => {
  radioBtn.addEventListener('change', e => {
    t.set('member', 'private', 'units', e.target.value);
  });
});

t.render(() => {
  return t.get('member', 'private', 'units', defaultUnit(window.locale)).then(unitPreference => {
    if (unitPreference === 'metric') {
      metricBtn.checked = true;
    } else {
      imperialBtn.checked = true;
    }
    t.sizeTo(document.body);
  });
});

const t = window.TrelloPowerUp.iframe();

const defaultUnit = locale => {
  if (locale === 'en-US') {
    return 'imperial';
  }
  return 'metric';
};

const metricBtn = document.getElementById('metric');
const imperialBtn = document.getElementById('imperial');

t.render(() => {
  return t
    .get('member', 'private', 'units', defaultUnit(t.getContext().locale))
    .then(unitPreference => {
      if (unitPreference === 'metric') {
        metricBtn.checked = true;
      } else {
        imperialBtn.checked = true;
      }
    });
});

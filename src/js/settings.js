import { defaultUnitForLocale } from './modules/util';
import localizationSettings from './modules/localizationSettings';

const t = window.TrelloPowerUp.iframe({
  localization: localizationSettings,
});

const metricBtn = document.getElementById('metric');
const imperialBtn = document.getElementById('imperial');

document.querySelectorAll('input[type=radio][name=units]').forEach(radioBtn => {
  radioBtn.addEventListener('change', e => {
    t.set('member', 'private', 'units', e.target.value);
  });
});

t.render(() => {
  t.localizeNode(document.body);
  return t
    .get('member', 'private', 'units', defaultUnitForLocale(window.locale))
    .then(unitPreference => {
      if (unitPreference === 'metric') {
        metricBtn.checked = true;
      } else {
        imperialBtn.checked = true;
      }
      t.sizeTo(document.body);
    });
});

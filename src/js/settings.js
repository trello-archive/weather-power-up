import { defaultUnitForLocale } from './modules/util';
import localizationSettings from './modules/localizationSettings';

const t = window.TrelloPowerUp.iframe({
  localization: localizationSettings,
});

// setup event listeners on radio buttons to save preferences when they change
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
      const unitBtn = document.querySelector(`input[type=radio][value=${unitPreference}]`);
      if (unitBtn) {
        unitBtn.checked = true;
      }
      t.sizeTo(document.body);
    });
});

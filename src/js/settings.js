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

// setup event listeners on the display settings checkboxes
document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
  checkbox.addEventListener('change', e => {
    if (e.target.checked) {
      t.remove('board', 'shared', e.target.value);
    } else {
      t.set('board', 'shared', e.target.value, false);
    }
  });
});

t.render(() => {
  t.localizeNode(document.body);
  return t.getAll().then(data => {
    // select the currently selected unit preference
    let unitPreference = defaultUnitForLocale(window.locale);
    if (data && data.member && data.member.private && data.member.private.units) {
      unitPreference = data.member.private.units;
    }
    const unitBtn = document.querySelector(`input[type=radio][value=${unitPreference}]`);
    if (unitBtn) {
      unitBtn.checked = true;
    }
    // select the currently selected display preferences
    document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
      /* eslint-disable no-param-reassign */
      if (data && data.board && data.board.shared && data.board.shared[checkbox.value] === false) {
        checkbox.checked = false;
      } else {
        checkbox.checked = true;
      }
      /* eslint-enable no-param-reassign */
    });
    // ensure that our popup is properly sized to fit our content
    t.sizeTo(document.body);
  });
});

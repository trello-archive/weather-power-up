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
    t.set('board', 'shared', e.target.value, e.target.checked);
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
    if (data && data.board && data.board.shared) {
      // potentially some display overrides
      Object.keys(data.board.shared).forEach(pref => {
        const checkbox = document.querySelector(`input[type=checkbox][value=${pref}]`);
        if (checkbox && checkbox.checked !== data.board.shared.pref) {
          checkbox.checked = data.board.shared.pref;
        }
      });
    }
    // ensure that our popup is properly sized to fit our content
    t.sizeTo(document.body);
  });
});

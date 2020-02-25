const { Promise } = window.TrelloPowerUp;
const REFRESH_INTERVAL = 1800;

const getEstimateBadgesDetails = (t, opts) =>
  Promise.all([
    t.get('card', 'shared', 'remainingDev'),
    t.get('card', 'shared', 'remainingQa'),
    t.get('card', 'shared', 'remainingGp'),
    t.get('card', 'shared', 'remainingUx')
  ]).then(([remainingDev, remainingQa, remainingGp, remainingUx]) => {
    const badgeEstimateDev = {
      dynamic(t) {
        return {
          title: 'Estimativa DEV',
          text: remainingDev || 'Não estimado',
          color: isEmpty(remainingDev) ? 'red' : remainingDev === "0" ? 'green' : 'blue',
          callback: function (t) {
            return t.popup({
              title: "Estimativa Dev",
              url: 'estimateDev.html',
            });
          }
        };
      },
    };

    const badgeEstimateQa = {
      dynamic(t) {
        return {
          title: 'Estimativa QA',
          text: remainingQa || 'Não estimado',
          align: 'center',
          color: isEmpty(remainingQa) ? 'red' : remainingQa === "0" ? 'green' : 'blue',
          callback: function (t) {
            return t.popup({
              title: "Estimativa QA",
              url: 'estimateQa.html',
            });
          }
        };
      },
    };

    const badgeEstimateGp = {
      dynamic(t) {
        return {
          title: 'Estimativa GP',
          text: remainingGp || 'Não estimado',
          color: isEmpty(remainingGp) ? 'red' : remainingGp === "0" ? 'green' : 'blue',
          callback: function (t) {
            return t.popup({
              title: "Estimativa GP",
              url: 'estimateGp.html',
            });
          }
        };
      },
    };

    const badgeEstimateUx = {
      dynamic(t) {
        return {
          title: 'Estimativa UX-UI',
          text: remainingUx || 'Não estimado',
          color: isEmpty(remainingUx) ? 'red' : remainingUx === "0" ? 'green' : 'blue',
          callback: function (t) {
            return t.popup({
              title: "Estimativa UX-UI",
              url: 'estimateUx.html',
            });
          }
        };
      },
    };

    let badges = [];

    badges.push(badgeEstimateDev);
    badges.push(badgeEstimateQa);
    badges.push(badgeEstimateGp);
    badges.push(badgeEstimateUx);

    return badges;
  });

const getEstimateBadges = (t, opts) =>
  Promise.all([
    t.get('card', 'shared', 'remainingDev'),
    t.get('card', 'shared', 'remainingQa'),
    t.get('card', 'shared', 'remainingGp'),
    t.get('card', 'shared', 'remainingUx')
  ]).then(([remainingDev, remainingQa, remainingGp, remainingUx]) => {
    var GREY_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717';
    var WHITE_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182';

    const badgeEstimateDev = {
      dynamic(t) {
        return {
          icon: isEmpty(remainingDev) ? WHITE_ROCKET_ICON : GREY_ROCKET_ICON,
          text: remainingDev || 'Não estimado',
          color: isEmpty(remainingDev) ? 'red' : remainingDev === "0" ? 'green' : 'blue',
        };
      },
    };

    const badgeEstimateQa = {
      dynamic(t) {
        return {
          icon: isEmpty(remainingQa) ? WHITE_ROCKET_ICON : GREY_ROCKET_ICON,
          text: remainingQa || 'Não estimado',
          color: isEmpty(remainingQa) ? 'red' : remainingQa === "0" ? 'green' : 'blue',
        };
      },
    };

    const badgeEstimateGp = {
      dynamic(t) {
        return {
          // title: 'GP',
          icon: isEmpty(remainingGp) ? WHITE_ROCKET_ICON : GREY_ROCKET_ICON,
          text: remainingGp || 'Não estimado',
          color: isEmpty(remainingGp) ? 'red' : remainingGp === "0" ? 'green' : 'blue',
        };
      },
    };

    const badgeEstimateUx = {
      dynamic(t) {
        return {
          icon: isEmpty(remainingUx) ? WHITE_ROCKET_ICON : GREY_ROCKET_ICON,
          text: remainingUx || 'Não estimado',
          color: isEmpty(remainingUx) ? 'red' : remainingUx === "0" ? 'green' : 'blue',
        };
      },
    };

    let badges = [];

    badges.push(badgeEstimateDev);
    badges.push(badgeEstimateQa);
    badges.push(badgeEstimateGp);
    badges.push(badgeEstimateUx);
    return badges;
  });

function isEmpty(val) {
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}

window.TrelloPowerUp.initialize(
  {
    'card-badges': getEstimateBadges,
    'card-detail-badges': getEstimateBadgesDetails,
    'show-settings': t => {
      return t.popup({
        title: t.localizeKey('weather-settings'),
        url: 'settings.html',
        height: 281,
      });
    },
  }
);

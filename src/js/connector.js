const { Promise } = window.TrelloPowerUp;
const REFRESH_INTERVAL = 1800;

const getWeatherBadges = (t, opts) =>
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

function isEmpty(val) {
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}

var GREY_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717';
var WHITE_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182';

window.TrelloPowerUp.initialize(
  {
    'card-buttons': function (t, options) {
      return [{
        icon: 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'Estimate Size',
        callback: function (t) {
          return t.popup({
            title: "Estimation",
            url: 'estimate.html'
          });
        }
      }];
    },
    'card-badges': function (t, options) {
      return t.get('card', 'shared', 'estimate')
        .then(function (estimate) {
          return [{
            icon: estimate ? GREY_ROCKET_ICON : WHITE_ROCKET_ICON,
            text: estimate || 'No Estimate!',
            color: estimate ? null : 'red',
          }];
        });
    },
    'card-detail-badges': getWeatherBadges,
    'show-settings': t => {
      return t.popup({
        title: t.localizeKey('weather-settings'),
        url: 'settings.html',
        height: 281,
      });
    },
  }
);

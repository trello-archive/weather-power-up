const { Promise } = window.TrelloPowerUp;
const REFRESH_INTERVAL = 1800;

const getWeatherBadges = (t, opts) =>
  Promise.all([
    t.get('card', 'shared', 'remainingDev'),
    t.get('card', 'shared', 'remainingQa'),
    t.get('card', 'shared', 'remainingGp'),
    t.get('card', 'shared', 'remainingUx')
  ]).then(([remainingDev, remainingQa, remainingGp, remainingUx]) => {
    console.log('remainingDev1: ' + remainingDev);
    console.log('remainingQa1: ' + remainingQa);
    console.log('remainingGp1: ' + remainingGp);
    console.log('remainingUx1: ' + remainingUx);
    // return [{

    // },
    // {
    //   title: 'Estimativa QA',
    //   text: remainingQa || 'Não Estimado',
    //   // color: remainingQa === undefined ? 'red' : remainingQa === 0 ? 'grenn' : 'blue',
    //   callback: function (t) {
    //     return t.popup({
    //       title: "Estimativa QA",
    //       url: 'estimateQa.html',
    //     });
    //   }
    // },
    // {
    //   title: 'Estimativa GP',
    //   text: remainingGp || 'Não estimado',
    //   // color: remainingGp === undefined ? 'red' : remainingGp === 0 ? 'grenn' : 'blue',
    //   callback: function (t) {
    //     return t.popup({
    //       title: "Estimativa GP",
    //       url: 'estimateGp.html',
    //     });
    //   }
    // },
    // {
    //   title: 'Estimativa UX-UI',
    //   text: remainingUx || 'Não estimado',
    //   // color: remainingUx === undefined ? 'red' : remainingUx === 0 ? 'grenn' : 'blue',
    //   callback: function (t) {
    //     return t.popup({
    //       title: "Estimativa UX-UI",
    //       url: 'estimateUx.html',
    //     });
    //   }
    // }]

    const badgeEstimateDev = {
      dynamic(t) {
        return {
          title: 'Estimativa DEV',
          text: remainingDev || 'Não estimado',
          // color: remainingDev === undefined ? 'red' : remainingDev === 0 ? 'grenn' : 'blue',
          callback: function (t) {
            return t.popup({
              title: "Estimativa Dev",
              url: 'estimateDev.html',
            });
          }
        };
      },
    };

    let badges = [];

    badges.push(badgeEstimateDev)
    return badges;
  });

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

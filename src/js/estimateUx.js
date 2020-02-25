var trello = window.TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function (event) {
    event.preventDefault();
    debugger;
    return trello.set('card', 'shared', 'estimateUx', window.estimateUx.value)
        .then(function () {
            trello.set('card', 'shared', 'doneUx', window.doneUx.value)
                .then(function () {
                    trello.set('card', 'shared', 'remainingUx', window.remainingUx.value)
                        .then(function () {
                            trello.closePopup();
                        })
                })
        });
});

trello.render(function () {
    return trello.get('card', 'shared', 'estimateUx')
        .then(function (estimateUx) {
            if(estimateUx === undefined)
                estimateUx = null;
            window.estimateUx.value = estimateUx;
        })
        .then(function () {
            trello.get('card', 'shared', 'doneUx')
                .then(function (doneUx) {
                    if(doneUx === undefined)
                        doneUx = null;
                    window.doneUx.value = doneUx;
                }).then(function () {
                    trello.get('card', 'shared', 'remainingUx')
                        .then(function (remainingUx) {
                            if(remainingUx == undefined)
                                remainingUx = null;
                            window.remainingUx.value = remainingUx
                        })
                        .then(function () {
                            trello.sizeTo('#estimate').done();
                        })
                })
        });
});
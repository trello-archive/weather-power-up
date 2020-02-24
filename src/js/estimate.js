var trello = window.TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function (event) {
    // Stop the browser trying to submit the form itself.
    event.preventDefault();
    debugger;
    return trello.set('card', 'shared', 'estimateDev', window.estimateDev.value)
        .then(function () {
            trello.set('card', 'shared', 'doneDev', window.doneDev.value)
                .then(function () {
                    trello.set('card', 'shared', 'remainingDev', window.remainingDev.value)
                        .then(function () {
                            trello.closePopup();
                        })
                })
        });
});


trello.render(function () {
    return trello.get('card', 'shared', 'estimateDev')
        .then(function (estimateDev) {
            if(estimateDev === undefined)
                estimateDev = 0;
            window.estimateDev.value = estimateDev;
        })
        .then(function () {
            trello.get('card', 'shared', 'doneDev')
                .then(function (doneDev) {
                    if(doneDev === undefined)
                        doneDev = 0;
                    window.doneDev.value = doneDev;
                }).then(function () {
                    trello.get('card', 'shared', 'remainingDev')
                        .then(function (remainingDev) {
                            if(remainingDev == undefined)
                                remainingDev = 0;
                            window.remainingDev.value = remainingDev
                        })
                        .then(function () {
                            trello.sizeTo('#estimate').done();
                        })
                })
        });
});
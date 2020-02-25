var trello = window.TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function (event) {
    event.preventDefault();
    debugger;
    return trello.set('card', 'shared', 'estimateGp', window.estimateGp.value)
        .then(function () {
            trello.set('card', 'shared', 'doneGp', window.doneGp.value)
                .then(function () {
                    trello.set('card', 'shared', 'remainingGp', window.remainingGp.value)
                        .then(function () {
                            trello.closePopup();
                        })
                })
        });
});

trello.render(function () {
    return trello.get('card', 'shared', 'estimateGp')
        .then(function (estimateGp) {
            if(estimateGp === undefined)
                estimateGp = null;
            window.estimateGp.value = estimateGp;
        })
        .then(function () {
            trello.get('card', 'shared', 'doneGp')
                .then(function (doneGp) {
                    if(doneGp === undefined)
                        doneGp = null;
                    window.doneGp.value = doneGp;
                }).then(function () {
                    trello.get('card', 'shared', 'remainingGp')
                        .then(function (remainingGp) {
                            if(remainingGp == undefined)
                                remainingGp = null;
                            window.remainingGp.value = remainingGp
                        })
                        .then(function () {
                            trello.sizeTo('#estimate').done();
                        })
                })
        });
});
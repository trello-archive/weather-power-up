var trello = window.TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function (event) {
    event.preventDefault();
    debugger;
    return trello.set('card', 'shared', 'estimateQa', window.estimateQa.value)
        .then(function () {
            trello.set('card', 'shared', 'doneQa', window.doneQa.value)
                .then(function () {
                    trello.set('card', 'shared', 'remainingQa', window.remainingQa.value)
                        .then(function () {
                            trello.closePopup();
                        })
                })
        });
});

trello.render(function () {
    return trello.get('card', 'shared', 'estimateQa')
        .then(function (estimateQa) {
            if(estimateQa === undefined)
                estimateQa = null;
            window.estimateQa.value = estimateQa;
        })
        .then(function () {
            trello.get('card', 'shared', 'doneQa')
                .then(function (doneQa) {
                    if(doneQa === undefined)
                        doneQa = null;
                    window.doneQa.value = doneQa;
                }).then(function () {
                    trello.get('card', 'shared', 'remainingQa')
                        .then(function (remainingQa) {
                            if(remainingQa == undefined)
                                remainingQa = null;
                            window.remainingQa.value = remainingQa
                        })
                        .then(function () {
                            trello.sizeTo('#estimate').done();
                        })
                })
        });
});
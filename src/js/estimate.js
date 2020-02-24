var trello = window.TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function (event) {
    // Stop the browser trying to submit the form itself.
    event.preventDefault();
    return trello.set('card', 'shared', 'estimate', window.estimateSize.value)
        .then(function () {
            trello.closePopup();
        });
});

trello.render(function () {
    return trello.get('card', 'shared', 'estimate')
        .then(function (estimate) {
            alert(estimate);
            window.estimateSize.value = estimate;
        })
        .then(function () {
            trello.sizeTo('#estimate').done();
        });
});
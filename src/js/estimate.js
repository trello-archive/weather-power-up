var trello = TrelloPowerUp.iframe();

window.estimate.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  return trello.set('card', 'shared', 'estimate', window.estimateSize.value)
  .then(function(){
    trello.closePopup();
  });
});

trello.render(function(){
    trello.sizeTo('#estimate').done();
});
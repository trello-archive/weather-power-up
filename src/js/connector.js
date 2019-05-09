console.log('Hello World!');

window.TrelloPowerUp.initialize({
  'card-badges': function(t, opts) {
    // return an array of card badges for the given card
    return t.card('all')
    .then(function(card) {
      console.log(card);
      return [{
        text: card.idShort
      }];
    })
  }
});

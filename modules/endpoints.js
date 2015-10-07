module.exports = (function(app, kimono, fgApi, config, utils) {

  app.get('/', function(req, res) {
    if (config.debug) {
      res.send(config);
    } else {
      res.status(501).end();
    }
  });
  app.post('/update', function(req, res) {
    console.log('Update started...');

    //Get players from Kimono
    kimono.get_players(function(err, k_players) {
      handleResponse(err, k_players, utils.const.firebase.PLAYERS);
    });

    //Get votes from Kimono
    kimono.get_votes(function(err, k_votes) {
      handleResponse(err, k_votes, utils.const.firebase.VOTES);
    });

    //Handle the kimono response preparing the data and posting them on Firebase
    function handleResponse(err, response, api_name) {
      if (err) {
        console.log('Kimono error: ' + err);
        res.status(500).end();
      } else {
        res.status(200).end();
        console.log('Posting %s to Firebase...', api_name);
        fgApi.child(api_name).set(JSON.parse(response));
      }
    }

    console.log('Posting APIs info to Firebase...');
    fgApi.child(utils.const.firebase.INFO).set({
      last_update: (new Date()).toGMTString()
    });
  });
});

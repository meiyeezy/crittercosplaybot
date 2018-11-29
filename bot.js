// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running. Go to: https://www.twitter.com/critcosplaybot to see!'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP

var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var retweet = function() {
    var params = {
        q: '#criticalrolecosplay filter:media', 
        count: 5
    }

Twitter.get('search/tweets', params, function(err, data, response) {
    if(!err){
        for (var i = 0; i < data.statuses.length; i++) {
        var tweet = data.statuses[i];
            if (typeof tweet != 'undefined') { //tweet exists 
                Twitter.post('statuses/retweet/:id', {id: tweet.id_str}, function(err, response) { //retweet tweet
                    if (err) { //if duplicate tweet, error found
                        console.log(err.message);
                    } else {
                        let username = response.user.screen_name;
                        let tweetId = response.id_str;
                        console.log('Retweeted: ', `https://twitter.com/${username}/status/${tweetId}`)
                    } 
                });
            } else {          
                //couldn't find random tweet
                console.log(err.message);
        } }
    } else {
        console.log(err.message); //usually rate limit exceeded
    }
  })
} 

//TODO: push to heroku
retweet();
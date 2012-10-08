var ui = require('ui');

var speaker = arguments[0];

var photo = speaker.photo ? speaker.photo : '/img/profile/no-profile-pic.png';
var name = speaker.field_first_name.und[0].value + ' ' + speaker.field_last_name.und[0].value;

Ti.App.fireEvent('analytics:trackPageview', {url: 'Participant / ' + name}); 

$.speakerTopView.backgroundColor = speaker.color;
$.name.text = name;
$.iconImage.image = photo;
$.title.text = speaker.field_position_title.und[0].value;
try {
  $.biography.text = (speaker.field_bio) ? speaker.field_bio.und[0].value : 'n/a';
} catch(e) {
  $.biography.text = 'n/a';
}
var twitter = false;
try {
  twitter = (speaker.field_twitter) ? speaker.field_twitter.und[0].value : false;
} catch(e) {
  twitter = false;
}

if (twitter) {
  var tweets = require('tweets');
  tweets.getTweets(twitter, function(e) {
    if (e.success) {
      $.tweets.add(e.tweets);
      $.tweets.height = e.tweets.height;
    } else {
      ui.alert('networkGenericErrorTitle', 'tweetsNetworkError');
    }
  });
} else {
  $.tweetsLabel.visible = false;
  $.tweets.visible = false;
}

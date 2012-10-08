Ti.App.fireEvent('analytics:trackPageview', {url: ' Alerts / Home'}); 

var ui = require('ui');
var tweets = require('tweets');

var screename = 'DigitalHubCincy';
var tweetsContainer = false;

$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

tweets.getTweets(screename, function(e) {
  $.index.remove($.loading.getView());
  if (e.success) {
    tweetsContainer = e.tweets;
    $.tweets.add(tweetsContainer);
  } else {
    ui.alert('networkGenericErrorTitle', 'tweetsNetworkError');
  }
});

$.on('refresh', function(e) {
  Ti.API.info("Tweets Refresh");
  $.index.add($.loading.getView());
  tweets.getTweets(screename, function(e) {
    $.index.remove($.loading.getView());
    if (e.success) {
      if (tweetsContainer) {
        $.tweets.remove(tweetsContainer);
      }
      tweetsContainer = e.tweets;
      $.tweets.add(tweetsContainer);
    } else {
      ui.alert('networkGenericErrorTitle', 'tweetsNetworkError');
    }
  });
})

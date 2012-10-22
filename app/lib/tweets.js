var moment = require('moment');

exports.getTweets = function(screename,_cb,limit,style){
  var count = limit || 50;
  var css = style || 'body {font-family: HelveticaNeue;font-size: 12px;color: #fff;background-color: #303536;}\
      a {color: #86d4e0;text-decoration: none;}\
      .user {font-weight: bold;float: left;}\
      .created {font-size: smaller;color: #ccc;padding-right: 5px;float: right;}\
      .avatar {width: 35px; height: 35px; padding-left: 10px;float: left;}\
      .tweet {padding-left: 60px;min-height: 40px;}\
      hr {clear: both;color: #4f5252;background-color: #4f5252;margin: 5px 0 10px;border: 0;width: 100%;height: 1px;}';

  var hr = '<hr />'; 
  var baseCSS = '<html><head><style type="text/css">' + css + '</style></head><body>';
  var endCSS = '</body></html>';
  
  function parseTweetToHTML(text) {
    var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    var hashTagRegex = /#([^ ]+)/gi;
    var mentionRegex = /@([^ ]+)/gi;
    text  = text.replace(urlRegex, '<a href="$1">$1</a>');
    text  = text.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>');
    text  = text.replace(mentionRegex, '<a href="http://twitter.com/#!/search?q=%40$1">@$1</a>');
    return text;
  }
  
  var http = Ti.Network.createHTTPClient({
    onload : function() {
      //try {
        var html = baseCSS;
        var tweets = JSON.parse(this.responseText);
        if (!tweets || !tweets.length) {
          _cb({
            success : false,
            error : "No tweets found"
          });
          return;
        }
        var androidContainer = Ti.UI.createView({layout:'vertical'});
        for (var key in tweets) {
          var tweet = tweets[key];
          var now = moment();
          var created = moment(tweet.created_at)
          var ago = created.from(now);
          if (OS_IOS && false) {
            var image = '<img src="' + tweet.user.profile_image_url + '" class="avatar" />';
            var message =image 
              + '<div class="tweet">' 
                + '<div class="meta">'
                  + '<div class="created">' + ago + '</div>'
                  + '<div class="user">' + tweet.user.screen_name + '</div>'
                + '</div><br/>'
                + '<div class="content">' + parseTweetToHTML(tweet.text) + '</div>' 
              + '</div>' 
              + hr;
            html += message;
          
          } else {
            var post_view = Ti.UI.createView({
              backgroundColor: '#303536',
              width: Ti.UI.FILL,
              height: '65dp',
              left : '0dp',
              top : '0dp',
              bottom : '0dp',
              right : '0dp',
              layout : 'horizontal',
            });


            var av = Ti.UI.createImageView({
              image : tweet.user.profile_image_url,
              left : '7dp',
              top : '7dp',
              bottom : '7dp',
              height : '45dp',
              width : '45dp'
            });
            // Add the avatar image to the view
            post_view.add(av);

            var tweet_text = Ti.UI.createLabel({
              text : tweet.text,
              top : '7dp',
              left : '10dp',
              right : '5dp',
              textAlign : 'left',
              color : '#fff',
              font : {
                fontSize : '13dp'
              }
            });
            // Add the tweet to the view
            post_view.add(tweet_text);
            androidContainer.add(post_view);
            var hr = Ti.UI.createView({  
              backgroundColor: '#000',
              backgroundRepeat : true,
              width: Ti.UI.FILL,
              height : '1dp'});
            androidContainer.add(hr);  
          }
        }
        html += endCSS;
        
        if (OS_IOS && false) {
          var StyledLabel = require('ti.styledlabel');
          var label = StyledLabel.createLabel({
            height : Ti.UI.SIZE || 'auto',
            top : 10,
            right : 5,
            bottom : 10,
            left : 5,
            html : html
          });
          label.addEventListener('click', function(evt) {
            Ti.App.fireEvent("tweets:click", evt);
          });
          _cb({
            success : true,
            tweets : label
          });
        } else {
          _cb({
            success : true,
            tweets : androidContainer
          });
        }

      /*} catch(err) {
        //alert(err);
        _cb({
          success : false,
          error : err
        });
      }*/
    },
    onerror : function(evt) {
      _cb({
        success : false,
        error : evt
      });
    }
  });
  //http.open('GET', 'http://api.twitter.com/1/statuses/user_timeline.json?' + 'screen_name=' + screename + '&' + 'include_rts=0&' + 'count=' + count);
  http.open('GET', 'http://tools.centogram.com/twitter/?' + 'name=' + screename + '&' + 'count=' + count);
  http.send();
}

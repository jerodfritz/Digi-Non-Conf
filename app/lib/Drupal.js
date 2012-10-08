
var Http = require('Http').Http;      

var REST_PATH = 'http://digital-non-conference.boucher.centogram.com/api/rest/';
var SITE_PATH = 'http://digital-non-conference.boucher.centogram.com/';

var formatDrupalUser = function(user){
  var username = user.username || '';
  var password = user.password || '';
  var email = username;
  
  var drupalUser =  {
    "name" : username,
    "pass" : password,
    "mail" : email,
    //"field_first": {"und":[{"value": user.first}]},
    //"field_last": {"und":[{"value": user.last}]},
    //"field_phone": {"und":[{"value": user.phone}]},
    //"field_division": {"und":[{"value": user.division}]},
    "username" : username,
    "password" : password
  };
  return drupalUser;
}
exports.formatDrupalUser = formatDrupalUser;

exports.createAccount = function(user,_cb) {
  Titanium.API.info('drupal.js : createAccount ' + user.email)
  
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
    _cb(JSON.parse(this.responseText));
  };
  
  var DrupalUser = formatDrupalUser(user);
  
  Http.postJSON({
      url : REST_PATH + "user/register.json",
      data : JSON.stringify(DrupalUser),
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        //Sometimes the email already exists in the system so lets try and associate it with this instance
        login(user,_cb);
      }
  });
};

var updateAccount = function(user,_cb){
  var DrupalUser = formatDrupalUser(user);
  DrupalUser.pass = null;
  DrupalUser.password = null;
    
  Ti.API.info(JSON.stringify(DrupalUser));
    Http.putJSON({
      url : REST_PATH + "user/" + user.drupal_id + '.json',
      data : JSON.stringify(DrupalUser),
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        _cb({ success: false, message : error })
      }
    });
};  
exports.updateAccount = updateAccount;

var createContent = function(node,_cb,_progress){
    
    Http.postJSON({
      url : REST_PATH + 'node',
      data : JSON.stringify(node),
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        _cb({ success: false, message : error })
      },
      onsendstream : function(e) {
        _progress(e.progress);
      }
    });   
}
exports.createContent = createContent;

var createFile = function(file,_cb,_progress){
    Http.postJSON({
      url : REST_PATH + 'file',
      data : JSON.stringify(file),
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        _cb({ success: false, message : error })
      },
      onsendstream : function(e) {
        _progress(e.progress);
      }
    });
}
exports.createFile = createFile;

var getUser = function (_id,_cb){
  var id = _id || '';
  Ti.API.info('Drupal.js : Getting User id['+ id +']'); 
  Http.postJSON({
      url : REST_PATH + 'user/' + id,
      success : function(data) {
        _cb({ success: true, data: data })
      },  
      error : function(error) {
        _cb({ success: false, message : error })
      }
  });
};  
exports.getUser = getUser;


var login = function (user,_cb){
  var DrupalUser = formatDrupalUser(user);
  Ti.API.info('Drupal.js : Logging in User ' + JSON.stringify(DrupalUser)); 
  Http.postJSON({
      url : REST_PATH + 'user/login',
      data : JSON.stringify(DrupalUser),
      success : function(data) {
        _cb({ success: true, data: data })
      },  
      error : function(error) {
        if(error.code == 406){ //If already logged in log out and then back in
          logout(function(){
            login(user,_cb);
          })
        } else {
          _cb({ success: false, message : error })
        }
      }
  });
};  
exports.login = login;


var logout = function (_cb){
  Ti.API.info('Drupal.js : Logging out');
  Http.postJSON({
      url : REST_PATH + 'user/logout',
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        _cb({ success: false, message : error })
      }
  });
};  
exports.logout = logout;


var view = function(args,_cb){
  Ti.API.info('Drupal.js : Fetching View');
  var view_name = args.view;
  var views_data = args.data || {};
  var extra = "?";
  if(args.display_id){
    extra += 'display_id='+args.display_id+'&';
  }
  Http.getJSON({
      url : REST_PATH + 'views/' + view_name + '.json' + extra,
      data : views_data,
      success : function(data) {
        _cb({ success: true, data: data })
      },
      error : function(error) {
        _cb({ success: false, message : error })
      }
  });
};
exports.view = view;

function formatQueryArgs(params) {
  var query = [];
  for (var p in params) {
    if (params.hasOwnProperty(p)) {
      query.push(p + "=" + escape(params[p]));
    }
  }
  return query.join('&');
}

var resource = function(args, _cb) {
  Ti.API.info('Drupal.js : Fetching Resource');
  Http.getJSON({
    url : REST_PATH + args.resource + '?' + formatQueryArgs(args.args),
    success : function(data) {
      Ti.App.Drupal = null;
      _cb({
        success : true,
        data : data
      })
    },
    error : function(error) {
      _cb({
        success : false,
        message : error
      })
    }
  });
};
exports.resource = resource;

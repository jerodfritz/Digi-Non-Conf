var Drupal = require('Drupal'),
	moment = require('moment');
	
//Cache all session data at the module level for every launch,
//but force a refresh after a certain amount of time TODO
var sessions = [];

function Session() {}

//Get a complete session listing (this will never top 100)
Session.getAll = function(callback,forceRemoteRefresh) {
	//hit cache first
	if (sessions.length > 0 && !forceRemoteRefresh) {
		//return a simulated event immediately
		callback({
			success:true,
			sessions:sessions
		});
	}
	else {
	  var args = {
      'resource': 'events-service'
    }
    Drupal.resource(args, function(response) {
      if (response.success) {
        sessions = response.data;
        response.sessions = sessions;
        try {
          callback(response);
        } catch (ex) {
          //alert(ex);
          //Ti.API.debug(ex);
          Ti.API.info("exception")
          callback("Unkown Error Occurred");
        }
      } else {
        callback("Unkown Error Occurred");
      }
    })
	}
};

//TODO: Do an actual query for the next event, based on actual time.
Session.getNext = function(cb) {
	Cloud.Objects.query({
		classname:'Session',
		page:1,
		per_page:1
	}, function(e) {
		//on the fail case, e will contain ACS error info
		var next;
		if (e.success) {
			next = e.Session[0];
		}
		cb({
			next:next,
			success:e.success	
		});
	});
};

//Return all sessions for a given day - if before conference, show day 1, if after, show day 3
Session.getForDay = function(dateString, cb) {
	
};

module.exports = Session;

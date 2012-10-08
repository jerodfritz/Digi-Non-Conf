
var tabWidth = Ti.Platform.displayCaps.platformWidth/4;

var tabPositions = {
	agenda:0,
	stream:tabWidth,
	favorites:tabWidth*2,
  about:tabWidth*3,
};

//set tab positions
$.agenda.left = tabPositions.agenda;
$.stream.left = tabPositions.stream;
$.favorites.left = tabPositions.favorites;
$.about.left = tabPositions.about;

//add tab behavior
function doTab(name,offset,noEvent) {
	_.each(['agenda', 'stream', 'favorites', 'about'], function(item) {
		if (name === item) {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-pressed.png'
			}
			else {
				$[item+'Icon'].image = '/img/tabs/btn-'+item+'-default.png'
			}
	});
	
	noEvent || ($.trigger('change',{
		name:name
	}));
}

$.agenda.on('click', function() {
	doTab('agenda', tabPositions.agenda);
});

$.stream.on('click', function() {
	doTab('stream', tabPositions.stream);
});


$.favorites.on('click', function() {
  doTab('favorites', tabPositions.home);
});

$.about.on('click', function() {
	doTab('about', tabPositions.venue);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


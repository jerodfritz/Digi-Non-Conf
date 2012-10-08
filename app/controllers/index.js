//Dependencies
var ui = require('ui');

//TODO: Be more tolerant of offline
if (!Ti.Network.online) {
	ui.alert('networkErrTitle', 'networkErrMsg');
}


//create view hierarchy components
setTimeout(function() {
    $.main = Alloy.createController('main');
    $.index.add($.main.getView());
    $.main.init();
    $.index.open();
  }, 500);
  
  
if (Ti.Platform.osname === 'android' && Alloy.isTablet) {
	ui.alert('Android Tablet Support', 'This experience has not yet been optimized for Android tablets.  Check back soon...');
}

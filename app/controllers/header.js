//Tablet header emits navigation events
if (Alloy.isTablet) {
	var tabOffset = 121,
		tabWidth = 60;
		
	var navOffsets = {
		agenda:0,
		stream: tabWidth,
		favorites: tabWidth*2,
		about: tabWidth*3
	};
	
	function doTab(name,offset,noEvent) {
		$.navIndicator.animate({
			left:offset+tabOffset,
			duration:250
		});
		
		noEvent || ($.trigger('change',{
			name:name
		}));
	}
	
	$.agenda.on('click', function() {
		doTab('agenda', navOffsets.agenda);
	});
	
	$.stream.on('click', function() {
		doTab('stream', navOffsets.stream);
	});
	
	$.favorites.on('click', function() {
		doTab('favorites', navOffsets.favorites);
	});
	
	$.about.on('click', function() {
    doTab('about', navOffsets.about);
  });
	
	//Public API to manually set the tablet nav position
	$.setNav = function(name) {
		doTab(name,navOffsets[name],true);
	};
}

//Public component API
$.setBackVisible = function(toggle) {
	if (!Alloy.isTablet) {
		if (toggle) {
			$.back.visible = true;
			$.back.enabled = true;
		}
		else {
			$.back.visible = false;
			$.back.enabled = false;
		}
	}
};

//Public component API
$.setRefreshVisible = function(toggle) {
    if (toggle) {
      $.refresh.visible = true;
      $.refresh.enabled = true;
    }
    else {
      $.refresh.visible = false;
      $.refresh.enabled = false;
    }
};

$.refresh.on('click', function() {
    if ($.refresh.enabled) {
      $.trigger('refresh');
    }
});


//Back isn't there on tablet
if ($.back) {
	$.back.on('click', function() {
		if ($.back.enabled) {
			$.trigger('back');
		}
	});
}

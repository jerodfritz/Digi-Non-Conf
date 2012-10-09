/*
 * Smallish shared UI helper libraries
 */
var _ = require('alloy/underscore'),
	moment = require('moment'),	
	Favorites = require('Favorites'),
	shadow = {
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowOffset: {x: '2dp', y: '2dp'}
  },
  shadowLight = {
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {x: '1dp', y: '1dp'}
  };

if(OS_IOS){
  var ds = require('com.infinery.ds'); 
} else {
  var ds = {Shadow : function() {} };
}
  
var color_generic = '#4381b3';
var color_social = '#c63838';
var color_data = '#d6de42';
var color_tech = '#5ad1d4';

exports.shadow = function(obj){
  if(OS_IOS){
    var shadowProps = shadow;//obj.shadowProps || shadow;
    ds.Shadow(obj,shadowProps);  
  }
}


//Display a localized alert dialog
exports.alert = function(titleid, textid) {
	Ti.UI.createAlertDialog({
		title:L(titleid),
		message:L(textid)
	}).show();
};

//Zoom a view and dissipate it
exports.zoom = function(view, callback) {
	var matrix = Ti.UI.create2DMatrix({ 
		scale:1.5 
	});

	view.animate({ 
		transform:matrix, 
		opacity:0.0, 
		duration:250 
	}, function() {
    	callback && callback();
	});
};

//undo the zoom effect
exports.unzoom = function(view, callback) {
	var matrix = Ti.UI.create2DMatrix({ 
		scale:1 
	});

	view.animate({ 
		transform:matrix, 
		opacity:1, 
		duration:250 
	}, function() {
    	callback && callback();
	});
};

function FauxShadow() {
	return Ti.UI.createView({
		bottom:0,
		height:'1dp',
		backgroundColor:'#9a9a9a'
	});
}
exports.FauxShadow = FauxShadow;

/*
 * Create a reusable filter header for insertion into a view hierarchy
 * Example:
 * var header = new ui.HeaderView({
 *     title:'localizationIdString',
 *     optionWidth:90, //converted to dp
 *     options: [
 *         'optionOneKey',
 *         'optionTwoKey'
 *     ],
 *     viewArgs: {
 * 	       //object properties for View proxy, if desired
 *     }
 * });
 * 
 * //e.selection contains the option key value that was selected by the user
 * header.on('change', function(e) {
 *     
 * })
 * 
 */
exports.HeaderView = function(options) {
	var self = Ti.UI.createView(_.extend({
		backgroundColor:'#6a6c6c',
		height:'29dp'
	}, options.viewArgs || {}));
	
	//var fauxShadow = new FauxShadow();
	//self.add(fauxShadow);
	
	var indicator = Ti.UI.createView({
		top:0,
		right:(options.optionWidth*(options.options.length-1))+'dp',
		bottom:'1dp',
		width:options.optionWidth+'dp',
		backgroundColor:'#585c5c'
	});
	self.add(indicator);
	
	var title = Ti.UI.createLabel({
		text:L(options.title),
		color:'#373e47',
		left:'5dp',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		font: {
			fontFamily:'Quicksand-Bold',
			fontSize:'14dp'
		}
	});
	self.add(title);
	
	//Create a styled menu option
	function option(t,idx) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'dp';
		
		var v = Ti.UI.createView({
			width:options.optionWidth+'dp',
			right:rightOffset
		});
		
		var l = Ti.UI.createLabel({
			text:L(t),
			color:'#e4e7e7',
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			font: {
				fontFamily:'Quicksand-Bold',
				fontSize:'14dp'
			},
			//shadowColor:'#434646',
      //shadowOffset:{x:'2dp',y:'1dp'},
		});
		if(OS_IOS){
		  ds.Shadow(l,shadow);  
		}
		
		// Total Hack Job to get to work with filters design     
    switch(t){
      case 'all':
        v.width = '60dp';
        v.rightOffset = rightOffset = '240dp'
        break;
      case 'social':
        v.width = '80dp';
        v.rightOffset =  rightOffset = '160dp'
        break; 
      case 'data':
        v.width = '75dp';
        v.rightOffset =  rightOffset = '80dp'
        break;
      case 'tech':
        v.width = '75dp';
        v.rightOffset =  rightOffset = '0'
        break;
    }
    
    var showIndicator = contains(['all', 'social', 'data', 'tech'],t);
    if(showIndicator){
      var color = 'transparent';
      var left = '35dp';
        
      switch(t){
        case 'social': 
          l.left = left;
          color='#c63838';
          break;
        case 'data': 
          l.left = left;
          color='#d6de42';
          break;
        case 'tech':
          l.left = left; 
          color='#5ad1d4';
          break;
      }  
      var b = Ti.UI.createView({
        backgroundColor:color,
        height:'20dp',
        width:'20dp',
        left:'10dp',
        top:'10dp',
      });
      if(OS_IOS){
        ds.Shadow(b,shadow);
      }
      v.add(b);
    }
		
		v.add(l);
    
		//option selection
		v.addEventListener('click', function(e) {
			indicator.animate({
				right:rightOffset,
				width:v.width,
				duration:250
			}, function() {
			  self.selection = t;
				self.fireEvent('change',{
					selection:t
				});
			});
		});
		
		return v;
	}
	
	self.selection = options.options[0];
	//Create menu options for each option requested
	for (var i=0, l=options.options.length; i<l; i++) {
		self.add(option(options.options[i], i));
	}
	
	//Add common shortcut to addEventListener
	self.on = function(ev,cb) {
		self.addEventListener(ev,cb);
	};
	
	return self;
};

//Helper to dynamically generate a session table view row
function AgendaRow(session) {
	
	var nid = session.nid;

  var track = false;
  var color = color_generic;
  switch(session.Track[0]){
    case 'Social':
      track = 'social';
      color= color_social;
      break;
    case 'Data':
      track = 'data';
      color= color_data;
      break;
    case 'Tech':
      track = 'tech';
      color= color_tech;
      break;
    default:
      track = 'n/a';
      break;
  }
  session.track = track;
  session.color = color;
  
  
  var openDetails = true;
  var type = false;
  var iconImage = false;
  //Ti.API.info("Type : " + session.Type[0]);
  switch(session.Type[0]){
    case 'Break':
      type = 'break';
      iconImage = '/img/general/break_icon.png'
      openDetails = false;
      break;
    case 'Keynote':
      type = 'keynote';
      iconImage = '/img/general/podium_icon.png'
      break;
    case 'Lunch':
      type = 'lunch';
      iconImage = '/img/general/lunch_icon.png'
      openDetails = false;
      break;
    case 'Panel':
      type = 'panel';
      iconImage = '/img/general/panel_icon.png'
      break;
    case 'Speaker':
      type = 'speaker';
      iconImage = '/img/general/speaker_icon.png'
      break;
    default:
      type = 'generic';
      iconImage = '/img/general/generic_icon.png'
      openDetails = false;
      break;
  }
  session.type = type;
  session.iconImage = iconImage;  

	var start = moment(session.time.value + ' +0000',"YYYY-MM-DD HH:mm:ss Z");
	var	end = moment(session.time.value2 + ' +0000',"YYYY-MM-DD HH:mm:ss Z");

  var location = JSON.parse(session.location);
  var loc = location[0];
 
  var rowClick = function(){
    if(openDetails){
        Ti.App.fireEvent('app:open.drawer', {
        controller: 'sessionDetail',
        contextData: session
      });
    }
  }

  session.loc = (loc)? loc.name : '';
  session.period = start.format('h:mma') + ' - ' + end.format('h:mma');
  session.isFavorite = Favorites.is(nid);
	
	var row = Ti.UI.createTableViewRow({
    height:'65dp',
    selectedBackgroundColor:'transparent',
    className:'starRow',
    layout : 'vertical',
    //hasChild : openDetails,
    //backgroundImage: '/img/general/bg-agenda-row.png',
  });
  
  var rowContainer = StarContainer({
    nid : nid,
    isFavorite : session.isFavorite,
    color : color,
    icon : iconImage,
    line1 : start.format('h:mma') + ' - ' + end.format('h:mma'),
    line2 : session.node_title,
    line3 : session.loc ,
    _starCallback : starCallback,
    _rowCallback :  rowClick,
    hasChild : openDetails,
    showStar : true
  });
  row.add(rowContainer);
  row.isFavorite = session.isFavorite;
  row.container = rowContainer;
  row.nid = session.nid; 
  
	return row;
}
exports.AgendaRow = AgendaRow;

function StarContainer(options){
  
  var nid = options.nid || -1,
    isFavorite = options.isFavorite || false,
    color = options.color || color_generic,
    icon = options.icon || false,
    line1 = options.line1 || '',
    line2 = options.line2 || '',
    line3 = options.line3 || '',
    _starCallback = options._starCallback || false,
    _rowCallback =  options._rowCallback || false,
    hasChild = options.hasChild,
    showStar = options.showStar;
  
  var theHeight = '65dp';
 
  var container = Ti.UI.createView({
    backgroundImage: '/img/general/bg-agenda-row.png',
    backgroundRepeat : true,
    width: Ti.UI.FILL,
    height:theHeight,
    top:0,
    left:0
  });
  
  var starOn = '/img/general/star-on.png';
  var starOff = '/img/general/star.png';
  
  var star = Ti.UI.createImageView({
    image : isFavorite ? starOn : starOff,
    left: '10dp',
    width: '21dp',
    height: '22dp',
    nid : nid,
    starOn : starOn,
    starOff : starOff,
  })
  if(showStar){
    container.add(star);
    star.addEventListener('click',function(e){
      e.source.star = star;
      if(_starCallback){
        _starCallback(e);
      }
      container.fireEvent('starToggle');  
    })
  }
  var iconBackground = Ti.UI.createView({
    backgroundColor:color,
    backgroundImage: '/img/general/' + color + '.png',
    width: '35dp',
    height: '35dp',
    left: (showStar)?'40dp':'13dp',
  });
  if(OS_IOS){
    ds.Shadow(iconBackground,shadowLight);  
  }
  container.add(iconBackground);
  
  if(icon){
    var iconGraphic = Ti.UI.createImageView({
      image : icon,
      width: '30dp',
      height: '30dp',
      left: (showStar)?'42.5dp':'15.5dp',
      nid : nid,
      star : star
    })
    if(showStar){
      iconGraphic.addEventListener('click',function(e){
        if(_starCallback){
          _starCallback(e);
        } 
        container.fireEvent('starToggle');   
      })
    }
    container.add(iconGraphic);
  }
  
  // TODO :  All this of showStar stuff is a complete hack job to get this row style to work in multiple places after UI changed 
  if(showStar){
    var textContainer = Ti.UI.createView({left:'87dp',right:'25dp'});  
    var l1 = simpleText(line1,{top : '8dp'});
    var l2 = simpleText(line2, {size : '13dp'});
    var l3 = simpleText(line3, {bottom : '8dp'});
    textContainer.add(l1);
    textContainer.add(l2);
    textContainer.add(l3);
    container.add(textContainer);
  } else {
    var textContainer = Ti.UI.createView({left:'60dp'});
    var l1 = simpleText(line1,{top : '13dp',size : '14dp'});
    var l2 = simpleText(line2,{top : '30dp',size : '12dp'});
    textContainer.add(l1);
    textContainer.add(l2);
    container.add(textContainer);
  }
  
  
  
  if(_rowCallback){
    textContainer.addEventListener('click',_rowCallback)
  }
  
  if(hasChild){
    var arrow = '/img/general/btn-right-arrow.png';
    var hasChildArrow = Ti.UI.createImageView({
      image : arrow,
      width: '11dp',
      height: '12dp',
      right: '10dp',
      nid : nid,
    })
    container.add(hasChildArrow);
  }
  
  container.starToggle = function(on){
    star.image = on ? starOn : starOff;
  }
  return container;
}
exports.StarContainer = StarContainer;

var simpleText = function(text, options) {
  var size = '10dp';
  if (options) {
    size = options.size || size;
  }
  var l = Ti.UI.createLabel(_.extend({
    text : text,
    color : '#fff',
    //ellipsize:true,
    //wordWrap:false,
    left : 0,
    minimumFontSize : size,
    font : {
      fontSize : size,
      fontWeight : 'normal'
    }
  }, options || {}));
  if(OS_IOS){
    ds.Shadow(l, shadow);
  }
  return l;
}
exports.simpleText = simpleText;

function SpeakerContainer(speaker){
  var nid = speaker.nid;
  
  var container = Ti.UI.createView({
    backgroundImage: '/img/general/bg-agenda-row.png',
    backgroundRepeat : true,
    width: Ti.UI.FILL,
    height: '65dp',
    top:0,
    left:0
  });
  
  var photo = speaker.photo ? speaker.photo : '/img/general/no-profile-pic.png';
  var speakerPhoto = Ti.UI.createImageView({
    image : photo,
    width: '35dp',
    height: '35dp',
    left: '13dp',
    nid : nid,
  })
  container.add(speakerPhoto);

  var textContainer = Ti.UI.createView({left:'60dp'});  
  
  var name = speaker.field_first_name.und[0].value + ' ' + speaker.field_last_name.und[0].value; 
  var l1 = simpleText(name,{top : '13dp',size : '14dp'});
  var l2 = simpleText(speaker.field_position_title.und[0].value,{top : '30dp',size : '12dp'});
  
  textContainer.add(l1);
  textContainer.add(l2);
  
  container.add(textContainer);
  
  var arrow = '/img/general/btn-right-arrow.png';
  var hasChildArrow = Ti.UI.createImageView({
    image : arrow,
    width: '11dp',
    height: '12dp',
    right: '10dp',
    nid : nid,
  })
  container.add(hasChildArrow);
  container.addEventListener('click',function(e){
    Ti.App.fireEvent('app:open.drawer', {
      controller: 'speakerDetail',
      contextData: speaker
    });  
  })
  
  container.speaker = speaker;
  return container;
}
exports.SpeakerContainer = SpeakerContainer;

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

function starCallback(e) {
  var on = Favorites.toggle(e.source.nid);
  e.source.star.image = on ? e.source.star.starOn : e.source.star.starOff;
  Ti.API.info("Star toggle " + e.source.nid + " to " + on);
  Ti.App.fireEvent('favorites:change', {
        nid: e.source.nid,
        on: on
  });
}
exports.starCallback = starCallback;

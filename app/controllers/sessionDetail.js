
var ui = require('ui');

var session = arguments[0];
$.sessionTopView.backgroundColor = (session.color=='transparent')?'#929292':session.color; 
$.title.text = session.node_title;
$.iconImage.image = session.iconImage;
//$.descriptionShort.text = session.desc_short.value;
$.descriptionFull.text = session.desc_full.value;

//ui.shadow($.title);
ui.shadow($.descriptionLabel);
ui.shadow($.timePlaceLabel);

Ti.App.fireEvent('analytics:trackPageview', {url: ' Session / ' + session.node_title});  

var timePlace = ui.StarContainer({
    nid : session.nid,
    isFavorite : session.isFavorite,
    color : session.color,
    icon : session.iconImage,
    line1 : session.loc,
    line2 : session.period,
    line3 : '' ,
    _starCallback : ui.starCallback,
    //_rowCallback :  rowClick,
    hasChild : true,
    showStar : false
  });
timePlace.addEventListener('click',function(){
  Ti.App.fireEvent('app:open.drawer', {
    controller: 'mapView',
    contextData: session.loc
  });
})
$.timePlaceTable.add(timePlace);



var speakers = JSON.parse(session.speakers);
for(var i=0;i<speakers.length;i++){
  var speaker = speakers[i];
  speaker.color = session.color;
  var speakerView = ui.SpeakerContainer(speaker);
  $.speakersView.add(speakerView);
}  

/*speakers.push(new ui.AgendaRow(session));

$.speakersTable.setData(speakers);
*/
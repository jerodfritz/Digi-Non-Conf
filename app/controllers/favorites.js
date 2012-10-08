$.on('focus',function(){
  Ti.App.fireEvent('analytics:trackPageview', {url: 'Favorites / Home'});  
});

var moment = require('moment'),
  ui = require('ui'),
  Session = require('Session');

//Session table view data and conference dates
var day1all = [],
  day2all = [],
  day1Date = moment('Oct 23, 2012'),
  day2Date = moment('Oct 24, 2012');
  

//Create handheld UI and controls
if (!Alloy.isTablet) {
  $.daySelector = new ui.HeaderView({
    optionWidth:'150',
    options:['day1', 'day2']
  });
  $.daySelectorContainer.add($.daySelector);
  ui.shadow($.daySelectorContainer);  
  $.daySelector.on('change', function(e) {
    setTableData($.daySelector.selection);
  })
}

function setTableData(day){
  switch(day){
    case 'day1':
      $.agendaTable.setData(day1all);
      break;
    case 'day2':
      $.agendaTable.setData(day2all);
  }
}


//Load agenda data
function loadData(forceRemoteRefresh) {
  day1all = [];
  day2all = [];
  
  Session.getAll(function(e) {
    if (e.success) {
      var sessions = e.sessions;
      for (var i = 0, l = sessions.length; i < l; i++) {
        var session = sessions[i], 
          sessionStart = moment(session.time.value + ' +0000',"YYYY-MM-DD HH:mm:ss Z"); 
          row = new ui.AgendaRow(session);
        if(row.isFavorite){
          if (sessionStart.diff(day2Date) < 0) {
            day1all.push(row);
          } else {
            day2all.push(row);
          }
        }
        row.container.addEventListener('starToggle',function(e){
          Ti.App.fireEvent('favoritesTab:change',e);
        })
      }
      setTableData($.daySelector.selection);
    } else {
      Ti.API.error('Error fetching session data: ' + e);
      ui.alert('networkGenericErrorTitle', 'agendaNetworkError');
    }
  },forceRemoteRefresh);
}

// Load Initial Data
$.on('focus',function(){
  loadData(false);  
})
Ti.App.addEventListener('favorites:change', function(e) {
  loadData(false);
});



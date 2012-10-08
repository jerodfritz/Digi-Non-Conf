$.on('focus',function(){
  Ti.App.fireEvent('analytics:trackPageview', {url: ' Schedule / Home'});  
});

var moment = require('moment'),
	ui = require('ui'),
	Session = require('Session');

$.on('refresh',function(e){
  Ti.API.info("Agenda Refresh");
  loadData(true);
})


//Session table view data and conference dates
var day1all = [],
  day1social = [],
  day1data = [],
  day1tech = [],
	day2all = [],
	day2social = [],
	day2data = [],
	day2tech = [],
	day1Date = moment('Oct 23, 2012'),
	day2Date = moment('Oct 24, 2012');
	
$.loading = Alloy.createController('loading');

//Create handheld UI and controls
$.daySelector = new ui.HeaderView({
  optionWidth : '150',
  options : ['day1', 'day2']
});
$.daySelectorContainer.add($.daySelector);
ui.shadow($.daySelectorContainer);
$.filters = new ui.HeaderView({
  optionWidth : '80',
  options : ['all', 'social', 'data', 'tech'],
  viewArgs : {
    height : '40dp'
  }
});
$.filtersContainer.add($.filters);
ui.shadow($.filtersContainer);
$.daySelector.on('change', function(e) {
  setTableData($.daySelector.selection, $.filters.selection);
})
$.filters.on('change', function(e) {
  setTableData($.daySelector.selection, $.filters.selection);
})


function setTableData(day,section){
  switch(day){
    case 'day1':
      switch(section){
        case 'all':
          $.agendaTable.setData(day1all);
          break;
        case 'social':
          $.agendaTable.setData(day1social);
          break;
        case 'data':
          $.agendaTable.setData(day1data);
          break;
        case 'tech':
          $.agendaTable.setData(day1tech);
          break;
      }
      break;
    case 'day2':
      switch(section){
        case 'all':
          $.agendaTable.setData(day2all);
          break;
        case 'social':
          $.agendaTable.setData(day2social);
          break;
        case 'data':
          $.agendaTable.setData(day2data);
          break;
        case 'tech':
          $.agendaTable.setData(day2tech);
          break;
      }
      break;
  }
}


//Load agenda data
function loadData(forceRemoteRefresh) {
  
  $.index.add($.loading.getView());
  day1all = [];
  day1social = [];
  day1data = [];
  day1tech = [];
  day2all = [];
  day2social = [];
  day2data = [];
  day2tech = [];
  
  Session.getAll(function(e) {
    $.index.remove($.loading.getView());
    if (e.success) {
      var sessions = e.sessions;
      for (var i = 0, l = sessions.length; i < l; i++) {
        var session = sessions[i], sessionStart = moment(session.time.value + ' +0000',"YYYY-MM-DD HH:mm:ss Z"), row = new ui.AgendaRow(session);
        if (sessionStart.diff(day2Date) < 0) {
          day1all.push(row);
          switch(session.Track[0]) {
            case 'Social':
              day1social.push(row);
              break;
            case 'Data':
              day1data.push(row);
              break;
            case 'Tech':
              day1tech.push(row);
              break;
            default:
              break;
          }
        } else {
          day2all.push(row);
          switch(session.Track[0]) {
            case 'Social':
              day2social.push(row);
              break;
            case 'Data':
              day2data.push(row);
              break;
            case 'Tech':
              day2tech.push(row);
              break;
            default:
              break;
          }
        }
      }
      setTableData($.daySelector.selection,$.filters.selection);
    } else {
      Ti.API.error('Error fetching session data: ' + e);
      ui.alert('networkGenericErrorTitle', 'agendaNetworkError');
    }
  },forceRemoteRefresh);
}

// Load Initial Data
loadData(false);

Ti.App.addEventListener('favorites:change', function(e) {
  //Ti.API.debug(e);
  //loadData(false);
});
Ti.App.addEventListener('favoritesTab:change', function(e) {
  //Ti.API.debug(e);
  loadData(false);
});


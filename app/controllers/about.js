$.on('focus',function(){
  Ti.App.fireEvent('analytics:trackPageview', {url: 'About / Home'});  
});

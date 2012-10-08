$.on('focus',function(){
  Ti.App.fireEvent('analytics:trackPageview', {url: ' About / Home'});  
});

$.centogram.on('click',function(){
  Titanium.Platform.openURL('http://www.centogram.com');  
});

$.mikezitt.on('click',function(){
  Titanium.Platform.openURL('http://www.mikezitt.com');  
});

$.appcelerator.on('click',function(){
  Titanium.Platform.openURL('http://www.appcelerator.com');  
});

$.drupal.on('click',function(){
  Titanium.Platform.openURL('http://www.drupal.org');  
});
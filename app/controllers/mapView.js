var locName = arguments[0];

var image = '/img/maps/hilton.png';
switch(locName){
  case 'Plaza Hall of Mirrors':
    image = '/img/maps/hilton.png';
    break;
  case 'Hall of Mirrors':
    image = '/img/maps/hilton.png';
    break;
  case "FB's":
    image = '/img/maps/fb.png';
    break;
  case "The Blue Wisp Jazz Club":
    image = '/img/maps/bluewisp.png';
    break;
  case "The Penguin Piano Bar":
    image = '/img/maps/penguin.png';
    break; 
  case "Cincy’s on Sixth":
    image = '/img/maps/cincy.png';
    break; 
}
$.location.image = image;

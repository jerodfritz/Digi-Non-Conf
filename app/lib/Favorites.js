// caution hack job ahead : quick and dirty job to store array of favorite nids,  convert this to sqllite would be much more better'er

function Favorites() {}

var setProperty = function(name,value){
  var v = JSON.stringify(value);
  Ti.App.Properties.setString(name, v);
}

var getProperty = function(name){
  return JSON.parse(Ti.App.Properties.getString(name));
}

var isnull = function(obj) {
  var sObj = JSON.stringify(obj);
  if (obj != null && obj != undefined && obj != '' && obj != 'null' && obj != 'undefined' && sObj != 'null' && sObj != 'undefined') {
    return false;
  } else {
    return true;
  }
}

var favorites_key = "favorites";
if(isnull(getProperty(favorites_key))){
  setProperty(favorites_key,[]);
}

function getAll(){
  return getProperty(favorites_key);
}
Favorites.get = getAll;

function isFavorite(nid){
  var favs = getAll();
  return isnull(favs[nid]) ? false : favs[nid] ;
}
Favorites.is = isFavorite;

function addFavorite(nid){
  var favs = getAll();
  favs[nid] = true;
  setProperty(favorites_key,favs);
}
Favorites.add = addFavorite;

function removeFavorite(nid){
  var favs = getAll();
  favs[nid] = false;
  setProperty(favorites_key,favs);
}
Favorites.remove = removeFavorite;

function toggle(nid){
  if(isFavorite(nid)){
    removeFavorite(nid);
    return false;
  } else {
    addFavorite(nid);
    return true;
  }
}
Favorites.toggle = toggle;

Favorites.isFavorite = isFavorite;

module.exports = Favorites;



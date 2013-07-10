if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

var _username = '';

if(window.location.search.substr(1,8)==='username') {
  var stringEnd;
  if (window.location.search.indexOf('&') !== -1) { stringEnd = window.location.search.indexOf('&'); }
  else { stringEnd = window.location.search.length; }
  _username = window.location.search.substring(10, stringEnd);
}
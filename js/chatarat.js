
// var message = {
//   text: "console.log('KHANNNN!')"
// };

// message = JSON.stringify(message);


// $.ajax('https://api.parse.com/1/classes/test', {
//   contentType: 'application/json',
//   type: 'POST',
//   data: message,
//   success: function(data){
//     console.log('works');
//   },
//   error: function(data) {
//     console.log('Ajax request failed');
//   }
// });

var chatURL = 'https://api.parse.com/1/classes/messages';

var latest = chatURL + '?order=-createdAt';

var retrieveMessages = function() {
  $.ajax(latest, {
    contentType: 'application/json',
    success: function(data){
      console.log('Retrieved messages from server.');
      exportMessages(data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var exportMessages = function(messages) {
  messages = messages.results;
  for (var i = 0; i < messages.length; i++) {
    $(templater(messages[i])).appendTo("#main");
  }
};

var sanitizer = function(dirtyGstring){
  dirtyGstring = '<b>' + dirtyGstring + '</b>';
  return $(dirtyGstring).text();
};

var templater = function(obj) {
  var userLine = '';
  var msgLine = '';
  var timeLine = '';
  if(obj.hasOwnProperty('username')) {
    userLine = '<span class="username">' + sanitizer(obj.username) + ':</span>\n';
  }
  if(obj.hasOwnProperty('text')) {
    msgLine = '<span class="text">' + sanitizer(obj.text) + '</span>\n';
  }
  if(obj.hasOwnProperty('createdAt')) {
    timeLine = '<span class="timestamp">' + sanitizer(obj.createdAt) + ':</span>\n';
  }

  var messageOutput = '<div class="message">\n' + userLine + msgLine + timeLine + '</div>';
  return messageOutput;
};
var baseURL = 'http://127.0.0.1:8080/classes/';
var _roomname = 'messages';                               // will be changed as we change rooms
var lastMsgTime = '2013-07-10T02:35:04.472Z';             // changed as we get new messages

var retrieveMessages = function() {
  var getURL = baseURL + _roomname + '/?time=' + JSON.stringify(lastMsgTime);

  $.ajax(getURL, {
    contentType: 'application/json',
    success: function(data){
      exportMessages(data);
      console.log('Retrieved messages from server.');
    },
    error: function(data) {
      console.log('Ajax GET request failed');
    }
  });
};

var exportMessages = function(messages) {
  //messages = messages.results;      // used because Parse would return a Object with a results array
  for (var i = 0; i < messages.length; i++) {
    templater(messages[i]).appendTo("#chatlog");
  }

  if(typeof messages[0] === 'undefined') {
    console.log("No existing messages in chatroom " + _roomname + ".");
  } else {
    lastMsgTime = messages[messages.length-1].createdAt;
  }

  // scrolls to the bottom
  $("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
};

var templater = function(obj) {

  var messageOutput = $('<div class="message"></div>');

  if(obj.hasOwnProperty('username')) {
    $('<a href="#" class="username '+obj.username+'"></a>').text(obj.username + ': ').appendTo(messageOutput);
  }
  if(obj.hasOwnProperty('text')) {
    var shortened = obj.text.substr(0,160);
    $("<span class='text'></span>").text(shortened + ' ').appendTo(messageOutput);
  }
  if(obj.hasOwnProperty('createdAt')) {
    $('<span class="timestamp"></span>').text(obj.createdAt).appendTo(messageOutput);
  }
  return messageOutput;
};

var sendMessage = function() {
  var message = {};
  message.username = _username;
  message.roomname = _roomname;
  message.text = $("#sendMsg").val();
  message = JSON.stringify(message);

  var postURL = baseURL + _roomname + '/';

  if($("#sendMsg").val() !== '') {
    $.ajax(postURL, {
      'content-type': 'application/json',
      type: 'POST',
      data: message,
      success: function(data){
        console.log('Message submitted to server.');
      },
      error: function(data) {
        console.log('Ajax POST request failed');
      }
    });
  }

  $("#sendMsg").val('');
  retrieveMessages();
};

var updateTitle = function() {
  var title = 'chatarat';
  (_roomname==='messages') ? title = 'the cesspool we call "messages"' : title = '"'+ _roomname + '"';
  $('#roomTitle').text(title);
};

var changeRoom = function() {
  _roomname = $("#roomChange").val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');

  updateTitle();
  $('<div class="announcement">Now entering ' + _roomname + '</div>').appendTo('#chatlog');

  $('#roomChange').val('');
  retrieveMessages();
};

// running functions

updateTitle();

$('#chatlog').on('click', 'a', function(){
  var username = this.classList[1];
  $('#chatlog').find('.'+username).next().toggleClass("friend");
});

//setInterval(retrieveMessages, 5000);
var baseURL = 'https://api.parse.com/1/classes/';
var _roomname = 'messages';                               // will be changed as we change rooms
var lastMsgTime = '2013-07-03T02:42:41.364Z';             // changed as we get new messages

var retrieveMessages = function() {
  var getParam = '?order=-createdAt' + '&limit=50';

  var getURL = baseURL + _roomname + getParam + '&where=' + JSON.stringify({createdAt:{'$gt':{'__type':"Date","iso":lastMsgTime}}});

  $.ajax(getURL, {
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
  for (var i = messages.length-1; i > -1; i--) {
    templater(messages[i]).appendTo("#chatlog");
  }

  if(typeof messages[0] === 'undefined') {
    console.log("No existing messages in chatroom " + _roomname + ".");
  } else {
    lastMsgTime = messages[0].createdAt;
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
    //var cleanString = sanitizer(obj.text);
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

  var postURL = baseURL + _roomname;

  if($("#sendMsg").val() !== '') {
    $.ajax(postURL, {
      contentType: 'application/json',
      type: 'POST',
      data: message,
      success: function(data){
        console.log('Message submitted to room ' + _roomname);
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
  }

  $("#sendMsg").val("");
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

setInterval(retrieveMessages, 5000);
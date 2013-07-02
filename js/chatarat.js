
// var message = {
//   username: "lt;script&gt;function(){alert('PENETRATED')window.location.replace('http://youtu.be/dQw4w9WgXcQ';}();&lt;/script&gt;",
//   chatroom: '<script>var recursive = function() {  console.log("PWNED");  window.open("http://www.youtube.com/watch?v=dQw4w9WgXcQ");  recursive();  recursive();  recursive();};</script>'
// };

// message = JSON.stringify(message);

// $.ajax('https://api.parse.com/1/classes/messages', {
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



var chatURL = 'https://api.parse.com/1/classes/sfsfw3fs';

var GETparam = chatURL + '?order=-createdAt' + '&limit=50';
var lastMsgTime = '2013-07-02T00:17:40.402Z';



var retrieveMessages = function() {
  GETparam = GETparam + '&where=' + JSON.stringify({createdAt:{'$gt':{'__type':"Date","iso":lastMsgTime}}});

  $.ajax(GETparam, {
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

/// SET INTERVAL -- NEED TO MOVE LATER

//setInterval(retrieveMessages, 1000);


var exportMessages = function(messages) {
  messages = messages.results;

  for (var i = messages.length-1; i > -1; i--) {
    $(templater(messages[i])).appendTo("#chatlog");
  }

  lastMsgTime = messages[0].createdAt;
  console.log(messages[0].createdAt);

  //debugger;

  $("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
};

var sanitizer = function(dirtyGstring){
  dirtyGstring = '<b>' + dirtyGstring + '</b>';
  return $(dirtyGstring).text() + ": ";
};

var templater = function(obj) {
  var userLine = '';
  var msgLine = '';
  var timeLine = '';
  if(obj.hasOwnProperty('username')) {
    userLine = $('<span class="username"></span>').text(obj.username + ': ').html() + '\n';
  }
  if(obj.hasOwnProperty('text')) {
    var cleanString = sanitizer(obj.text);
    msgLine = $('<span class="text"></span>').text(cleanString).html() + '\n';
  }
  if(obj.hasOwnProperty('createdAt')) {
    timeLine = $('<span class="timestamp"></span>').text(obj.createdAt).html() + '\n';
  }

  var messageOutput = '<div class="message">\n' + userLine + msgLine + timeLine + '</div>';
  return messageOutput;
};


$(".sendButton").on('click', sendMessage);

var sendMessage = function() {
  var message = {};
  message.text = $("#sendMsg").val();
  message = JSON.stringify(message);

  $.ajax(chatURL, {
    contentType: 'application/json',
    type: 'POST',
    data: message,
    success: function(data){
      console.log('Message submitted to chat.');
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
  $("#sendMsg").val("");
  retrieveMessages();
};
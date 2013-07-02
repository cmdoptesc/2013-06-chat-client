
// var message = {
//   username: "lt;script&gt;function(){alert('PENETRATED')window.location.replace('http://youtu.be/dQw4w9WgXcQ';}();&lt;/script&gt;",
//   text: '<script>var recursive = function() {  console.log("PWNED");  window.location.replace("http://www.youtube.com/watch?v=dQw4w9WgXcQ");  recursive();  recursive();  recursive();};</script>'
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

var chatURL = 'https://api.parse.com/1/classes/messages';

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
    templater(messages[i]).appendTo("#chatlog");
  }
  lastMsgTime = messages[0].createdAt;

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

$(".sendButton").on('click', sendMessage);

$('#chatlog').on('click', 'a', function(){
  var username = this.classList[1];
  $('#chatlog').find('.'+username).next().toggleClass("friend");
});

var sendMessage = function() {
  var message = {};
  message.username = _username;
  message.text = $("#sendMsg").val();
  message = JSON.stringify(message);

  if($("#sendMsg").val() !== '') {
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
  }
  $("#sendMsg").val("");
  retrieveMessages();
};
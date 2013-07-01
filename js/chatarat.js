
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


var retrieveMessages = function() {
  $.ajax('https://api.parse.com/1/classes/test', {
    contentType: 'application/json',
    success: function(data){
      console.log('Retrieved messages from server.');
      displayMessages(data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var displayMessages = function(messages) {
  messages = messages["results"];
  debugger;
  for (var i = 0; i < messages.length; i++) {
    console.log(messages[i].text);
  }
};

// var parser(messages) {
//   var username = messages["username"];
//   var text = messages["text"];

// };
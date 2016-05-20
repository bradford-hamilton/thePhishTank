$(document).ready(function() {

  // Variables
  var socket = io.connect();
  var $nicknameForm = $('#set-nickname');
  var $nicknameError = $('#nickname-error');
  var $nicknameBox = $('#nickname');
  var $users = $('#users');
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');

  // When user submits username for chat
  $nicknameForm.submit(function(event) {
    event.preventDefault();
    socket.emit('new user', $nicknameBox.val(), function(data) {
      if (data) {
        $('#nickname-wrap').hide();
        $('#content-wrap').show();
        $('.jumbotron').show();
      } else {
        $nicknameError.html("That username is already taken! Don't be stupid pick something else");
      }
    });
    $nicknameBox.val('');
  });

  // When user clicks enter or send on their message
  $messageForm.submit(function(event) {
    event.preventDefault();
    socket.emit('send message', $messageBox.val(), function(data) {
      $chat.append('<span class="error">' + data + '</span><br>');
    });
    $messageBox.val('');
  });

  // Adds current chat users to the users list
  socket.on('usernames', function(data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
      html += data[i] + '<br>';
    }
    $users.html(html);
  });

  // Add old messages in on client side
  socket.on('load old messages', function(docs) {
    console.log(docs);
    // Loop through old messages 'docs' from mongo, we want them in decending order to recent
    for (var i = docs.length - 1; i >= 0; i--) {
      displayMessage( docs[i] );
    }
  });

  // Function to display messages, used in a couple places
  function displayMessage(data) {
    if ( $('.msg').length > 8 ) {
      $('.msg')[0].remove();
      $chat.append('<span class="msg"><b id="bold">' + data.nickname + ': </b>' + data.msg + '<br><br></span>');
    } else {
      $chat.append('<span class="msg"><b id="bold">' + data.nickname + ': </b>' + data.msg + '<br><br></span>');
    }
  }

  // New message
  socket.on('new message', function(data) {
    displayMessage(data);
  });
});

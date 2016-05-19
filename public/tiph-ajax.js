$(document).ready(function() {
  // Ajax call to tiph show/setlist
  $('#tiph').click(function() {
    $.ajax({
      url: 'https://api.phish.net/api.js?api=2.0&method=pnet.shows.setlists.tiph&format=json',
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: function(data) {
        return data;
      },
      error: function(err) {
        alert(err);
      }
    // Use returned data to append to page
    }).done(function(data) {
      $('ul').empty();
      $('ul').append( '<li class="text-center"></li>' );
      $('li').append( '<br><br>' );
      $('li').append( "<h1 class='text-center'>" + data[0].venue + ' - ' + data[0].city + ', ' + data[0].state + "</h1>" );
      $('li').append( "<h2 class='text-center'>" + data[0].relativetime + " today." + "</h2>" );
      $('li').append( "<h3 class='text-center'>" + data[0].nicedate + "</h3>" );
      $('li').append( '<br>' );
      $('li').append( data[0].setlistdata );
      $('li').append( '<br>' );
    });
  });
});

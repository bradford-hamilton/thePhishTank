$(document).ready(function() {

  $('.list-group-item').click(function(event) {
    $(".list-group-item.active").removeClass("active");
    $(this).addClass('active');
  });
  // API call for most recent show
  $('#recent').click(function() {
    $.ajax({
      url: 'https://api.phish.net/api.js?api=2.0&method=pnet.shows.setlists.latest&format=json',
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: function(data) {
        return data;
      },
      error: function(err) {
        alert(err);
      }
    // Use returned data
    }).done(function(data) {
      $('ul').empty();
      $('ul').append( '<li class="text-center"></li>' );
      $('li').append( '<hr/><br><br>' );
      $('li').append( "<h1 class='text-center'>" + data[0].venue + ' - ' + data[0].city + ', ' + data[0].state + "</h1>" );
      $('li').append( "<h2 class='text-center'>" + data[0].nicedate + "</h2>" );
      $('li').append( '<br>' );
      $('li').append( data[0].setlistdata );
      $('li').append( '<br><br>' );
      $('li').append( '<hr/><br><br>' );
    });
  });
});

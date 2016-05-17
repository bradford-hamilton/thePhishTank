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
      console.log(data)
      $('ul').empty();
      $('ul').append( '<li class="text-center"></li>' );
      $('li').append( '<hr/><br><br>' );
      $('li').append( "<h2 class='text-center'>" + data[0].venue + ' - ' + data[0].city + ', ' + data[0].state + "</h2 class>" );
      $('li').append( "<h3 class='text-center'>" + data[0].nicedate + "</h3 class>" );
      $('li').append( '<br>' );
      $('li').append( data[0].setlistdata );
    });
  });
});

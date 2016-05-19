$('#upcoming-shows').click(function() {
  // Empty screen first
  $('ul').empty();
  // Ajax call to upcoming shows 
  $.ajax({
    url: 'https://api.phish.net/api.js?api=2.0&method=pnet.shows.upcoming&format=json',
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
    var dates = [],
        venues = [],
        cities = [],
        states = [];
    // Loop through data to store in arrays
    var len = data.length;
    for (var i = 0; i < len; i++) {
      dates.push( data[i].nicedate );
      venues.push( data[i].venuename );
      cities.push( data[i].city );
      states.push( data[i].state );
      // Append to page
      $('ul').append('<li></li>');
      $('li').eq(i).append( '<br>' );
      $('li').eq(i).append( "<h1 class='text-center'>" + dates[i] + "</h1>" );
      $('li').eq(i).append( "<h2 class='text-center'>" + venues[i] + "</h2>" );
      $('li').eq(i).append( "<h3 class='text-center'>" + cities[i] + ', ' + states[i] + "</h3>" );
      $('li').eq(i).append( '<hr/>' );
    }
  });
});

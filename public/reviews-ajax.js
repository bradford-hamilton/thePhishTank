$('#reviews').click(function() {
  // Empty screen first
  $('ul').empty();
  // Ajax call to recent reviews
  $.ajax({
    url: 'https://api.phish.net/api.js?api=2.0&method=pnet.reviews.recent&format=json',
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
        states = [],
        users = [],
        reviews = [];
    // Loop through data to store in arrays
    var len = data.length;
    for (var i = 0; i < len; i++) {
      dates.push( data[i].nicedate );
      venues.push( data[i].venue );
      cities.push( data[i].city );
      states.push( data[i].state );
      users.push( data[i].postedby );
      reviews.push( data[i].review );
      // Append to page
      $('ul').append( "<li class='text-center'></li>" );
      $('li').eq(i).append( '<br>' );
      $('li').eq(i).append( "<h1 class='text-center'>" + venues[i] + ' - ' + cities[i] + ', ' + states[i] + "</h1>" );
      $('li').eq(i).append( "<h3 class='text-center'>" + dates[i] + "</h3>" );
      $('li').eq(i).append( '<br>' );
      $('li').eq(i).append( reviews[i] );
      $('li').eq(i).append( '<br><br><br><br>' );
      $('li').eq(i).append( "<h4 class='col-lg-offset-4 col-md-offset-4 col-sm-offset-4'>" + '-- ' + users[i] + "</h4>" );
      $('li').eq(i).append( '<br><hr/><br>' );
    }
  });
});

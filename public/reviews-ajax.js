$('#reviews').click(function() {
  $('ul').empty();
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
    }
  });



});

$(document).ready(function() {

  /* Phish news ajax call */
  $.ajax({
    url: 'https://api.phish.net/api.js?api=2.0&method=pnet.news.get&format=json',
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data) {
      return data;
    },
    error: function(err) {
      alert(err);
    }
  /* Use returned data */
  }).done(function(data) {
    var dates = [],
        authors = [],
        titles = [],
        bodys = [];
    /* Loop through data to store in arrays */
    var len = data.length;
    for (var i = 0; i < len; i++) {
      dates.push( data[i].pubdate );
      authors.push( data[i].postedby );
      titles.push( data[i].title );
      bodys.push( data[i].txt );
      /* Append to page */
      $('.news ul').append('<li></li>');
      $('li').eq(i).append('<hr/><br><br>');
      $('li').eq(i).append( "<h2 class='text-center'>" + titles[i] + "</h2 class>" );
      $('li').eq(i).append('<br>');
      $('li').eq(i).append( "<h5 class='text-center'>" + moment(dates[i]).format("dddd, MMMM Do YYYY, h:mm:ss a") + "</h5>" );
      $('li').eq(i).append('<br><br>');
      $('li').eq(i).append( bodys[i] );
    }
  });

});

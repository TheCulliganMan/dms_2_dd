var http = require('http');
var url  = require('url');

const PORT=8080;

const requestHandler = (request, response) => {
  var url_vars = url.parse(request.url, true);
  var url_obj = url_vars.query;

  if ('dlat' in url_obj) {
    var dlat = url_obj.dlat;
  } else {
    var dlat = 0
  }

  if ('mlat' in url_obj) {
    var mlat = url_obj.mlat;
  } else {
    var mlat = 0
  }

  if ('slat' in url_obj) {
    var slat = url_obj.slat;
  } else {
    var slat = 0
  }

  if ('dlon' in url_obj) {
    var dlon = url_obj.dlon;
  } else {
    var dlon = 0
  }

  if ('mlon' in url_obj) {
    var mlon = url_obj.mlon;
  } else {
    var mlon = 0
  }

  if ('slon' in url_obj) {
    var slon = url_obj.slon;
  } else {
    var slon = 0
  }

  var latsign = 1.;
  var lonsign = 1.;
  var absdlat = 0;
  var absdlon = 0;
  var absmlat = 0;
  var absmlon = 0;
  var absslat = 0;
  var absslon = 0;

  if ((dlon == 0) && (mlon == 0) && (slon == 0) &&
      (dlat == 0) && (mlat == 0) && (slat == 0)) {
    response.end(
      '<html>\
        <h1>dms2dd</h1>\
        <p>Welcome to the dms 2 dd converter.</p>\
        <p>Url queries work like this:</p>\
        <code>http://[ip address]:[port]/?dlat=44&mlat=33&slat=22&dlon=44&mlon=33</code>\
        <p>Returns decimal degree coordinates in a json object:</p>\
        <code>{"latitude":44.556111,"longitude":44.55}</code>\
        <br /><br />\
        <div>\
          <form action="/" method="GET">\
            <label>Latitude Degrees <input type="text" name="dlat" value="" /></label> \
            <label>Latitude Minutes <input type="text" name="mlat" value="" /> \
            <label>Latitude Seconds <input type="text" name="slat" value="" /> \
            <br /><br />\
            <label>Longitude Degrees <input type="text" name="dlon" value="" /> \
            <label>Longitude Minutes <input type="text" name="mlon" value="" /> \
            <label>Longitude Seconds <input type="text" name="slon" value="" /> \
            <br /><br />\
            <input type="submit" /> \
          </form>\
      </div>\
      </html>');
  }

  function compareNumber(a, b) {

    if (a < b) return '-';
    else if (a === b) return '=';
    else if (a > b) return '+';
    else return 'z';
  }

  // Latitude Degrees
  if (compareNumber(dlat, 0) == '-' )  {
    latsign = -1.;
  } else {
    latsign = 1.;
  }
  absdlat = Math.abs(Math.round(dlat * 1000000.));

  if (compareNumber(absdlat, (90 * 1000000)) == '+' )  {
    response.statusCode = 406;
    response.end('Degrees Latitude must be in the range of -90 to 90. ');
  }

  // Latitude Minutes
  mlat = Math.abs(Math.round(mlat * 1000000.) / 1000000);
  absmlat = Math.abs(Math.round(mlat * 1000000.));

  if (compareNumber(absmlat, (60 * 1000000)) == '+') {
    response.statusCode = 406;
    response.end('Minutes Latitude must be in the range of 0 to 59. ');
  }

  // Latitude Seconds
  slat = Math.abs(Math.round(slat * 1000000.) / 1000000);
  absslat = Math.abs(Math.round(slat * 1000000.));

  if (compareNumber(absslat,  (59.99999999 * 1000000)) ==  '+' ) {
    response.statusCode = 406;
    response.end('Seconds Latitude must be 0 or greater \n and less than 60. ');
  }

  // Longitude Degrees
  if (compareNumber (dlon,  0) == '-' )  {
    lonsign = -1.;
  } else {
    lonsign = 1.;
  }
  absdlon = Math.abs( Math.round(dlon * 1000000.));

  if (compareNumber(absdlon, (180 * 1000000)) == '+') {
    response.statusCode = 406;
    response.end('Degrees Longitude must be in the range of -180 to 180. ');
  }

  // Longitude Minutes
  mlon = Math.abs(Math.round(mlon * 1000000.) / 1000000);
  absmlon = Math.abs(Math.round(mlon * 1000000));

  if (compareNumber(absmlon, (60 * 1000000)) == '+')   {
    response.statusCode = 406;
    response.end('Minutes Longitude must be in the range of 0 to 59. ');
  }

  // Longitude Seconds
  slon = Math.abs(Math.round(slon * 1000000.) / 1000000);
  absslon = Math.abs(Math.round(slon * 1000000.));

  if(compareNumber(absslon, (59.99999999 * 1000000)) == '+') {
    response.statusCode = 406;
    response.end('Seconds Latitude must be 0 or greater \n and less than 60. ');
  }

  var dd_lat = ((Math.round(absdlat + (absmlat / 60.) + (absslat/3600.)) / 1000000)) * latsign;
  var dd_lon = ((Math.round(absdlon + (absmlon / 60.) + (absslon/3600)) / 1000000)) * lonsign;

  response.end(JSON.stringify({'latitude': dd_lat, 'longitude': dd_lon}));

}

const server = http.createServer(requestHandler)

server.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`);
})

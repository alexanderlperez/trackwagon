// origin is true north, 0 deg on compass api
// also, center on the HTML graphic.  Going east is 0 - 180 deg
// going west is 181 - 360 deg
var distFromOrig = function (_rawHeading) {
  var SCALE = 1;  //change this!
  // check what case it is to do the right maths
  // check that everything is ok and we're within 360 deg
  if (_rawHeading <= 360 && _rawHeading > 0) {
    if (_rawHeading <= 180) {
      return _rawHeading * SCALE;
    } else if (_rawHeading >= 181) {
      return _rawHeading * -SCALE;
    }
  } else {
      alert('magneticHeading is in error!');
  }
};

var determineTranslation = function (_neededPos, _lastHeadingPos) {
  var value = 0;
  //check the sign of _neededPos to use the right maths
  if (_neededPos > 0 && _lastHeadingPos >= 0) {
    value = _lastHeadingPos - _neededPos;
  } 
  if (_neededPos < 0 && _lastHeadingPos <= 0) {
    value = -1 * (_lastHeadingPos - _neededPos);
  }
  if (_neededPos > 0 && _lastHeadingPos <= 0) {
    value = _lastHeadingPos + _neededPos;
  }
  if (_neededPos < 0 && _lastHeadingPos >= 0) {
    value = -1 * (_lastHeadingPos + _neededPos);
  }
  lastHeadingPos = _neededPos;
  return value;
};

var translateHeading = function (_heading) {
  // set the compass heading marker here
  var rawHeading = Math.round(_heading.magneticHeading);
  //get the target position to put on the compass line
  var neededPos = distFromOrig(rawHeading);
  // check if we're translating to the right or to the left
  // lastHeadingPos is defined at the top of the app object
  var xTranslation = determineTranslation(neededPos, lastHeadingPos);
  // take the heading and make the appropriate css transforms
  $('.heading').css('transform', 'translate3d(' + xTranslation + 'px, 0px, 0px)');
};

function _initGeoLoc () {
  var startingLoc = undefined;

  //getCurrentPosition callbacks
  var onSuccess = function (position) { 
    startingLoc = {};
    startingLoc.lat = position.coords.latitude;
    startingLoc.lng = position.coords.longitude;
  };

  var onError = function (error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n' +
          'Falling back to default location');
  };

  //try to get the initial position of the user
  navigator.geolocation.getCurrentPosition(onSuccess, onError, 
    {
      maximumAge: 3000,
      timeout: 5000,
      enableHighAccuracy: true
    }
  );

  return startingLoc;
}

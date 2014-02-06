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

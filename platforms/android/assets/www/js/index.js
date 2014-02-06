var app = (function () {
  var lastHeadingPos = 0;

  function _initialize(mapID) {
    _createMap(mapID, null);
    _initCompass('heading');

    //show the target's bearing in relation to the starting location
    if (DEBUG) {
      var target = new LatLon(40.693817, -73.984982);
      var loc = new LatLon(40.580609, -73.958642);
      var targetBearingElem = document.getElementById('target');
      var targetBearing = loc.bearingTo(target).toString();
      alert('target bearing: ' + targetBearing);
      targetBearingElem.innerHTML = targetBearing.toString();
    }
  }

  function _initCompass (_headingID) {
    var _onCompassSuccess = function (heading) {
      var roundedHeading = Math.round(heading.magneticHeading);
      // deal new compass heading to be processed ..

      if (DEBUG) {
        headingElem.innerHTML = roundedHeading.toString();
      }
    };

    // let's show the heading if DEBUG is set
    // initialize the text element
    if (DEBUG) {
      // make sure our elem exists
      // don't init anthing if it's not
      var headingElem = document.getElementById(_headingID);
      if (headingElem != undefined) {
        alert('Setting up the compass on ID: ' + _headingID);
        // grab the element we're working with
      } else {
        alert('ID doesn\'t exist!');
      }
    }

    // set up the watch to activate every 100ms
    var options = { frequency: 100 };
    navigator.compass.watchHeading(_onCompassSuccess, _onError, options);
  }

  function _createMap(_mapID, _startingLoc) {
    if (DEBUG) {
      alert('creating the map');
    }

    var home;
    var defaultHome = new google.maps.LatLng(40.580609, -73.958642);
    var bandwagon = new google.maps.LatLng(40.693817, -73.984982);

    //default home position if one is not given
    if (_startingLoc != undefined) {
      home = new google.maps.LatLng(_startingLoc.lat, _startingLoc.lng);
    } else {
      home = defaultHome;
    }

    var myOptions = {
      zoom: 15,
      center: bandwagon,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: mapStyle,
      disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById(_mapID), myOptions);

    var bandwagonMarker = new google.maps.Marker({
        position: bandwagon,
        map: map,
        title:"Bandwagon HQ"
    });

    var currentPos = new google.maps.Marker({
        position: home,
        map: map,
        title:"Current Location"
    });

    var latlngbounds = new google.maps.LatLngBounds();
    latlngbounds.extend(bandwagon);
    latlngbounds.extend(home);
    map.fitBounds(latlngbounds);

    var targetLine = new google.maps.Polyline({
      path: [home, bandwagon],
      strokeColor: '#ffffff',
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWeight: 5,
      icons: [{
        icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW }
      }]
    });
    targetLine.setMap(map);
  }


  function _onError (error) {
    alert("Compass Error: " + error.code);
  }

  return {
    initialize: _initialize
  };
})();

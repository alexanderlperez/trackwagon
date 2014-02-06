var app = (function () {
  var lastHeadingPos = 0;
  var locData = {};

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

  function _processBearingToTarget(_heading) {
    var targetHeading = locData.curLoc.bearingTo(locData.targetLoc);

    if (DEBUG) {
      alert("heading: " + _heading + 
            "\ntarget heading: " + targetHeading);
    }
  
    //clear the arrows of any colors
    $('.up, .down, .left, .right').removeClass('turn');

    // take translatedTargetHeading and see if current heading is to the left or right of where we need to be
    var corrections = '';
    // check if the target is north of us (in the top vertical semi)
    if (targetHeading <= 90 || (targetHeading < 360 && targetHeading >= 270)) {
      // tell the user to keep going north
      corrections += "north ";
      $('.up').addClass('turn');
    } else {
      // tell the user to keep going south
      corrections += "south ";
      $('.down').addclass('turn');
    }

    //check if we're in the same horiz semi as the target
    if ((_heading <= 180 && targetHeading <= 180) || (_heading > 180 && targetHeading > 180)) { 
      //no correction
    } else if (_heading <= 180 && targetHeading > 180) {
      // go west
      corrections += "west";
      $('.left').addClass('turn');
    } else if (_heading > 180 && targetHeading <= 180) {
      // go east
      corrections += "east";
      $('.right').addClass('turn');
    }
    
    if (DEBUG) {
      alert(corrections);
    }
  }

  function _initCompass (_headingID) {
    //everything gets done every 100ms, optimize
    var _onCompassSuccess = function (heading) {
      var roundedHeading = Math.round(heading.magneticHeading);
      // deal new compass heading to be processed ..
      _processBearingToTarget(roundedHeading);

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

    // preinitialize with my home and bandwagon's coordinates
    // will probably be more dynamic later
    var home;
    var defaultHome = new google.maps.LatLng(40.580609, -73.958642);
    var bandwagon = new google.maps.LatLng(40.693817, -73.984982);

    // will be more dynamic in the future
    locData.curLoc = new LatLon(defaultHome.lat(), defaultHome.lng());
    locData.targetLoc = new LatLon(bandwagon.lat(), bandwagon.lng());

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
      strokeColor: '#000000',
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

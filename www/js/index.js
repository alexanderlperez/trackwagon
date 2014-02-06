/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = (function () {
  var lastHeadingPos = 0;

  function _initialize(mapID) {
    _createMap(mapID, null);
    _initCompass('heading');
  }

  function _initCompass (_headingID) {
    // grab the element we're working with
    var headingElem = document.getElementById(_headingID);

    // make sure our elem exists
    // don't init anthing if it's not
    if (headingElem != undefined) {
      if (DEBUG) {
        alert('Setting up the compass on ID: ' + _headingID);
      }

      // set up the watch to activate every 100ms
      var options = { frequency: 100 };
      navigator.compass.watchHeading(function (heading) {
        var roundedHeading = Math.round(heading.magneticHeading);
        headingElem.innerHTML = roundedHeading.toString();
      }, _onError, options);
    } else {
      if (DEBUG) {
        alert('ID doesn\'t exist!');
      }
    }

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

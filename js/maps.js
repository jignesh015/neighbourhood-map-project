var map;

// Create a new blank array for all the listing markers.
var markers = [];

//Error handling for Google Maps API
var mapTimeout = setTimeout(function() {
    alert("Unable to connect to Google maps");
    $('#map').append('<h1>Sorry! Map not available</h1>');
}, 5000);

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 19.0760,
            lng: 72.8777
        },
        zoom: 11,
        styles: [{
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#a5b076'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#aa1111'
            }]
        }, {
            featureType: 'road.arterial',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#D4AC0D'
            }]
        }, {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#2471A3'
            }]
        }]
    });

    clearTimeout(mapTimeout);

    //Take title and lat-lng from model and store it in locArray
    var num = placeInfo.length;
    var locArray = [];
    for(var i = 0; i < num; i++) {
        var placeTitle = placeInfo[i].name;
        var obj = {
            title: placeInfo[i].name,
            location: {
                lat: placeInfo[i].lat,
                lng: placeInfo[i].lng
            }
        };
        locArray.push(obj);
    }

    var largeInfowindow = new google.maps.InfoWindow();

    var locNum = locArray.length;
    for (var i = 0; i < locNum; i++) {
        // Get the position and title from the locArray.
        var position = locArray[i].location;
        var title = locArray[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            map:map,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            bounceMarker(this);
            markerDisplayDetails(this.id);
        });
    }

    //Filter markers for paid places
    paidPlaceMarker = function() {
        for(var i = 0; i < locNum; i++) {
            if(placeInfo[i].filter === 1) {
                markers[i].setMap(map);
                bounceMarker(markers[i]);
            }
            else {
                markers[i].setMap(null);
            }
        }
    };

    //Filter markers for unpaid places
    unpaidPlaceMarker = function() {
        for(var i = 0; i < locNum; i++) {
            if(placeInfo[i].filter === 0) {
                markers[i].setMap(map);
                bounceMarker(markers[i]);
            }
            else {
                markers[i].setMap(null);
            }
        }
    };

    //Filter markers for all places
    allPlaceMarker = function() {
        for(var i = 0; i < locNum; i++) {
            markers[i].setMap(map);
            bounceMarker(markers[i]);
        }
    };

    //Animate marker when respective list item is clicked
    clickList = function(markerId) {
            var newMarker = markers[markerId];
            bounceMarker(newMarker);
            populateInfoWindow(newMarker, largeInfowindow);
    };

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 100;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading - 60,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>(No Street View Found)</div>');
                }
            }
            // Use streetview service to get the closest streetview image within
            // 100 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    //Add bounce animation to markers
    function bounceMarker(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(marker);

        function stopAnimation(marker) {
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2100);
        }
    }
}
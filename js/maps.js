var map;

// Create a new blank array for all the listing markers.
var markers = [];
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
        }
        locArray.push(obj);
    }

    // Create a single latLng literal object.
    var largeInfowindow = new google.maps.InfoWindow();

    var locNum = locArray.length;
    for (var i = 0; i < locNum; i++) {
        // Get the position from the location array.
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
        });
    }

    $('#paid').click(function() {        
        for(var i = 0; i < locNum; i++) {
            if(placeInfo[i].filter === 1) {
                markers[i].setMap(map);
                bounceMarker(markers[i]);
            }
            else {
                markers[i].setMap(null);
            }
        }
    });

    $('#unpaid').click(function() {
         for(var i = 0; i < locNum; i++) {
            if(placeInfo[i].filter === 0) {
                markers[i].setMap(map);
                bounceMarker(markers[i]);
            }
            else {
                markers[i].setMap(null);
            }
        }
    });

    $('#all').click(function() {
        for(var i = 0; i < locNum; i++) {
            markers[i].setMap(map);
            bounceMarker(markers[i]);
        }
    });

    clickList();

    function clickList() {
        $('#place-list').children().click(function() {
            var placeId = $(this).attr('id');
            var markerId = placeId.slice(-1);
            var newMarker = markers[markerId];
            bounceMarker(newMarker);
            populateInfoWindow(newMarker, largeInfowindow);         
        })
    }

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
            var radius = 50;
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
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    function bounceMarker(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        stopAnimation(marker);

        function stopAnimation(marker) {
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2000);
        }
    }
}
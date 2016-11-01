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

    var locations = [{
        title: 'Gateway of India',
        location: {
            lat: 18.921984,
            lng: 72.834654
        }
    }, {
        title: 'Bandra Worli Sealink',
        location: {
            lat: 19.028522,
            lng: 72.815312
        }
    }, {
        title: 'Juhu Beach',
        location: {
            lat: 19.119464,
            lng: 72.820160
        }
    }, {
        title: 'Sanjay Gandhi National Park',
        location: {
            lat: 19.231567,
            lng: 72.864186
        }
    }, {
        title: 'Byculla Zoo',
        location: {
            lat: 19.075984,
            lng: 72.877656
        }
    }, {
        title: 'Marine Drive',
        location: {
            lat: 18.941482,
            lng: 72.823679
        }
    }];
    // Create a single latLng literal object.
    var largeInfowindow = new google.maps.InfoWindow();

    // var singleLatLng = {lat: 41.40363, lng: 2.174356};
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        console.log(position);
        var title = locations[i].title;
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
        });
    }

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        console.log(infowindow);
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
}
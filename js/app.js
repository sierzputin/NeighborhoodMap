//styles for map
const styles = [{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#1a191f"
    }]
}, {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#366339"
    }]
}, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
        "color": "#2d6330"
    }]
}, {
    "featureType": "administrative",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "color": "#000000"
    }, {
        "weight": 0.85
    }]
}, {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#000000"
    }]
}, {
    "featureType": "administrative.province",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}];

//locations from web site: http://www.treknews.net/star-trek-conventions/
const locations = [{
        title: 'Super Megafest',
        location: {
            lat: 42.3422591,
            lng: -71.5907521
        },
        date: {
            day: 7,
            month: "April"
        },
        duration: 3,
        address: "Royal Plaza Trade Convention Center - Marlborough, MA"
    },
    {
        title: 'C2E2',
        location: {
            lat: 41.8512289,
            lng: -87.617034
        },
        date: {
            day: 21,
            month: "April"
        },
        duration: 3,
        address: "South Building at McCormick Place - Chicago, IL"
    },
    {
        title: 'Treklanta',
        location: {
            lat: 33.8488049802915,
            lng: -84.24721101970849
        },
        date: {
            day: 28,
            month: "April"
        },
        duration: 3,
        address: "Doubletree by Hilton - Tucker, GA"
    },
    {
        title: 'Denver Comic Con',
        location: {
            lat: 39.7423219,
            lng: -104.9966774
        },
        date: {
            day: 30,
            month: "June"
        },
        duration: 3,
        address: "Colorado Convention Center - Denver, CO"
    },
    {
        title: 'Shore Leave',
        location: {
            lat: 39.493904,
            lng: -76.66356069999999
        },
        date: {
            day: 7,
            month: "July"
        },
        duration: 3,
        address: "Hunt Valley Inn - Hunt Valley, MD"
    },
    {
        title: 'San Diego Comic-Con International',
        location: {
            lat: 32.7065281,
            lng: -117.1618385
        },
        date: {
            day: 20,
            month: "July"
        },
        duration: 4,
        address: "San Diego Convention Center - San Diego, CA"
    },
    {
        title: 'Official Star Trek Convention - Las Vegas',
        location: {
            lat: 36.1175148,
            lng: -115.1881593
        },
        date: {
            day: 2,
            month: "August"
        },
        duration: 5,
        address: "Rio Suites Hotel - Las Vegas, NV"
    },
    {
        title: 'Boston Comic Con',
        location: {
            lat: 42.34667959999999,
            lng: -71.04501309999999
        },
        date: {
            day: 11,
            month: "August"
        },
        duration: 3,
        address: "Boston Convention Center - Boston, MA"
    },
    {
        title: 'Star Trek: The Continuing Voyage - Chicago',
        location: {
            lat: 41.9889297,
            lng: -87.8613702
        },
        date: {
            day: 15,
            month: "September"
        },
        duration: 3,
        address: "Westin O’Hare Hotel - Rosemont, Il"
    },
    {
        title: 'Star Trek: The Continuing Voyage - New Jersey',
        location: {
            lat: 40.8412437,
            lng: -74.45529759999999
        },
        date: {
            day: 29,
            month: "September"
        },
        duration: 3,
        address: "Hilton Parsippany - Parsippany, NJ"
    },
    {
        title: 'New York Comic Con',
        location: {
            lat: 40.757777,
            lng: -74.002591
        },
        date: {
            day: 5,
            month: "October"
        },
        duration: 4,
        address: "Javits Center - New York, NY"
    },
    {
        title: 'Star Trek: The Continuing Voyage - San Francisco',
        location: {
            lat: 37.59361,
            lng: -122.36527
        },
        date: {
            day: 14,
            month: "October"
        },
        duration: 2,
        address: "Hyatt Regency San Francisco Airport - Burlingame, CA"
    }
];

const monthsSelect = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class NeighorhoodMapViewModel {
    constructor () {
        this.locationsList = ko.observableArray(locations);
        this.markers = [];
        this.selectorLabel = "Choose a month:";
        this.mainTitle = "StarTrek Con 2017";
        this.status = ko.observable();
        this.selectedMonth = ko.observable();
        // this.selectedMonth = mnth => {
        //     this.selectedMonth(mnth);
        // };
        this.displayWithinMonth = function(){};
        this.filterByLocation = ko.computed(() => {
            this.status("");
            if (!this.selectedMonth()) {
                this.displayWithinMonth(this.markers);
                return this.locationsList();
            } else {
                let monthMarkers = [];
                return ko.utils.arrayFilter(this.locationsList(), location => {
                    for (let i = 0; i < this.markers.length; i++) {
                        if( this.markers[i].month===this.selectedMonth())
                            monthMarkers.push(this.markers[i]);
                    }
                    if (monthMarkers.length !== 0)
                        this.displayWithinMonth(monthMarkers);
                    else {
                        this.status("There are no events in " + this.selectedMonth());
                        hideLocations();
                    }
                    return(location.date.month === this.selectedMonth());
                });
            }
       });

        //displang  events for selected month
        this.displayWithinMonth = monthMarkers => {
            hideLocations();
            let bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < monthMarkers.length; i++) {
                    monthMarkers[i].setVisible(true);
                    bounds.extend(monthMarkers[i].position);
            }
            map.fitBounds(bounds);
        }

        //function for clicking an item on a list
        this.listElemClicked = data => {
            markerSetAnimation(data, false);
        }
    }
};

let nm = new NeighorhoodMapViewModel();
ko.applyBindings(nm);

let map;
let infowindow;

//google maps initialization
initMap = () => {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.774769,
            lng: -98.085937
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow({
		maxWidth: 300
	});
    let image = {
        url: 'img/star_ico.png',
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 40)
    };

    let imageRed = {
        url: 'img/star_ico_red.png',
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 40)
    };

    //set shape to badge
    let shape = {
        coords: [18, 4, 12, 18, 10, 32, 21, 24, 29, 27, 18],
        type: 'poly'
    };

    let marker;

    for (let i = 0; i < locations.length; i++) {
        let position = locations[i].location;
        let title = locations[i].title;

        //if an event is main event (according to my friend:)
        if (title === "Official Star Trek Convention - Las Vegas") {
            marker = new google.maps.Marker({
                position: position,
                address: locations[i].address,
				day: locations[i].date.day,
				month: locations[i].date.month,
				duration: locations[i].duration,
                title: title,
                icon: imageRed,
                shape: shape,
                animation: google.maps.Animation.DROP,
                id: i
            });
        } else {
            marker = new google.maps.Marker({
                position: position,
                address: locations[i].address,
				day: locations[i].date.day,
				month: locations[i].date.month,
				duration: locations[i].duration,
                title: title,
                icon: image,
                shape: shape,
                animation: google.maps.Animation.DROP,
                id: i
            });
        }

        nm.markers.push(marker);
        marker.addListener('click', function() {
            markerClicked(this);
        });
    }
    showLocations();

}

mapError = () => {
  $("#map").append("<h1>There is problem with loading map</h1>");
}

//function for clicking marker
markerClicked = (marker) => {

    if (infowindow.marker != marker) {
        markerSetAnimation(marker, true);
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            marker.setAnimation(null);
            infowindow.marker = null;
        });
        let streetViewService = new google.maps.StreetViewService();
        let radius = 50;

        //geting street view
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
               // $("#pan").append("<div id='pano'></div>");
                let nearStreetViewLocation = data.location.latLng;
                let heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                let panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                let panorama = new google.maps.StreetViewPanorama(document.getElementById('pan'), panoramaOptions);
                console.log("pan");
            } else {
                $("#pan").append("There is no street view");
            }
        }

        // geting link for wikipedia
        let wikiLinkContent = "";
        let contentString = '<div class="iw-title">' + marker.title + '</div><div class="iw-address">' + marker.address + '</div><div class="iw-address">'+marker.duration+' days of adventure starting '+marker.day+' of '+marker.month+'</div><div id="pan"></div>';

        $.ajax({
            type: "get",
            url: 'https://en.wikipedia.org/w/api.php',
            data: {
                action: 'query',
                list: 'search',
                srsearch: marker.title,
                format: 'json'
            },
            dataType: 'jsonp',
            success: data => {
                if(data)
                    wikiLinkContent = '<p class="wiki-links">Wiki: <a href="http://en.wikipedia.org/wiki/' + data.query.search[0].title + '">' + data.query.search[0].title + '</a></p>';
                else
                    wikiLinkContent = '<p class="wiki-links">Wiki: no data available at this time</p>';
                contentString += wikiLinkContent;
                infowindow.setContent(contentString);
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                infowindow.open(map, marker);
                map.setCenter(marker.getPosition());
            },
            error: () => {
                wikiLinkContent = '<p class="wiki-links">There were problems with wikipedia request</p>';
                contentString += wikiLinkContent;
                infowindow.setContent(contentString);
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                infowindow.open(map, marker);
                map.setCenter(marker.getPosition());
            },
            timeout: 3000
        });
    }
}

//animating clicked marker
markerSetAnimation = (marker, isMarkerClicked) => {
    if (nm.markers) {
        for (let i = 0; i < nm.markers.length; i++) {
            if (marker.title === nm.markers[i].title) {
                nm.markers[i].setAnimation(1);
                if (!isMarkerClicked)
                    markerClicked(nm.markers[i]);
            } else {
                nm.markers[i].setAnimation(null);
            }

        }
    }
}

//showing all locations on map
showLocations = () => {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < nm.markers.length; i++) {
        nm.markers[i].setMap(map);
        bounds.extend(nm.markers[i].position);
    }
    map.fitBounds(bounds);
}

//hiding all locations
hideLocations = () => {
    for (let i = 0; i < nm.markers.length; i++) {
        nm.markers[i].setVisible(false);
    }
}


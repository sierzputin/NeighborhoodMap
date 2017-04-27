# starTrekMap
## General
This application lets you see all Star Trek conventions in 2017 in US. You can filter events by the months that they are starting in. Additional information is displayed in infoWindow on the map: title, address, date, streetView and Wikipedia link to search of given event.

## Installation
To start app you need to add your google api key (for google maps and street view)to the index.html (or index-max.html) file in place of *API_KEY*. This is at the bottom of the file.

```
 <script async defer
         src="https://maps.googleapis.com/maps/api/js?key=API_KEY&v=3&callback=initMap"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
 <script>
```

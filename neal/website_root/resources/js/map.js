var root_api = "http://nmarquez.ovid.u.washington.edu:1112/";
var mymap = L.map('map').setView([47.6,-122.3], 13);



L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
  maxZoom: 18, minZoom: 12,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);


L.marker([47.6,-122.3]).addTo(mymap)
  .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

L.circle([47.61,-122.25], 500, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am the Loch Ness Monster.");


var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

mymap.on('click', onMapClick);

$(document).ready(function(){

        $.getJSON(root_api + "locations/list", function( data ) {
          $.each( data, function( key, val ) {
            $('#locations select').append('<option value="' + key + '">'+val.neighborhood+'</option>');
          });
        });

        $.getJSON(root_api + "crime/types", function( data ) {
          $.each( data, function( key, val ) {
            $('#crimes select').append('<option value="' + key + '">'+val.clearance_group_description+'</option>');
          });
        });
});

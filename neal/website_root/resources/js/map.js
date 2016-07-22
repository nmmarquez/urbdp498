var root_api = "http://nmarquez.ovid.u.washington.edu:1112/";
var mymap = L.map('map', { zoomControl:false }).setView([47.6,-122.3], 13);

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function text_for_html(str){
	var new_str = str.replaceAll(" ", "%20")
	new_str = new_str.replaceAll("/", "%2F")
	new_str = new_str.replaceAll('"', "%22")
	return new_str
}

var map_token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw'

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + map_token, {
  maxZoom: 18, minZoom: 11,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

// Add our zoom control manually where we want to
var zoomControl = L.control.zoom({
    position: 'topright'
});
mymap.addControl(zoomControl);


//put all your markers on a specific layers in case you want to remove all the markers quickly
//http://leafletjs.com/examples/layers-control.html
var markers = new L.FeatureGroup();


$(document).ready(function(){

	marker_crime();
	draw_timeline();
  draw_hist();

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

	$('#location_select option').on('click', function(){
	    $('#neighborhood').val($(this).text());
	});

	$('#location_select').change(function () {
    	    var selectedText = $(this).find("option:selected").text();
          $("#selected_neighborhood").text(selectedText);
          set_neigh_view()
	});

	$('#crime_select').change(function () {
    	var selectedText = $(this).find("option:selected").text();
	    $("#selected_crime").text(selectedText);
      marker_crime();
	    draw_timeline();
      draw_hist();
	});

  function set_neigh_view(){
    var lat = 0;
    var long = 0;
    var html_neigh_var = text_for_html($("#selected_neighborhood").text());

    $.getJSON( root_api + "locations/coordinates/" + html_neigh_var, function( data ) {
        lat = data[0].latitude
        long = data[0].longitude
        mymap.setView([lat,long], 15);

    });

  }

	function marker_crime() {
		markers.clearLayers();

		html_crime_var = text_for_html($("#selected_crime").text());

		// call the api where the data is stored
		$.getJSON( root_api + "crime/all/" + html_crime_var, function( data ) {

	// add the clustering variable
          var markerClusters = L.markerClusterGroup();

					// Jquery method that allows you to iterate over an array: http://api.jquery.com/jquery.each/
					$.each(data, function(k,v){

						// add to the map the marker corresponding to one instance of a tree
						var marker = L.marker([v.latitude, v.longitude]);
						var popup = L.popup().setContent("Crime Occured on: " + v.time);
						marker.bindPopup(popup).openPopup();

					    // add marker to cluster object
					    markerClusters.addLayer(marker);

					});

          // add the cluster to the map
	  markers.addLayer(markerClusters);
          mymap.addLayer(markers);

		});

	}; //end of function marker_crime();


  $("#info-pane").mouseenter(function() {
    draw_timeline()
  });
  $("#info-pane").mouseleave(function() {
    draw_timeline()
  });
  $("#display-pane").mouseenter(function() {
    draw_hist()
  });
  $("#display-pane").mouseleave(function() {
    draw_hist()
  });
});

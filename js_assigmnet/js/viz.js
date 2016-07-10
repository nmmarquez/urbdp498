//define your map variable - good start!
var map;

//We will call an API many time, we might as well store that long string to make the rest of the code simpler
var root_api = "http://ec2-54-234-216-12.compute-1.amazonaws.com:5432/";

//define the center of the initial map
var mapCenter = {lat: 47.6,lng:-122.3};


//define your markers: http://leafletjs.com/examples/custom-icons.html
var treeicon = L.icon({
    iconUrl: 'http://leafletjs.com/docs/images/leaf-green.png',
		// shadowUrl: 'http://leafletjs.com/docs/images/leaf-shadow.png',
    iconSize: [28, 48], //new L.Point(XX, XX),
    popupAnchor: [0, 0]// new L.Point(-XX, -XX)
});

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function calcScreenRadius(){
  var lat1 = map.getBounds()._southWest.lat;
  var lon1 = map.getBounds()._southWest.lng;
  var lat2 = map.getBounds()._northEast.lat;
  var lon2 = map.getBounds()._northEast.lng;
  var rad = getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) * 1000 / 2.01;
  return rad
}

// // Lets check out the types of several objects
// console.log(new L.Point(28, 48));
// console.log([28, 48]);
// console.log(L.Point(28, 48));

//put all your markers on a specific layers in case you want to remove all the markers quickly
//http://leafletjs.com/examples/layers-control.html
var markers = new L.FeatureGroup();

//push all the data in this array in case you are using the heatmap plugin
var markerArray = [];

//https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {

		//set your map and some options of the view
		map = L.map('map-canvas').setView([mapCenter.lat,mapCenter.lng], 17);

		//define your tile and add it to the map
		L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, '+
		'<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash;'+
		' Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		,ext: 'png', minZoom:1, maxZoom:19}).addTo(map);

		//call a function that will ad the markers
		// marker_sample();
		// marker_cluster();
		// marker_heatmap();
		marker_radius();

	//do something when there is a drag event: http://leafletjs.com/reference.html#events
	map.on('dragend', function() {
		// get the coordinates of the center of the map
		mapCenter = L.latLng(map.getCenter());
		// if you are using a feature group layer, remove the markers
		map.removeLayer(markers);
		// draw the markers again
		marker_radius();
	}); //end of drag event

	// $("#input-location").on("click", function() {
	// 	var latitude = $("#latitude").val();
	// 	var longitude = $("#longitude").val();
	// 	if (!isNaN(latitude) & !isNaN(longitude) & Math.abs(latitude) <= 90 & Math.abs(longitude) <= 180) {
	// 		mapCenter = {lat: latitude,lng:longitude};
	// 		map.setView([mapCenter.lat,mapCenter.lng], 17);
	// 		map.removeLayer(markers);
	// 		marker_radius();
	// 	}
	// })

	//define your function for drawing the sample markers
	function marker_sample() {

		// call the api where the data is stored
		$.getJSON( root_api + "trees", function( data ) {

          // add the clustering variable
          var markerClusters = L.markerClusterGroup();

					// Jquery method that allows you to iterate over an array: http://api.jquery.com/jquery.each/
					$.each(data, function(k,v){

						// // add to the map the marker corresponding to one instance of a tree
						// var marker = L.marker([v.point_y, v.point_x]).addTo(map);
						// console.log(v.point_x, v.point_y);
						//var marker = L.marker([v.point_y, v.point_x],{icon: treeicon}).addTo(map);
						// below the version with a click event added

						var marker = L.marker([v.point_y, v.point_x],{icon: treeicon}).on('click', function() {
									// get description data for your marker
									$.getJSON(root_api + "trees/description/" + v.fid, function(data) {
										// define your popup and add some content in it
										var popup = L.popup().setContent(data[0].tree_type);
										// version if you want to specify some options for your popup
										// var popup = L.popup({options_there}).setContent(somecontent);
										// bind your popup to your marker and open it
										marker.bindPopup(popup).openPopup();
									});

								})
							// add the marker to the map
							//.addTo(map);

            // add marker to cluster object
            markerClusters.addLayer(marker);

					});

          // add the cluster to the map
          map.addLayer(markerClusters);

		});

	}; //end of function marker_sample();


	function marker_heatmap() {

		$.getJSON( root_api + "trees", function( data ) {

					$.each(data, function(k,v){

						markerArray.push({lat:v.point_y, lng: v.point_x});

					});

				var heat = L.heatLayer(markerArray, {
											            radius: 14,
											            blur: 15,
											            maxZoom: 20,
											        });
				heat.addTo(map);

		});

	}; //end of function marker_heatmap

  function marker_radius() {

    markers.clearLayers();

    var radius = calcScreenRadius();

    $.getJSON( root_api + "trees/around/" + radius + "/" + mapCenter.lat + "/" + mapCenter.lng, function( data ) {

          //use this variable to return the total number of trees in the window (last step of the workshop)
          var total_trees = 0;
          // cluster group variable
          var markerClusters = L.markerClusterGroup();

          $.each(data, function(k,v){

            //var marker = L.marker([XX, XX]).addTo(map);
            var marker = L.marker([v.point_y, v.point_x],{icon: treeicon}).on('click', function() {
                  // get description data for your marker
                  $.getJSON(root_api + "trees/description/" + v.fid, function(data) {
                    // define your popup and add some content in it
                    var popup = L.popup().setContent(data[0].tree_type);
                    // version if you want to specify some options for your popup
                    // var popup = L.popup({options_there}).setContent(somecontent);
                    // bind your popup to your marker and open it
                    marker.bindPopup(popup).openPopup();
                  });

                })
              // add the marker to the map
              //.addTo(map);

            // add marker to cluster object
            markerClusters.addLayer(marker);
            total_trees += 1;
            console.log(total_trees);

          });

      // add the cluster to the map
      markers.addLayer(markerClusters);
      map.addLayer(markers);
      $("#treeNum").html(total_trees);

    });

  }; //end of function marker_radius


});

console.log("this is the main source for debugging");

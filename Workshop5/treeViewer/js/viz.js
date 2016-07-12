//define your map variable - good start!
var map;

//We will call an API many time, we might as well store that long string to make the rest of the code simpler
//STEP 10: enter here your server URL (ex: http://vergil.u.washington.edu:34001) - Don't forget to put it in quotation marks
var root_api = XX;

var mapCenter = {lat: 47.654967,lng:-122.312668};

//define your markers: http://leafletjs.com/examples/custom-icons.html
var treeicon = L.icon({
    iconUrl: 'img/tree.png',
    iconSize: new L.Point(30, 30),
    popupAnchor: new L.Point(0, -10)
});

//put all your markers on a specific layers in case you want to remove all the markers quickly
//http://leafletjs.com/examples/layers-control.html
var markers = new L.FeatureGroup();

//store in variable the type of tree visualized
var type_tree = "";

//https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {


		//set your map and some options of the view
		map = L.map('map-canvas').setView([mapCenter.lat,mapCenter.lng], 15);

		//you can look at what bounding_box corresponds to by using console.log
		//console.log(map.getBounds());

		//define tile and add it to the map
		var your_tile = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		,ext: 'png', minZoom:15, maxZoom:20})
		your_tile.addTo(map);

		//start drawing the first 100 trees within the window
		draw_sample();

		//make possible to enter a lat/long in the form - Don't change anything in this click function
	$("#input-location").on("click", function() {
		var latitude = $("#latitude").val();
		var longitude = $("#longitude").val();
		if (!isNaN(latitude) & !isNaN(longitude) & Math.abs(latitude) <= 90 & Math.abs(longitude) <= 180) {
			mapCenter = {lat: latitude,lng:longitude};
			map.setView([mapCenter.lat,mapCenter.lng], 17);
			map.removeLayer(markers);
			if (type_tree == "") {
				draw_sample()
			}
			else {
		    	draw_type(type_tree);	
			}
		}
	})

	//add event when click the clear markers button
	$("#clearLink").click( function(event){
			markers.clearLayers();
			$("#treeNum").html(0);
		});

	// //in case you want to have individual click events for each tree type
	// $("#Maple").click(function(event) {
	// 	markers.clearLayers();
	// 	draw_type("Maple");
	// })

	//STEP 13: in case you want to have a global behavior for all tree types
	$("#types a").click(function(event) {
		markers.clearLayers();
		type_tree = $(this).attr("id"); //console.log($(this).attr("id"),this.id)
		draw_type(type_tree);
	})

	//clear markers when you start dragging the map
	map.on('dragstart', function onDragStart() {
		markers.clearLayers();
		$("#treeNum").html(0);
	})

	//draw the new markers when you stop dragging the map
	map.on('dragend', function onDragEnd(){
		if (type_tree == "") {
			//draw_sample()
			//because the map can keep moving once you stop dragging the map, add a short delay
			setTimeout(draw_sample(),500)	
		}
		else {
	    	//draw_type(type_tree);	
	    	setTimeout(draw_type(type_tree),500)		
		}
    });

	//STEP 11: from here to the end of draw_sample function
	//define your function for drawing 100 markers in the window
	// function draw_sample() {

	// 	//call the api where the data is stored - notice the use of map.getBounds()
	// 	$.getJSON( root_api + "trees/sample" + "/" + map.getBounds().getSouth() + "/" + map.getBounds().getNorth() + "/" + map.getBounds().getWest() + "/" + map.getBounds().getEast(), function( data ) {

	// 				//create a variable to count the total number of trees displayed in the window
	// 				var total_trees = 0;

	// 				//Visualize the data returned by the API
	// 				//console.log(data);
					
	// 				//Jquery method that allows you to iterate over an array: http://api.jquery.com/jquery.each/
	// 				$.each(data, function(k,v){

	// 					//Visualize each object in the array returned by the API
	// 					//console.log(v);
						
	// 					//Create markers with the customized icon.
	// 					var marker = L.marker([XX, XX],{icon: XX})
	// 					//count the number of trees
	// 					total_trees += 1;
	// 					//add the current marker to the marker layer
	// 					markers.addLayer(marker);

	// 				}); // end of the each function

	// 				//add the markers
	// 				map.addLayer(markers);
	// 				//add the number of trees in the bottom right corner div
	// 				$("#treeNum").html(total_trees);

	// 	}); // end of the getjson function

	// }; // end of draw_sample function

	//STEP 14: define your function for drawing the trees of a specific type
	// function draw_type(type_tree) {

	// 	// console.log(root_api + "trees/XX/" + type_tree + "/" + map.getBounds().getSouth() + "/" + map.getBounds().getNorth() + "/" + map.getBounds().getWest() + "/" + map.getBounds().getEast());

	// 	//call the api where the data is stored
	// 	$.getJSON( root_api + "trees/XX/" + type_tree + "/" + map.getBounds().getSouth() + "/" + map.getBounds().getNorth() + "/" + map.getBounds().getWest() + "/" + map.getBounds().getEast(), function( data ) {

	// 				var total_trees = 0;

	// 				//Visualize the data returned by the API
	// 				//console.log(data);
					
	// 				//Jquery method that allows you to iterate over an array: http://api.jquery.com/jquery.each/
	// 				$.each(data, function(k,v){

	// 					//Visualize each object in the array returned by the API
	// 					//console.log(v);
						
	// 					//Create markers with the customized icon.
	// 					var marker = L.marker([XX, XX],{icon: XX});
	// 					//count the number of trees
	// 					total_trees += 1;
	// 					//add the current marker to the marker layer
	// 					markers.addLayer(marker);

	// 				}); // end of the each function

	// 				//Add the markers to the map
	// 				map.addLayer(markers);
	// 				//add the number of trees in the bottom right corner div
	// 				$("#treeNum").html(total_trees);

	// 	}); // end of the getjson function

	// }; //end of function draw_markers();

}); // end of document ready function

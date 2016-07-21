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


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
  maxZoom: 18, minZoom: 12,
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
// Add our loading control in the same position and pass the
// zoom control to attach to it
// var loadingControl = L.Control.loading({
//     position: 'topright',
//     zoomControl: zoomControl
// });
// mymap.addControl(loadingControl);


//put all your markers on a specific layers in case you want to remove all the markers quickly
//http://leafletjs.com/examples/layers-control.html
var markers = new L.FeatureGroup();


(function () {
    $(function () {
        var SideBAR;
        SideBAR = (function () {
            function SideBAR() {}

            SideBAR.prototype.expandMyMenu = function () {
                return $("nav.sidebar").removeClass("sidebar-menu-collapsed").addClass("sidebar-menu-expanded");
            };

            SideBAR.prototype.collapseMyMenu = function () {
                return $("nav.sidebar").removeClass("sidebar-menu-expanded").addClass("sidebar-menu-collapsed");
            };

            SideBAR.prototype.showMenuTexts = function () {
                return $("nav.sidebar ul a span.expanded-element").show();
            };

            SideBAR.prototype.hideMenuTexts = function () {
                return $("nav.sidebar ul a span.expanded-element").hide();
            };

            SideBAR.prototype.showActiveSubMenu = function () {
                $("li.active ul.level2").show();
                return $("li.active a.expandable").css({
                    width: "100%"
                });
            };

            SideBAR.prototype.hideActiveSubMenu = function () {
                return $("li.active ul.level2").hide();
            };

            SideBAR.prototype.adjustPaddingOnExpand = function () {
                $("ul.level1 li a.expandable").css({
                    padding: "1px 4px 4px 0px"
                });
                return $("ul.level1 li.active a.expandable").css({
                    padding: "1px 4px 4px 4px"
                });
            };

            SideBAR.prototype.resetOriginalPaddingOnCollapse = function () {
                $("ul.nbs-level1 li a.expandable").css({
                    padding: "4px 4px 4px 0px"
                });
                return $("ul.level1 li.active a.expandable").css({
                    padding: "4px"
                });
            };

            SideBAR.prototype.ignite = function () {
                return (function (instance) {
                    return $("#justify-icon").click(function (e) {
                        if ($(this).parent("nav.sidebar").hasClass("sidebar-menu-collapsed")) {
                            instance.adjustPaddingOnExpand();
                            instance.expandMyMenu();
                            instance.showMenuTexts();
                            instance.showActiveSubMenu();
                            $(this).css({
                                color: "white"
                            });
                        } else if ($(this).parent("nav.sidebar").hasClass("sidebar-menu-expanded")) {
                            instance.resetOriginalPaddingOnCollapse();
                            instance.collapseMyMenu();
                            instance.hideMenuTexts();
                            instance.hideActiveSubMenu();
                            $(this).css({
                                color: "#FFF"
                            });
                        }
                        return false;
                    });
                })(this);
            };

            return SideBAR;

        })();
        return (new SideBAR).ignite();
    });

}).call(this);

$(document).ready(function(){

	marker_crime()
	draw_timeline()

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

	    // $("#test").text(selectedText);
	});

	$('#crime_select').change(function () {
    	    var selectedText = $(this).find("option:selected").text();

	    $("#selected_crime").text(selectedText);
            marker_crime();
	    draw_timeline();
	});

	function marker_crime() {
		markers.clearLayers();

		html_crime_var = text_for_html($("#selected_crime").text());
		console.log(html_crime_var);

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




	function draw_timeline() {

		var crime_date = [];
		var count = [];
		html_crime_var = text_for_html($("#selected_crime").text());

		$.getJSON( root_api + "crime/timeline/" + html_crime_var, function( data ) {

			//look at the data returned by your API
			//console.log(data);

			//What is the for loop doing?
			// this function is looping through the results to build an array filled with the results from the api
			for (i = 0; i < data.length; i++){
                        crime_date.push(data[i].year_id);
                        count.push(data[i].NumberOfCrimes);
            		}


			$(function () {
			  $('#info-pane').highcharts({
			      chart:{backgroundColor:'rgba(0, 0, 0, 0.7)'},
			      title: {
				  text: 'Crime Occurences',
				  x: -20 //center
			      },
			      xAxis: {
				  categories: crime_date
			      },
			      yAxis: {
				  title: {
				      text: 'Occurences'
				  },
				  plotLines: [{
				      value: 0,
				      width: 1,
				      color: '#808080'
				  }]
			      },
			      tooltip: {
				  valueSuffix: ''
			      },
			      legend: {
				  layout: 'vertical',
				  align: 'right',
				  verticalAlign: 'middle',
				  borderWidth: 0
			      },
			      series: [{
				  name: 'All Seattle',
				  data: count
			      }]
			  });
			});
		});
	};
});

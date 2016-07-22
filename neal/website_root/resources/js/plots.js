function draw_timeline() {

  var crime_date = [];
  var count = [];
  var html_crime_var = text_for_html($("#selected_crime").text());

  $.getJSON( root_api + "crime/timeline/" + html_crime_var, function( data ) {

    for (i = 0; i < data.length; i++){
                      crime_date.push(data[i].year_id);
                      count.push(data[i].NumberOfCrimes);
              }

    $(function () {
      $('#info-pane').highcharts({
          chart:{backgroundColor:'rgba(0, 0, 0, 0.7)'},
          title: { text: $("#selected_crime").text() + " Timeline", x: -20 },
          xAxis: { categories: crime_date },
          yAxis: {
            title:   { text: 'Occurences' },
            plotLines: [{ value: 0,width: 1, color: '#808080'}]
          },
          tooltip: { valueSuffix: '', style: { fontSize: '15pt' },},
          legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0 },
          series: [{ name: 'All Seattle', data: count }]
      });
    });
  });
};

function draw_hist() {

  var neighborhoods = [];
  var crime_numbers = [];
  var html_crime_var = text_for_html($("#selected_crime").text());

  $.getJSON( root_api + "crime/neighborhoodcount/" + html_crime_var, function( data ) {

    for (i = 0; i < data.length; i++){
                      neighborhoods.push(data[i].neighborhood);
                      crime_numbers.push(data[i].crime_number);
          }

    $('#display-pane').highcharts({
          chart: { type: 'column', backgroundColor:'rgba(0, 0, 0, 0.7)'},
          title: { text: $("#selected_crime").text() + ' per Neigborhhod' },
          xAxis: {
            categories: neighborhoods,
            title: { text: null },
            labels: {
              style: { fontSize:'15px' }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Number of Crimes',
              },
              labels: {
                  overflow: 'justify',
                  style: { fontSize:'15px' }
                }
              },
          tooltip: {
              style: { fontSize: '15pt' },
              valueSuffix: ' trees',
              formatter: function() {
                return 'There are <b>'+ this.y +
                '</b> Occurences in <b>' + this.x + '</b>';
              }
          },
          plotOptions: {
              bar: {
                  dataLabels: { enabled: true }
              }
          },
          credits: { enabled: false },
          series: [{ data: crime_numbers, showInLegend:false }]
      }); // end of timeline function

  }) // end of getJSON function

}; // end of draw_timeline function

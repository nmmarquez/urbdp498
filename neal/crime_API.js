#!/usr/bin/env node

//   Test API Server
//  Author:  Philippe Vaillant



var moment = require('moment');

// Find an available port number on the server
// Type in the terminal 'telnet localhost' and a number between 1024 and 65000
// If it returns connection refused, the port is available and you can write it down below
// Replace XX by the available portnumber
var portNumber = 1112;

var mysql = require('mysql');

// MySQL Connection Variables
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  //Replace XX by your mysql password - Make sure you use quotation marks: 'mypassword'
  password : 'Tlaloc1',
  //Replace XX by your mysql port
  port     : 8000,
  //Replace XX by the name of your database - Make sure you use quotation marks: 'mydatabase'
  database : 'tree'
});

connection.connect(function(err) {
    if(err) throw err
    console.log('connected!')
});

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

app.get('/test', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  res.send('coucou');
});

app.get('/crime/location/:type/:minlat/:maxlat/:minlong/:maxlong', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  //Below is the sql whose result will be returned in the URL
  // Replace test by the name of your database
  var type = mysql_real_escape_string(req.params.type);
  var minlat = parseFloat(req.params.minlat);
  var maxlat = parseFloat(req.params.maxlat);
  var minlong = parseFloat(req.params.minlong);
  var maxlong = parseFloat(req.params.maxlong);
  var sql = "SELECT longitude, latitude, time, time_at_scene " +
            "FROM test.call_data " +
            "WHERE clearance_group_id = (SELECT clearance_group_id " +
            "FROM test.clearance_group WHERE clearance_group_description = '" +
            type + "') " +
            "AND latitude BETWEEN " +  minlat + "AND " + maxlat +
            "AND longitude BETWEEN " + minlong + "AND " + maxlong + " ;"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

app.get('/crime/all/:type', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  //Below is the sql whose result will be returned in the URL
  // Replace test by the name of your database
  var type = mysql_real_escape_string(req.params.type);
  var sql = "SELECT longitude, latitude, time, time_at_scene " +
            "FROM test.call_data " +
            "WHERE clearance_group_id = (SELECT clearance_group_id " +
            "FROM test.clearance_group WHERE clearance_group_description = '" +
            type + "') LIMIT 10000;"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

app.get('/crime/timeline/:type', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  //Below is the sql whose result will be returned in the URL
  // Replace test by the name of your database
  var type = mysql_real_escape_string(req.params.type);
  var sql = "SELECT DATE_FORMAT(time, '%Y-%m') AS year_id, COUNT(*) AS NumberOfCrimes " +
            "FROM test.call_data " +
            "WHERE clearance_group_id = (SELECT clearance_group_id " +
            "FROM test.clearance_group WHERE clearance_group_description = '" +
            type + "') GROUP BY year_id ORDER BY year_id;"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

// the : indicates that you can enter different values and the URLs will be treated in the same manner
app.get('/crime/types/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var sql = "SELECT clearance_group_description FROM test.clearance_group ORDER BY clearance_group_description;"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

// the : indicates that you can enter different values and the URLs will be treated in the same manner
app.get('/locations/list', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var sql = "SELECT S_HOOD as neighborhood FROM test.neighborhood_id ORDER BY S_HOOD;"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

// the : indicates that you can enter different values and the URLs will be treated in the same manner
app.get('/locations/coordinates/:loc', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var loc = mysql_real_escape_string(req.params.loc);
  var sql = "SELECT latitude, longitude FROM test.neighborhood WHERE neighborhood = '" + loc + "';"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

app.get('/crime/neighborhoodcount/:type', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var type = mysql_real_escape_string(req.params.type);
  var sql = "SELECT y.S_HOOD as neighborhood, count(y.S_HOOD) as crime_number " +
  "FROM test.call_data x " +
  "LEFT JOIN test.neighborhood_id y " +
  "ON x.HOODS_ID = y.HOODS_ID " +
  "WHERE x.clearance_group_id = (SELECT clearance_group_id " +
  "FROM test.clearance_group " +
  "WHERE clearance_group_description = '" + type +"') " +
  " AND y.S_HOOD IS NOT NULL " +
  "GROUP BY y.S_HOOD " +
  "ORDER BY y.S_HOOD " +
  ";"
  connection.query(sql, function(err, rows, fields) {
       if (err) console.log("Err:" + err);
       if(rows != undefined){
               res.send(rows);
             }else{
                res.send("");
               }
       });
});

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

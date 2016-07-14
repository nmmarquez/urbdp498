#!/usr/bin/env node

//   Test API Server
//  Author:  Philippe Vaillant



var moment = require('moment');

// Find an available port number on the server
// Type in the terminal 'telnet localhost' and a number between 1024 and 65000
// If it returns connection refused, the port is available and you can write it down below
// Replace XX by the available portnumber
var portNumber = 1111;

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

app.get('/trees/sample/:minlat/:maxlat/:minlong/:maxlong', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  //Below is the sql whose result will be returned in the URL
  // Replace test by the name of your database
  var minlat = parseFloat(req.params.minlat);
  var maxlat = parseFloat(req.params.maxlat);
  var minlong = parseFloat(req.params.minlong);
  var maxlong = parseFloat(req.params.maxlong);
  var sql = "SELECT * FROM tree.trees_API WHERE POINT_Y BETWEEN " + minlat + " AND " + maxlat + " AND POINT_X BETWEEN " + minlong + " AND " + maxlong + " LIMIT 100";
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
app.get('/trees/type/:type/:minlat/:maxlat/:minlong/:maxlong', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  var type = mysql_real_escape_string(req.params.type);
  var minlat = parseFloat(req.params.minlat);
  var maxlat = parseFloat(req.params.maxlat);
  var minlong = parseFloat(req.params.minlong);
  var maxlong = parseFloat(req.params.maxlong);
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var sql = "SELECT FID, POINT_X, POINT_Y FROM tree.trees_API WHERE tree_type='" + type + "' AND POINT_Y BETWEEN " + minlat + " AND " + maxlat + " AND POINT_X BETWEEN " + minlong + " AND " + maxlong;
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
app.get('/trees/count/:minlat/:maxlat/:minlong/:maxlong', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // store the API parameter as a string variable
  var minlat = parseFloat(req.params.minlat);
  var maxlat = parseFloat(req.params.maxlat);
  var minlong = parseFloat(req.params.minlong);
  var maxlong = parseFloat(req.params.maxlong);
  // Below is the SQL query whose result depends on the API paramaeter and whose result will be returned in the URL
  // Replace test by the name of your database
  var sql = "SELECT tree_type, count(tree_type) as number FROM tree.trees_API " +
            "WHERE POINT_Y BETWEEN " + minat + " AND " + maxlat +
            "AND POINT_X BETWEEN " + minlong + " AND " + maxlong +
            "AND tree_type != 'other' " +
            "GROUP BY tree_type " +
            "ORDER BY number DESC " +
            "LIMIT 10"
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

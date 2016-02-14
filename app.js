'use strict';

try {
  require('dotenv').load();
} catch(e) {}
var express = require('express');

var app = express();
var morgan = require('morgan')
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // combined

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/public/index.html');
})

app.get('/:token', function(req, res) {
  res.sendFile(__dirname+'/public/token.html');
});

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});

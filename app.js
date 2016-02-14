'use strict';

try {
  require('dotenv').load();
} catch(e) {}
var express = require('express');

var app = express();
var morgan = require('morgan')
var nodalytics = require('nodalytics');
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
if (process.env.NODE_ENV != 'development') {
  app.use(require('express-force-ssl'));
}
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // combined
app.use(nodalytics('UA-60297301-1'));

app.get('/', function(req, res) {
  res.render('pages/home');
})

app.get('/:token', function(req, res) {
  res.render('pages/token');
});

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});

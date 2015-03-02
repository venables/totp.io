'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/:token', function(req, res) {
  res.render('token', { token: req.params.token });
});

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
});

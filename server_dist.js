var express = require('express');
var app = express();

app.use(express.static('dist'));

app.all('/*', function(req, res) {
  res.sendfile('dist/index.html');
});

app.listen(1003, function () {
  console.log('GroupM UX web server listening on port 1003!');
});
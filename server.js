var express = require('express');
var app = express();

app.use('/web', express.static('src'));

//app.all('/*', function(req, res) {
//  res.sendfile('src/index.html');
//});

app.listen(1002, function () {
  console.log('GroupM UX web server listening on port 1002!');
});
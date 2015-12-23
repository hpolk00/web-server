var express = require('express');
var app = express();
var PORT = 3000;

var middleware = {
  reqAuth: function(req, res, next) {
    console.log('private route hit');
      next();
  },
  logger: function(req, res, next) {
      console.log("Request: " + req.method + ' ' + req.originalUrl + new Date().toString());
      next();
  }
};
//app.get('/', function(req, res){
//    res.send('Hello Express');
//});

app.use(middleware.reqAuth);
app.use(middleware.logger);

app.get('/about', function(req, res){
    res.send('About Henry\'s Express');
});

//app.get('/about', middleware.reqAuth, function(req, res){
//    res.send('About Henry\'s Express');
//});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log('Express Server Started on port: ' + PORT);
});
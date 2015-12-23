var express = require('express');
var middleware = require('./modules/middleware.js')
var app = express();
var PORT = 3000;

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
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var middleware = require('./modules/middleware.js')
var app = express();
var PORT = process.env.PORT || 3000;

//var todos = [{
//    id: 1,
//    description: 'List of todos',
//    completed: false
//},
// {
//    id: 2,
//    description: 'List of data',
//    completed: false
//}, 
// {
//    id: 3,
//    description: 'List of sources',
//    completed: true
//}];
var todos = [];
var todoNextId = 1;

//app.get('/', function(req, res){
//    res.send('Hello Express');
//});

app.use(middleware.reqAuth);
app.use(middleware.logger);
app.use(bodyParser.json());

app.get('/about', function(req, res){
    res.send('About Henry\'s Express');
});

//app.get('/about', middleware.reqAuth, function(req, res){
//    res.send('About Henry\'s Express');
//});

app.get('/todos', function(req, res, next) {
   res.json(todos); 
});

// GET REQUEST
app.get('/todos/:id', function(req, res, next) {
    // res.send('Requested todo\'s id: ' + req.params.id);
    var todoId = parseInt(req.params.id,10);
    var todo = _.findWhere(todos, {id:todoId});
    if(todo) {
        res.json(todo);
    } else {
        res.status(404).send();
    }
    // var found = false;
//    if(todoId <= todos.length ) {
//        res.json(todos[todoId -1])
//    } else {
//        res.status(404).send();
//    }
//    todos.forEach(function(todo){
//        if(todo.id === todoId) {
//            res.json(todo);
//            found = true;
//        }
//    });
//    if(!found) {
//        res.status(404).send();
//    }
});

// POST REQUEST
app.post('/todos', function(req, res, next) {
    var body = req.body;
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
    body.id = todoNextId++;
    dody.description = body.description.trim();
    todos.push(_.pick(body, 'description', 'completed', 'id'));
    console.log(todos);
    res.json(todos);
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log('Express Server Started on port: ' + PORT);
});
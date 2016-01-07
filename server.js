var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var middleware = require('./modules/middleware.js');
var db = require('./db.js')
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

app.get('/about', function (req, res) {
    res.send('About Henry\'s Express');
});

//app.get('/about', middleware.reqAuth, function(req, res){
//    res.send('About Henry\'s Express');
//});

app.get('/todos', function (req, res, next) {
    var queryParm = _.pick(req.query, 'description', 'completed', 'q');
    var filteredTodos = todos;
    if (queryParm.hasOwnProperty('completed')) {
        if (queryParm.completed === 'true') {
            filteredTodos = _.where(filteredTodos, {
                completed: true
            });
        } else if (queryParm.completed === 'false') {
            filteredTodos = _.where(filteredTodos, {
                completed: false
            });
        } else {
            res.status(400).send();
        }
    }
    if (queryParm.hasOwnProperty('description')) {
        filteredTodos = _.where(filteredTodos, {
            description: queryParm.description
        });
    }
    if (queryParm.hasOwnProperty('q') && queryParm.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParm.q.toLowerCase()) > -1;
        });
    }
    res.json(filteredTodos);
});

// GET REQUEST
app.get('/todos/:id', function (req, res, next) {
    // res.send('Requested todo\'s id: ' + req.params.id);
    var todoId = parseInt(req.params.id, 10);
    //    var todo = _.findWhere(todos, {
    //        id: todoId
    //    });
    //    if (todo) {
    //        res.json(todo);
    //    } else {
    //        res.status(404).send();
    //    }
    //    

    db.todo.findById(todoId).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });
    //    if (todo) {
    //        res.json(todo.toJSON());
    //    } else {
    //        res.status(404).send();
    //    }

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

// DELETE BY ID
app.delete('/todos/:id', function (req, res, next) {
    var todoId = parseInt(req.params.id, 10);
    var todo = _.findWhere(todos, {
        id: todoId
    });
    if (todo) {
        todos = _.without(todos, todo);
        console.log(todos);
        res.status(200).send();
    } else {
        res.status(404).json({
            "error": "object not found"
        });
    }
});
// POST REQUEST
app.post('/todos', function (req, res, next) {
    var body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }).catch(function (e) {
        res.status(400).json(e);
    });
    //    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //        return res.status(400).send();
    //    }
    //    body.id = todoNextId++;
    //    body.description = body.description.trim();
    //    todos.push(body);
    // console.log(todos);
    // JSON sends 200 status by default
    // res.json(todos);
});

// UPDATE REQ - PUT
app.put('/todos/:id', function (req, res, next) {
    var todoId = parseInt(req.params.id, 10);
    var todo = _.findWhere(todos, {
        id: todoId
    });
    if (todo) {
        var body = _.pick(req.body, 'description', 'completed');
        if ((body.hasOwnProperty('completed') && _.isBoolean(body.completed)) || (body.hasOwnProperty('description') && body.description.trim().length > 0)) {
            _.extend(todo, body);
            res.status(200).send();
        } else {
            res.status(400).send({
                "error": "bad formatted data"
            });
        }
    } else {
        res.status(404).json({
            "error": "object not found"
        });
    }
});

app.use(express.static(__dirname + '/public'));

db.sequelize.sync({
    // setting force to true will drop database and recreate all objects
    force: false
}).then(function () {
    console.log('TODO database is synced');
    app.listen(PORT, function () {
        console.log('Express Server Started on port: ' + PORT);
    });
});
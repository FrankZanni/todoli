const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose')

const bodyParser = require('body-parser');
// Load in mongoose models
const { List, Task } = require('./db/models/');

//Load middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

//CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*ROUTE MODULES */


/*LIST ROUTES */

/**
* GET /lists
* Purpose: Get all lists
* */
app.get('/lists',(req,res) => {
        //Return an array of all the lists in the database
    List.find({}).then((lists) =>{
        res.send(lists);
    });
});
/**
 * POST /lists
 * Purpose: Create a list
 * */
app.post('/lists',(req,res) => {
        //Create a new list and return the new list document back to the user(which includes the id)
        let title = req.body.title;

        let newList = new List({
            title
        });
        newList.save().then((listDoc) => {
            //the full list document is returned (incl. id)
            res.send(listDoc);
        })
});
/**
 * PATH /lists/:id
 * Purpose: Update a specified list
 * */
app.patch('/lists/:id' , (req,res)=> {
        //Update the specified list (list document with id in the url) with the new values specified in the JSON body of the request.
        List.findOneAndUpdate({ _id: req.params.id},{
        $set: req.body
        }).then(() => {
            res.sendStatus(200);
        })

});
/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 * */
app.delete('/lists/:id' , (req,res) => {
        //Delete specified list
        List.findOneAndRemove({
            _id: req.params.id
        }).then((removedListDocument) => {
            res.send(removedListDocument);
        })
});
/**
 * GET /lists/:listsId/tasks
 * Purpose: Get all tasks in a specific list
 * */
app.get('/lists/:listId/tasks' ,(req,res) => {
    // Return all tasks that belong to a specific list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) =>{
        res.send(tasks);
    })
});
/**
 * This method is to send a request to an API and get document of just ONE item (specified by Id)
app.get('/lists/:listsId/tasks/:taskId', (req,res) =>{
    Task.findById({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});
 * */

/**
 * POST /lists/:listsId/tasks
 * Purpose: Create a new task in a specific list
 * */
app.post('/lists/:listId/tasks' , (req,res) => {
    // Create new task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    });
});
/**
 * PATCH /lists/:listsId/tasks/:taskId
 * Purpose: Update a task in a specific list
 * */
app.patch('/lists/:listsId/tasks/:taskId', (req,res) =>{
    //We want to update an existing task (specified by taskId)
    Task.findByIdAndUpdate({
        _id: req.params.taskId ,
        _listId: req.params.listId
    },{
        $set: req.body
       }
    ).then(() =>{
        res.sendStatus(200);
    })
});
/**
 * DELETE /lists/:listsId/tasks/:taskId
 * Purpose: Delete a specified task in a list
 * */
app.delete('/lists/:listsId/tasks/:taskId' , (req,res) => {
    Task.findByIdAndRemove({
        _id: req.params.taskId ,
        _listId: req.params.listId
    }).then((removeTaskDoc) => {
        res.send(removeTaskDoc)
    })
});


app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

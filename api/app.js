const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

const {Task, User} = require('./db/models/index');

app.use(bodyParser.json());

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, token, name");
    res.header("Access-Control-Expose-Headers", "token, name");
    next();
});

const saltRounds = process.env.SALTROUNDS;
const JWTSecret = process.env.JWTSECRET;

//Routes
//Get Users
app.get('/users', (req, res)=>{
    User.find().then((userList) => {
        res.send(userList);
    }).catch((e)=>{
       res.send(e);
    });
});

//Register
app.post('/users', (req, res) => {

    let body = req.body;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(body.password, salt, function(err, hash){
            body.password = hash;

            let newUser = User(body);
            newUser.save().then((newUserDoc) =>{
                //Generate JWT with _id
                let token = jwt.sign({_id: newUserDoc._id}, JWTSecret)
                res
                .header('name', newUserDoc.name)
                .header('token', token)
                .send(newUserDoc);
            }).catch((e) =>{
                res.status(500).send(e);
            });
        });
    });
});

//Log In
app.post('/users/login' , (req, res) =>{
    let email = req.body.email;
    let pass = req.body.password;

    User.findOne({
        email
    }).then((user) => {
        if(!user){
            res.status(404).send({message: "No user found"});
        }

        bcrypt.compare(pass, user.password, (err, result)=> {{
            if(result){
                let token = jwt.sign({_id: user._id}, JWTSecret)
                //let response = {name: user.name, token: token};
                res
                .header('name', user.name)
                .header('token', token)
                .status(200).send(user);
            }
            else{
                res.status(400).send({message: "Wrong password"});
            }
        }});

    }).catch((e) => {
        res.send(e);
    });
});

//Validate jwt
app.post('/users/validate', (req, res) => {

    try{
        let token = req.headers.token;
        let decoded = jwt.verify(token, JWTSecret);
        
        User.findOne({_id: decoded._id}).then((user)=>{
            if(user){
                res.status(200).send({message: "Valid"});
            }
            else{
                res.status(404).send({message: "Invalid"});
            }
        });
    }catch(err){
        res.status(400).send({message: "Invalid"});
    }
})

//Tasks

//get all tasks
app.get('/tasksAll', (req,res) =>{
    Task.find().then((tasklist)=>{
        res.send(tasklist);
    }).catch((e) => {
        res.status(500).send(e);
    });
});

//get task by user_id
app.get('/tasks', (req, res) =>{
    //User_id from jwt
    try{
        let token = req.headers.token;
        var decoded = jwt.verify(token, JWTSecret);
        //Search
        Task.find({
            _userId: decoded._id
        }).then((tasklist)=>{
            res.send(tasklist);
        }).catch((e)=>{
            res.status(404).send(e);
        });
    } catch(err){
        res.status(400).send(err);
    }
});

//post task
app.post('/tasks', (req, res) => {
    try{
        let token = req.headers.token;
        var decoded = jwt.verify(token, JWTSecret);
    } catch(err){
        res.status(400).send(err);
    }

    let newTask = new Task({name: req.body.name, date: req.body.date, completed: false, _userId: decoded._id});

    newTask.save().then((newTaskDoc)=>{
        res.status(200).send(newTaskDoc);
    }).catch((e)=>{
        res.status(500).send(e);
    })
});

//patch task
app.patch('/tasks/:task_id', (req, res) =>{

    try{
        let token = req.headers.token;
        var decoded = jwt.verify(token, JWTSecret);
        Task.findOneAndUpdate({_userId: decoded._id, _id: req.params.task_id},{$set: req.body}).then(()=>{
            res.send({message: "Updated successfully"});
        }).catch((e)=>{
            res.status(404).send(e);
        });
    } catch(err){
        res.status(400).send(err);
    }
});

//delete task
app.delete('/tasks/:task_id', (req, res) =>{

    try{
        let token = req.headers.token;
        let decoded = jwt.verify(token, JWTSecret);
        Task.findOneAndDelete({_userId: decoded._id, _id: req.params.task_id}).then((taskDeleteDoc)=>{
            res.send(taskDeleteDoc);
        }).catch((e)=>{
            res.status(404).send(e);
        })
    } catch(err){
        res.status(400).send(err);
    }
});

app.listen(3000, ()=>{
    console.log("Server is listening");
})
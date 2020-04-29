const express = require('express');
const bodyParser = require('body-parser');
const authenticate= require('../authenticate');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }, (err)=> console.log(err))
    .catch((err)=>console.log(err));
})
.post(authenticate.verifyUser, (req,res,next)=> {
    Leaders.create(req.body)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => console.log(err))
    .catch((err) => {console.log(err)});
})
.put(authenticate.verifyUser, (req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not suported on /leaders')
})
.delete(authenticate.verifyUser, (req,res,next)=> {
    Leaders.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => console.log(err))
    .catch(err => console.log(err));
});

//for /leaders/:leaderId

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, err => console.log(err))
    .catch(err => console.log(err));
})

.post(authenticate.verifyUser, (req,res,next)=> {
    res.statusCode = 403;
    res.end('POST operation not suported on /leaders/'
        + req.params.leaderId );
})

.put(authenticate.verifyUser, (req,res,next)=> {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err)=> next(err))
    .catch((err)=> next(err));
})

.delete(authenticate.verifyUser, (req,res,next)=> {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

module.exports = leaderRouter;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const request = require('request');
// const rp = require('request-promise');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/FastFood', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('themes')) ;  // FE is served from this folder
app.use(bodyParser.urlencoded({extend: true}));  // we need this to gether data from forms
app.set('view engine', 'ejs');   // with this we do not have to use .ejs @ res.render

const fastFood = mongoose.model('fastFood', {
    name: String,
    logo: String,
    description: String
});


app.get('/', function(req, res){
    res.render('home');
});

app.get('/fast-food', function(req, res){
    fastFood.find({}, function (err, fastFoods) {
        if(err){
            console.log('oh no error');
            console.log(err);
        } else {
            res.render('index', {fastFoods: fastFoods})
        }
    });
});

app.get('/fast-food/new', function(req, res){
    res.render('newFastFood');
});

app.post('/fast-food', function(req, res){
    let name = req.body.name;
    let logo = req.body.logo;
    let description = req.body.description;
    let fastFoodAdd = {
        name: name,
        logo: logo,
        description: description
    };
    fastFood.create(fastFoodAdd, function (err) {
        if(err){
            console.log(err);
        }
    });
    res.redirect('/fast-food');
});

app.get('/fast-food/:id', function(req, res){
    let id = req.params.id;
    fastFood.findById(id, function (err, fastFood) {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {fastFood: fastFood})
        }
    });
});

app.get('*', function(req, res){
    res.send('404');
});

app.listen(3090);
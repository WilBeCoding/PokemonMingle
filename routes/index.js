var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/pokemingle');
var usersCollection = db.get('users');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PokéMingle' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Sign Up'})
})

router.get('/profile', function(req,res,next){
  res.render('profile', {title: 'Profile'})
})

router.post('/signup', function(req, res, next){
  usersCollection.insert({username: req.body.username, age: req.body.userage, sex: req.body.usersex, country: req.body.usercountry, zip: req.body.userzip, email: req.body.email, password: req.body.password})
  res.redirect('/');
})

module.exports = router;

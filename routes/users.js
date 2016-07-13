var express = require('express');
var router = express.Router();
var db = require('monk')('localhost:27017/pokemingle');
var usersCollection = db.get('users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Sign Up'})
})

router.get('/profile', function(req,res,next){
  res.renger('profile', {title: 'Profile'})
})

router.post('/signup', function(req, res, next){
  usersCollection.insert({username: req.body.username, age: req.body.userage, sex: req.body.usersex, country: req.body.usercountry, zip: req.body.userzip, email: req.body.email, password: req.body.password})
  res.redirect('/');
})

module.exports = router;

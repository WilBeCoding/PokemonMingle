var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/pokemingle');
var usersCollection = db.get('users');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log('Route A')
  res.render('index', { title: 'PokéMingle' });
});

router.get('/signup/:id', function(req, res, next) {
  usersCollection.findOne({}, function(err,users) {
  console.log(req.params.id,   '   taste it')
  id = req.params.id
  console.log(id)
  res.render('signup', {title: 'Sign Up', users: users})
  })
})

router.get('/profile', function(req,res,next){
  usersCollection.find({}, function(err, users) {
  // console.log("route C")
  // console.log(users)
  res.render('profile', { title: 'Profile', users: users});
  })
})

router.post('/signup/:id', function(req, res, next){
  console.log(req.params.id  +   " req params id in post")
  usersCollection.insert({_id:req.params.id},{username: req.body.username, age: req.body.userage, sex: req.body.usersex, country: req.body.usercountry, zip: req.body.userzip, email: req.body.email, password: req.body.password})
  console.log(req.params.id + ' post insert')
  res.redirect('/profile');
  // console.log(users   + '   in post')
  // console.log('Route D')
})

router.post('/faction', function(req,res,next){
  // console.log('Route E')
  usersCollection.insert({faction: req.body.userfaction}, function(err, docsInserted){
    console.log(docsInserted)
  res.redirect('/signup/' + docsInserted._id)
  })
})

module.exports = router;

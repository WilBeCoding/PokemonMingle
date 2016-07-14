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
  console.log(req.params.id,   '   req.params in BEFORE /signup/:id')
  // console.log(ObjectId(req.params.id))
  usersCollection.findOne({_id: req.params.id}, function(err,users) {
  id = req.params.id
  console.log(users._id  +    '    users after assigning it req.params')
  res.render('signup', {title: 'Sign Up', users: users})
  })
})

router.get('/profile/:id', function(req,res,next){
  usersCollection.findOne({_id: req.params.id}, function(err, users) {
    console.log(users._id + '   Users on profile route')
  res.render('profile', { title: 'Profile', users: users});
  })
})

router.post('/signup/:id', function(req, res, next){
  usersCollection.update({_id:req.params.id},{$set: {username: req.body.username, age: req.body.userage, sex: req.body.usersex, country: req.body.usercountry, zip: req.body.userzip, email: req.body.email, password: req.body.password}})
  console.log(req.params.id + ' post insert in /signup/:id')
  res.redirect('/profile/' + req.params.id);
})

router.post('/faction', function(req,res,next){
  // console.log('Route E')
  usersCollection.insert({faction: req.body.userfaction}, function(err, docsInserted){
    console.log(docsInserted + '   docs inserted')
  res.redirect('/signup/' + docsInserted._id)
  })
})

router.get('/listings', function(req,res,next){
  usersCollection.find({}, function(err,users){
    res.render('listings', {title:'Poké Matches', users:users})
  })
})

router.post('/profileview/:id', function(req,res,next){
  console.log(req.body.summary +   ' req body')
  usersCollection.update({_id:req.params.id}, {$set:{summary: req.body.summary}})
  res.redirect('/profileview/' + req.params.id);
})

router.get('/profileview/:id', function(req,res,next){
    console.log('get profileview route hits')
  usersCollection.findOne({_id:req.params.id}, function(err, users){
    res.render('profileview', {title: 'Profile', users:users})
  })
})

module.exports = router;

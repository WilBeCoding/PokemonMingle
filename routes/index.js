var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/pokemingle');
var usersCollection = db.get('users');


/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(sessions ,  '   sessions in / get');
  // console.log('Route A')
  res.render('index', { title: 'PokéMingle'});
});

router.get('/signup/:id', function(req, res, next) {
  var userCookie = req.session.user
  var pokemonJSON
  usersCollection.findOne({_id: req.params.id}, function(err,users) {
  id = req.params.id
  res.render('signup', {title: 'Sign Up', users: users, userCookie:userCookie})
  })
})

// router.post('/signin', function(req, res, next){
//   var errors = [];
//   usersCollection.findOne({username: req.body.user_name}, function(err, users){
//     if(!users){
//       console.log("email doesnt exist hits")
//       errors.push("Username is not registered")
//     }
//     else if(users.password !== req.body.password) {
//       errors.push("Your password is incorrect")
//     }
//     if(errors.length === 0) {
//       req.session.username = req.body.user_name
//       res.redirect('/profile/' + users._id)
//     }
//     res.render('index', {errors:errors})
//   })
// })

router.post('/signin', function(req, res, next) {
  var errors = [];
  console.log(JSON.stringify(req.body) + '   req body')
  usersCollection.findOne({username: req.body.user_name}, function(err, users){
    if (!users){
      errors.push("This username doesn't exist. Try signing up?");
    } else if (!bcrypt.compareSync(req.body.user_password, users.password)) {
      console.log(req.body.user_password)
      console.log(users.password)
      errors.push("Invalid password.");
    }
    if (errors.length==0){
      req.session.username = req.body.user_name
      res.redirect('/profile/' + users._id);
    }
    res.render('index', {errors: errors});
  });
});

router.get('/profile/:id', function(req,res,next){
  usersCollection.findOne({_id: req.params.id}, function(err, users) {
    console.log(users._id + '   Users on profile route')
  res.render('profile', { title: 'Profile', users: users});
  })
})

router.post('/signup/:id', function(req, res, next) {
  var errors = [];
  if (!req.body.email.trim()){
    errors.push("Email is required.");
  }
  if (!req.body.email.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")){
    errors.push("Email is not valid email.");
  }
  if (!req.body.password.trim()){
    errors.push("Password is required.");
  }
  if (req.body.password.length <= 3){
    errors.push("Password must be greater than 3 characters.");
  }
  if(req.body.password !== req.body.passwordconfirmation){
    errors.push("Passwords do not match")
  }
  usersCollection.findOne({email: req.body.email}, function(err, users){
    if (err) {
      console.log('db err on find', err);
    }
    if (users){
      errors.push("This email is already signed up. Try logging in?");
    }
    if (errors.length==0){
      var password = bcrypt.hashSync(req.body.password, 11);
      var email = req.body.email.toLowerCase();
      usersCollection.update({_id:req.params.id},{$set: {username: req.body.username, age: req.body.userage, sex: req.body.usersex, country: req.body.usercountry, zip: req.body.userzip, email: email, password: password}})
      var userID = req.params.id
      req.session.user = userID
      res.redirect('/profile/' + req.params.id);
    }
    res.render('signup', {title: 'Sign Up', errors:errors, users:users});
  })
});


router.post('/faction', function(req,res,next){
  usersCollection.insert({faction: req.body.userfaction}, function(err, docsInserted){
  res.redirect('/signup/' + docsInserted._id)
  })
})

router.get('/listings/:id', function(req,res,next){
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

router.get('/delete/:id', function(req,res,next) {
  console.log('delete button hits')
  usersCollection.remove({_id:req.params.id}, function(err, users){
  res.redirect('/')
  })
})

module.exports = router;

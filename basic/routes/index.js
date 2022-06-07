var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

/* GET home page. */
router.get('/', auth.loggedIn, function(req, res, next) {
  console.log(req.session);
  res.render('index', { session : req.session.passport });
});

module.exports = router;

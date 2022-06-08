var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

/* GET board page. */
router.get('/', auth.loggedIn, function(req, res, next) {
    res.render('board/board');
});

module.exports = router;
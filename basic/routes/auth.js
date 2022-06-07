var express = require('express');

require('dotenv').config({ path: '../conf/.env'}); // mysql 폴더에 있는 .env 파일을 찾아서 환경 변수를 설정
const mysql = require('../conf');
var router = express.Router();

const crypto = require('crypto');

module.exports = function (passport) {

  /* GET login page. */
  router.get('/login', function(req, res, next) {
    var flash_message = req.flash();
    res.render('login/login', { message: flash_message.error } );
  });

  router.post('/login', 
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: true
  }));

  router.get('/register', function(req, res, next) {
    res.render('login/register');
  });

  router.post('/logout', function(req, res, next) {
    req.session.destroy(); // destory() 함수를 사용해서 세션 삭제
    res.redirect('/login'); // 로그인 페이지로 이동
  });
  
  return router;
};

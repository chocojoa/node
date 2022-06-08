var express = require('express');

require('dotenv').config({ path: '../conf/.env'}); // mysql 폴더에 있는 .env 파일을 찾아서 환경 변수를 설정
const mysql = require('../conf');
var router = express.Router();

const crypto = require('crypto');

module.exports = function (passport) {

  /* GET login page. */
  router.get('/sign_in', function(req, res, next) {
    var flash_message = req.flash();
    res.render('auth/sign_in', { message: flash_message.error } );
  });

  router.post('/sign_in', 
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/sign_in',
      failureFlash: true,
      successFlash: true
    })
  );

  router.get('/sign_up', function(req, res, next) {
    res.render('auth/sign_up');
  });

  router.post('/sign_up', async function(req, res, next) {
    let body = req.body;
    let password = body.password;
    let hashPassword = crypto.createHash('sha512').update(password).digest('hex');

    var param = {
      userId : body.userId,
      userName : body.userName,
      email : body.emailAddress,
      password : hashPassword
    }
    const result = await mysql.sqlResult('users', 'insertUserInformation', param);
    var insertStatus = false;
    if(result.affectedRows > 0){
      insertStatus = true;
    }
    var insertResult = { 'success' : insertStatus };
    res.send(insertResult);
  });

  router.post('/logout', function(req, res, next) {
    req.session.destroy(); // destory() 함수를 사용해서 세션 삭제
    res.redirect('/sign_in'); // 로그인 페이지로 이동
  });
  
  return router;
};

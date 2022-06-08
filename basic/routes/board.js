var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

require('dotenv').config({ path: '../conf/.env'}); // mysql 폴더에 있는 .env 파일을 찾아서 환경 변수를 설정
const mysql = require('../conf');

/* GET board page. */
router.get('/', auth.loggedIn, function(req, res, next) {
    res.render('board/board');
});

/* GET board list */
router.get('/selectBoardList', auth.loggedIn, async function(req, res, next) {
    var query = req.query;
    var totalCount = await mysql.sqlResult('board', 'selectBoardTotalCount', query);
    var pageNum = (query.currentPageNo - 1) * query.pageSize;
    
    var param = {
        type : query.type,
        pageNum : pageNum,        
        pageSize : query.pageSize
    };

    var result = await mysql.sqlResult('board', 'selectBoardList', param);
    console.log(result);
    var selectResult = { 'data' : result };
    res.send(selectResult);
});

module.exports = router;
var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

require('dotenv').config({ path: '../conf/.env'}); // mysql 폴더에 있는 .env 파일을 찾아서 환경 변수를 설정
const mysql = require('../conf');

/* GET board page. */
router.get('/', function(req, res, next) {
    res.render('board/board');
});

/* POST board list */
router.post('/selectBoardList', async function(req, res, next) {
    var query = req.body;
    var pageNum = query.start;
    var pageSize = query.pageSize;

    var param = {
        type : query.type,
        pageNum : pageNum,        
        pageSize : pageSize
    };
        
    var cntResult = await mysql.sqlResult('board', 'selectBoardTotalCount', param);
    var totalCount = cntResult[0].totalCount;    

    var boardList = await mysql.sqlResult('board', 'selectBoardList', param);
    
    var selectResult = { 
        'recordsTotal': totalCount,
        'recordsFiltered': totalCount,
        'data' : boardList 
    };    
    res.send(selectResult);
});

module.exports = router;
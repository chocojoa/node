var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

require('dotenv').config({ path: '../conf/.env'});
const mysql = require('../conf');

/* GET board page. */
router.get('/', auth.loggedIn, function(req, res, next) {    
    res.render('board/boardList', {input : req.query });
});

/* POST board list */
router.post('/selectBoardList', async function(req, res, next) {
    var query = req.body;
    
    var sortColumnNumer = query.order[0].column;    
    var sortColumnName = query.columns[sortColumnNumer].data;
    var sortDir = query.order[0].dir;

    var pageNum = Number(query.start);
    var pageSize = Number(query.length);

    var param = {
        type : query.type,
        pageNum : pageNum,        
        pageSize : pageSize,
        sortColumn : sortColumnName,
        sortDir : sortDir
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

/* GET board page. */
router.get('/detail', auth.loggedIn, function(req, res, next) {
    var input = req.query;
    res.render('board/boardDetail', {input : input });
});

/* GET board page. */
router.post('/selectBoardDetail', async function(req, res, next) {
    var param = req.body;
    var boardList = await mysql.sqlResult('board', 'selectBoardDetail', param);
    var replyList = await mysql.sqlResult('board', 'selectReplyList', param);
    
    var selectResult = { 
        'data' : boardList[0],
        'replyList' : replyList
    };
    res.send(selectResult);
});

module.exports = router;
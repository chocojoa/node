var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

require('dotenv').config({ path: '../conf/.env'});
const mysql = require('../conf');

/* 게시판 페이지 조회 */
router.get('/', auth.loggedIn, function(req, res, next) {    
    res.render('board/boardList', {input : req.query });
});

/* 게시판 목록 조회 */
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

/* 게시판 페이지 조회 */
router.get('/detail', auth.loggedIn, function(req, res, next) {
    var input = req.query;
    res.render('board/boardDetail', {input : input });
});

/* 게시판 상세 정보 조회 */
router.post('/selectBoardDetail', async function(req, res, next) {
    var param = req.body;
    var boardList = await mysql.sqlResult('board', 'selectBoardDetail', param);
    
    var selectResult = { 
        'data' : boardList[0],        
    };
    res.send(selectResult);
});

/* 게시판 댓글 목록 조회 */
router.post('/selectBoardReplyList', async function(req, res, next) {
    var param = req.body;
    var replyList = await mysql.sqlResult('board', 'selectReplyList', param);

    var selectResult = { 
        'replyList' : replyList,        
    };
    res.send(selectResult);
});

/* 게시판 댓글 정보 저장 */
router.post('/insertBoardReplyInformation' , async function(req, res, next) {
    var param = req.body;
    var result = await mysql.sqlResult('board', 'insertReplyInformation', param);
    
    var insertStatus = false;
    if(result.affectedRows > 0){
      insertStatus = true;
    }
    var insertResult = { 'success' : insertStatus };
    res.send(insertResult);
});

module.exports = router;
var express = require('express');
var auth = require('../lib/auth');
var router = express.Router();

require('dotenv').config({ path: '../conf/.env'});
const mysql = require('../conf');

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {    // cb 콜백 함수를 통해 전송된 파일 이름 설정
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + '_' + Date.now() + ext);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

const upload = multer({storage: storage});  // multer 객체 생성


/* 게시판 페이지 조회 */
router.get('/', auth.loggedIn, function(req, res, next) {    
    res.render('board/boardList', {input : req.query });
});

/* 게시판 목록 조회 */
router.post('/selectBoardList', auth.loggedIn, async function(req, res, next) {
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

/* 게시판 상세 페이지 조회 */
router.get('/detail', auth.loggedIn, async function(req, res, next) {
    var input = req.query;
    await mysql.sqlResult('board', 'updateBoardViews', input);
    res.render('board/boardDetail', {input : input });
});

/* 게시판 상세 정보 조회 */
router.post('/selectBoardDetail', auth.loggedIn, async function(req, res, next) {
    var param = req.body;
    var boardList = await mysql.sqlResult('board', 'selectBoardDetail', param);
    
    var contentBuffer = boardList[0].content;
    var boardDetail = boardList[0];
    delete boardDetail.content;        
    
    var replaceContent = contentBuffer.toString();
    boardDetail.content = replaceContent;

    var selectResult = { 
        'data' : boardDetail        
    };
    res.send(selectResult);
});

/* 게시판 댓글 목록 조회 */
router.post('/selectBoardReplyList', auth.loggedIn, async function(req, res, next) {
    var param = req.body;
    var replyList = await mysql.sqlResult('board', 'selectReplyList', param);

    var selectResult = { 
        'replyList' : replyList,        
    };
    res.send(selectResult);
});

/* 게시판 댓글 정보 저장 */
router.post('/insertBoardReplyInformation', auth.loggedIn, async function(req, res, next) {
    var param = req.body;
    var result = await mysql.sqlResult('board', 'insertReplyInformation', param);
    
    var insertStatus = false;
    if(result.affectedRows > 0){
      insertStatus = true;
    }
    var insertResult = { 'success' : insertStatus };
    res.send(insertResult);
});

/* 게시판 등록 페이지 조회 */
router.get('/new', auth.loggedIn, function(req, res, next) {    
    res.render('board/boardNew', {input : req.query });
});

/* 게시판 정보 저장 */
router.post('/insertBoardInformation', auth.loggedIn, async function(req, res, next) {
    var param = req.body;
    var result = await mysql.sqlResult('board', 'insertBoardInformation', param);
    
    var insertStatus = false;
    if(result.affectedRows > 0){
        insertStatus = true;
    }
    var insertResult = { 'success' : insertStatus };
    res.send(insertResult);
});

/* 게시판 수정 페이지 조회 */
router.get('/modify', auth.loggedIn, async function(req, res, next) {    
    res.render('board/boardModify', {input : req.query });
});

/* 게시판 정보 수정 */
router.post('/updateBoardInformation', auth.loggedIn, async function(req, res, next) {
    var param = req.body;
    var result = await mysql.sqlResult('board', 'updateBoardInformation', param);
    
    var updateStatus = false;
    if(result.affectedRows > 0){
        updateStatus = true;
    }
    var updateResult = { 'success' : updateStatus };
    res.send(updateResult);
});

/* 게시판 이미지 업로드 */
router.post('/image/upload', auth.loggedIn, upload.single('upload'), function(req, res, next) {
    console.log(req.file);
    res.json({ url : `/uploads/${req.file.filename}`});
});

module.exports = router;
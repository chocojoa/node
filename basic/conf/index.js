const mysql = require('mysql');
const sql = require('./sql.js');

const mybatisMapper = require('mybatis-mapper');

require('dotenv').config({path: 'conf/.env'});

mybatisMapper.createMapper([ 
    'conf/mappers/users.xml', 
    'conf/mappers/board.xml'
]);

const pool = mysql.createPool({
    connectionLimit : process.env.MYSQL_LIMIT,
    host : process.env.MYSQL_HOST,
    port : process.env.MYSQL_PORT,
    user : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB
});

const sqlResult = async (spaceName, statementName, param) => {
    let format = {language: 'sql', indent : ' '};
    let query = mybatisMapper.getStatement(spaceName, statementName, param, format);
    console.log(`query : ${query}`);
    return new Promise(function (resolve, reject) {
        pool.query(query, function (error, results, fields) {
            if (error) {
                console.log(error);
                reject({
                    error
                });
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
}; 

const query = async (alias, values) => {
    return new Promise((resolve, reject) => pool.query(sql[alias], values, (error, results) => {
        if (error) {
            console.log(error);
            reject({
                error
            });
        } else {
            console.log(results);
            resolve(results);
        }
    }));
}

module.exports = {
    query,
    sqlResult
};
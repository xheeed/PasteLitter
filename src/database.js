/*
┌──────────────────────────────────────────┐
│               PasteLitter                │ 
│            All rights Reserved           │ 
└──────────────────────────────────────────┘*/

const mysql = require('mysql2');
const config = require("./functions/env.js");
const pool = mysql.createPool({
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE
}).promise();

/** 
 * @param {string} sql
 * @param {Array} params
*/

const query = async function (sql, params = []) {
    const conn = await pool.getConnection();
    return conn.query(sql, params)
        .then(result => {
            return result[0];
        })
        .then((r) => {
            conn.release();
            return r;
        })
        .catch((err) => {
            if (err.code === 'ER_PARSE_ERROR' && err.errno === 1064) {
                throw new Error('SQL injection detected or SQL syntax error');
            }
            throw err;
        });
};

module.exports = { query }
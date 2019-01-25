var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_phankhoa',
  password        : '6251',
  database        : 'cs361_phankhoa'
});
module.exports.pool = pool;

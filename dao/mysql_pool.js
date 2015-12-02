var mysql = require('mysql');

exports.mysql_pool = function(){
	return mysql.createPool({
				host : "rds86l3t6wxs6sv7vsek.mysql.rds.aliyuncs.com",
				port : 3306,
				user : "shining",
				password : "iatsjtu2011",
				database : "kaoqin"
		   });
}


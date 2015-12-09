var http = require('https');
var mysql = require('mysql');
var sql = require('../dao/sql_mapping');
var pool = require('../dao/mysql_pool').mysql_pool();

var failed = {
	msg  : "failed",
	code : -1
}

var success = {
	msg  : "success",
	code : 0
}

exports.get_shake_info = function(request, response){
	var options =
	{
		hostname : 'api.weixin.qq.com',
		port : 443,
		method : 'GET',
		path : '/cgi-bin/token?grant_type=client_credential&appid=wxe9074ed2b0315f56&secret=ab0e5534bcf156d00c5000a1937fda74',
		handers: {
		}
	};
	http.request(options, function(res){
		chunks = '';
		res.on('data',function(chunk){
			chunks += chunk;
		}).on('end', function() {
			var obj = JSON.parse(chunks);
			var opt ={
				hostname : 'api.weixin.qq.com',
			port : 443,
			method : 'POST',
			path : '/shakearound/user/getshakeinfo?access_token=' + obj.access_token,
			};
			var data = {
				"ticket" : request.body.ticket
			};
			data = JSON.stringify(data);
			var req = http.request(opt, function(res){
				chunks = '';
				res.on('data',function(chunk){
					chunks += chunk;
				}).on('end', function() {
					obj = JSON.parse(chunks);

					try {
						pool.getConnection(function(err, connection) {
							try {
								var user_id = obj.data.beacon_info.uuid;
								var values = [user_id];
								connection.query(sql.GET_SIGNING_STATUS, values, function(err, ret){
									try {
										ret[0].wx_id = obj.data.openid;
										console.log("SHARK RET:", ret);
										response.json(ret);
										connection.release();
									}
									catch (err){
										console.log(err);
										response.json(ret);
									}
								});
							} catch (err){
								console.log(err)
								response.json(ret);
							}
						})
					} catch (err) {
						console.log(err);
						response.json(ret);
					}
				});
			});
			req.write(data+'\n');
			req.end('');
		});
	}).end('');
}

var mysql = require('mysql');
var sql = require('./sql_mapping');
var pool = require('./mysql_pool').mysql_pool();
var encrypt = require('../tools/encrypt');

var failed = {
	msg  : "failed",
	code : -1 
}

var success = {
	msg  : "success",
	code : 0
}

exports.create_subject = function(req, res) {
	pool.getConnection(function(err, connection) {
		try {
			var user_id = req.session.user_id;
			var school = req.body.school;
			var subject = req.body.subject; 
			var cls = req.body.cls;
			var subject_id = encrypt.md5(school + subject + cls);
			var values = [subject_id, user_id, school, subject, cls];
			connection.query(sql.CREATE_SUBJECT, values, function(err, ret){
				try {
					if (ret){
						success.msg = user_id;
						res.json(success);
					} else {
						failed.msg = user_id;
						res.json(failed);
					}
					connection.release();
				}
				catch (err){
					console.log(err);
					failed.msg = user_id;
					res.json(failed);
				}
			}); 
		} catch (err){
			console.log(err);
			failed.msg = user_id;
			res.json(failed);
		}
	})
};

exports.create_student = function(req, res) {
	pool.getConnection(function(err, connection) {
		try {
			var wx_id = req.session.wx_id;
			var number = req.body.number;
			var name = req.body.name;
			var cls = req.body.cls; 
			var values = [wx_id, number, name, cls];
			connection.query(sql.CREATE_STUDENT, values, function(err, ret){
				try {
					if (ret){
						res.json(success);
					} else {
						res.json(failed);
					}
					connection.release();
				}
				catch (err){
					console.log(err);
					res.json(failed);
				}
			}); 
		} catch (err){
			console.log(err);
			res.json(failed);
		}
	})
};

exports.student_sign = function(req, res) {
	pool.getConnection(function(err, connection) {
		try {
			var values = [req.session.wx_id]; 
			connection.query(sql.CHECK_STUDENT, values, function(err, ret){
				try {
					if (ret[0].wx_id != undefined){
						res.json(success);
					} else {
						res.json(failed);
					}
					connection.release();
				}
				catch (err){
					console.log(err);
					res.json(failed);
				}
			}); 
		} catch (err){
			console.log(err);
			res.json(failed);
		}
	})
};

exports.post_sign_up = function(req, res) {
	pool.getconnection(function(err, connection) {
		try {
			var class_id = req.body.class_id;
			var subject_id = req.body.subject_id;
			var wx_id = request.session.wx_id;
			var values = [wx_id];
			connection.query(sql.GET_STUDENT, values, function(err, ret){
				try {
					var number = ret[0].number;
					var name = ret[0].name;
					var cls = ret[0].cls;
					var values = [class_id, subject_id, wx_id, number, name, cls];
					connection.query(sql.post_sign_up, values, function(err, ret){
						try {
							if (ret)
								console.log("POST SUCCESS");
							connection.release();
						}
						catch (err){
							console.log(err);
						}
					}); 
				} catch(err) {
					console.log(err);
				}
			});
		} catch (err){
			console.log(err);
		}
	})
};

exports.post_sign_up_first = function(req, res) {
	pool.getconnection(function(err, connection) {
		try {
			var class_id = req.body.class_id;
			var subject_id = req.body.subject_id;
			var wx_id = request.session.wx_id;
			var number = req.body.number;
			var name = req.body.name;
			var cls = req.body.cls;
			var values = [class_id, subject_id, wx_id, number, name, cls];
			connection.query(sql.post_sign_up, values, function(err, ret){
				try {
					if (ret)
						console.log("POST SUCCESS");
					connection.release();
				}
				catch (err){
					console.log(err);
				}
			}); 
		} catch (err){
			console.log(err);
		}
	})
};

exports.post_subject_list = function(req, res) {
	try {
		pool.getConnection(function(err, connection) {
			try {
				var values = [req.session.user_id]; 
				connection.query(sql.GET_SUBJECT_LIST, values, function(err, ret){
					try {
						console.log(ret);
						res.json(ret);
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.post_start_sign = function(req, res) {
	try {
		pool.getConnection(function(err, connection) {
			try {
				var myDate = new Date();
				var create_time = myDate.toLocaleString();
				var subject_id = req.body.subject_id;
				var class_id = encrypt.md5(subject_id + create_time); 
				var values = [class_id, subject_id, create_time]; 
				connection.query(sql.CREATE_NEW_SIGN, values, function(err, ret){
					try {
						if (ret) {
							success.msg = {"create_time" : create_time, "class_id": class_id};
							res.json(success);
						}
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.get_history_sign = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var subject_id = req.body.subject_id; 
				console.log(req.body);
				var values = [subject_id]; 
				connection.query(sql.GET_HISTORY_SIGN, values, function(err, ret){
					try {
						if (ret) {
							res.json(ret);
						}
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.get_sign_summery = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var class_id = req.body.class_id;
				var values = [class_id]; 
				connection.query(sql.GET_UNSIGN_STUDENT, values, function(err, unsign_ret){
					try {
						if (unsign_ret) {
							connection.query(sql.GET_SIGN_STUDENT, values, function(err, sign_ret){
								if (sign_ret) {
									ret = {"sign" : sign_ret, "unsign" : unsign_ret};
									//console.log(ret);
									res.json(ret);
								}
							});
						}
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.add_signing_status = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var user_id = req.session.user_id;
				var subject_id = req.body.subject_id; 
				var subject = req.body.subject;
				var class_id = req.body.class_id;
				var cls = req.body.cls
			var values = [user_id, subject_id, subject, class_id, cls]; 
		console.log(values);
		connection.query(sql.ADD_SIGNING_STATUS, values, function(err, ret){
			try {
				if (ret) {
					res.json(ret);
				}
				connection.release();
			}
			catch (err){
				console.log(err);
				res.json(failed);
			}
		}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}

};

exports.del_signing_status = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var user_id = req.session.user_id;
				var values = [user_id]; 
				connection.query(sql.DEL_SIGNING_STATUS, values, function(err, ret){
					try {
						if (ret) {
							res.json(ret);
						}
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.get_signing_status = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var user_id = req.body.user_id;
				var values = [user_id]; 
				connection.query(sql.GET_SIGNING_STATUS, values, function(err, ret){
					try {
						if (ret) {
							res.json(ret);
						}
						connection.release();
					}
					catch (err){
						console.log(err);
						res.json(failed);
					}
				}); 
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
	}
};

exports.add_subject_student = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var subject_id = req.body.subject_id;
				var wx_id = req.session.wx_id; 
				var number = req.body.number;
				var name = req.body.name;
				var cls = req.body.cls
				var values = [subject_id, wx_id, number, name, cls]; 
				connection.query(sql.ADD_SUBJECT_STUDENT, values, function(err, ret){
					try {
						if (ret) {
							console.log('SUCCESS ADD SUBJECT STUDENT');
						}
						connection.release();
					}
					catch (err){
						console.log(err);
					}
				}); 
			} catch (err){
				console.log(err);
			}
		})
	} catch (err) {
		console.log(err);
	}
}

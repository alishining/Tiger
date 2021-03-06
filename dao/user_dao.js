var mysql = require('mysql');
var moment = require('moment');
moment.locale('zh-cn');
var sql = require('./sql_mapping');
var pool = require('./mysql_pool').mysql_pool();
var encrypt = require('../tools/encrypt');
var sendMail = require('../tools/mail');

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
			var user_id = req.body.user_id;
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
			var wx_id = req.body.wx_id;
			var number = req.body.number;
			var name = req.body.name;
			var cls = req.body.cls; 
			var values = [wx_id, number, name, cls];
			global.id_list.add(wx_id);
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
	var wx_id = req.body.wx_id; 
	try {
		if (global.id_list.has(wx_id)) {
			res.json(success);
		} else {
			res.json(failed);
		}
	} catch(err) {
		console.log(err);
		res.json(failed);
	}
}
	
exports.load_student = function() {
	pool.getConnection(function(err, connection) {
		try {
			connection.query(sql.CHECK_STUDENT, function(err, ret){
				try {
					for (var i=0;i<ret.length;i++) {
						global.id_list.add(ret[i].wx_id);
					}
					console.log(global.id_list);
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

exports.post_sign_up = function(request, response) {
	pool.getConnection(function(err, connection) {
		try {
			var class_id = request.body.class_id;
			var subject_id = request.body.subject_id;
			var wx_id = request.body.wx_id;
			var values = [wx_id];
			connection.query(sql.GET_STUDENT, values, function(err, ret){
				try {
					var number = ret[0].number;
					var name = ret[0].name;
					var cls = ret[0].class;
					var values = [class_id, subject_id, wx_id, number, name, cls];
					connection.query(sql.POST_SIGN_UP, values, function(err, ret){
						try {
							if (ret) {
								console.log("POST SUCCESS");
								response.json(success);
							}
							connection.release();
						}
						catch (err){
							console.log(err);
							response.json(failed);
						}
					}); 
				} catch(err) {
					console.log(err);
					response.json(failed);
				}
			});
		} catch (err){
			console.log(err);
			response.json(failed);
		}
	})
};

exports.post_resign_up = function(request, response) {
	pool.getConnection(function(err, connection) {
		try {
			var class_id = request.body.class_id;
			var subject_id = request.body.subject_id;

			var number = request.body.number;
			var name = request.body.name; 
			var cls = request.body.cls; 

			var values = [number, name, cls];
			connection.query(sql.GET_WX_ID, values, function(err, ret){
				try {
					var wx_id = ret[0].wx_id;
					values = [class_id, subject_id, wx_id, number, name, cls];
					connection.query(sql.POST_SIGN_UP, values, function(err, ret){
						try {
							if (ret) {
								console.log("POST SUCCESS");
								response.json(success);
							}
							connection.release();
						}
						catch (err){
							console.log(err);
							response.json(failed);
						}
					}); 
				} catch(err) {
					console.log(err);
					response.json(failed);
				}
			});
		} catch (err){
			console.log(err);
			response.json(failed);
		}
	})
};

exports.post_sign_up_first = function(req, res) {
	pool.getConnection(function(err, connection) {
		try {
			var class_id = req.body.class_id;
			var subject_id = req.body.subject_id;
			var wx_id = req.body.wx_id;
			var number = req.body.number;
			var name = req.body.name;
			var cls = req.body.cls;
			var values = [class_id, subject_id, wx_id, number, name, cls];
			connection.query(sql.POST_SIGN_UP, values, function(err, ret){
				try {
					if (ret){
						console.log("POST SUCCESS");
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
};

exports.post_subject_list = function(req, res) {
	try {
		pool.getConnection(function(err, connection) {
			try {
				var values = [req.body.user_id]; 
				console.log("user_id:", req.body.user_id);
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
		res.json(failed);
	}
};

exports.post_start_sign = function(req, res) {
	try {
		pool.getConnection(function(err, connection) {
			try {
				var create_time = moment().format('LLLL');
				console.log(create_time);
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
		res.json(failed);
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
		res.json(failed);
	}
};

exports.get_sign_summery = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var subject_id = req.body.subject_id;
				var class_id = req.body.class_id;
				var values = [subject_id, class_id]; 
				connection.query(sql.GET_UNSIGN_STUDENT, values, function(err, unsign_ret){
					try {
						if (unsign_ret) {
							values = [class_id];
							connection.query(sql.GET_SIGN_STUDENT, values, function(err, sign_ret){
								if (sign_ret) {
									ret = {"sign" : sign_ret, "unsign" : unsign_ret};
									console.log(ret);
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
		res.json(failed);
	}
};

exports.add_signing_status = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var user_id = req.body.user_id;
				var subject_id = req.body.subject_id; 
				var subject = req.body.subject;
				var class_id = req.body.class_id;
				var cls = req.body.cls
				var values = [user_id, subject_id, subject, class_id, cls]; 
				connection.query(sql.ADD_SIGNING_STATUS, values, function(err, ret){
					try {
						if (ret) {
							res.json(ret);
						}
						connection.release();
					} catch (err){
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
		res.json(failed);
	}
};

exports.del_signing_status = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var user_id = req.body.user_id;
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
		res.json(failed);
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
		res.json(failed);
	}
};

exports.add_subject_student = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var subject_id = req.body.subject_id;
				var wx_id = req.body.wx_id; 
				var number = req.body.number;
				var name = req.body.name;
				var cls = req.body.cls
				var values = [subject_id, wx_id, number, name, cls]; 
				connection.query(sql.ADD_SUBJECT_STUDENT, values, function(err, ret){
					try {
						if (ret) {
							console.log('SUCCESS ADD SUBJECT STUDENT');
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
		res.json(failed);
	}
};

exports.update_wx_id = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var wx_id = req.body.wx_id; 
				var md5_wx_id = req.body.md5_wx_id;
				console.log(wx_id, md5_wx_id);
				var table_name = ['student_info', 'subject_student', 'student_sign'];
				var values = []; 
				for (var i=0;i<3;i++) {
					var tn = table_name[i];
					values = [wx_id, md5_wx_id];
					var sql_query = 'UPDATE ' + tn + ' SET wx_id=? WHERE wx_id=?'
					connection.query(sql_query, values, function(err, ret){
						try {
							if (ret) {
								console.log('SUCCESS UPDATE WX_ID:', tn);
								res.json(ret);
							}
						}
						catch (err){
							console.log(err);
							res.json(failed);
						}
					}); 
				}
				connection.release();
			} catch (err){
				console.log(err);
				res.json(failed);
			}
		})
	} catch (err) {
		console.log(err);
		res.json(failed);
	}
};

exports.load_user = function(req, res){
	pool.getConnection(function(err, connection) {
		try {
			connection.query(sql.LOAD_USER, function(err, ret){
				try {
					for (var i=0;i<ret.length;i++) {
						global.user_info.set(ret[i].email, {"pwd": ret[i].password, "uid": ret[i].user_id});
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
}

exports.login = function(req, res){
	var email = req.body.email;
	var pwd = req.body.password;
	if (pwd == global.user_info.get(email).pwd) {
		success.msg = global.user_info.get(email).uid;
		res.json(success);
	} else {
		res.json(failed);
	}

};

exports.register = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var email = req.body.email;
				var pwd = req.body.password;
				var user_id = req.body.user_id;
				var values = [email, pwd, user_id]; 
				global.user_info.set(email, {"pwd": pwd, "uid": user_id});
				connection.query(sql.REGISTER, values, function(err, ret){
					try {
						if (ret) {
							console.log('SUCCESS REGISTER');
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
		res.json(failed);
	}
};

exports.forget = function(req, res){
	try {
		var email = req.body.email;
		var rNum = Math.floor(Math.random()*10000);
		var content = '<p>' + rNum + '</p>';
		console.log(email);
		if (global.user_info.get(email).uid !=undefined) {
			sendMail.mail(email, "考勤神器验证码", content);	
			success.msg = rNum;
			res.json(success);
		} else {
			res.json(failed);
		}
	} catch(err) {
		res.json(failed);
	}
};

exports.reset = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var email = req.body.email;
				var pwd = req.body.password;
				var values = [pwd, email]; 
				var user_id = global.user_info.get(email).uid;
				global.user_info.set(email, {"pwd": pwd, "uid": user_id});
				connection.query(sql.RESET, values, function(err, ret){
					try {
						if (ret) {
							console.log('SUCCESS RESET');
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
		res.json(failed);
	}
};

exports.get_student_sign = function(req, res){
	try {
		pool.getConnection(function(err, connection) {
			try {
				var number = req.body.number;
				var name = req.body.name;
				var values = [number, name];
				connection.query(sql.get_student_sign, values, function(err, ret){
					try {
						if (ret) {
							console.log(ret);
							success.msg = ret;
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
		res.json(failed);
	}
};


var express = require('express');
var user_dao = require('../dao/user_dao');
var tools = require('../tools/get_shake_info');

exports.index = function(req, res) {
	res.render('index', { title: 'Express' });
};

exports.create_subject = function(req, res) {
	res.render('create_subject');
};
exports.post_subject_info = function(req, res) {
	user_dao.create_subject(req, res);
}; 
exports.create_student = function(req, res) {
	res.render('create_student');
}
exports.post_student_info = function(req, res) {
	user_dao.create_student(req, res);
	user_dao.post_sign_up_first(req, res);
	user_dao.add_subject_student(req, res);
};
exports.student_sign = function(req, res){
	user_dao.student_sign(req, res);
};
exports.sign_up = function(req, res){
	res.render('sign_up',{cls: req.session.cls, wx_id : req.session.wx_id, subject: req.session.subject});
};

exports.test = function(req, res){
	res.render('test');
};
exports.post_sign_up = function(req, res){
	user_dao.post_sign_up(req, res);
};
exports.sign_ok = function(req, res){
	res.render("sign_ok", {subject : req.session.subject, cls : req.session.cls});
};

// 老师点击进入课程列表
exports.post_subject_list = function(req, res){
	user_dao.post_subject_list(req, res);
};
exports.subject_list = function(req, res){
	req.session.user_id = req.query.user_id;  //uuid(user_id)通过微信绑定到老师端
	res.render('subject_list');
};
exports.post_start_sign = function(req, res){
	user_dao.post_start_sign(req, res);
};
exports.start_sign = function(req, res){
	res.render('start_sign');
};
exports.get_history_sign = function(req, res){
	user_dao.get_history_sign(req, res);
};
exports.get_sign_summery = function(req, res){
	user_dao.get_sign_summery(req, res);
};
exports.sign_summery = function(req, res){
	res.render('sign_summery');
};
exports.welcome = function(req, res){
	var ticket = req.query.ticket;
	tools.get_shake_info(req, res, ticket);
};
exports.add_signing_status = function(req, res){
	user_dao.add_signing_status(req, res);
};
exports.del_signing_status = function(req, res){
	user_dao.del_signing_status(req, res);
};
exports.get_signing_status = function(req, res){
	user_dao.get_signing_status(req, res);
};
exports.index = function(req, res){
	res.render('welcome');
}

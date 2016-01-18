var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var user_dao = require('./dao/user_dao');
var routes = require('./routes/index');

var app = express();

global.id_list = new Set();
user_dao.load_student();
global.user_info = new Map();
user_dao.load_user();

// view engine setup
app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/create_subject', routes.create_subject);
app.post('/post_subject_info', routes.post_subject_info);
app.post('/create_student', routes.create_student);
app.post('/post_sign_up_first', routes.post_sign_up_first)
app.post('/add_subject_student', routes.add_subject_student);
app.post('/student_sign', routes.student_sign);
app.post('/post_sign_up', routes.post_sign_up);
app.get('/subject_list', routes.subject_list);
app.post('/post_subject_list', routes.post_subject_list);
app.post('/post_start_sign', routes.post_start_sign);
app.get('/start_sign', routes.start_sign);
app.post('/get_history_sign', routes.get_history_sign);
app.post('/get_sign_summery', routes.get_sign_summery);
app.get('/sign_summery', routes.sign_summery);
app.post('/add_signing_status', routes.add_signing_status);
app.post('/del_signing_status', routes.del_signing_status);
app.post('/get_signing_status', routes.get_signing_status);
app.post('/post_resign', routes.post_resign);
app.post('/get_shake_info', routes.get_shake_info);
app.post('/post_resign_up', routes.post_resign_up);
app.get('/resign', routes.resign);
app.get('/', routes.index);
app.get('/clear', routes.clear);
app.post('/update_wx_id', routes.update_wx_id);
app.post('/login', routes.login);
app.post('/register', routes.register);
app.post('/forget', user_dao.forget);
app.post('/reset', user_dao.reset);
app.get('/find_pass_word', routes.render_forget);
app.get('/login', routes.render_login);
app.get('/register', routes.render_register);
app.get('/reset_pass_word', routes.render_reset);
app.post('/get_student_sign', routes.get_student_sign);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

var server = http.createServer(app);
try {
	server.listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	}).on('error', function(err){
		console.log("SERVER ERROR:", err);
	});;
} catch (err){
	console.log(err);
}

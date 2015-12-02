var express = require('express');
var session = require('express-session');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('port', 3000);
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

app.use(session({
	secret : 'kaoqin',
	resave : false,
	saveUninitialized: false,
	cookie : {maxAge: 800000}
}));

app.get('/create_subject', routes.create_subject);
app.post('/post_subject_info', routes.post_subject_info);
app.get('/create_student', routes.create_student);
app.post('/post_student_info', routes.post_student_info);
app.post('/student_sign', routes.student_sign);
app.get('/sign_up', routes.sign_up);
app.post('/post_sign_up', routes.post_sign_up);
app.get('/sign_ok', routes.sign_ok);
app.get('/test', routes.test);
app.get('/subject_list', routes.subject_list);
app.post('/post_subject_list', routes.post_subject_list);
app.post('/post_start_sign', routes.post_start_sign);
app.get('/start_sign', routes.start_sign);
app.post('/get_history_sign', routes.get_history_sign);
app.post('/get_sign_summery', routes.get_sign_summery);
app.get('/sign_summery', routes.sign_summery);
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

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

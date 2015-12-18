var nodemailer  = require("nodemailer");
var user = 'shining@flymeal.cn';
var pass = '1988618Sn';

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "QQ" , 
	auth: {
		user: user,
		pass: pass
	}
});

exports.mail = function(email, title, content) {
	smtpTransport.sendMail({
		from    : '考勤神器<' + user + '>',
		to      : '<' + email + '>', 
		subject : title, 
		html    : content
	}, function(err, res) {
		console.log(err, res);
	});
};


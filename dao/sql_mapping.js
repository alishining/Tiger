
var user = {
	CREATE_SUBJECT : 'INSERT INTO subject_info(subject_id, user_id, school, subject, class) VALUES(?,?,?,?,?)',
	CREATE_STUDENT : 'INSERT INTO student_info(wx_id, number, name, class) VALUES(?,?,?,?)',
	CHECK_STUDENT : 'SELECT wx_id FROM student_info',
	POST_SIGN_UP : 'INSERT INTO student_sign(class_id, subject_id, wx_id, number, name, class) VALUES(?,?,?,?,?,?)',
	GET_SUBJECT_LIST : 'SELECT * FROM subject_info WHERE user_id = ?',
	CREATE_NEW_SIGN : 'INSERT INTO class_list(class_id, subject_id, create_time) VALUES(?,?,?)',
	GET_HISTORY_SIGN : 'SELECT * FROM class_list WHERE subject_id=? ORDER BY create_time DESC',
	GET_SIGN_STUDENT : 'SELECT number,name,class FROM student_sign WHERE class_id=?',
	GET_UNSIGN_STUDENT : 'select b.number, b.name, b.class from (select a.wx_id from (select wx_id from subject_student where subject_id = ? group by wx_id) a left outer join (select wx_id from student_sign where class_id = ? group by wx_id) b on a.wx_id = b.wx_id where b.wx_id is null) a left outer join student_info b on a.wx_id = b.wx_id where b.wx_id is not null',

	ADD_SIGNING_STATUS : 'INSERT INTO signing_list(user_id, subject_id, subject, class_id, class) VALUES(?,?,?,?,?)',
	DEL_SIGNING_STATUS: 'DELETE FROM signing_list WHERE user_id=?',
	GET_SIGNING_STATUS: 'SELECT * FROM signing_list WHERE user_id=?',
	GET_STUDENT: 'SELECT * FROM student_info WHERE wx_id=?',
	ADD_SUBJECT_STUDENT : 'INSERT INTO subject_student(subject_id, wx_id, number, name, class) VALUES(?,?,?,?,?)',
	POST_TMP_SIGN : 'INSERT INTO tmp_sign_list(class_id, number, name, class) VALUES(?,?,?,?)',
	GET_TMP_SIGN : 'SELECT number,name,class FROM tmp_sign_list WHERE class_id = ?',
	GET_WX_ID: 'SELECT wx_id FROM student_info WHERE number=? and name=? and class=?',
	LOAD_USER: 'select * from account',
	REGISTER: 'INSERT INTO account(email, password, user_id) VALUES(?,?,?)',
	RESET : 'UPDATE account SET password=? WHERE email=?',
	get_student_sign: 'select a.create_time, b.subject from (SELECT a.class_id as class_id, b.create_time as create_time,a.subject_id as subject_id from (select class_id,subject_id from student_sign where number=? and name=?) a LEFT OUTER join class_list b on a.class_id = b.class_id where b.class_id is not null) a LEFT outer join subject_info b on a.subject_id = b.subject_id where b.subject_id is not null'
};

module.exports = user;

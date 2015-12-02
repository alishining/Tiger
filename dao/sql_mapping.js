
var user = {
	CREATE_SUBJECT : 'INSERT INTO subject_info(subject_id, user_id, school, subject, class) VALUES(?,?,?,?,?)',
	CREATE_STUDENT : 'INSERT INTO student_info(wx_id, number, name, class) VALUES(?,?,?,?)',
	CHECK_STUDENT : 'SELECT * FROM student_info WHERE wx_id = ?',
	POST_SIGN_UP : 'INSERT INTO student_sign(class_id, wx_id) VALUES(?,?)',
	GET_SUBJECT_LIST : 'SELECT * FROM subject_info WHERE user_id = ?',
	CREATE_NEW_SIGN : 'INSERT INTO class_list(class_id, subject_id, create_time) VALUES(?,?,?)',
	GET_HISTORY_SIGN : 'SELECT * FROM class_list WHERE subject_id=? ORDER BY create_time DESC',
	GET_SIGN_STUDENT : 'SELECT number,name,class FROM student_sign WHERE class_id=?',
	GET_UNSIGN_STUDENT : 'SELECT a.number, a.name, a.class FROM subject_student a left outer join student_sign b on a.subject_id = b.subject_id and a.wx_id = b.wx_id and b.class_id = ? WHERE b.wx_id is null'
};

module.exports = user;

$(function(){
	function del(id){
		$("#"+id).val("");
	}
	touch.on("#delEmail","tap",function(){
		del("email");
	})
	touch.on("#delPassWd","tap",function(){
		del("passWd");
	})
	//邮箱验证
	 function valid_email(email) {
	 	var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/); 
	 	return patten.test(email); 
	 }
	 touch.on("#log","tap",function(){
	 	var email = $("#email").val();
	 	var passwd = $("#passWd").val();
	 	if(email==""){
	 		alert("请输入邮箱");
	 		$("#email").val("");
	 	}else if(passwd==""){
	 		alert("请输入密码");
	 		$("#passWd").val("");
	 	}else if(!valid_email(email)){
	 		alert("邮箱输入错误！");
	 	};
	 	if(valid_email(email)&&passwd!=""){
	 		var data={
	 			"email": email,
	 			"passwd":passwd
	 		}
	 		$.ajax({
	 			type:"post",
	 			url:"/login",
	 			data:data,
	 			success:function(){
	 				alert("登陆成功")
				}
	 		});
	 	}
	 })
})

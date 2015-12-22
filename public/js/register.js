
$(function(){
	
	//邮箱验证
	 function valid_email(email) {
	 	var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/); 
	 	return patten.test(email); 
	 }
	touch.on("#delEmail","tap",function(){
		$("#email_id").val("");
	})
	touch.on("#delDec","tap",function(){
		$("#dec_id").val("");
	})
	touch.on("#delPass","tap",function(){
		$("#pass_id").val("");
	})
	touch.on("#delConfig","tap",function(){
		$("#config_id").val("");
	})
	touch.on("#register_id","tap",function(){	
		var email_id = $("#email_id").val();
		var dec_id = $("#dec_id").val();
		var pass_id = $("#pass_id").val();
		var config_id = $("#config_id").val();
		if(!valid_email(email_id)){
			alert("请输入正确的邮箱")
		}
		else if(dec_id==""){
			alert("请输入设备号");
			return;
		}
		else if(pass_id==""){
			alert("请输入密码");
			return;
		}
		else if(config_id==""){
			alert("请输入确认密码");
			return;
		}
		else if(email_id==""){
			alert("请输入邮箱");
			return;
		}
		else if(pass_id!=config_id){
			alert("两次输入的密码不相同")
		}
		else{
			var data={
	 			"email":email_id,
	 			"user_id":dec_id,
	 			"password":pass_id
	 		}
	 		$.ajax({
	 			url:"/register",
	 			data:data,
	 			type:"post",
	 			success:function(data){
	 				if(data.code==0){
	 					alert("恭喜您，注册成功！请返回登录！");
	 					window.location.href="login.html";
	 				}else{
	 					alert("注册失败");
	 				}
	 			}
	 		});
			//window.location.href="login.html"
		}
	})
})

$(function(){
	//验证码
	function valid_email(email) {
	 	var patten = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/); 
	 	return patten.test(email); 
	 }
	touch.on("#delFind","tap",function(){
		$("#find_email").val("");
	})
	function sent(){
		var code = $("#find_email").val();
		var data={"email":code};
		$.ajax({
				type:"post",
				url:"/forget",
				data:data,
				async:true,
				success:function(res){
					if(res.code==0){
					$("#findPassWord").attr("class","container hidden");
			        $("#verCode").attr("class","container");
			        localStorage.email=code;
			        window.test=res.msg;
			       }else{
			       	alert("用户名不存在！")
			       }
				},
				error:function(){
					alert("您的验证邮箱有误！")
				}
			});
	}
	touch.on("#sendCode","tap",function(){
		if(!valid_email($("#find_email").val())){
			alert("输入正确邮箱账号")
		}else{
           sent();
		}
	})
	//验证码填写
	touch.on("#delCode","tap",function(){
		$("#valid_code").val("");
	})
	touch.on("#registerId","tap",function(){
		//ajax重新发送验证码
		sent();
	})
	touch.on("#nextFind","tap",function(){
		if($("#valid_code").val()==""){
			alert("请输入验证码");
		}else if($("#valid_code").val()!=test){
			alert("验证码输入错误！")
		}else{
			window.location.href="reset_pass_word";
		}
	})
})

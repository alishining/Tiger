$(function(){
	touch.on("#delNew","tap",function(){
		$("#newPass").val("");
	});
	touch.on("#delOld","tap",function(){
		$("#oldPass").val("");
	});
	touch.on("#finish_login","tap",function(){
		if($("#newPass").val()==""||$("#oldPass").val()==""){
			alert("密码和确认密码不能为空")
		}else if($("#newPass").val()!=$("#oldPass").val()){
			alert("两次密码输入不一致");
		}else{
			//ajax请求
			var data={"email":localStorage.email,"password":$("#newPass").val()};
			$.ajax({
				type:"post",
				url:"/reset",
				data:data,
				async:true,
				success:function(){
					alert("恭喜您，密码修改成功！请重新登录！");
					window.location.href="login";
				},
				error:function(){
					alert("密码修改失败，请尝试重新修改！")
				}
			});
		}
	})
})

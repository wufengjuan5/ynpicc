$(function(){
	var reg = /^[A-Za-z0-9]{6,20}$/,
		new_pwd=$('.new_pwd').val();
	$("#modifyPwd").click(function(){
		var old_pwd=$(".old_pwd").val(),
			new_pwd=$(".new_pwd").val(),
			repeat_pwd=$(".repeat_pwd").val();
		if(old_pwd==""){
			$(".per_hint").html("请输入原始密码！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    	},2000);
	    	return false;
		}
		if(new_pwd==""){
			$(".per_hint").html("请输入新密码！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    	},2000);
	    	return false;
		}
		if(!reg.test(new_pwd)){
			$(".per_hint").html("密码位数必须在6和20位之间！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    	},2000);
	    	return false;
		}
		if(repeat_pwd==""){
			$(".per_hint").html("请再次输入新密码！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    	},2000);
	    	return false;
		}
		if(new_pwd!=repeat_pwd){
			$(".per_hint").html("两次输入密码不一致！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    	},2000);
	    	return false;
		}
		var data={
			"account":localStorage.getItem("userName"),
			"old_passwd":old_pwd,
			"new_passwd":new_pwd
		};
		console.log(data);
		var paramObj = data;
		var dofunc = function(response){
			$(".per_hint").html("修改密码成功！");
			$(".per_hint").fadeIn(500);
	    	setTimeout(function(){
	    		$(".per_hint").hide();
	    		window.location.href="./personal.html";
	    	},3000);
		};
		AjaxPost('updatePassword',paramObj,dofunc);
	})
})
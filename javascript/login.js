$(document).ready(function(){
	//初始化页面时验证是否记住密码
	if (localStorage.getItem("rmbUser") == "true") {
        $(".rmbUser").attr("checked", true);
        $(".log_user").val(localStorage.getItem("userName"));
        $(".log_pawd").val(localStorage.getItem("passWord"));
    }
})

$(function(){
	$(".log_user").focus();

	/*登录页面的密码框的切换*/
    $(".log_pwd_icon").click(function(){
    	if($(".log_pawd").attr("type")=="password"){
    		$(this).addClass("log_pwd_close");
    		$(".log_pawd").attr("type","text");
    	}else if($(".log_pawd").attr("type")=="text"){
    		$(this).removeClass("log_pwd_close");
    		$(".log_pawd").attr("type","password");
    	}
    })

    /*登录页面清空文本框*/
    $(".log_us_icon").click(function(){
    	$(".log_user,.log_pawd").val("");
    })

    /*点击登录时的判断*/
	$(".log_submit").click(function(){
		var log_username=$(".log_user").val(),
			log_password=$(".log_pawd").val();
			localStorage.setItem("userName", log_username); 
			localStorage.setItem("passWord", log_password);
			localStorage.setItem("rmbUser",$(".rmbUser").is(":checked"));
		if(log_username=="" || log_password==""){
			$(".log_hint").show().html("用户名或者密码不能为空");
			setTimeout(function(){
				$(".log_hint").hide();
			},3000);
			return false;
		}
		
		var data={
				"account":log_username,
				"passwd":log_password,
				"device":"app"
			};
		$.ajax({
			type:'post',
			url:URL_prefix+"peacemap/enongxian/post/?userLogin",
			dataType:"json",
			headers: {
	            'Authority': "",
	            'CityCode':"",
	            'Device':'app'
        	},
			data:JSON.stringify(data),
			success:function(data){
				console.log(data);
				var code=data.code;
				if(code==0){
					var children=data.result.children,
						checkulHtml="";
						$('.log_checkp').html('请选择'+data.result.city_name)
					if(children.length>0){
						$.each(children,function(i,item){
							checkulHtml+='<li citycode="'+item.city_code+'">'+item.name+'</li>';
						})
						$(".log_checkul").html(checkulHtml);
						$(".log_checkcity").show();
						$(".log_checkul>li").click(function(){

							var checkname=$(this).text(),
								checkcode=$(this).attr("citycode"),
								name=data.result.name,
								work_num=data.result.work_num,
								user_id=data.result.user_id,
								token=data.result.token;
							localStorage.setItem("name", name);
							localStorage.setItem("work_num", work_num);
							localStorage.setItem("user_id", user_id);
							localStorage.setItem("token", token);
							localStorage.setItem("city_code", checkcode);
							$(".log_checkcity").hide();
							window.location.href="index.html";
						})
					}else{
						var name=data.result.name,
							work_num=data.result.work_num,
							user_id=data.result.user_id,
							token=data.result.token,
							city_code=data.result.city_code;
						localStorage.setItem("name", name);
						localStorage.setItem("work_num", work_num);
						localStorage.setItem("user_id", user_id);
						localStorage.setItem("token", token);
						localStorage.setItem("city_code", city_code);
						window.location.href="index.html";
					}    
				}else if(code==2){
					$(".log_hint").show().html("用户名或密码错误");
					setTimeout(function(){
						$(".log_hint").hide();
					},3000);
					return false;
				}else if(code==8){
					$(".log_hint").show().html("账户没有权限登录");
					setTimeout(function(){
						$(".log_hint").hide();
					},3000);
					return false;
				}else if(code==11){
					$(".log_hint").show().html("用户无权限登录");
					setTimeout(function(){
						$(".log_hint").hide();
					},3000);
					return false;
				}else if(code==58){
					$(".log_hint").show().html("该城市没有地图数据");
					setTimeout(function(){
						$(".log_hint").hide();
					},3000);
					return false;
				}
			},
			error:function(message){
				console.log(message);
			}
		})
	})

	/*记住密码*/
//	$(".rmbUser").click(function(){
//		saveUserInfo();
//	})
    	//保存用户信息
//	function saveUserInfo() {
//	    if ($(".rmbUser").is(":checked") == true) {
//	        var userName = $(".log_user").val(),
//	        	passWord = $(".log_pawd").val();
//	        localStorage.setItem("rmbUser", "true"); 
//	        localStorage.setItem("userName", userName); 
//	        localStorage.setItem("passWord", passWord); 
//	        //console.log(localStorage.setItem("userName"));
//	    }else {
//	        localStorage.removeItem("rmbUser", "false");
//	        localStorage.removeItem("userName", '');
//	        localStorage.removeItem("passWord", '');
//	    }
//	}

})
function AjaxGet(interface,paramObj,func) {
    var strUrl = "";
    var responseJson = "";
    if(paramObj == "" || paramObj == null){
        strUrl = "";
    }else{
        for(var key in paramObj){
            strUrl += "&"+key+"="+paramObj[key];
        }
    }
    var url = URL_prefix+"peacemap/enongxian/get/?"+interface+strUrl;
    $.ajax({
        type:"GET",
        url : url,
        async:true,       
        headers: {
            'Authority': window.localStorage.getItem("token"),
            'CityCode':window.localStorage.getItem("city_code"),
            'Device':'app'
        },
        contentType: "application/json; charset=utf-8",
        dataType : 'json',
        success : function(response) {
            if(response.code===0 || response.code===61 || response.code===62 || response.code===24){
//              responseJson = response;
				if(response.code===61){
            		console.log('地块在村界外！',response.result.insurance_id);
            	}else if(response.code===62){
            		console.log('村里投保面积 已经超过台账面积！',response.result.insurance_id);
            	}else{
            		func(response);
            	}
            }else{
                showErrorCodeMessage(response);
            }
        },
        error:function (message) {
            console.log("请求发送失败，请与管理员联系！");
            $(".und_hint").show().html("请求发送失败，请与管理员联系！");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
        }
    });
//  return responseJson;

}

function AjaxPost(interface,paramObj,func) {
// var responseJson="";
    var url = URL_prefix+"peacemap/enongxian/post/?"+interface;
    $.ajax({
        type:"POST",
        url : url,
        async:true,
        headers: {
            'Authority': window.localStorage.getItem("token"),
            'CityCode':window.localStorage.getItem("city_code"),
            'Device':'app'
        },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(paramObj),
        dataType: "json",
        success:function(response){
            if(response.code===0 || response.code===61 || response.code===62||response.code===24){
//              responseJson = response;
				if(response.code===61){
            		console.log('地块在村界外！',response.result.insurance_id);
            	}else if(response.code===62){
            		console.log('村里投保面积 已经超过台账面积！',response.result.insurance_id);
            	}else{
            		func(response);
            	}
            }else{
                showErrorCodeMessage(response);
            }
        },
        error:function(message){
            console.log("请求发送失败，请与管理员联系！");
            $(".und_hint").show().html("请求发送失败，请与管理员联系！");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
        }
    });
//  return responseJson;
}
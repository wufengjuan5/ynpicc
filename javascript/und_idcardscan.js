document.addEventListener("deviceready",btnClick,false);
/*身份证识别*/
function btnClick(){
	$("#is_dt").click(function(){
		cordova.plugins.ExCardPlugin.show(
	        function(msg){
	            console.log(msg);
	            var msgs=JSON.parse(msg);
	            addShuiYin("file://"+msgs.cardImgsrc,"../images/iv_shuiyin.png",function(imageURI){
	            	$(".is_name").val(msgs.name);
	            	$(".is_sex").val(msgs.sex);
	            	$(".is_nation").val(msgs.nation);
	            	$(".is_birth").val(msgs.birth);
	            	$(".is_address").val(msgs.address);
	            	$(".is_cardnum").val(msgs.cardnum);
	            	$(".is_headimg").attr("src",msgs.faceImgsrc+'?r='+Math.random());
	            	$(".is_headimg").addClass("is_headimgs");
	            	$(".is_cardimg").attr("src",imageURI);
	            	$(".is_cardimg").addClass("is_cardimgs");
	            });
	        },
	        function(msg){
	            console.log(msg);
	        }
	    );
	})
	$("#is_dt2").click(function(){
		cordova.plugins.ExCardPlugin.show(
	        function(msg){
	            console.log(msg);
	            var mesg=JSON.parse(msg);
	            addShuiYin("file://"+mesg.backCardImgsrc,"../images/iv_shuiyin.png",function(imageURI){
	            	$(".is_sign").val(mesg.office);
	            	$(".is_useful").val(mesg.validdate);
	            	$(".is_backimg").attr("src",imageURI);
	            	$(".is_backimg").addClass("is_backimgs");
	            });
	        },
	        function(msg){
	            console.log(msg);
	        }
	    );
	})
}

$(function(){
	var type = getQueryString("type");
	$(".ud_back").click(function(){
		if (type=="register") {
			window.location.href="./register_info.html";
		}else if(type=="claim_info"){
			window.location.href="./claim_info.html";
		}else{
			window.location.href="./und_info.html";
		}
	})

	/*点击完成按钮*/
	$(".is_finish").click(function(){
		var cardscan={
			"name":$(".is_name").val(),
	        "sex":$(".is_sex").val(),
	        "nation":$(".is_nation").val(),
	        "birth":$(".is_birth").val(),
	        "address":$(".is_address").val(),
	        "cardnum":$(".is_cardnum").val(),
	        "imgsrc1":$(".is_cardimg").attr("src"),
	        "imgsrc2":$(".is_backimg").attr("src")
		};
		console.log(cardscan);
		sessionStorage.setItem("cardscan",JSON.stringify(cardscan));
		if (type=="register") {
			window.location.href="./register_info.html";
		}else if(type=="claim_info"){
			window.location.href="./claim_info.html";
		}else{
			window.location.href="./und_info.html";
		}
	})
});
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	console.log(r)
	if (r != null) return decodeURI(r[2]); return null; 
}
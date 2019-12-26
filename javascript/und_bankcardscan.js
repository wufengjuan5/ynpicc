document.addEventListener("deviceready",clickBankCard,false);
var imagesrc="";
/*银行卡识别*/
function clickBankCard(){
	$("#id_dt").click(function(){
		cordova.plugins.ExBankCardPlugin.show(
	        function(msg){
	            console.log(msg);
	            var msgs=JSON.parse(msg);
	            addShuiYin("file://"+msgs.imagesrc,"../images/iv_shuiyin.png",function(imageURI){
	            	var num = msgs.number;
	            	$(".id_number").val(num.replace(/\s/g,""));
	            	$(".id_bank").val(msgs.bankName);
	            	$(".id_name").val(msgs.cardName);
	            	$(".id_type").val(msgs.cardType);
	            	$(".id_date").val(msgs.valid);
	            	imagesrc = imageURI;
	            	$(".bankcimg").attr("src",msgs.cardNoImgsrc+'?r='+Math.random());
	            	$(".bankcimg").addClass("bankcimgs");
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
		}else{
			window.location.href="./und_info.html";
		}
	});

	/*点击完成按钮*/
	$(".id_finish").click(function(){
		var bankscan={
			"number":$(".id_number").val(),
	        "bank":$(".id_bank").val(),
	        "name":$(".id_name").val(),
	        "type":$(".id_type").val(),
	        "date":$(".id_date").val(),
	        "imgsrc":imagesrc
		};
		console.log(bankscan);
		sessionStorage.setItem("bankscan",JSON.stringify(bankscan));
		if (type=="register") {
			window.location.href="./register_info.html";
		}else{
			window.location.href="./und_info.html";
		}
	});

})
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	console.log(r)
	if (r != null) return decodeURI(r[2]); return null; 
}
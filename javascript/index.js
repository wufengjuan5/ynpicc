$(function(){
	document.addEventListener("plusready", function() {  
	    // 注册返回按键事件  
	    plus.key.addEventListener('backbutton', function() {  
	        // 事件处理  
	        plus.nativeUI.confirm("是否退出程序？", function(event) {  
	            if (event.index) {  
	                plus.runtime.quit();  
	            }  
	        }, null, ["取消", "确定"]);  
	    }, false);  
	});  
})
function getInfoTypeText(type){
	var str = '';
	switch(type){
		case '2':str = "确权地块";break;
		case '3':str = "历史承保地块";break;
	}
	return str;
}
//身份证号隐藏
function plusXing (str,frontLen,endLen) { 
	var len = str.length-frontLen-endLen;
	var xing = '';
	for (var i=0;i<len;i++) {
		xing+='*';
	}
	return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}
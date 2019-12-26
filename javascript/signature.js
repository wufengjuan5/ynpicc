document.addEventListener("deviceready", onDeviceReadys, false);
function onDeviceReadys(){
	$(".ud_back").click(function(){
    	window.location.href="./und_infoPerview.html";
    })
	//初始化动作，根据DOM的ID不同进行自定义，如果不写则内部默认取这四个
	$().esign("canvasEdit", "sign_show", "sign_clear", "sign_ok");
}

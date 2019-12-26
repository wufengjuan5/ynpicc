$(function(){
	loadImgList();
	$(".ud_back").click(function(){
    	window.history.back();
   });
   $(".piclist").find("img").on("click",function(){
   		window.location.href = "./bigimg.html?src="+$(this).attr("src");
   });
   
   $(".piclist").find("img").on("touchstart",function(e){
   		e.stopPropagation();
		var _this=this;
		time=setTimeout(function(){
			$("#und_mark2").show();
			$(".mr_cancle2").click(function(){
				$("#und_mark2").hide();
			})
			var type = getQueryString("type");
			$(".mr_sure2").click(function(){
				$(_this).css("display","none");
				var url = $(_this).attr("src");
				$(_this).remove();
				var delImg = "";
				if (type=="claim") {
					delImg =sessionStorage.getItem("del_claim_Imgs")!=null?JSON.parse(sessionStorage.getItem("del_claim_Imgs")):[];
				}else{
					delImg =sessionStorage.getItem("delImgs")!=null?JSON.parse(sessionStorage.getItem("delImgs")):[];
				}
				delImg.push(url);
				console.log(delImg)
				if (type=="claim") {
					sessionStorage.setItem("del_claim_Imgs",JSON.stringify(delImg));
				}else{
					sessionStorage.setItem("delImgs",JSON.stringify(delImg));
				}
				$("#und_mark2").hide();
			})
		},500);
		
	})
	$(".piclist").find("img").on("touchmove",function(e){
		clearTimeout(time);
	})
	$(".piclist").find("img").on("touchend",function(e){
		clearTimeout(time);
	})
});
function loadImgList(){
	var type = getQueryString("type");
	var imgs = "";
	var delImg = "";
	if (type=="claim") {
		imgs = JSON.parse(sessionStorage.getItem("claim_imgs"));
		delImg =sessionStorage.getItem("del_claim_Imgs")!=null?JSON.parse(sessionStorage.getItem("del_claim_Imgs")):[];
	}else{
		imgs = JSON.parse(sessionStorage.getItem("imgs"));
		delImg =sessionStorage.getItem("delImgs")!=null?JSON.parse(sessionStorage.getItem("delImgs")):[];
	}
	var el = $(".piclist");
	for (var i=0;i<imgs.length;i++) {
		if (delImg.indexOf(imgs[i])==-1) {
			el.append('<img src="'+imgs[i]+'" class="big_img">');
		}
	}
}

function getQueryString(name) {
	console.log(name)
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	console.log(r)
	if (r != null) return decodeURI(r[2]); return null; 
}
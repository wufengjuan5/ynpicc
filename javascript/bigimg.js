$(function(){
    var src=getUrlParam("src");
    $(".big_img").attr("src",src);
	$('div.cell').each(function () {
        new RTP.PinchZoom($(this), {});
    });
    $(".ud_back").click(function(){
    	window.history.back();
    })
})
function getUrlParam (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
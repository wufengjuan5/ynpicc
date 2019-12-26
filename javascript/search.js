$(function(){
    $(".se_text").focus();
    function getUrlParam (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var typ=getUrlParam("typ");
    if(typ=="ud"){
        //页面点击取消
        $(".se_cancle").click(function(){
            window.location.href="./underwrite.html";
        })
    }
    if(typ=="cla"){
        //页面点击取消
        $(".se_cancle").click(function(){
            window.location.href="./claim.html";
        })
    }
	var bind_name="input";//定义所要绑定的事件名称
    if(navigator.userAgent.indexOf("MSIE")!=-1) bind_name="propertychange";//判断是否为IE内核 IE内核的事件名称要改为propertychange
       
    $("input[name='underwriteSearch']").bind(bind_name,function(){
        var keyWord = $("#underwriteSearch").val();  
    	var myReg = /^[\u4e00-\u9fa5]+$/;   //判断汉字的正则表达式 
    	if(myReg.test(keyWord)){
    		$(".ut_dl_search1").hide();
    		$(".ud_tab_search1").show();
            if(typ=="ud"){
                getPolicy(keyWord,"","",".ut_ul_search1");
            }
            if(typ=="cla"){
                getClaim(keyWord,"","",".ut_ul_search1");
            }	
    	}
    	if(keyWord==""){
    		$(".ut_dl_search1").show();
    		$(".ud_tab_search1").hide();
    	}
    });
})
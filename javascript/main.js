$(document).ready(function(){
    if(localStorage.getItem("name")==null){
        window.location.href="./login.html";
    };
})

$(function(){

	/*首页的承保和理赔按钮点击跳转*/
	$(".underwrite_btn").click(function(){
		window.location.href="./html/underwrite.html";
	})
	$(".claim_btn").click(function(){
		window.location.href="./html/claim.html";
	})

	//搜索框默认获取焦点
	$(".se_text,.log_user").focus();

	/*tab切换*/
	$('.ud_tab li').click(function() {
        var i = $(this).index();
        $(this).addClass('ud_active').siblings().removeClass('ud_active');
        $('.ud_tab_content').children(".ut_content").eq(i).show().siblings().hide();
    });

    //新建页面的tab切换
    $('.und_tab_ul li').click(function() {
        var i = $(this).index();
        $(this).addClass('und_tab_active').siblings().removeClass('und_tab_active');
        $('.und_tab_ol li').eq(i).show().siblings().hide();
    });


    /*工具箱页面的用户标记点击提示*/
    $(".user_annotation").click(function(){
    	$(".kit_hint").fadeIn(500);
    	setTimeout(function(){
    		$(".kit_hint").hide();
    	},2000);
    })

    /*个人中心是否使用地图缓存*/
    $(".isMap").click(function(){
    	$(this).toggleClass("yeah_map");
    })


})
/*=====================================有多个页面用到的公共函数===================================*/

/*获取发卡银行列表*/
function showBankList(){
    var data={
        "city_code":localStorage.getItem("city_code")
    };
    var showbank=function(response){
        //console.log(response);
        var result=response.result,
            bankName="";
        $.each(result,function(i,item){
            bankName+='<li bankid="'+item.id+'">'+item.name+'</li>';
            
        })
        $(".und_iscrol_ul_bank").html(bankName);
        if($(".und_iscrol_ul_bank").html()==""){
            $(".und_hint").show().html("没有获取到数据!");
            setTimeout(function(){
                $(".und_hint").hide();
            },1500);
            return false;
        }else{
            $(".und_iscroll_wraper1").show();
            $(".und_bankscrol_cancle").click(function(){
                $(".und_iscroll_wraper1").hide();
                $('.und_bank_text').prop('value','');
            })
            kongbai(".und_iscroll_wraper1");
        }
        $('.und_bank_text').on('input',function(){
            var bank_value=$(this).val(),
                bankName_list=[],
                bankName='',
                re=new RegExp(bank_value,'ig');
            for(var i=0; i<result.length;i++){
                if(result[i].name.search(re)>-1){
                    bankName_list.push(result[i])
                }
            };
            if(bankName_list.length>0){
                $.each(bankName_list,function(i,item){
                    bankName+='<li bankid="'+item.id+'">'+item.name+'</li>';
                })
            };
            $(".und_iscrol_ul_bank").html(bankName);
            $(".und_iscrol_ul_bank li").click(function(){
                var bank_name=$(this).text(),
                    bank_id=$(this).attr("bankid");
                $(".und_iscroll_wraper1").hide();
                $(".uInfo_Issuer").val(bank_name);
                $(".uInfo_Issuer").attr("bankid",bank_id);
                $(".uInfo_located").val("");
                $(".uInfo_located").attr("brunchid","");
            })
        })
        $(".und_iscrol_ul_bank li").click(function(){
            var bank_name=$(this).text(),
                bank_id=$(this).attr("bankid");
            $(".und_iscroll_wraper1").hide();
            $(".uInfo_Issuer").val(bank_name);
            $(".uInfo_Issuer").attr("bankid",bank_id);
            $(".uInfo_located").val("");
            $(".uInfo_located").attr("brunchid","");
        })
    }
    AjaxGet("getBankName",data,showbank);
}

/*获取所在支行列表*/
function getBrunchList(){
    var bank_id=$(".uInfo_Issuer").attr("bankid"),
        data={
        "bank_id":bank_id,
        "city_code":localStorage.getItem("city_code")
    };
    var getbrunch=function(response){
        //console.log(response);
        var result=response.result,
            brunchName="";
        $.each(result,function(i,item){
            brunchName+='<li brunchid="'+item.id+'">'+item.subname+'</li>';
        })
        $(".und_iscrol_ul_brunch").html(brunchName);
        if($(".und_iscrol_ul_brunch").html()==""){
            $(".und_hint").show().html("没有获取到数据!");
            setTimeout(function(){
                $(".und_hint").hide();
            },1500);
            return false;
        }else{
            $(".und_iscroll_wraper2").show();
            $(".und_brunchscrol_cancle").click(function(){
                $(".und_iscroll_wraper2").hide();
                $(".und_brunch_text").prop('value','');
            })
            kongbai(".und_iscroll_wraper2");
        }
        $('.und_brunch_text').on('input',function(){
            var brunch_val=$(this).val(),
                brunch_list=[],
                brunchName="",
                re=new RegExp(brunch_val,'ig');
            for(var i=0; i<result.length; i++){
                if(result[i].subname.search(re)>-1){
                    brunch_list.push(result[i]);
                }
            }
            if(brunch_list.length>0){
                $.each(brunch_list,function(i,item){
                    brunchName+='<li brunchid="'+item.id+'">'+item.subname+'</li>';
                })
            };
            $(".und_iscrol_ul_brunch").html(brunchName);
            $(".und_iscrol_ul_brunch li").click(function(){
                var brunch_name=$(this).text(),
                    brunchid=$(this).attr("brunchid");
                $(".und_iscroll_wraper2").hide();
                $(".uInfo_located").val(brunch_name);
                $(".uInfo_located").attr("brunchid",brunchid);
            })
        })
        $(".und_iscrol_ul_brunch li").click(function(){
            var brunch_name=$(this).text(),
                brunchid=$(this).attr("brunchid");
            $(".und_iscroll_wraper2").hide();
            $(".uInfo_located").val(brunch_name);
            $(".uInfo_located").attr("brunchid",brunchid);
        })
    }
    AjaxGet("getBankList",data,getbrunch);
}

/*点击空白处下拉框消失*/
function kongbai(tag){
    event.stopPropagation();
    var tag=$(tag),
        flag=true;
    $(document).bind("click",function(e){
        var target=$(e.target);
        if(target.closest(tag).length==0 && flag==true){
            $(tag).hide();
            flag=false;
        }
    })
}
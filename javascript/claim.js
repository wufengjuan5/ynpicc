document.addEventListener("deviceready", getClaimUnfinish, false);
/*操作本地数据库*/
function initDatabase() {
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    if(!db) {
        alert("您的浏览器不支持HTML5本地数据库");
        return;
    }
    db.transaction(function (trans) {//启动一个事务，并设置回调函数
        //执行创建表的Sql脚本
        trans.executeSql("CREATE TABLE IF NOT EXISTS IsFinishClaim (id integer primary key, isfinish text, createtime text, insurance_id text, name text, id_number text, kind_name text, kind_id text, self_payment text, phone_number text, land_number text, land_property text, image_number text, survey_site_xz text, survey_site_c text, insurance_area text, degree_damage text, disaster_cause text, disaster_area text, disaster_time text, growth_period text, survey text, lands text, citycode text, userid text,insurance_lands text,imgs text, cInfo_pfrate text, cInfo_pfmoney text, danweibaoe text, flags text, village_id text, disaster_id text, pkey text)",
          [],
          function (trans, result) {
            console.log("create table ok");
        }, function (trans, err) {//消息的回调函数alert(message);});
            console.log(err.message);
        })
    });
}

/*获取理赔未完成列表*/
function getClaimUnfinish(){
    initDatabase();
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    var citycode = localStorage.getItem("city_code");
    var userid = localStorage.getItem("user_id");
    console.log(userid)
    //未完成列表
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM IsFinishClaim WHERE isfinish=0 and citycode='+citycode+' and userid='+userid, [], function (tx, results) {
            var rows = results.rows,
                len = results.rows.length,
                unFinishClaim="";
                console.log(rows)
            if(len=="0"){
                $(".cla_dl_unfinish").show(); 
                $(".cla_ul_unfinish").hide();
            }else{
                for(var i=rows.length-1;i>-1;i--){
                	if (rows.item(i).name!="null"&&rows.item(i).createtime!="null"&&rows.item(i).kind_name!="null") {
	                    unFinishClaim+='<li insertid="'+rows.item(i).id+'" class="click_unli ut_clickli1">'+
	                        '<div class="ut_swiper ut_swiper1 click_unbox">'+
	                            '<h5 class="ut_name">'+rows.item(i).name+'</h5>'+
	                            '<p class="ut_p1">'+
	                                '<span class="ut_time">'+rows.item(i).createtime+'</span>'+
	                                '<span class="ut_dataNum">数据量：<e class="ut_number">'+parseInt(rows.item(i).land_number)+'块/'+rows.item(i).insurance_area+'亩/'+parseInt(rows.item(i).image_number)+'张</e></span>'+
	                            '</p>'+
	                            '<p class="ut_p2">';
	                        if(rows.item(i).kind_name=="桃"){
	                            unFinishClaim+='<img src="../images/taozi.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="核桃" || rows.item(i).kind_name=="棉花"){
	                            unFinishClaim+='<img src="../images/wenshidp.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="大豆"){
	                            unFinishClaim+='<img src="../images/douleizhiwu.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="油菜"){
	                            unFinishClaim+='<img src="../images/youcai.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="玉米"){
	                            unFinishClaim+='<img src="../images/yumi.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="苹果"){
	                            unFinishClaim+='<img src="../images/pingguo.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="小麦"){
	                            unFinishClaim+='<img src="../images/xiaomai.png" class="ut_icon">';
	                        }else if(rows.item(i).kind_name=="樱桃"){
	                            unFinishClaim+='<img src="../images/yingtao.png" class="ut_icon">';
	                        }
	                    unFinishClaim+='<span class="ut_variety">'+rows.item(i).kind_name+'</span>'+
	                             '</p>'+
	                        '</div>'+
	                        '<div class="ut_rightBtn ut_rightBtn2">'+
	                            '<i class="ut_rshan ut_rshan1"><e class="und_icon">&#xe622;</e><b class="ut_bb">删除</b></i>'+
	                        '</div>'+
	                        '<span class="ut_arrow ut_arrow1"></span>'+
	                    '</li>';
                	}
                }
                
                $(".cla_ul_unfinish").html(unFinishClaim);
                if ($(".cla_ul_unfinish").html()=='') {
                    $(".cla_ul_unfinish").hide();
                    $(".cla_dl_unfinish").show();
                }else{
                    $(".cla_ul_unfinish").show();
                    $(".cla_dl_unfinish").hide();

                }
               	$(".cla_ul_unfinish").find(".click_unbox").click(function(){
                    var insert_id=$(this).parent(".click_unli").attr("insertid");
                    console.log(insert_id);
                    localStorage.setItem("insert_id",insert_id);
                    localStorage.setItem("type","unfinish");
                    window.location.href="./claim_info.html";
                })

                $(".cla_ul_unfinish").find(".ut_arrow").click(function(){
                    $(this).parents(".click_unli").toggleClass("swipeleft").siblings(".click_unli").removeClass("swipeleft");
                    return false;
                })

                $(".cla_ul_unfinish").find(".ut_rshan1").click(function(){
                    $(".und_pspan2").html("删除").addClass("und_delete");
                    $(".und_pb").html("确认删除所选内容？");
                    $(".und_posmark").show();
                    $(this).parents(".click_unli").removeClass("swipeleft");
            
                    var insertid=$(this).parents(".click_unli").attr("insertid");
                    $(".und_delete").click(function(){
                        event.stopPropagation();
                        var db = window.sqlitePlugin.openDatabase({
                            name:'myDatabase.db',
                            location: 'default'
                        });
                        db.transaction(function(tx){ 
                            //提交成功后删除本地数据库内容
                            tx.executeSql("DELETE FROM IsFinishClaim WHERE id="+insertid,[],function(tx,results){
                            //   alert("ok");
                              window.location.reload();
                            // window.location.href="./claim.html";
                              $(".und_posmark").hide();
                            }, function(tx,message) {
                                console.log("ERROR: " + message.message);
                            });
                        });
                    })
                })
                $(".und_pspan1").click(function(){
                    $(".und_posmark").hide();
                })
            }  
        },function(tx,message) {
            alert( message.message)
            console.log("ERROR: " + message.message);
        });     
    });
}
$(function(){
  /*获取理赔已完成列表*/ 
    $('#ud_tab2 li').click(function() {
        var i = $(this).index();
        $(this).addClass('ud_active').siblings().removeClass('ud_active');
        $('.ud_tab_content').children(".ut_content").eq(i).show().siblings().hide();
        if(i==1){
            getClaim("",".cla_dl_finish",".cla_ul_finish",".cla_ul_finish");
        };        
    });

  /*跳转搜索页面*/
    $("#cla_search").click(function(){
       window.location.href="./search.html?typ=cla";
    })

  /*点击新建*/
  $("#claim_new").click(function(){
      var db = window.sqlitePlugin.openDatabase({
          name:'myDatabase.db',
          location: 'default'
      });
      var citycode = localStorage.getItem("city_code");
      var userid = localStorage.getItem("user_id");
      db.transaction(function(tx){ 
            //插入内容
            tx.executeSql("INSERT INTO IsFinishClaim (isfinish, createtime, insurance_id, name, id_number, kind_name, kind_id, self_payment, phone_number, land_number, land_property, image_number, survey_site_xz, survey_site_c, insurance_area, degree_damage, disaster_cause, disaster_area, disaster_time, growth_period, survey, lands,citycode,userid,insurance_lands,imgs, cInfo_pfrate, cInfo_pfmoney, danweibaoe, flags,village_id,disaster_id,pkey) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                ['0','null','null','null','null','null','null','null','null','0','null','0','null','null','null','null','null','null','null','null','null','null',citycode,userid,'null','null','null','null','null','1','null','null','null'],
                function(tx,results){
                    // alert("ok");
                    var insertid=results.insertId;
                    localStorage.setItem("insert_id",insertid);
                    localStorage.setItem("type","unfinish");
                    window.location.href="./claim_info.html";
            },function(tx,message) {
                alert( message.message)
                console.log("ERROR: " + message.message);
            });
        });
  })
})
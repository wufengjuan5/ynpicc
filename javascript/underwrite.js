document.addEventListener("deviceready", onDeviceReadys, false);
/*承保列表*/
function onDeviceReadys(){
    initDatabase();
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    var citycode = localStorage.getItem("city_code");
    var userid = localStorage.getItem("user_id");
    //未完成列表
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM IsFinishTable WHERE isfinish=0 and citycode='+citycode+' and userid='+userid, [], function (tx, results) {
            var rows = results.rows,
                len = results.rows.length,
                unFinishContent="";
            console.log(rows);
            console.log(results);
            if(len=="0"){
                $(".ut_dl_unfinish").show();
                $(".ut_ul_unfinish").hide();
            }else{
                $(".ut_dl_unfinish").hide();
                $(".ut_ul_unfinish").show();
                for(var i=rows.length-1;i>-1;i--){
                	if (rows.item(i).insurant!="null"&&rows.item(i).createtime!="null"&&rows.item(i).labelname!="null"&&rows.item(i).planttowns!="null") {
	                    unFinishContent+='<li insertid="'+rows.item(i).id+'" class="click_unli ut_clickli1">'+
	                        '<div class="ut_swiper ut_swiper1 click_unbox">'+
	                            '<h5 class="ut_name">'+rows.item(i).insurant+'</h5>'+
	                            '<p class="ut_p1">'+
	                                '<span class="ut_time">'+rows.item(i).createtime+'</span>'+
	                                '<span class="ut_dataNum">数据量：<e class="ut_number">'+parseInt(rows.item(i).mcount)+'块/'+rows.item(i).area+'亩/'+parseInt(rows.item(i).picnum)+'张/<em>'+parseInt(rows.item(i).mpicnum)+'张</em></e></span>'+
	                            '</p>'+
	                            '<p class="ut_p2">';
	                        if(rows.item(i).labelname=="桃"){
	                            unFinishContent+='<img src="../images/taozi.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="核桃" || rows.item(i).labelname=="棉花"){
	                            unFinishContent+='<img src="../images/wenshidp.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="大豆"){
	                            unFinishContent+='<img src="../images/douleizhiwu.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="油菜"){
	                            unFinishContent+='<img src="../images/youcai.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="玉米"){
	                            unFinishContent+='<img src="../images/yumi.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="苹果"){
	                            unFinishContent+='<img src="../images/pingguo.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="小麦"){
	                            unFinishContent+='<img src="../images/xiaomai.png" class="ut_icon">';
	                        }else if(rows.item(i).labelname=="樱桃"){
	                            unFinishContent+='<img src="../images/yingtao.png" class="ut_icon">';
	                        }
	                    unFinishContent+='<span class="ut_variety">'+rows.item(i).labelname+'</span>'+
	                                    '<span class="ut_adress">'+rows.item(i).planttowns+'</span>'+
	                             '</p>'+
	                        '</div>'+
	                        '<div class="ut_rightBtn ut_rightBtn2">'+
	                            '<i class="ut_rshan ut_rshan1"><e class="und_icon">&#xe622;</e><b class="ut_bb">删除</b></i>'+
	                        '</div>'+
	                        '<span class="ut_arrow ut_arrow1"></span>'+
	                    '</li>';
                	}
                }
                
                $(".ut_ul_unfinish").html(unFinishContent);
                if ($(".ut_ul_unfinish").find(".ut_clickli1").length==0) {
                	$(".ut_dl_unfinish").show();
                	$(".ut_ul_unfinish").hide();
                }
                $(".click_unbox").click(function(){
                    var insertid=$(this).parent(".click_unli").attr("insertid");
                    console.log(insertid);
                    localStorage.setItem("insertid",insertid);
                    localStorage.setItem("type","unfinish");
                    window.location.href="./und_info.html";
                })

                $(".ut_arrow").click(function(){
                    $(this).parents(".click_unli").toggleClass("swipeleft").siblings(".click_unli").removeClass("swipeleft");
                    return false;
                })
                //touchSwipe("click_unli","click_unli swipeleft");

                $(".ut_rshan1").click(function(){
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
                            tx.executeSql("DELETE FROM IsFinishTable WHERE id="+insertid,[],function(tx,results){
                              //alert("ok");
                              window.location.reload();
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
        });     
    });

    //已完成列表
    getPolicy("",".ut_dl_finish",".ut_ul_finish",".ut_ul_finish");
}

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
        trans.executeSql("CREATE TABLE IF NOT EXISTS IsFinishTable (id integer primary key, isfinish text, createtime text, insurance text, labelname text, kindid text, insurant text, papertype text, paperid text, idnumber text, banknum text, bankcard text, bankid text, bankadress text, brunchid text, telphone text, planttowns text, plantvillage text,villageid text,url1 text,url2 text,url3 text,url4 text,url5 text,picnum text,mpicnum text,area text,tarea text,mcount text,landsArr text,unitinsurance text,insurancepay text,premiumrate text,unitpremium text,grosspremium text,farmarinsurance text,remark text,insurance_id text,start_date text,end_date text,add_insurance text,all_insured_account text,all_total_expenses text,all_expenses_farmer text,citycode text,userid text)",
          [],
          function (trans, result) {
            console.log("create table ok");
        }, function (trans, err) {//消息的回调函数alert(message);});
            console.log(err.message);
        })
    });
}

/*侧滑显示修改删除按钮*/
function touchSwipe(swiperight,swipeleft){
    var expansion = null; //是否存在展开的list
    var container = document.querySelectorAll('.ut_ul li');
    for(var i = 0; i < container.length; i++){    
        var x, y, X, Y, swipeX, swipeY;
        container[i].addEventListener('touchstart', function(event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true ;
            if(expansion){   //判断是否展开，如果展开则收起
                expansion.className = "";
            }        
        });
        container[i].addEventListener('touchmove', function(event){
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
                // 阻止事件冒泡
                event.stopPropagation();
                if(X - x > 10){   //右滑
                    event.preventDefault();
                    this.className = swiperight;    //右滑收起
                }
                if(x - X > 10){   //左滑
                    event.preventDefault();
                    this.className = swipeleft;   //左滑展开
                    expansion = this;
                }
                swipeY = false;
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false;
            }        
        });
    }
}

$(function(){

	/*承保已完成*/
   	$('#ud_tab li').click(function() {
        var i = $(this).index();
        $(this).addClass('ud_active').siblings().removeClass('ud_active');
        $('.ud_tab_content').children(".ut_content").eq(i).show().siblings().hide();   
    });

   	/*跳转搜索页面*/
   	$("#ud_search").click(function(){
   		window.location.href="./search.html?typ=ud";
   	})

    /*iscroll*/
//  var myScroll = new IScroll('.ut_content');

    /*新建*/
    $("#ud_new").click(function(){
        var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        var citycode = localStorage.getItem("city_code");
        var userid = localStorage.getItem("user_id");
        db.transaction(function(tx){ 
            //插入内容
            tx.executeSql("INSERT INTO IsFinishTable (isfinish, createtime, insurance, labelname, kindid, insurant, papertype, paperid, idnumber, banknum, bankcard, bankid, bankadress, brunchid, telphone, planttowns, plantvillage, villageid, url1, url2, url3,url4,url5, picnum,mpicnum, area, tarea, mcount, landsArr, unitinsurance, insurancepay, premiumrate, unitpremium, grosspremium, farmarinsurance, remark, insurance_id,start_date,end_date,add_insurance,all_insured_account,all_total_expenses,all_expenses_farmer,citycode,userid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                ['0','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','0','0','0.0','0.0','0','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null',citycode,userid],
                function(tx,results){
                    //alert("ok");
                    var insertid=results.insertId;
                    localStorage.setItem("insertid",insertid);
                    localStorage.setItem("type","unfinish");
                    //alert(insertid);
                    window.location.href="./und_info.html";
            }, function(tx,message) {
                console.log("ERROR: " + message.message);
            });
            /*tx.executeSql("DROP TABLE IsFinishTable",[],function(tx,results){
                alert("ok");

            }, function(tx,message) {
                  alert("ERROR: " + message.message);
            });*/

        });
    })
    /*$(".droptable").click(function(){
        var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        db.transaction(function(tx){
            tx.executeSql("DROP TABLE IF EXISTS IsFinishTable",[],function(tx,results){
                alert("ok");

            }, function(tx,message) {
                  console.log("ERROR: " + message);
            });
        });
    })
*/
})
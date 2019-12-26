document.addEventListener("deviceready", onDeviceReadys, false);
function onDeviceReadys(){
    initDatabase();
    $("#regNews").click(function(){
		var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        var citycode = localStorage.getItem("city_code");
        db.transaction(function(tx){ 
            //插入内容
            tx.executeSql("INSERT INTO InsureTable (isfinish, address, address_detail, bank_card, bank_pname, bankcard_thumbnail_url, bankcard_url, subbank_name, subbank_id, id_number, id_name, id_thumbnail_url, id_url, kind_id, name, other_image, phone_number, nation, sex,citycode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                ['0','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null',citycode],
                function(tx,results){
                    //alert("ok");
                    var rinsertid=results.insertId;
                    localStorage.setItem("rinsertid",rinsertid);
                    //alert(insertid);
                    localStorage.setItem("rtype","unfinish");
                    window.location.href="./register_info.html";
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
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    //未完成列表
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM InsureTable WHERE isfinish=0', [], function (tx, results) {
            var rows = results.rows,
                len = results.rows.length,
                unFinishRegContent="";
            console.log(rows);
            console.log(results);
            if(len=="0"){
                $(".reg_dl_unfinish").show();
                $(".reg_ul_unfinish").hide();
            }else{
                $(".reg_dl_unfinish").hide();
                $(".reg_ul_unfinish").show();
                for(var i=0;i<rows.length;i++){
                    unFinishRegContent+='<li class="reg_li ut_clickli1">'+
                                            '<div rinsertid="'+rows.item(i).id+'" class="ut_swiper ut_swiper1 click_unbox">'+
                                                '<p class="reg_name">姓名：'+rows.item(i).name+'</p>'+
                                                '<p class="reg_idNum">'+rows.item(i).id_name+'：'+rows.item(i).id_number+'</p>'+
                                             '</div>'+
                                             '<div class="ut_rightBtn ut_rightBtn2">'+
                                                '<i class="ut_rshan ut_rshan1">'+
                                                    '<e class="und_icon"></e>'+
                                                    '<b class="ut_bb">删除</b>'+
                                                '</i>'+
                                             '</div>'+
                                             '<span class="ut_arrow ut_arrow1"></span>'+
										'</li>';
                }

                
                $(".reg_ul_unfinish").html(unFinishRegContent);
                $(".reg_ul_unfinish").find(".click_unbox").click(function(){
                    var rinsertid=$(this).attr("rinsertid");
                    //console.log(rinsertid);
                    localStorage.setItem("rinsertid",rinsertid);
                    localStorage.setItem("rtype","unfinish");
                    window.location.href="./register_info.html";
                })
                $(".reg_ul_unfinish").find(".ut_arrow").click(function(){
                    $(this).parents(".reg_li").toggleClass("swipeleft").siblings(".reg_li").removeClass("swipeleft");
                    return false;
                })
                $(".reg_ul_unfinish").find(".ut_rshan1").click(function(){
                    $(".und_pspan2").html("删除").addClass("und_delete");
                    $(".und_pb").html("确认删除所选内容？");
                    $(".und_posmark").show();
                    $(this).parents(".reg_li").removeClass("swipeleft");
            
                    var rinsertid=$(this).parents(".reg_li").find('.click_unbox').attr("rinsertid");
                    $(".und_delete").click(function(){
                        event.stopPropagation();
                        var db = window.sqlitePlugin.openDatabase({
                            name:'myDatabase.db',
                            location: 'default'
                        });
                        db.transaction(function(tx){ 
                            //提交成功后删除本地数据库内容
                            tx.executeSql("DELETE FROM InsureTable WHERE id="+rinsertid,[],function(tx,results){
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
        });     
    });

    //已完成列表
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM InsureTable WHERE isfinish=1', [], function (tx, results) {
            var rows = results.rows,
                len = results.rows.length,
                finishRegContent="";
            console.log(rows);
            console.log(results);
            if(len=="0"){
                $(".reg_dl_finish").show();
                $(".reg_ul_finish").hide();
            }else{
                $(".reg_dl_finish").hide();
                $(".reg_ul_finish").show();
                for(var i=0;i<rows.length;i++){
                    finishRegContent+='<li class="reg_li ut_clickli1">'+
                                            '<div rinsertid="'+rows.item(i).id+'" class="ut_swiper ut_swiper1 ut_clickbox" style="width:66%;padding-right:0;">'+
                                                '<p class="reg_name">姓名：'+rows.item(i).name+'</p>'+
                                                '<p class="reg_idNum">'+rows.item(i).id_name+'：'+rows.item(i).id_number+'</p>'+
                                            '</div>'+
                                            '<div class="ut_rightBtn ut_rightBtn2">'+
                                                '<i class="ut_rshan ut_rshan1">'+
                                                    '<e class="und_icon"></e>'+
                                                    '<b class="ut_bb">删除</b>'+
                                                '</i>'+
                                            '</div>'+
											'<span class="ut_arrow ut_arrow1"></span>'+
										'</li>';
                }
                $(".reg_ul_finish").html(finishRegContent);
                $(".reg_ul_finish").find(".ut_clickbox").click(function(){
                    var rinsertid=$(this).attr("rinsertid");
                    //console.log(rinsertid);
                    localStorage.setItem("rinsertid",rinsertid);
                    localStorage.setItem("rtype","finish");
                    window.location.href="./register_info.html";
                })
                $(".reg_ul_finish").find(".ut_arrow").click(function(){
                    $(this).parents(".reg_li").toggleClass("swipeleft").siblings(".reg_li").removeClass("swipeleft");
                    return false;
                })
                $(".reg_ul_finish").find(".ut_rshan1").click(function(){
                    $(".und_pspan2").html("删除").addClass("und_delete");
                    $(".und_pb").html("确认删除所选内容？");
                    $(".und_posmark").show();
                    $(this).parents(".reg_li").removeClass("swipeleft");
            
                    var rinsertid=$(this).parents(".reg_li").find('.ut_clickbox').attr("rinsertid");
                    $(".und_delete").click(function(){
                        event.stopPropagation();
                        var db = window.sqlitePlugin.openDatabase({
                            name:'myDatabase.db',
                            location: 'default'
                        });
                        db.transaction(function(tx){ 
                            //提交成功后删除本地数据库内容
                            tx.executeSql("DELETE FROM InsureTable WHERE id="+rinsertid,[],function(tx,results){
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
        });     
    });
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
        trans.executeSql("CREATE TABLE IF NOT EXISTS InsureTable (id integer primary key, isfinish text, address text, address_detail text, bank_card text, bank_pname text, bankcard_thumbnail_url text, bankcard_url text, subbank_name text, subbank_id text, id_number text, id_name text, id_thumbnail_url text, id_url text, kind_id text, name text, other_image text, phone_number text, nation text, sex text,citycode text)",
          [],
          function (trans, result) {
            console.log("create table ok");
        }, function (trans, err) {//消息的回调函数alert(message);});
            console.log(err.message);
        })
    });
}

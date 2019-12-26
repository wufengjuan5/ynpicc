document.addEventListener("deviceready", onReadys, false);
/*调用相机*/
function onReadys(){
	if(localStorage.getItem("rtype")=="finish"){
		$(".rInfo_name").attr("readonly",true);
		$(".rInfo_idnum").attr("readonly",true);
		$(".rInfo_banknum").attr("readonly",true);
		$(".rInfo_tel").attr("readonly",true);
		$("#regPut").hide();  
		$("#cameraTakePicture1").hide();
		$("#cameraTakePicture2").hide();
		$("#cameraTakePicture3").hide(); 
	}
	/*获取已保存信息*/
	var rinsertid=localStorage.getItem("rinsertid"),
		cardscan=JSON.parse(sessionStorage.getItem("cardscan")),
		bankscan=JSON.parse(sessionStorage.getItem("bankscan"));
		sessionStorage.removeItem("cardscan");
    	sessionStorage.removeItem("bankscan");
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){
		tx.executeSql('SELECT * FROM InsureTable WHERE id="'+rinsertid+'"',[],function (tx, results){ 
            var item=results.rows.item(0);
            //console.log("createtime:"+item.createtime);
			//localStorage.setItem("createdate",item.createtime);
			console.log(item);
			console.log(cardscan);
            if(cardscan!=null){
				var idname=cardscan.name,
					idnum=cardscan.cardnum,
					info_papertype="身份证号",
					img1 = cardscan.imgsrc1,
					img2 = cardscan.imgsrc2,
					info_paperid="0";
				$(".rInfo_name").val(idname);
            	$(".regOl_select3").text(info_papertype);
            	$(".rInfo_idnum").val(idnum);
            	if (img1) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img1+'"></p>');
            	}
            	if (img2) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img2+'"></p>');
            	}
            	
			}else{
				$(".rInfo_name").val(item.name!="null"?item.name:"");
            	$(".regOl_select3").text(item.id_name!="null"?item.id_name:"请选择证件类型");
            	$(".rInfo_idnum").val(item.id_number!="null"?item.id_number:"");
			}
			if(bankscan!=null){
				var banum=bankscan.number,
				img = bankscan.imgsrc;
				$(".rInfo_banknum").val(banum);
				if (img) {
            		$(".und_tab_ol > li").eq(1).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img+'"></p>');
            	}
			}else{
				$(".rInfo_banknum").val(item.bank_card!="null"?item.bank_card:"");
			}
            $(".uInfo_Issuer").val(item.bank_pname!="null"?item.bank_pname:"");
            $(".uInfo_located").val(item.subbank_name!="null"?item.subbank_name:"");
            $(".uInfo_located").attr("brunchid",item.subbank_id!="null"?item.subbank_id:"");
            $(".rInfo_tel").val(item.phone_number!="null"?item.phone_number:"");
            
            if(item.id_url!='null'){
            	var id_url = JSON.parse(item.id_url);
            	for (var i=0;i<id_url.length;i++) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="'+id_url[i].thumbnail+'" src="'+id_url[i].url+'"></p>');
            	}
            }
            if(item.bankcard_url!='null'){
            	var bankcard_url = JSON.parse(item.bankcard_url);
            	for (var i=0;i<bankcard_url.length;i++) {
            		$(".und_tab_ol > li").eq(1).append('<p class="und_tabOl_p2" ><img thumbnail="'+bankcard_url[i].thumbnail+'" src="'+bankcard_url[i].url+'"></p>');
            	}
            }
            if(item.other_image!='null'){
            	var other_image = JSON.parse(item.other_image);
            	for (var i=0;i<other_image.length;i++) {
            		$(".und_tab_ol > li").eq(2).append('<p class="und_tabOl_p2" ><img thumbnail="'+other_image[i].thumbnail+'" src="'+other_image[i].url+'"></p>')
            	}
            }
            if (localStorage.getItem("rtype")=="unfinish") {
            	
            	/*底部照片的操作之长按删除*/
            	var time=0;
            	$(".und_tabOl_p2 img").on("touchstart",function(e){
            		var _this=this;
            		time=setTimeout(function(){
            			$("#und_mark2").show();
            			$(".mr_cancle2").click(function(){
            				$("#und_mark2").hide();
            			})
		
            			$(".mr_sure2").click(function(){
            				$(_this).css("display","none");
            				$(_this).parent().remove();
            				$("#und_mark2").hide();
            			})
            		},500);
            		e.stopPropagation();
            	})
            	$(".und_tabOl_p2 img").on("touchmove",function(e){
					clearTimeout(time);
				})
				$(".und_tabOl_p2 img").off("touchend");
				$(".und_tabOl_p2 img").on("touchend",function(e){
					e.stopPropagation();
					clearTimeout(time);
				})
            }
			/*底部照片的操作之点击放大*/
			$(".und_tabOl_p2 img").off("click");
			$(".und_tabOl_p2 img").on("click",function(){
				var src=$(this).attr("src");
				message("./bigimg.html?src="+src);
			})
			
            sessionStorage.removeItem("cardscan");
	    	sessionStorage.removeItem("bankscan");
      })
	});
	if(localStorage.getItem("rtype")=="unfinish") {
		/*点击选择证件类型*/
		$(".regOl_select3").click(function(event){
	        $(".undOl_select1_list3").toggle();
	        kongbai(".undOl_select1_list3");
	    })
		$(".undOl_select1_list3 li").click(function(){
	        var liText=$(this).text(),
	        	paperid=$(this).attr("paperid");
	        $(this).parent(".undOl_select1_list3").siblings(".regOl_select3").html(liText);
	        $(this).parent(".undOl_select1_list3").siblings(".regOl_select3").attr("paperid",paperid);
	        $(".undOl_select1_list3").hide();
	    })
	
	    /*点击提交*/
	    $("#regPut").click(function(){
	    	var rInfo_name=$(".rInfo_name").val(),
	    		regOl_select3=$(".regOl_select3").text(),
	    		rInfo_idnum=$(".rInfo_idnum").val(),
	    		rInfo_banknum=$(".rInfo_banknum").val(),
	    		uInfo_Issuer=$(".uInfo_Issuer").val(),
	    		uInfo_located=$(".uInfo_located").val(),
	    		uInfo_located_id=$(".uInfo_located").attr("brunchid"),
	    		rInfo_tel=$(".rInfo_tel").val(),
	            myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
	            myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
	            myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
	            // surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
	            // surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
	            // surl3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
	            thumbnail_surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
	            thumbnail_surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
	            url1=myImage1.length>0?JSON.stringify(myImage1):"null",
	            url2=myImage2.length>0?JSON.stringify(myImage2):"null",
				url3=myImage3.length>0?JSON.stringify(myImage3):"null";
			var reg=/^[1][3,4,5,7,8][0-9]{9}$/,
				reg1=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
				reg2=/^[a-zA-Z0-9]*$/;
				if(rInfo_name==""){
	    		$(".und_hint").show().html("请填写被保险人姓名!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
	    	}else if(regOl_select3=="请选择证件类型"){
	    		$(".und_hint").show().html("请选择证件类型!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
	    	}else if(rInfo_idnum==""){
	    		$(".und_hint").show().html("请填写证件号码!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
			}else if(rInfo_idnum!="" && regOl_select3=="身份证号" && reg1.test(rInfo_idnum)===false){
				$(".und_hint").show().html("请检查身份证号!");
				setTimeout(function(){
					$(".und_hint").hide();
				},1500);
				return false;
			}else if(rInfo_idnum!="" && regOl_select3=="社会信用代码" && reg2.test(rInfo_idnum)===false){
				$(".und_hint").show().html("请检查证件号码!");
				setTimeout(function(){
					$(".und_hint").hide();
				},1500);
				return false;
			}else if(rInfo_banknum==""){
	    		$(".und_hint").show().html("请填写银行卡号!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
			}else if(uInfo_Issuer==""){
	    		$(".und_hint").show().html("请填写发卡银行!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
	    	}else if(uInfo_located==""){
	    		$(".und_hint").show().html("请填写所在支行!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);	    	
				return false;
	    	}else if(rInfo_tel==""){
	    		$(".und_hint").show().html("请填写手机号码!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
	    	}else if(!reg.test(rInfo_tel)){
	    		$(".und_hint").show().html("请检查联系电话是否正确");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},2000);
				return false;
			}
			var data={
	            "address":"",
	            "address_detail":"",
	            "bank_card":rInfo_banknum,
	            "bank_pname":uInfo_Issuer,
	            "bankcard_thumbnail_url":thumbnail_surl2,
	            "bankcard_url":url2,
	            "city_code":localStorage.getItem("city_code"),
	            "id_number":rInfo_idnum,
	            "id_thumbnail_url":thumbnail_surl1,
	            "id_url":url1,
	            "kind_id":"",
	            "name":rInfo_name,
	            "nation":"",
	            "other_image":url3,
	            "phone_number":rInfo_tel,
	            "sex":"",
	            "subbank_id":uInfo_located_id,
	            "subbank_name":uInfo_located  
	        };
	        console.log(data);
	        var insurcelist = function(response){
	            console.log(response);
	            if(response.message=="ok"){
	            	var rinsertid = localStorage.getItem("rinsertid"),
			            db = window.sqlitePlugin.openDatabase({
			            name:'myDatabase.db',
			            location: 'default'
			        });
			        db.transaction(function(tx){ 
			            //更新内容
			            tx.executeSql("UPDATE InsureTable SET isfinish=?, bank_card=?, bank_pname=?, bankcard_thumbnail_url=?, bankcard_url=?, subbank_name=?, subbank_id=?, id_number=?, id_name=?, id_thumbnail_url=?, id_url=?, name=?, other_image=?, phone_number=? WHERE id=?",
			                ["1",rInfo_banknum,uInfo_Issuer,thumbnail_surl2,url2,uInfo_located,uInfo_located_id,rInfo_idnum,regOl_select3,thumbnail_surl1,url1,rInfo_name,url3,rInfo_tel,rinsertid],
			                function(tx,results){
			                    //alert("ok");
			                window.location.href="./register.html";
			            }, function(tx,message) {
			                console.log("ERROR: " + message.message);
			            });
	
			        });
	            }
	        };
	        AjaxPost("insertFarmerInfo",data,insurcelist);
	    })
	     /*点击图标跳转到身份证扫描页*/
	    $(".goIdcardScan").click(function(){
	    	message("./und_idcardscan.html");
	    })
	
		/*点击图标跳转到银行卡扫描页*/
		$(".goBankcardScan").click(function(){
			message("./und_bankcardscan.html");
		})
		$(".uInfo_Issuer").on("click",function(e){
    		showBankList();
	    });
	    $(".uInfo_located").on("click",function(e){
	    	getBrunchList();
	    });
	}
    /*点击返回*/
    $("#regBack").click(function(){
        if($(".rInfo_name").val()!="" && $(".regOl_select3").html()!="请选择证件类型" && $(".rInfo_idnum").val()!=""&& $(".rInfo_tel").val()!=""){
            var rinsertid = localStorage.getItem("rinsertid"),
                rInfo_name=$(".rInfo_name").val(),
                regOl_select3=$(".regOl_select3").text(),
                rInfo_idnum=$(".rInfo_idnum").val(),
                rInfo_banknum=$(".rInfo_banknum").val(),
                uInfo_Issuer=$(".uInfo_Issuer").val(),
                uInfo_located=$(".uInfo_located").val(),
                uInfo_located_id=$(".uInfo_located").attr("brunchid"),
                rInfo_tel=$(".rInfo_tel").val(),
                myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
                myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
                myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
                // surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
                // surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
                // surl3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
                thumbnail_surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
                thumbnail_surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
                url1=myImage1.length>0?JSON.stringify(myImage1):"null",
                url2=myImage2.length>0?JSON.stringify(myImage2):"null",
                url3=myImage3.length>0?JSON.stringify(myImage3):"null";
            if(localStorage.getItem("rtype")=="unfinish"){
	            var db = window.sqlitePlugin.openDatabase({
	                name:'myDatabase.db',
	                location: 'default'
	            });
	            db.transaction(function(tx){ 
	                //更新内容
	                tx.executeSql("UPDATE InsureTable SET isfinish=?, bank_card=?, bank_pname=?, bankcard_thumbnail_url=?, bankcard_url=?, subbank_name=?, subbank_id=?, id_number=?, id_name=?, id_thumbnail_url=?, id_url=?, name=?, other_image=?, phone_number=? WHERE id=?",
		                ["0",rInfo_banknum,uInfo_Issuer,thumbnail_surl2,url2,uInfo_located,uInfo_located_id,rInfo_idnum,regOl_select3,thumbnail_surl1,url1,rInfo_name,url3,rInfo_tel,rinsertid],
		                function(tx,results){
		                    //alert("ok");
		                window.location.href="./register.html";
		            }, function(tx,message) {
		                console.log("ERROR: " + message.message);
		            });

	            });
	        }else if(localStorage.getItem("rtype")=="finish"){
	        	var db = window.sqlitePlugin.openDatabase({
	                name:'myDatabase.db',
	                location: 'default'
	            });
	            db.transaction(function(tx){ 
	                //更新内容
	                tx.executeSql("UPDATE InsureTable SET isfinish=?, bank_card=?, bank_pname=?, bankcard_thumbnail_url=?, bankcard_url=?, subbank_name=?, subbank_id=?, id_number=?, id_name=?, id_thumbnail_url=?, id_url=?, name=?, other_image=?, phone_number=? WHERE id=?",
		                ["1",rInfo_banknum,uInfo_Issuer,thumbnail_surl2,url2,uInfo_located,uInfo_located_id,rInfo_idnum,regOl_select3,thumbnail_surl1,url1,rInfo_name,url3,rInfo_tel,rinsertid],
		                function(tx,results){
		                    //alert("ok");
		                window.location.href="./register.html";
		            }, function(tx,message) {
		                console.log("ERROR: " + message.message);
		            });

	            });
	        }
        }else{
            var rinsertid = localStorage.getItem("rinsertid"),
                db = window.sqlitePlugin.openDatabase({
                    name:'myDatabase.db',
                    location: 'default'
                });
            db.transaction(function(tx){ 
                tx.executeSql("DELETE FROM InsureTable WHERE id="+rinsertid,[],function(tx,results){
                    window.location.href="./register.html";
                }, function(tx,message) {
                    console.log("ERROR: " + message.message);
                });
            });
        }
    })
    
}
function cameraTakePicture1(){
    navigator.camera.getPicture(onSuccess,onFail,{
        quality:50,
        destinationType:Camera.DestinationType.FILE_URI,
        correctOrientation:true
    });
    function onSuccess(url){
        addShuiYin(url,"../images/iv_shuiyin.png",function(imageURI){
            var rinsertid = localStorage.getItem("rinsertid");
            var imgsrcs = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload = false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get();
            var obj = {};
            obj.latitude = '0';
            obj.longitude = '0';
            obj.type = '2';
            obj.isupload = false;
            obj.url = imageURI;
            obj.thumbnail = "";
            imgsrcs.push(obj);
            var url1 = JSON.stringify(imgsrcs);
            var db = window.sqlitePlugin.openDatabase({
                name:'myDatabase.db',
                location: 'default'
            });
            db.transaction(function(tx){ 
                //更新内容
                    tx.executeSql("UPDATE InsureTable SET id_url=? WHERE id=?",
                        [url1,rinsertid],
                        function(tx,results){
                            var div = $(".und_tab_ol > li").eq(0);
                            $('<p class="und_tabOl_p2" ><img src="'+imageURI+'"></p>').appendTo(div);
                            /*底部照片的操作之长按删除*/
                            $(".und_tabOl_p2 img").off("touchstart");
                            var time=0;
                            $(".und_tabOl_p2 img").on("touchstart",function(e){
                                e.stopPropagation();
                                var _this=this;
                                time=setTimeout(function(){
                                    $("#und_mark2").show();
                                    $(".mr_cancle2").click(function(){
                                        $("#und_mark2").hide();
                                    })
                        
                                    $(".mr_sure2").click(function(){
                                        $(_this).css("display","none");
                                        $(_this).parent().remove();
                                        $("#und_mark2").hide();
                                    })
                                },500);
                            })
                        
                            /*底部照片的操作之点击放大*/
                            $(".und_tabOl_p2 img").off("click");
                            $(".und_tabOl_p2 img").on("click",function(){
                                var src=$(this).attr("src");
                                message("./bigimg.html?src="+src);
                            })
                            $(".und_tabOl_p2 img").on("touchmove",function(e){
                                clearTimeout(time);
                            })
                            $(".und_tabOl_p2 img").off("touchend");
                            $(".und_tabOl_p2 img").on("touchend",function(e){
                                e.stopPropagation();
                                clearTimeout(time);
                            })
                        },
                        function(tx,message) {
                  			console.log("ERROR: " + message.message);
                        });
            });
        });
        
    }
    function onFail(message){
        // alert('Failed because:'+message);
    }
}
function cameraTakePicture2(){
    navigator.camera.getPicture(onSuccess,onFail,{
        quality:50,
        destinationType:Camera.DestinationType.FILE_URI,
        correctOrientation:true
    });
    function onSuccess(url){
        addShuiYin(url,"../images/iv_shuiyin.png",function(imageURI){
            var rinsertid = localStorage.getItem("rinsertid");
            var imgsrcs = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload = false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get();
            var obj = {};
            obj.latitude = '0';
            obj.longitude = '0';
            obj.type = '3';
            obj.isupload = false;
            obj.url = imageURI;
            imgsrcs.push(obj);
            var url2 = JSON.stringify(imgsrcs);
            var db = window.sqlitePlugin.openDatabase({
                name:'myDatabase.db',
                location: 'default'
            });
            db.transaction(function(tx){ 
                //更新内容
                    tx.executeSql("UPDATE InsureTable SET bankcard_url=? WHERE id=?",
                        [url2,rinsertid],
                        function(tx,results){
                            var div = $(".und_tab_ol > li").eq(1);
                            $('<p class="und_tabOl_p2" ><img src="'+imageURI+'"></p>').appendTo(div);
                            $(".und_tabOl_p2 img").off("touchstart");
                            var time=0;
                            $(".und_tabOl_p2 img").on("touchstart",function(e){
                                e.stopPropagation();
                                var _this=this;
                                time=setTimeout(function(){
                                    $("#und_mark2").show();
                                    $(".mr_cancle2").click(function(){
                                        $("#und_mark2").hide();
                                    })
                        
                                    $(".mr_sure2").click(function(){
                                        $(_this).css("display","none");
                                        $(_this).parent().remove();
                                        $("#und_mark2").hide();
                                    })
                                },500);
                            })
                        
                            /*底部照片的操作之点击放大*/
                            $(".und_tabOl_p2 img").off("click");
                            $(".und_tabOl_p2 img").on("click",function(){
                                var src=$(this).attr("src");
                                message("./bigimg.html?src="+src);
                            })
                            $(".und_tabOl_p2 img").on("touchmove",function(e){
                                clearTimeout(time);
                            })
                            $(".und_tabOl_p2 img").off("touchend");
                            $(".und_tabOl_p2 img").on("touchend",function(e){
                                e.stopPropagation();
                                clearTimeout(time);
                            })
                        },
                        function(tx,message) {
                  			console.log("ERROR: " + message.message);
                        });
            });
        });
    }
    function onFail(message){
        // alert('Failed because:'+message);
    }
}
function cameraTakePicture3(){
    navigator.camera.getPicture(onSuccess,onFail,{
        quality:50,
        destinationType:Camera.DestinationType.FILE_URI,
        correctOrientation:true
    });
    function onSuccess(url){
        console.time("zjsq");
        addShuiYin(url,"../images/iv_shuiyin.png",function(imageURI){
            var rinsertid = localStorage.getItem("rinsertid");
            var imgsrcs = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get();
            var obj = {};
            obj.latitude = '0';
            obj.longitude = '0';
            obj.type = '4';
            obj.isupload = false;
            obj.url = imageURI;
            imgsrcs.push(obj);
            var url3 = JSON.stringify(imgsrcs);
            console.timeEnd("zjsq");
            var db = window.sqlitePlugin.openDatabase({
                name:'myDatabase.db',
                location: 'default'
            });
            db.transaction(function(tx){ 
                //更新内容
                tx.executeSql("UPDATE InsureTable SET other_image=? WHERE id=?",
                    [url3,rinsertid],
                    function(tx,results){
                        var div = $(".und_tab_ol > li").eq(2);
                        $('<p class="und_tabOl_p2" ><img src="'+imageURI+'"></p>').appendTo(div);
                        $(".und_tabOl_p2 img").off("touchstart");
                        var time=0;
                        $(".und_tabOl_p2 img").on("touchstart",function(e){
                            e.stopPropagation();
                            var _this=this;
                            time=setTimeout(function(){
                                $("#und_mark2").show();
                                $(".mr_cancle2").click(function(){
                                    $("#und_mark2").hide();
                                })
                    
                                $(".mr_sure2").click(function(){
                                    $(_this).css("display","none");
                                    $(_this).parent().remove();
                                    $("#und_mark2").hide();
                                })
                            },500);
                        })
                    
                        /*底部照片的操作之点击放大*/
                        $(".und_tabOl_p2 img").off("click");
                        $(".und_tabOl_p2 img").on("click",function(){
                            var src=$(this).attr("src");
                            message("./bigimg.html?src="+src);
                        })
                        $(".und_tabOl_p2 img").on("touchmove",function(e){
                            clearTimeout(time);
                        })
                        $(".und_tabOl_p2 img").off("touchend");
                        $(".und_tabOl_p2 img").on("touchend",function(e){
                            e.stopPropagation();
                            clearTimeout(time);
                        })
                    },
                    function(tx,message) {
                        console.log("ERROR: " + message.message);
                    });
            });
        });
    }
    function onFail(message){
        // alert('Failed because:'+message);
    }
}

/*不加判断保存信息*/
function message(gourl){
	var rinsertid = localStorage.getItem("rinsertid"),
    rInfo_name=$(".rInfo_name").val(),
    regOl_select3=$(".regOl_select3").text(),
    rInfo_idnum=$(".rInfo_idnum").val(),
    rInfo_banknum=$(".rInfo_banknum").val(),
    uInfo_Issuer=$(".uInfo_Issuer").val(),
    uInfo_located=$(".uInfo_located").val(),
    uInfo_located_id=$(".uInfo_located").attr("brunchid"),
    rInfo_tel=$(".rInfo_tel").val(),
    myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    // surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
    // surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
    // surl3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
    thumbnail_surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
    thumbnail_surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
    url1=myImage1.length>0?JSON.stringify(myImage1):"null",
    url2=myImage2.length>0?JSON.stringify(myImage2):"null",
    url3=myImage3.length>0?JSON.stringify(myImage3):"null";
	if(localStorage.getItem("rtype")=="unfinish"){
	    var db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
	    });
	    db.transaction(function(tx){ 
	        //更新内容
	        tx.executeSql("UPDATE InsureTable SET isfinish=?, bank_card=?, bank_pname=?, bankcard_thumbnail_url=?, bankcard_url=?, subbank_name=?, subbank_id=?, id_number=?, id_name=?, id_thumbnail_url=?, id_url=?, name=?, other_image=?, phone_number=? WHERE id=?",
	            ["0",rInfo_banknum,uInfo_Issuer,thumbnail_surl2,url2,uInfo_located,uInfo_located_id,rInfo_idnum,regOl_select3,thumbnail_surl1,url1,rInfo_name,url3,rInfo_tel,rinsertid],
	            function(tx,results){
	                //alert("ok");
	            window.location.href=gourl+"?type=register";
	        }, function(tx,message) {
	            console.log("ERROR: " + message.message);
	        });
	
	    });
	}else if(localStorage.getItem("rtype")=="finish"){
		var db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
	    });
	    db.transaction(function(tx){ 
	        //更新内容
	        tx.executeSql("UPDATE InsureTable SET isfinish=?, bank_card=?, bank_pname=?, bankcard_thumbnail_url=?, bankcard_url=?, subbank_name=?, subbank_id=?, id_number=?, id_name=?, id_thumbnail_url=?, id_url=?, name=?, other_image=?, phone_number=? WHERE id=?",
	            ["1",rInfo_banknum,uInfo_Issuer,thumbnail_surl2,url2,uInfo_located,uInfo_located_id,rInfo_idnum,regOl_select3,thumbnail_surl1,url1,rInfo_name,url3,rInfo_tel,rinsertid],
	            function(tx,results){
	                //alert("ok");
	            window.location.href=gourl+"?type=register";
	        }, function(tx,message) {
	            console.log("ERROR: " + message.message);
	        });
	
	    });
	}
}


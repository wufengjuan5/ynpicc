$(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	var type = window.localStorage.getItem("type");
	if(type!="finish"){
		createEvent();
	}else{
		$(".uInfo_name").attr("readonly",true);
		$(".uInfo_idnum").attr("readonly",true);
		$(".uInfo_banknum").attr("readonly",true);
		$(".uInfo_tel").attr("readonly",true);
		$("#cameraTakePicture1").hide();
		$("#cameraTakePicture2").hide();
		$("#cameraTakePicture3").hide();
		$(".und_p").hide();
		$('.und_photo').hide();
	}
	/*点击下一步*/
    $("#und_next1").click(function(){
    	information("./und_massif.html");
	    localStorage.setItem("farmer",$(".uInfo_name").val());
	    sessionStorage.removeItem("cardscan");
	    sessionStorage.removeItem("bankscan");
    })
})
function createEvent(){
	/*模拟下拉框*/
    $(".undOl_li1").click(function(event){
        $(".undOl_select1_list1").toggle();
        $(".undOl_select1_list2,.undOl_select1_list3").hide();
        kongbai(".undOl_select1_list1");
    })
    $(".uInfo_Issuer").on("click",function(e){
    	showBankList();
    });
    $(".uInfo_located").on("click",function(e){
    	getBrunchList();
    });
    $(".uInfo_towns").on("click",function(e){
    	showTownList();
    });
    $(".uInfo_villages").on("click",function(e){
    	getVillageList();
    });
    
    $(".und_p").on("click",function(e){
    	var insertid=localStorage.getItem("insertid"),
		undOl_select1=$(".undOl_select1").text(),
		undOl_select2=$(".undOl_select2").text(),
		kindid=$(".undOl_select2").attr("kindid"),
		uInfo_name=$(".uInfo_name").val(),
		uInfo_papertype=$(".undOl_select3").text(),
		paperid=$(".undOl_select3").attr("paperid"),
		uInfo_idnum=$(".uInfo_idnum").val(),
		uInfo_banknum=$(".uInfo_banknum").val(),
		uInfo_Issuer=$(".uInfo_Issuer").val(),
		uInfo_bankid=$(".uInfo_Issuer").attr("bankid"),
		uInfo_located=$(".uInfo_located").val(),
		uInfo_brunchid=$(".uInfo_located").attr("brunchid"),
		uInfo_tel=$(".uInfo_tel").val(),
		uInfo_towns=$(".uInfo_towns").val(),
		uInfo_villages=$(".uInfo_villages").val(),
		uInfo_villageid=$(".uInfo_villages").attr("villageid"),
		myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		thumbnail_surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
		thumbnail_surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
		surl3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		url1=myImage1.length>0?JSON.stringify(myImage1):"null",
		url2=myImage2.length>0?JSON.stringify(myImage2):"null",
		url3=myImage3.length>0?JSON.stringify(myImage3):"null",
		reg1=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		reg2=/^[a-zA-Z0-9]*$/,
		reg3=/^[1][3,4,5,7,8][0-9]{9}$/;
	    var picnum=0;
	    if(url1!="null"){
	    	picnum=picnum+myImage1.length;
	    }
	    if(url2!="null"){
	    	picnum=picnum+myImage2.length;
	    }
	    if(url3!="null"){
	    	picnum=picnum+myImage3.length;
	    }
	    if(undOl_select2=="请选择标的名称"){
	    	$(".und_hint").show().html("请选择标的名称!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_name==""){
	    	$(".und_hint").show().html("请填写投保人姓名!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_papertype=="请选择证件类型"){
	    	$(".und_hint").show().html("请选择证件类型!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_idnum==""){
	    	$(".und_hint").show().html("请填写证件号!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_idnum!="" && uInfo_papertype=="身份证号" && reg1.test(uInfo_idnum)===false){
	    	$(".und_hint").show().html("请检查身份证号!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_idnum!="" && uInfo_papertype=="社会信用代码" && reg2.test(uInfo_idnum)===false){
			$(".und_hint").show().html("请检查证件号码!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
		}else if(uInfo_banknum==""){
	    	$(".und_hint").show().html("请填写银行卡号!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_Issuer==""){
	    	$(".und_hint").show().html("请填写发卡银行!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_located==""){
	    	$(".und_hint").show().html("请填写所在支行!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_tel==""){
	    	$(".und_hint").show().html("请填写联系方式!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
		    return false;
	    }else if(uInfo_tel!="" && reg3.test(uInfo_tel)===false){
	    	$(".und_hint").show().html("请检查联系方式!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
		    return false;
	    }else if(uInfo_towns==""){
	    	$(".und_hint").show().html("请填写种植地点(乡/镇)!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }else if(uInfo_villages==""){
	    	$(".und_hint").show().html("请填写种植地点(村)!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
	    }
	    $("#und_mark3").show();
    });
    $(".mr_cancle3").click(function(){
    	$("#und_mark3").hide();
    })
    $(".mr_sure3").click(function(){
    	var insertid=localStorage.getItem("insertid"),
		undOl_select1=$(".undOl_select1").text(),
		undOl_select2=$(".undOl_select2").text(),
		kindid=$(".undOl_select2").attr("kindid"),
		uInfo_name=$(".uInfo_name").val(),
		uInfo_papertype=$(".undOl_select3").text(),
		paperid=$(".undOl_select3").attr("paperid"),
		uInfo_idnum=$(".uInfo_idnum").val(),
		uInfo_banknum=$(".uInfo_banknum").val(),
		uInfo_Issuer=$(".uInfo_Issuer").val(),
		uInfo_bankid=$(".uInfo_Issuer").attr("bankid"),
		uInfo_located=$(".uInfo_located").val(),
		uInfo_brunchid=$(".uInfo_located").attr("brunchid"),
		uInfo_tel=$(".uInfo_tel").val(),
		uInfo_towns=$(".uInfo_towns").val(),
		uInfo_villages=$(".uInfo_villages").val(),
		uInfo_villageid=$(".uInfo_villages").attr("villageid"),
		myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
		surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		thumbnail_surl1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
		thumbnail_surl2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("thumbnail");}).get().join(";"),
		surl3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){return $(this).attr("src");}).get().join(";"),
		url1=myImage1.length>0?JSON.stringify(myImage1):"null",
		url2=myImage2.length>0?JSON.stringify(myImage2):"null",
		url3=myImage3.length>0?JSON.stringify(myImage3):"null",
		reg1=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		reg2=/^[a-zA-Z0-9]*$/,
		reg3=/^[1][3,4,5,7,8][0-9]{9}$/;
	    var picnum=0;
	    if(url1!="null"){
	    	picnum=picnum+myImage1.length;
	    }
	    if(url2!="null"){
	    	picnum=picnum+myImage2.length;
	    }
	    if(url3!="null"){
	    	picnum=picnum+myImage3.length;
	    }
    	var uid = window.localStorage.getItem("user_id");
    	var paramObj = {user_id:uid,name:uInfo_name,phone_number:uInfo_tel,id_number:uInfo_idnum,sex:"",nation:"",bank_card:uInfo_banknum,subbank_name:uInfo_located,bank_pname:uInfo_Issuer,address:uInfo_towns+uInfo_villages,address_detail:"",id_url:surl1,bankcard_url:surl2,other_image:surl3,id_thumbnail_url:thumbnail_surl1,bankcard_thumbnail_url:thumbnail_surl2,kind_id:kindid,subbank_id:uInfo_brunchid,city_code:localStorage.getItem("city_code")};
		var dofunc = function(response){
			var insertid = localStorage.getItem("insertid");
	    	var db = window.sqlitePlugin.openDatabase({
	            name:'myDatabase.db',
	            location: 'default'
	        });
	        db.transaction(function(tx){ 
	            //提交成功后删除本地数据库内容
	            tx.executeSql("DELETE FROM IsFinishTable WHERE id="+insertid,[],function(tx,results){
	              	window.location.href="./underwrite.html";
	              	sessionStorage.removeItem("cardscan"); 
					sessionStorage.removeItem("bankscan");
	            }, function(tx,message) {
	                console.log("ERROR: " + message.message);
	            });
	        });
		};
		AjaxPost('insertFarmerInfo',paramObj,dofunc);
    })
    $(".undOl_li2").click(function(event){
        $(".undOl_select1_list2").toggle();
        $(".undOl_select1_list1,.undOl_select1_list3").hide();
        kongbai(".undOl_select1_list2");

    })
    $(".undOl_li3").click(function(event){
        $(".undOl_select1_list3").toggle();
        $(".undOl_select1_list1,.undOl_select1_list2").hide();
        kongbai(".undOl_select1_list3");

    })
	
    $(".undOl_select1_list li").click(function(){
        var liText=$(this).text();
        $(this).parent(".undOl_select1_list").siblings(".undOl_select").html(liText);
    })
    $(".undOl_select1_list3 li").click(function(){
        var liText=$(this).text(),
        	paperid=$(this).attr("paperid");
        $(this).parent(".undOl_select1_list3").siblings(".undOl_select").html(liText);
        $(this).parent(".undOl_select1_list3").siblings(".undOl_select").attr("paperid",paperid);
    })

    $(".uInfo_name").focus();

    /*输入投保姓名模糊匹配*/
    $(".uInfo_name").on("input",function(){
    	var uname=$(this).val(),
    		myReg = /^[\u4e00-\u9fa5]+$/;
	 	if(uname.length>=2 && myReg.test(uname)){
			var data={
				city_code:localStorage.getItem("city_code"),
				type:"1",
				name:uname
			};
	  		/*$.ajax({
	  			type:'GET',
				url:URL_prefix+"peacemap/enongxian/get/?searchFarmerByName",
				headers: {
		            'Authority': window.localStorage.getItem("token"),
		            'CityCode':window.localStorage.getItem("city_code"),
		            'Device':'app'
	  			},
				dataType: 'json',
				data:data,*/
			var byname=function(data){
				console.log(data);
				if(data.result!=null){
					var nameIdContent="",
						name,id_number,bank_card,bank_name,subbank_name,subbank_id,phone_num;
						for (var i=0;i<data.result.length;i++) {
							var id_number=data.result[i].id_number;
							var leng=id_number.length;
							id_number=id_number.substr(0, 10) + '****' + id_number.substr(leng - 4);
							nameIdContent+='<li><span class="name_id_sapn1">'+data.result[i].name+'</span>'+
										'<span class="name_id_span2">'+id_number+'</span></li>';
						}
					$(".name_id_p").html(nameIdContent).show();
					kongbai(".name_id_p");
					$(".name_id_p>li").click(function(){
						var index = $(this).index();
						$(".uInfo_name").val(data.result[index].name);
						$(".uInfo_idnum").val(data.result[index].id_number);
						$(".undOl_select3").html(getIdTyleText(data.result[index].id_type));
						$(".undOl_select3").attr("paperid",data.result[index].id_type);
						$(".uInfo_banknum").val(data.result[index].bank_card);
						$(".uInfo_Issuer").val(data.result[index].bank_name);
						$(".uInfo_Issuer").attr("bankid",data.result[index].bank_id);
						$(".uInfo_located").val(data.result[index].subbank_name);
						$(".uInfo_located").attr("brunchid",data.result[index].subbank_id);
						$(".uInfo_tel").val(data.result[index].phone_num);
						$(".name_id_p").hide();
						var id_url_arr = data.result[index].id_url.split(";");
						var card_url_arr = data.result[index].bankcard_url.split(";");
						var other_url_arr = data.result[index].other_image.split(";");
						var div = $(".und_tab_ol > li").eq(0);
						div.find(".und_tabOl_p2").remove();
						if (id_url_arr.length>0) {
							for (var i=0;i<id_url_arr.length;i++) {
								if (id_url_arr[i]!="") {
									$('<p class="und_tabOl_p2" ><img src="'+id_url_arr[i]+'"></p>').appendTo(div);
								}
							}
						}
						var div1 = $(".und_tab_ol > li").eq(1);
						div1.find(".und_tabOl_p2").remove();
						if (card_url_arr.length>0) {
							for (var i=0;i<card_url_arr.length;i++) {
								if (card_url_arr[i]!="") {
									$('<p class="und_tabOl_p2" ><img src="'+card_url_arr[i]+'"></p>').appendTo(div1);
								}
							}
						}
						var div2 = $(".und_tab_ol > li").eq(2);
						div2.find(".und_tabOl_p2").remove();
						if (other_url_arr.length>0) {
							
							for (var i=0;i<other_url_arr.length;i++) {
								if (other_url_arr[i]!="") {
									$('<p class="und_tabOl_p2" ><img src="'+other_url_arr[i]+'"></p>').appendTo(div2);
								}
							}
						}
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
					})
				}else{
					$(".name_id_p").hide();
				}
			}
			AjaxGet("searchFarmerByName",data,byname);
	  		//})
		} else if(uname.length<2){
			$(".name_id_p").hide();
		} 	
    })

    /*获取标的名称的数据列表*/
    var data={
    	"category":1,
    	"city_code":localStorage.getItem("city_code"),
    	"start":0,
    	"count":0
    };
    
    /*$.ajax({
    	type:"GET",
        url : URL_prefix+"/peacemap/enongxian/get/?getInsuranceKind",
        async:true,
		headers:{
			'Authority':localStorage.getItem("token"),
			'CityCode':localStorage.getItem("city_code"),
			'Device':"app"
		},
		dataType: 'json',
		data:data,*/
		var getkind=function(datas){
			console.log(datas);
			var result=datas.result,
				undOlList="";
			undOlList+='<li>请选择标的名称</li>';
			$.each(result,function(i,item){
				undOlList+='<li ol_id="'+item.id+'" fee_percentage="'+item.fee_percentage+'" unit_fee="'+item.unit_fee+'" start="'+item.startdate+'" end="'+item.enddate+'" self_per="'+item.self_per+'">'+item.name+'</li>';
			})
			$(".undOl_select1_list2").html(undOlList);
			$(".undOl_select1_list2 li").click(function(){
				var liText=$(this).text();
				if(liText!=='请选择标的名称'){
					fee_percentage=$(this).attr("fee_percentage"),
		        	start = $(this).attr("start"),
		        	end = $(this).attr("end"),
		        	kind_id=$(this).attr("ol_id"),
		        	unit_fee=$(this).attr("unit_fee"),
		        	self_per=$(this).attr("self_per");
		        $(this).parent(".undOl_select1_list").siblings(".undOl_select").html(liText);
		        $(this).parent(".undOl_select1_list").siblings(".undOl_select").attr("kindid",kind_id);
		        localStorage.setItem("fee_percentage",fee_percentage);
		        localStorage.setItem("unit_fee",unit_fee);
		        localStorage.setItem("self_per",self_per);
		        localStorage.setItem("start",start);
		        localStorage.setItem("end",end);
		        console.log(fee_percentage+",,"+unit_fee,self_per);

				}
		    })
		}
		AjaxGet("getInsuranceKind",data,getkind);
    //})

    

    /*点击图标跳转到身份证扫描页*/
    $(".goIdcardScan").click(function(){
    	message("./und_idcardscan.html");
    })

	/*点击图标跳转到银行卡扫描页*/
	$(".goBankcardScan").click(function(){
		message("./und_bankcardscan.html");
	})
	
}
/*调用相机*/
function cameraTakePicture1(){
	navigator.camera.getPicture(onSuccess,onFail,{
		quality:50,
		destinationType:Camera.DestinationType.FILE_URI,
		correctOrientation:true
	});
	function onSuccess(url){
		addShuiYin(url,"../images/iv_shuiyin.png",function(imageURI){
			var insertid = localStorage.getItem("insertid");
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
					tx.executeSql("UPDATE IsFinishTable SET url1=? WHERE id=?",
						[url1,insertid],
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
			var insertid = localStorage.getItem("insertid");
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
					tx.executeSql("UPDATE IsFinishTable SET url2=? WHERE id=?",
						[url2,insertid],
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
			var insertid = localStorage.getItem("insertid");
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
					tx.executeSql("UPDATE IsFinishTable SET url3=? WHERE id=?",
						[url3,insertid],
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


/*获取定位*/
function PositionClick(){
    //定位数据获取成功响应
    var onSuccess = function(position) {
        //console.log(position.coords.latitude+','+position.coords.longitude);
        console.log('纬度: ' + position.coords.latitude + '\n' +
              		'经度: ' + position.coords.longitude + '\n' +
              		'海拔: ' + position.coords.altitude + '\n' +
              		'水平精度: ' + position.coords.accuracy + '\n' +
              		'垂直精度: ' + position.coords.altitudeAccuracy  + '\n' +
              		'方向: ' + position.coords.heading + '\n' +
              		'速度: ' + position.coords.speed + '\n' +
              		'时间戳: ' + position.timestamp + '\n');
		var latitude=position.coords.latitude,
			longitude=position.coords.longitude,
			data={
				"x":longitude,
				"y":latitude,
				"sr":"3857",
				"city_code":localStorage.getItem("city_code")
			};
		var position_func=function(response){
			var result=response.result;
			console.log(result);
			$(".uInfo_towns").val(result.town_name);
			$(".uInfo_villages").val(result.village_name);
			$(".uInfo_villages").attr("villageid",village_id);
		}
		AjaxGet("getAddress",data,position_func);
    };
 
    //定位数据获取失败响应
    function onError(error) {
        console.log(error.message);
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
 
    //开始获取定位数据
     navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

/*获取种植地点(镇)*/
function showTownList(){
	/*$.ajax({
		type:"GET",
        url : URL_prefix+"/peacemap/enongxian/get/?getTownList",
        async:true,
		headers:{
			'Authority':localStorage.getItem("token"),
			'CityCode':localStorage.getItem("city_code"),
			'Device':"app"
		},
		dataType: 'json',*/
		var data={
			"city_code":localStorage.getItem("city_code")
		};
		var showtown=function(datas){
			//console.log(datas);
			var result=datas.result,
				townName="";

			$.each(result,function(i,item){
				townName+='<li>'+item.name+'</li>';
			})
			$(".und_iscrol_ul_town").html(townName);

			if($(".und_iscrol_ul_town").html()==""){
				$(".und_hint").show().html("没有获取到数据!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},1500);
		    	return false;
			}else{
				$(".und_iscroll_wraper3").show();
				$(".und_townscrol_cancle").click(function(){
					$(".und_iscroll_wraper3").hide();
					$('.und_town_text').prop('value','');
				})
				kongbai(".und_iscroll_wraper3");
			}
			$('.und_town_text').on('input',function(){
				var townValue=$(this).val(),
				 newTownlist=[],
				 townName="";
				 re=new RegExp(townValue,"ig");
				 for(var i=0; i<result.length; i++){
					 if(result[i].name.search(re)>-1){
						 newTownlist.push(result[i]);
					 }
				 }
				 if(newTownlist.length>0){
					$.each(newTownlist,function(i,item){
						townName+='<li>'+item.name+'</li>';
					})
				 }
				$(".und_iscrol_ul_town").html(townName);
				$(".und_iscrol_ul_town li").click(function(){
					var town_name=$(this).text();
					$(".und_iscroll_wraper3").hide();
					$(".uInfo_towns").val(town_name);
					$(".uInfo_villages").val("");
					$(".uInfo_villages").attr("villageid","");
				})
			})
			$(".und_iscrol_ul_town li").click(function(){
				var town_name=$(this).text();
				$(".und_iscroll_wraper3").hide();
				$(".uInfo_towns").val(town_name);
				$(".uInfo_villages").val("");
				$(".uInfo_villages").attr("villageid","");
			})
		}
		AjaxGet("getTownList",data,showtown);
	//})
}

/*获取种植地点(村)列表*/
function getVillageList(){
	/*$.ajax({
		type:"GET",
        url : URL_prefix+"peacemap/enongxian/get/?getVillageList",
        async:true,
		headers:{
			'Authority':localStorage.getItem("token"),
			'CityCode':localStorage.getItem("city_code"),
			'Device':"app"
		},
		dataType: 'json',*/
		var name=$(".uInfo_towns").val(),
			data={
			"town_name":name,
			"city_code":localStorage.getItem("city_code")
		};
		var getvillage=function(datas){
			console.log(datas);
			var result=datas.result,
				villageName="";

			$.each(result,function(i,item){
				villageName+='<li villageid="'+item.village_id+'">'+item.name_village+'</li>';
			})
			$(".und_iscrol_ul_village").html(villageName);

			if($(".uInfo_towns").val()=="" || $(".und_iscrol_ul_village").html()==""){
				$(".und_hint").show().html("没有获取到数据!");
		    	setTimeout(function(){
		    		$(".und_hint").hide();
		    	},1500);
		    	return false;
			}else{
				$(".und_iscroll_wraper4").show();
				$(".und_villagescrol_cancle").click(function(){
					$(".und_iscroll_wraper4").hide();
					$('.und_village_text').prop('value','')
				})
				kongbai(".und_iscroll_wraper4");
			}
			$('.und_village_text').on('input',function(){
				var vill_value=$(this).val(),
					newVilist=[],
					villageName='',
					re=new RegExp(vill_value,'ig');
					for(var i=0; i<result.length; i++){
						if(result[i].name_village.search(re)>-1){
							newVilist.push(result[i])
						}
					}
					if(newVilist.length>0){
						$.each(newVilist,function(i,item){
							villageName+='<li villageid="'+item.village_id+'">'+item.name_village+'</li>';
						})
					}
					$(".und_iscrol_ul_village").html(villageName);
					$(".und_iscrol_ul_village li").click(function(){
						var village_name=$(this).text(),
							villageid=$(this).attr("villageid");
						$(".und_iscroll_wraper4").hide();
						$(".uInfo_villages").val(village_name);
						$(".uInfo_villages").attr("villageid",villageid);
					})
			})
			$(".und_iscrol_ul_village li").click(function(){
				var village_name=$(this).text(),
					villageid=$(this).attr("villageid");
				$(".und_iscroll_wraper4").hide();
				$(".uInfo_villages").val(village_name);
				$(".uInfo_villages").attr("villageid",villageid);
			})
		}
		AjaxGet("getVillageList",data,getvillage);
	//})
}

//window.onbeforeunload=function(){}
/*提醒框是否显示*/
function isShowUndMark(){
	if($(".undOl_select2").text()!="请选择标的名称" && $(".uInfo_name").val()!="" && $(".uInfo_idnum").val()!="" && $(".uInfo_banknum").val()!="" && $(".uInfo_Issuer").val()!="" && $(".uInfo_located").val()!="" && $(".uInfo_tel").val()!="" && $(".uInfo_towns").val()!="" && $(".uInfo_villages").val()!=""){
		information("./underwrite.html");   
		sessionStorage.removeItem("cardscan"); 
		sessionStorage.removeItem("bankscan");   
	}else{
		$("#und_mark1").show();
	}	

	/*提示框按钮*/
    $(".mr_cancle1").click(function(){
    	$("#und_mark1").hide();
    })
    $(".mr_sure1").click(function(){
    	var insertid = localStorage.getItem("insertid");
    	var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        db.transaction(function(tx){ 
            //提交成功后删除本地数据库内容
            tx.executeSql("DELETE FROM IsFinishTable WHERE id="+insertid,[],function(tx,results){
              	window.location.href="./underwrite.html";
              	sessionStorage.removeItem("cardscan"); 
				sessionStorage.removeItem("bankscan");
            }, function(tx,message) {
                console.log("ERROR: " + message.message);
            });
        });
    	 
    })
}
/*获取身份证类型的文字信息*/
function getIdTyleText(num){
	var txt = "";
	switch(num){
		case "0":txt = "身份证号";break;
		case "1":txt = "社会信用代码";break;
	}
	return txt;
}

/*保存基本信息*/
function information(gourl){
	var insertid=localStorage.getItem("insertid"),
		undOl_select1=$(".undOl_select1").text(),
		undOl_select2=$(".undOl_select2").text(),
		kindid=$(".undOl_select2").attr("kindid"),
		uInfo_name=$(".uInfo_name").val(),
		uInfo_papertype=$(".undOl_select3").text(),
		paperid=$(".undOl_select3").attr("paperid"),
    	uInfo_idnum=$.trim($(".uInfo_idnum").val()),
    	uInfo_banknum=$.trim($(".uInfo_banknum").val()),
    	uInfo_Issuer=$(".uInfo_Issuer").val(),
    	uInfo_bankid=$(".uInfo_Issuer").attr("bankid"),
    	uInfo_located=$(".uInfo_located").val(),
    	uInfo_brunchid=$(".uInfo_located").attr("brunchid"),
    	uInfo_tel=$.trim($(".uInfo_tel").val()),
    	uInfo_towns=$(".uInfo_towns").val(),
    	uInfo_villages=$(".uInfo_villages").val(),
    	uInfo_villageid=$(".uInfo_villages").attr("villageid"),
    	myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	url1=myImage1.length>0?JSON.stringify(myImage1):"null",
    	url2=myImage2.length>0?JSON.stringify(myImage2):"null",
    	url3=myImage3.length>0?JSON.stringify(myImage3):"null",
    	reg1=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    	reg2=/^[a-zA-Z0-9]*$/,
    	reg3=/^[1][3,4,5,7,8][0-9]{9}$/;
    //console.log(url1);
    var picnum=0;
    if(url1!="null"){
    	picnum=picnum+myImage1.length;
    }
    if(url2!="null"){
    	picnum=picnum+myImage2.length;
    }
    if(url3!="null"){
    	picnum=picnum+myImage3.length;
    }
    if(undOl_select2=="请选择标的名称"){
    	$(".und_hint").show().html("请选择标的名称!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_name==""){
    	$(".und_hint").show().html("请填写投保人姓名!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_papertype=="请选择证件类型"){
    	$(".und_hint").show().html("请选择证件类型!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_idnum==""){
    	$(".und_hint").show().html("请填写证件号!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_idnum!="" && uInfo_papertype=="身份证号" && reg1.test(uInfo_idnum)===false){
    	$(".und_hint").show().html("请检查身份证号!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_idnum!="" && uInfo_papertype=="社会信用代码" && reg2.test(uInfo_idnum)===false){
		$(".und_hint").show().html("请检查证件号码!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
	}else if(uInfo_banknum==""){
    	$(".und_hint").show().html("请填写银行卡号!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_Issuer==""){
    	$(".und_hint").show().html("请填写发卡银行!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_located==""){
    	$(".und_hint").show().html("请填写所在支行!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_tel==""){
    	$(".und_hint").show().html("请填写联系方式!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
	    return false;
    }else if(uInfo_tel!="" && reg3.test(uInfo_tel)===false){
    	$(".und_hint").show().html("请检查联系方式!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
	    return false;
    }else if(uInfo_towns==""){
    	$(".und_hint").show().html("请填写种植地点(乡/镇)!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }else if(uInfo_villages==""){
    	$(".und_hint").show().html("请填写种植地点(村)!");
    	setTimeout(function(){
    		$(".und_hint").hide();
    	},1500);
		return false;
    }

    /*获取当前时间*/
    function p(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	var year=myDate.getFullYear();
	var month=myDate.getMonth()+1;
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();  
	var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
	console.log(now);
	var createdate = localStorage.getItem("createdate")!="null"?localStorage.getItem("createdate"):now;
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){ 
    	//更新内容
		tx.executeSql("UPDATE IsFinishTable SET createtime=?, insurance=?, labelname=?, kindid=?, insurant=?, papertype=?, paperid=?, idnumber=?, banknum=?, bankcard=?, bankid=?, bankadress=?, brunchid=?, telphone=?, planttowns=?, plantvillage=?, villageid=?, url1=?, url2=?, url3=?, picnum=? WHERE id=?",
			[createdate,undOl_select1,undOl_select2,kindid,uInfo_name,uInfo_papertype,paperid,uInfo_idnum,uInfo_banknum,uInfo_Issuer,uInfo_bankid,uInfo_located,uInfo_brunchid,uInfo_tel,uInfo_towns,uInfo_villages,uInfo_villageid,url1,url2,url3,picnum,insertid],
			function(tx,results){
				//alert("ok");
			window.location.href=gourl;
		}, function(tx,message) {
				console.log("ERROR: " + message.message);
		});

    });
}

/*不加判断保存信息*/
function message(gourl){
	var insertid=localStorage.getItem("insertid"),
		undOl_select1=$(".undOl_select1").text(),
		undOl_select2=$(".undOl_select2").text(),
		kindid=$(".undOl_select2").attr("kindid"),
		uInfo_name=$(".uInfo_name").val(),
		uInfo_papertype=$(".undOl_select3").text(),
		paperid=$(".undOl_select3").attr("paperid"),
    	uInfo_idnum=$(".uInfo_idnum").val(),
    	uInfo_banknum=$(".uInfo_banknum").val(),
    	uInfo_Issuer=$(".uInfo_Issuer").val(),
    	uInfo_bankid=$(".uInfo_Issuer").attr("bankid"),
    	uInfo_located=$(".uInfo_located").val(),
    	uInfo_brunchid=$(".uInfo_located").attr("brunchid"),
    	uInfo_tel=$(".uInfo_tel").val(),
    	uInfo_towns=$(".uInfo_towns").val(),
    	uInfo_villages=$(".uInfo_villages").val(),
    	uInfo_villageid=$(".uInfo_villages").attr("villageid"),
    	myImage1 = $(".und_tab_ol > li").eq(0).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '2';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	myImage2 = $(".und_tab_ol > li").eq(1).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '3';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	myImage3 = $(".und_tab_ol > li").eq(2).find(".und_tabOl_p2 img").map(function(e){var obj = {};obj.latitude = '0';obj.longitude = '0';obj.type = '4';obj.isupload=false;obj.thumbnail = $(this).attr("thumbnail");obj.url = $(this).attr("src");return obj;}).get(),
    	url1=myImage1.length>0?JSON.stringify(myImage1):"null",
    	url2=myImage2.length>0?JSON.stringify(myImage2):"null",
    	url3=myImage3.length>0?JSON.stringify(myImage3):"null";
    //console.log(url1);
    var picnum=0;
    if(url1!="null"){
    	picnum=picnum+myImage1.length;
    }
    if(url2!="null"){
    	picnum=picnum+myImage2.length;
    }
    if(url3!="null"){
    	picnum=picnum+myImage3.length;
    }
    /*获取当前时间*/
    function p(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	var year=myDate.getFullYear();
	var month=myDate.getMonth()+1;
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();  
	var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
	console.log(now);
	var createdate = localStorage.getItem("createdate")!="null"?localStorage.getItem("createdate"):now;
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){ 
    	//更新内容
			tx.executeSql("UPDATE IsFinishTable SET createtime=?, insurance=?, labelname=?, kindid=?, insurant=?, papertype=?, paperid=?, idnumber=?, banknum=?, bankcard=?, bankid=?, bankadress=?, brunchid=?, telphone=?, planttowns=?, plantvillage=?, villageid=?, url1=?, url2=?, url3=?, picnum=? WHERE id=?",
				[createdate,undOl_select1,undOl_select2,kindid,uInfo_name,uInfo_papertype,paperid,uInfo_idnum,uInfo_banknum,uInfo_Issuer,uInfo_bankid,uInfo_located,uInfo_brunchid,uInfo_tel,uInfo_towns,uInfo_villages,uInfo_villageid,url1,url2,url3,picnum,insertid],
				function(tx,results){
            //alert("ok");
    				window.location.href=gourl;
				},
				function(tx,message) {
          console.log("ERROR: " + message.message);
				});
    });
}

function onDeviceReady(){
	var insertid=localStorage.getItem("insertid"),
		cardscan=JSON.parse(sessionStorage.getItem("cardscan")),
		bankscan=JSON.parse(sessionStorage.getItem("bankscan"));
		console.log(insertid);
		console.log(cardscan);
		//返回来时获取已有值
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){
			tx.executeSql('SELECT * FROM IsFinishTable WHERE id="'+insertid+'"',[],function (tx, results) {
            var item=results.rows.item(0);
            console.log("createtime:"+item.createtime);
			localStorage.setItem("createdate",item.createtime);
            if(cardscan!=null){
				var idname=cardscan.name,
					idnum=cardscan.cardnum,
					info_papertype="身份证号",
					img1 = cardscan.imgsrc1,
					img2 = cardscan.imgsrc2,
					info_paperid="0";
				$(".uInfo_name").val(idname);
            	$(".undOl_select3").text(info_papertype);
            	$(".undOl_select3").attr("paperid",info_paperid);
            	$(".uInfo_idnum").val(idnum);
            	if (img1) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img1+'"></p>');
            	}
            	if (img2) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img2+'"></p>');
            	}
            	
			}else{
				$(".uInfo_name").val(item.insurant!="null"?item.insurant:"");
            	$(".undOl_select3").text(item.papertype!="null"?item.papertype:"请选择证件类型");
            	$(".undOl_select3").attr("paperid",item.paperid!="null"?item.paperid:"");
            	$(".uInfo_idnum").val(item.idnumber!="null"?item.idnumber:"");
			}
			if(bankscan!=null){
				var banum=bankscan.number,
				img = bankscan.imgsrc;
					//banstr=bankscan.bank,
					//baname=banstr.replace(/[^\u4e00-\u9fa5]/gi,""),
					//bankid=banstr.replace(/[^0-9]/ig, "");
				$(".uInfo_banknum").val(banum);
				if (img) {
            		$(".und_tab_ol > li").eq(1).append('<p class="und_tabOl_p2" ><img thumbnail="" src="'+img+'"></p>');
            	}
				var banstr=bankscan.bank;
				var bcode = banstr.split("(")[1].split(")")[0];
				console.log(bcode);
				if (bcode) {
					showBankByCode(bcode);
				}
			}else{
				$(".uInfo_banknum").val(item.banknum!="null"?item.banknum:"");
            	//$(".uInfo_Issuer").val(item.bankcard!="null"?item.bankcard:"");
            	//$(".uInfo_Issuer").attr("bankid",item.bankid!="null"?item.bankid:"");
			}
            $(".undOl_select1").text(item.insurance!="null"?item.insurance:"中央政策性种植险");
            $(".undOl_select2").text(item.labelname!="null"?item.labelname:"请选择标的名称");
            $(".undOl_select2").attr("kindid",item.kindid!="null"?item.kindid:"");
            $(".uInfo_Issuer").val(item.bankcard!="null"?item.bankcard:"");
            $(".uInfo_Issuer").attr("bankid",item.bankid!="null"?item.bankid:"");
            $(".uInfo_located").val(item.bankadress!="null"?item.bankadress:"");
            $(".uInfo_located").attr("brunchid",item.brunchid!="null"?item.brunchid:"");
            $(".uInfo_tel").val(item.telphone!="null"?item.telphone:"");
            $(".uInfo_towns").val(item.planttowns!="null"?item.planttowns:"");
            $(".uInfo_villages").val(item.plantvillage!="null"?item.plantvillage:"");
            $(".uInfo_villages").attr("villageid",item.villageid!="null"?item.villageid:"");
            if(item.url1!='null'){
            	var url1 = JSON.parse(item.url1);
            	for (var i=0;i<url1.length;i++) {
            		$(".und_tab_ol > li").eq(0).append('<p class="und_tabOl_p2" ><img thumbnail="'+url1[i].thumbnail+'" src="'+url1[i].url+'"></p>');
            	}
            }
            if(item.url2!='null'){
            	var url2 = JSON.parse(item.url2);
            	for (var i=0;i<url2.length;i++) {
            		$(".und_tab_ol > li").eq(1).append('<p class="und_tabOl_p2" ><img thumbnail="'+url2[i].thumbnail+'" src="'+url2[i].url+'"></p>');
            	}
            }
            if(item.url3!='null'){
            	var url3 = JSON.parse(item.url3);
            	for (var i=0;i<url3.length;i++) {
            		$(".und_tab_ol > li").eq(2).append('<p class="und_tabOl_p2" ><img thumbnail="'+url3[i].thumbnail+'" src="'+url3[i].url+'"></p>')
            	}
            }
			/*底部照片的操作之长按删除*/
		if(window.localStorage.getItem("type")=='unfinish'){
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
			$(".und_tabOl_p2 img").on("touchend",function(e){
				clearTimeout(time);
			})
		}
			/*底部照片的操作之点击放大*/
			$(".und_tabOl_p2 img").on("click",function(){
				var src=$(this).attr("src");
				message("./bigimg.html?src="+src);
			})
			
            sessionStorage.removeItem("cardscan");
	    	sessionStorage.removeItem("bankscan");
      })
    });
		
}
//根据扫描的银行卡 获取发卡行
function showBankByCode(code){
    var data={
        "city_code":localStorage.getItem("city_code")
    };
    var showbank=function(response){
        //console.log(response);
        var result=response.result;
        var name="",
        id = "";
        for (var i=0;i<result.length;i++) {
        	if (code==result[i].bank_code) {
        		name = result[i].name;
        		id = result[i].id;
        	}
        }
        $(".uInfo_Issuer").val(name);
        $(".uInfo_Issuer").attr("bankid",id);
        $(".uInfo_located").val("");
        $(".uInfo_located").attr("brunchid","");
        
    }
    AjaxGet("getBankName",data,showbank);
}

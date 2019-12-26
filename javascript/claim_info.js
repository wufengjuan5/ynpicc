/*返回获取已有值*/
var isfinish='';
function onDeviceReady(){
	var insert_id=localStorage.getItem("insert_id"),
		cardscan=JSON.parse(sessionStorage.getItem("cardscan"));
		db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
		});
		console.log(insert_id)
		db.transaction(function(tx){
			tx.executeSql('SELECT * FROM IsFinishClaim WHERE id="'+insert_id+'"',[],function (tx, results){
				var item=results.rows.item(0);
				isfinish=item.isfinish;
				console.log(item)
				if(cardscan!=null){
					var idname=cardscan.name,
						idnum=cardscan.cardnum;
					$(".cInfo_name").val(idname);
					$(".cInfo_idnum").val(idnum);
				}else{
					$(".cInfo_name").val(item.name!="null"?item.name:"");
					$(".cInfo_idnum").val(item.id_number!="null"?item.id_number:"");
				}
				$('.cInfo_icon').css('display',item.flags!="1"?'none':'block');
				$(".cInfo_name").attr('readonly',item.flags!="1"?true:false);
				$(".cInfo_idnum").attr('readonly',item.flags!="1"?true:false);
				$(".cInfo_policyNum").val(item.insurance_id!="null"?item.insurance_id:"");
				$(".cInfo_policyNum").attr('readonly',item.flags!="1"?true:false);
				$(".cInfo_policyNum").attr('pkey',item.pkey!="null"?item.pkey:"");
				$(".cInfo_szzw").text(item.kind_name!="null"?item.kind_name:"核桃");
				$(".cInfo_szzw").attr({'readonly':item.flags!="1"?true:false,'ol_id':item.kind_id!="null"?item.kind_id:""});
				$(".cInfo_zjbl").text(item.self_payment!="null"?item.self_payment:"20");
				$(".cInfo_ckdd_xz").val(item.survey_site_xz!="null"?item.survey_site_xz:"");
				$(".cInfo_ckdd_c").val(item.survey_site_c!="null"?item.survey_site_c:"");
				$(".cInfo_phone").val(item.phone_number!="null"?item.phone_number:"");
				$(".cInfo_phone").attr('readonly',item.flags!="1"?true:false);
				$(".cInfo_cbmj").val(item.insurance_area!="null"?item.insurance_area:"");
				$(".cInfo_cbmj").attr('readonly',item.flags!="1"?true:false);
				$(".cInfo_tdsx").text(item.land_property!="null"?item.land_property:"承包地");
				$(".cInfo_zhyy").text(item.disaster_cause!="null"?item.disaster_cause:"请选择");
				$(".cInfo_zhsj").text(item.disaster_time!="null"?item.disaster_time:"");
				$(".cInfo_text").css('display',item.disaster_time!="null"?"none":"block");
				$(".cInfo_szq").val(item.growth_period!="null"?item.growth_period:"无");
				$(".cInfo_cky").val(item.survey!="null"?item.survey:"");
				$(".cInfo_pfbl").val(item.cInfo_pfrate!="null"?item.cInfo_pfrate:"");
				$(".cInfo_zjbaoe").text(item.danweibaoe!="null"?item.danweibaoe:"500");
				$(".cInfo_pfje").val(item.cInfo_pfmoney!="null"?item.cInfo_pfmoney:"");
				$(".cInfo_ckdd_c").attr('village_id',item.village_id!="null"?item.village_id:"");
				$('.cInfo_zhyy').attr('disaster_id',item.disaster_id!="null"?item.disaster_id:"");
				sessionStorage.removeItem("cardscan");
				if(item.flags!='1'){
					$("#cInfo_search").unbind('click').css(
						{
							'border-top':'1px solid #f1f1f1',
							'border-bottom':'1px solid #f1f1f1',
							'background':'#f7f7f7'
						}
					);
				}
				if(item.flags!="1"){
					$(".cInfo_ckdd_xz").parent().hide();
					$(".cInfo_ckdd_c").unbind('click');
					$(".cInfo_ckdd_c").prev().text('查勘地点');
					$('.cInfo_zjbl').unbind('click');
					$('.cInfo_zjbaoe').unbind('click');
					$('.cInfo_szzw').unbind('click');
				}else{
					/*获取受灾作物及自缴比例数据列表*/
					getDisasterCrop();
				}
			})
			var start = new datePicker();
			start.init({
				'trigger': '#start_date', /*按钮选择器，用于触发弹出插件*/
				'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
				'minDate':'1900-1-1',/*最小日期*/
				'maxDate':'2100-12-31',/*最大日期*/
				'onSubmit':function(){/*确认时触发事件*/
					var theSelectData=start.value;
				},
				'onClose':function(){/*取消时触发事件*/
				},
			});	
		});	
	
}

/*获取受灾作物列表*/
function getDisasterCrop(){
    var data={
    	"category":1,
    	"city_code":localStorage.getItem("city_code"),
    	// "start":"1",
    	// "count":"5"
    };
	var getDisasterCrop=function(datas){
		var result=datas.result,
			disasterCropList="",
			selfPayment="",
			firstName="";
			danweibaoe='';
			console.log(result)
		$.each(result,function(i,item){
			$(".cInfo_szzw").attr("self_per",result[0].self_per);
			$(".cInfo_szzw").attr("ol_id",result[0].id);
			$(".cInfo_szzw").attr("unit_fee",result[0].unit_fee);
			disasterCropList+='<li ol_id="'+item.id+'" fee_percentage="'+item.fee_percentage+'" unit_fee="'+item.unit_fee+'" self_per="'+item.self_per+'">'+item.name+'</li>';
		})
		$(".claim_select_list3").html(disasterCropList);
		var self_per=$(".cInfo_szzw").attr("self_per").split(",");
		$.each(self_per,function(i,item){
			selfPayment+='<li>'+item+'</li>';
		})
		$(".cInfo_zjbl").text(self_per[0]);
		$(".claim_select_list4").html(selfPayment);
		var unit_fee=$(".cInfo_szzw").attr("unit_fee").split(",");
		$.each(unit_fee,function(i,item){
			danweibaoe+='<li>'+item+'</li>';
		})
		console.log(unit_fee[0])
		$(".cInfo_zjbaoe").text(unit_fee[0]);
		$(".claim_select_list5").html(danweibaoe);
			//点击选择作物
		$(".claim_select_list3 li").click(function(){
			var liText=$(this).text(),
	        	self_per=$(this).attr("self_per").split(","),
	        	unit_fee=$(this).attr("unit_fee").split(","),
				ol_id=$(this).attr("ol_id");
	        $(this).parent(".claim_select_list3").siblings(".cInfo_span").text(liText);
	        $(this).parent(".claim_select_list3").siblings(".cInfo_span").attr("ol_id",ol_id);
	        $(this).parent(".claim_select_list").hide();

	        selfPayment="";
	        $.each(self_per,function(i,item){
				selfPayment+='<li>'+item+'</li>';
			})
			$(".claim_select_list4").html(selfPayment);
			$(".cInfo_zjbl").text(self_per[0]);
			danweibaoe="";
	        $.each(unit_fee,function(i,item){
				danweibaoe+='<li>'+item+'</li>';
			})
			$(".cInfo_zjbaoe").text(unit_fee[0]);
			$(".claim_select_list5").html(danweibaoe);

			//点击选择自缴比例
			$(".claim_select_list4 li").click(function(){
				var liText=$(this).text();
				$(this).parent(".claim_select_list").siblings(".cInfo_span").text(liText);
				$(this).parent(".claim_select_list").hide();
			})

			// 点击选择单位保额
			$(".claim_select_list5 li").click(function(){
				var liText=$(this).text();
				$(this).parent(".claim_select_list").siblings(".cInfo_span").text(liText);
				$(this).parent(".claim_select_list").hide();
			})
	    })
	}
	AjaxGet("getInsuranceKind",data,getDisasterCrop);
}

/*获取查勘地点（乡镇）的数据*/
function showTownList(){
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
		$(".claim_iscrol_ul1").html(townName);

		if($(".claim_iscrol_ul1").html()==""){
			$(".und_hint").show().html("没有获取到数据!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
	    	return false;
		}else{
			$(".claim_iscroll_wraper1").show();
			$(".claim_scrol_cancle1").click(function(){
				$(".claim_iscroll_wraper1").hide();
				$(".und_bank_text").prop('value','')
			})
			kongbai(".claim_iscroll_wraper1");
		}
		$('.und_bank_text').on('input',function(){
			var vil_val=$(this).val(),
				vil_list=[],
				townName=''
				re = new RegExp(vil_val,"gi");
			for(var i=0; i<result.length; i++){
				if(result[i].name.search(re)>-1){
					vil_list.push(result[i]);
				}
			}
			if(vil_list.length>0){
				$.each(vil_list,function(i,item){
					townName+='<li>'+item.name+'</li>';
				})
			}
			$(".claim_iscrol_ul1").html(townName);
			$(".claim_iscrol_ul1 li").click(function(){
				var town_name=$(this).text();
				$(".claim_iscroll_wraper1").hide();
				$(".cInfo_ckdd_xz").val(town_name);
			})
		})
		$(".claim_iscrol_ul1 li").click(function(){
			var town_name=$(this).text();
			$(".claim_iscroll_wraper1").hide();
			$(".cInfo_ckdd_xz").val(town_name);
		})
	}
	AjaxGet("getTownList",data,showtown);
}
/*获取查勘地点（村）的数据*/
function getVillageList(){
	var name=$(".cInfo_ckdd_xz").val();
	console.log(name);
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
		$(".claim_iscrol_ul2").html(villageName);
		if($(".claim_iscrol_ul2").html()==""){
			$(".und_hint").show().html("没有获取到数据!");
	    	setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
	    	return false;
		}else{
			$(".claim_iscroll_wraper2").show();
			$(".claim_scrol_cancle2").click(function(){
				$(".claim_iscroll_wraper2").hide();
				$(".und_bank_text").prop('value','')
			})
			kongbai(".claim_iscroll_wraper2");
		}
		$('.und_bank_text').on('input',function(){
			var vil_val=$(this).val(),
				vil_list=[],
				villageName=''
				re = new RegExp(vil_val,"gi");
			for(var i=0; i<result.length; i++){
				if(result[i].name_village.search(re)>-1){
					vil_list.push(result[i]);
				}
			}
			if(vil_list.length>0){
				$.each(vil_list,function(i,item){
					villageName+='<li villageid="'+item.village_id+'">'+item.name_village+'</li>';
				})
			}
			$(".claim_iscrol_ul2").html(villageName);
			$(".claim_iscrol_ul2 li").click(function(){
				var villageName=$(this).text();
				$(".claim_iscroll_wraper2").hide();
				$(".cInfo_ckdd_c").val(villageName);
			})
		})
		$(".claim_iscrol_ul2 li").click(function(){
			var village_name=$(this).text(),
				villageid=$(this).attr("villageid");
			$(".claim_iscroll_wraper2").hide();
			$(".cInfo_ckdd_c").val(village_name);
			$(".cInfo_ckdd_c").attr("village_id",villageid);
		})
	}
	AjaxGet("getVillageList",data,getvillage);
}

/*获取灾害原因列表*/
function getDisasterCause(){
	var data={
		"city_code":localStorage.getItem("city_code")
	};
	var getDisasterCause=function(datas){
		console.log(datas);
		var result=datas.result,
			disasterList="";
			disasterList+='<li>请选择</li>';
		$.each(result,function(i,item){
			disasterList+='<li villageid="'+item.disaster_id+'">'+item.disaster+'</li>';
		})
		$(".claim_select_list2").html(disasterList);

		//点击选择
	    $(".claim_select_list li").click(function(){
			var liText=$(this).text();
			var disaster_id=$(this).attr('villageid');
	        $(this).parent(".claim_select_list").siblings(".cInfo_span").html(liText).attr('disaster_id',disaster_id);
	        $(this).parent(".claim_select_list").hide();
	    })
	}
	AjaxGet("getDisasterList",data,getDisasterCause);
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

/*保存基本信息*/
function keepInfo(goUrl){
	var insert_id=localStorage.getItem("insert_id"),
			cInfo_name=$(".cInfo_name").val(),
			cInfo_idnum=$(".cInfo_idnum").val(),
			cInfo_policyNum=$(".cInfo_policyNum").val(),
			cInfo_szzw=$(".cInfo_szzw").text(),
			ol_id=$(".cInfo_szzw").attr("ol_id"),
			cInfo_zjbl=$(".cInfo_zjbl").text(),
			cInfo_ckdd_xz=$(".cInfo_ckdd_xz").val(),
			cInfo_ckdd_c=$(".cInfo_ckdd_c").val(),
			cInfo_phone=$(".cInfo_phone").val(),
			cInfo_cbmj=$(".cInfo_cbmj").val(),
			cInfo_tdsx=$(".cInfo_tdsx").text(),
			cInfo_zhyy=$(".cInfo_zhyy").text(),
			cInfo_zhsj=$(".cInfo_zhsj").text(),
			cInfo_szq=$(".cInfo_szq").val(),
			cInfo_cky=$(".cInfo_cky").val(),
			cInfo_pfbl=$(".cInfo_pfbl").val(),
			cInfo_pfje=$(".cInfo_pfje").val(),
			cInfo_zjbaoe=$(".cInfo_zjbaoe").text(),
			village_id=$(".cInfo_ckdd_c").attr('village_id'),
			disaster_id=$('.cInfo_zhyy').attr('disaster_id')||'',
			pkey=$(".cInfo_policyNum").attr('pkey')||'',
			reg1=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
			reg2=/^[a-zA-Z0-9]*$/,
			reg3=/^[1][3,4,5,7,8][0-9]{9}$/;
			console.log(village_id)
		if(cInfo_name==""){
			$(".und_hint").show().html("请填写姓名！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_idnum==""){
			$(".und_hint").show().html("请填写身份证号！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_idnum!=""&&reg1.test(cInfo_idnum)===false){
			$(".und_hint").show().html("请检查身份证号是否正确");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_phone==""){
			$(".und_hint").show().html("请填写联系电话！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_phone!=''&&reg3.test(cInfo_phone)===false){
			$(".und_hint").show().html("请检查联系电话是否正确！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_cbmj==""){
			$(".und_hint").show().html("请填写承保面积！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_zhyy=="请选择"){
			$(".und_hint").show().html("请选择灾害类型！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_zhsj==""){
			$(".und_hint").show().html("请选择受灾时间！");
			setTimeout(function(){
	    		$(".und_hint").hide();
			},1500);
			return false;
		}else if(cInfo_cky==""){
			$(".und_hint").show().html("请填写查勘员姓名！");
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
		//console.log(now);
//		var insurance_lands =  sessionStorage.getItem("insurance_lands");

		// var reg=/(^[1-9][0-9]$|^[0-9]$|^100$)/
		// if(reg.test(cInfo_pfbl)){
		// 	cInfo_pfbl=parseInt(cInfo_pfbl)
		// }

		var db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
	    });
	    db.transaction(function(tx){ 
    	//更新内容
			tx.executeSql("UPDATE IsFinishClaim SET isfinish=?, createtime=?, insurance_id=?, name=?, id_number=?, kind_name=?, kind_id=?, self_payment=?,  phone_number=?, survey_site_xz=?, survey_site_c=?, insurance_area=?, disaster_cause=?, disaster_time=?, growth_period=?, survey=?, cInfo_pfrate=?, cInfo_pfmoney=?, danweibaoe=?,land_property=?,flags=?,village_id=?,disaster_id=?,pkey=? WHERE id=?",
				[isfinish,now,cInfo_policyNum,cInfo_name,cInfo_idnum,cInfo_szzw,ol_id,cInfo_zjbl,cInfo_phone,cInfo_ckdd_xz,cInfo_ckdd_c,cInfo_cbmj,cInfo_zhyy,cInfo_zhsj,cInfo_szq,cInfo_cky,cInfo_pfbl,cInfo_pfje,cInfo_zjbaoe,cInfo_tdsx,'0',village_id,disaster_id,pkey,insert_id],
				function(tx,results){
					console.log(results)
					//alert("ok");
					window.location.href=goUrl;
			}, function(tx,message) {
					console.log("ERROR: " + message.message);
			});
		});
}
$(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	/*点击左上角返回键*/
	$("#claim_back1").click(function(){
		if($(".cInfo_name").val()!="" && $(".cInfo_idnum").val()!="" && $(".cInfo_szzw").text()!="" && $(".cInfo_zjbl").text()!=""&& $(".cInfo_tdsx").text()!="" && $(".cInfo_phone").val()!="" && $(".cInfo_cbmj").val()!="" && $(".cInfo_tdsx").text()!="" && $(".cInfo_zhyy").text()!="" && $(".cInfo_zhsj").text()!="" && $(".cInfo_szq").val()!=""&& $(".cInfo_zjbaoe").text()!="" && $(".cInfo_cky").val()!=""){
			keepInfo("./claim.html");
		}else{
			$("#claim_mark2").show();
		}
	})
	$(".cla_cancle2").click(function(){
		$("#claim_mark2").hide();
	})
	$(".cla_sure2").click(function(){
		var insert_id = localStorage.getItem("insert_id");
    	var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        db.transaction(function(tx){ 
            //提交成功后删除本地数据库内容
            tx.executeSql("DELETE FROM IsFinishClaim WHERE id="+insert_id,[],function(tx,results){
              	window.location.href="./claim.html";
            }, function(tx,message) {
                console.log("ERROR: " + message.message);
            });
        });
	})
	/*点击获取查勘地点（乡镇）*/
	$(".cInfo_ckdd_xz").on("click",function(e){
    	showTownList();
    });
	/*点击获取查勘地点（村）*/
	$(".cInfo_ckdd_c").on("click",function(e){
		if($(".cInfo_ckdd_xz").val()==""){
			$(".und_hint").show().html("请先选择乡镇！");
			setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
		}
    	getVillageList();
    });

	/*点击查询保单*/
	$('.cInfo_name').on('input',function(){
		var cInfo_name=$('.cInfo_name').val()
		var cInfo_name_length=cInfo_name.length;
		if(cInfo_name_length<2){
			$('.name_id_p').hide();
			return
		}else{
			console.log(cInfo_name);
			var listdata=''; 
			var data={
				"name":cInfo_name,
				"city_code":localStorage.getItem("city_code"),
				"type":"4",
			};
			var searchFarmerByName=function(datas){
				var searchFarmerHtml='';
				console.log(datas);
				var result=datas.result;

				if(result!=null){
					$.each(result,function(i,item){
						var id_number=item.id_number
						var id_number2=item.id_number
						var leng=id_number.length
						id_number = id_number.substr(0, 10) + '****' + id_number.substr(leng - 4);
						searchFarmerHtml+='<li>'+
						'<span class="name_id_sapn1" id='+i+'>'+item.name+'</span>'+
						'<span class="name_id_span2">'+id_number+'</span>'+
						'</li>';
					})
					$('.name_id_p').show();
					$('.name_id_p').html(searchFarmerHtml)
				}
				kongbai('.name_id_p');
				$('.name_id_p>li').click(function(){
					var idnum_index=$(this).index();
					// var idnum_index=target_parent.find('.name_id_sapn1').attr('id');
					$('.cInfo_name').val(result[idnum_index].name);
					$('.cInfo_idnum').val(result[idnum_index].id_number);
					$('.name_id_p').hide();
				})
			}
			AjaxGet('searchFarmerByName',data,searchFarmerByName);

		}
	})
		/*保单号码数字限制*/
		$('.cInfo_policyNum').on('input',function(){
			var value=$(this).val()
			if(isNaN(value)){
				// value=parseInt(value.replace(/[^\d.]/g,""));
				$(this).prop('value','');
			}else{
				$(this).prop('value',value);
			}
		})
		/*承保面积数字限制*/
		$('.cInfo_cbmj').on('input',function(){
			var value=$(this).val()
			if(isNaN(value)){
				// value=parseInt(value.replace(/[^\d.]/g,""));
				$(this).prop('value','');
			}else{
				$(this).prop('value',value);
			}
		})
	/*选择时间*/
	$('.cInfo_cbsj').click(function(){
		$(this).find('.cInfo_text').hide();
	})
	
	/*赔付比例限制*/
	$('.cInfo_pfbl').on('input',function(){
		var value=$(this).val()
		if(isNaN(value)){
			// value=parseInt(value.replace(/[^\d.]/g,""));
			$(this).prop('value','');
		}else{
			if(value>100){
				$(this).prop('value',100);
			}else{
				$(this).prop('value',value);
			}
		}
	})
	//已赔付金额
	$('.cInfo_pfje').on('input',function(){
		var value=$(this).val()
		if(isNaN(value)){
			// value=parseInt(value.replace(/[^\d.]/g,""));
			$(this).prop('value','');	
		}else{
			if(value>10000000000){
				$(this).prop('value','');
			}else{
				$(this).prop('value',value);
			}
		}
	})

	//点击查询
	$("#cInfo_search").click(function(){
		var cInfo_name=$(".cInfo_name").val(),
			cInfo_idnum=$(".cInfo_idnum").val();
		if(cInfo_name==""){
			$(".und_hint").show().html("请填写姓名！");
			setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
		}else if(cInfo_idnum==""){
			$(".und_hint").show().html("请填写身份证号！");
			setTimeout(function(){
	    		$(".und_hint").hide();
	    	},1500);
			return false;
		}
		var data={
			"id":cInfo_idnum,
			"user_id":"NULL",
			"village":"NULL",
			"owner":cInfo_name,
			"min_count":"NULL",
			"max_count":"NULL",
			"date_start":"1990-04-11",
			"date_end":"NULL",
			"kind":"NULL",
			"device":"app",
			"start":0,
			"count":0,
			"city_code":localStorage.getItem("city_code"),
			"export_status":"NULL",
			"name_town":"NULL"
		};

		var inquiryPolicy=function(datas){
			console.log(datas);
			var total=datas.total;
				result=datas.result;
				inquiryPolicyHtml="";
			if(total==0){
				$('#claim_mark1').show();
				$(".und_hint").show().text("未查询到数据")
				return;
			}else{
				inquiryPolicyHtml=result.map(function(item,index){
						return (
						'<li>'+
							'<p class="cla_iscrol_p">'+
								'<span class="cla_iscrol_span1">'+item.owner+'</span>'+
								'<span class="cla_iscrol_span2">'+item.ID+'</span>'+
								'<span class="cla_iscrol_span3">'+item.self_per+'</span>'+
							'</p>'+
							'<p class="cla_iscrol_p">'+
								'<span class="cla_iscrol_span1">'+item.kind+'</span>'+
								'<span class="cla_iscrol_span2">'+item.address+'</span>'+
							'</p>'+
						'</li>'
						)
				}).join('')
				$(".claim_iscrol_ul3").html(inquiryPolicyHtml);
				$('.und_iscroll_wraper').show();
			}
			$('.claim_iscrol_ul3 li').click(function(e){
				$('.cInfo_name').attr('readonly',true);
				$('.cInfo_idnum').attr('readonly',true);
				var i=$(this).index();
				$('.cInfo_policyNum').val(result[i].insurance_serial)
				$('.cInfo_policyNum').attr({'pkey':result[i].pkey});
				$('.cInfo_szzw').text(result[i].kind).unbind('click');
				$('.cInfo_zjbl').text(parseInt(result[i].self_per).toString()).unbind('click');
				$('.cInfo_zjbaoe').text(parseInt(result[i].unit_fee).toString()).unbind('click');
				$('.cInfo_ckdd_xz').val(result[i].address);
				$('.cInfo_cbmj').val(result[i].count);
				$('.cInfo_cbmj').attr('readonly',true);
				$('.cInfo_phone').val(result[i].phone_number);
				$('.cInfo_phone').attr('readonly',true);
				$('.cInfo_ckdd_xz').parent().hide();
				$('.cInfo_ckdd_c').val(result[i].address).unbind('click').attr('readonly',true);
				$('.cInfo_ckdd_c').prev().text('查勘地点');
				$('.cInfo_ckdd_c').attr('village_id',result[i].village_id);
				$('.und_iscroll_wraper').each(function(index,item){
					$(item)[0].style.display='none';
				})
				var lansArr = [];
				$.each(result[i].lands,function(i,item){
					var obj = {};
					obj.points = item.shape;
					obj.count = item.real_count;
					obj.insurance_count = item.count;
					obj.land_serial = item.land_serial;
					lansArr.push(obj);
				});
				var land_number = lansArr.length;
				var insurance_lands =JSON.stringify(lansArr);
				var insert_id = localStorage.getItem("insert_id");
				var db = window.sqlitePlugin.openDatabase({
			        name:'myDatabase.db',
			        location: 'default'
			    });
			    db.transaction(function(tx){ 
		    	//更新内容
					tx.executeSql("UPDATE IsFinishClaim SET isfinish=?,insurance_lands=?  WHERE id=?",
						[isfinish,insurance_lands,insert_id],
						function(tx,results){
							console.log("lands save!");
					}, function(tx,message) {
							console.log("ERROR: " + message.message);
					});
			    });
				e.stopPropagation();
			})
			$('.und_iscroll_wraper').each(function(i,item){
				kongbai($(item));
			})
			
		}
		AjaxPost("insuranceItemQuery",data,inquiryPolicy);

	})
	$(".cla_cancle1").click(function(){
		$("#claim_mark1").hide();
		$(".und_hint").hide()
	})
	$(".cla_sure1").click(function(){
		$("#claim_mark1").hide();
		$(".und_hint").hide()
	})
    /*点击显示下拉框*/
    $(".cInfo_tdsx").click(function(event){
        $(".claim_select_list1").toggle();
        $(".claim_select_list2,.claim_select_list3,.claim_select_list4").hide();
		kongbai(".claim_select_list1");
		return false;
    })
    $(".cInfo_zhyy").click(function(event){
    	getDisasterCause();
        $(".claim_select_list2").toggle();
        $(".claim_select_list1,.claim_select_list3,.claim_select_list4").hide();
		kongbai(".claim_select_list2");
		return false;
    })
    $(".cInfo_szzw").click(function(event){
    	getDisasterCause();
        $(".claim_select_list3").toggle();
        $(".claim_select_list4,.claim_select_list5").hide();
		kongbai(".claim_select_list3");
		return false;
    })
    $(".cInfo_zjbl").click(function(event){
        $(".claim_select_list4").toggle();
        $(".claim_select_list3,.claim_select_list5").hide();
		kongbai(".claim_select_list4");
		return false;
    })
    $(".cInfo_zjbaoe").click(function(event){
        $(".claim_select_list5").toggle();
        $(".claim_select_list3,.claim_select_list4").hide();
		kongbai(".claim_select_list5");
		return false;
    })
    //点击选择
    $(".claim_select_list li").click(function(){
        var liText=$(this).text();
        $(this).parent(".claim_select_list").siblings(".cInfo_span").html(liText);
        $(this).parent(".claim_select_list").hide();
    })

    /*点击下一步*/
	$("#claim_next").click(function(){
		keepInfo("claim_map.html");
		localStorage.setItem("farmer",$(".cInfo_name").val());
	})
	/*点击图标跳转到身份证扫描页*/
	$(".cInfo_icon").click(function(){
		message("./und_idcardscan.html");
	})
})
/*不加判断保存信息*/
function message(goUrl){
	var insert_id=localStorage.getItem("insert_id"),
			cInfo_name=$(".cInfo_name").val(),
			cInfo_idnum=$(".cInfo_idnum").val(),
			cInfo_policyNum=$(".cInfo_policyNum").val(),
			cInfo_szzw=$(".cInfo_szzw").text(),
			ol_id=$(".cInfo_szzw").attr("ol_id"),
			cInfo_zjbl=$(".cInfo_zjbl").text(),
			cInfo_ckdd_xz=$(".cInfo_ckdd_xz").val(),
			cInfo_ckdd_c=$(".cInfo_ckdd_c").val(),
			cInfo_phone=$(".cInfo_phone").val(),
			cInfo_cbmj=$(".cInfo_cbmj").val(),
			cInfo_tdsx=$(".cInfo_tdsx").text(),
			cInfo_zhyy=$(".cInfo_zhyy").text(),
			cInfo_zhsj=$(".cInfo_zhsj").text(),
			cInfo_szq=$(".cInfo_szq").val(),
			cInfo_cky=$(".cInfo_cky").val();
			cInfo_pfbl=$(".cInfo_pfbl").val(),
			cInfo_pfje=$(".cInfo_pfje").val();
			cInfo_zjbaoe=$(".cInfo_zjbaoe").text();
			village_id=$(".cInfo_ckdd_c").attr('village_id'),
			disaster_id=$('.cInfo_zhyy').attr('disaster_id')||'',
			pkey=$(".cInfo_policyNum").attr('pkey')||'';
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
		//console.log(now);
//		var insurance_lands =  sessionStorage.getItem("insurance_lands");

		// var reg=/(^[1-9][0-9]$|^[0-9]$|^100$)/
		// if(reg.test(cInfo_pfbl)){
		// 	cInfo_pfbl=parseInt(cInfo_pfbl)
		// }
		console.log(isfinish)

		var db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
	    });
	    db.transaction(function(tx){ 
    	//更新内容
			tx.executeSql("UPDATE IsFinishClaim SET isfinish=?, createtime=?, insurance_id=?, name=?, id_number=?, kind_name=?, kind_id=?, self_payment=?,  phone_number=?, survey_site_xz=?, survey_site_c=?, insurance_area=?, disaster_cause=?, disaster_time=?, growth_period=?, survey=?, cInfo_pfrate=?, cInfo_pfmoney=?, danweibaoe=?,land_property=?, flags=?,village_id=?,disaster_id=?,pkey=? WHERE id=?",
				[isfinish,now,cInfo_policyNum,cInfo_name,cInfo_idnum,cInfo_szzw,ol_id,cInfo_zjbl,cInfo_phone,cInfo_ckdd_xz,cInfo_ckdd_c,cInfo_cbmj,cInfo_zhyy,cInfo_zhsj,cInfo_szq,cInfo_cky,cInfo_pfbl,cInfo_pfje,cInfo_zjbaoe,cInfo_tdsx,'1',village_id,disaster_id,pkey,insert_id],
				function(tx,results){
					console.log(results)
					//alert("ok");
					window.location.href=goUrl+"?type=claim_info";
			}, function(tx,message) {
					console.log("ERROR: " + message.message);
			});
		});
}

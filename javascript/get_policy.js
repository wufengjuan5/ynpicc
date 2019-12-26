/*获取保单list*/
function getPolicy(keyname,ut_dl,ut_ul,ut_ul2){
    var user_id=parseInt(localStorage.getItem("user_id")),
    	city_code=localStorage.getItem("city_code"),
    	token=localStorage.getItem("token"),
    	data={
    		"user_id":user_id, 
			"kind":"0",
			"location":"", 
			"date_start":"",
			"date_end":"",
			"start":0,
			"count":0 ,
			"status":1,
			"name":keyname,
			"city_code":city_code
    	};
	var policylist=function(response){
		console.log(response);
		var result=response.result,
			count=response.count,
			FinishContent="";
		if(response.code==27){
			window.location.href="../login.html";
		}
		if(result==null){
			$(".ut_ul_search1").html("");
		}
		if(count==0){
			$(ut_dl).show();
			$(ut_ul).hide();
		}else{
			$(ut_dl).hide();
			$(ut_ul).show();
			$.each(result,function(i,item){
				
				FinishContent+='<li insurance_id="'+item.insurance_id+'" class="ut_clickli  ut_clickli1">'+
									'<div class="ut_swiper  ut_swiper1 ut_clickbox">'+
										'<h5 class="ut_name">'+item.farmer+'</h5>'+
										'<p class="ut_p1">'+
											'<span class="ut_time">'+item.createdate+'</span>'+
											'<span class="ut_dataNum">数据量：<e class="ut_number">'+item.land_number+'块/'+item.area+'亩/'+item.image_number+'张/<em>'+item.check_image_num+'张</em></e></span>'+
											'<img src="../images/iv_weiyandi.png" class="weiyanbiao">'+
										'</p>'+
										'<p class="ut_p2">';
										if(item.kind=="桃"){
					                        FinishContent+='<img src="../images/taozi.png" class="ut_icon">';
					                    }else if(item.kind=="核桃" || item.kind=="棉花"){
					                        FinishContent+='<img src="../images/wenshidp.png" class="ut_icon">';
					                    }else if(item.kind=="大豆"){
					                        FinishContent+='<img src="../images/douleizhiwu.png" class="ut_icon">';
					                    }else if(item.kind=="油菜"){
					                        FinishContent+='<img src="../images/youcai.png" class="ut_icon">';
					                    }else if(item.kind=="玉米"){
					                        FinishContent+='<img src="../images/yumi.png" class="ut_icon">';
					                    }else if(item.kind=="苹果"){
					                        FinishContent+='<img src="../images/pingguo.png" class="ut_icon">';
					                    }else if(item.kind=="小麦"){
					                        FinishContent+='<img src="../images/xiaomai.png" class="ut_icon">';
					                    }else if(item.kind=="樱桃"){
					                        FinishContent+='<img src="../images/yingtao.png" class="ut_icon">';
					                    }
										FinishContent+='<span class="ut_variety">'+item.kind+'</span>'+
											'<span class="ut_adress">'+item.town_name+'</span>'+
										'</p>'+
									'</div>'+
									'<div class="ut_rightBtn ut_rightBtn2">'+
										'<i class="ut_rbao"><e class="und_icon">&#xe670;</e><b class="ut_bb">修改</b></i><i class="ut_rshan ut_rshan2"><e class="und_icon">&#xe622;</e><b class="ut_bb">删除</b></i>'+
						    		'</div>'+
						    		'<span class="ut_arrow ut_arrow2"></span>'+
								'</li>';	
			})
			$(ut_ul2).html(FinishContent);
			$('.ut_ul  li').each(function(index,item){
				var weiyanbiao=$(item).find('.ut_number em').text();
				weiyanbiao=weiyanbiao.slice(0,1);
				if(!parseInt(weiyanbiao)){
					$(item).find('.weiyanbiao').show()
				}else{
					$(item).find('.weiyanbiao').hide()
				}
			});
			$(ut_ul2).find(".ut_arrow").click(function(){  //点击侧滑
		        $(this).parents(".ut_clickli").toggleClass("swipeleft2").siblings(".ut_clickli").removeClass("swipeleft2");
		        return false;
		    })
		    //touchSwipe("ut_clickli ut_clickli1","ut_clickli ut_clickli1 swipeleft2"); //调用侧滑函数
		    $(ut_ul2).find(".ut_rbao").click(function(){
		        $(".und_pspan2").html("修改").addClass("und_revise");
		        $(".und_pb").html("确认修改所选内容？");
		        $(".und_posmark").show();
		        $(this).parents(".ut_clickli").removeClass("swipeleft2");
		        var insuranceId=$(this).parents(".ut_clickli").attr("insurance_id");
		        $(".und_revise").click(function(){
		        	event.stopPropagation();
		            getFinishText(insuranceId,true);
		        })
		    })
		    $(ut_ul2).find(".ut_rshan2").click(function(){
		        $(".und_pspan2").html("删除").addClass("und_delete");
		        $(".und_pb").html("确认删除所选内容？");
		        $(".und_posmark").show();
		        $(this).parents(".ut_clickli").removeClass("swipeleft2");
		        var insuranceId=$(this).parents(".ut_clickli").attr("insurance_id");
		        $(".und_delete").click(function(){
		        	event.stopPropagation();
		            var data={
		                "user_id":JSON.stringify(user_id),
		                "insurance_id":insuranceId,
		                "city_code":city_code
		            };
		            var deleteInsurance=function(respons){
		                console.log(respons);
		                if(response.message=="ok"){
		                	window.location.reload();
                        	$(".und_posmark").hide();
		                }
		            }
		            AjaxPost("deleteInsurance",data,deleteInsurance);
		        })
		    })
		    $(".und_pspan1").click(function(){
		        $(".und_posmark").hide();
		    })

			$(ut_ul2).find(".ut_clickbox").click(function(){
				var insuranceId=$(this).parent(".ut_clickli").attr("insurance_id");
				getFinishText(insuranceId);
			})
		}
	}
	AjaxPost("insuranceQuery",data,policylist);
}

function getFinishText(insuranceId,isupdate){
	var user_id=parseInt(localStorage.getItem("user_id")),
		city_code=localStorage.getItem("city_code"),
		data={
			"user_id":user_id,
			"insurance_id":insuranceId,
			"city_code":city_code
		};
	var getpolicyinfo=function(response){
		var result=response.result;
		console.log(result);
		var papertype = "";
		if(result.id_type=="1"){
			papertype="社会信用代码";
		}else if(result.id_type=="0"){
			papertype="身份证号";
		}
		var lansArr = [];
		$.each(result.lands,function(i,item){
			var obj = {};
			obj.points = item.geometry;
			obj.count = item.count;
			obj.insurance_count = item.insurance_count;
			obj.land_serial = item.land_serial;
			lansArr.push(obj);
		})
		var landsStr = JSON.stringify(lansArr);
		var url1 = [],url2=[],url3=[],url4=[],url5=[];
		for (var i=0;i<result.images.length;i++) {
			result.images[i].longitude = result.images[i].lontitude;
			result.images[i].isupload = true;
			switch(result.images[i].type){
				case "1":url4.push(result.images[i]);break;
				case "2":url1.push(result.images[i]);break;
				case "3":url2.push(result.images[i]);break;
				case "4":url3.push(result.images[i]);break;
				case "6":url5.push(result.images[i]);break;
			}
		}
		console.log(landsStr);
		console.log(JSON.parse(landsStr));
		url1 = url1.length>0?JSON.stringify(url1):"null";
		url2 = url2.length>0?JSON.stringify(url2):"null";
		url3 = url3.length>0?JSON.stringify(url3):"null";
		url4 = url4.length>0?JSON.stringify(url4):"null";
		url5 = url5.length>0?JSON.stringify(url5):"null";
		if (isupdate) {
			url5 = "null";
		}
		var add_insurance = [];
		if (result.add_insurance.length>0) {
			for (var i=0;i<result.add_insurance.length;i++) {
				var obj = {};
				obj.kind_id = result.add_insurance[i].kind_id;
				obj.kind = result.add_insurance[i].kind;
				obj.unit_fee = result.add_insurance[i].unit_fee;
				obj.fee_percentage = result.add_insurance[i].fee_percentage;
				obj.self_per = result.add_insurance[i].self_per;
				obj.count = result.add_insurance[i].count;
				obj.total_expenses = result.add_insurance[i].total_fee;
				obj.expenses_farmer = result.add_insurance[i].farmer_fee;
				obj.remark = result.add_insurance[i].remark;
				add_insurance.push(obj);
			}
		}
		add_insurance = JSON.stringify(add_insurance);
		var db = window.sqlitePlugin.openDatabase({
			name:'myDatabase.db',
			location: 'default'
		});
		var isfinish = "1";
		if(isupdate){
			isfinish = "0";
		}else{
			isfinish = "1";
		}
		db.transaction(function(tx){
			//插入内容
			tx.executeSql("DELETE FROM IsFinishTable WHERE id="+result.insurance_id,[],function(tx,results){ 
				//alert("ok");
				tx.executeSql("INSERT INTO IsFinishTable (isfinish, createtime, insurance, labelname, kindid, insurant, papertype, paperid, idnumber, banknum, bankcard, bankid, bankadress, brunchid, telphone, planttowns, plantvillage, villageid, url1, url2, url3,url4,url5, picnum,mpicnum, area, tarea, mcount, landsArr, unitinsurance, insurancepay, premiumrate, unitpremium, grosspremium, farmarinsurance, remark, insurance_id,start_date,end_date,add_insurance,all_insured_account,all_total_expenses,all_expenses_farmer,citycode,userid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [isfinish,result.createdate, result.object_name, result.kind_name, result.kind_id, result.name, papertype, result.id_type, result.id_number, result.bank_card, result.bank_name, result.bank_id, result.subbank_name, result.subbank_id, result.phone_number, result.town_name, result.village_name, result.village_id, url1,url2,url3,url4,url5,result.image_number,result.check_image_num, result.total_count, result.total_count, result.land_number, landsStr, result.unit_fee, result.self_per, result.fee_percentage, parseInt(result.unit_fee)*parseInt(result.fee_percentage)/100, result.total_fee, result.farmer_fee, result.remark, result.insurance_id,result.startdate,result.enddate,add_insurance,result.all_insured_account,result.all_total_expenses,result.all_expenses_farmer,city_code,user_id],function(tx,results){
						//alert("ok");
						var insertid=results.insertId;
						localStorage.setItem("insertid",insertid);
						if (isupdate) {
							localStorage.setItem("type","unfinish");
						}else{
							localStorage.setItem("type","finish");
						}
						localStorage.setItem("insertid",insertid);
						//alert(insertid);
						window.location.href="./und_info.html";
				}, function(tx,message) {
					console.log("ERROR: " + message.message);
				});
			}, function(tx,message) {
				console.log("ERROR: " + message.message);
			});

		});
	}
	AjaxGet("getInsuranceInfo",data,getpolicyinfo);
}
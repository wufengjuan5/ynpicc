/*获取理赔list*/
function getClaim(keyname,ut_dl,ut_ul,ut_ul2){
	var user_id=localStorage.getItem("user_id"),
    	city_code=localStorage.getItem("city_code"),
    	token=localStorage.getItem("token"),
    	data={
    		"user_id":user_id, 
			"kind":"NULL",
			"farmer":"NULL",
			"device":"app",
			"date_end":"NULL",
			"start":0,
			"count":10,
			"status":1,
			"city_code":city_code,
			"createdate":"NULL",
			"date_start":"NULL",
			"kind_id":"NULL",
			"location":"NULL",
			"name":keyname,
			"village_id":"NULL"
		};
	var claimlist=function(data){
		var result=data.result,
			code=data.code,
			claFinishContent="";
			console.log(data)
		if(code==27){
			window.location.href="../login.html";
		}
		if(result==null){
			// $(".ut_ul_search1").html("");
			console.log(code)
			$(ut_dl).show();
			$('.loading_image').hide();
			$(ut_ul).hide();
		}else{
			$(ut_dl).hide();
			$(ut_ul).show();
			console.log(result);
			$.each(result,function(i,item){
				claFinishContent+='<li claim_id="'+item.claim_id+'" class="ut_clickli  ut_clickli1">'+
									'<div class="ut_swiper  ut_swiper1 ut_clickbox">'+
										'<h5 class="ut_name">'+item.farmer+'</h5>'+
										'<p class="ut_p1">'+
											'<span class="ut_time">'+item.createdate+'</span>'+
											'<span class="ut_dataNum">数据量：<e class="ut_number">'+item.points_number+'块/'+item.total_count+'亩/'+item.image_number+'张</e></span>'+
											
										'</p>'+
										'<p class="ut_p2">';
										if(item.kind=="桃"){
					                        claFinishContent+='<img src="../images/taozi.png" class="ut_icon">';
					                    }else if(item.kind=="核桃" || item.kind=="棉花"){
					                        claFinishContent+='<img src="../images/wenshidp.png" class="ut_icon">';
					                    }else if(item.kind=="大豆"){
					                        claFinishContent+='<img src="../images/douleizhiwu.png" class="ut_icon">';
					                    }else if(item.kind=="油菜"){
					                        claFinishContent+='<img src="../images/youcai.png" class="ut_icon">';
					                    }else if(item.kind=="玉米"){
					                        claFinishContent+='<img src="../images/yumi.png" class="ut_icon">';
					                    }else if(item.kind=="苹果"){
					                        claFinishContent+='<img src="../images/pingguo.png" class="ut_icon">';
					                    }else if(item.kind=="小麦"){
					                        claFinishContent+='<img src="../images/xiaomai.png" class="ut_icon">';
					                    }else if(item.kind=="樱桃"){
					                        claFinishContent+='<img src="../images/yingtao.png" class="ut_icon">';
					                    }
										claFinishContent+='<span class="ut_variety">'+item.kind+'</span>'+
										'</p>'+
									'</div>'+
									'<div class="ut_rightBtn ut_rightBtn2">'+
										'<i class="ut_rshan1"><e class="und_icon">&#xe622;</e><b class="ut_bb">删除</b></i><i class="ut_rshan ut_rshan2"><e class="und_icon">&#xe622;</e><b class="ut_bb">删除</b></i>'+
						    		'</div>'+
						    		'<span class="ut_arrow ut_arrow2"></span>'+
								'</li>';
			})
			$(ut_ul2).html(claFinishContent);
			if($('.cla_ul_finish').html()==''){
				$('.loading_image').show();
			}else{
				$('.loading_image').hide();
			}
			$(".ut_ul").find(".ut_clickbox").click(function(){
				var claim_id=$(this).parent(".ut_clickli").attr("claim_id");
				var li_data=result.find(function(item){return item.claim_id==claim_id})
				console.log(li_data)
				getpolicyinfo(li_data)
			})

			$(".cla_ul_finish").find(".ut_arrow").click(function(){
				$(this).parents(".ut_clickli").toggleClass("swipeleft").siblings(".ut_clickli").removeClass("swipeleft");
				return false;
			})
			
			$(".cla_ul_finish").find(".ut_rshan1").click(function(){
				var claim_id=$(this).parent().parent().attr("claim_id");
				$(".und_pspan2").html("删除").addClass("und_delete");
				$(".und_pb").html("确认删除所选内容？");
				$(".und_posmark").show();
				$(this).parents(".ut_clickli").removeClass("swipeleft");
				$(".und_delete").click(function(){
					event.stopPropagation();
					console.log(claim_id)
					var data={
		                "user_id":user_id,
		                "claim_id":Number(claim_id),
		                "city_code":city_code
		            };
		            var deleteInsurance=function(respons){
		                console.log(respons);
		                if(respons.message=="ok"){
		                	window.location.reload();
                        	$(".und_posmark").hide();
		                }
		            }
					AjaxPost("deleteClaim",data,deleteInsurance);
					var db = window.sqlitePlugin.openDatabase({
						name:'myDatabase.db',
						location: 'default'
					});
					db.transaction(function(tx){
						//插入内容
						tx.executeSql("DELETE FROM IsFinishClaim WHERE id="+claim_id,[],function(tx,results){
							//alert("ok");
						}, function(tx,message) {
							console.log("ERROR: " + message.message);
						});
					
					});
					
				});
				$(".und_pspan1").click(function(){
					$(".und_posmark").hide();
				})
			})

		}
	}
	AjaxPost("claimsQuery",data,claimlist);

}

function getpolicyinfo(result){
console.log(result);
var citycode = localStorage.getItem("city_code"),
	user_id=localStorage.getItem("user_id");
var db = window.sqlitePlugin.openDatabase({
	name:'myDatabase.db',
	location: 'default'
});
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
		var createtime, name,survey,survey_site_c,survey_site_xz,self_payment,kindname,insurance_id,lands,insurance_lands,idnumber,pkey,imgnum,disastercause,telphone,kind_id,land_property,insurancearea,disastertime,disasterarea,danweibaoe,landnumber,degreedamage,pfrate,fpmoney,baodanid,growth_period; 
		createtime=result.createdate!='null'?result.createdate:now;
		insurance_id=result.policy_number;
		name=result.farmer;
		idnumber=result.id_card;
		kindname=result.kind;
		self_payment=parseInt(result.self_per).toString();
		telphone=result.phone_number;
		landnumber=result.points_number.toString();
		land_property=result.land_type;
		imgnum=result.image_number.toString();
		survey_site_c=result.address;
		insurancearea=result.total_count;
		degreedamage=result.loss_degree_total;
		disastercause=result.disaster;
		disaster_area=result.loss_area_total;
		disastertime=result.damagedate.slice(0,10);
		growth_period=result.growth_period;
		survey=result.reporter;
		pfrate=parseInt(result.growth_period_ratio).toString();
		fpmoney=result.pay_money;
		if(parseInt(result.unit_fee)){
			danweibaoe=parseInt(result.unit_fee).toString();
		}else{
			danweibaoe='';
		}
		pkey=result.insurance_id;
		var lansArr = [];
		var inlandsArr = [];
		$.each(result.lands,function(i,item){
			if (item.type=="1") {
				var obj = {};
				obj.geometry = item.shape;
				obj.count = item.count;
				obj.loss_area = item.loss_area;
				obj.loss_degree = item.loss_degree;
				obj.insurance_land_id = item.pkey;
				lansArr.push(obj);
			}else{
				var obj = {};
				obj.points = item.shape;
				obj.count = item.count;
				obj.insurance_count = item.count;
				obj.loss_area = item.loss_area;
				obj.loss_degree = item.loss_degree;
				obj.insurance_land_id = item.pkey;
				inlandsArr.push(obj);
			}
		})
		lands = JSON.stringify(lansArr);
		insurance_lands = JSON.stringify(inlandsArr);
		var imgsArr = [];
		$.each(result.photos,function(i,item){
			var obj = {};
			obj.latitude = item.latitude;
			obj.longitude = item.lontitude;
			obj.thumbnail = item.thumbnail_url;
			obj.url = item.url;
			imgsArr.push(obj);
		})
		imgs = JSON.stringify(imgsArr);
		db.transaction(function(tx){
			//插入内容
			tx.executeSql("INSERT INTO IsFinishClaim (isfinish, createtime, insurance_id, name, id_number, kind_name, kind_id, self_payment, phone_number, land_number, land_property, image_number, survey_site_xz, survey_site_c, insurance_area, degree_damage, disaster_cause, disaster_area, disaster_time, growth_period, survey, lands,citycode,userid,insurance_lands,imgs, cInfo_pfrate, cInfo_pfmoney, danweibaoe, flags,disaster_id,village_id,pkey) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
			['1',createtime,insurance_id,name,idnumber,kindname,'null',self_payment,telphone,landnumber,land_property,imgnum,'null',survey_site_c,insurancearea,degreedamage,disastercause,disaster_area,disastertime,growth_period,survey,lands,citycode,user_id,insurance_lands,imgs,pfrate,fpmoney,danweibaoe,'0','null','null',pkey],
			function(tx,results){
				//alert("ok");
					var insert_id=results.insertId;
					console.log(insert_id)
					localStorage.setItem("insert_id",insert_id);
					localStorage.setItem("type","finish");
					//alert(insertid);
					window.location.href="./claim_info.html"
			}, function(tx,message) {
				console.log("ERROR: " + message.message);
			});
		});
}
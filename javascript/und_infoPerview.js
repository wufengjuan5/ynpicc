var images = [];
document.addEventListener("deviceready", onDeviceReadys, false);
function onDeviceReadys(){
    /*点击提交按钮*/
    $("#view_submit").click(function(){
        $(".view_mark").show();
    })
    $(".vw_cancle").click(function(){
        $(".view_mark").hide();
    })
	$("#signatureBtn").on("click",function(e){
		window.location.href="./signature.html";
	});
	var type = window.localStorage.getItem("type");
	if (type=="finish") {
		$("#signatureBtn").hide();
	}else{
		$("#signatureBtn").show();
	}
	var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        }),
        insertid=localStorage.getItem("insertid"),
        user_id=localStorage.getItem("user_id");
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM IsFinishTable WHERE id="'+insertid+'"', [], function (tx, result) {
            var rows = result.rows;
			var item = rows.item(0);
			console.log(item.url,item.url2,item.url3,item.url4,item.url5)
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
            var createtime, insurance, labelname, kindid, insurant, idnumber,id_type ,banknum, bankcard, bankadress, bankid, telphone, planttowns, plantvillage, url1, url2, url3, area, tarea, mcount, landsArr, unitinsurance, insurancepay, premiumrate, unitpremium, grosspremium, farmarinsurance; 
            // $.each(rows,function(i,item){
                createtime=item.createtime!="null"?item.createtime:now,
                insurance=item.insurance, 
                labelname=item.labelname, 
                id_type = item.paperid,
                kindid=item.kindid, 
                insurant=item.insurant, 
                idnumber=item.idnumber, 
                banknum=item.banknum, 
                bankcard=item.bankcard, 
                bankadress=item.bankadress, 
                bankid=item.brunchid,
                telphone=item.telphone, 
                planttowns=item.planttowns, 
                plantvillage=item.plantvillage, 
                villageid=item.villageid,
                url1=item.url1!='null'?JSON.parse(item.url1):[] , 
                url2=item.url2!='null'?JSON.parse(item.url2):[] , 
                url3=item.url3!='null'?JSON.parse(item.url3):[] ,
                url4=item.url4!='null'?JSON.parse(item.url4):[] ,
                url5=item.url5!='null'?JSON.parse(item.url5):[] ,
                area=item.area, 
                tarea=item.tarea, 
                insurance_id = item.insurance_id,
                mcount=parseInt(item.mcount), 
                landsArr=item.landsArr, 
                unitinsurance=item.unitinsurance, 
                insurancepay=item.insurancepay, 
                premiumrate=item.premiumrate, 
                unitpremium=item.unitpremium, 
                grosspremium=item.grosspremium, 
                farmarinsurance=item.farmarinsurance,
                picnum = item.picnum,
                mpicnum = item.mpicnum,
                start = item.start_date,
                end = item.end_date,
                add_insurance = item.add_insurance!='null'?JSON.parse(item.add_insurance):[],
                all_insured_account = item.all_insured_account,
                all_total_expenses = item.all_total_expenses,
                all_expenses_farmer = item.all_expenses_farmer,
                remark=item.remark;
				var type = window.localStorage.getItem("type");
				console.log(type)
				console.log(labelname)
                $(".und_ip_em1").html(insurance);
                $(".und_ip_em2").html(labelname);
                $(".und_ip_em3").html(insurant);
                $(".und_ip_em4").html(idnumber);
                $(".und_ip_em5").html(banknum);
                $(".und_ip_em6").html(telphone);
                $(".und_ip_em7").html(planttowns);
                $(".und_ip_em8").html(tarea+"亩");
                $(".und_ip_em9").html(mcount+"块");
                $(".und_ip_em10").html(unitinsurance+"元");
                $(".und_ip_em11").html(insurancepay+"%");
                $(".und_ip_em12").html(premiumrate+"%");
                $(".und_ip_em13").html(grosspremium+"元");
                $(".und_ip_em14").html(farmarinsurance+"元");
                $(".und_ip_em15").html(picnum+"张");
                $(".und_ip_em16").html(mpicnum+"张");
                $(".und_ip_em18").html(start);
                $(".und_ip_em19").html(end);
                $(".und_ip_em17").html(createtime);
                if (url5.length>0 && url5[0].url) {
                	$(".und_ip_pic").html('<img src="'+url5[0].url+'?r='+Math.random()+'" />');
                }
				images = url1.concat(url2).concat(url3).concat(url4).concat(url5);
				console.log(images)
                for (var i=0;i<images.length;i++) {
                	var isupload = ((images[i].url).indexOf("http")==-1);
                	if (isupload) {
                		images[i].isupload = false;
                	}else{
                		images[i].isupload = true;
                	}
                }
                if(add_insurance.length>0){
                	var fjxel = $(".fjxlist"),
                	txt = "";
                	for (var i=0; i<add_insurance.length;i++) {
                		txt += '<li><strong>附加险种-'+add_insurance[i].kind+'</strong></li>';
                		txt += '<li class="fjx_info"><strong>单位保额</strong><em>'+add_insurance[i].unit_fee+'元</em></li>';
                		txt += '<li class="fjx_info"><strong>保险费率</strong><em>'+add_insurance[i].fee_percentage+'%</em></li>';
                		txt += '<li class="fjx_info"><strong>保费自缴比例</strong><em>'+add_insurance[i].self_per+'%</em></li>';
                		txt += '<li class="fjx_info"><strong>总保额</strong><em>'+parseFloat(parseFloat(add_insurance[i].unit_fee)*parseFloat(add_insurance[i].count)).toFixed(2)+'元</em></li>';
                		txt += '<li class="fjx_info"><strong>总保险费</strong><em>'+add_insurance[i].total_expenses+'元</em></li>';
                		txt += '<li class="fjx_info"><strong>农户自缴保险费</strong><em>'+add_insurance[i].expenses_farmer+'元</em></li>';
                	}
                	fjxel.html(txt);
                }
                $(".und_ip_zbe").html(all_insured_account+"元");
                $(".und_ip_zbxf").html(all_total_expenses+"元");
                $(".und_ip_nhzjbxf").html(all_expenses_farmer+"元");
            // })
//          console.log(typeof(landsArr));
            $(".vw_sure").click(function(){
				if(type=="finish"){
					var photos = getPhotos();
					var func = function(){
		              	var data={
		                  "user_id":user_id,"insurance_id":insurance_id,"city_code":localStorage.getItem("city_code"),"photos":photos};
		              	console.log(data);
		              	var addin=function(data){
		                  var code=data.code;
		                  console.log(data);
		                  if(code=="0"){
		                      var db = window.sqlitePlugin.openDatabase({
		                          name:'myDatabase.db',
		                          location: 'default'
		                      }),
		                      insertid=localStorage.getItem("insertid");
		                      console.log(insertid);
		                      db.transaction(function(tx){ 
		                          //提交成功后删除本地数据库内容
		                          tx.executeSql("DELETE FROM IsFinishTable WHERE id="+insertid,[],function(tx,results){
		                            //alert("ok");
		
		                          }, function(tx,message) {
		                              console.log("ERROR: " + message.message);
		                          });
		                      });
		                      $(".view_mark").hide();
		                      $(".finish_mark").show();
		                      $(".fb_span1").click(function(){
		                          window.location.href= "./underwrite.html";
		                      })
		                  }
		              }
		              AjaxPost("addLandPhoto",data,addin);
	            	};
	            	iterator(0,func);
	            	$(".view_mark").hide();
				}else{
            			var func = function(){
		              	var data={
		                  "user_id":user_id,"fee_percentage":JSON.stringify(parseInt(premiumrate)),"subbank_id":bankid,"farmer_id":"0","city_code":localStorage.getItem("city_code"),"farmer":insurant,"ID":idnumber,"phone_number":telphone,"count":tarea,"unit":"亩","bank_card":banknum,"land_number":JSON.stringify(mcount),"lands":JSON.parse(landsArr),images:images,image_number:(picnum).toString(),check_image_num:(mpicnum).toString(),"serial_number":"","device":"app","category":"1","kind":kindid,"object_name":insurance,"village_id":villageid,"subbank_name":bankadress,"self_per":JSON.stringify(parseInt(insurancepay)),"total_expenses":JSON.stringify(parseInt(grosspremium)),"expenses_farmer":JSON.stringify(parseInt(farmarinsurance)),"remark":remark,"unit_fee":JSON.stringify(parseInt(unitinsurance)),startdate:start,"enddate":end,createdate:createtime,"id_type":id_type,add_insurance:add_insurance,all_insured_account:all_insured_account,all_total_expenses:all_total_expenses,all_expenses_farmer:all_expenses_farmer
		              	};
		              	var interfore = "addInsurance";
		              	if (insurance_id!="null") {
							data.insurance_id = insurance_id;
							interfore = "updateInsuranceInfo";
						}
		              	var addin=function(data){
		                   var code=data.code;
		                  console.log(data);
		                  if(code=="0"){
		                      var db = window.sqlitePlugin.openDatabase({
		                          name:'myDatabase.db',
		                          location: 'default'
		                      }),
		                      insertid=localStorage.getItem("insertid");
		                      console.log(insertid);
		                      db.transaction(function(tx){ 
		                          //提交成功后删除本地数据库内容
		                          tx.executeSql("DELETE FROM IsFinishTable WHERE id="+insertid,[],function(tx,results){
		                            //alert("ok");
		
		                          }, function(tx,message) {
		                              console.log("ERROR: " + message.message);
		                          });
		                      });
		                      $(".view_mark").hide();
		                      $(".finish_mark").show();
		                      $(".fb_span1").click(function(){
		                          window.location.href= "./underwrite.html";
		                      })
		                  }
		              }
		              AjaxPost(interfore,data,addin);
	            	};
	            	iterator(0,func);
	            	$(".view_mark").hide();
				}
            })          
        });     
    }, null);
    
    $(".ud_back").click(function(){
        window.location.href= "./und_payment.html";
    })
}
function getPhotos(){
	var photos = [];
	for (var i=0;i<images.length;i++) {
		if (images[i].type=='1'&&images[i].isupload==false) {
			var obj = {};
			obj.x = images[i].longitude;
			obj.y = images[i].latitude;
			obj.url = images[i].url;
			obj.thumbnail = images[i].thumbnail;
			photos.push(obj);
		}
	}
	return photos;
}
function getHttpUrl(imgurl,i,func){
	window.resolveLocalFileSystemURL(imgurl, function (fileEntry) {
//	    console.log('file system open: ' + fileEntry.name);
	    md5chksum.file(fileEntry, function(md5sum){
//	    	console.log("MD5SUM: " + md5sum);
			upLoadImg(imgurl,md5sum,i,func);
	    }, function(error){
	    	console.log("Error-Message: " + error);
	    });
	    
	}, function(){});
}
// file-Transfer插件，上传图片文件
function upLoadImg(imageURI,md5,i,func){
    var options = new FileUploadOptions();
    var params = {
	   user_id:localStorage.getItem("user_id") ,
	   md5: md5,
 	};
    options.chunkedMode = false;
    options.fileKey = "file";
    options.fileName = imageURI.substring(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.httpMethod = "POST";
    options.params = params;
    var fileTransfer = new FileTransfer();
    var successCallback = function(r){
    	console.count();
        console.log("Code = " + r.responseCode);
    	console.log("Response = " + r.response);
    	images[i].url = JSON.parse(r.response).url;
//      	images[i].isupload = true;
    	images[i].thumbnail = JSON.parse(r.response).thumbnail_url;
    	iterator(i+1,func);
    }
    var errorCallback = function (error) {
		$(".und_hint").show().html('上传失败，请检查网络连接');
		$('.upload_mark').hide();
		setTimeout(function(){
			$(".und_hint").hide();
		},2000);
    }
    fileTransfer.upload(
                imageURI,   //本地文件路径
                encodeURI("http:\/\/43.254.3.71/upugc"),  //服务器上传的路径
                successCallback,  //成功的回调
                errorCallback,    //失败的回调
                options);         //配置项
}

function iterator(i,func){
	if(i==images.length){
		savePictoDataBase();
		func();
		$('.upload_mark').hide();
        return;
	}
	$('.upload_mark').show().find(".loadingtext").html("正在上传 第"+(i+1)+"张 / "+images.length+"张");
	var isupload = ((images[i].url).indexOf("http")==-1);
	if (isupload) {
		getHttpUrl(images[i].url,i,func);
	}else{
		iterator(i+1,func);
	}
}
function savePictoDataBase(){//防止断网将其保存在本地
	var url1 = [],url2=[],url3=[],url4=[],url5=[];
	console.log(images)
	for (var i=0;i<images.length;i++) {
		switch(images[i].type){
			case "1":url4.push(images[i]);break;
			case "2":url1.push(images[i]);break;
			case "3":url2.push(images[i]);break;
			case "4":url3.push(images[i]);break;
			case "6":url5.push(images[i]);break;
		}
	}
	url1 = JSON.stringify(url1);
	url2 = JSON.stringify(url2);
	url3 = JSON.stringify(url3);
	url4 = JSON.stringify(url4);
	url5 = JSON.stringify(url5);
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){ 
    	//更新内容
			tx.executeSql("UPDATE IsFinishTable SET url1=?,url2=?,url3=?,url4=?,url5=? WHERE id=?",
				[url1,url2,url3,url4,url5,insertid],
				function(tx,results){
					console.log("数据保存成功！");
				},
				function(tx,message) {
          			console.log("ERROR: " + message.message);
				});
    });
}

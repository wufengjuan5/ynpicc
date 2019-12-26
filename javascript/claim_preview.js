var images = [];
/*添加受损和理赔面积水印*/
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
    db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    var insert_id=localStorage.getItem("insert_id"),
    user_id=localStorage.getItem("user_id");

    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM IsFinishClaim WHERE id="'+insert_id+'"',[],function (tx, results){
            var rows = results.rows;
            var item = rows.item(0);
            console.log(item)
            localStorage.setItem("damagedata",JSON.stringify(item));
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
            var createtime, name,survey,village_id,self_payment,kindname,lands,idnumber,disaster_id,pkey,imgnum,disastercause,telphone,kind_id,land_property,insurancearea,disastertime,disasterarea,danweibaoe,landnumber,degreedamage,disastermj,pfrate,fpmoney,baodanid,growth_period; 
            createtime=item.createtime!='null'?item.createtime:now;
            name=item.name;
            kindname=item.kind_name;
            idnumber=item.id_number;
            telphone=item.phone_number;
            landnumber=item.land_number;
            landnumber=item.land_number;
            imgnum=item.image_number;
            disastercause=item.disaster_cause;
            disastertime=item.disaster_time;
            survey_site_c=item.survey_site_c;//勘察地点
            insurancemj=item.insurance_area;//承保面积
            pfrate=item.cInfo_pfrate;
            picnum = item.image_number;
            pfmoney=item.cInfo_pfmoney;
            disasterarea=item.disaster_area
            baodanid=item.insurance_id;
            degreedamage=item.degree_damage;//损失程度
            danweibaoe=item.danweibaoe;
            growth_period=item.growth_period;
            land_property=item.land_property;
            kind_id=item.kind_id;
            lands=JSON.parse(item.lands);
            var loss_lands=[];
            for(var i=0; i<lands.length; i++){
                lands[i].insurance_land_id=lands[i].insurance_land_id.slice(3,5)
                loss_lands.push(lands[i])
            }
            survey=item.survey;
            disaster_id=item.disaster_id;
            disastertime=item.disaster_time;       
            images=JSON.parse(item.imgs);
            self_payment=item.self_payment;
            village_id=item.village_id;
            pkey=item.pkey;
            var data_degreedamage=degreedamage.split(',');
            var disasterarea_data=disasterarea.split(',');
            var disasterarea2=[];
            for(var i=0; i<disasterarea_data.length; i++){
                disasterarea2.push(parseFloat(disasterarea_data[i]).toFixed(1)+'亩')
            }
            disasterarea=disasterarea2.join();
            console.log(disasterarea)
            $('.claim_ip_ol .claim_ip_em1').text(kindname);
            $('.claim_ip_ol .claim_ip_em2').text(name);
            $('.claim_ip_ol .claim_ip_em3').text(idnumber);
            $('.claim_ip_ol .claim_ip_em4').text(baodanid);
            $('.claim_ip_ol .claim_ip_em5').text(telphone);
            $('.claim_ip_ol .claim_ip_em6').text(landnumber);
            $('.claim_ip_ol .claim_ip_em7').text(imgnum);
            $('.claim_ip_ol .claim_ip_em8').text(disastercause);
            $('.claim_ip_ol .claim_ip_em9').text(survey_site_c);
            $('.claim_ip_ol .claim_ip_em10').text(insurancemj);
            $('.claim_ip_ol .claim_ip_em11').text(degreedamage);//损失程度
            $('.claim_ip_ol .claim_ip_em12').text(disasterarea);
            $('.claim_ip_ol .claim_ip_em14').text(disastertime);
            $('.claim_ip_ol .claim_ip_em15').text(createtime);
            $(function(){
                if(item.isfinish=='0'){
                    $("#claimPreview_submit").show();
                    $("#claimPreview_submit").click(function(e){
                        var imgnum = $('.claim_ip_ol .claim_ip_em7').text();
                      if (imgnum>0) {
                          $(".view_mark").show();
                      }else{
                          $(".und_hint").show().html("请拍摄查勘照片后提交");
                          setTimeout(function(){
                              $(".und_hint").hide();
                          },2000);
                            return false;
                      }
                  });    
                }else{
                    $("#claimPreview_submit").hide();
                }
                $(".ud_back").click(function(){
                    window.location.href = "./claim_map.html";
                })            
            })
            //百分数转化成小数
             var percent =pfrate+'%';//申明要放在函数前  
                function toPoint(percent){  
                    var str=percent.replace("%","");  
                            str= str/100;  
                    return str;  
                }  
                var result = toPoint(percent);  
            //地块理赔金额计算
            if(result!==0){
                var landshtml='';
                $.each(data_degreedamage,function(index,item){
                    insurancemj=Number(insurancemj);
                    danweibaoe=Number(danweibaoe);
                    pfmoney=Number(pfmoney);
                    var disasterareadatas=parseFloat(disasterarea_data[index]).toFixed(1);
                    var lipei=(insurancemj*danweibaoe-pfmoney)/insurancemj*result*toPoint(item)*disasterareadatas;
                    var zmjb=Math.round((insurancemj*danweibaoe-pfmoney)/insurancemj*100)/100;
                    var lipei_string=zmjb+'*'+result+'*'+toPoint(item)+'*'+disasterareadatas+'=';
                    lipei=Math.round(lipei* 100)/100;
                    landshtml+='<li>'+
                                    '<strong>地块('+disasterareadatas+'亩)</strong>'+
                                    '<em class="claim_ip_em13">'+lipei_string+lipei+'元</em>'+
                                '</li>'
                })
                $('.claim_ip_ol .claim_ip_em12').parent().after($(landshtml));    
            }
            $(".vw_cancle").click(function(){
                $(".view_mark").hide();
            })
            $(".vw_sure").click(function(){
                var func= function(){
                    console.log(images)
                        var data={
                            claims: [
                                {
                                    address:survey_site_c, 
                                    city_code:localStorage.getItem("city_code"),
                                    createdate:createtime,  
                                    damagedate:disastertime,      
                                    farmer:name,
                                    growth_period:growth_period, 
                                    id_number:idnumber, 
                                    image_number:picnum, 
                                    insurance_count:String(parseFloat(insurancemj)), 
                                    insurance_id:pkey||'0', 
                                    insurance_serial:baodanid, 
                                    kind:kindname, 
                                    kind_id:kind_id, 
                                    land_number:landnumber, 
                                    land_type:land_property, 
                                    lands:loss_lands, 
                                    loss_area_total:disasterarea, 
                                    loss_degree_total:degreedamage, 
                                    pay_money:String(pfmoney), 
                                    phone_number:telphone, 
                                    photos:getPhotos(), 
                                    reporter:survey, 
                                    self_per:self_payment, 
                                    user_id:user_id, 
                                    village_id:village_id,
                                    growth_period_ratio:pfrate
                                }
                            ], 
                            "device":"app", 
                            "disaster_id":String(disaster_id)
                        }
                        var addin=function(data){
                            var code=data.code;
                            console.log(data);
                            if(code=="0"){
                                var db = window.sqlitePlugin.openDatabase({
                                    name:'myDatabase.db',
                                    location: 'default'
                                }),
                                insert_id=localStorage.getItem("insert_id");
                                db.transaction(function(tx){ 
                                    //提交成功后删除本地数据库内容
                                    tx.executeSql("DELETE FROM IsFinishClaim WHERE id="+insert_id,[],function(tx,results){
                                    //alert("ok");
    
                                    }, function(tx,message) {
                                        console.log("ERROR: " + message.message);
                                    });
                                });
                                $(".finish_mark").show();
                                $(".fb_span1").click(function(){
                                    window.location.href= "./claim.html";
                                })
                            }
                        }
                    AjaxPost('addClaimItem',data,addin);    
                    }                    
                iterator(0,func);
                $(".view_mark").hide();
            }) 
        }); 

    },null); 
}

function getHttpUrl(imgurl,i,func){//
    addShuiYinLP_disaster(imgurl,function(url){
        window.resolveLocalFileSystemURL(url,function(fileEntry) {
    //	    console.log('file system open: ' + fileEntry.name);
            md5chksum.file(fileEntry,function(md5sum){
    //	    	console.log("MD5SUM: " + md5sum);
                upLoadImg(url,md5sum,i,func);
            }, function(error){
                console.log("Error-Messag e: " + error);
            });           
        }, function(){});
    });	
}
// file-Transfer插件，上传图片文件
function upLoadImg(imageURI,md5,i,func){
    console.log(imageURI)
    var options = new FileUploadOptions();
    var params = {
	   user_id:localStorage.getItem("user_id"),
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
    	$(".und_hint").show().html("上传失败，请检查网络连接");
		setTimeout(function(){
			$(".und_hint").hide();
		},2000);
		$('.upload_mark').hide();
    }
    fileTransfer.upload(
                imageURI,   //本地文件路径
                encodeURI("http:\/\/43.254.3.71/upugc"),  //服务器上传的路径
                successCallback,  //成功的回调
                errorCallback,    //失败的回调
                options);         //配置项
}

function iterator(i,func){
	if(i==images.length){//照片上传完时
		savePictoDataBase();//照片地址保存在本地数据库
		func();
		$('.upload_mark').hide();
        return;
    }
    $('.upload_mark').show().find(".loadingtext").html("正在上传 第"+(i+1)+"张 / "+images.length+"张");
    var isupload = ((images[i].url).indexOf("http")==-1);//为ture时地址里不存在字符串‘http’
	if (isupload) {//true时说明照片已上传至服务器
        getHttpUrl(images[i].url,i,func);   //将加完水印的照片的地址保存
	}else{
        iterator(i+1,func);
        console.log(i+1)
	}
}

function getPhotos(){//获取照片
    var photos = [];
	for (var i=0;i<images.length;i++) {
        var obj = {};
        obj.longitude = images[i].longitude;
        obj.latitude = images[i].latitude;
        obj.url = images[i].url;
        obj.thumbnail_url = images[i].thumbnail;
        photos.push(obj);
    }
	return photos;
}

function savePictoDataBase(){
	var imgs = JSON.stringify(images);
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){ 
    	//更新内容
			tx.executeSql("UPDATE IsFinishTable SET imgs=? WHERE id=?",
				[imgs,insert_id],
				function(tx,results){
					console.log("数据保存成功！");
				},
				function(tx,message) {
          			console.log("ERROR: " + message.message);
				});
    });
    
}

var WaterMarkConfig = {
	W_NAME : 1,
	W_IDNUMBER : 1<<1,
	W_KIND : 1<<2,
	W_OPUSER : 1<<3,
	W_ADDRESS : 1<<4,
	W_SOURCE : 1<<5,
	W_DIRECTION : 1<<6,
	W_LATLNG : 1<<7,
	W_TIME : 1<<8,
	W_GROWTH : 1<<9,
	W_DISASTER : 1<<10,
	W_LOSSDEGREE : 1<<11,
	W_LOSSAREA : 1<<12,
	W_DISASTERTIME : 1<<13,
	W_SIGN : 1<<14
}
//给照片加图片水印
function addShuiYin(url,surl, callback) {
	console.time("syjsq");
    var canvas = document.createElement('canvas');
    var img = new Image();
	var simg = new Image();
	img.src = url;
	simg.src = surl;
    var context = canvas.getContext('2d');
    img.onload = function(){
    	console.log("w:"+img.width+"---"+"h:"+img.height);
		var wh = scalingImage(img.width,img.height,1200,1600);
		canvas.width = wh.width;
    	canvas.height = wh.height;
		console.log(url);
		console.log("w:"+wh.width+"---"+"h:"+wh.height);
		context.drawImage(img, 0, 0,wh.width,wh.height);
		// 再次绘制
		if (wh.height>wh.width) {
			context.drawImage(simg, wh.width/10, wh.height/3,wh.width*0.8,wh.height/3);
		}else{
			context.drawImage(simg, wh.width/5, wh.height/5,wh.width*(3/5),wh.height*(3/5));
		}
		console.timeEnd("syjsq");
		console.time("bcjsq");
		window.canvas2ImagePlugin.saveImageDataToLocal(
	        function(msg){
	        	console.timeEnd("bcjsq");
	           	callback("file://"+msg);
	        },
	        function(err){
	            console.log(err);
	        },
	        canvas
    	);
	    
    };
};
//给照片加文字水印
function addTextShuiYin(url,pos, callback) {
    var canvas = document.createElement('canvas');
    var img = new Image();
	img.src = url;
    var context = canvas.getContext('2d');
    img.onload = function(){
    	var scalewidth = 30;
    	var scaleheight = 50;
		var wh = scalingImage(img.width,img.height,1200,1600);
		canvas.width = wh.width;
    	canvas.height = wh.height;
    	var dpr = window.devicePixelRatio;
		context.drawImage(img, scalewidth, scaleheight,wh.width-scalewidth*2,wh.height-scaleheight*2);
	   	context.font=12*dpr/100 +"rem microsoft yahei";
	   	context.textAlign="left";
	   	context.fillStyle = "rgba(255,0,0,1)";
	   	var info = JSON.parse(localStorage.getItem("potoObj"));
   		context.fillText(info.farmer,scalewidth,scaleheight-10);
   		context.fillText(photoObj.type=="0"?plusXing(info.id_number,10,4):info.id_number,wh.width/2-context.measureText(info.id_number).width/2,scaleheight-10);
   		context.fillText(info.xztype,wh.width-scalewidth-context.measureText(info.xztype).width,scaleheight-10);
   		context.fillText("坐标来源：GPS定位结果",scalewidth,wh.height-10);
   		context.fillText("[服务器]拍摄时间："+formatDate(pos.timestamp),wh.width/2,wh.height-10);
   		strokeText(context,"验标人："+info.checkname,scalewidth,scaleheight+30);
   		strokeText(context,"地址："+info.address,scalewidth,wh.height-scaleheight-40);
   		strokeText(context,"经度："+pos.longitude.toFixed(5),scalewidth,wh.height-scaleheight-10);
   		strokeText(context,"纬度："+pos.latitude.toFixed(5),wh.width/2-context.measureText("纬度：39.90933").width/2,wh.height-scaleheight-10);
   		strokeText(context,"朝向："+getHeadingText(pos.heading),wh.width-scalewidth-context.measureText("朝向：南").width,wh.height-scaleheight-10);
   		
		// 再次绘制
		window.canvas2ImagePlugin.saveImageDataToLocal(
	        function(msg){
	           callback("file://"+msg);
	        },
	        function(err){
	            console.log(err);
	        },
	        canvas
    	);
	    
    };
};
//给承保的照片加水印
function addShuiYinCB(url,surl,pos, callback) {
	var canvas = document.createElement('canvas');
    var img = new Image();
	img.src = url;
	var simg = new Image();
	simg.src = surl;
    var context = canvas.getContext('2d');
    img.onload = function(){
    	var scalewidth = 30;
    	var scaleheight = 50;
		var wh = scalingImage(img.width,img.height,1200,1600);
		canvas.width = wh.width;
    	canvas.height = wh.height;
    	var dpr = window.devicePixelRatio;
		context.drawImage(img, scalewidth, scaleheight,wh.width-scalewidth*2,wh.height-scaleheight*2);
	   	context.font=12*dpr/100 +"rem microsoft yahei";
	   	context.textAlign="left";
	   	context.fillStyle = "rgba(255,0,0,1)";
	   	var info = JSON.parse(localStorage.getItem("potoObj"));
	   	if (WaterMarkConfig.W_NAME & parseInt(WaterMark)) {
	   		context.fillText(info.farmer,scalewidth,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_IDNUMBER & parseInt(WaterMark)) {
	   		context.fillText(photoObj.type=="0"?plusXing(info.id_number,10,4):info.id_number,wh.width/2-context.measureText(info.id_number).width/2,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_KIND & parseInt(WaterMark)) {
	   		context.fillText(info.xztype,wh.width-scalewidth-context.measureText(info.xztype).width,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_SOURCE & parseInt(WaterMark)) {
	   		context.fillText("坐标来源：GPS定位结果",scalewidth,wh.height-10);
	   	}
	   	if (WaterMarkConfig.W_TIME & parseInt(WaterMark)) {
	   		context.fillText("[服务器]拍摄时间："+formatDate(pos.timestamp),wh.width/2,wh.height-10);
	   	}
	   	if (WaterMarkConfig.W_OPUSER & parseInt(WaterMark)) {
	   		strokeText(context,"验标人："+info.checkname,scalewidth,scaleheight+30);
	   	}
	   	if (WaterMarkConfig.W_ADDRESS & parseInt(WaterMark)) {
	   		strokeText(context,"地址："+info.address,scalewidth,wh.height-scaleheight-40);
	   	}
	   	if (WaterMarkConfig.W_LATLNG & parseInt(WaterMark)) {
	   		strokeText(context,"经度："+pos.longitude.toFixed(5),scalewidth,wh.height-scaleheight-10);
	   		strokeText(context,"纬度："+pos.latitude.toFixed(5),wh.width/2-context.measureText("纬度：39.90933").width/2,wh.height-scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_DIRECTION & parseInt(WaterMark)) {
	   		strokeText(context,"朝向："+getHeadingText(pos.heading),wh.width-scalewidth-context.measureText("朝向：南").width,wh.height-scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_SIGN & parseInt(WaterMark)) {
		   	if (wh.height>wh.width) {
				context.drawImage(simg, wh.width/10, wh.height/3,wh.width*0.8,wh.height/3);
			}else{
				context.drawImage(simg, wh.width/5, wh.height/5,wh.width*(3/5),wh.height*(3/5));
			}
	   	}
		// 再次绘制
		window.canvas2ImagePlugin.saveImageDataToLocal(
	        function(msg){
	           callback("file://"+msg);
	        },
	        function(err){
	            console.log(err);
	        },
	        canvas
    	);
	    
    };
};
//给理赔的照片加水印
function addShuiYinLP(url,surl,pos, callback) {
    var canvas = document.createElement('canvas');
    var img = new Image();
	img.src = url;
	var simg = new Image();
	simg.src = surl;
    var context = canvas.getContext('2d');
    img.onload = function(){
    	var scalewidth = 30;
    	var scaleheight = 50;
		var wh = scalingImage(img.width,img.height,1200,1600);
		canvas.width = wh.width;
    	canvas.height = wh.height;
    	var dpr = window.devicePixelRatio;
		context.drawImage(img, scalewidth, scaleheight,wh.width-scalewidth*2,wh.height-scaleheight*2);
	   	context.font=12*dpr/100 +"rem microsoft yahei";
	   	context.textAlign="left";
	   	context.fillStyle = "rgba(255,0,0,1)";
		var info = JSON.parse(localStorage.getItem("potoObj"));
	   	if (WaterMarkConfig.W_NAME & parseInt(WaterMark)) {
	   		context.fillText(info.farmer,scalewidth,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_IDNUMBER & parseInt(WaterMark)) {
	   		context.fillText(photoObj.type=="0"?plusXing(info.id_number,10,4):info.id_number,wh.width/2-context.measureText(info.id_number).width/2,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_KIND & parseInt(WaterMark)) {
	   		context.fillText(info.xztype,wh.width-scalewidth-context.measureText(info.xztype).width,scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_SOURCE & parseInt(WaterMark)) {
	   		context.fillText("坐标来源：GPS定位结果",scalewidth,wh.height-10);
	   	}
	   	if (WaterMarkConfig.W_TIME & parseInt(WaterMark)) {
	   		context.fillText("[服务器]拍摄时间："+formatDate(pos.timestamp),wh.width/2,wh.height-10);
	   	}
	   	if (WaterMarkConfig.W_OPUSER & parseInt(WaterMark)) {
	   		strokeText(context,"查勘员："+info.checkname,scalewidth,scaleheight+60);
	   	}
	   	if (WaterMarkConfig.W_ADDRESS & parseInt(WaterMark)) {
	   		strokeText(context,"地址："+info.address,scalewidth,wh.height-scaleheight-40);
	   	}
	   	if (WaterMarkConfig.W_LATLNG & parseInt(WaterMark)) {
	   		strokeText(context,"经度："+pos.longitude.toFixed(5),scalewidth,wh.height-scaleheight-10);
	   		strokeText(context,"纬度："+pos.latitude.toFixed(5),wh.width/2-context.measureText("纬度：39.90933").width/2,wh.height-scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_DIRECTION & parseInt(WaterMark)) {
	   		strokeText(context,"朝向："+getHeadingText(pos.heading),wh.width-scalewidth-context.measureText("朝向：南").width,wh.height-scaleheight-10);
	   	}
	   	if (WaterMarkConfig.W_GROWTH & parseInt(WaterMark)) {
	   		strokeText(context,"生长期："+info.szq,scalewidth,scaleheight+30);
	   	}
	   	if (WaterMarkConfig.W_DISASTER & parseInt(WaterMark)) {
	   		strokeText(context,"灾害原因："+info.zhyy,scalewidth+context.measureText("生长期："+info.szq).width+20,scaleheight+30);
	   	}
	   	if (WaterMarkConfig.W_DISASTERTIME & parseInt(WaterMark)) {
	   		strokeText(context,"出险日期："+info.cxsj,wh.width-scalewidth-context.measureText("出险日期："+info.cxsj).width,wh.height-scaleheight-40);
	   	}
	   	if (WaterMarkConfig.W_SIGN & parseInt(WaterMark)) {
		   	if (wh.height>wh.width) {
				context.drawImage(simg, wh.width/10, wh.height/3,wh.width*0.8,wh.height/3);
			}else{
				context.drawImage(simg, wh.width/5, wh.height/5,wh.width*(3/5),wh.height*(3/5));
			}
		}
		// 再次绘制
		window.canvas2ImagePlugin.saveImageDataToLocal(
	        function(msg){
	           callback("file://"+msg);
	        },
	        function(err){
	            console.log(err);
	        },
	        canvas 
    	);
			
    };
};
//给受灾地块照片添加水印
function addShuiYinLP_disaster(url,callback) {
    var canvas = document.createElement('canvas');
    var img = new Image();
	img.src = url;
    var context = canvas.getContext('2d');
    img.onload = function(){
		var scalewidth = 30;
		var scaleheight = 50;
		var wh = scalingImage(img.width,img.height,1200,1600);
		canvas.width = wh.width;
		canvas.height = wh.height;
		var dpr = window.devicePixelRatio;
		context.drawImage(img, scalewidth, scaleheight,wh.width-scalewidth*2,wh.height-scaleheight*2);
		   context.font=12*dpr/100 +"rem microsoft yahei";
		   context.textAlign="left";
		   context.fillStyle = "rgba(255,0,0,1)";
		   var damageinfo =JSON.parse(localStorage.getItem("damagedata"));
		   console.log(damageinfo)
		if (WaterMarkConfig.W_LOSSDEGREE) {

			strokeText(context,"损失程度："+damageinfo.degree_damage,wh.width-scalewidth-context.measureText("损失程度："+damageinfo.degree_damage).width-30,scaleheight+80);
		}
		if (WaterMarkConfig.W_LOSSAREA) {
			strokeText(context,"受灾面积："+damageinfo.disaster_area,wh.width-scalewidth-context.measureText("受灾面积："+damageinfo.disaster_area).width-30,scaleheight+110);
		}
				// 再次绘制
		window.canvas2ImagePlugin.saveImageDataToLocal(//
					function(msg){
					   callback("file://"+msg);//返回照片加完水印的地址
					},
					function(err){ 
						console.log(err);
					},
					canvas
		);
    };
};
function strokeText(ctx,txt,x,y){
	ctx.shadowOffsetX = 0; // 设置水平位移
	ctx.shadowOffsetY = 0; // 设置垂直位移
	ctx.shadowBlur = 10; // 设置模糊度
	ctx.shadowColor = "rgba(255,255,255,1)"; // 设置阴影颜色
	var dpr = window.devicePixelRatio;
//	ctx.font="900 "+12*dpr/100 +"rem microsoft yahei";
//	ctx.fillStyle = "rgba(255,255,255,1)";
//	ctx.fillText(txt,x,y);
	ctx.font=12*dpr/100 +"rem microsoft yahei";
	ctx.fillStyle = "rgba(255,0,0,1)";
	ctx.fillText(txt,x,y);
}
function scalingImage(imgWidth, imgHeight, containerWidth, containerHeight) {
    var containerRatio = containerWidth / containerHeight;
    var imgRatio = imgWidth / imgHeight;

    if (imgRatio > containerRatio) {
        imgWidth = containerWidth;
        imgHeight = containerWidth / imgRatio;
    } else if (imgRatio < containerRatio) {
        imgHeight = containerHeight;
        imgWidth = containerHeight * imgRatio;
    } else {
        imgWidth = containerWidth;
        imgHeight = containerHeight;
    }

    return { width: imgWidth, height: imgHeight };
}
//身份证号隐藏
function plusXing (str,frontLen,endLen) { 
	var len = str.length-frontLen-endLen;
	var xing = '';
	for (var i=0;i<len;i++) {
		xing+='*';
	}
	return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}

function getHeadingText(degree){
	degree %= 360;
	var degreeStr = "";
    if(degree >= 45 && degree< 135){
        degreeStr ="东";
    }else if(degree >= 135 && degree< 225){
        degreeStr ="南";
    }else if(degree >= 225 && degree< 315){
        degreeStr ="西";
    }else if(degree >= 315 || degree< 45){
        degreeStr ="北";
    }
	return degreeStr;
}
function formatDate(ns) {
	var d = new Date(ns);
	var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-') 
			+ ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');
	return dformat;
}

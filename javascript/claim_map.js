var isSelect=false,isEditSelect=false,selectedLayer=null,photoObj = {},kindobj={},Location={latitude:0,longitude:0},WaterMark="0b1111111111111111111111",PKEY=null;
var ClipperType={
	AND:ClipperLib.ClipType.ctIntersection,//求相交
	OR:ClipperLib.ClipType.ctUnion,//求合并
	NOT:ClipperLib.ClipType.ctDifference,//求不同
	XOR:ClipperLib.ClipType.ctXor//求异或
};
(function(){
	//mapInit();
	document.addEventListener("deviceready", onDeviceReady, false);
	var type = window.localStorage.getItem("type");
	if(type=="finish"){
		$("#select-control").hide();
		$("#draw-control").hide();
		$("#edit-control").hide();
	}
	createEvent();
 	$("#claMapPrev").click(function(){
        saveInfoToDataBase("./claim_info.html",false);
    })
  	$("#claMapNext").click(function(e){
//		window.location.href="./claim_preview.html";
	  	saveInfoToDataBase("./claim_preview.html",true);
    })
	getWaterMark();
}());
function getWaterMark(){
	var paramObj = {city_code:localStorage.getItem("city_code")};
	var dofunc = function(response){
		var obj = response;
		var watermarkers = obj.result;
		WaterMark = watermarkers.claim_watermark;
	};
	AjaxGet('getWaterMark',paramObj,dofunc);
}
function onDeviceReady(){
	L.DomEvent.on(document.getElementById("locate-control"), 'click', function (ev) {
		console.log("开始定位");
		getCurrentPosition();
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
    getKindList();
	L.DomEvent.on(document.getElementById("camera"), 'click', function (ev) {
		if (drawnItems.getLayers().length>0) { 
			cameraTakePicture();
		}else{
			$(".und_hint").show().html("请先选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
	  		return false;
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	mapInit();
}
//获取险种
function getKindList(){
	var code = window.localStorage.getItem("city_code")
	var paramObj = {category:'1',city_code:code,start:0,count:0};
	var dofunc = function(response){
		var list = response.result;
        if(response.result){
        	for(var i=0;i<list.length;i++){
        		kindobj[list[i].id] = list[i];
        	}
        	
        }
	};
	AjaxGet('getInsuranceKind',paramObj,dofunc);
}
/*调用相机*/
function cameraTakePicture(){
	console.count();
	navigator.camera.getPicture(onCameraSuccess,onCameraFail,{
		quality:50,
		destinationType:Camera.DestinationType.FILE_URI,
		correctOrientation:true
	});
	function onCameraSuccess(imageURI){
			//定位数据获取成功响应
			if (Location.latitude!="0"&&Location.longitude!="0") {
				var latlng = wgs2gcj(Location.latitude,Location.longitude);
				var p = map.latLngToLayerPoint([latlng.latitude,latlng.longitude]);
				if(!isWithIn(p)){
					$("#und_mark2").show();
					$(".mr_cancle2").off("click");
					$(".mr_cancle2").on("click",function(){
						$("#und_mark2").hide();
						return false;
					})
					$(".mr_sure2").off("click");
					$(".mr_sure2").on("click",function(){
						$("#und_mark2").hide();
						addShuiYinLP(imageURI,"../images/icon_shuiyin_chakan.png",Location,function(url){
							var location = wgs2gcj(Location.latitude,Location.longitude);
							var locIcon = L.icon({
							    iconUrl: '../images/main_icon3.png',
							    iconSize: [32, 32]
							});
							var m = L.marker([location.latitude,location.longitude],{
					    		rotationAngle: Location.heading,
					    		icon: locIcon,
					    		url:url,
					    		thumbnail:""
							});
							markersList.push(m);
							markers.addLayer(m);
							var insertid = localStorage.getItem("insertid");
							var markerStr = getMarkers().length>0?getMarkers():'null';
							var markernums = markersList.length;
							var db = window.sqlitePlugin.openDatabase({
					            name:'myDatabase.db',
					            location: 'default'
					        });
					        db.transaction(function(tx){
					            //更新数据
					            tx.executeSql("UPDATE IsFinishClaim SET imgs=?,image_number=? WHERE id=?",
					              [markerStr,markernums,insertid],
					              function(tx,results){
					              	console.log('照片保存成功');
					              },
					              function(tx,message) {
					                console.log("ERROR: " + message.message);
					              });
					        })
						});
					})
				}else{
					addShuiYinLP(imageURI,"../images/icon_shuiyin_chakan.png",Location,function(url){
						var location = wgs2gcj(Location.latitude,Location.longitude);
						var locIcon = L.icon({
						    iconUrl: '../images/main_icon3.png',
						    iconSize: [32, 32]
						});
						var m = L.marker([location.latitude,location.longitude],{
				    		rotationAngle: Location.heading,
				    		icon: locIcon,
				    		url:url,
				    		thumbnail:""
						});
						markersList.push(m);
						markers.addLayer(m);
						var insertid = localStorage.getItem("insertid");
						var markerStr = getMarkers().length>0?getMarkers():'null';
						var markernums = markersList.length;
						var db = window.sqlitePlugin.openDatabase({
				            name:'myDatabase.db',
				            location: 'default'
				        });
				        db.transaction(function(tx){
				            //更新数据
				            tx.executeSql("UPDATE IsFinishClaim SET imgs=?,image_number=? WHERE id=?",
				              [markerStr,markernums,insertid],
				              function(tx,results){
				              	console.log('照片保存成功');
				              },
				              function(tx,message) {
				                console.log("ERROR: " + message.message);
				              });
				        })
					});
				}
			}else{
				$("#und_mark3").show();
				$(".mr_cancle3").off("click");
				$(".mr_cancle3").on("click",function(){
					$("#und_mark3").hide();
					return false;
				});
				$(".mr_sure3").off("click");
				$(".mr_sure3").on("click",function(){
					$("#und_mark3").hide();
					if (device.platform==="Android") {
						cordova.plugins.diagnostic.switchToLocationSettings();
					}else{
						cordova.plugins.diagnostic.switchToSettings();
					}
				})
			}　　　　　　　　　 
	}
	function onCameraFail(message){
//		alert('Failed because:'+message);
	}
}
//判断照片点是否在地块中
function isWithIn(p){
	var polygons = drawnItems.getLayers();
	var isok = false;
	for (var i=0;i<polygons.length;i++) {
		if (polygons[i]._containsPoint(p)) {
			isok = true;
		}
	}
	return isok;
}
function mapInit(){
	var labelTextCollision = new L.LabelTextCollision({
        collisionFlg : false
    });
 	ydrawnItems = new L.FeatureGroup({zIndex:1});
	map = L.map('map', {
      center: [40,116],
      crs:L.CRS.EPSG3857,
      zoom: 8,
      maxZoom:20,
      zoomControl:false,
      attributionControl:false,
      renderer : labelTextCollision,
      preferCanvas: true,
    });
	markers = new L.MarkerClusterGroup({
		spiderfyOnMaxZoom: false,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: false
	});
	markersList = [];
	markers.on('clusterclick', function (a) {
		var cmark = a.layer.getAllChildMarkers();
		var imgsrcs = [];
		for (var i=0;i<cmark.length;i++) {
			imgsrcs.push(cmark[i].options.url);
		}
		sessionStorage.setItem("claim_imgs",JSON.stringify(imgsrcs));
		saveInfoToDataBase("./mapimg.html",false);
	});
	markers.on('click', function (a) {
		var imgsrcs = [];
		imgsrcs.push(a.layer.options.url);
		sessionStorage.setItem("claim_imgs",JSON.stringify(imgsrcs));
		saveInfoToDataBase("./mapimg.html",false);
	});
	map.addLayer(markers);
    cbItems = new L.FeatureGroup({zIndex:1});
    map.addLayer(cbItems);
	drawnItems = new L.FeatureGroup({zIndex:2});
    map.addLayer(drawnItems);
	locationItems = new L.FeatureGroup({zIndex:3});
    map.addLayer(locationItems);
		
    map.on('draw:created', function (e) {
        var type = e.layerType,
        layer = e.layer;
        if (type=='polygon') {
        	if (PKEY) {
        		featureGroupAddLayer(layer);
        	}else{
        		layer.options.area = wParseFloat(polygonDrawer._area*0.0015).toFixed(1);
	            layer.options.tarea = wParseFloat(polygonDrawer._area*0.0015).toFixed(1);
	            layer.options.degree = "0";
	            layer.options.text = layer.options.area+"亩/"+layer.options.tarea+"亩/"+wParseFloat(layer.options.degree).toFixed(1)+"%";
	            layer.options.textColor = "#FF0000";
			    layer.options.color = "#000000";
			    layer.options.weight = 1;
				layer.options.opacity = 1,
				layer.options.fill = true;
				layer.options.fillColor="#09a51e"; //same as color by default
				layer.options.fillOpacity=0.5;
	            layer.options.id = getLandId();
	            if(layer.options.area!=0){
	            	drawnItems.addLayer(layer);
	            	onClickEvent();
	            }else{
	            	$(".und_hint").show().html("绘图面积为0,请重新绘制！");
	            	setTimeout(function(){
	    				$(".und_hint").hide();
	    			},1500);
	            }
	            
        	}
        }
        
    });
    
    map.on('draw:editvertex', function (e) {
        var layer = e.poly;
        var area = L.GeometryUtil.geodesicArea(layer._defaultShape());
		layer.options.area = wParseFloat(area*0.0015).toFixed(1);
		layer.options.tarea = wParseFloat(area*0.0015).toFixed(1);
		layer.options.text = layer.options.area+" 亩/"+layer.options.tarea+" 亩/0.0%";
		map.stop();
    });
	var polygon_options = {
        showArea: true,
        allowIntersection:false,
        shapeOptions: {
            stroke: true,
            color: '#000000',
            weight: 1,
            opacity: 1,
            fill: true,
            fillColor: "#FFFF00", //same as color by default
            fillOpacity: 0.2,
            clickable: true
        }
    }
	polygonDrawer = new L.Draw.Polygon(map, polygon_options);
    watchPosition();
	map.on("click",function(e){
		var latlng = e.latlng;
		console.log(latlng);
		if(isSelect){
			var p = map.latLngToLayerPoint([latlng.lat,latlng.lng]);
			getStandardLand(p);
		}
	});
	showMapInfo();
    getCurrentHeading();
	var uid = window.localStorage.getItem("user_id"),
	code = window.localStorage.getItem("city_code"),
	paramObj = {user_id:uid,city:code},
	dofunc = function(response) {
		if(response.result) {
			var basemaps = {};
			var overlays = {};
			var obj = response.result;
			var layers = obj.layers;
			if(layers.length > 0) {
				for(var i = 0; i < layers.length; i++) {
					if(layers[i].url) {
						var url_arr = layers[i].url.split(",");
						var url = url_arr[0] + "wms?";
						var layer_name = url_arr[1];
						switch(layers[i].en_name) {
							case "mapLayer":
								basemaps.EleMapLayer = L.tileLayer.wms(url,{
									layers: layer_name,
								});
								
								break;
							case "digitalMapLayer":
								basemaps.DMapLayer = L.tileLayer.wms(url,{
									layers: layer_name,
								});
								break;
							case "borderLayer":
								overlays.borderLayer = L.tileLayer.wms(url,{
									layers: layer_name,
								});
								break;
							case "landLayer":
								overlays.landLayer = L.tileLayer.wms(url,{
									layers: layer_name,
								});
								break;
						}
					}
				}
			}
		}
		var extent = [wParseFloat(obj.x_min),wParseFloat(obj.y_min),wParseFloat(obj.x_max),wParseFloat(obj.y_max)];
        var bounds = extent2Bounds(extent);
		var baseLayers = {
			"电子地图": basemaps.DMapLayer,
		    "卫星影像": basemaps.EleMapLayer
		};
		var overlayers = {
		    "地块数据": overlays.landLayer,
		    "村界线": overlays.borderLayer
		};
		map._addLayers([basemaps.EleMapLayer,overlays.borderLayer,overlays.landLayer]);
		L.control.layers(baseLayers, overlayers,{collapsed:false}).addTo(map);
	};
	AjaxGet('getCityServices',paramObj,dofunc);
}
function onMoveend(evt){
	drawLayersWithWkt();
}
//绘制已投保地块
function drawLayersWithWkt(){
	var zoom = map.getZoom();
	if(zoom<13){ydrawnItems.clearLayers();return;}
	var scale = map.getZoomScale(map.getZoom(),0);
	var extent = bounds2Extent(map.getBounds());
	var code = window.localStorage.getItem("city_code");
	var paramObj = {xmin:extent[0],ymin:extent[1],xmax:extent[2],ymax:extent[3],city_code:code,scale:zoom,device:'webapp'};
	var dofunc = function(response){
		var list = response.result;
		ydrawnItems.clearLayers();
    	if(response.count>0){
    		loadYFeatures(list);
    	}
	};
	AjaxGet('getRangeLands',paramObj,dofunc);
}
function loadYFeatures(lands){
	if (lands) {
		for (var i=0;i<lands.length;i++) {
			loadYfeature(lands[i]);
		}
	}
}
function loadYfeature(obj){
	var geom = obj.geom;
	var pointlist = [];
	var polygonlist = geom.split("#");
	if (polygonlist.length>1) {
		for (var i=0;i<polygonlist.length;i++) {
			var pl = polygonlist[i].split(";");
			for (var j=0;j<pl.length;j++) {
				var lon = pl[j].split(",")[0];
				var lat = pl[j].split(",")[1];
				pl[j] = webMercator2Latlng([lon,lat]);
			}
			pointlist.push(pl);
		}
	}else{
		pointlist = geom.split(";");
		for (var i=0;i<pointlist.length;i++) {
			var lon = pointlist[i].split(",")[0];
			var lat = pointlist[i].split(",")[1];
			pointlist[i] = webMercator2Latlng([lon,lat]);
		}
	}
	
	var polygon = L.polygon(pointlist,{id:obj.land_serial,
				stroke: true,
//				minZoom:14,
	            color: kindobj[obj.kind_id].color||"#000000",
	            weight: 1,
	            opacity: 1,
	            text:obj.name+" "+wParseFloat(obj.count).toFixed(1)+"亩",
	            textColor:kindobj[obj.kind_id].color||"#000000",
	            fill: true,
	            fillColor: "#FFFF00", //same as color by default
	            fillOpacity: 0.2,
	            clickable: true,
				area:wParseFloat(obj.count).toFixed(1)});
	polygon._leaflet_id = obj.land_serial;
	if(!ydrawnItems.hasLayer(polygon)){
		ydrawnItems.addLayer(polygon);
	}
}
function getMarkers(){
	var ms = [];
	if (markersList.length>0) {
		for (var i=0;i<markersList.length;i++) {
			var lonlat = latLng2WebMercator(markersList[i]._latlng);
			var obj = {};
			obj.latitude = lonlat[1].toString();
			obj.longitude = lonlat[0].toString();
			obj.type = '1';
			obj.isupload = false;
			obj.url = markersList[i].options.url;
			obj.thumbnail = markersList[i].options.thumbnail;
			ms.push(obj);
		}
	}
	return JSON.stringify(ms);
}
function getLandId(){
	var t = new Date();
	var num = t.getTime();
	num = num.toString();
	var numId = num.substr(-7,7);
	return numId;
}
function getStandardLand(p){
	var polygons = cbItems.getLayers();
	for (var i=0;i<polygons.length;i++) {
		if (polygons[i]._containsPoint(p)) {
			var polygon = L.polygon(latlngsToArray(polygons[i].getLatLngs()[0]),{id:"cb_"+polygons[i].options.id,
				stroke: true,
	            color: '#000000',
	            weight: 1,
	            degree:"0",
	            opacity: 1,
	            text:polygons[i].options.area+"亩/"+polygons[i].options.tarea+"亩/0%",
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#09a51e", //same as color by default
	            fillOpacity: 0.5,
	            clickable: true,
	            landid:polygons[i].options.landid,
	            tarea:polygons[i].options.tarea,
				area:polygons[i].options.area});
			polygon._leaflet_id = "cb_"+polygon.options.landid;
			if(!drawnItems.hasLayer(polygon)){
				drawnItems.addLayer(polygon);
			}
			map.stop();
			onClickEvent();
			return;
		}
	}
	
	
}
//转成浮点型
function wParseFloat(value){
	var num = 0;
	var val = parseFloat(value);
	if(!isNaN(val)){
		num = val;
	}
	return num;
	
}
function latlngsToArray(latlngs){
	var arr = [];
	for (var i=0;i<latlngs.length;i++) {
		arr.push([latlngs[i].lat,latlngs[i].lng]);
	}
	return arr;
}
function latLng2WebMercator(latlng)
{
    var x = latlng.lng *20037508.34/180;
    var y = Math.log(Math.tan((90+latlng.lat)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180;
    return [x, y];
}
function webMercator2Latlng(lnglat) //[lng,lat]
{
    var lng = lnglat[0] / 20037508.34 * 180;
    var lat = lnglat[1] / 20037508.34 * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return [lat,lng]; //[114.32894001591471, 30.58574800385281]
}
function bounds2Extent(bounds){
	var topleft = bounds.getSouthWest(),
	topleft = latLng2WebMercator(topleft);
	bottomright = bounds.getNorthEast(),
	bottomright = latLng2WebMercator(bottomright);
	var extent = [topleft[0],topleft[1],bottomright[0],bottomright[1]];
	return extent;
}
function extent2Bounds(extent){
	var topleft = [extent[0],extent[3]];
	topleft = webMercator2Latlng(topleft);
	var bottomright = [extent[2],extent[1]];
	bottomright = webMercator2Latlng(bottomright);
	return [topleft,bottomright];
}

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
	console.log(e.message);
}
function reSetTools(){
	
}
function createEvent(){
	L.DomEvent.on(document.getElementById("layer-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings().removeClass("selected").addClass("unselected");
			$(".leaflet-control-layers").show();
			$(".edit-button-list").hide();
			$("#draw-toolbar").hide();
			$("#info-panel").hide();
			polygonDrawer.disable();
			if ($(".edit-button-list").find("#edit").hasClass("selected")&&selectedLayer) {
				selectedLayer.editing.disable();
			}
			$(".edit-button-list").find(".selected").removeClass("selected").addClass("unselected");
			offSelectControl();
			offSelectEvent();
			
		}else{
			$(this).removeClass("selected").addClass("unselected");
			$(".leaflet-control-layers").hide();
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("select-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings().removeClass("selected").addClass("unselected");
			$(".leaflet-control-layers").hide();
			$(".edit-button-list").hide();
			$("#draw-toolbar").hide();
			$("#info-panel").hide();
			polygonDrawer.disable();
			if ($(".edit-button-list").find("#edit").hasClass("selected")&&selectedLayer) {
				selectedLayer.editing.disable();
			}
			$(".edit-button-list").find(".selected").removeClass("selected").addClass("unselected");
			onSelectControl();
			offSelectEvent();
		}else{
			$(this).removeClass("selected").addClass("unselected");
			offSelectControl();
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("draw-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings().removeClass("selected").addClass("unselected");
			$("#draw-toolbar").show();
			$(".edit-button-list").hide();
			$(".leaflet-control-layers").hide();
			$("#info-panel").hide();
			polygonDrawer.enable();
			if ($(".edit-button-list").find("#edit").hasClass("selected")&&selectedLayer) {
				selectedLayer.editing.disable();
			}
			$(".edit-button-list").find(".selected").removeClass("selected").addClass("unselected");
			offSelectControl();
			offSelectEvent();
			offClickEvent();
		}else{
			$(this).removeClass("selected").addClass("unselected");
			$("#draw-toolbar").hide();
			polygonDrawer.disable();
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("edit-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings().removeClass("selected").addClass("unselected");
			$(".edit-button-list").show();
			$(".leaflet-control-layers").hide();
			$("#draw-toolbar").hide();
			polygonDrawer.disable();
			offSelectControl();
			onSelectEvent();
			isEditSelect = true;
		}else{
			isEditSelect = false;
			$(this).removeClass("selected").addClass("unselected");
			$(".edit-button-list").hide();
			$("#info-panel").hide();
			if ($(".edit-button-list").find("#edit").hasClass("selected")&&selectedLayer) {
				selectedLayer.editing.disable();
			}
			$(".edit-button-list").find(".selected").removeClass("selected").addClass("unselected");
			offSelectEvent();
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("finish"), 'click', function (ev) {
		polygonDrawer.completeShape();
		polygonDrawer.enable();
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("cancel"), 'click', function (ev) {
		polygonDrawer.deleteLastVertex(); 
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("delete"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#delete')").hasClass("selected"))return
		if (selectedLayer) {
			drawnItems.removeLayer(selectedLayer);
			map.stop();
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}
	});
	L.DomEvent.on(document.getElementById("edit"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#edit')").hasClass("selected"))return
		if (selectedLayer) {
			if($(this).hasClass("unselected")){
				$(this).removeClass("unselected").addClass("selected");
				$(this).siblings().removeClass("selected").addClass("unselected");
				selectedLayer.editing.enable();
				isEditSelect = false;
			}else{
				selectedLayer.editing.disable();
				if (PKEY) {
					featureGroupEditLayer(selectedLayer);
				}
				selectedLayer = null;
				$(this).removeClass("selected").addClass("unselected");
				isEditSelect = true;
				onSelectEvent();
			}
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("sz"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#sz')").hasClass("selected"))return;
		if (selectedLayer) {
			$("#info-panel").show().find(".szzw").text(localStorage.getItem("szzw"));
			$("#info-panel").show().find(".txzmj").text(selectedLayer.options.area);
			$("input[name=sz-area]").val(selectedLayer.options.tarea);
			$("input[name=ss-degree]").val(selectedLayer.options.degree);
			$("input[name=sz-area]").attr("placeholder",selectedLayer.options.tarea);
			$("input[name=ss-degree]").attr("placeholder",selectedLayer.options.degree);
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}
		L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("info-ok"), 'click',function(ev){
		var area = $("input[name=sz-area]").val();
		var degree = $("input[name=ss-degree]").val();
		if(isNaN(parseFloat(area))||isNaN(parseFloat(degree))){
			$(".und_hint").show().html("请输入正确的数字");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}else if(wParseFloat(area)>wParseFloat(selectedLayer.options.area)){
			$(".und_hint").show().html("受灾面积不能大于地块面积");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}else if(wParseFloat(selectedLayer.options.area)-wParseFloat(parseFloat(area).toFixed(1))>wParseFloat(selectedLayer.options.area)*0.2 ){
			$(".und_hint").show().html("受灾面积与地块面积相差不能超过地块面积的20%");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}else if(wParseFloat(degree)>100||wParseFloat(degree)<0){
			$(".und_hint").show().html("损失程度是百分比必须在(0-100)之间");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
		}else{
			selectedLayer.options.tarea = parseFloat(area).toFixed(1);
			selectedLayer.options.degree = parseFloat(degree).toFixed(1);
			selectedLayer.options.text = selectedLayer.options.area+" 亩/"+selectedLayer.options.tarea+" 亩/"+selectedLayer.options.degree+"%";
			map.stop();
			$("#info-panel").hide();
		}
		L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("info-cancel"), 'click',function(ev){
		$("#info-panel").hide();
		L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	
}
function removeOldFeatures(){
	mergeItems.eachLayer(function(layer){
		drawnItems.removeLayer(layer);
	});
	map.stop();
}
function onMultiSelectEvent(){
	drawnItems.eachLayer(function(layer){
		layer.on("click",function(e){
			var layers = e.target;
			if (layers.options.fillColor == "#FBF8F6") {
				layers.options.fillColor = "#09a51e";
				mergeItems.removeLayer(layers);
			}else{
				layers.options.fillColor = "#FBF8F6";
				mergeItems.addLayer(layers);
			}
			layers.redraw();
		});
	});
}
function offMultiSelectEvent(){
	drawnItems.eachLayer(function(layer){
		layer.options.fillColor = "#09a51e";
		layer.redraw();
		layer.off("click");
	});
//	mergeItems.clearLayers();
}
function onSelectEvent(){
	offClickEvent();
	drawnItems.eachLayer(function(layer){
		layer.off("click");
		layer.on("click",function(e){
			if (isEditSelect) {
				var layers = layer;
				if (layers.options.fillColor == "#02a292") {
					selectedLayer = null;
					layers.options.fillColor = "#09a51e";
				}else{
					drawnItems.eachLayer(function(layer){
						layer.options.fillColor = "#09a51e";
						selectedLayer = null;
						layer.redraw();
					});
					layers.options.fillColor = "#02a292";
					selectedLayer = layers;
				}
				layers.redraw();
			}
		});
	});
}

function offSelectEvent(){
	drawnItems.eachLayer(function(layer){
		layer.options.fillColor = "#09a51e";
		selectedLayer = null;
		layer.redraw();
		layer.off("click");
	});
	onClickEvent();
}
function onClickEvent(){
	var type = localStorage.getItem("type");
	if(type=="finish")return;
	drawnItems.eachLayer(function(layer){
		layer.off("click");
		layer.on("click",function(e){
			if (!isSelect) {
				$("#info-panel").show();
				selectedLayer = layer;
				$("#info-panel").show().find(".szzw").text(localStorage.getItem("szzw"));
				$("#info-panel").show().find(".txzmj").text(selectedLayer.options.area);
				$("input[name=sz-area]").val(selectedLayer.options.tarea);
				$("input[name=ss-degree]").val(selectedLayer.options.degree);
				$("input[name=sz-area]").attr("placeholder",selectedLayer.options.tarea);
				$("input[name=ss-degree]").attr("placeholder",selectedLayer.options.degree);
			}
		});
	});
}

function offClickEvent(){
	drawnItems.eachLayer(function(layer){
		selectedLayer = null;
		layer.off("click");
	});
}
function onSelectControl(){
	isSelect = true;
}
function offSelectControl(){
	isSelect = false;
}
function drawFeatures(obj) { 
	var polygons = obj.polygons;
	if(polygons.length > 0) {
		for(var k = 0; k < polygons.length; k++) {
			var obj = polygons[k];
			var geom = obj.geom;
			var pointlist = [];
			var polygonlist = geom.split("#");
			if(polygonlist.length > 1) {
				for(var i = 0; i < polygonlist.length; i++) {
					var pl = polygonlist[i].split(";");
					for(var j = 0; j < pl.length; j++) {
						var lon = pl[j].split(",")[0];
						var lat = pl[j].split(",")[1];
						pl[j] = webMercator2Latlng([lon, lat]);
					}
					pointlist.push(pl);
				}
			} else {
				pointlist = geom.split(";");
				for(var i = 0; i < pointlist.length; i++) {
					var lon = pointlist[i].split(",")[0];
					var lat = pointlist[i].split(",")[1];
					pointlist[i] = webMercator2Latlng([lon, lat]);
				}
			}
			var landid = getLandId();
			var polygon = L.polygon(pointlist, {
				id: landid,
				stroke: true,
				color: '#000000',
				weight: 1,
				opacity: 1,
				text: wParseFloat(obj.area).toFixed(1) + "亩/" + wParseFloat(obj.area).toFixed(1) + "亩",
				textColor: "#FF0000",
				fill: true,
				fillColor: "#FFFF00", //same as color by default
				fillOpacity: 0.2,
				clickable: true,
				area: wParseFloat(obj.area).toFixed(1),
				tarea: wParseFloat(obj.area).toFixed(1)
			});
			polygon._leaflet_id = landid;
			console.log("0");
			if(!drawnItems.hasLayer(polygon)) {
				drawnItems.addLayer(polygon);
			}
		}
		offMultiSelectEvent();
		offSelectEvent();
		onSelectEvent();
	}
}
function featureSelected(obj){
	var geom = obj.geomstring;
	var pointlist = [];
	var polygonlist = geom.split("#");
	if (polygonlist.length>1) {
		for (var i=0;i<polygonlist.length;i++) {
			var pl = polygonlist[i].split(";");
			for (var j=0;j<pl.length;j++) {
				var lon = pl[j].split(",")[0];
				var lat = pl[j].split(",")[1];
				pl[j] = webMercator2Latlng([lon,lat]);
			}
			pointlist.push(pl);
		}
	}else{
		pointlist = geom.split(";");
		for (var i=0;i<pointlist.length;i++) {
			var lon = pointlist[i].split(",")[0];
			var lat = pointlist[i].split(",")[1];
			pointlist[i] = webMercator2Latlng([lon,lat]);
		}
	}
	
	var polygon = L.polygon(pointlist,{id:obj.landNumber,
				stroke: true,
	            color: '#000000',
	            weight: 1,
	            opacity: 1,
	            text:wParseFloat(obj.standardArea).toFixed(1)+"亩/"+wParseFloat(obj.standardArea).toFixed(1)+"亩",
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#FFFF00", //same as color by default
	            fillOpacity: 0.2,
	            clickable: true,
				area:wParseFloat(obj.standardArea).toFixed(1),
				tarea:wParseFloat(obj.standardArea).toFixed(1)});
	polygon._leaflet_id = obj.landNumber;
	if(!drawnItems.hasLayer(polygon)){
		drawnItems.addLayer(polygon);
	}
}
function getLandsArea(){
	var loss_area_total = [];
	var loss_degree_total = [];
	var layers = drawnItems.getLayers();
	var lands = [];
	for (var i=0;i<layers.length;i++) {
		loss_area_total.push(parseFloat(layers[i].options.tarea));
		loss_degree_total.push(parseFloat(layers[i].options.degree));
		var obj = {};
		obj.geometry = getPoints(layers[i]._latlngs);
		obj.count = layers[i].options.area;
		obj.insurance_land_id = layers[i].options.id;
		obj.loss_area = layers[i].options.tarea;
		obj.loss_degree = layers[i].options.degree;
		lands.push(obj);
	}
	var l_degree_total = "",
	l_area_total = "";
	if (Math.min.apply(null,loss_degree_total)===Math.max.apply(null,loss_degree_total)) {
		l_degree_total = Math.max.apply(null,loss_degree_total)+"%";
		l_area_total = eval(loss_area_total.join("+"))+"亩";
	}else{
		l_degree_total = loss_degree_total.join("%,")+"%";
		l_area_total = loss_area_total.join("亩,")+"亩";
	}
	return {loss_area_total:l_area_total,loss_degree_total:l_degree_total,lands:lands};
}
function getPoints(latlngs){
	var points="";
	var layers = [];
	if (latlngs.length<2) {
		var arr = latlngs[0];
		for (var i=0;i<arr.length;i++) {
			var lonlat = latLng2WebMercator(arr[i]).join(",");
			layers.push(lonlat);
		}
		layers.push(layers[0]);
		points = layers.join(";");
	}else{
		for (var i=0;i<latlngs.length;i++) {
			var ls = [];
			var arr = latlngs[i];
			for (var j=0;j<arr.length;j++) {
				var lonlat = latLng2WebMercator(arr[j]).join(",");
				ls.push(lonlat);
			}
			ls.push(ls[0]);
			layers.push(ls.join(";"));
		}
		points = layers.join("#");
	}
	return points;
	
}
function getMergePolyGons(){
	var layers = mergeItems.getLayers(),
	lys = [];
	for (var i=0;i<layers.length;i++) {
		var layer = getPoints(layers[i]._latlngs);
		var obj = {geom:layer};
		lys.push(obj);
	}
	return lys;
}
function getLinePoints(latlngs){
	var points="";
	var layers = [];
	var arr = latlngs;
	for (var i=0;i<arr.length;i++) {
		var lonlat = latLng2WebMercator(arr[i]).join(",");
		layers.push(lonlat);
	}
	points = layers.join(";");
	return points;
}
function updateArea(){
	var landsNum = drawnItems.getLayers().length,
	totalArea = getLandsArea().area,
	totalTarea = getLandsArea().tarea;
	$(".map_hint").html("地块数量:"+landsNum+"块    地块总面积: "+totalArea+"亩    投保总面积:"+totalTarea+"亩");
}
function componentDidMount(domid) {
    var el = document.getElementById(domid);
    L.DomEvent.addListener(el, 'click', function (e) {
      L.DomEvent.preventDefault(e);
    });
    L.DomEvent.addListener(el, 'mousedown dblclick', function (e) {
      L.DomEvent.stopPropagation(e);
    });
}

function watchPosition() {
	//定位数据获取成功响应
	var onSuccess = function(position) {
		Location.latitude = position.coords.latitude;
		Location.longitude = position.coords.longitude;
		Location.heading = position.coords.heading;
		Location.timestamp = position.timestamp;
		console.log("定位成功");
		locationItems.clearLayers();
		var location = wgs2gcj(position.coords.latitude,position.coords.longitude);
		var locIcon = L.icon({
		    iconUrl: '../images/location2.png',
		    iconSize: [24, 32]
		});
		var radius = position.coords.accuracy / 2;
		L.marker([location.latitude,location.longitude],{
    		rotationAngle: position.coords.heading,
    		rotationOrigin:"center",
    		icon: locIcon
		}).addTo(locationItems)
	};　　　　　　　　　　 
	//定位数据获取失败响应
	function onError(error) {
		console.log('code: ' + error.code + '\n' +
			'message: ' + error.message + '\n');
	}
	//开始获取定位数据
	navigator.geolocation.watchPosition(onSuccess, onError);
}
function getCurrentPosition() {
	//定位数据获取成功响应
	var onSuccess = function(position) {
		var location = wgs2gcj(position.coords.latitude,position.coords.longitude);
		map.flyTo([location.latitude,location.longitude],18);
	};　　　　　　　　　　 
	//定位数据获取失败响应
	function onError(error) {
		console.log('code: ' + error.code + '\n' +
			'message: ' + error.message + '\n');
	}
	//开始获取定位数据
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
//在定位位置添加照片点
function addPicMark(url){
	//定位数据获取成功响应
	var onSuccess = function(position) {
		var location = wgs2gcj(position.coords.latitude,position.coords.longitude);
		var locIcon = L.icon({
		    iconUrl: '../images/main_icon3.png',
		    iconSize: [32, 32]
		});
		var m = L.marker([location.latitude,location.longitude],{
    		rotationAngle: position.coords.heading,
    		icon: locIcon,
    		url:url,
    		thumbnail:""
		});
		markersList.push(m);
		markers.addLayer(m);
		var insertid = localStorage.getItem("insertid");
		var markerStr = getMarkers().length>0?getMarkers():'null';
		var markernums = markersList.length;
		var db = window.sqlitePlugin.openDatabase({
            name:'myDatabase.db',
            location: 'default'
        });
        db.transaction(function(tx){
            //更新数据
            tx.executeSql("UPDATE IsFinishClaim SET url4=?,mpicnum=? WHERE id=?",
              [markerStr,markernums,insertid],
              function(tx,results){
              	console.log('照片保存成功');
              },
              function(tx,message) {
                console.log("ERROR: " + message.message);
              });
        })
	};　　　　　　　　　　 
	//定位数据获取失败响应
	function onError(error) {
		console.log('code: ' + error.code + '\n' +
			'message: ' + error.message + '\n');
	}
	
	//开始获取定位数据
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function getCurrentHeading(){
	var compassSuccess = function(heading) {
		var marker = locationItems.getLayers()[0];
		if(marker){
			marker.setRotationAngle(heading.magneticHeading);
		}
	}
	function compassError(compassError) {
	    console.log("onError:"+ compassError.code);
	}
//	var options = { frequency: 1000 }; 
	watchID = navigator.compass.watchHeading(compassSuccess, compassError);  
}

function showMapInfo() {
	var insert_id = localStorage.getItem("insert_id");
    var db = window.sqlitePlugin.openDatabase({
	        name:'myDatabase.db',
	        location: 'default'
	    });
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM IsFinishClaim WHERE id="' + insert_id + '"', [], function(tx, results) {
			console.log(insert_id)
			var rows = results.rows;
			PKEY = rows.item(0).pkey;
			photoObj.farmer = rows.item(0).name;
			photoObj.id_number = rows.item(0).id_number;
			photoObj.type = "0";
			photoObj.xztype = rows.item(0).kind_name;
			photoObj.checkname = rows.item(0).survey;
			photoObj.address = rows.item(0).survey_site_c;
			photoObj.szq = rows.item(0).growth_period;
			photoObj.zhyy = rows.item(0).disaster_cause;
			photoObj.cxsj = rows.item(0).disaster_time;
			localStorage.setItem("potoObj",JSON.stringify(photoObj) );
			localStorage.setItem("szzw",rows.item(0).kind_name);
			var loss_lands = JSON.parse(rows.item(0).lands);
			var lands = JSON.parse(rows.item(0).insurance_lands);
			loadFeatures(lands);
			loadLossFeatures(loss_lands);
			if (rows.item(0).imgs!='null') {
				var imgs = JSON.parse(rows.item(0).imgs);
				console.log(imgs);
				loadMarkers(imgs);
			}
		})
	});
}
function loadMarkers(imgs){
	var delImg =sessionStorage.getItem("del_claim_Imgs")!=null?JSON.parse(sessionStorage.getItem("del_claim_Imgs")):[];
	console.log(delImg);
	for (var i=0;i<imgs.length;i++) {
		if (delImg.indexOf(imgs[i].url)==-1) {
			var latlng = webMercator2Latlng([parseFloat(imgs[i].longitude),parseFloat(imgs[i].latitude)]);
			var locIcon = L.icon({
			    iconUrl: '../images/main_icon3.png',
			    iconSize: [32, 32]
			});
			var m = L.marker(latlng,{
	    		icon: locIcon,
	    		url:imgs[i].url,
	    		thumbnail:imgs[i].thumbnail
			});
			markersList.push(m);
			markers.addLayer(m);
		}
	}
}
function loadLossFeatures(lands){
	console.log(lands);
	if (lands&&lands.length>0) {
//		var lands = obj.lands;
		for (var i=0;i<lands.length;i++) {
			loadLossfeature(lands[i]);
		}
		var bounds = drawnItems.getBounds();
		var target = map._getBoundsCenterZoom(bounds);
		console.log(target);
        map.setView(target.center, target.zoom);
	}
}
function loadLossfeature(obj){
	var geom = obj.geometry;
	var pointlist = [];
	var polygonlist = geom.split("#");
	if (polygonlist.length>1) {
		for (var i=0;i<polygonlist.length;i++) {
			var pl = polygonlist[i].split(";");
			for (var j=0;j<pl.length;j++) {
				var lon = pl[j].split(",")[0];
				var lat = pl[j].split(",")[1];
				pl[j] = webMercator2Latlng([lon,lat]);
			}
			pointlist.push(pl);
		}
	}else{
		pointlist = geom.split(";");
		for (var i=0;i<pointlist.length;i++) {
			var lon = pointlist[i].split(",")[0];
			var lat = pointlist[i].split(",")[1];
			pointlist[i] = webMercator2Latlng([lon,lat]);
		}
	}
	var text = "";
	var type = window.localStorage.getItem("type");
	if(type=="finish"){
		text = wParseFloat(obj.loss_area).toFixed(1)+"亩/"+wParseFloat(obj.loss_degree).toFixed(1)+"%";
	}else{
		text = wParseFloat(obj.count).toFixed(1)+"亩/"+wParseFloat(obj.loss_area).toFixed(1)+"亩/"+wParseFloat(obj.loss_degree).toFixed(1)+"%";
	}
	var polygon = L.polygon(pointlist,{id:obj.insurance_land_id,
				stroke: true,
	            color: '#000000',
	            weight: 1,
	            degree:wParseFloat(obj.loss_degree).toFixed(1),
	            opacity: 1,
	            text:text,
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#09a51e", //same as color by default
	            fillOpacity: 0.5,
	            clickable: true,
	            landid:obj.insurance_land_id,
	            tarea:wParseFloat(obj.loss_area).toFixed(1),
				area:wParseFloat(obj.count).toFixed(1)});
	if(!drawnItems.hasLayer(polygon)){
		drawnItems.addLayer(polygon);
		onClickEvent();
	}
}
function loadFeatures(lands){
	console.log(lands);
	if (lands&&lands.length>0) {
		for (var i=0;i<lands.length;i++) {
			loadfeature(lands[i]);
		}
		var bounds = cbItems.getBounds();
		var target = map._getBoundsCenterZoom(bounds);
		console.log(target);
        map.setView(target.center, target.zoom);
	}
}
function loadfeature(obj){
	var geom = obj.points;
	var pointlist = [];
	var polygonlist = geom.split("#");
	if (polygonlist.length>1) {
		for (var i=0;i<polygonlist.length;i++) {
			var pl = polygonlist[i].split(";");
			for (var j=0;j<pl.length;j++) {
				var lon = pl[j].split(",")[0];
				var lat = pl[j].split(",")[1];
				pl[j] = webMercator2Latlng([lon,lat]);
			}
			pointlist.push(pl);
		}
	}else{
		pointlist = geom.split(";");
		for (var i=0;i<pointlist.length;i++) {
			var lon = pointlist[i].split(",")[0];
			var lat = pointlist[i].split(",")[1];
			pointlist[i] = webMercator2Latlng([lon,lat]);
		}
	}
	
	var polygon = L.polygon(pointlist,{id:obj.land_serial,
				stroke: true,
	            color: '#000000',
	            weight: 1,
	            opacity: 1,
	            text:wParseFloat(obj.insurance_count).toFixed(1)+"亩",
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#FFFF00", //same as color by default
	            fillOpacity: 0.2,
	            clickable: true,
	            landid:obj.land_serial,
	            tarea:wParseFloat(obj.insurance_count).toFixed(1),
				area:wParseFloat(obj.count).toFixed(1)});
	if(!cbItems.hasLayer(polygon)){
		cbItems.addLayer(polygon);
	}
}
//同步信息到数据库后跳转到新页面(url:跳转地址,flag:是否验证地块为空)
function saveInfoToDataBase(url,flag){
	var insertid=localStorage.getItem("insert_id");
    var mrksStr = getMarkers().length>0?getMarkers():'null';
    var mrksnum = markersList.length;
	var mapinfo = getLandsArea(),
    lands=mapinfo.lands,
    loss_area_total = mapinfo.loss_area_total,
    loss_degree_total = mapinfo.loss_degree_total,
    mcount=mapinfo.lands.length;
    if(flag){
    	if (lands.length==0) {
	  		$(".und_hint").show().html("请选择查勘地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},2000);
	  		return false;
	  	}
    }
    var landsStr=JSON.stringify(lands);
    console.log(landsStr);
    
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
    db.transaction(function(tx){
        //更新数据
        tx.executeSql("UPDATE IsFinishClaim SET lands=?,imgs=?,image_number=?,land_number=?,degree_damage=?,disaster_area=? WHERE id=?",
          [landsStr,mrksStr,mrksnum,mcount,loss_degree_total,loss_area_total,insertid],
          function(tx,results){
            window.location.href=url+"?type=claim";
            sessionStorage.removeItem("del_claim_Imgs");
          },
          function(tx,message) {
            console.log("ERROR: " + message.message);
          });
    })
}


function layerClip(subject,clipper,cliptype,layergroup,type) {
	var subjCoords = subject.getLatLngs();
	var clipCoords = clipper.getLatLngs();

	var subj = coordsToPoints([subjCoords]);
	var clip = coordsToPoints([clipCoords]);

	var solution = ClipperLib.Paths();
	
	var cpr = new ClipperLib.Clipper();

	for(var s = 0, slen = subj.length; s<slen; s++) {
        cpr.AddPaths(subj[s], ClipperLib.PolyType.ptSubject, true);
	}
    for(var c = 0, clen = clip.length; c < clen; c++) {
        cpr.AddPaths(clip[c], ClipperLib.PolyType.ptClip, true);
    }

	cpr.Execute(cliptype, solution);
	
	_solution = L.polygon( pointsToCoords([solution], true) );
	if(type){
		layergroup.removeLayer(subject);
	}
	var area = L.GeometryUtil.geodesicArea(_solution._defaultShape());
	_solution.options.area = wParseFloat(area*0.0015).toFixed(1);
    _solution.options.tarea = wParseFloat(area*0.0015).toFixed(1);
    _solution.options.degree = "0";
    _solution.options.text = _solution.options.area+"亩/"+_solution.options.tarea+"亩/"+parseFloat(_solution.options.degree).toFixed(1)+"%";
    _solution.options.textColor = "#FF0000";
    _solution.options.color = "#000000";
    _solution.options.weight = 1;
	_solution.options.opacity = 1,
	_solution.options.fill = true;
	_solution.options.fillColor="#09a51e"; //same as color by default
	_solution.options.fillOpacity=0.5;
    _solution.options.id = getLandId();
    if(_solution.options.area!=0){
		layergroup.addLayer(_solution);
    }
    map.stop();
	onClickEvent();
}
function pointsToCoords(polygons, latlng) {
	var coords = [], amp = Math.pow(10,13);
    for (var i = 0, ilen = polygons.length; i < ilen; i++) {
//      coords.push([]);
        for (var j = 0, jlen = polygons[i].length; j < jlen; j++) {
            var points = polygons[i][j];
            coords.push([]);
            for (var k = 0, klen = points.length; k < klen; k++) {
                var point = points[k];
                if (latlng) {
                    coords[j].push([point.Y / amp, point.X / amp]);
                } else {
                    coords[j].push([point.X / amp, point.Y / amp]);
                }
            }
        }
	}

	return coords;
}
function coordsToPoints(polygons, latlng) {
	var points = [], amp = Math.pow(10,13);

    for (var i = 0, ilen = polygons.length; i < ilen; i++) {
    	points.push([]);
        for (var j = 0, jlen = polygons[i].length; j < jlen; j++) {
        	var coords = polygons[i][j];
            points[i].push([]);
            for (var k = 0, klen = coords.length; k < klen; k++) {
                var coord = coords[k];
                if (Array.isArray(coord)) {
                    if (latlng) {
                        points[i][j].push({X: Math.round(coord[1] * amp), Y: Math.round(coord[0] * amp)});
                    } else {
                        points[i][j].push({X: Math.round(coord[0] * amp), Y: Math.round(coord[1] * amp)});
                    }
                } else {
                    points[i][j].push({X: Math.round(coord.lng * amp), Y: Math.round(coord.lat * amp)});
                }
            }
        }
    }

	return points;
}
function featureGroupAddLayer(layer){
	var polygons = cbItems.getLayers();
	for (var i=0;i<polygons.length;i++) {
		layerClip(layer,polygons[i],ClipperType.AND,drawnItems);
	}
}
function featureGroupEditLayer(layer){
	var polygons = cbItems.getLayers();
	for (var i=0;i<polygons.length;i++) {
		layerClip(layer,polygons[i],ClipperType.AND,drawnItems,true);
	}
}

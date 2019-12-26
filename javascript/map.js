var isSelect=false,isEditSelect=false,selectedLayer=null,photoObj = {},kindobj={},Location={latitude:0,longitude:0},WaterMark="0b1111111111111111111111";
(function(){
	//mapInit();
	document.addEventListener("deviceready", onDeviceReady, false);
	var type = window.localStorage.getItem("type");
	if(type=="finish"){
		$("#select-control").hide();
		$("#draw-control").hide();
		$("#edit-control").hide();
		$("#xub-control").hide();
	}
	createEvent();
	windowResize();
	//获取水印配置
	getWaterMark();
//	$("#undMapNext").on("click",function(e){
//		var mapinfo = getLandsArea("123");
//		window.localStorage.setItem("mapinfo",JSON.stringify(mapinfo));
//		window.location.href= "./und_payment.html";
//	});
	
}());
function getWaterMark(){
	var paramObj = {city_code:localStorage.getItem("city_code")};
	var dofunc = function(response){
		var obj = response;
		var watermarkers = obj.result;
		WaterMark = watermarkers.ins_watermark;
	};
	AjaxGet('getWaterMark',paramObj,dofunc);
}
function windowResize(){
	var height = $(window).height(),width=$(window).width();
	$(document.body).width(width);
	$(document.body).height(height);
	$("#map").height(height-$(".container header").height());
}
function onDeviceReady(){
	cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
	    console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
	    if (!enabled) {
	    	$("#und_mark4").show();
			$(".mr_cancle4").off("click");
			$(".mr_cancle4").on("click",function(e){
				$("#und_mark4").hide();
				return false;
			})
			$(".mr_sure4").off("click");
			$(".mr_sure4").on("click",function(e){
				$("#und_mark4").hide();
				if (device.platform==="Android") {
					cordova.plugins.diagnostic.switchToLocationSettings();
				}else{
					cordova.plugins.diagnostic.switchToSettings();
				}
				
			});
	    }
	}, function(error){
	    console.error("The following error occurred: "+error);
	});
	L.DomEvent.on(document.getElementById("locate-control"), 'click', function (ev) {
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
			},1500);
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
						addShuiYinCB(imageURI,"../images/iv_shuiyin.png",Location,function(url){
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
					            tx.executeSql("UPDATE IsFinishTable SET url4=?,mpicnum=? WHERE id=?",
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
					addShuiYinCB(imageURI,"../images/iv_shuiyin.png",Location,function(url){
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
				            tx.executeSql("UPDATE IsFinishTable SET url4=?,mpicnum=? WHERE id=?",
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
//    layers: [ydrawnItems]
    });
	   
	
	map.on("layerremove",function(e){
		console.log(e);
		console.log(e.layer);
		if (e.layer._leaflet_id==ydrawnItems._leaflet_id) {
			map.stop();
		}
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
		sessionStorage.setItem("imgs",JSON.stringify(imgsrcs));
		saveInfoToDataBase("./mapimg.html",false);
		//window.location.href = "./mapimg.html";
	});
	markers.on('click', function (a) {
		var imgsrcs = [];
		imgsrcs.push(a.layer.options.url);
		sessionStorage.setItem("imgs",JSON.stringify(imgsrcs));
		saveInfoToDataBase("./mapimg.html",false);
	});
		
	map.addLayer(markers);
	drawnItems = new L.FeatureGroup({zIndex:1});
    map.addLayer(drawnItems);
	locationItems = new L.FeatureGroup({zIndex:1});
    map.addLayer(locationItems);
	mergeItems = new L.LayerGroup({zIndex:2});
	
    map.on('draw:created', function (e) {
        var type = e.layerType,
        layer = e.layer;
        if (type=='polygon') {
        	layer.options.area = wParseFloat(polygonDrawer._area*0.0015).toFixed(1);
            layer.options.tarea = wParseFloat(polygonDrawer._area*0.0015).toFixed(1);
            layer.options.text = layer.options.area+"亩/"+layer.options.tarea+"亩";
            layer.options.textColor = "#FF0000";
            layer.options.id = getLandId();
            if(layer.options.area!=0){
            	drawnItems.addLayer(layer);
            }else{
            	$(".und_hint").show().html("绘图面积为0,请重新绘制！");
            	setTimeout(function(){
    				$(".und_hint").hide();
    			},1500);
            }
            updateArea();
        }else if (type=='polyline') {
        	var polygon = getPoints(selectedLayer._latlngs),
        	path = getLinePoints(layer._latlngs),
        	user_id = window.localStorage.getItem("user_id");
        	var land_obj = {polygon:polygon,path:path,user_id:user_id};
        	drawnItems.removeLayer(selectedLayer);
        	map.stop();
        	cutFeature(land_obj);
        }
        
    });
    
    map.on('draw:editvertex', function (e) {
        var layer = e.poly;
        var area = L.GeometryUtil.geodesicArea(layer._defaultShape());
		layer.options.area = wParseFloat(area*0.0015).toFixed(1);
		layer.options.tarea = wParseFloat(area*0.0015).toFixed(1);
		layer.options.text = layer.options.area+" 亩/"+layer.options.tarea+" 亩";
		map.stop();
		updateArea();
    });
	var polygon_options = {
        showArea: true,
        allowIntersection:false,
        shapeOptions: {
            stroke: true,
            color: '#87166a',
            weight: 1,
            opacity: 1,
            fill: true,
            fillColor: "#FFFF00", //same as color by default
            fillOpacity: 0.2,
            clickable: true
        }
    }
	var polyline_options={
		allowIntersection: false,
		repeatMode: false,
		shapeOptions: {
			stroke: true,
			color: '#87166a',
			weight: 1,
			opacity: 0.5,
			fill: false,
			clickable: false
		},
		metric: false, // Whether to use the metric measurement system or imperial
		feet: false, // When not metric, to use feet instead of yards for display.
		nautic: false, // When not metric, not feet use nautic mile for display
		showLength: false, // Whether to display distance in the tooltip
		zIndexOffset: 2000, // This should be > than the highest z-index any map layers
		factor: 0, // To change distance calculation
		maxPoints: 0 // Once this number of points are placed, finish shape
	}
	polygonDrawer = new L.Draw.Polygon(map, polygon_options);
	polylineDrawer = new L.Draw.Polyline(map, polyline_options);
    watchPosition();
	map.on("click",function(e){
		var latlng = e.latlng;
		var lonlat = latLng2WebMercator(latlng);
		if(isSelect){
			getStandardLand(lonlat);
		}
	});
	map.on("moveend",onMoveend);
	showMapInfo();
    getCurrentHeading();
	var uid = window.localStorage.getItem("user_id"),
	code = window.localStorage.getItem("city_code"),
	paramObj = {user_id:uid,city:code},
	dofunc = function(response) {
		if(response.result) {
			basemaps = {};
			overlays = {};
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
		baseLayers = {
			"电子地图": basemaps.DMapLayer,
		    "卫星影像": basemaps.EleMapLayer
		};
		overlayers = {
		    "地块数据": overlays.landLayer,
		    "村界线": overlays.borderLayer,
		    "采集地块":ydrawnItems
		};
		map._addLayers([basemaps.EleMapLayer,overlays.borderLayer,overlays.landLayer,ydrawnItems]);
		L.control.layers(baseLayers, overlayers,{collapsed:false}).addTo(map);
		var extent = [wParseFloat(obj.x_min),wParseFloat(obj.y_min),wParseFloat(obj.x_max),wParseFloat(obj.y_max)];
        var bounds = extent2Bounds(extent);
        map.setMaxBounds(bounds);
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
	if(!ydrawnItems.hasLayer(polygon)&&!drawnItems.hasLayer(polygon)){
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
function cutFeature(lands_obj){
	var paramObj = lands_obj;
	var dofunc = function(response){
		var result = response.result;
		drawFeatures(result);
	};
	AjaxPost('polygonSplit',paramObj,dofunc);
}
function mergeFeature(lands_obj){
	var paramObj = lands_obj;
	var dofunc = function(response){
		var result = response.result
		var obj = {polygons:result.geoms};
		removeOldFeatures();
		drawFeatures(obj);
	};
	AjaxPost('polygonUnion',paramObj,dofunc);
}
function getStandardLand(lonlat){
	var paramObj = {longitude:lonlat[0],latitude:lonlat[1],device:'app'};
	var dofunc = function(response){
		if(response.count>0){
    		var obj = response.result;
    		featureSelected(obj);
    	}
	};
	AjaxGet('getStandardLand',paramObj,dofunc);
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

function createEvent(){
	L.DomEvent.on(document.getElementById("layer-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings(":not(#xub-control)").removeClass("selected").addClass("unselected");
			$(".leaflet-control-layers").show();
			$(".edit-button-list").hide();
			$("#draw-toolbar").hide();
			polygonDrawer.disable();
			polylineDrawer.disable();
			if (selectedLayer) {
				selectedLayer.editing.disable();
			}
			offMultiSelectEvent();
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
			$(this).siblings(":not(#xub-control)").removeClass("selected").addClass("unselected");
			$(".leaflet-control-layers").hide();
			$(".edit-button-list").hide();
			$("#draw-toolbar").hide();
			polygonDrawer.disable();
			polylineDrawer.disable();
			if (selectedLayer) {
				selectedLayer.editing.disable();
			}
			offMultiSelectEvent();
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
			$(this).siblings(":not(#xub-control)").removeClass("selected").addClass("unselected");
			$("#draw-toolbar").show();
			$(".edit-button-list").hide();
			polylineDrawer.disable();
			polygonDrawer.enable();
			if (selectedLayer) {
				selectedLayer.editing.disable();
			}
			$(".leaflet-control-layers").hide();
			offMultiSelectEvent();
			offSelectControl();
			offSelectEvent();
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
			$(this).siblings(":not(#xub-control)").removeClass("selected").addClass("unselected");
			$(".edit-button-list").show();
			polygonDrawer.disable();
			polylineDrawer.disable();
			$(".leaflet-control-layers").hide();
			offMultiSelectEvent();
			offSelectControl();
			onSelectEvent();
			isEditSelect = true;
			$("#draw-toolbar").hide();
		}else{
			if (selectedLayer) {
				selectedLayer.editing.disable();
			}
			offMultiSelectEvent();
			offSelectEvent();
			isEditSelect = false;
			$(this).removeClass("selected").addClass("unselected");
			$(".edit-button-list").hide();
			$(".edit-button-list").find(".selected").removeClass("selected").addClass("unselected");
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("xub-control"), 'click', function (ev) {
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(".edit-button-list").hide();
			$(".search-button").show();
			polygonDrawer.disable();
			polylineDrawer.disable();
			$(".leaflet-control-layers").hide();
			offMultiSelectEvent();
			offSelectControl();
			offSelectEvent();
			$("#draw-toolbar").hide();
		}else{
			$(this).removeClass("selected").addClass("unselected");
			$(".search-button").hide();
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
			updateArea();
			map.stop();
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}
	});
	L.DomEvent.on(document.getElementById("edit"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#edit')").hasClass("selected"))return
		if (selectedLayer) {
			if($(this).hasClass("unselected")){
				$(this).removeClass("unselected").addClass("selected");
				$(this).siblings().removeClass("selected").addClass("unselected");
				selectedLayer.editing.enable();
			}else{
				selectedLayer.editing.disable();
				$(this).removeClass("selected").addClass("unselected");
			}
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	
	L.DomEvent.on(document.getElementById("clip"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#clip')").hasClass("selected"))return
		if (selectedLayer) {
			if($(this).hasClass("unselected")){
				$(this).removeClass("unselected").addClass("selected");
				$(this).siblings().removeClass("selected").addClass("unselected");
				polylineDrawer.enable();
				isEditSelect = false;
			}else{
				polylineDrawer.completeShape();
				isEditSelect = true;
				$(this).removeClass("selected").addClass("unselected");
			}
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("merge"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#merge')").hasClass("selected"))return
		if($(this).hasClass("unselected")){
			$(this).removeClass("unselected").addClass("selected");
			$(this).siblings().removeClass("selected").addClass("unselected");
			offMultiSelectEvent();
			offSelectEvent();
			onMultiSelectEvent();
		}else{
			if (mergeItems.getLayers().length==0) {
				$(".und_hint").show().html("请选择需要合并的地块");
				setTimeout(function(){
					$(".und_hint").hide();
				},1500);
			}else{
				var user_id = window.localStorage.getItem("user_id"),
				polygons = getMergePolyGons(),
				land_obj = {user_id:user_id,polygons:polygons};
				mergeFeature(land_obj);
				$(this).removeClass("selected").addClass("unselected");
			}
			
		}
    	L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("mj"), 'click', function (ev) {
		if($(".edit-button-list").find("span:not('#mj')").hasClass("selected"))return;
		if (selectedLayer) {
			$("#info-panel").show();
			$("input[name=tb-area]").val("");
			$("input[name=tb-area]").attr("placeholder",selectedLayer.options.tarea);
		}else{
			$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}
		L.DomEvent.stopPropagation(ev);
    	L.DomEvent.preventDefault(ev);
	});
	L.DomEvent.on(document.getElementById("info-ok"), 'click',function(ev){
		var area = $("input[name=tb-area]").val();
		if(isNaN(parseFloat(area))){
			$(".und_hint").show().html("请输入正确的数字");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}else if(wParseFloat(area)>wParseFloat(selectedLayer.options.area)){
			$(".und_hint").show().html("投保面积不能大于地块面积");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}else if(wParseFloat(selectedLayer.options.area)-wParseFloat(parseFloat(area).toFixed(1))>wParseFloat(selectedLayer.options.area)*0.2 ){
			$(".und_hint").show().html("投保面积与地块面积相差不能超过地块面积的20%");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
		}else{
			selectedLayer.options.tarea = parseFloat(area).toFixed(1);
			selectedLayer.options.text = selectedLayer.options.area+" 亩/"+selectedLayer.options.tarea+" 亩";
			map.stop();
			updateArea();
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
	$("input[name=searchWord]").on("input",function(e){
		var words = $(this).val(),
		myReg = /^[\u4e00-\u9fa5]+$/;
		if (words.length>=2 && myReg.test(words)) {
			var data={
				city_code:localStorage.getItem("city_code"),
				type:"2",
				name:words
			};
			var func=function(data){
				console.log(data);
				if(data.result!=null){
					var nameIdContent="",
						name,id_number,bank_card,bank_name,subbank_name,subbank_id,phone_num;
						for (var i=0;i<data.result.length;i++) {
							nameIdContent+='<li name="'+data.result[i].farmer_id+'" type="'+data.result[i].type+'"><div><span class="li_name">'+data.result[i].name+'</span></div>'+
										'<div><span >'+plusXing(data.result[i].id_number,10,4)+'</span>&nbsp;&nbsp;<span>'+getInfoTypeText(data.result[i].type)+'</span></div></li>';
						}
					$(".search-result-list").html(nameIdContent).show();
					$(".search-result-list>li").click(function(){
						var fid = $(this).attr("name");
						$(".search-result-list").hide();
						showFeature(fid);
					})
				}else{
					$(".name_id_p").hide();
				}
			}
			AjaxGet("searchFarmerByName",data,func);
		}else if(words.length<2){
			$(".name_id_p").hide();
		}
	});
}
function showFeature(farmer_id){
	var paramObj = {farmer_id:farmer_id,city_code:localStorage.getItem("city_code"),type:"3"};
	var dofunc = function(response){
		var obj = response;
		var lands = obj.result;
		if (lands) {
			for (var i=0;i<lands.length;i++) {
				loadLSfeature(lands[i]);
			}
		}
	};
	AjaxGet('getAppFarmerInfo',paramObj,dofunc);
}
function loadLSfeature(obj){
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
	
	var polygon = L.polygon(pointlist,{id:obj.land_serial,
				stroke: true,
	            color: '#87166a',
	            weight: 1,
	            opacity: 1,
	            text:wParseFloat(obj.area).toFixed(1)+"亩/"+wParseFloat(obj.insurance_count).toFixed(1)+"亩",
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#FFFF00", //same as color by default
	            fillOpacity: 0.2,
	            clickable: true,
				area:wParseFloat(obj.area).toFixed(1),
				tarea:wParseFloat(obj.insurance_count).toFixed(1)});
	polygon._leaflet_id = obj.land_serial;
	if(!drawnItems.hasLayer(polygon)){
		drawnItems.addLayer(polygon);
		updateArea();
	}
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
				layers.options.fillColor = "#FFFF00";
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
		layer.options.fillColor = "#FFFF00";
		layer.redraw();
		layer.off("click");
	});
	mergeItems.clearLayers();
}
function onSelectEvent(){
	drawnItems.eachLayer(function(layer){
		layer.on("click",function(e){
			if (isEditSelect) {
				var layers = e.target;
				if (layers.options.fillColor == "#FBF8F6") {
					selectedLayer = null;
					layers.options.fillColor = "#FFFF00";
				}else{
					drawnItems.eachLayer(function(layer){
						layer.options.fillColor = "#FFFF00";
						selectedLayer = null;
						layer.redraw();
					});
					layers.options.fillColor = "#FBF8F6";
					selectedLayer = layers;
				}
				layers.redraw();
			}
		});
	});
}
function offSelectEvent(){
	drawnItems.eachLayer(function(layer){
		layer.options.fillColor = "#FFFF00";
		selectedLayer = null;
		layer.redraw();
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
				color: '#87166a',
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
				console.log("1");
				drawnItems.addLayer(polygon);
				updateArea();
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
	            color: '#87166a',
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
		updateArea();
	}
}
function getLandsArea(farmer){
	var area = 0;
	var tarea = 0;
	var layers = drawnItems.getLayers();
	var lands = [];
	for (var i=0;i<layers.length;i++) {
		area += parseFloat(wParseFloat(layers[i].options.area).toFixed(1));
		tarea += parseFloat(wParseFloat(layers[i].options.tarea).toFixed(1));
		var obj = {};
		obj.points = getPoints(layers[i]._latlngs);
		obj.count = layers[i].options.area;
		obj.farmer = farmer;
		obj.land_serial = layers[i].options.id;
		obj.insurance_count = layers[i].options.tarea;
		obj.unit = "亩";
		lands.push(obj);
	}
	return {area:wParseFloat(area).toFixed(1),tarea:wParseFloat(tarea).toFixed(1),lands:lands};
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
            tx.executeSql("UPDATE IsFinishTable SET url4=?,mpicnum=? WHERE id=?",
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
	var insertid=localStorage.getItem("insertid");
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM IsFinishTable WHERE id="' + insertid + '"', [], function(tx, results) {
			var rows = results.rows;
			photoObj.farmer = rows.item(0).insurant;
			photoObj.id_number = rows.item(0).idnumber;
			photoObj.type = rows.item(0).paperid;
			photoObj.xztype = rows.item(0).labelname;
			photoObj.checkname = localStorage.getItem("name");
			photoObj.address = rows.item(0).plantvillage;
			localStorage.setItem("potoObj",JSON.stringify(photoObj) );
			var lands = JSON.parse(rows.item(0).landsArr);
			loadFeatures(lands);
			if (rows.item(0).url4!='null') {
				var imgs = JSON.parse(rows.item(0).url4);
				console.log(imgs);
				loadMarkers(imgs);
			}
		})
	});
}
function loadMarkers(imgs){
	var delImg =sessionStorage.getItem("delImgs")!=null?JSON.parse(sessionStorage.getItem("delImgs")):[];
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
function loadFeatures(lands){
	console.log(lands);
	if (lands) {
		for (var i=0;i<lands.length;i++) {
			loadfeature(lands[i]);
		}
		var bounds = drawnItems.getBounds();
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
	            color: '#87166a',
	            weight: 1,
	            opacity: 1,
	            text:wParseFloat(obj.count).toFixed(1)+"亩/"+wParseFloat(obj.insurance_count).toFixed(1)+"亩",
	            textColor:"#FF0000",
	            fill: true,
	            fillColor: "#FFFF00", //same as color by default
	            fillOpacity: 0.2,
	            clickable: true,
				area:wParseFloat(obj.count).toFixed(1),
				tarea:wParseFloat(obj.insurance_count).toFixed(1)});
	polygon._leaflet_id = obj.land_serial;
	if(!drawnItems.hasLayer(polygon)){
		drawnItems.addLayer(polygon);
		updateArea();
	}
}
//同步信息到数据库后跳转到新页面(url:跳转地址,flag:是否验证地块为空)
function saveInfoToDataBase(url,flag){
	var farmer=localStorage.getItem("farmer"),
    insertid=localStorage.getItem("insertid");
    var mrksStr = getMarkers().length>0?getMarkers():'null';
    var mrksnum = markersList.length;
	var mapinfo = getLandsArea(farmer),
    area=mapinfo.area,
    tarea=mapinfo.tarea,
    lands=mapinfo.lands,
    mcount=lands.length,
    lansArr=[];
    if(flag){
    	if (lands.length==0) {
	  		$(".und_hint").show().html("请选择地块");
			setTimeout(function(){
				$(".und_hint").hide();
			},1500);
	  		return false;
	  	}
    }
    window.localStorage.setItem("mapinfo",JSON.stringify(mapinfo));
    $.each(lands,function(i,item){
        lansArr.push(item);
        land_serial=item.land_serial;
        points=item.points;
    })
    var landsStr=JSON.stringify(lansArr);
    //console.log(landsStr);
    var type = localStorage.getItem("type")
    var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
	db.transaction(function(tx){
    	//更新数据
        tx.executeSql("UPDATE IsFinishTable SET area=?,tarea=?,mcount=?,landsArr=?,url4=?,mpicnum=? WHERE id=?",
          [area,tarea,mcount,landsStr,mrksStr,mrksnum,insertid],
          function(tx,results){
            window.location.href=url+"?type=cb";
            sessionStorage.removeItem("delImgs");
          },
          function(tx,message) {
            console.log("ERROR: " + message.message);
          });
    })
    
}



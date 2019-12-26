var Kindist=[];
document.addEventListener("deviceready", onDeviceReadys, false);
/*计算公式*/
function reckon(){
	//单位保险费计算
	var und_tri_span2=parseFloat($(".und_tri_span2").text()),
		und_tri_span4=parseFloat($(".und_tri_span4").text())/100,
		unit_insurance=(und_tri_span2*und_tri_span4).toFixed(1);
		console.log(unit_insurance)
	$(".unit_insurance").html(unit_insurance+"元");

	//总保险费计算
	var zarea=parseFloat($(".und_tri_span5").text()),
		gross_premium=(unit_insurance*zarea).toFixed(1);
	$(".gross_premium").html(gross_premium+"元");

	//农户自缴保险费计算
	var und_tri_span3=parseFloat($(".und_tri_span3").text())/100,
		farmer_payment=(gross_premium*und_tri_span3).toFixed(1);
	$(".farmer_payment").html(farmer_payment+"元");
}
/*附加险计算公式*/
function reckonFJX(el){
	//单位保险费计算
	var fjx_und_tri_span1=parseFloat(el.find(".fjx_und_tri_span1").text()),
		fjx_und_tri_span2=parseFloat(el.find(".fjx_und_tri_span2").text())/100,
		dwbxf=(fjx_und_tri_span1*fjx_und_tri_span2).toFixed(1);
	el.find(".dwbxf").html(dwbxf+"元");

	//总保险费计算
	var zarea=parseFloat(el.find(".bxnum").text()),
		zbxf=(dwbxf*zarea).toFixed(1);
	el.find(".zbxf").html(zbxf+"元");

	//农户自缴保险费计算
	var fjx_und_tri_span3=parseFloat(el.find(".fjx_und_tri_span3").text())/100,
		nhzjbxf=(zbxf*fjx_und_tri_span3).toFixed(1);
	el.find(".nhzjbxf").html(nhzjbxf+"元");
}
function onDeviceReadys(){
	var type = window.localStorage.getItem("type");
	if(type=='finish'){
		$("#addFJX").hide();
	}
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    }),
	insertid=localStorage.getItem("insertid");
	//获取已有数据
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM IsFinishTable WHERE id="'+insertid+'"', [], function (tx, results) {
            var item=results.rows.item(0);
            console.log(item);
			if(item.unitinsurance=="null"){
				$(".und_tri_span1").html(item.area);
				$(".und_tri_span5").html(item.tarea);
				$(".undOl_select2").text(item.labelname!="null"?item.labelname:"请选择标的名称");
				$(".undOl_select2").attr("kindid",item.kindid!="null"?item.kindid:"");
				loadKindList($(".undOl_select2").attr("kindid"));
			}else{
				$(".und_tri_span1").text(item.area);
                $(".und_tri_span5").html(item.tarea);
                $(".undOl_select2").text(item.labelname!="null"?item.labelname:"请选择标的名称");
            	$(".undOl_select2").attr("kindid",item.kindid!="null"?item.kindid:"");
				$(".und_tri_span2").text(item.unitinsurance+"元");
				$(".und_tri_span3").text(item.insurancepay+"%");
				$(".und_tri_span4").text(item.premiumrate+"%");
				$(".unit_insurance").text(item.unitinsurance+"元");
				$(".gross_premium").text(item.grosspremium+"元");
				$(".farmer_payment").text(item.farmarinsurance+"元");
				$("#start_date").text(item.start_date);
				$("#end_date").text(item.end_date);
				$(".remark").text(item.remark);
				loadKindList($(".undOl_select2").attr("kindid"),true);
			}
			if (item.add_insurance!='null') {
				var fjx = JSON.parse(item.add_insurance);
				for (var i=0;i<fjx.length;i++) {
					createFJX(fjx[i]);
				}
			}
			
        })
    })

    
	var type = window.localStorage.getItem("type");
	console.log(type)
	if(type!="finish"){
		//点击下拉框
		$(".und_pay_ol").children('li').click(function(){
			$(".und_tri_ul").hide();
			$('.fjx_undOl_select1_list2').hide();
			$(this).children(".und_tri_ul").toggle();
			kongbai(".und_tri_ul");
			$(".und_tri_ul1 li").click(function(){
				console.log($(this).text())
				$(".und_tri_span2").html($(this).text());
				reckon();
				$('.und_tri_ul').hide()
				return false;
			})
			$(".und_tri_ul2 li").click(function(){
				$(".und_tri_span3").html($(this).text());
				reckon();
				$('.und_tri_ul').hide()
				return false;
			})
			$(".und_tri_ul3 li").click(function(){
				$(".und_tri_span4").html($(this).text());
				reckon();
				$('.und_tri_ul').hide();
				return false;
			})
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
			}
		});
		var end = new datePicker();
		end.init({
			'trigger': '#end_date', /*按钮选择器，用于触发弹出插件*/
			'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
			'minDate':'1900-1-1',/*最小日期*/
			'maxDate':'2100-12-31',/*最大日期*/
			'onSubmit':function(){/*确认时触发事件*/
				var theSelectData=end.value;
			},
			'onClose':function(){/*取消时触发事件*/
			}
		});
	}

    $(".ud_back").click(function(){
       savePayInfo("./und_massif.html");
    })  
	$("#addFJX").on("click",function(e){
		createFJX();
	});
	/*点击下一步保存数据到本地*/
	$("#und_paynext").click(function(){ 
        savePayInfo("./und_infoPerview.html");
	})
}
function createFJX(data){
	var el = $("#addFJX").parent();
	var xz = $(".undOl_select2").text();
	var xzid = $(".undOl_select2").attr("kindid");
	var txt = "";
	txt = '<div class="fjxbox">'+
		'<div class="header"><b class="text">附加险种-'+xz+'</b>'+
			'<span class="btn-close">'+
			'</span>'+
		'</div>'+
		'<li class="fjx_undOl_li2">'+
			'<label>标的名称</label>'+
			'<span class="undOl_select fjx_undOl_select2" kindid="'+$(".undOl_select2").attr("kindid")+'" >'+$(".undOl_select2").text()+'</span>'+
			'<i class="und_triangle"></i>'+
			'<ul class="undOl_select1_list fjx_undOl_select1_list2">';
	txt+='<li>请选择标的名称</li>';
	for(var i=0;i<Kindist.length;i++){
		txt+='<li ol_id="'+Kindist[i].id+'" fee_percentage="'+Kindist[i].fee_percentage+'" unit_fee="'+Kindist[i].unit_fee+'"  self_per="'+Kindist[i].self_per+'">'+Kindist[i].name+'</li>';
	}		
		txt+='</ul>'+
		'</li>'+
		'<li>'+
			'<label>单位保额</label>'+
			'<span class="fjx_und_tri_span1" >'+$(".und_tri_span2").text()+'</span>'+
			'<i class="und_triangle"></i>'+
			'<ul class="und_tri_ul fjx_und_tri_ul1"></ul>'+
		'</li>'+
		'<li>'+
			'<label>保险费率</label>'+
			'<span class="fjx_und_tri_span2">'+$(".und_tri_span4").text()+'</span>'+
			'<i class="und_triangle"></i>'+
			'<ul class="und_tri_ul fjx_und_tri_ul2"></ul>'+
		'</li>'+
		'<li>'+
			'<label>保费自缴比例</label>'+
			'<span class="fjx_und_tri_span3">'+$(".und_tri_span3").text()+'</span>'+
			'<i class="und_triangle"></i>'+
			'<ul class="und_tri_ul fjx_und_tri_ul3"></ul>'+
		'</li>'+
		'<li>'+
			'<label>单位保险费</label>'+
			'<span class="dwbxf">'+$(".unit_insurance").text()+'</span>'+
		'</li>'+
		'<li>'+
			'<label>保险数量</label>'+
			'<span class="bxnum">'+$(".und_tri_span5").text()+'</span><i style="font-size: 0.12rem;">亩</i>'+
		'</li>'+
		'<li>'+
			'<label>总保险费</label>'+
			'<span class="zbxf">'+$(".gross_premium").text()+'</span>'+
		'</li>'+
		'<li>'+
			'<label>农户自缴保险费</label>'+
			'<span class="nhzjbxf">'+$(".farmer_payment").text()+'</span>'+
		'</li>'+
		'<li class="txtarea_li">'+
			'<label>备　注</label>'+
			'<textarea cols="30" rows="3" maxlength="100" placeholder="最多100个字" class="fjx_remark">'+$(".remark").val()+'</textarea>'+
		'</li>'+
	'</div>';
	el.before(txt);
	var div = el.prev();
	if(data){
		div.find(".header").children(".text").text("附加险种-"+data.kind);
		div.find(".fjx_undOl_select2").text(data.kind);
		div.find(".fjx_undOl_select2").attr("kindid",data.kind_id);
		div.find(".fjx_und_tri_span1").text(data.unit_fee+"元");
		div.find(".fjx_und_tri_span2").text(data.fee_percentage+"%");
		div.find(".fjx_und_tri_span3").text(data.self_per+"%");
		div.find(".dwbxf").text(parseFloat(parseFloat(data.unit_fee)*parseFloat(data.fee_percentage)/100).toFixed(2));
		div.find(".bxnum").text(data.count);
		div.find(".zbxf").text(data.total_expenses+"元");
		div.find(".nhzjbxf").text(data.expenses_farmer+"元");
		div.find(".fjx_remark").val(data.remark);
	}
	var type = window.localStorage.getItem("type");
	if (type!="finish") {
	 	var fee_percentage=localStorage.getItem("fee_percentage").split(','),
		unit_fee=localStorage.getItem("unit_fee").split(','),
		self_per=localStorage.getItem("self_per").split(','),
		fep="",
		ufe="",
		sep="";
		//保险费率
		$.each(fee_percentage,function (i,item) {
			fep+='<li>'+item+'%</li>';
		})
		div.find(".fjx_und_tri_ul2").html(fep);
	
		//单位保险金额
		$.each(unit_fee,function (i,item) {
			ufe+='<li>'+item+'元</li>';
		})
		div.find(".fjx_und_tri_ul1").html(ufe);
		//保费自缴比例
		$.each(self_per,function (i,item) {
			sep+='<li>'+item+'%</li>';
		})
		div.find(".fjx_und_tri_ul3").html(sep);
		div.children("li").off("click");
		div.children("li").on("click",function(){
			$(".und_tri_ul").hide();
			$(this).children(".und_tri_ul").toggle();
			$(this).siblings().children(".und_tri_ul").hide();
		})
		div.find(".fjx_und_tri_ul1 li").off("click");
		div.find(".fjx_und_tri_ul1 li").on("click",function(){
			$(this).parent().parent().find('.fjx_und_tri_span1').text($(this).text());
			reckonFJX($(this).parent().parent().parent());
			$('.und_tri_ul').hide();
			return false;
		})
		div.find(".fjx_und_tri_ul2 li").off("click");
		div.find(".fjx_und_tri_ul2 li").on("click",function(){
			$(this).parent().parent().find('.fjx_und_tri_span2').text($(this).text());
			reckonFJX($(this).parent().parent().parent());
			$('.und_tri_ul').hide();
			return false;
		})
		div.find(".fjx_und_tri_ul3 li").off("click");
		div.find(".fjx_und_tri_ul3 li").on("click",function(){
			$(this).parent().parent().find('.fjx_und_tri_span3').text($(this).text());
			reckonFJX($(this).parent().parent().parent());
			$('.und_tri_ul').hide();
			return false;
		})
		div.find(".fjx_undOl_li2").off("click");
		div.find(".fjx_undOl_li2").on("click",function(event){
			// $(".undOl_select1_list").hide();
			var txt = "";
			txt+='<li>请选择标的名称</li>';
			for(var i=0;i<Kindist.length;i++){
				txt+='<li ol_id="'+Kindist[i].id+'" fee_percentage="'+Kindist[i].fee_percentage+'" unit_fee="'+Kindist[i].unit_fee+'"  self_per="'+Kindist[i].self_per+'">'+Kindist[i].name+'</li>';
			}
			var elem = $(this).find(".fjx_undOl_select1_list2").html(txt);
	        $(this).find(".undOl_select1_list").toggle();
			$('.und_tri_ul').hide();
			var el = $(this);
			el.find(".fjx_undOl_select1_list2 li").off("click");
			el.find(".fjx_undOl_select1_list2 li").on("click",function(){
				var liText=$(this).text(),
					fee_percentage=$(this).attr("fee_percentage"),
					start = $(this).attr("start"),
					end = $(this).attr("end"),
					kind_id=$(this).attr("ol_id"),
					unit_fee=$(this).attr("unit_fee"),
					self_per=$(this).attr("self_per");
				$(this).parent(".undOl_select1_list").siblings(".fjx_undOl_select2").html(liText);
				$(this).parent(".undOl_select1_list").siblings(".fjx_undOl_select2").attr("kindid",kind_id);
				$(this).parents(".fjxbox").find(".header").children(".text").text("附加险种-"+liText);
				console.log(fee_percentage)
				var fee_percentage=fee_percentage.split(','),
				unit_fee=unit_fee.split(','),
				self_per=self_per.split(','),
				fep="",
				ufe="",
				sep="";
				//保险费率
				$.each(fee_percentage,function (i,item) {
					fep+='<li>'+item+'%</li>';
				})
				var elem = $(this).parent().parent().parent();
				elem.find(".fjx_und_tri_ul2").html(fep);
			
				//单位保险金额
				$.each(unit_fee,function (i,item) {
					ufe+='<li>'+item+'元</li>';
				})
				elem.find(".fjx_und_tri_ul1").html(ufe);
				//保费自缴比例
				$.each(self_per,function (i,item) {
					sep+='<li>'+item+'%</li>';
				})
				elem.find(".fjx_und_tri_ul3").html(sep);
				elem.find(".fjx_und_tri_span1").text(elem.find(".fjx_und_tri_ul1 >li:first").text());	
				elem.find(".fjx_und_tri_span2").text(elem.find(".fjx_und_tri_ul2 >li:first").text());
				elem.find(".fjx_und_tri_span3").text(elem.find(".fjx_und_tri_ul3 >li:first").text());
				reckonFJX(elem);
				elem.children("li").off("click");
				elem.children("li").on("click",function(){
					$(".und_tri_ul").hide();
					$(this).children(".und_tri_ul").toggle();
					$(this).siblings().children(".und_tri_ul").hide();
				})
				elem.find(".fjx_und_tri_ul1 li").off("click");
				elem.find(".fjx_und_tri_ul1 li").on("click",function(){
					$(this).parent().parent().find('.fjx_und_tri_span1').text($(this).text());
					reckonFJX($(this).parent().parent().parent());
					$('.und_tri_ul').hide();
					return false;
				})
				elem.find(".fjx_und_tri_ul2 li").off("click");
				elem.find(".fjx_und_tri_ul2 li").on("click",function(){
					$(this).parent().parent().find('.fjx_und_tri_span2').text($(this).text());
					reckonFJX($(this).parent().parent().parent());
					$('.und_tri_ul').hide();
					return false;
				})
				elem.find(".fjx_und_tri_ul3 li").off("click");
				elem.find(".fjx_und_tri_ul3 li").on("click",function(){
					$(this).parent().parent().find('.fjx_und_tri_span3').text($(this).text());
					reckonFJX($(this).parent().parent().parent());
					$('.und_tri_ul').hide();
					return false;
				})
				elem.find(".fjx_undOl_li2").off("click");
				elem.find(".fjx_undOl_li2").on("click",function(event){
					$('.und_tri_ul').hide();
					$(this).find(".undOl_select1_list").toggle();
					kongbai(".fjx_undOl_select1_list2");
					return false;
				})
				elem.find(".btn-close").off("click");
				$(".fjxbox").find(".btn-close").on("click",function(e){
					$(this).parents(".fjxbox").remove();
				});
			})
			return false;
		})
		div.find(".btn-close").off("click");
		$(".fjxbox").find(".btn-close").on("click",function(e){
			$(this).parents(".fjxbox").remove();
		});
	//	el.before(txt);
		
	}
}
function savePayInfo(tourl){
	var insertid=localStorage.getItem("insertid"),
		und_tri_span2=$(".und_tri_span2").text(),
		und_tri_span3=$(".und_tri_span3").text(),
		und_tri_span4=$(".und_tri_span4").text(),
		und_tri_span5=$(".und_tri_span5").text(),
		unit_insurance=$(".unit_insurance").text(),
		gross_premium=$(".gross_premium").text(),
		farmer_payment=$(".farmer_payment").text(),
		labelname=$(".undOl_select2").text(),
		start = $("#start_date").text(),
		end = $("#end_date").text(),
		kind_id=$('.undOl_select2').attr("kindid"),
		remark=$(".remark").val();
	//console.log(remark);
	//添加附加险
	var total_insured_account=0;
	var total_farmer_expenses = 0;
	var total_kind_expenses = 0;
	var add_insurance = $(".fjxbox").map(function(){
		var obj = $(this); 
		return {
	            kind_id:obj.find(".fjx_undOl_select2").attr("kindid"),
	            kind:obj.find(".fjx_undOl_select2").text(),
	            unit_fee:parseFloat(obj.find(".fjx_und_tri_span1").text()).toFixed(2),
	            fee_percentage:parseFloat(obj.find(".fjx_und_tri_span2").text()).toString(),
	            self_per:parseFloat(obj.find(".fjx_und_tri_span3").text()).toString(),
	            count:obj.find(".bxnum").text(),
	            total_expenses:parseFloat(obj.find(".zbxf").text()).toFixed(2),
	            expenses_farmer:parseFloat(obj.find(".nhzjbxf").text()).toFixed(2),
	            remark:obj.find(".fjx_remark").val()
	        };
	}).get();
	add_insurance = JSON.stringify(add_insurance);
	total_insured_account = wParseFloat(eval($(".fjxbox").map(function(){var obj = $(this); return parseFloat(obj.find(".fjx_und_tri_span1").text());}).get().join("+").toString())).toFixed(2);
	total_farmer_expenses = wParseFloat(eval($(".fjxbox").map(function(){var obj = $(this); return parseFloat(obj.find(".nhzjbxf").text());}).get().join("+").toString())).toFixed(2);
	total_kind_expenses = wParseFloat(eval($(".fjxbox").map(function(){var obj = $(this); return parseFloat(obj.find(".zbxf").text());}).get().join("+").toString())).toFixed(2);
	var all_insured_account = ((wParseFloat(und_tri_span2)+wParseFloat(total_insured_account))*wParseFloat(und_tri_span5)).toFixed(2);
	var all_total_expenses = (wParseFloat(gross_premium)+wParseFloat(total_kind_expenses)).toFixed(2);
	var all_expenses_farmer = (wParseFloat(farmer_payment)+wParseFloat(total_farmer_expenses)).toFixed(2);
	var db = window.sqlitePlugin.openDatabase({
        name:'myDatabase.db',
        location: 'default'
    });
	db.transaction(function(tx){
		//更新数据
		tx.executeSql("UPDATE IsFinishTable SET labelname=?,kindid=?,unitinsurance=?, insurancepay=?, premiumrate=?, unitpremium=?, grosspremium=?, farmarinsurance=?, remark=?,start_date=?,end_date=?,add_insurance=?,all_insured_account=?,all_total_expenses=?,all_expenses_farmer=? WHERE id=?", [labelname,kind_id,parseFloat(und_tri_span2)||'null',und_tri_span3.replace(/%/,""),parseFloat(und_tri_span4),parseFloat(unit_insurance),gross_premium.replace(/[^\d.]/g,''),farmer_payment.replace(/[^\d.]/g,'')
			,remark,start,end,add_insurance,all_insured_account,all_total_expenses,all_expenses_farmer,insertid],function(tx,results){
			console.log("ok");
			window.location.href= tourl;
		}, function(tx,message) {
				console.log("ERROR: " + message.message);
		});

    });  
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
//加载标的名称
function loadKindList(id,flag){
	var data={
    	"category":1,
    	"city_code":localStorage.getItem("city_code"),
    	"start":0,
    	"count":0
    };
	var start='',
	end='';
	var getkind=function(datas){
		console.log(datas);
		var result=datas.result,
			undOlList="";
		undOlList+='<li>请选择标的名称</li>';
		Kindist = [];
		var KindObj = {};
		$.each(result,function(i,item){
			undOlList+='<li ol_id="'+item.id+'" fee_percentage="'+item.fee_percentage+'" unit_fee="'+item.unit_fee+'" start="'+item.startdate+'" end="'+item.enddate+'" self_per="'+item.self_per+'">'+item.name+'</li>';
			Kindist.push(item);
			KindObj[item.id] = item;
			console.log(Kindist);
			// if($('.undOl_select2').text()==item.name){
			// 	start=item.startdate;
			// 	end=item.enddate;
			// 	localStorage.setItem("start",start);
			// 	localStorage.setItem("end",end);	
			// }
		})
		
		$(".undOl_select1_list2").html(undOlList);
		$(".undOl_select1_list2 li").click(function(){
			var liText=$(this).text();
			if(liText!=='请选择标的名称'){
				var	fee_percentage=$(this).attr("fee_percentage"),
	        	kind_id=$(this).attr("ol_id"),
	        	unit_fee=$(this).attr("unit_fee"),
				self_per=$(this).attr("self_per");
				start = $(this).attr("start");
	        	end = $(this).attr("end");
	        $(this).parent(".undOl_select1_list").siblings(".undOl_select").html(liText);
			$(this).parent(".undOl_select1_list").siblings(".undOl_select").attr("kindid",kind_id);
			$(this).parent(".und_tri_ul").hide();
	        localStorage.setItem("fee_percentage",fee_percentage);
	        localStorage.setItem("unit_fee",unit_fee);
	        localStorage.setItem("self_per",self_per);
	        localStorage.setItem("start",start);
			localStorage.setItem("end",end);
			reSetForm();
			return false;
			}
		})
		if(id){
			localStorage.setItem("fee_percentage",KindObj[id].fee_percentage);
	        localStorage.setItem("unit_fee",KindObj[id].unit_fee);
	        localStorage.setItem("self_per",KindObj[id].self_per);
	        localStorage.setItem("start",KindObj[id].startdate);
			localStorage.setItem("end",KindObj[id].enddate);
			reSetForm(flag);
		}
		
	}
	AjaxGet("getInsuranceKind",data,getkind);
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
var now=year+'-'+p(month)+"-"+p(date)
var end_now=(year+1)+'-'+p(month)+"-"+p(date);

function reSetForm(flag){
	var fee_percentage=localStorage.getItem("fee_percentage").split(','),
		unit_fee=localStorage.getItem("unit_fee").split(','),
		self_per=localStorage.getItem("self_per").split(','),
		start_date = localStorage.getItem("start"),
		end_date = localStorage.getItem("end"),
		fep="",
		ufe="",
		sep="";
	//保险费率
	$.each(fee_percentage,function (i,item) {
		fep+='<li>'+item+'%</li>';
	})
	$(".und_tri_ul3").html(fep);

	//单位保险金额
	$.each(unit_fee,function (i,item) {
		ufe+='<li>'+item+'元</li>';
	})
	$(".und_tri_ul1").html(ufe);
	start_date = start_date!="undefined"?start_date:now;
	end_date = end_date!="undefined"?end_date:end_now;
	//保费自缴比例
	$.each(self_per,function (i,item) {
		sep+='<li>'+item+'%</li>';
	})
	$(".und_tri_ul2").html(sep);
	if(!flag){
		$("#start_date").text(start_date);
		$("#end_date").text(end_date);
		$(".und_tri_span2").html($(".und_tri_ul1 >li:first").text());	
		$(".und_tri_span3").html($(".und_tri_ul2 >li:first").text());
		$(".und_tri_span4").html($(".und_tri_ul3 >li:first").text());
		reckon();
	}
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




$(function(){
    $(".ud_back").click(function(){
        saveInfoToDataBase("./und_info.html",false);
    })
  	$("#undMapNext").click(function(e){
	  	saveInfoToDataBase("./und_payment.html",true);
//	  	leafletImage(map, doImage);
    })
})
function doImage(err, canvas) {
  	var img = document.createElement('img');
  	var dimensions = map.getSize();
  	img.width = dimensions.x;
  	img.height = dimensions.y;
  	img.src = canvas.toDataURL();
  	console.log(canvas.toDataURL());
  	window.location.href = "./bigimg.html?src="+canvas.toDataURL();
}
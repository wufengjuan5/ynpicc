$(function(){
	var name=localStorage.getItem("name"),
		work_num=localStorage.getItem("work_num");
	$("#chineseName").html(name);
	$("#workName").html(work_num);
	$("#quitLogin").click(function(){
		localStorage.removeItem("name");
		localStorage.removeItem("user_id");
		localStorage.removeItem("token");
		localStorage.removeItem("city_code");
		window.location.href="../login.html";
	})
})
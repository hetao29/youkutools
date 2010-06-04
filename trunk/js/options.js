$("#record_history").ready(function(){
	$("#record_history").click(function(){
		localStorage.record_history = $("#record_history").attr("checked");
	});
	if(localStorage.record_history=="false"){
		$("#record_history").attr("checked",false);
	}else{
		$("#record_history").attr("checked",true);
	}

});

$("#record_bookmark").ready(function(){
	$("#record_bookmark").click(function(){
		localStorage.record_bookmark = $("#record_bookmark").attr("checked");
	});
	if(localStorage.record_bookmark=="true"){
		$("#record_bookmark").attr("checked",true);
	}else{
		$("#record_bookmark").attr("checked",false);
	}

});
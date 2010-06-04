var playlist={}
//localStorage.data = null;
playlist.add=function(url,title){
	var data = playlist.getAll();
	var ct=1;
	for(var i=0;i<data.length;i++){
		if(data[i].url == url){
			//找到了，应该加1，并且放到第1个
			ct = data[i].ct;
			ct++;
			data.splice(i,1);
			finded=true;
			break;
		}
	}
	data.unshift({"url":url,"title":title,"ct":ct,"date":(new Date).getTime()});
	localStorage.data = JSON.stringify(data);
}
playlist.clear=function(){
	localStorage.data="";
}
playlist.del=function(url){
	var data = playlist.getAll();
	var ct=1;
	for(var i=0;i<data.length;i++){
		if(data[i].url == url){
			data.splice(i,1);
			break;
		}
	}
	localStorage.data = JSON.stringify(data);
}
playlist.get = function(page,pageSize){
	page = page?page:1;
	pageSize = pageSize?pageSize:16;
	var data = playlist.getAll();
	return {
		totalSize:data.length, 
		totalPage:Math.ceil(data.length/pageSize),
		page:page,
		pageSize:pageSize,
		items:data.slice((page-1)*pageSize,page*pageSize)
	}
}
playlist.getAll = function(){
	try{
		var data = JSON.parse(localStorage.data);//?JSON.parse(localStorage.data):new Array;
	}catch(e){
		var data = new Array;
	}
	if(!data) data = new Array;
	return data;
}
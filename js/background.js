﻿var youkuBookMark={};
var currentId;
var youkubookMarkBuilding=false;


function ParseException(description) {
    this.description = description;
}
function parseURL(buffer) {
	var result = {};
	result.protocol = "";
	result.user = "";
	result.password = "";
	result.host = "";
	result.port = "";
	result.path = "";
	result.query = "";
	
	var section = "PROTOCOL";
	var start = 0;
	var wasSlash = false;
	
	while(start < buffer.length) {
		if(section == "PROTOCOL") {
			if(buffer.charAt(start) == ':') {
				section = "AFTER_PROTOCOL";
				start++;
			}else if(buffer.charAt(start) == '/' && result.protocol.length() == 0) { 
				section = PATH;
			}else {
				result.protocol += buffer.charAt(start++);
			}
		}else if(section == "AFTER_PROTOCOL") {
			if(buffer.charAt(start) == '/') {
				if(!wasSlash) {
					wasSlash = true;
				} else {
					wasSlash = false;
					section = "USER";
				}
				start ++;
			} else {
				throw new ParseException("Protocol shell be separated with 2 slashes");
			}       
		} else if(section == "USER") {
			if(buffer.charAt(start) == '/') {
				result.host = result.user;
				result.user = "";
				section = "PATH";
			} else if(buffer.charAt(start) == '?') {
				result.host = result.user;
				result.user = "";
				section = "QUERY";
				start++;
			} else if(buffer.charAt(start) == ':') {
				section = "PASSWORD";
				start++;
			} else if(buffer.charAt(start) == '@') {
				section = '<strong class="highlight">HOST</strong>';
				start++;
			} else {
				result.user += buffer.charAt(start++);
			}
		} else if(section == "PASSWORD") {
			if(buffer.charAt(start) == '/') {
				result.host = result.user;
				result.port = result.password;
				result.user = "";
				result.password = "";
				section = "PATH";
			} else if(buffer.charAt(start) == '?') {
				result.host = result.user;
				result.port = result.password;
				result.user = "";
				result.password = "";
				section = "QUERY";
				start ++;
			} else if(buffer.charAt(start) == '@') {
				section = '<strong class="highlight">HOST</strong>';
				start++;
			} else {
				result.password += buffer.charAt(start++);
			}
		} else if(section == '<strong class="highlight">HOST</strong>') {
			if(buffer.charAt(start) == '/') {
				section = "PATH";
			} else if(buffer.charAt(start) == ':') {
				section = "PORT";
				start++;
			} else if(buffer.charAt(start) == '?') {
				section = "QUERY";
				start++;
			} else {
				result.host += buffer.charAt(start++);
			}
		} else if(section == "PORT") {
			if(buffer.charAt(start) = '/') {
				section = "PATH";
			} else if(buffer.charAt(start) == '?') {
				section = "QUERY";
				start++;
			} else {
				result.port += buffer.charAt(start++);
			}
		} else if(section == "PATH") {
			if(buffer.charAt(start) == '?') {
				section = "QUERY";
				start ++;
			} else {
				result.path += buffer.charAt(start++);
			}
		} else if(section == "QUERY") {
			result.query += buffer.charAt(start++);
		}
	}
	
	if(section == "PROTOCOL") {
		result.host = result.protocol;
		result.protocol = "http";
	} else if(section == "AFTER_PROTOCOL") {
		throw new ParseException('Invalid <strong class="highlight">url</strong>');
	} else if(section == "USER") {
		result.host = result.user;
		result.user = "";
	} else if(section == "PASSWORD") {
		result.host = result.user;
		result.port = result.password;
		result.user = "";
		result.password = "";
	}
	
	return result;
}





function addYoukuBookMark(title,url,add){
	chrome.bookmarks.search(
		url,
		function(bookmarkTreeNodes) {
			currentId = 0;
			
			if(bookmarkTreeNodes.length==0){
				if(youkuBookMark.id==undefined && youkubookMarkBuilding==false){//建立
					youkubookMarkBuilding = true;
					chrome.bookmarks.create(
						{'parentId': String("1"),'title': '优酷'},
						function(newFolder) {
							youkuBookMark = newFolder;
							chrome.bookmarks.create(
								{'parentId': newFolder.id, 'title': title,'url':url},
								function(newFolder2){
									if(newFolder2){
										//添加成功，移到第1个		
										currentId = newFolder2.id;
										youkubookMarkBuilding = false;
									}
								}
							);
						}
					);
				}else{
					chrome.bookmarks.create(
						{'parentId': youkuBookMark.id,'title': title,'url':url},
						function(newFolder2){
							if(newFolder2){
								//添加成功，移到第1个
								currentId = newFolder2.id;
							}else{
								youkuBookMark={};
								addYoukuBookMark(title,url);
							}
						}
					);
				}
			}else{
				currentId = bookmarkTreeNodes[0].id;
				if(add==false){
					chrome.bookmarks.update(
						currentId,
						{
							"title":title
						}
					);
				}
			}
			
			//移到第一个
			if(currentId>0){
				chrome.bookmarks.move(
					currentId,
					{
						"parentId":youkuBookMark.id,
						"index":0
					}
				);
			}
		}
	);
}


function check(){
	$.getJSON('http://api.youku.com/api_getIndexRecVideos?pid=XOA&pd=1&recommend_type=head&pl=1', function(resp){
		if(resp && resp.results && resp.total){
			var s = resp.total;
			if(resp.results[0].videoid!=localStorage.newestVideoId){
				chrome.browserAction.setBadgeText({text:"NEW"});
				localStorage.newestVideoId = resp.results[0].videoid;
			}
		}
	});
}
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
	var add=false;
	if(changeInfo.status=="loading"){
		//loading的时候加1
		add=true;
	}else{
		//complete的时候更新标题
		add=false;
	}
	{
		var url = parseURL(tab.url);
		if(url.host =="v.youku.com" && url.path.indexOf("/v_")!==false){
			var title = tab.title.replace(" - 优酷视频 - 在线观看","");
			if(localStorage.record_history=="false"){
			}else{
				playlist.add(tab.url,title,add);
			}
			//{{{
			if(localStorage.record_bookmark=="true")
			{
				addYoukuBookMark(title,tab.url,add);
			}
			//}}}
			
		}

	}
});

chrome.bookmarks.getTree(
	function(bookmarkTreeNodes) {
		for(var i=0;i<bookmarkTreeNodes[0].children.length;i++){
			var child=bookmarkTreeNodes[0].children[i].children;
			for(var j=0;j<child.length;j++){
				if(child[j].title && child[j].title=="优酷" && child[j].url==undefined){
					youkuBookMark = child[j];
					//如果有优酷目录，并且没有设置关闭 自动书签记录功能就直接打开这个功能
					if(localStorage.record_bookmark!="false"){
						localStorage.record_bookmark=true;
					}
					return;
				}
			}
		}
	}
);

check();
//10分钟检测一次
setInterval("check()",600000);

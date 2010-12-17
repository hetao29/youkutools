//{{{ search
function search(page){
	page = page?page:1;
	var key = $("#keywords").val();
	$.getJSON("http://www.youku.com/api_ptvideo/st_3_pid_XOA?sv="+key+"&rt=3&ob=6&pz=4&pg="+page, function(data){
		$("#videos").html("");
		 for(var i=0;i<data.item.length;i++){
			var ul = document.createElement("ul");
			var a = document.createElement("a");
			a.href=data.item[i].link;
			a.target="_blank";
			
			var img = document.createElement("img");
			img.src = data.item[i].snapshot;
			//图标
			var li_img = document.createElement("li");
			li_img.appendChild(img);
			li_img.className="left clear video";
			a.appendChild(li_img);
			ul.appendChild(a);
			
			
			//连接
			var li_href = document.createElement("li");
			
			var a = document.createElement("a");
			a.href=data.item[i].link;//"http://v.youku.com/v_show/id_"+resp.results[i].videoid+".html";
			a.target="_blank";
			a.title=data.item[i].title;
			a.alt =data.item[i].title;
			a.innerHTML=data.item[i].title.substr(0,30);;
			li_href.appendChild(a);
			ul.appendChild(li_href);
			//会员
			var li_user = document.createElement("li");
			//li_user.className="right clear";
			var a = document.createElement("a");
			a.href="http://u.youku.com/user_show/uid_"+data.item[i].author+".html";
			a.target="_blank";
			a.innerHTML=data.item[i].author;
			li_user.innerHTML="会员:";
			li_user.appendChild(a);
			ul.appendChild(li_user);
			//发布
			var li = document.createElement("li");
			//li.className="right clear";
			li.innerHTML="发布:"+data.item[i].pubDate;;
			ul.appendChild(li);
			//播放
			var li = document.createElement("li");
			//li.className="right clear";
			li.innerHTML="播放:"+data.item[i].playtimes;;
			ul.appendChild(li);
			//评论
			var li = document.createElement("li");
			//li.className="right clear";
			li.innerHTML="时长:"+data.item[i].duration;
			ul.appendChild(li);
			/*
			var img = document.createElement("img");
			li.appendChild(li_img);
			li.appendChild(li_a);
			*/
	
			document.getElementById("videos").appendChild(ul);
			//clear
			var div_clear = document.createElement("div");
			div_clear.className="clear";
			document.getElementById("videos").appendChild(div_clear);
		}
			//生成pager
		var pager="";
		if(data.pageNo>1){
			pager+="<a href='javascript:search(1);void(0)'>&lt;&lt;</a>&nbsp;";
			pager+="<a href='javascript:search("+(page-1)+");void(0)'>&lt;</a>&nbsp;";
		}else{
			pager+="&lt;&lt;&nbsp;&lt;&nbsp;";
		}
		data.totalPage = Math.ceil(data.totalSize/data.pageSize);
		var pageStart=(page-2>0)?(page-2):1;
		var j=0;
		for(var i=pageStart;i<=data.totalPage&j++<5;i++){
			if(page==i){
			pager+=i+'&nbsp;';
			}else{
			pager+='<a href="javascript:search('+i+')">'+i+'</a>&nbsp;';
			}
		}
		if(data.totalPage>data.pageNo){
			pager+="<a href='javascript:search("+(page+1)+");void(0)'>&gt;</a>&nbsp;";
			pager+="<a href='javascript:search("+data.totalPage+");void(0)'>&gt;&gt;</a>&nbsp;";
		}else{
			pager+="&gt;&gt;&nbsp;&gt;&nbsp;";
		}
		$("#search_pager").html(pager);
		
	
	});
}
//}}}
//{{{history
history_page = 1;
history_edit = false;
function showHistory(data){
	page = data.page;
	
	$("#history").html("");
	for(var i=0;i<data.items.length;i++){
		var ul = document.createElement("ul");
		//ul.className="clear";
		ul.id="history_"+i;
		//del
		var li = document.createElement("li");
		li.className="left history_del";
		li.innerHTML="<a href=\"javascript:playlist.del('"+data.items[i].url+"');$('#"+ul.id+"').remove();if($('#history').children().length==0)getHistory();void(0);\">删除</a>&nbsp;&nbsp;";
		ul.appendChild(li);
		//连接
		var li_href = document.createElement("li");
		
		li_href.className="history_content";
		var r="(";
		if(data.items[i].timestamp){
			var d=new Date;
			d.setTime(data.items[i].timestamp);
			r+=d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日 "+d.getHours()+"点"+(d.getMinutes())+"分，";
		}
		r+="共观看"+data.items[i].ct+"次";
		r+=") ";
		
		//li_href.width="100%";
		var a = document.createElement("a");
		a.href=data.items[i].url;
		a.target="_blank";
		a.title=r+"\n"+data.items[i].title;
		a.alt =r+"\n"+data.items[i].title;
		a.innerHTML=data.items[i].title;//.substr(0,40);
		li_href.appendChild(a);
		ul.appendChild(li_href);
		document.getElementById("history").appendChild(ul);
	}
	//生成pager
	var pager="";
	if(data.page>1){
		pager+="<a href='javascript:getHistory(1);void(0)'>&lt;&lt;</a>&nbsp;";
		pager+="<a href='javascript:getHistory("+(page-1)+");void(0)'>&lt;</a>&nbsp;";
	}else{
		pager+="&lt;&lt;&nbsp;&lt;&nbsp;";
	}
	
	var pageStart=(page-2>0)?(page-2):1;
	var j=0;
	for(var i=pageStart;i<=data.totalPage&j++<5;i++){
		if(page==i){
		pager+=i+'&nbsp;';
		}else{
		pager+='<a href="javascript:getHistory('+i+')">'+i+'</a>&nbsp;';
		}
	}
	if(data.totalPage>data.page){
		pager+="<a href='javascript:getHistory("+(page+1)+");void(0)'>&gt;</a>&nbsp;";
		pager+="<a href='javascript:getHistory("+data.totalPage+");void(0)'>&gt;&gt;</a>&nbsp;";
	}else{
		pager+="&gt;&gt;&nbsp;&gt;&nbsp;";
	}
	pager+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	pager+="<a style='color:#666' href=\"javascript:$('.history_del').show();history_edit=true;\">编辑</a>&nbsp;/&nbsp;<a style='color:#666' href=\"javascript:$('.history_del').hide();history_edit=false;\">取消</a>"
	pager+="&nbsp;/&nbsp;<a style='color:#666' href=\"javascript:playlist.clear();getHistory(1);\">清空</a>";
	$("#history_pager").html(pager);
	
	if(history_edit){//显示编辑
		$('.history_del').show();
	}
}

function getHistory(page){
	var pageSize=15;
	var page = page?page:history_page;
	history_page = page;
	var data = playlist.get(page,pageSize,showHistory);

}
//}}}
//{{{index video
function getIndexVideo(){
	try{
		chrome.browserAction.setBadgeText({text:""});
	}catch(e){}
		$.getJSON('http://www.youku.com/api_getIndexRecVideos?pid=XOA&pd=1&recommend_type=head&pl=4', function(resp){
		if(resp && resp.results && resp.total){
			var ct = resp.results.length;
			for (var i = 0; i<ct; i++) {
				var ul = document.createElement("ul");
		
				var a = document.createElement("a");
				a.href="http://v.youku.com/v_show/id_"+resp.results[i].videoid+".html";
				a.target="_blank";
						
						
				var img = document.createElement("img");
				img.src = resp.results[i].thumburl;
				//图标
				var li_img = document.createElement("li");
				li_img.appendChild(img);
				li_img.className="left clear video";
				a.appendChild(li_img);
				ul.appendChild(a);
				//连接
				var li_href = document.createElement("li");
				
				var a = document.createElement("a");
				a.href="http://v.youku.com/v_show/id_"+resp.results[i].videoid+".html";
				a.target="_blank";
				a.title=resp.results[i].title;
				a.alt = resp.results[i].title;
				a.innerHTML=resp.results[i].title;//.substr(0,30);;
				li_href.appendChild(a);
				ul.appendChild(li_href);
				//会员
				var li_user = document.createElement("li");
				//li_user.className="right clear";
				var a = document.createElement("a");
				a.href="http://u.youku.com/user_show/uid_"+resp.results[i].username+".html";
				a.target="_blank";
				a.innerHTML=resp.results[i].username;
				li_user.innerHTML="会员:";
				li_user.appendChild(a);
				ul.appendChild(li_user);
				//发布
				var li = document.createElement("li");
				//li.className="right clear";
				li.innerHTML="发布:"+resp.results[i].createtime;;
				ul.appendChild(li);
				//播放
				var li = document.createElement("li");
				//li.className="right clear";
				li.innerHTML="播放:"+resp.results[i].total_vv;;
				ul.appendChild(li);
				//评论
				var li = document.createElement("li");
				//li.className="right clear";
				li.innerHTML="评论:"+resp.results[i].total_comment;;
				ul.appendChild(li);
				/*
				var img = document.createElement("img");
				li.appendChild(li_img);
				li.appendChild(li_a);
				*/
				document.getElementById("videos").appendChild(ul);
				//clear
				var div_clear = document.createElement("div");
				div_clear.className="clear";
				document.getElementById("videos").appendChild(div_clear);
			}
		}
	});
}
//}}}
$("#history").ready(function (){
	  getIndexVideo();
	  getHistory(1);
});


$("#keywords").ready(function(){
	$("#keywords").focus();
	if(localStorage.keywords)$("#keywords").val(localStorage.keywords)
		
	$("#keywords").autocomplete("http://tip.so.youku.com/search_keys?type=video&",{
		autoFill:false,delay:200,max:7,
		formatItem: function(row, i, max) {
			return  "<div>"+row.keyword + " <span class='right hits'>[" + row.count + "]个视频</span></div>";
		},
		 extraParams: {
		   k: function() { return $("#keywords").val(); 
		   }
	   },
		formatMatch: function(row, i, max) {
			return row.keyword;
		}
	});
	$("#keywords").result(function(event, data, formatted) {
		localStorage.keywords = data.keyword;
		search();
	});
	
});

$("#search").ready(function(){
	$("#search_bt").click(function(){
		search();
	})
});
$("#tab-title").ready(function(){
	$('#tab-title span').click(function(){
		$(this).addClass("selected").siblings().removeClass();
		$("#tab-content > div").slideUp('1000').eq($('#tab-title span').index(this)).slideDown('1000');
	});
});

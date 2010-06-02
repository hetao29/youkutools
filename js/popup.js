//{{{ search
function search(page){
	page = page?page:1;
	var key = $("#keywords").val();
	$.getJSON("http://api.youku.com/api_ptvideo/st_3_pid_XOA?sv="+key+"&rt=3&ob=6&pz=4&pg="+page, function(data){
		$("#search").html("");
		 for(var i=0;i<data.item.length;i++){
					var ul = document.createElement("ul");

					var img = document.createElement("img");
					img.src = data.item[i].snapshot;
					//图标
					var li_img = document.createElement("li");
					li_img.appendChild(img);
					li_img.className="left clear";
					ul.appendChild(li_img);
					//连接
					var li_href = document.createElement("li");
					
					var a = document.createElement("a");
					a.href=data.item[i].link;//"http://v.youku.com/v_show/id_"+resp.results[i].videoid+".html";
					a.target="_blank";
					a.title=data.item[i].title;
					a.title = data.item[i].title;
					a.alt =data.item[i].title;
					a.innerHTML=data.item[i].title.substr(0,32);;
					li_href.appendChild(a);
					ul.appendChild(li_href);
					//会员
					var li_user = document.createElement("li");
					//li_user.className="right clear";
					var a = document.createElement("a");
					a.href="http://u.youku.com/user_show/id_"+data.item[i].author+".html";
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
			
					document.getElementById("search").appendChild(ul);
					//clear
					var div_clear = document.createElement("div");
					div_clear.className="clear";
					document.getElementById("search").appendChild(div_clear);
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
		for(var i=pageStart;i<=data.totalPage&i<(page+3);i++){
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
function getHistory(page){
	var pageSize=15;
	var data = playlist.get(page,pageSize);
	$("#history").html("");
	for(var i=0;i<data.items.length;i++){
				var ul = document.createElement("ul");
				//连接
				var li_href = document.createElement("li");
				
				li_href.className="left ";
				li_href.width="100%";
				var a = document.createElement("a");
				a.href=data.items[i].url;
				a.target="_blank";
				a.title=data.items[i].title;
				a.title = data.items[i].title;
				a.alt =data.items[i].title;
				a.innerHTML=data.items[i].title.substr(0,38);;
				li_href.appendChild(a);
				ul.appendChild(li_href);
				var li = document.createElement("li");
				//li.className="right clear";
				li.innerHTML="&nbsp;&nbsp;(观看次数:"+data.items[i].ct+")";
				ul.appendChild(li);
				/*
				var img = document.createElement("img");
				li.appendChild(li_img);
				li.appendChild(li_a);
				*/
				document.getElementById("history").appendChild(ul);
				//clear
				var div_clear = document.createElement("div");
				div_clear.className="clear";
				document.getElementById("history").appendChild(div_clear);
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
	for(var i=pageStart;i<=data.totalPage&i<(page+3);i++){
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
	$("#history_pager").html(pager);
}
//}}}
//{{{index video
function getIndexVideo(){
	try{
	chrome.browserAction.setBadgeText({text:""});
	}catch(e){}
	$.getJSON('http://api.youku.com/api_getIndexRecVideos?pid=XOA&pd=1&recommend_type=head&pl=4', function(resp){
	
		var ct = resp.results.length;
		try{
		for (var i = 0; i<ct; i++) {
			var ul = document.createElement("ul");
	
			var img = document.createElement("img");
			img.src = resp.results[i].thumburl;
			//图标
			var li_img = document.createElement("li");
			li_img.appendChild(img);
			li_img.className="left clear";
			ul.appendChild(li_img);
			//连接
			var li_href = document.createElement("li");
			
			//li_href.className="right clear";
			var a = document.createElement("a");
			a.href="http://v.youku.com/v_show/id_"+resp.results[i].videoid+".html";
			a.target="_blank";
			a.title=resp.results[i].desc;
			a.title = resp.results[i].title;
			a.alt = resp.results[i].title;
			a.innerHTML=resp.results[i].title.substr(0,32);;
			li_href.appendChild(a);
			ul.appendChild(li_href);
			//会员
			var li_user = document.createElement("li");
			//li_user.className="right clear";
			var a = document.createElement("a");
			a.href="http://u.youku.com/user_show/id_"+resp.results[i].username+".html";
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
		}catch(e){alert(e.description);}
	
	});
}
//}}}
$("#history").ready(function (){
	  getHistory(1);
	  getIndexVideo();
});


$("#keywords").ready(function(){
	$("#keywords").focus();
	if(localStorage.keywords)$("#keywords").val(localStorage.keywords)
		
	$("#keywords").autocomplete("http://tip.so.youku.com/search_keys?type=video&",{
		autoFill:false,delay:200,
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
		//search();
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
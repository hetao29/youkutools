function youku_chrome_autoplay(){
	$("replay").value= videoId;
	var onPlayerComplete_old = onPlayerComplete;
	onPlayerComplete=function(obj){
		if($("replay").checked){
			$("player").innerHTML = $("player").innerHTML;
		}
		onPlayerComplete_old(obj);
	}
}

var vid2;
var lyrics_offset = 0;
var o_lyrics;
var gc= new Array();
var pre_index=0;
var playerId="movie_player";
var vid = location.href;
var url="http://youku.fm/";
$("#movie_player").ready(function(){

	//$(".resize").append('<span class="break">|</span> <span><input id="replay" style=" margin-bottom:1px" type="checkbox"/> <a href="javascript:$(\'replay\').checked?$(\'replay\').checked=false:$(\'replay\').checked=true">循环播放</a></label></a></span>');
//	$(".right").prepend('<div class="listOrder"> <div class="box nBox"> <div class="head"> <div class="caption"><h3 class="title">循环播放:<input id="replay" type="checkbox"></h3></div> </div> </div> </div>');
	if(	
		!$(".crumbs A:contains('音乐')").html()
	)return;;
	start();
	//start_interval = setInterval(checkTime,500);
});
//var start_flag=false;
//var start_interval;
function start(){
	//if(start_flag)return;
	//start_flag=true;
	$.ajax({
		url: url+"player.main.getlyric",
		data: {
			vid:vid
		},
		success: function( result) {
			result=result.replace(/<[^>]+>/g,"");
			try{
				result=eval("("+result+")");
			}catch(e){
				result={};
			}
			if(result){
				if(result.LyricsContent && result.lyrics_offset!=""){
				var content='<div class="box nBox" group="info">'+
						'<div class="head" style="cursor: pointer; ">'+
						//'<div class="caption"><h3 class="title">歌词信息</h3></div>'+
						'<div class="status" style="display: block; "><div class="ico__expand"></div></div>'+
						'<div class="caption"><h3 class="title">歌词信息</h3>　由<a id="fmUrl" href="http://youku.fm/" target="_blank">YouKu.FM</a>提供支持  <input id="replay" type="checkbox"><label for="replay">重复播放</label></div>'+
						'</div>'+
						'<div class="body" style="display: block; ">'+
						'<div class="info" id="long" style="display: block; ">'+
						'<div class="item">'+
						'<div class="" style="position:relative;text-align:center;height:340px;">'+
						'<div id="_LyricsTop"></div>'+
						'<div id="_ContentLyrics" class="lyrics" style="overflow:hidden;height:320px;">'+
						'</div>'+
						'<div id="_IDLyricsAdmin" style="display: block;line-height:30px; ">'+
						'<span id="_IDLyricsBk" style="cursor:pointer;border:1px solid;"><a>后退</a></span>'+
						'<span id="_IDLyricsPr" style="cursor:pointer;border:1px solid;"><a>前进</a></span>'+
						'<span id="_IDLyricsErr" style="cursor:pointer;border:1px solid;"><a>报错</a></span>'+
						//'<span id="_IDLyricsView" style="cursor:pointer;border:1px solid;">查看</span>'+
						'<span id="_IDLyricsInfo" style="position: absolute; top: 316px; left: 200px; display: none; "></span>'+
						'<div class="myad">'+
						'</div>'+
						'</div></div></div></div></div></div>';
					//$(".right >div").eq(1).before(content);
					$(".right").prepend(content);
					$(".right").prepend("<script>"+youku_chrome_autoplay+";youku_chrome_autoplay();CollapseBox.init();</script>");
					$("#fmUrl").attr("href","http://youku.fm/?vid="+$("#replay").val());
					showLyric(result.LyricsContent);
					lyrics_offset = parseInt(result.LyricsOffset);
					setInterval(play,500);
				}
			}
		}
	
	}); 
};
function _player(moviename) {
        if (navigator.appName.indexOf("Microsoft") != -1)return window[moviename?moviename:playerId];
        return document[moviename?moviename:playerId];
};
function PlayerInfo(){
		try{
		return (document.getElementById(playerId).getNsData());
		}catch(e){return false;}
};

/*
function checkTime(){
		var r= PlayerInfo();
		if(!r){
			return;
		}alert(r);
		for(var i in r){alert(i+":"+r[i]);}
		alert("X");
		var time = isNaN(r.time)?0:r.time;
		var alltime = isNaN(r.alltime)?0:r.alltime;
		alert(time);
		alert(alltime);
		if(alltime>90 && alltime<8*60)start();//8分钟内的才出
		clearInterval(start_interval);
}
*/
function play(){
		if(!o_lyrics){
				o_lyrics = $('.lyrics');
		}
		var LyricTop = $("#_LyricsTop");
		var r= PlayerInfo();
		if(!r){
			LyricTop.hide();
			return;
		}
		var time = isNaN(r.time)?0:r.time;
		var l = getLyric(time*1000+parseInt(lyrics_offset));
		if(!l){
			LyricTop.hide();
			return;
		}
		var id = "_ID"+l.i;
		var index = l.i;
		if(pre_index  == index)return;else{
			pre_index=index;
		}
		//向上移动
		var t = l.top - 140;
		var LyricCurrent = $("#"+id);
		LyricTop.show();
		$("#_ContentLyrics .red").removeClass("red");
		o_lyrics.animate({scrollTop:t+"px"},"fast","linear",function(){
				if(LyricCurrent.html().replace("&nbsp",'')!=""){
						var t2 = LyricCurrent.position().top;
						LyricTop.animate({"top":t2+"px","height":LyricCurrent.height()+"px"},"fast");
						LyricCurrent.addClass("red");
				}
		});

}


function showLyric(str){
		gc= new Array();
		parseLyric(str);
		$(".lyrics").html('');
		var tmp_top=0;
		if(!gc ||gc.length==0)return;
		for (var k=0;k<gc.length;k++)
		{
				if(gc[k].w==""){
						gc[k].w="&nbsp;";
				}
				var c = '<div time="'+gc[k].t+'" id="_ID'+k+'">'+gc[k].w+'</div>';
				$(".lyrics").append(c);
				gc[k].top = tmp_top;
				tmp_top+= $("#_ID"+k).height();
		}
}


function parseLyric(str)
{
		if(!str || str=="")return;
		ti=/\[ti:(.+)\]/i.test(str)?"标题："+RegExp.$1:"";
		ar=/\[ar:(.+)\]/i.test(str)?"歌手："+RegExp.$1:"";
		al=/\[al:(.+)\]/i.test(str)?"专辑："+RegExp.$1:"";
		by=/\[by:(.+)\]/i.test(str)?"制作："+RegExp.$1:"";
		otime=parseInt(/\[offset:(.+)\]/i.test(str)?RegExp.$1:0);

		str=str.replace(/[^\]]\[/g,"\n[");
		str=str.replace(/\\/g,"");
		matches = str.match(/\n\[\d+:.+\][^\[\r\n]*/ig);
		if(!matches)return;
		rr=matches.length;
		for (var i=0;i<rr;i++)
		{
				var gctimes=/\[(.+)\].*/.exec(matches[i])[1].split("][");
				var gcword=/.+\](.*)/.exec(matches[i])[1];
				for (var j in gctimes)
				{
						gc.push({t:(parseInt(gctimes[j].split(":")[0])*60+parseFloat(gctimes[j].split(":")[1]))*1000 ,w:gcword});
				}
		}
		$.grep( gc, function(n,i){
				return n.w!="" && n.w!=undefined;
		});
		gc.sort(function (a,b){return a.t-b.t;});
}
function getLyric(t){
		if(!gc || gc.length==0)return;
		for (var k=0;k<gc.length;k++){
				if(t>=gc[k].t){
						if(gc[k+1] && t<=gc[k+1].t){
							var gc_tmp = gc[k];
							gc_tmp.i=k;
							return(gc_tmp);
						}
						if(!gc[k+1]){
							var gc_tmp = gc[k];
							gc_tmp.i=k;
							return(gc_tmp);
						}
				}
		}
};
$("#_IDLyricsPr").live("click",function(){
		lyrics_offset=parseInt(lyrics_offset)+1000;
		$("#_IDLyricsInfo").html("已前进").fadeIn("slow",function(){
					$("#_IDLyricsInfo").fadeOut("slow");
		});
		saveOffset();
});

$("#_IDLyricsBk").live("click",function(){
		lyrics_offset=parseInt(lyrics_offset)-1000;
		$("#_IDLyricsInfo").html("已后退").fadeIn("slow",function(){
					$("#_IDLyricsInfo").fadeOut("slow");
		});
		saveOffset();
});
function saveOffset(){
	if($("#replay").val()>0){
		$.ajax({
			url: url+"player.main.saveoffset",
			data: {
				VideoID:$("#replay").val(),
				offset:lyrics_offset
			},
			success: function( result) {
			}

		});
	}
}


$("#_IDLyricsErr").live("click",function(){
	if($("#replay").val()>0){
		$.ajax({
			url: url+"player.main.LyricsError",
			data: {
				VideoID:$("#replay").val()	
			},
			success: function( result) {
				$("#_IDLyricsInfo").html("已报错").fadeIn("slow",function(){
							$("#_IDLyricsInfo").fadeOut("slow");
				});
			}

		});
	}
});





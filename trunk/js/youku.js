function youku_chrome_autoplay(){
	var onPlayerComplete_old = onPlayerComplete
	onPlayerComplete=function(){
		if($("replay").checked)PlayerSeek(0.01);
		onPlayerComplete_old();
	}
}
$("#movie_player").ready(function(){
	$(".resize").append('<span class="break">|</span> <span><input id="replay" style=" margin-bottom:1px" type="checkbox"/> <a href="javascript:$(\'replay\').checked?$(\'replay\').checked=false:$(\'replay\').checked=true">循环播放</a></label></a></span>');
	$(".resize").append("<script>"+youku_chrome_autoplay+";youku_chrome_autoplay();</script>");
});

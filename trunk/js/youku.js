/*
$("#movie_player").ready(function(){
	//$("#movie_player").width("150%");
	//$("#movie_player").height("110%");
});
$("*").css({"background-color":"#FFCC66"});
$(".head").css({"background-color":"#FFCC66"});
$(".body").css({"background-color":"#FFCC66"});

//{{{
var playerId="movie_player";
function player(moviename) {
if (navigator.appName.indexOf("Microsoft") != -1)return window[moviename?moviename:playerId];
return document[moviename?moviename:playerId]
};
function PlayerSeek(s){
if(playerStart)player().nsseek(s);
};
function PlayerPause(flag){
if(playerStart)player().pauseVideo(flag);
};
function playModeSet(playMode){
return player().playModeSet(playMode);
};
function PlayerInfo(){
return player().getNsData();
};
function PlayerResume() {
Element.hide("ad_crazy");
player().PlayerResume();
};
function PlayerPause4ad() {
player().PlayerPause4ad();
};
//}}}


alert(document.title);

//	alert(JSON.stringify(['a','b']));
window.onbeforeunload=function(){
	//alert(window.location);
var ns=player().getNsData();
//alltime,time
//for(var b in ns)alert(b);
if(ns && ns.time){};
}*/
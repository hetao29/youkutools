chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
	if(changeInfo.status=="complete"){
		if(tab.url.indexOf("v.youku.com/v_")>0){
			playlist.add(tab.url,tab.title);
		}
	}
});

function check(){
	$.getJSON('http://api.youku.com/api_getIndexRecVideos?pid=XOA&pd=1&recommend_type=head&pl=1', function(resp){
		var s = resp.total;
		if(resp.results[0].videoid!=localStorage.newestVideoId){
			chrome.browserAction.setBadgeText({text:"NEW"});
			localStorage.newestVideoId = resp.results[0].videoid;
		}
	});
}
check();
setInterval("check()",60000);
/*
chrome.browserAction.onClicked.addListener(function(tab) {
		chrome.browserAction.setBadgeText({text:""});
		chrome.tabs.create({url:"http://www.youku.com/"});
});
*//*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
})();
*/

function _share_tencent_weibo(info, tab){
	var _u = "http://share.v.t.qq.com/index.php?c=share&a=index&url=$url$&appkey=801094433&title=$title$&pic=$pic$";
	var _s = (info.selectionText||"").replace(/[\s\n]+/g, " ");
	var _strmaxlen = 257 - tab.title.elength();
	var _resultstr = _s.slice(0, (_strmaxlen - 4) >> 1);
	if (_s.elength() > _strmaxlen) {
		_strmaxlen = _strmaxlen - 3;
		for (var i = _strmaxlen >> 1; i <= _strmaxlen; i++) {
			if ((_s.slice(0, i)).tripurl().elength() >= _strmaxlen) {
                    break;
                }
                else {
                    _resultstr = _s.slice(0, i);
                }
            }
            _resultstr += "...";
        } else {
            _resultstr = _s;
        }
	var url = _u.replace("$title$", encodeURIComponent((_resultstr&&(_resultstr + " ")) + tab.title+" "));
	if (info.mediaType&&info.mediaType=="image"){
		url = url.replace("$pic$", encodeURIComponent(info.srcUrl||""));
		url = url.replace("$url$", encodeURIComponent(tab.url)).substr(0, 2048);
		window.open(url);
	}else{
		chrome.tabs.getSelected(null, function(tab) { 
		  chrome.tabs.sendRequest(tab.id, {}, function(response) { 
		    url = url.replace("$pic$", response.images||"");
		    url = url.replace("$url$", encodeURIComponent(tab.url)).substr(0, 2048);
			window.open(url);
		  }); 
		});
	}		
}

String.prototype.elength = function() {
        return this.replace(/[^\u0000-\u00ff]/g, "aa").length;
};
String.prototype.tripurl = function() {
        return this.replace(new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*", "gi"), new Array(12).join("aa"));
};

var menutitle = "转播到腾讯微博";
var parent = chrome.contextMenus.create({"title": menutitle,"contexts":["selection","image"],"onclick":_share_tencent_weibo,});

chrome.browserAction.onClicked.addListener(function(tab) {
        _share_tencent_weibo({},tab);
 });
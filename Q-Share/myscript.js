function _getImagesForQshare(){
	var imgs=(Array.prototype.slice.call(document.images)).sort(function(m1,m2){
	    return m2.width-m1.width;
	}),imgarr=[],simgarr=[];
	for (var i in imgs){
		if (!imgs[i].src){
			continue;
		}
		if (imgs[i].width<180||imgs[i].height<180){
			simgarr.push(encodeURIComponent(imgs[i].src));
			continue;
		}
		imgarr.push(encodeURIComponent(imgs[i].src));
	}
	return imgarr.length && imgarr.join("|") || simgarr.join("|");
}

chrome.extension.onRequest.addListener( 
function(request, sender, sendResponse) {
     var imgs=_getImagesForQshare();
     sendResponse({'images':imgs,'frameURL':((frameElement&&frameElement.src)||(location.href)),'isTop':!frameElement}); 
}); 

function alert(s){
	var notification = webkitNotifications.createNotification('32.png', '操作提示', s);
	notification.ondisplay = function(event) {
		setTimeout(function() {
			event.currentTarget.cancel();
			event.currentTarget = null;
		},
		2000);
	}
	notification.show();
}
好用的书签工具
======

直接拖动以下工具链接到浏览器地址栏就可以使用
> 只在chrome上做了兼容，其它浏览器未做兼容处理，有问题的话反馈给我。

## 有道云词典
<a href="javascript: void((function(d) { var site = {'https:':'//cdn.rawgit.com/xiefucai/xiefucai.github.io/master/','http:':'//www.xiefucai.com/'}[location.protocol]; if (d) { d.search(); return; }; var src = site+'js/youdao.dict.js'; var e = document.createElement('script'); e.id = 'fucaixie-dict'; e.setAttribute('data-site',site); e.setAttribute('type', 'text/javascript'); e.setAttribute('src', src); e.setAttribute('charset', 'utf-8'); document.getElementsByTagName('head')[0].appendChild(e); })(window.DICT));">有道云词典</a>，拖动此链接地址到浏览器地址栏；
> 在你浏览英文网页的时，划词选中不懂的单词，点击书签栏中的“有道云词典”，就可以帮你快速查找该单词的翻译了

## 金山词霸
<a href="javascript: void((function(d) { var site = {'https:':'//cdn.rawgit.com/xiefucai/xiefucai.github.io/master/','http:':'//www.xiefucai.com/'}[location.protocol]; if (d) { d.search(); return; }; var src = site+'js/jinshan.dict.js'; var e = document.createElement('script'); e.id = 'fucaixie-dict'; e.setAttribute('data-site',site); e.setAttribute('src', src); e.setAttribute('charset', 'utf-8'); document.getElementsByTagName('head')[0].appendChild(e); })(window.DICT));">金山词霸</a>，拖动此链接地址到浏览器地址栏；
> 在你浏览英文网页的时，划词选中不懂的单词，点击书签栏中的“金山词霸”，就可以帮你快速查找该单词的翻译了

## 查看二维码
<a href="javascript: void((function(d) { var site = {'https:':'//cdn.rawgit.com/xiefucai/xiefucai.github.io/master/','http:':'//www.xiefucai.com/'}[location.protocol]; if (d) { d.search(); return; }; var src = site+'js/jinshan.dict.js'; var e = document.createElement('script'); e.id = 'fucaixie-dict'; e.setAttribute('data-site',site); e.setAttribute('src', src); e.setAttribute('charset', 'utf-8'); document.getElementsByTagName('head')[0].appendChild(e); })(window.DICT));">查看二维码</a>，拖动此链接地址到浏览器地址栏；
> 可以将正在浏览的网页地址生成二维码。

## rss订阅
<a href="javascript: (function(d) { var arr = [], types = ['application/rss+xml', 'application/rsd+xml', 'application/wlwmanifest+xml'], f = function(i, b) { return ['http://www.feedly.com/home#subscription/feed', 'http://digg.com/reader/search/','http://www.inoreader.com/bookmarklet/subscribe/'][i] + encodeURIComponent(b.href); }; Array.prototype.slice.call(d.getElementsByTagName('link')).forEach(function(link) { if (types.indexOf(link.type) >= 0) { arr.push(link); } }); if (arr.length) { var a = d.createElement('ul'); d.body.appendChild(a); a.setAttribute('style', 'border:1px solid #ccc;position:fixed;bottom:0;left:0;z-index:9999;background:#fff;padding:5px;font-size:12px;' ); a.innerHTML = (function(arr) { var s = []; arr.forEach(function(b) { s.push('<li><a href=&quot;' + b.href + '&quot; target=&quot;_blank&quot;>' + (b.title || d.title) + '</a> | <a href=&quot;' + f(0, b) + '&quot; target=&quot;_blank&quot;>%E8%AE%A2%E9%98%85%E5%88%B0Feedly</a> | <a href=&quot;' + f(1, b) + '&quot; target=&quot;_blank&quot;>%E8%AE%A2%E9%98%85%E5%88%B0Digg</a> | <a href=&quot;' + f(2, b) + '&quot; target=&quot;_blank&quot;>%E8%AE%A2%E9%98%85%E5%88%B0inoreader</a></li>') }); s.push( '<a href=&quot;javascript:;&quot; id=&quot;closerss&quot; style=&quot;position: absolute;top: 0;right: 5px;color: #f00;font-size: 30px;line-height: 1;&quot;>&times;</a>' ); return s.join(''); })(arr); d.getElementById('closerss').addEventListener('click', function(e) { d.body.removeChild(a); }, false); } })(document);">rss订阅</a>
> 抓出当前浏览网页的rss订阅地址，并生成到feedly,Digg,inoreader等网站的订阅链接；

## 将图片转为base64码
<a href="javascript:var convertImgToBase64=function(e,h,g){var d=document.createElement('CANVAS'),b=d.getContext('2d'),c=new Image,f=e.width,a=e.height;c.crossOrigin='Anonymous';c.onload=function(){d.height=a;d.width=f;b.drawImage(c,0,0,f,a);var i=d.toDataURL(g||'image/png');h.call(this,i);d=null};c.src=e.src};(function(img){convertImgToBase64(img,function(c){var b=new Image(),a=document.createElement('TEXTAREA');b.src=c;a.value=c;a.size=50;a.rows=10;document.body.appendChild(b);document.body.appendChild(a)})})(document.images[0]);">将图片转为base64码</a>
> 将网页中的任意图片作为单独网页打开后，点击此书签，可获取此图片的base64码。

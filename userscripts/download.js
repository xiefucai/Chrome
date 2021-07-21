// ==UserScript==
// @name         下载链接高亮
// @namespace    xiefucai
// @version      1.0
// @description  高亮可下载链接、去网页广告
// @author       xiefucai
// @license      MIT
// @homepageURL  https://github.com/xiefucai
// @include      *
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const APP_ID = 'div------downloader';
    class PostMsg {
        stacks = {}
        win
        constructor(win) {
            this.win = win
            window.onmessage = e => {
                const res = e.data
                if (res && res.type) {
                    if (this.stacks[res.type]) {
                        this.stacks[res.type](res.data)
                    }
                }
            }
        }

        on(name, callback) {
            this.stacks[name] = callback
        }

        setTarget(win) {
            this.win = win
        }

        send(type, data) {
            if (this.win) {
                this.win.postMessage(
                    {
                        type,
                        data
                    },
                    '*'
                )
            }
        }

        request(type, data, cb) {
            if (cb) {
                this.stacks[type] = cb
            }
            this.send(type, data)
        }

        async req(type, data) {
            const self = this
            return new Promise((resolve, reject) => {
                self.request(type, data, res => {
                    resolve(res)
                })
            })
        }
    }

    var inited = false;
    var domain = document.domain;
    var regstr = "((thunder|magnet|ed2k|ftp):[^'\"]+|[^'\"]+\.(mp4|mkv|mov|avi|rmvb|torrent)(\\?.*)?)";
    var urlReg = new RegExp("^" + regstr + "$", "gi");
    var isWhite = /\b(baidu|xunlei|bing|sogou|so|google|yahoo)\b\.(com|cn|net)(\.[a-z]+)?$/.test(domain);
    var _store = {};
    var layerStyle = 'position:fixed;top:0;left:0;background: rgba(216, 210, 218, 0.74);z-index: 9999999999;padding: 0.3em 1em;border-radius: 0 5px 0 0;color: #9e9696;font-size: 12px;';
    var storage = window.localStorage || {
        getItem: function (n) {
            return _store[n];
        },
        setItem: function (n, s) {
            _store[n] = s;
        },
        removeItem: function (n) {
            delete _store[n];
        }
    };
    var getStyle = function (e, s, pseudo) {
        return window.getComputedStyle(e, pseudo || null).getPropertyValue(s);
    };
    var isFloat = function (e) {
        return /^(absolute|fixed)$/.test(getStyle(e, 'position'));
    };
    var isTrans = function (e) {
        return getStyle(e, 'opacity') === 0 || (getStyle(e, 'backgroundColor') === 'rgba(0, 0, 0, 0)' && getStyle(e, 'backgroundImage') === 'none');
    };
    var isOutSite = function (url) {
        var rdm = getDomain(url, true);
        return rdm && (domain.indexOf(rdm) < 0) && ['pan.baidu.com'].indexOf(getDomain(url)) < 0;
    };
    var isUnknowElem = function (e) {
        return e.constructor.name === 'HTMLUnknownElement'
    }
    var hideElement = function (a) {
        !a.nohide && (a.style.display = 'none')
    };
    var disableElement = function (a) {
        a.style.pointerEvents = 'none'; // pointer-events
        //a.style.visibility = 'hidden';
        a.style.opacity = '0';
    }
    var getDomain = function (url, isRoot) {
        var m = /^https?:/.test(url) && url.match(/^https?:\/\/([\w\-\.]+)/)[1] || null;
        if (isRoot) {
            return m && m.match(/([\w\-]+\.\w+)$/)[1];
        }
        return m;
    };
    var hasOutSiteLink = function (e) {
        var links;
        urlReg.lastIndex = 0;
        if (e.tagName === "A" && isOutSite(e.href) && !urlReg.test(e.href)) {
            return true;
        }
        links = [].slice.call(e.getElementsByTagName('a'));
        for (var i = 0, k = links.length; i < k; i++) {
            if (isOutSite(links[i].href)) {
                return true;
            }
        }
        return /(广告|adv|window\.open|cpc163\.com|<object|<embed|<video)/.test(e.outerHTML);
    };
    var checkLink = function (a, i) {
        var attrs = a.attributes;
        var href = a.href;
        var thref;
        var doit = function (oo, src) {
            const o = oo.cloneNode(true);
            oo.parentNode.replaceChild(o, oo);
            o.href = src;
            o.style.color = 'red';
            o.style.backgroundColor = 'yellow';
            o.style.fontSize = '2em';
            o.style.lineHeight = '1.25';
            o.removeAttribute('onclick');
            o.removeAttribute('oncontextmenu');
            o.removeAttribute('ontouchstart');
            o.removeAttribute('ontouchend');
            [].slice.call(o.getElementsByTagName('font')).forEach(function (oo) {
                oo.removeAttribute('style');
                oo.removeAttribute('color');
            });
            o.setAttribute('download-target', 'xunlei_yunpan');
            o.addEventListener('click', (e) => {
                e.preventDefault();
                const win = window.open('https://pan.xunlei.com/?path=%2F', 'xunlei_downloader');
                const bus = new PostMsg(win);
                bus.on('getDownloadUrl', () => {
                    bus.send('getDownloadUrl', o.href, () => { })
                });
            }, false);
        };
        if (a.target === '_blank') {
            a.target = '_self';
        }

        for (var k = attrs.length, ii = k - 1, attr, attrname, attrvalue; i >= 0; i--) {
            attr = a.attributes[ii];
            attrname = attr.name;
            attrvalue = attr.value;
            urlReg.lastIndex = 0;
            if (urlReg.test(attrvalue)) {
                thref = attrvalue;
                //a.addEventListener('click',onClickLink,false);
                break;
            }
        }
        urlReg.lastIndex = 0;
        if (thref) {
            doit(a, thref);
        } else if (urlReg.test(href)) {
            doit(a, href);
        }
    };
    var removeAllFloatElems = function () {
        var es = [];
        [].slice.call(document.body.getElementsByTagName("*")).forEach(function (e, i) {
            if (e.id === APP_ID) {
                return
            }
            if (isFloat(e) && (hasOutSiteLink(e) || isTrans(e))) {
                hideElement(e);
            } else if (isUnknowElem(e)) {
                disableElement(e)
            }
        });
    };
    var removeAllAdvLinks = function () {
        [].slice.call(document.links).forEach(function (e) {
            if (hasOutSiteLink(e) || /\b(xitao3)\b\.com/.test(e.href)) {
                e.parentNode.removeChild(e);
            }
        });
    };
    var removeFramesOfoutsite = function () {
        [].slice.call(document.getElementsByTagName('iframe')).forEach(function (e, i) {
            if (isOutSite(e.src)) {
                hideElement(e);
            } else if (e.src === 'about:blank' && /^BAIDU_SSP/.test(e.getAttribute('onload'))) {
                hideElement(e);
            }
        });
    };
    var showFixedLayer = () => {
        var e = document.getElementById(APP_ID);
        if (!e) {
            e = document.createElement('div');
            e.id = APP_ID;
            document.body.appendChild(e);
            e.setAttribute('style', layerStyle);
            const a = document.createElement('a');
            a.addEventListener('click', (e) => {
                const win = window.open('https://pan.xunlei.com/?path=%2F', 'xunlei_downloader');
                const bus = new PostMsg(win);
                bus.on('getDownloadUrl', () => {
                    const urls = [];
                    const links = document.querySelectorAll('a[download-target="xunlei_yunpan"]');
                    [].slice.call(links).forEach(function (link) {
                        urls.push(link.href);
                    });
                    bus.send('getDownloadUrl', urls.join("\n"), () => { })
                });
            }, false);
            e.appendChild(a);
            a.setAttribute('style', 'margin-right:1em;');
            a.innerHTML = '下载';
            //e.innerHTML = '<a href="javascript:window.open(\'\',\'\');">下载</a>'
        }
        return e;
    };
    var showDisableBtn = function () {
        var body = showFixedLayer();
        var e = document.createElement('a');
        body.appendChild(e);
        e.innerHTML = unescape('%u5E7F%u544A%u5DF2%u9690%u85CF');
        //e.setAttribute('style', layerStyle);
        e.addEventListener('click', function () {
            storage.setItem('disable-blockadv', 1);
            location.reload();
        }, false);
        e.nohide = true;
        inited = true;
    };
    var showEnableBtn = function () {
        var body = showFixedLayer();
        var e = document.createElement('a');
        body.appendChild(e);
        e.innerHTML = unescape('%u4E0D%u9690%u85CF%u672C%u7AD9%u5E7F%u544A');
        //e.setAttribute('style', layerStyle);
        e.addEventListener('click', function () {
            storage.removeItem('disable-blockadv', 1);
            location.reload();
        }, false);
        e.nohide = true;
        inited = true;
    };
    var init = function () {
        /* document.body && document.body.addEventListener("mouseup", function (event) {
            event.stopPropagation();
        }, true); */

        if (!storage.getItem("disable-blockadv")) {
            if (!isWhite) {
                [].slice.call(document.getElementsByTagName('base')).forEach(function (elem, i) {
                    if (elem.target === '_blank') {
                        elem.target = '_self';
                    }
                });
                removeAllAdvLinks();
                removeAllFloatElems();
                removeFramesOfoutsite();
                [].slice.call(document.links).forEach(checkLink);
                !inited && showDisableBtn();
            }
        } else {
            !inited && showEnableBtn();
        }
        if (getDomain(location.href, true) === 'txzqw.cc') {
            var srcReg = new RegExp(regstr, 'gi');
            try {
                [].slice.call(document.scripts).forEach(function (s, i) {
                    if (!s.src) {
                        var urls = s.textContent.match(srcReg);
                        if (urls) {
                            urls.forEach(function (url) {
                                var div = document.createElement('DIV');
                                var a = document.createElement('A');
                                a.href = url;
                                document.body.appendChild(div);
                                div.appendChild(a);
                                a.textContent = url;
                            });
                        }
                    }
                });
            } catch (e) { }

        }

        setTimeout(init, 1000);
    };
    var initStyle = function () {
        var style = document.createElement('style');
        style.innerHTML = `body::after,body::before{opacity:0;}`;
        if (document.head) {
            document.head.appendChild(style);
        }
    }
    try {
        initStyle();
        init();
    } catch (e) {
        //console.error(e);
    }

    if (location.host === 'pan.xunlei.com' && window.opener) {
        const bus = new PostMsg(window.opener);
        bus.request('getDownloadUrl', null, function (url) {
            console.log('get download url', url);
            setTimeout(() => {
                document.querySelector('.pan-dropdown-menu-item:nth-child(2)').click();
                setTimeout(() => {
                    const inputer = document.querySelector('.pan-dialog-cover').querySelector('textarea');
                    inputer.value = url;
                    //inputer.dispatchEvent(new Event('change'));
                    inputer.dispatchEvent(new Event('input'));
                }, 500);
            }, 1000);
        });
    }
})();
// ==UserScript==
// @name        send2reader
// @version     0.1.0
// @author      xiefucai
// @description 将文章内容转为markdown。
// @homepage    http://xiefucai.gitee.io
// @match       *://*/*
// @namespace   http://tampermonkey.net/
// @homepageURL http://xiefucai.gitee.io
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @resource    injectScript   https://cdn.jsdelivr.net/gh/xiefucai/Chrome@master/userscripts/send2reader/index.js
// ==/UserScript==

'use strict';
const getFullPath = src => {
    const a = document.createElement('a')
    a.href = src
    return a.href
}
const getImgSrc = img => {
    const src =
        img.getAttribute('data-actualsrc') ||
        img.getAttribute('data-original-src') ||
        img.getAttribute('data-src') ||
        img.src ||
        ''
    return getFullPath(src)
}
const convertImgToBase64 = img => {
    const src = getImgSrc(img)
        ;['data-actualsrc', 'data-original-src', 'data-src'].forEach(attr => {
            img.removeAttribute(attr)
        })
    return new Promise((resolve, reject) => {
        if (src === '') {
            reject('图片地址不能为空', img.outerHTML)
            return
        }
        if (src.indexOf('data:') === 0) {
            resolve(src)
            return
        }
        img.src = src

        GM_xmlhttpRequest({
            method: 'GET',
            url: src,
            responseType: 'blob',
            onload: xhr => {
                if (xhr.status !== 200) {
                    reject(xhr)
                    return
                    // return res(null)
                }
                let type = xhr.response.type

                if (!/^image\//.test(type)) {
                    console.error(
                        `Can't process "${img.src}" because its type is "${type}"`
                    )
                    resolve(img.src)
                    return
                    //return res(null)
                }

                let imgEl = new Image()
                imgEl.onload = function () {
                    let canvas = document.createElement('canvas')
                    canvas.width = imgEl.naturalWidth
                    canvas.height = imgEl.naturalHeight

                    try {
                        canvas.getContext('2d').drawImage(imgEl, 0, 0)
                        img.onload = function () {
                            resolve(img.src)
                        }
                        img.src = canvas.toDataURL(type, 0.7)
                        //res(img)
                    } catch (e) {
                        console.error(`Can't draw "${img.src}" on a canvas`, e)
                        resolve(img.src)
                        //res(null)
                    }
                }
                imgEl.onerror = () => {
                    console.warn('createObjectURL failed', src, xhr.response)
                    resolve(src)
                }
                imgEl.src = window.URL.createObjectURL(xhr.response)
            },
            onerror(err) {
                console.warn(src, 'xhr failed', err)
                resolve(src)
            }
        })
    })
}

const setAllImgsToBase64 = async (copyContent, toast) => {
    const imgs = [...copyContent.querySelectorAll('img')]
    for (let i = 0, k = imgs.length; i < k; i++) {
        const src = imgs// ==UserScript==
// @name        send2reader
// @version     0.1.0
// @author      xiefucai
// @description 将文章内容转为markdown。
// @homepage    http://xiefucai.gitee.io
// @match       *://*/*
// @exclude     *://docs.rs/*
// @namespace   http://tampermonkey.net/
// @homepageURL http://xiefucai.gitee.io
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @grant       GM.getResourceUrl
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @resource    injectScript   https://cdn.jsdelivr.net/gh/xiefucai/Chrome@master/userscripts/send2reader/index1.js
// ==/UserScript==

'use strict';
const getFullPath = src => {
    const a = document.createElement('a')
    a.href = src
    return a.href
}
const getImgSrc = img => {
    const src =
        img.getAttribute('data-actualsrc') ||
        img.getAttribute('data-original-src') ||
        img.getAttribute('data-src') ||
        img.src ||
        ''
    return getFullPath(src)
}
const convertImgToBase64 = img => {
    const src = getImgSrc(img);
    ['data-actualsrc', 'data-original-src', 'data-src'].forEach(attr => {
        img.removeAttribute(attr)
    })
    return new Promise((resolve, reject) => {
        if (src === '') {
            reject('图片地址不能为空', img.outerHTML)
            return
        }
        if (src.indexOf('data:') === 0) {
            resolve(src)
            return
        }
        img.src = src

        GM_xmlhttpRequest({
            method: 'GET',
            url: src,
            responseType: 'blob',
            onload: xhr => {
                if (xhr.status !== 200) {
                    reject(xhr)
                    return
                    // return res(null)
                }
                let type = xhr.response.type

                if (!/^image\//.test(type)) {
                    console.error(
                        `Can't process "${img.src}" because its type is "${type}"`
                    )
                    resolve(img.src)
                    return
                    //return res(null)
                }

                let imgEl = new Image()
                imgEl.onload = function () {
                    let canvas = document.createElement('canvas')
                    canvas.width = imgEl.naturalWidth
                    canvas.height = imgEl.naturalHeight

                    try {
                        canvas.getContext('2d').drawImage(imgEl, 0, 0)
                        img.onload = function () {
                            resolve(img.src)
                        }
                        img.src = canvas.toDataURL(type, 0.7)
                        //res(img)
                    } catch (e) {
                        console.error(`Can't draw "${img.src}" on a canvas`, e)
                        resolve(img.src)
                        //res(null)
                    }
                }
                imgEl.onerror = () => {
                    console.warn('createObjectURL failed', src, xhr.response)
                    resolve(src)
                }
                imgEl.src = window.URL.createObjectURL(xhr.response)
            },
            onerror(err) {
                console.warn(src, 'xhr failed', err)
                resolve(src)
            }
        })
    })
}

const setAllImgsToBase64 = async (copyContent, toast) => {
    const imgs = [...copyContent.querySelectorAll('img')]
    for (let i = 0, k = imgs.length; i < k; i++) {
        const src = imgs[i].src
        toast(`正在将图片转为base64(${i + 1}/${k})`)
        await convertImgToBase64(imgs[i]).catch(err => { })
        console.log(
            `${i + 1}/${k} ${src} loaded ${imgs[i].src.indexOf('data:') === 0}`
        )
    }
}

(async () => {
    if (window === top.window) {
        let scriptContent;
        let script = document.createElement('script')
        script.id = 'xiefucai-inject-script';
        script.charset = 'utf-8';
        document.body.corsAble = true;
        document.addEventListener('getAllImgToBase64', function (e) {
            setAllImgsToBase64(e.detail.content, e.detail.toast).then(() => {
                e.detail.callback();
            }).catch((err) => {
                e.detail.callback(err);
            });
        }, false);
        script.onerror = function () {
            console.log('script on error');
            try {
                new Function(scriptContent)()
            } catch (err) {
                console.error(`执行脚本发生以下错误:\n${err.message}`)
            }
        }
        if (typeof GM_getResourceText !== 'undefined') {
            scriptContent = GM_getResourceText('injectScript');
            var blob = new Blob([scriptContent], {
                type: 'text/javascript'
            });
            var url = URL.createObjectURL(blob);
            document.body.appendChild(script);
            script.src = url;
        } else if (typeof GM.getResourceUrl !== 'undefined') {
            scriptContent = await GM.getResourceUrl('injectScript');
            script.src = scriptContent;
            document.body.appendChild(script);
        }
    }
})();[i].src
        toast(`正在将图片转为base64(${i + 1}/${k})`)
        await convertImgToBase64(imgs[i]).catch(err => { })
        console.log(
            `${i + 1}/${k} ${src} loaded ${imgs[i].src.indexOf('data:') === 0}`
        )
    }
}

if (window === top.window) {
    let scriptContent = GM_getResourceText('injectScript')
    let script = document.createElement('script')
    script.id = 'xiefucai-inject-script';
    var blob = new Blob([scriptContent], {
        type: 'text/javascript'
    });
    var url = URL.createObjectURL(blob);
    script.src = url;
    document.body.corsAble = true;
    document.addEventListener('getAllImgToBase64', function (e) {
        setAllImgsToBase64(e.detail.content, e.detail.toast).then(() => {
            e.detail.callback();
        }).catch((err) => {
            e.detail.callback(err);
        });
    }, false)

    document.body.appendChild(script);
}

/**
 * @name appFunc
 * @description 工具类函数
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T01:10:56+0800
 */
require('framework7');
var httpService = require('../services/httpService');

var appFunc = {

    isPhone: function(str) {
        var reg = /^1[34578][0-9]{9}$/;
        return reg.test(str);
    },

    isEmail: function(str) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    },

    isUndefine: function(str) {
        return str == undefined;
    },

    validatePassword: function(str) {
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/;
        return reg.test(str);
    },

    validateVerifyCodeHash: function(value, hash) {
        for (var i = value.length - 1, h = 0; i >= 0; --i) {
            h += value.toLowerCase().charCodeAt(i);
        }
        return h == hash;
    },

    renderTpl: function(markup, renderData) {
        var compiledTemplate = Template7.compile(markup);
        return compiledTemplate(renderData);
    },

    getPageNameInUrl: function(url) {
        url = url || '';
        var arr = url.split('.');
        return arr[0];
    },

    isObjectEmpty: function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },
    isArrayEmpty: function(arr) {
        var flag = true;
        for (index in arr) {　　
            if (!this.isObjectEmpty(arr[index])) {
                flag = false;
            }
        }
        return flag;
    },

    replacePhone: function(phone) {
        return phone.slice(0, 3) + '****' + phone.slice(-4);
    },

    clearLocalUserInfo: function() {
        localStorage.removeItem('TmmUserInfo');
    },
    setLocalUserInfo: function(userInfo) {
        localStorage.setItem('TmmUserInfo', JSON.stringify(userInfo));
    },
    getLocalUserInfo: function() {
        return localStorage.getItem('TmmUserInfo');
    },
    /**
     * @method removeCachedPage
     * @description 移除缓存中重复的页面
     * 
     * @param    {String} parentId 父容器的id
     * @param    {String} pageName 页面的名称，即data-page属性的值
     * 
     * @author Moore Mo
     * @datetime 2015-10-27T15:47:36+0800
     */
    removeCachedPage: function(parentId, pageName) {
        // 目前遇到的情况，暂时只需要删除一个
        var cachedPage = $$('#' + parentId).find('.page[data-page="' + pageName + '"]');
        if (cachedPage.length) {
            cachedPage[0].remove();
        }
    },
    /**
     * @method removeCachedPageNavbar
     * @description 移除缓存中重复的页面的导航栏
     * 
     * @param    {String} parentId 父容器的id
     * @param    {String} navbarId 页面导航的id
     * 
     * @author Moore Mo
     * @datetime 2015-12-17T15:16:15+0800
     */
    removeCachedPageNavbar: function(parentId, navbarId) {
        // 目前遇到的情况，暂时只需要删除一个
        var cachedNavbar = $$('#' + parentId).find('#' + navbarId);
        if (cachedNavbar.length) {
            cachedNavbar[0].remove();
        }
    },

    hideToolbar: function() {
        tmmApp.hideToolbar('.toolbar');
    },

    showToolbar: function() {
        tmmApp.showToolbar('.toolbar');
    },

    hideNavbar: function() {
        tmmApp.hideNavbar('.navbar');
    },

    showNavbar: function() {
        tmmApp.showNavbar('.navbar');
    },
    monthNames: function() {
        return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    },
    dayNames: function() {
        return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    },
    dayNamesShort: function() {
        return ['日', '一', '二', '三', '四', '五', '六'];
    },
    dateFormt: function(year, month, day) {
        var month = parseInt(month, 10) + 1;
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return year + '-' + month + '-' + day;
    },
    dateFormtDot: function(year, month, day, type) {
        var month = parseInt(month, 10) + 1;
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        if (type == 1) {
            return year + '.' + month + '.' + day;
        } else if (type == 2) {
            return '-' + month + '.' + day;
        } else if (type == 3) {
            return '-' + year + '.' + month + '.' + day;
        }
        return '';
    },
    hotelDay: function(arr) {
        var a = new Date(arr[0]).getTime();
        var b = new Date(arr[1]).getTime();
        var c = 60 * 60 * 24 * 1000;
        var res = (b - a) / c;
        return res;
    },
    timeFormat: function(ms) {

        ms = ms * 1000;

        var d_second, d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms) / 1000;
        d_days = Math.round(d / (24 * 60 * 60));
        d_hours = Math.round(d / (60 * 60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' ' + f(s.getHours()) + ':' + f(s.getMinutes()));
        }

        function f(n) {
            if (n < 10)
                return '0' + n;
            else
                return n;
        }
    },

    getCharLength: function(str) {
        var iLength = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                iLength += 2;
            } else {
                iLength += 1;
            }
        }
        return iLength;
    },

    matchUrl: function(string) {
        var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

        string = string.replace(reg, function(a) {
            if (a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1) {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
            } else {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
            }
        });
        return string;
    },

    showFromError: function(obj) {
        if (obj) {
            for (msgName in obj) {
                return obj[msgName][0];
            }
        }
        return false;
    },

    /**
     * 浅拷贝
     * @param  {[type]} newObj [description]
     * @param  {[type]} oldObj [description]
     * @return {[type]}        [description]
     */
    extend: function() {
        var prop,i,
            len = arguments.length;

        for (i=0; i<len-1; i++) {
            for (prop in arguments[i+1]) {
                arguments[0][prop] = arguments[i+1][prop];
            }
        }
        return arguments[0];
    },

    // extend: function(o1,o2) {
    //     for (var x in ox)
    // },

    /**
     * 主页跳到觅鲜页面
     * @return {[type]} [description]
     */
    goSeekFresh: function() {
        var url = 'https://wap.koudaitong.com/v2/showcase/feature?alias=129wsjuci';
        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                    'youzan_1': url
                }, function(response) {})
            });
        } else if (tmmApp.device.android) {
            window.jsObj.jumpActivity(url, 0);
        }

    },

    /**
     * 详情页面跳到觅鲜页面（老版本）
     */
    goSeekFreshDetail: function(url) {
        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                    'youzan_2': url
                }, function(response) {})
            });
        } else if (tmmApp.device.android) {
            window.jsObj.jumpActivity(url, 1);
        }
    },

    /**
     * 详情页面跳到觅鲜页面（新版本）
     */
    goSeekFreshDetail2: function(title, description, thumb_url, webpageUrl) {
        console.log(title, description, thumb_url, webpageUrl)
        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                    "youzan_3": {
                        "title": title,
                        "description": description,
                        "thumb_url": thumb_url,
                        "webpageUrl": webpageUrl
                    }
                }, function(response) {})
            });
        } else if (tmmApp.device.android) {
            window.jsObj.jumpActivity(webpageUrl, 2, title, thumb_url, webpageUrl, description);
        }
    },
    /**
     * @method freshLoginCallback
     * @description 进入有赞中的觅鲜页面，登录成功后回调
     * 
     * @param    {[type]}                 phone [description]
     * @return   {[type]}                       [description]
     * @author Moore Mo
     * @datetime 2015-12-15T16:50:12+0800
     */
    freshLoginCallback: function(phone) {
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        'appLoginName': phone
                    }, function(response) {

                    })
                });
            } else if (tmmApp.device.android) {
                // android
            }
        } catch (e) {

        }
    },

    /**
     * 退出觅鲜页面
     */
    exitSeekFresh: function() {
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        'youzan_exit': ''
                    }, function(response) {})
                });
            } else if (tmmApp.device.android) {
                window.jsObj.hindJumpActivity();
            }
        } catch (e) {

        }
    },
    /**
     * @method showMap
     * @description 显示地址导航
     * 
     * @param    {String}    city    城市
     * @param    {String}    address 详情地址
     * 
     * @author Moore Mo
     * @datetime 2015-11-16T14:16:17+0800
     */
    showMap: function(city, address, lng, lat) {

        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        'navi': address
                    }, function(response) {})
                });
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        'navi_loc': {
                            'lng': lng + '',
                            'lat': lat + '',
                            'address': address,
                            'city': city
                        }
                    }, function(response) {})
                });

            } else if (tmmApp.device.android) { // android
                window.jsObj.jumpMap(city, address);
                window.jsObj.jumpMaps(lng + '', lat + '', address, city);
            }
        } catch (e) {}
    },
    /**
     * 分享信息
     * @param  {[type]} title       [description]
     * @param  {[type]} description [description]
     * @param  {[type]} thumb_url   [description]
     * @param  {[type]} webpageUrl  [description]
     * @return {[type]}             [description]
     */
    shareMsg: function(title, description, thumb_url, webpageUrl) {
        console.log(title, description, thumb_url, webpageUrl)
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        "wx_share": {
                            "title": title,
                            "description": description,
                            "thumb_url": thumb_url,
                            "webpageUrl": webpageUrl
                        }
                    }, function(response) {})
                });
            } else if (tmmApp.device.android) {
                window.jsObj.showShare(title, '', description, thumb_url, webpageUrl, '', '');
            }
        } catch (e) {

        }
    },

    callPhone: function(str) {
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        "phone": str
                    }, function(response) {})
                });
            } else if (tmmApp.device.android) {
                window.jsObj.callPhone(str);
            }
        } catch (e) {

        }
    },

    /**
     * 申请退款
     * @return {[type]} [description]
     */
    orderRefund: function() {
        tmmApp.modal({
            text: '请拨打电话：400-019-7090 申请退款',
            title: '',
            buttons: [{
                text: '取消',
                onClick: function() {}
            }, {
                text: '立即拨打',
                bold: true,
                onClick: function() {
                    try {
                        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                    "phone": '4000197090'
                                }, function(response) {})
                            });
                        } else if (tmmApp.device.android) {
                            window.jsObj.callPhone('4000197090');
                        }
                    } catch (e) {

                    }
                }
            }]
        });
    },
    /**
     * 打电话
     * @return {[type]} [description]
     */
    activityRefund: function() {
        tmmApp.modal({
            text: '请拨打电话：400-019-7090 取消觅趣',
            title: '',
            buttons: [{
                text: '取消',
                onClick: function() {}
            }, {
                text: '立即拨打',
                bold: true,
                onClick: function() {
                    try {
                        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                    "phone": '4000197090'
                                }, function(response) {})
                            });
                        } else if (tmmApp.device.android) {
                            window.jsObj.callPhone('4000197090');
                        }
                    } catch (e) {

                    }
                }
            }]
        });
    },

    dotCallService: function(phoneNum, callPhone) {
        tmmApp.modal({
            text: '请拨打电话：' + phoneNum,
            title: '',
            buttons: [{
                text: '取消',
                onClick: function() {}
            }, {
                text: '立即拨打',
                bold: true,
                onClick: function() {
                    try {
                        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                    "phone": callPhone
                                }, function(response) {})
                            });
                        } else if (tmmApp.device.android) {
                            window.jsObj.callPhone(callPhone);
                        }
                    } catch (e) {

                    }
                }
            }]
        });
    },

    detailCallService: function(phoneNum, callPhone) {
        tmmApp.modal({
            text: '请拨打电话：' + phoneNum,
            title: '',
            buttons: [{
                text: '取消',
                onClick: function() {
                    $$(".tmm-banner-detail").css("z-index", '11000');
                    $$(".closeDeleteModal").css("z-index", '13000');
                    $$(".modal-overlay").addClass("modal-overlay-visible");
                    if ($$('body').find(".modal-overlay").hasClass('tmm-banner-detail-show-color')) {
                        $$('body').find(".tmm-banner-detail-show-color").addClass('tmm-banner-detail-show');
                    }
                }
            }, {
                text: '立即拨打',
                bold: true,
                onClick: function() {
                    try {
                        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                    "phone": callPhone
                                }, function(response) {})
                            });
                        } else if (tmmApp.device.android) {
                            window.jsObj.callPhone(callPhone);
                        }
                    } catch (e) {

                    }
                    $$(".tmm-banner-detail").css("z-index", '11000');
                    $$(".closeDeleteModal").css("z-index", '13000');
                    $$(".modal-overlay").addClass("modal-overlay-visible");
                    if ($$('body').find(".modal-overlay").hasClass('tmm-banner-detail-show-color')) {
                        $$('body').find(".tmm-banner-detail-show-color").addClass('tmm-banner-detail-show');
                    }
                }
            }]
        });
    },
    /**
     * @method closePickerModal
     * @description 关闭日历控件
     * 
     * @author Moore Mo
     * @datetime 2015-12-28T14:35:17+0800
     */
    closePickerModal: function() {
        tmmApp.closeModal('.picker-modal.modal-in');
    },
    /**
     * 显示提示消息
     * @param  {[type]} title [消息值]
     * @return {[type]}       [description]
     */
    showToast: function(title) {
        return tmmApp.modal({
            title: title || app.params.modalPreloaderTitle,
            cssClass: 'toast-modal'
        });
    },
    /**
     * 关闭提示消息
     * @return {[type]} [description]
     */
    hideToast: function() {
        tmmApp.closeModal('.modal.modal-in');
    },
    /**
     * @method autoToast
     * @description Toast消息提示，特定的时间后自动消失
     * 
     * @param    {String}  title         提示内容
     * @param    {String}  cssClassName  指定的class
     * @param    {Number}  msec          几秒后消失
     * 
     * @author Moore Mo
     * @datetime 2015-12-25T17:47:52+0800
     */
    autoToast: function(title, cssClassName, msec) {
        msec = msec || 1000;
        tmmApp.modal({
            title: title || app.params.modalPreloaderTitle,
            cssClass: cssClassName || 'toast-modal-bottom'
        });
        setTimeout(function() {
            tmmApp.closeModal('.modal.modal-in');
        }, msec);
    },
    /**
     * [showToast description]
     * @description 显示提示消息
     * 
     * @author Moore Mo
     * @datetime 2015-12-25T16:05:54+0800
     */
    showToastBootom: function(title) {
        return tmmApp.modal({
            title: title || app.params.modalPreloaderTitle,
            cssClass: 'toast-modal-bottom'
        });
    },
    /**
     * @name gotoTop
     * @description 回到顶部
     * [gotoTop description]
     * @param    {String} view 所操作的页面
     * 
     * @author Moore Mo
     * @datetime 2015-12-02T11:05:21+0800
     */
    gotoTop: function(view) {

        $$('.' + view + '-page-content').scrollTop(0, 500);
    },

    filterTool: function(oriArr, fn, context) {
        var arr = [];
        if (Array.isArray(oriArr)) {
            for (var i = 0, length = oriArr.length; i < length; i++) {
                fn.call(context, oriArr[i], i, oriArr) && arr.push(oriArr[i]);
            }
        } else {
            arr = {};

            for (var attr in oriArr) {
                fn.call(context, oriArr[attr], attr, oriArr) && (arr[attr] = oriArr[attr]);
            }
        }

        return arr;
    },

    // 获取设备的经纬度
    getDeviceLocation: function(success, error) {
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios

                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                        "getLoc": ''
                    }, function(response) {
                        // alert(response.longitude + '|' + response.latitude + '|' + response.city);
                        if (response === false || response === "false") {
                            error();
                        } else {
                            window.device.location = {
                                "lng": response.longitude,
                                "lat": response.latitude,
                                "city": response.city
                            }
                            success(window.device.location);
                        }
                    })
                });
            } else if (tmmApp.device.android) {
                window.jsObj.getAddress();

            }
        } catch (e) {

        }
    },

    toFormatNum: function(num) {
        var num = (num || 0).toString(),
            result = "";

        while (num.length > 4) {
            result = ' ' + num.slice(-4) + result;
            num = num.slice(0, num.length - 4);
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
    /**
     * @method showNumberKeyboard
     * @description 调用原生数字键盘
     * @param {Number} status 值为0'不可以调起键盘'或1'可以调起键盘'
     * 
     * @author Moore Mo
     * @datetime 2015-12-25T18:13:38+0800
     */
    showNumberKeyboard: function(status) {
        try {
            status = parseInt(status, 10);
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios

            } else if (tmmApp.device.android) { // android
                window.jsObj.controlNumKeyBord(status);
            }
        } catch (e) {

        }
    },
    /**
     * @method exitRemoveAllCookie
     * @description 退出登录时，调用android消除cookie
     * 
     * @author Moore Mo
     * @datetime 2015-12-29T15:11:17+0800
     */
    exitRemoveAllCookie: function() {
        try {
            if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios

            } else if (tmmApp.device.android) {
                window.jsObj.removeAllCookie();
            }
        } catch (e) {

        }
    },

    /**
     * 虚拟键盘
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    keyboard: function(obj) {
        var items = [],
            oSpan,
            oDiv = document.createElement('div');

        oDiv.className = 'keyboard';
        for (var i = 0; i < 12; i++) {
            oSpan = document.createElement('span');
            oSpan.index = i;
            items.push(oSpan);
            oSpan.className = 'keyboard-item';
            oDiv.appendChild(oSpan);
        };

        obj.appendChild(oDiv);

        setTimeout(function() {
            oDiv.style.transform = 'translate3d(0, 0, 0)';
            oDiv.style.webkitTransform = 'translate3d(0, 0, 0)';
        }, 0);

        // 获取哪个键盘按钮点击(1-12)
        function getTap(fn) {
            oDiv.addEventListener('click', function(e) {
                fn(e.target.index + 1);
            });
        }

        // 注销键盘
        function cancel() {
            oDiv.style.transform = 'translate3d(0, 100%, 0)';
            oDiv.style.webkitTransform = 'translate3d(0, 100%, 0)';
            setTimeout(function() {
                obj.removeChild(oDiv);
            }, 250);
        }

        return {
            cancel: cancel,
            getTap: getTap
        }

    },

    /**
     * 支付方式选择
     * @param  {[type]} id    订单ID
     * @param  {[type]} money 订单价格
     * @param  {[type]} sfn   支付宝成功回调函数
     * @param  {[type]} efn   支付宝失败回调函数
     * @param  {[type]} ffn   钱包成功回调函数(用来刷新页面)
     * @return {[type]}       [description]
     */
    payOrder: function(id, money, sfn, efn, ffn) {
        var mask = createEle('div', 'modal-mask'),
            box = createEle('div', 'pay-order-choice'),
            oTit = createEle('div', 'pay-tit'),
            oTitClose = createEle('i', 'icon ticon-close'),
            oTitSpan = createEle('span', '', '选择付款方式'),
            oWrap = createEle('div', 'pay-wrap'),
            oPayWallet = createEle('div', 'pay-item'),
            oPayZhifubao = createEle('div', 'pay-item'),
            oPayWeixin = createEle('div', 'pay-item'),
            oPayPrice = createEle('div', 'pay-price', '支付'),
            oPrice = createEle('div', 'pric-num', '￥' + money),
            oBtn = createEle('div', 'zhifubao-button', '确认'),
            oWxBtn = createEle('div', 'wx-button', '确认'),
            passwd = '',
            sendFlag = true,
            isWallet = false,
            keyboard = null;

        oTit.appendChild(oTitClose);
        oTit.appendChild(oTitSpan);
        oPayPrice.appendChild(oPrice);
        box.appendChild(oTit);
        box.appendChild(oWrap);

        oPayZhifubao.innerHTML = '<i class="zifubao"></i>支付宝<i class="icon ticon-arrow-right"></i>';
        // 添加微信支付 by Moore Mo
        oPayWeixin.innerHTML = '<i class="wx"></i>微信支付<i class="icon ticon-arrow-right"></i>';

        tmmApp.showIndicator();
        // 获取钱包余额
        httpService.getBurseInfo(function(data) {
            tmmApp.hideIndicator();
            if (data.status == 1) {
                isWallet = Number(data.data.money) > Number(money);
                popupModel(data.data.money);
            }
        }, function(data) {

        });

        // 弹出模态窗口
        function popupModel(balance) {
            if (isWallet) {

                oPayWallet.innerHTML = '<i class="icon ticon-qianbao"></i>钱包（余额' + balance + '元）<i class="icon ticon-arrow-right"></i>';
                oPayWallet.addEventListener('click', payUseWallet);
            } else {
                oPayWallet.className = 'pay-item disabled';
                oPayWallet.innerHTML = '<i class="icon ticon-qianbao"></i>钱包（余额不足）<i class="icon ticon-arrow-right"></i>'
            }
            oTitClose.addEventListener('click', closeModel);
            oPayZhifubao.addEventListener('click', payUseZhifubao);
            // 微信支付按钮绑定事件 by Moore Mo
            oPayWeixin.addEventListener('click', payUseWx);

            document.body.appendChild(mask);
            document.body.appendChild(box);
            mask.style.opacity = 1;

            payUseZhifubao();
        }

        // 支付宝付款窗口
        function payUseZhifubao() {
            oTitSpan.innerHTML = '支付宝支付';
            oWrap.innerHTML = '';
            oWrap.appendChild(oPayPrice);
            oWrap.appendChild(oPayZhifubao);
            oWrap.appendChild(oBtn);


            oPayZhifubao.removeEventListener('click', payUseZhifubao);
            oPayZhifubao.addEventListener('click', back2Pay);
            oBtn.addEventListener('click', payZhifubao);
        }

        // 微信支付窗口 by Moore Mo
        function payUseWx() {
            oTitSpan.innerHTML = '微信支付';
            oWrap.innerHTML = '';
            oWrap.appendChild(oPayPrice);
            oWrap.appendChild(oPayWeixin);
            oWrap.appendChild(oWxBtn);

            oPayWeixin.removeEventListener('click', payUseWx);
            oPayWeixin.addEventListener('click', back2Pay);
            oWxBtn.addEventListener('click', payWx);
        }

        // 返回选择支付页面
        function back2Pay() {
            oTitSpan.innerHTML = '选择付款方式';
            oWrap.innerHTML = '';
            oWrap.appendChild(oPayWallet);
            oWrap.appendChild(oPayZhifubao);
            // 目前只有微信环境里才支持微信支付
            if (appFunc.isWeixin()) {
                //oWrap.appendChild(oPayWeixin);
            }
            if (keyboard) keyboard.cancel();
            keyboard = null;
            box.className = 'pay-order-choice';
            if (isWallet) {
                oPayWallet.removeEventListener('click', back2Pay);
                oPayWallet.addEventListener('click', payUseWallet);
            }
            oPayZhifubao.removeEventListener('click', back2Pay);
            oPayZhifubao.addEventListener('click', payUseZhifubao);
            // 微信支付绑定事件 by Moore Mo
            oPayWeixin.removeEventListener('click', back2Pay);
            oPayWeixin.addEventListener('click', payUseWx);
        }

        // 关闭模态窗口
        function closeModel() {
            document.body.removeChild(box);
            mask.style.opacity = 0;
            setTimeout(function() {
                document.body.removeChild(mask);
            }, 400);
            if (keyboard) keyboard.cancel();
            keyboard = null;
        }

        // 支付宝支付窗口
        function payZhifubao() {
            var token = {
                "id": id,
                "pay_type": "1"
            }

            httpService.orderPay(token, sfn, efn);
            closeModel();
        }

        // 发送微信支付请示 by Moore Mo
        function payWx() {
            var token = {
                "id": id,
                "pay_type": "2"
            }

            httpService.orderPay(token, sfn, efn);
            closeModel();
        }

        // 钱包支付窗口
        function payUseWallet() {

            var oPasswd = createEle('div', 'passwd-wrap'),
                oPayItem,
                aPayItems = [],
                i = 0;
            passwd = '';
            oTitSpan.innerHTML = '请输入支付密码';


            oPayWallet.removeEventListener('click', payUseWallet);
            oPayWallet.addEventListener('click', back2Pay);

            oPrice.innerHTML = '￥' + money;
            for (; i < 6; i++) {
                oPayItem = createEle('div', 'passwd-item');
                oPayItem.index = i;
                aPayItems.push(oPayItem)
                oPasswd.appendChild(oPayItem);
            }

            oPayPrice.appendChild(oPrice);
            oWrap.innerHTML = '';
            oWrap.appendChild(oPayPrice);
            oWrap.appendChild(oPayWallet);
            oWrap.appendChild(oPasswd);
            box.className = 'pay-order-choice pay-wallet';

            keyboard = appFunc.keyboard(document.body);
            keyboard.getTap(function(index) {
                passwd2box(index, aPayItems);
            })
        }

        // 展示密码到窗口
        function passwd2box(index, items) {
            if (passwd.length < 6) {
                if (index == 11) {
                    passwd += 0;
                } else if (index == 12) {

                    passwd = passwd.substr(0, passwd.length - 1);

                } else if (index == 10) {

                } else {
                    passwd += index;
                }

                for (var i = 0; i < items.length; i++) {
                    if (i < passwd.length) {
                        items[i].className = 'passwd-item input';
                    } else {
                        items[i].className = 'passwd-item';
                    }
                };

            } else {
                if (index == 12) {
                    passwd = passwd.substr(0, passwd.length - 1);
                    for (var i = 0; i < items.length; i++) {
                        if (i < passwd.length) {
                            items[i].className = 'passwd-item input';
                        } else {
                            items[i].className = 'passwd-item';
                        }
                    };
                }
            }
            if (passwd.length == 6) {
                if (sendFlag) {
                    sendPasswd(passwd, items);
                    sendFlag = false;
                }

            }
        }


        // 创建元素
        function createEle(tag, name, txt) {
            var ele = document.createElement(tag);
            if (name) ele.className = name;
            if (txt) ele.innerHTML = txt;
            return ele;
        }

        // 发送支付密码
        function sendPasswd(pass, items) {

            tmmApp.showIndicator();
            var token = {
                "Password": {
                    "_pwd": pass
                }
            }

            httpService.sendPayPasswd(token, id, function(data) {
                tmmApp.hideIndicator();
                var msg = '';

                if (data.status == 1) {
                    if (data.data.value == 1) {
                        if (data.data.status.value == 1) {
                            // 支付成功
                            msg = data.data.status.info;
                            tmmApp.alert(msg, function() {
                                closeModel()
                                if (ffn) ffn(data);
                            });

                            return;
                        } else {
                            msg = data.data.status.info;
                        }
                    } else {
                        msg = data.data.name;
                    }
                } else {
                    msg = '支付失败';
                }
                passwd = '';
                passwd2box(10, items);
                tmmApp.alert(msg);
                sendFlag = true;
            }, function(data) {
                tmmApp.hideIndicator();
                tmmApp.alert('网络错误');
                sendFlag = true;
            });
        }

    },


    /**
     * 固定div高度
     * @param  {[type]} ele    元素对象
     * @param  {[type]} h 元素锁定高度
     * @return {[type]}        如果超出返回真实高度，没有返回0
     */
    lockHeight: function(ele, h) {
        ele.style.height = 'auto';
        var height = parseInt(window.getComputedStyle(ele).height);

        if (height > h) {
            ele.style.height = h + 'px';
            return height;
        } else {
            return 0;
        }

    },
    /**
     * 转换高度
     * @param  {[type]} ele  元素
     * @return {[type]}      [description]
     */
    transitionHeight: function(ele, h) {
        var height = window.getComputedStyle(ele).height;
        if (h) {
            ele.style.height = h;
        } else {
            ele.style.height = "auto";
        }
    },
    /**
     * @method isWeixin
     * @description 判断是否是微信环境
     * 
     * @return   {Boolean}
     * 
     * @author Moore Mo
     * @datetime 2016-02-24T15:03:32+0800
     */
    isWeixin: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 返回浏览器前缀样式
     */
    _elementStyle: document.createElement('div').style,
    prefixStyle: function(style) {
        var prefixs = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
            transform,
            i = 0,
            l = prefixs.length;
        for (; i<l; i++) {
            transform = prefixs[i] + 'ransform';
            if (transform in appFunc._elementStyle) break;
        }
        if (i === 0) return style;
        return prefixs[i] + style.substr(1);
    },

    /**
     * 合并线的上午下午为一天
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */
    mergeLineDay: function(list) {
        var result = {},
            dayArray = ['第一天','第二天','第三天','第四天','第五天','第六天','第七天','第八天','第九天','第十天'],
            tmpNum, x;
         
        for (x in list) {

            tmpNum = Math.ceil((x*1+1) / 2);

            if (tmpNum in result) {
                result[tmpNum].dot_list = result[tmpNum].dot_list.concat(list[x].dot_list);
            } else {
                result[tmpNum] = list[x];
            }
            result[tmpNum].descript_day = dayArray[tmpNum - 1];

        }

        return result;
        
    },

    mergeLineOrder: function(obj) {
        var result = {},
            dayArray = ['第一天','第二天','第三天','第四天','第五天','第六天','第七天','第八天','第九天','第十天'],
            tmpNum, x;

        for (x in obj) {

            tmpNum = Math.ceil((x*1+1) / 2);

            if (tmpNum in result) {
                result[tmpNum].dot_list = result[tmpNum].dot_list.concat(obj[x].dot_list);
            } else {
                result[tmpNum] = obj[x];
            }
            result[tmpNum].descript_day = dayArray[tmpNum - 1];

        }

        return result;
    },

    

    bindEvents: function(bindings) {
        for (var i in bindings) {
            if (bindings[i].selector) {
                $$(bindings[i].element)
                    .off(bindings[i].event, bindings[i].selector, bindings[i].handler);
                $$(bindings[i].element)
                    .on(bindings[i].event, bindings[i].selector, bindings[i].handler);
            } else {
                $$(bindings[i].element)
                    .off(bindings[i].event, bindings[i].handler);
                $$(bindings[i].element)
                    .on(bindings[i].event, bindings[i].handler);
            }
        }
    }

};

module.exports = appFunc;

/**
 * @name appFunc
 * @description 工具类函数
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T01:10:56+0800
 */
require('framework7');

module.exports = {

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

  isEmpty: function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  },
  isArrayEmpty: function(arr) {
    var flag = true;
    for (index in arr) {　　
      if (!this.isEmpty(arr[index])) {
        flag = false;
      }
    }
    return flag;
  },
  clearLocalUserInfo: function() {
    localStorage.removeItem('TmmUserInfo');
  },
  setLocalUserInfo: function(userInfo) {
    localStorage.setItem('TmmUserInfo', JSON.stringify(userInfo));
  },
  getLocalUserInfo: function(phone) {
    return localStorage.getItem('TmmUserInfo');
  },
  /**
   * @method removeCachedView
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
    // 1.2.2版ios暂时取消"立即拨打功能"
    try {
      if (tmmApp.device.android) {
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
              window.jsObj.callPhone('4000197090');
            }
          }]
        });

      } else {
        tmmApp.modal({
          text: '请拨打电话：400-019-7090 申请退款',
          title: '',
          buttons: [{
            text: '取消',
            onClick: function() {}
          }]
        });
      }
    } catch (e) {

    }
  },
  /**
   * 打电话
   * @return {[type]} [description]
   */
  activityRefund: function() {
    // 1.2.2版ios暂时取消"立即拨打功能"
    try {
      if (tmmApp.device.android) {
        tmmApp.modal({
          text: '请拨打电话：400-019-7090 取消活动',
          title: '',
          buttons: [{
            text: '取消',
            onClick: function() {}
          }, {
            text: '立即拨打',
            bold: true,
            onClick: function() {
              window.jsObj.callPhone('4000197090');
            }
          }]
        });

      } else {
        tmmApp.modal({
          text: '请拨打电话：400-019-7090 取消活动',
          title: '',
          buttons: [{
            text: '取消',
            onClick: function() {}
          }]
        });
      }
    } catch (e) {

    }
  },

  dotCallService: function(phoneNum, callPhone) {
    // 1.2.2版ios暂时取消"立即拨打功能"
    try {
      if (tmmApp.device.android) {
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
              window.jsObj.callPhone(callPhone);
            }
          }]
        });
      } else {
        tmmApp.modal({
          text: '请拨打电话：' + phoneNum,
          title: '',
          buttons: [{
            text: '取消',
            onClick: function() {}
          }]
        });
      }
    } catch (e) {

    }


  },

  detailCallService: function(phoneNum, callPhone) {

    // 1.2.2版ios暂时取消"立即拨打功能"
    try {
      if (tmmApp.device.android) {
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
      } else {
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
          }]
        });
      }
    } catch (e) {

    }
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

  bindEvents: function(bindings) {
    for (var i in bindings) {
      if (bindings[i].selector) {
        $$(bindings[i].element)
          .off(bindings[i].event, bindings[i].selector, bindings[i].handler);
        $$(bindings[i].element)
          .on(bindings[i].event, bindings[i].selector, bindings[i].handler);
      } else {
        $$(bindings[i].element)
          .off(bindings[i].event, bindings[i].selector, bindings[i].handler);
        $$(bindings[i].element)
          .on(bindings[i].event, bindings[i].handler);
      }
    }
  }

};

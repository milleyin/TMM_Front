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
  setLocalUserInfo: function(phone) {
    localStorage.setItem('TmmUserInfo', phone);
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
    tmmApp.hideToolbar('.navbar');
  },

  showNavbar: function() {
    tmmApp.showToolbar('.navbar');
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
   * 详情页面跳到觅鲜页面
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
    }catch(e) {
     
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

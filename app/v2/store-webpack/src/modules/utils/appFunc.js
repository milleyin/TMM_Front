/**
 * @name appFunc
 * @description 工具类函数
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T01:10:56+0800
 */
require('framework7');

module.exports = {

  apiUrl: 'http://test.365tmm.net',

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

  hideToolbar: function() {
    tmmApp.hideToolbar('.toolbar');
  },

  showToolbar: function() {
    tmmApp.showToolbar('.toolbar');
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

  bindEvents: function(bindings) {
    for (var i in bindings) {
      if (bindings[i].selector) {
        $$(bindings[i].element)
          .on(bindings[i].event, bindings[i].selector, bindings[i].handler);
      } else {
        $$(bindings[i].element)
          .on(bindings[i].event, bindings[i].handler);
      }
    }
  }

};

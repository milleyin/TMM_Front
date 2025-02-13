angular.module('appFunc', [])

.factory('appFunc', function($ionicPopup) {
  return {
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
    alert: function(msg) {
      return $ionicPopup.alert({ 'title': msg, cssClass: 'tmm-ionic-alert', okText: '确定' });
    }
  };
})

.factory('tmmCache', function() {
  var oData = {};
  return {
    set: function(key, val) {
      val = val || '';
      oData[key] = val;
    },
    get: function(key) {
      oData[key] = oData[key] || '';
      return oData[key];
    },
    clean: function(key) {
      delete oData[key];
    },
    cleanAll: function() {
      oData = {};
    }
  };
})

.factory('modify', function() {
  return {
    isModify: false
  }
})

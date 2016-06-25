'use strict';
angular.module('tmm.services')
  /**
   * @ngdoc function
   * @name tmmUtil.log
   *
   * @description Log a message and fire a ga event
   *
   * @param {string}   type  type of message
   * @param {string}   action action to send to google analytics
   *
   *
   */
  .factory('log', function(sessionData) {
    return {
      info: function(msg, data1, data2, data3, data4, data5) {
        if (sessionData.locData.debug) {
          var now = new Date();
          var diff = now.getTime() - sessionData.locData.startTime;
          msg = msg || 'info';
          data1 = data1 || '';
          data2 = data2 || '';
          data3 = data3 || '';
          data4 = data4 || '';
          data5 = data5 || '';
          console.log('(ms ' + diff + ') ' + msg, data1, data2, data3, data4, data5);
        }
      },
      error: function(msg, data1, data2, data3, data4, data5) {
        if (sessionData.locData.debug) {
          msg = msg || 'error';
          data1 = data1 || '';
          data2 = data2 || '';
          data3 = data3 || '';
          data4 = data4 || '';
          data5 = data5 || '';
          console.log('ERROR - ' + msg, data1, data2, data3, data4, data5)
        }
      }
    }
  })
  /**
   * @ngdoc object
   * @name tmmUtil.sessionData
   *
   * @description Provides a global object to store session data
   *
   */
  .factory('sessionData', function() {
    var startTime = new Date();

    var retObj = {
      locData: {
        version: '2.0.0',
        debug: true,
        startTime: startTime.getTime(),
        initialized: false,
        backUrl: null,
        apiHost: 'http://test2.365tmm.net'
          //apiHost: 'https://m.365tmm.com'
      }
    };
    return retObj;
  })
  /**
   * @ngdoc factory
   * @name tmmUtil.tmmCache
   *
   * @description factory, data transmission between two controller
   */
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

/**
 * @ngdoc factory
 * @name tmmUtil.PtrService
 * @description 实现代码触发下拉刷新
 * 
 * @author Moore Mo
 * @datetime 2015-11-23T12:27:10+0800
 */
.service('PtrService', function($timeout, $ionicScrollDelegate, log) {
  /**
   * Trigger the pull-to-refresh on a specific scroll view delegate handle.
   * @param {string} delegateHandle - The `
   * delegate-handle` assigned to the `ion-content` in the view.
   */
  this.triggerPtr = function(delegateHandle) {

    $timeout(function() {
      var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();
      if (!scrollView) return;

      scrollView.__publish(
        scrollView.__scrollLeft, -scrollView.__refreshHeight,
        scrollView.__zoomLevel, true);

      var d = new Date();

      scrollView.refreshStartTime = d.getTime();

      scrollView.__refreshActive = true;
      scrollView.__refreshHidden = false;
      if (scrollView.__refreshShow) {
        scrollView.__refreshShow();
      }
      if (scrollView.__refreshActivate) {
        scrollView.__refreshActivate();
      }
      if (scrollView.__refreshStart) {
        scrollView.__refreshStart();
      }

    });
  };
})

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
      $ionicPopup.alert({'title': msg});
    }
  };
});

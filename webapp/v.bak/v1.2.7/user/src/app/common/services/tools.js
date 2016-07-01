angular.module('tools', [])

.service('autoRefresh', function($timeout, $ionicScrollDelegate) {
  this.start = function(delegateHandle) {

    $timeout(function() {

      var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

      if (!scrollView) return;

      scrollView.triggerPullToRefresh();
      scrollView.__refreshShow();
      scrollView.__refreshActivate();

    });

  };

})

.factory('backStep', function() {
  return {
    step: -1
  }
})


.factory('removeBackView', function($ionicHistory) {
  return {
    remove: function() {
      var self = $ionicHistory;
      var viewHistory = self.viewHistory();
      var currentHistory = viewHistory.histories[self.currentHistoryId()];
      var currentCursor = currentHistory.cursor;

      var currentView = currentHistory.stack[currentCursor];
      var backView = currentHistory.stack[currentCursor - 1];
      var replacementView = currentHistory.stack[currentCursor - 2];
      if (!backView || !replacementView) {
        return;
      }

      currentHistory.stack.splice(currentCursor - 1, 1);
      self.clearCache([backView.viewId]);

      currentView.backViewId = replacementView.viewId;
      currentView.index = currentView.index - 1;
      replacementView.forwardViewId = currentView.viewId;

      viewHistory.backView = replacementView;
      currentHistory.currentCursor += -1;
    }
  }
})

//储存登录用户
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

.filter('trustHtml', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
})

.filter('html2Txt', function() {
  return function(html) {
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
  }
})

.factory('appFunc', function($ionicPopup, $ionicLoading) {
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
      /*$ionicPopup.alert({'title': msg});*/
      return $ionicPopup.alert({ 'title': msg, cssClass: 'tmm-ionic-alert', okText: '确定' });
    },
    tipMsg: function(msg, time) {
      time = time ? time : 1000;
      $ionicLoading.show({
        template: msg,
        duration: time,
        noBackdrop: true
      });
    },
    // 合并线与活动的天数
    mergeLineDay: function(list) {

      var result = {},
        dayArray = ['第一天', '第二天', '第三天', '第四天', '第五天', '第六天', '第七天', '第八天', '第九天', '第十天'],
        tmpNum, x;

      for (x in list) {

        tmpNum = Math.ceil((x * 1 + 1) / 2);
        if (tmpNum in result) {
          result[tmpNum].dot_list = result[tmpNum].dot_list.concat(list[x].dot_list);
        } else {
          result[tmpNum] = list[x];
        }
        result[tmpNum].descript_day = dayArray[tmpNum - 1];

      }
      return result;
    },
    confirm: function(msg, fn) {
      $ionicPopup.confirm({
        template: msg,
        cssClass: 'tmm-ionic-confirm',
        buttons: [{
          text: '取消',
        }, {
          text: '<a>确定</a>',
          onTap: function(e) {
            fn();
          }
        }]
      });
    },
    // 格式化数字
    toFormatNum: function(num) {
      num = (num || 0).toString();
      var result = "";

      while (num.length > 4) {
        result = ' ' + num.slice(-4) + result;
        num = num.slice(0, num.length - 4);
      }
      if (num) {
        result = num + result;
      }
      return result;
    },

    // 拨打电话
    tmmCallPhone: function(callNum, phonePrompt) {
      var confirmPopup = $ionicPopup.confirm({
        template: '请拨打电话' + callNum + phonePrompt,
        cssClass: 'tmm-ionic-confirm',
        buttons: [{
          text: '取消',
          type: 'button-default',
        }, {
          text: '<a href="tel:' + callNum + '">立即拨打</a>',
          type: 'button-default',
          onTap: function(e) {
            return false;
            var isIPad = ionic.Platform.isIPad();
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            try {
              if (isIPad || isIOS) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                  bridge.callHandler('ObjcCallback', {
                    "phone": callNum
                  }, function(response) {})
                });
              } else if (isAndroid) { //Android
                window.jsObj.callPhone(callNum);
              }
            } catch (e) {

            }
          }
        }]
      });
    },

    /*tmmWxCallPhone: function(phoneNumber) {
      var confirmPopup = $ionicPopup.alert({
        title: '<a href="tel:'+phoneNumber+'">点击拨打电话'+phoneNumber+'</a>',
        cssClass: 'tmm-ionic-alert',
        okText: '取消'
      });
      return confirmPopup;

    }*/
  };
});

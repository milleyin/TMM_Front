'use strict';

/**
 * @ngdoc function
 * @name shareActiveApp.controller:AboutCtrl
 * @description
 * # ApplyCtrl
 * Controller of the shareActiveApp
 */
angular.module('shareActiveApp')

.controller('ApplyCtrl', function($http,$location, $routeParams ,$rootScope,ENV, indicator) {
  var self = this;
  var id = $routeParams.id
  var api = ENV.apiEndpoint + '/index.php?r=api/attend/create&id=' + id;
  var api_code = ENV.apiEndpoint + "/index.php?r=api/attend/captcha_sms&id=" + id;
  self.mainRetinueInfo = { name: '', phone: '', code: '' };
  self.adultRetinueInfo = [];
  self.childRetinueInfo = [];
  self.adultNum = 1;
  self.childNum = 0;

  self.goIndex = function() {

    $location.path('/'+id)
  }

  function mergedata() {
    var i = 0,
      tmp = [],
      token = {
        "Attend": [{
          "sms": self.mainRetinueInfo.code, //短信验证码 
          "name": self.mainRetinueInfo.name, //报名人姓名
          "phone": self.mainRetinueInfo.phone, //报名手机号 获取短信的手机号
          "people": self.adultRetinueInfo.length + 1, //成人数量 包含自己 （报名人员默认成人）
          "children": self.childRetinueInfo.length //儿童 数量
        }]
      };

    for (i = 0; i < self.adultRetinueInfo.length; i++) {
      self.adultRetinueInfo[i].is_people = 1;
      tmp.push(self.adultRetinueInfo[i])

    }

    for (i = 0; i < self.childRetinueInfo.length; i++) {
      self.childRetinueInfo[i].is_people = 0;
      tmp.push(self.childRetinueInfo[i])
    }

    token.Attend = token.Attend.concat(tmp);
    return token;
  }

  function checkForm() {
    var inputList = angular.element(document.querySelectorAll('.apply input'))
    inputList.removeClass('has-error')

    for (var i = 0; i < inputList.length; i++) {
      var ele = angular.element(inputList[i])
      var type = ele.attr('data-type')
      var value = ele.val();

      if (type == 'name') {
        if (value === '') {
          indicator.statusbar('姓名不能为空')
          ele.addClass('has-error')
          return false;
        } else if (value.length > 10) {
          indicator.statusbar('姓名长度不能大于10个字符')
          ele.addClass('has-error')
          return false;
        }

      } else if (type == 'phone') {
        if (value === '') {
          indicator.statusbar('手机号码不能为空')
          ele.addClass('has-error')
          return false;
        } else if (!/^1[34578][0-9]{9}$/.test(value)) {
          indicator.statusbar('手机号码格式有误')
          ele.addClass('has-error')
          return false;
        }
      } else if (type == 'code') {
        if (value === '') {
          indicator.statusbar('短信验证码不能为空')
          ele.addClass('has-error')
          return false;
        }
      }
    }
    return true;
  }

  self.countPeople = function(e) {
    // indicator.statusbar();
    var type = angular.element(e.target).attr('data-count');

    switch (type) {
      case 'sub-adult':
        if (2 * self.adultNum == self.childNum + 1 || 2 * self.adultNum == self.childNum) {
          indicator.statusbar('一个成人只能带两个儿童')
          return;
        } else if (self.adultNum === 1) {
          indicator.statusbar('至少一个成人参加活动')
          return;
        }
        self.adultNum--;
        self.adultRetinueInfo.pop();
        break;
      case 'add-adult':
        self.adultNum++;
        self.adultRetinueInfo.push({ name: '', phone: '' });
        break;
      case 'sub-child':
        if (self.childNum === 0) {
          return;
        }
        self.childNum--;
        self.childRetinueInfo.pop();
        break;
      case 'add-child':
        if (2 * self.adultNum === self.childNum) {
          indicator.statusbar('一个成人只能带两个儿童')
          return;
        }
        self.childNum++;
        self.childRetinueInfo.push({ name: '' });
        break;
    }

  };

  self.getCode = function(e) {
    if (self.mainRetinueInfo.phone === '') {
      indicator.statusbar('请输入手机号码');
      return;
    } else if (!/^1[34578][0-9]{9}$/.test(self.mainRetinueInfo.phone)) {
      indicator.statusbar('手机号码格式有误');
      return;
    }

    var ele = angular.element(e.target);
    var i = 60;
    if (ele.hasClass('gray')) {
      return;
    }
    ele.addClass('gray');
    ele.html('获取验证码(' + i + ')');
    var timer = setInterval(function() {
      i--;
      ele.html('获取验证码(' + i + ')');
      if (i === 1) {
        ele.removeClass('gray');
        ele.html('获取验证码');

        clearInterval(timer);
      }

    }, 1000);


    var token = {
      "phone": self.mainRetinueInfo.phone
    };
    $http.get(api_code + '&csrf=csrf').success(function(data) {

      token.TMM_CSRF = data.data.csrf.TMM_CSRF;
      $http.post(api_code, token).success(function(data) {
        if (data.status == 1) {

        } else {
          if (data.form) {
            for (var msgName in data.form) {
              indicator.statusbar(data.form[msgName][0]);
              break;
            }
          } else {
            indicator.statusbar('网络超时，请重试');
          }
          clearInterval(timer)
          ele.removeClass('gray');
          ele.html('获取验证码')
        }
      }).error(function(data) {
        indicator.statusbar('网络超时，请重试');
        clearInterval(timer)
        ele.removeClass('gray');
        ele.html('获取验证码')
      });
    }).error(function(data) {
      indicator.statusbar('网络超时，请重试');
      clearInterval(timer)
      ele.removeClass('gray');
      ele.html('获取验证码')
    })
  };

  function loadApp() {
    self.goIndex();
    $rootScope.loadApp();
  }

  self.submit = function() {

    if (!checkForm()) return;

    var token = mergedata();

    $http.get(api + '&csrf=csrf').success(function(data) {
      token.TMM_CSRF = data.data.csrf.TMM_CSRF;
      $http.post(api, token).success(function(data) {
        if (data.status == 1) {
          indicator.alert({
            title: '报名成功，您可以登录APP查看此次报名信息或查看更多觅趣！',
            confirmFn: loadApp,
            cancelFn: self.goIndex,
            confirmTxt: '下载APP',
            cancelTxt: '返回'
          });
        } else {
          if (data.form) {
            for (var msgName in data.form) {
              for (var attr in data.form[msgName]) {
                indicator.statusbar(data.form[msgName][attr][0]);
                break;
              }
              break;
            }
          } else {
            indicator.statusbar('网络超时，请重试');
          }
        }

      }).error(function(data) {
        indicator.statusbar('网络超时，请重试');
      })
    }).error(function(data) {
      indicator.statusbar('网络超时，请重试');
    })

  }





})

.factory('indicator', function($document, $timeout, $animate, $compile, $rootScope) {
  var statusbarHUD = null;
  var alertHUD = null;
  return {
    statusbar: function(opts) {
      if (statusbarHUD !== null) return;
      if (typeof opts === 'string') {
        opts = {
          title: opts
        }
      }
      var setting = angular.extend({
        title: '系统消息',
        cssClass: 'statusbar',
        delay: 2000,
        isMask: false
      }, opts);

      statusbarHUD = angular.element('<div class="' + setting.cssClass + '">' + setting.title + '</div>');
      statusbarHUD.addClass('std-begin-enter');
      $document.find('body').append(statusbarHUD);
      $animate.addClass(statusbarHUD, 'std-end-enter');

      $timeout(function() {
        $animate.removeClass(statusbarHUD, 'std-end-enter').then(function() {
          statusbarHUD.remove();
          statusbarHUD = null;

        });
      }, setting.delay);


    },

    alert: function(opts) {
      var scope = $rootScope.$new(true);
      var setting = angular.extend({
        title: '系统消息',
        confirmTxt: '确认',
        cancelTxt: '取消',
        confirmFn: function() {},
        cancelFn: function() {},
        cssClass: '',
        isMask: true
      }, opts);
      $rootScope.$on('$routeChangeSuccess', function() {

        scope.destory();
      });

      var mask = angular.element('<div class="mask"></div');


      var template = '<div class="alertmodal' + setting.cssClass + '">' +
        '<div class="title">' + setting.title + '</div>' +
        '<div ng-click="cancel()" class="cancel">' + setting.cancelTxt + '</div>' +
        '<div ng-click="confirm()" class="confirm">' + setting.confirmTxt + '</div>' +
        ' </div>';

      scope.confirm = function() {
        scope.destory();
        setting.confirmFn();
      }
      scope.cancel = function() {
        scope.destory();
        setting.cancelFn();

      }

      scope.destory = function() {
        ele.remove();
        mask.remove();
        scope.$destroy();

      }

      var ele = $compile(template)(scope);

      $document.find('body').append(mask).append(ele);

    }
  };
});

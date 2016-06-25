'use strict';
angular.module('tmm.controllers')
  /**
   * @ngdoc Controller
   * @name LoginCtrl
   * @description 登录控制器
   * 
   * @author Moore Mo
   * @datetime 2015-12-03T16:47:20+0800
   */
  .controller('LoginCtrl', function($rootScope, $scope, $state, log, Tabs, sessionData, getVerifycode, login) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      // 进入页面之前, 设置导航栏状态为隐藏，并通知MainCtrl更新导航栏状态
      Tabs.setState(true);
      $rootScope.$broadcast('updateState');
    });
  })

/**
 * @ngdoc Controller
 * @name LoginCtrl
 * @description 帐号密码登录控制器
 * 
 * @author Moore Mo
 * @datetime 2015-12-03T16:49:46+0800
 */
.controller('AccLoginCtrl', function(
  $rootScope,
  $scope,
  $state,
  $location,
  $ionicPopup,
  log,
  Tabs,
  sessionData,
  getVerifycode,
  login,
  appFunc) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // 进入页面之前, 设置导航栏状态为隐藏，并通知MainCtrl更新导航栏状态
    Tabs.setState(true);
    $rootScope.$broadcast('updateState');
  });

  $scope.accLoginData = {
    'csrf': '',
    'verifyCodeUrl': '',
    'g_hash': ''
  };

  $scope.loginModel = {
    'phone': '18127005181',
    'password': '1234qwer',
    'verifycode': ''
  };
  // 显示验证码
  $scope.showVerifyCode = function() {
    getVerifycode(
      function(csrf, dataRes, statusCode) {
        $scope.accLoginData.csrf = csrf;
        $scope.accLoginData.g_hash = dataRes.hash1;
        $scope.accLoginData.verifyCodeUrl = sessionData.locData.apiHost + dataRes.url;
      },
      function(dataRes, statusCode) {
        // 错误提示
      }
    );
  };
  // 手机密码登录
  $scope.accLogin = function() {
    var data = {
      "UserLoginForm": {
        "phone": $scope.loginModel.phone,
        "password": $scope.loginModel.password,
        "verifyCode": $scope.loginModel.verifycode
      },
      "TMM_CSRF": $scope.accLoginData.csrf
    };

    if (!appFunc.isPhone($scope.loginModel.phone)) {
      appFunc.alert('手机号码格式不对');
    } else if (!appFunc.validatePassword($scope.loginModel.password)) {
      appFunc.alert('密码必须有数字和字母组合');
    } else if ($scope.loginModel.verifycode == '') {
      appFunc.alert('验证码不能为空');
    } else if (!appFunc.validateVerifyCodeHash($scope.loginModel.verifycode, $scope.accLoginData.g_hash)) {
      appFunc.alert('验证码不正确');
      $scope.showVerifyCode();
    } else {
      login(
        data,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $location.path('/tab/my');
          } else {
            // 验证表单错误时的提示
            if (dataRes.form) {
              for (var msgName in dataRes.form) {
                if (msgName == 'UserLoginForm_verifyCode') {
                  $scope.showVerifyCode();
                }
                appFunc.alert(dataRes.form[msgName][0]);
              }
            } else {
              appFunc.alert('输入有误，请重试');
            }
          }
        },
        function(dataRes, statusCode) {
          appFunc.alert('网络超时，请重试');
        }
      );
    }
  };

  $scope.showVerifyCode();

  log.info('accLoginCtrl...');
})

/**
 * @ngdoc Controller
 * @name LoginCtrl
 * @description 手机号快捷登录控制器
 * 
 * @author Moore Mo
 * @datetime 2015-12-03T16:50:16+0800
 */
.controller('MobLoginCtrl', function(
  $rootScope,
  $scope,
  $state,
  $timeout,
  log,
  Tabs,
  sessionData,
  getVerifycode,
  login,
  loginCaptachSms,
  appFunc) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // 进入页面之前, 设置导航栏状态为隐藏，并通知MainCtrl更新导航栏状态
    Tabs.setState(true);
    $rootScope.$broadcast('updateState');
  });

  $scope.mobLoginData = {
    'csrf': '',
    'verifyCodeUrl': '',
    'g_hash': '',
    'codeText': '获取验证码',
    'isDisabled': false
  };

  $scope.loginModel = {
    'phone': '18127005181',
    'verifycode': 'ssdf',
    'msgcode': ''
  };
  // 60秒倒计时
  var waitTime = 60;
  var getCodeTimeOut = function() {
    log.info('获取验证码...waitTime...', waitTime);
    if (waitTime == 0) {
      // 60秒到后解锁按钮,使其可点击
      $scope.mobLoginData.isDisabled = false;
      // 重置文本信息
      $scope.mobLoginData.codeText = '获取验证码';
      // 重置回60秒
      waitTime = 60;
    } else {
      // 锁定按钮,使其不可点击
      $scope.mobLoginData.isDisabled = true;
      // 倒计时提示文本
       $scope.mobLoginData.codeText = waitTime + '秒后重试';
      // 倒计时自减
      waitTime--;
      // 每秒回调
      $timeout(function() {
        getCodeTimeOut();
      }, 1000);
    }
  };
  // 控制锁定按钮
  $scope.canSend = function() {
    return $scope.mobLoginData.isDisabled;
  };
  // 显示验证码
  $scope.showVerifyCode = function() {
    getVerifycode(
      function(csrf, dataRes, statusCode) {
        $scope.mobLoginData.csrf = csrf;
        $scope.mobLoginData.g_hash = dataRes.hash1;
        $scope.mobLoginData.verifyCodeUrl = sessionData.locData.apiHost + dataRes.url;
      },
      function(dataRes, statusCode) {
        // 错误提示
      }
    );
  };
  // 手机密码登录
  $scope.mobLogin = function() {
    var data = {
      "UserSmsLoginForm": {
        "phone": $scope.loginModel.phone,
        "sms": $scope.loginModel.msgcode,
        "verifyCode": $scope.loginModel.verifycode
      },
      "TMM_CSRF": $scope.mobLoginData.csrf
    };

    if (!appFunc.isPhone($scope.loginModel.phone)) {
      appFunc.alert('手机号码格式不对');
    } else if ($scope.loginModel.verifycode == '') {
      appFunc.alert('图形验证码不能为空');
    } else if ($scope.loginModel.msgcode == '') {
      appFunc.alert('短信验证码不能为空');
    } else {
      login(
        data,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $location.path('/tab/my');
          } else {
            // 验证表单错误时的提示
            if (dataRes.form) {
              for (var msgName in dataRes.form) {
                if (msgName == 'UserSmsLoginForm_verifyCode') {
                  $scope.showVerifyCode();
                }
                appFunc.alert(dataRes.form[msgName][0]);
              }
            } else {
              appFunc.alert('输入有误，请重试');
            }
          }
        },
        function(dataRes, statusCode) {
          appFunc.alert('网络超时，请重试');
        }
      );
    }
  };
  // 获取手机验证码
  $scope.getMsgCode = function() {
    if (!appFunc.isPhone($scope.loginModel.phone)) {
      appFunc.alert('手机号码格式不对');
    } else if ($scope.loginModel.verifycode == '') {
      appFunc.alert('图形验证码不能为空');
    } else {
      // 要发送的表单数据
      var data = {
        "phone": $scope.loginModel.phone,
        "verifyCode": $scope.loginModel.verifycode,
        "TMM_CSRF": $scope.loginModel.csrf
      };

      getCodeTimeOut();

      // loginCaptachSms(
      //   function(dataRes, statusCode) {
      //     if (dataRes.status == 1) {

      //     }
      //   },
      //   function(dataRes, statusCode) {

      //   }
      // );


    }
  };

  // 显示验证码
  $scope.showVerifyCode();

  log.info('LoginCtrl...');
});

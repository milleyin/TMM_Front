angular.module('login', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.login', {
      url: '/login',
      templateUrl: 'app/login/templates/login.html',
      controller: 'LoginCtrl',
    });

}])

.controller('LoginCtrl', function($scope, $http, $timeout, $location, ENV, Resource, appFunc) {
  //控制登录方式显示
  $scope.accLoginShow = true;
  $scope.mobileLogin = false;
  accLoginView();
  $scope.showLogin = function(type){
    if(type == 1) {
      $scope.accLoginShow = true;
      $scope.mobileLogin = false;
      accLoginView();
    } else if(type == 2){
      $scope.accLoginShow = false;
      $scope.mobileLogin = true;
      mobileLoginView();
    }
  };

  function accLoginView() {
    //账号密码登录
    $scope.accLoginData = {
      'verifyCodeUrl': '',
      'g_hash': ''
    };

    $scope.loginModel = {
      'phone': '13632846019',
      'password': '1234qwer',
      'verifycode': ''
    };

    // 显示账号密码登录的验证码
    $scope.showAccVerifyCode = function() {
      Resource.showAccCode().then(function(dataRes) {
        $http.get(ENV.apiEndpoint + dataRes.verifyCode).success(function(dataRes) {
          $scope.accLoginData.g_hash = dataRes.hash1;
          $scope.accLoginData.verifyCodeUrl = ENV.apiEndpoint + dataRes.url;
        }, function(dataRes) {
            
        });
        $scope.$broadcast('scroll.refreshComplete');
      }, function(dataRes) {
        $scope.$broadcast('scroll.refreshComplete');
      });

    };
    
    // 手机密码登录
    $scope.accLogin = function() {
      var accData = {
        "UserLoginForm": {
          "phone": $scope.loginModel.phone,
          "password": $scope.loginModel.password,
          "verifyCode": $scope.loginModel.verifycode
        }
      };

      if (!appFunc.isPhone($scope.loginModel.phone)) {
        appFunc.alert('手机号码格式不对');
      } else if (!appFunc.validatePassword($scope.loginModel.password)) {
        appFunc.alert('密码必须有数字和字母组合');
      } /*else if ($scope.loginModel.verifycode === '') {
        appFunc.alert('验证码不能为空');
      } else if (!appFunc.validateVerifyCodeHash($scope.loginModel.verifycode, $scope.accLoginData.g_hash)) {
        appFunc.alert('验证码不正确');
        $scope.showAccVerifyCode();
      }*/ else {
        Resource.accLogin(accData).then(function(dataRes) {
          $location.path('/my');
        }, function(dataRes) {
          if (dataRes.form) {
            for (var msgName in dataRes.form) {
              if (msgName == 'UserLoginForm_verifyCode') {
                $scope.showAccVerifyCode();
              }
              appFunc.alert(dataRes.form[msgName][0]);
            }
          } else {
            if(dataRes.msg) {
              appFunc.alert(dataRes.msg);
              $scope.showAccVerifyCode();
            } else {
              appFunc.alert('输入有误，请重试');
            }
          }

        });
      }
    };

    $scope.showAccVerifyCode();
  }

  function mobileLoginView() {
    //快捷方式登录
    $scope.mobLoginData = {
      'csrf': '',
      'verifyCodeUrl': '',
      'g_hash': '',
      'codeText': '获取验证码',
      'isDisabled': false
    };

    $scope.mobLoginModel = {
      'phone': '',
      'verifycode': '',
      'msgcode': ''
    };

    //获取图形验证码60秒不可以点
    var waitTime = 60;
    var getCodeTimeOut = function() {
      if (waitTime === 0) {
        $scope.mobLoginData.isDisabled = false;
        $scope.mobLoginData.codeText = '获取验证码';
        waitTime = 60;
      } else {
        $scope.mobLoginData.isDisabled = true;
        $scope.mobLoginData.codeText = waitTime + '秒后重试';
        waitTime--;
        $timeout(function() {
          getCodeTimeOut();
        }, 1000);
      }
    };
    // 控制锁定按钮
    $scope.canSend = function() {
      return $scope.mobLoginData.isDisabled;
    };

    // 显示快捷方式登录的验证码
    $scope.showMobileVerifyCode = function() {
      Resource.showMobCode().then(function(dataRes) {
        $scope.mobLoginData.csrf = dataRes.csrf.TMM_CSRF;
        $http.get(ENV.apiEndpoint + dataRes.verifyCode).success(function(dataRes) {
          $scope.mobLoginData.g_hash = dataRes.hash1;
          $scope.mobLoginData.verifyCodeUrl = ENV.apiEndpoint + dataRes.url;
        }, function(dataRes) {
            
        });
        $scope.$broadcast('scroll.refreshComplete');
      }, function(dataRes) {

        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    //快捷方式登录获取手机验证码
    $scope.getMsgCode = function() {
      if (!appFunc.isPhone($scope.mobLoginModel.phone)) {
        appFunc.alert('手机号码格式不对');
      } else if ($scope.mobLoginModel.verifycode === '') {
        appFunc.alert('图形验证码不能为空');
      } else {
        var mobCodeData = {
          "phone": $scope.mobLoginModel.phone,
          "verifyCode": $scope.mobLoginModel.verifycode,
          "TMM_CSRF" : $scope.mobLoginData.csrf
        };
        
        Resource.getMobCode(mobCodeData).then(function(dataRes) {
          if (dataRes.data.form) {
            for (var msgName in dataRes.data.form) {
              if (msgName == 'verifyCode') {
                $scope.showMobileVerifyCode();
              }
              appFunc.alert(dataRes.data.form[msgName][0]);
            }
          } else {
            getCodeTimeOut();
          }
        }, function(dataRes) {
          
        });
      }
    };

    // 快捷方式登录
    $scope.mobLogin = function() {
      var mobData = {
        "UserSmsLoginForm": {
          "phone": $scope.mobLoginModel.phone,
          "sms": $scope.mobLoginModel.msgcode,
          "verifyCode": $scope.mobLoginModel.verifycode
        }
      };

      if (!appFunc.isPhone($scope.mobLoginModel.phone)) {
        appFunc.alert('手机号码格式不对');
      } else if ($scope.mobLoginModel.verifycode === '') {
        appFunc.alert('图形验证码不能为空');
      } else if ($scope.mobLoginModel.msgcode === '') {
        appFunc.alert('短信验证码不正确');
      } else {
        Resource.mobLogin(mobData).then(function(dataRes) {
          $location.path('/my');
        }, function(dataRes) {
          if (dataRes.form) {
            for (var msgName in dataRes.form) {
              if (msgName == 'UserSmsLoginForm_verifyCode') {
                $scope.showVerifyCode();
              }
              appFunc.alert(dataRes.form[msgName][0]);
            }    
          } else {
            if(dataRes.msg) {
              appFunc.alert(dataRes.msg);
              $scope.showMobileVerifyCode();
            } else {
              appFunc.alert('输入有误，请重试');
            }
          }

        });
      }
    };

    $scope.showMobileVerifyCode();
  }
});

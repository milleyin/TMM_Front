angular.module('security', [])

.factory('security', function($q, $rootScope, $ionicModal, $http, $interval, appFunc, ENV) {

  var service = {
    currentUser: null,
    userInfo: null,
    getUserInfo: function() {
      if (service.userInfo !== null) {
        return $q.when(service.userInfo);
      } else {
        return $http.get(ENV.apiEndpoint + '/index.php?r=api/user/view').then(function(response) {
          if (response.data.status == 1) {
            service.userInfo = response.data.data;
            return service.userInfo;

          } else {
            service.login();

            return $q.reject({
              code: '2',
              msg: '您没有登录'
            });
          }
        });
      }
    },
    login: function(fn) {
      var timer = null;
      var scope = $rootScope.$new(true);
      scope.isAccLogin = true;
      scope.title = "帐号密码登录";
      scope.txt = '获取验证码';
      scope.disable = false;
      scope.accModel = { phone: '', password: '' };
      scope.mobModel = { phone: '', code: '' };
      scope.loginStyle = {
        top: (window.innerHeight - 48) + 'px'
      };

      $ionicModal.fromTemplateUrl('app/common/templates/login.html', {
        scope: scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        scope.modal = modal;
        scope.modal.show();
      });
      
      $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); })

      // 关闭登录窗口
      scope.cancel = function() {
        scope.modal.remove();
        scope.$destroy();
        $interval.cancel(timer);
      };


      // 切换登录方式
      scope.showLogin = function(type) {
        if (type === 1) {
          scope.isAccLogin = true;
          scope.title = "帐号密码登录";
        } else {
          scope.isAccLogin = false;
          scope.title = "手机号快捷登录";
        }
      };

      // 手机密码登录
      scope.accLogin = function() {
        var url = ENV.apiEndpoint + '/index.php?r=api/login/index';
        var token = {
          "UserLoginForm": {
            "phone": scope.accModel.phone,
            "password": scope.accModel.password,
          }
        };

        if (scope.accModel.phone === '') {
          appFunc.alert('手机号码不能为空');
          return;
        } else if (scope.accModel.password === '') {
          appFunc.alert('密码不能为空');
          return;
        } else if (!appFunc.isPhone(scope.accModel.phone)) {
          appFunc.alert('手机号码格式不对');
          return;
        } else if (!appFunc.validatePassword(scope.accModel.password)) {
          appFunc.alert('密码必须有数字和字母组合');
          return;
        }

        $http.get(url + '&csrf=csrf').success(function(response) {
          token.TMM_CSRF = response.data.csrf.TMM_CSRF;
          $http.post(url, token).success(function(response) {
            if (response.status == 1) {

              service.currentUser = response.data;
              $rootScope.$broadcast("getUserInfo", service.currentUser);
              fn && fn(service.currentUser);
              scope.cancel();
            } else {
              if (response.form) {
                for (var msg in response.form) {
                  appFunc.alert(response.form[msg]);
                  return;
                }
              }
              appFunc.alert('网络连接错误');
            }
          }).error(function(response) {
            appFunc.alert('网络连接错误');
          });
        });
      };

      // 获取短信验证码
      scope.getMsgCode = function() {
        if (timer !== null) return;
        if (!scope.mobModel.phone) {
          appFunc.alert('手机号码不能为空');
          return;
        } else if (!appFunc.isPhone(scope.mobModel.phone)) {
          appFunc.alert('手机号码格式不对');
          return;
        }
        var url = ENV.apiEndpoint + '/index.php?r=api/login/captcha_sms';
        var token = {
          "phone": scope.mobModel.phone
        };

        $http.get(url + '&csrf=csrf').success(function(response) {
          if (response.status == 1) {
            token.TMM_CSRF = response.data.csrf.TMM_CSRF;

            $http.post(url, token).success(function(response) {
              if (response.status == 1) {
                setTime();
              } else {
                if (response.form) {
                  for (var msg in response.form) {
                    appFunc.alert(response.form[msg]);
                    return;
                  }
                }
                appFunc.alert('网络连接错误');
              }
            }).error(function() {
              appFunc.alert('网络连接错误');
            });

          }
        }).error(function() {
          appFunc.alert('网络连接错误');
        });

      };

      // 短信快捷登录
      scope.mobLogin = function() {
        if (!scope.mobModel.phone) {
          appFunc.alert('手机号码不能为空');
          return;
        } else if (!appFunc.isPhone(scope.mobModel.phone)) {
          appFunc.alert('手机号码格式不对');
          return;
        } else if (!scope.mobModel.code) {
          appFunc.alert('验证码不能为空');
          return;
        }
        var url = ENV.apiEndpoint + '/index.php?r=api/login/login_sms';
        var token = {
          "UserSmsLoginForm": {
            "phone": scope.mobModel.phone,
            "sms": scope.mobModel.code
          }
        };
        $http.get(url + '&csrf=csrf').success(function(response) {
          if (response.status == 1) {
            token.TMM_CSRF = response.data.csrf.TMM_CSRF;

            $http.post(url, token).success(function(response) {
              if (response.status == 1) {
                service.currentUser = response.data;
                $rootScope.$broadcast("getUserInfo", service.currentUser);
                fn && fn(service.currentUser);
                scope.cancel();
              } else {
                if (response.form) {
                  for (var msg in response.form) {
                    appFunc.alert(response.form[msg]);
                    return;
                  }
                }
                appFunc.alert('网络连接错误');
              }
            }).error(function() {
              appFunc.alert('网络连接错误');
            });

          }
        }).error(function() {
          appFunc.alert('网络连接错误');
        });
      };

      // 设置定时器
      function setTime() {
        $interval.cancel(timer);
        scope.disable = true;
        var i = 60;
        scope.txt = i + '秒后重试';

        timer = $interval(function() {
          scope.txt = --i + '秒后重试';

          if (i === 0) {
            $interval.cancel(timer);
            scope.txt = "获取验证码";
            scope.disable = false;
            timer = null;
          }

        }, 1000);
      }
    }
  };



  return service;
})

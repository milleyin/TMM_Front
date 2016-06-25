tmmApp.controller('SetPwdCtrl',['$scope','$http','$location','$interval','$rootScope',function($scope, $http,$location,$interval,$rootScope) {

    $scope.info = {
        phone : '',
        code : '',
        pwd : '',
        new_pwd : '',
        csrf : ''
    }

    $scope.msg = '';
    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=/api/user/pwd'+'&csrf=csrf').success(function(data) {

        $scope.info.csrf = data.data.csrf.TMM_CSRF;

    });

    /* 发送短信验证码 */
    $scope.sendCode = function() {
        if ($scope.set_pwd.phone.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.phone.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        }

        if (!($scope.set_pwd.phone.$error.required || $scope.set_pwd.phone.$error.pattern)) {

            if ($scope.flag) {
                $scope.getCode();

            }
        }
        
    }

    /* 获取短信验证码 */
    $scope.getCode = function() {
        var token = {
            "phone" : $rootScope.user.userInfo.phone,
            "TMM_CSRF" : $scope.info.csrf
        }

        $http.post(
            API + '/index.php?r=api/user/captcha_pwd_sms',
            token,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {

            if (data.status == 0) {
                console.log(data)
                if (data.form.phone) {
                    $scope.msg = data.form.phone[0];
                    $scope.showMsg = true;
                } else {
                    $scope.msg = "发送数据失败";
                    $scope.showMsg = true;
                }
                $scope.flag = true;
            } else if (data.status == 1){
                $scope.goTime();
                $scope.flag = false;
            }
        })
        
    }


    /* 短信定时器 */
    $scope.goTime = function() {
        var iNow = 60;
        $scope.text = iNow+'秒后重新获取';

        timer = $interval(function(){
            iNow--;
            $scope.text = iNow+'秒后重新获取';
            
            if(iNow == 0){
                $interval.cancel(timer);
                $scope.text = '获取验证码';
                $scope.flag = true;
            }
            
        },1000);
    }

    /* 提交表单 */
    $scope.setPwd = function() {
        if ($scope.set_pwd.phone.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.phone.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.code.$error.required) {
            $scope.msg = "验证码不能为空";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.pwd.$error.required) {
            $scope.msg = "密码不能为空";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.pwd.$error.minlength){
            $scope.msg = "密码至少为8位";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.pwd.$error.pattern) {
            $scope.msg = "密码必须数字字母组合";
            $scope.showMsg = true;
        } else if ($scope.info.pwd != $scope.info.new_pwd) {
            $scope.msg = "两次密码不一致";
            $scope.showMsg = true;
        } else if ($scope.set_pwd.$valid) {
            $scope.submit();
        }
    }

    /* 提交表单数据 */
    $scope.submit = function() {
        var token = {
            "User" : {
                "phone" : $rootScope.user.userInfo.phone,
                "sms" : $.trim($scope.info.code),
                "_pwd": $scope.info.pwd,
                "confirm_pwd": $scope.info.new_pwd
            },
            "TMM_CSRF" : $scope.info.csrf
        }
        console.log(token);

        $http.post(
            API + '/index.php?r=api/user/pwd',
            token,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            console.log(data);
            if (data.status == 1) {
                if ($rootScope.mobileType == 0) { //ios
                     connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '修改成功!'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("修改成功！");
                }
                $location.path('myinfo');
            } else {
                if (data.form.User__pwd) {
                    $scope.msg = data.form.User__pwd[0];
                } else if(data.form.User_sms){
                    $scope.msg = data.form.User_sms[0];
                } else {
                    $scope.msg = "修改失败";     
                }
                $scope.showMsg = true;
            }
        })
    }

    /* 清除提示信息 */
    $scope.clearMsg = function() {
        $scope.msg = '';
        $scope.showMsg = false;
    }

}]);

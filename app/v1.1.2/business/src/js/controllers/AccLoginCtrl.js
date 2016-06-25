tmmApp.controller('AccLoginCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope, $http, $location) {

    $scope.msg = '';
    $scope.canLogin = false;
    $scope.msg_flag = true;
    $scope.showMsg = false;
    $scope.submitted = false;

    $scope.logText = {
        name : '',
        pwd : '',
        code : '',
        key : '',
        imgUrl : ''
    };

    $scope.logMsg = [ 
        '验证码不正确',
        '用户名或密码错误',
        '手机号无效',
        '登录失败'
    ];

    /* 获取验证码 */
    $scope.showCode = function() {

        $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {

            $scope.logText.key = data.data.csrf.TMM_CSRF;
             //console.log(data.data.verifyCode);
            $http.get(API + data.data.verifyCode).success(function(data) {
                $scope.logText.imgUrl = API + data.url;
                //console.log($scope.logText.imgUrl);
            });

        });
    }
    $scope.showCode();

/* 提交表单 */
    $scope.signupForm = function() {
        /* 验证表单 */
        if ($scope.signup_form.username.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.username.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        } else if ($scope.signup_form.password.$error.required) {
            $scope.msg = "密码不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.password.$error.minlength){
            $scope.msg = "密码至少为8位";
            $scope.showMsg = true;
        } else if ($scope.signup_form.password.$error.pattern) {
            $scope.msg = "密码必须数字字母组合";
            $scope.showMsg = true;
        } else if ($scope.signup_form.code.$error.required) {
            $scope.msg = "验证码不能为空";
            $scope.showMsg = true;
        }

        /* 发送表单 */
        if($scope.signup_form.$valid) {
            $scope.submit();
        }

    }

    $scope.clearMsg = function() {
        $scope.msg = '';
    }

    $scope.submit = function() {

        var token = {
            "StoreLoginForm" : { 
                "phone" : $scope.logText.name,
                "password" : $scope.logText.pwd,
                "verifyCode" : $scope.logText.code
            },
            "TMM_CSRF" : $scope.logText.key
        }
        // console.log(token);
        $http.post(
            API + '/index.php?r=store/store_login/index',
            token,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            if (data.status == 1) {

                var userInfo = {"is_main": data.data.is_main};
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                $location.url('/myorder');

            } else {
                if ($scope.msg = data.form.StoreLoginForm_password) {

                    $scope.msg = data.form.StoreLoginForm_password[0];
                } else if ($scope.msg = data.form.StoreLoginForm_verifyCode) {
                    $scope.msg = data.form.StoreLoginForm_verifyCode[0];
                }
                $scope.msg_flag = false;
                $scope.showMsg = true;
            }
        }).error(function(data) {
            $scope.msg = $scope.logMsg[3];
            $scope.showMsg = false;
        });
    }
}]);
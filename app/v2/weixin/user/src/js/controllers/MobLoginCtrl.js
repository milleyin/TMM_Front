/* 短信验证码注册控制器 */
tmmApp.controller('MobLoginCtrl',['$scope','$rootScope','$http','$interval','$location',function($scope,$rootScope, $http, $interval,$location) {

    $scope.regText = {
        name : '',
        code : '',
        telcode : '',
        key : '',
        imgUrl : ''
    };
    $scope.msg = '';
    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;

    /* 获取图形验证码 */
    $scope.showCode = function() {

        $http.get(API + '/index.php?r=api/login/login_sms'+'&csrf=csrf').success(function(data) {

            $scope.regText.key = data.data.csrf.TMM_CSRF;

            $http.get(API + data.data.verifyCode).success(function(data) {
                $scope.regText.imgUrl = API + data.url;

            });

        });
    }

    $scope.showCode();

    /* 发送短信验证码 */
    $scope.sendCode = function() {
        if ($scope.signup_form.username.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.username.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        } else if ($scope.signup_form.code.$error.required) {
            $scope.msg = "验证码不能为空";
            $scope.showMsg = true;
        }

        if (!($scope.signup_form.username.$error.required || $scope.signup_form.username.$error.pattern || $scope.signup_form.code.$error.required)) {

            if ($scope.flag) {
                $scope.getCode();
            }
        }

        
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

    /* 获取短信验证码 */
    $scope.getCode = function() {
        var getCodeInfo = {
            "phone" : $scope.regText.name,
            "verifyCode" : $scope.regText.code,
            "TMM_CSRF" : $scope.regText.key
        }
        console.log(getCodeInfo);

        $http.post(
            API + '/index.php?r=api/login/captcha_sms',
            getCodeInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {

            if (data.status == 0) {
                if (data.form.phone) {
                    $scope.msg = data.form.phone[0];
                    $scope.showMsg = true;
                } else if (data.form.verifyCode) {
                    $scope.msg = data.form.verifyCode[0];
                    $scope.showMsg = true;
                } else {
                    $scope.msg = "发送数据失败";
                    $scope.showMsg = true;
                }
                $scope.flag = true;
            } else {
                $scope.flag = false;
                $scope.goTime();
            }
        })
    }


    /* 提交表单 */
    $scope.signupForm = function() {
        if ($scope.signup_form.username.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.username.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        } else if ($scope.signup_form.code.$error.required) {
            $scope.msg = "图形验证码不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.msgcode.$error.required) {
            $scope.msg = "短信验证码不能为空";
            $scope.showMsg = true;
        }

        if ($scope.signup_form.$valid) {
            $scope.submit();
        }
    }



    /* 发送表单 */
    $scope.submit = function() {
        var postInfo = {
            "UserSmsLoginForm" : { 
                "phone" : $scope.regText.name,
                "sms" : $scope.regText.telcode,
                "verifyCode" : $scope.regText.code
            },
            "TMM_CSRF" : $scope.regText.key
        }
        
        $http.post(
            API + '/index.php?r=api/login/login_sms',
            postInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
           if (data.status == 1) {

                if($rootScope.tuiJianDetailLoginUrl == 1){
                    $location.path('/tuijiandetail_1'); //推荐详情点赞登录后仍留在详情页
                    $rootScope.tuiJianDetailReturn = 1;
                } else if($rootScope.tuiJianDetailLoginUrl == 2){
                    $location.path('/tuijiandetail_0'); //推荐详情点赞登录后仍留在详情页
                    $rootScope.tuiJianDetailReturn = 1;
                } else {
                    $location.path('/my');
                }
            } else {

                if (data.form.UserSmsLoginForm_phone) {
                    $scope.msg = data.form.UserSmsLoginForm_phone[0];
                    $scope.showMsg = true;
                } else if (data.form.verifyCode) {
                    $scope.msg = data.form.verifyCode[0];
                    $scope.showMsg = true;
                } else {
                    $scope.msg = "发送数据失败";
                    $scope.showMsg = true;
                }
                
            }

        });
    }

    $scope.clearMsg = function() {
        $scope.msg = '';
        $scope.showMsg = false;
    }

}]);
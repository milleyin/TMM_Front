/* 修改手机号 */
tmmApp.controller('ConfirmPhoneCtrl',['$scope','$rootScope','$http','$interval','$location',function($scope,$rootScope, $http, $interval,$location) {
    $scope.oldInfo = {
        phoneInfo : '请输入新手机号',
        submit : '确认'
    }

    $scope.regText = {
        name : '',
        telcode : '',
        key : '',
    };
    $scope.msg = '';
    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=api/user/phone_new'+'&csrf=csrf').success(function(data) {
        
        $scope.regText.key = data.data.csrf.TMM_CSRF;

    });

    /* 发送短信验证码 */
    $scope.sendCode = function() {
        if ($scope.signup_form.username.$error.required) {
            $scope.msg = "手机号不能为空";
            $scope.showMsg = true;
        } else if ($scope.signup_form.username.$error.pattern) {
            $scope.msg = "手机号必须为11位数字";
            $scope.showMsg = true;
        } 

        if (!($scope.signup_form.username.$error.required || $scope.signup_form.username.$error.pattern)) {

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
            "TMM_CSRF" : $scope.regText.key
        }

        $http.post(
            API + '/index.php?r=api/user/captcha_new_sms',
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
            "User" : { 
                "phone" : $scope.regText.name,
                "sms" : $scope.regText.telcode
            },
            "TMM_CSRF" : $scope.regText.key
        }
        
        $http.post(
            API + '/index.php?r=api/user/phone_new',
            postInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {

            console.log(data);

            if (data.data.status == 1) {
                
                $location.path('/myinfo');
            } else {
                if (data.form.User_sms) {
                    $scope.msg = data.form.User_sms[0];  
                } else {
                    $scope.msg = '提交失败';
                }
                $scope.showMsg = true; 
            }


        });
    }

    $scope.clearMsg = function() {
        $scope.msg = '';
        $scope.showMsg = false;
    }



}]);
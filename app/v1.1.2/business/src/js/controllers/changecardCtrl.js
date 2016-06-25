/* 修改卡号 先短信验证 */
tmmApp.controller('verifyphoneCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
    $scope.json = {};
    $scope.phone = $rootScope.loginPhone;
    $scope.regText = {
        sms : '',
        key : ''
    };

    $scope.msg = '';
    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {
        
        $scope.regText.key = data.data.csrf.TMM_CSRF;

    });

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

         $http.get(API + '/index.php?r=store/store_store/captcha_bank_sms').success(function(data) {
            if (data.status == 0) {
                $scope.flag = true;
                if (data.form) {
                  for (msgName in data.form) {
                    // 显示错误信息
                    mobileMessage(data.form[msgName][0]);
                    break;
                  }
                }
            } else {
                $scope.flag = false;
                $scope.goTime();
            }
        })
    }
    /* 验证短信表单 */
    $scope.messageForm = function() {
        if ($scope.message_form.sms.$error.required) {
            mobileMessage("验证码不能为空，请输入验证码");
        }        
        if ($scope.message_form.$valid) {
            $scope.submit();
        }
    }

    /* 发送短信并验证 */
    $scope.submit = function() {
        var postDXInfo = {
            "sms" : $scope.regText.sms,
            "TMM_CSRF" : $scope.regText.key
        }
        console.log(postDXInfo);
        $http.post(
            API + '/index.php?r=store/store_store/bank_sms',
            postDXInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            if (data.status == 1) {
                console.log("成功",data);
                $location.path("mywallet");
            } else {
                console.log("失败",data);
                if (data.form) {
                  for (msgName in data.form) {
                    // 显示错误信息
                    mobileMessage(data.form[msgName][0]);
                    break;
                  }
                }
            }

        });
    }

}]);

/**
 * [修改卡号]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $rootScope    [description]
 * @param  {[type]} $http         [description]
 * @param  {[type]} $interval     [description]
 * @param  {[type]} $location     [description]
 * @param  {Object} $routeParams) {                   $scope.bankInfo [description]
 * @return {[type]}               [description]
 */
tmmApp.controller('changebankCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
    /* 获取银行信息列表 */
    $scope.showMsg = false;
    $scope.key = '';
    $scope.bankInfo = {};
    $scope.bankList = {};
    $scope.regText = {
        username : '',      
        bank_code : '',
        sms : '',
        key : ''
    };
    $http.get(API + '/index.php?r=store/store_store/bank_index').success(function(data) {
        $scope.bankList = data.data;
    });

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {   
        $scope.key = data.data.csrf.TMM_CSRF;
    });

    /*提交更改的银行卡信息*/
    $scope.signupForm = function() {
        if ($scope.bankInfo.name == null) {
            mobileMessage("开户行必须选择");
        }else if ($scope.signup_form.subbranch.$error.required) {
            mobileMessage("开户支行不能为空");
        }else if ($scope.signup_form.username.$error.required) {
            mobileMessage("开户名不能为空");
        }else if ($scope.signup_form.bank_code.$error.required) {
            mobileMessage("卡号不能为空");
        } else if (isNaN($("#bank_code").val())) {
            mobileMessage("卡号只能为数字");
        } else if (!$scope.chk) {
            mobileMessage('请先查看"银行卡管理协议"并同意');
        }  else if ($scope.signup_form.$valid) {
            var postInfo = {
                "StoreContent" : { 
                    "bank_id" : $scope.bankInfo.value,
                    "bank_name" : $scope.regText.username,
                    "bank_branch" :$scope.regText.subbranch,
                    "bank_code" :$scope.regText.bank_code,
                },
                "TMM_CSRF" : $scope.key
            }

            console.log(postInfo);
            $http.post(
                API + '/index.php?r=store/store_store/bank',
                postInfo,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
                console.log("成功",data);
                if (data.status == 1) {
                    $location.path("verifyphone");
                } else {
                    if (data.form) {
                      for (msgName in data.form) {
                        // 显示错误信息
                        mobileMessage(data.form[msgName][0]);
                        break;
                      }
                    }
                }

            });        
        }
    }

}]);
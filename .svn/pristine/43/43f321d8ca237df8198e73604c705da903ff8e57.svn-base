/* 添加银行卡 */
tmmApp.controller('newbankCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
    $scope.bankList = {};
    $scope.regText = {
        username : '',      
        bank_code : '',
        sms : '',
        key : ''
    };
    $scope.bankInfo = {};
    $scope.phone = '';

    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;
    $scope.titleType = "";
    if($routeParams.id == "1"){
        $scope.titleType = "添加银行卡";
    } else {
        $scope.titleType = "更换银行卡";
    }

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {
        
        $scope.regText.key = data.data.csrf.TMM_CSRF;

    });
    /* 获取银行信息列表 */
    $http.get(API + '/index.php?r=store/store_store/bank_index').success(function(data) {
        $scope.bankList = data.data;
    });
    
    $scope.chk = false;
    /* 提交表单 */
    $scope.signupForm = function() {
        if ($scope.bankInfo.name == null) {
            mobileMessage("开户行必须选择");
        } else if ($scope.signup_form.subbranch.$error.required) {
            mobileMessage("开户支行不能为空");
        } else if ($scope.signup_form.username.$error.required) {
            mobileMessage("开户名不能为空");
        } else if ($scope.signup_form.bank_code.$error.required) {
            mobileMessage("卡号不能为空");
        } else if (isNaN(($("#bank_code").val()).replace(/\s+/g, ""))) {
            mobileMessage("卡号只能为数字");
        } else if (!$scope.chk) {
            mobileMessage('请先查看"银行卡管理协议"并同意');
        } else if ($scope.signup_form.$valid) {
            $scope.submitBank();       
        }
    }

    /*当文本都为空时提交按钮为灰色*/
    $scope.chkBtnShow = false;
    $scope.chkBtnHide = true;
    
    $scope.signupFormButton = function() {
        if($scope.bankInfo.name == null || $scope.signup_form.subbranch.$error.required || $scope.signup_form.username.$error.required || $scope.signup_form.bank_code.$error.required || !$scope.chk){
            $scope.chkBtnShow = false;
            $scope.chkBtnHide = true;
        } else { //都不为空
            $scope.chkBtnShow = true;
            $scope.chkBtnHide = false;
        }
    }
    /* 发送银行卡信息表单 */
    $scope.submitBank = function() {

        var postInfo = {
            "StoreContent" : { 
                "bank_id" : $scope.bankInfo.value,
                "bank_name" : $scope.regText.username,
                "bank_branch" : $scope.regText.subbranch,
                /*"bank_info" : $scope.bankInfo.name,*/
                "bank_code" : $scope.regText.bank_code,
            },
            "TMM_CSRF" : $scope.regText.key
        }
        $http.post(
            API + '/index.php?r=store/store_store/bank',
            postInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            if (data.status == 1) {
                console.log("成功",data);
                $location.path("duanxyanz");
            } else {
                console.log("失败",data);
                if (data.form) {
                    for (msgName in data.form) {
                      // 显示错误信息
                      mobileMessage(data.form[msgName][0]);
                      break;
                    }
                } else {
                    // 其它错误提醒
                    mobileMessage('输入有误，请重试');
                }
            }

        });
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
         $http.get(API + '/index.php?r=store/store_store/captcha_bank_sms').success(function(data) {
            if (data.status == 0) {
                $scope.flag = true;
            } else {
                $scope.flag = false;
                $scope.goTime();
            }
        })
    }
    /* 控制短信提交按钮是否可用 */
    $scope.messageBtnShow = false;
    $scope.messageBtnHide = true;
    $scope.messageFormButton = function() {
        if($scope.message_form.sms.$error.required){
            $scope.messageBtnShow = false;
            $scope.messageBtnHide = true;
        } else {
            $scope.messageBtnShow = true;
            $scope.messageBtnHide = false;
        }
    }
    /* 验证短信表单 */
    $scope.messageForm = function() {
        if ($scope.message_form.sms.$error.required) {
            mobileMessage("验证码不能为空，请输入验证码")
        }        
        if ($scope.message_form.$valid) {
            $scope.submit();
        }
    }
    /* 发送表单 */
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
                $location.path("mywallet");
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

}]);
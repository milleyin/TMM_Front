/* 提现短信验证 */
var withdrawMoney = 0;
tmmApp.controller('tixianduanxinCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
    $scope.json = {};
    $scope.phone = $rootScope.loginPhone;
    $scope.regText = {
        sms : '',
        key : ''
    };

    $scope.text = '获取验证码';
    $scope.flag = true;

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {
        
        $scope.regText.key = data.data.csrf.TMM_CSRF;

    });
    
    /*获取银行卡信息*/
    $http.get(API + "/index.php?r=store/store_store/store_bank&csrf=csrf").success(function(data){
        $scope.json = data.data[0];
        console.log("提现申请",data.data);
    }).error(function(){
        console.log(data.msg);
    })

    $scope.withdrawForm = function() {
        console.log(parseFloat($rootScope.withdraw));
        if($scope.withdraw_form.drawMoney.$error.required){
            mobileMessage("提现金额不能为空");
        } else if(isNaN($scope.regText.drawMoney)){
            mobileMessage("提现金额输入有误");
        } else if($scope.regText.drawMoney < 100){
            mobileMessage("提现金额不能小于100元");
        } else if($scope.regText.drawMoney.length > 12){
            mobileMessage("提现金额不能大于12位");
        } else if(parseFloat($scope.regText.drawMoney) > parseFloat($rootScope.withdraw)){
            var tixianMoney = "可提现金额不足" + $scope.regText.drawMoney + '元';
            mobileMessage(tixianMoney);
        } else if($scope.withdraw_form.$valid){
            withdrawMoney = $scope.regText.drawMoney;
            $rootScope.withdraw_money = $scope.regText.drawMoney;;
            $scope.submitBank();
        }
    }

    /* 先验证提现金额 */
    $scope.submitBank = function() {
        var postCashInfo = {
            "Cash": {
                "price":withdrawMoney //提现金额
            },
            "TMM_CSRF" : $scope.regText.key
        }
        $http.post(
            API + '/index.php?r=store/store_cash/cash_verify_price',
            postCashInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            if (data.status == 1) {
                $location.path("tixianduanxin");
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
         $http.get(API + '/index.php?r=store/store_cash/captcha_cash').success(function(data) {
            if (data.status == 0) {
                $scope.flag = true;

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
            } else {
                $scope.flag = false;
                $scope.goTime();
            }
        })
    }
    /* 控制短信提交按钮是否可用 */
    $scope.chkBtnShow = false;
    $scope.chkBtnHide = true;
    $scope.messageFormButton = function() {
        if($scope.message_form.sms.$error.required){
            $scope.chkBtnShow = false;
            $scope.chkBtnHide = true;
        } else {
            $scope.chkBtnShow = true;
            $scope.chkBtnHide = false;
        }
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
    /* 发送提现短信验证表单 */
    $scope.submit = function() {
        console.log(withdrawMoney);
        var postInfo = {
            "Cash" : { 
                "sms" :$scope.regText.sms,
                "price" : withdrawMoney
            },
            "TMM_CSRF" : $scope.regText.key
        }
        $http.post(
            API + '/index.php?r=store/store_cash/create',
            postInfo,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            console.log(data);
            if (data.status == 1) {
                $location.path('tixianinfo');
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
                    mobileMessage('提现失败');
                }
            }

        });
    }

}]);
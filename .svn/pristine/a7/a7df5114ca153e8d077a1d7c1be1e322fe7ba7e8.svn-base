/* 提现短信验证 */
tmmApp.controller('tixianduanxinCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
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
         $http.get(API + '/index.php?r=store/store_cash/captcha_cash').success(function(data) {
            if (data.status == 0) {
                $scope.flag = true;
                $scope.msg = data.form.phone;
            } else {
                $scope.flag = false;
                $scope.goTime();
            }
        })
    }
    /* 验证短信表单 */
    $scope.messageForm = function() {
        if ($scope.message_form.sms.$error.required) {
            $scope.msg = "验证码不能为空，请输入验证码";
            $scope.showMsg = true;
        }        
        if ($scope.message_form.$valid) {
            $scope.submit();
        }
    }
    /* 发送表单 */
    $scope.submit = function() {

        var postInfo = {
            "Cash" : { 
                "sms" :$scope.regText.sms
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
                $location.path('mycaiwu');
            } else {
                if(data.code == 50006){
                    if ($rootScope.mobileType == 0) { //ios
                         connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '请先绑定银行帐号!'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("请先绑定银行帐号");
                    }
                } else if(data.code == 40201){
                    if ($rootScope.mobileType == 0) { //ios
                         connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': data.form.Cash_msg
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt(data.form.Cash_msg);
                    } 
                }else{
                    if ($rootScope.mobileType == 0) { //ios
                         connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '提现失败!'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("提现失败");
                    }   
                }
            }

        });
    }

    $scope.clearMsg = function() {
        $scope.msg = '';
        $scope.showMsg = false;
    }

}]);
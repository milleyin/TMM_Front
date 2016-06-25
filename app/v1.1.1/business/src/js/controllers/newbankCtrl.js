/* 添加银行卡 */
var infos ={
    bankid : '',
    username : '', 
    bank_branch: '',     
        code : '',
        sms : '',
        key : ''
 };
tmmApp.controller('newbankCtrl',['$scope','$rootScope','$http','$interval','$location','$routeParams',function($scope,$rootScope, $http, $interval,$location,$routeParams) {
    $scope.bankList = {};
    $scope.regText = {
        username : '',      
        code : '',
        sms : '',
        key : ''
    };
    $scope.bankInfo = {};
    $scope.phone = '';

    $scope.msg = '';
    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=store/store_login/index'+'&csrf=csrf').success(function(data) {
        
        $scope.regText.key = data.data.csrf.TMM_CSRF;

    });
    /* 获取银行信息列表 */
    $http.get(API + '/index.php?r=store/store_store/bank_index').success(function(data) {
        $scope.bankList = data.data;
    });
    

    /* 提交表单 */
    $scope.signupForm = function() {
        // console.log($scope.bankInfo.name);
        if ($scope.bankInfo.name == null) {
            $scope.msg = "开户行必须选择";
            $scope.showMsg = true;
        }
        else if ($scope.signup_form.username.$error.required) {
            $scope.msg = "开户名不能为空";
            $scope.showMsg = true;
        }else if ($scope.signup_form.code.$error.required) {
            $scope.msg = "对公银行账号不能为空";
            $scope.showMsg = true;
        }else if ($scope.signup_form.$valid) {
            $location.path("duanxyanz");
            infos.bankid =  $scope.bankInfo.value;
            infos.bank_branch = $scope.bankInfo.name;
            infos.username = $scope.regText.username;
            infos.code = $scope.regText.code;         
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
         $http.get(API + '/index.php?r=store/store_store/captcha_bank_sms').success(function(data) {
            if (data.status == 0) {
                $scope.flag = true;
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
            "StoreContent" : { 
                "bank_id" : infos.bankid,
                "bank_name" : infos.username,
                "bank_branch" :infos.bank_branch,
                "bank_code" :infos.code,
                "sms" :$scope.regText.sms,
            },
            "TMM_CSRF" : $scope.regText.key
        }
        // console.log(infos);
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
                $location.path("myziliao");
            } else {
                $scope.msg = data.form.StoreContent_sms[0];
                $scope.showMsg = true; 
            }

        });
    }

    $scope.clearMsg = function() {
        $scope.msg = '';
        $scope.showMsg = false;
    }

}]);
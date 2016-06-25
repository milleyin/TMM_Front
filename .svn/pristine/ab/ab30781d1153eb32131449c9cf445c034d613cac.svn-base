angular.module('tmm.controllers')
/**
 * [description]
 * @param  我的钱包
 */
.controller('MyBankCardCtrl', function(
  $scope,
  $rootScope,
  $state,
  $ionicLoading,
  $location,
  $interval,
  $log,
  Tabs,
  getCash,
  getBankList,
  createBankCard,
  getBankcardCode,
  validateBankCardCode,
  tmmCache,
  appFunc) {

    $scope.regText = {
      username : '',      
      bank_code : '',
      sms : '',
      key : '',
      chk : false
    };
    $scope.bankInfo = {
      'bankname': ''
    };
    $scope.phone = '';

    $scope.text = '获取验证码';
    $scope.flag = true;
    $scope.showMsg = false;
    $scope.titleType = "";
    $scope.loginPhone = tmmCache.get("loginPhone");

    //获取银行卡信息
    getCash(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $scope.json = dataRes.data[0];
        }
      },
      function(dataRes, statusCode) {
        
      }
    );

    //得到所有的银行
    getBankList(
      function(dataRes, statusCode) {
        $scope.bankList = dataRes.data;     
      },
      function(dataRes, statusCode) {

      }
    )
    
    /* 提交表单 */
    $scope.signupForm = function() {
      if ($scope.bankInfo.bankname == null || $scope.bankInfo.bankname == "") {
        appFunc.alert("开户行必须选择");
      } else if ($scope.signup_form.subbranch.$error.required) {
        appFunc.alert("开户支行不能为空");
      } else if ($scope.signup_form.username.$error.required) {
        appFunc.alert("开户名不能为空");
      } else if ($scope.signup_form.bank_code.$error.required) {
        appFunc.alert("卡号不能为空");
      } else if (isNaN($scope.regText.bank_code)) {
        appFunc.alert("卡号只能为数字");
      } else if (!$scope.regText.chk) {
        appFunc.alert('请先查看"银行卡管理协议"并同意');
      } else if ($scope.signup_form.$valid) {
        $scope.submitBank();       
      }
    }

    /*当文本都为空时提交按钮为灰色*/
    $scope.chkBtnShow = false;
    $scope.chkBtnHide = true;
    
    $scope.signupFormButton = function() {
      if($scope.bankInfo.bankname == null || $scope.bankInfo.bankname == "" || $scope.signup_form.subbranch.$error.required || $scope.signup_form.username.$error.required || $scope.signup_form.bank_code.$error.required || !$scope.regText.chk){
        $scope.chkBtnShow = false;
        $scope.chkBtnHide = true;
      } else { //都不为空
        $scope.chkBtnShow = true;
        $scope.chkBtnHide = false;
      }
    }
    /* 发送银行卡信息表单 */
    $scope.submitBank = function() {
      createBankCard(
        {
          "BankCard" : { 
            "bank_id" : $scope.bankInfo.bankname,
            "bank_name" : $scope.regText.username,
            "bank_branch" : $scope.regText.subbranch,
            /*"bank_info" : $scope.bankInfo.name,*/
            "bank_code" : $scope.regText.bank_code,
            "bank_type": '2', // 用户银行类型 1=信用卡 2=借记卡
            "bank_identity": '', // 开户身份证
            "is_default": "0", // 是否默认 0默认 -1 非默认 
          }
        },
        function(dataRes, statusCode) { //跳转短信验证
          if(dataRes.status == 1){
            $location.path("/tab/bankcardmessage");
          } else {
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                // 显示错误信息
                appFunc.alert(dataRes.form[msgName][0]);
                break;
              }
            } else {
              // 其它错误提醒
              appFunc.alert('输入有误，请重试');
            } 
          }
        },
        function(dataRes, statusCode) {

        }
      );
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
      getBankcardCode(
        function(dataRes, statusCode) {
          if (dataRes.status == 0) {
            $scope.flag = true;
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                // 显示错误信息
                appFunc.alert(dataRes.form[msgName][0]);
                break;
              }
            } else {
              // 其它错误提醒
              appFunc.alert('输入有误，请重试');
            }
          } else {
            $scope.flag = false;
            $scope.goTime();
          }
        },
        function(dataRes, statusCode) {
          
        }
      );

    }
    /* 控制短信提交按钮是否可用 */
    $scope.messageBtnShow = false;
    $scope.messageBtnHide = true;
    $scope.messageFormButton = function() {
      if($scope.tmm_message_form.sms.$error.required){
        $scope.messageBtnShow = false;
        $scope.messageBtnHide = true;
      } else {
        $scope.messageBtnShow = true;
        $scope.messageBtnHide = false;
      }
    }
    /* 验证短信表单 */
    $scope.messageForm = function() {
      if ($scope.tmm_message_form.sms.$error.required) {
        mobileMessage("验证码不能为空，请输入验证码")
      }        
      if ($scope.tmm_message_form.$valid) {
        $scope.submit();
      }
    }
    /* 发送表单 */
    $scope.submit = function() {      
      validateBankCardCode(
        {
          "User": {
            "sms": $scope.regText.sms // 短信验证码
          }
        },
        function(dataRes, statusCode) { //跳转短信验证
          if(dataRes.status == 1){
            $location.path("/tab/mywallet");
          } else {
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                // 显示错误信息
                appFunc.alert(dataRes.form[msgName][0]);
                break;
              }
            } else {
              // 其它错误提醒
              appFunc.alert('输入有误，请重试');
            } 
          }
        },
        function(dataRes, statusCode) {

        }
      );
    }
});


angular.module('payment', [])

//支付管理入口界面
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.payment', {
      url: '/payment',
      templateUrl: 'app/payment/templates/my-payment.html',
      controller: 'PaymentMessageCtrl'
    })
}])

//支付管理验证短信
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.paymentmessage', {
      cache: false,
      url: '/paymentmessage',
      templateUrl: 'app/payment/templates/my-payment-message.html',
      controller: 'PaymentMessageCtrl'
    })
}])

//支付密码
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.setPassword', {
      url: '/setPassword/:pwdlink',
      templateUrl: 'app/payment/templates/my-set-password.html',
      controller: 'PaymentPwdCtrl'
    })
}])


.controller('PaymentMessageCtrl', function($scope, $http, $ionicHistory,$state, $location, $interval, $state, Resource, appFunc, security) {
  //显示登录的手机号
  security.getUserInfo().then(function(data){
    $scope.loginPhone = data.userInfo.phone;
  });
  $scope.info = {};
  $scope.info = { //保存支付的相关信息
    type: {},
    data: {}
  };

  var modifyMessage = {
    '-3': '设置支付密码',
    '-2': '设置支付密码',
    '-1': '设置支付密码',
    '0': '设置支付密码',
    '1': '设置支付密码'
  };

  $scope.json = {};
  $scope.regText = {
    sms : '',
    key : ''
  };
  $scope.text = '获取验证码';
  $scope.flag = true;

  showView();
  //设置支付密码，先得到相关信息
  function showView(){
    Resource.getPayPasswd().then(function(dataRes){
      $scope.info.data = dataRes;
      $scope.info.type.status = dataRes.value;
      $scope.info.type.value = modifyMessage[dataRes.value];
    })
  }

  //设置支付密码，判断是否需要短信验证
  $scope.showVerifyPhone = function() {
    Resource.getIsvalidate().then(function(dataRes){
      if(dataRes.data.status == 1){ //如果已经验证过短信，直接进入支付页面
        if (dataRes.data.data.value == 1) {
          $state.go('tab.setPassword', {
            'pwdlink': $scope.info.data.link
          });
        } else { //如果没有验证短信，进入短信验证
          $location.path("/paymentmessage");
        }
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
  };

  /* 获取短信验证码 */
  $scope.getCode = function() {
    Resource.get($scope.info.data.sms_link).then(function(dataRes) {

      if (dataRes.status == 0) {
        $scope.flag = true;
      } else {
        $scope.flag = false;
        $scope.goTime();
      }
    }, function(dataRes) {
      if(dataRes.msg) {
        appFunc.alert(dataRes.msg);
      } else {
        appFunc.alert("网络错误");
      }
    });
  };

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
  };

   /* 验证短信表单 */
  $scope.messageForm = function() {
    if ($scope.message_form.sms.$error.required) {
      mobileMessage("验证码不能为空，请输入验证码");
    }        
    if ($scope.message_form.$valid) {
      $scope.submit();
    }
  };

  /* 发送提现短信验证表单 */
  $scope.submit = function() {
    var data = {
      "Password": {
        "sms": $scope.regText.sms
      }
    };
    Resource.post($scope.info.data.validate, data).then(function(dataRes) {
      if(dataRes.status == 1){
        $ionicHistory.goBack(-3);
      }
    }, function(dataRes) {
      if(dataRes.msg) {
        appFunc.alert(dataRes.msg);
      } else {
        appFunc.alert("网络错误");
      }
    });
  }
})

.controller('PaymentPwdCtrl', function($scope, $http, $state, $location, $interval, $stateParams, Resource, appFunc) {
  var passwd = '';
  var oldPasswd = '';
  var step = 1;
  var timer = null; 
  var pwdlink = $stateParams.pwdlink;

  /*
   *虚拟键盘
   */
  function showkeyboard(obj) {
    var items = [],
    oSpan,
    oDiv = document.createElement('div');

    oDiv.className = 'keyboard';
    for (var i = 0; i < 12; i++) {
      oSpan = document.createElement('span');
      oSpan.index = i;
      items.push(oSpan);
      oSpan.className = 'keyboard-item';
      oDiv.appendChild(oSpan);
    };

    obj.appendChild(oDiv);

    setTimeout(function() {
      oDiv.style.transform = 'translate3d(0, 0, 0)';
      oDiv.style.webkitTransform = 'translate3d(0, 0, 0)';
    }, 0);

    // 获取哪个键盘按钮点击(1-12)
    function getTap(fn) {
      oDiv.addEventListener('click', function(e) {
        fn(e.target.index + 1);
      });
    }

    // 注销键盘
    function cancel() {
      oDiv.style.transform = 'translate3d(0, 100%, 0)';
      oDiv.style.webkitTransform = 'translate3d(0, 100%, 0)';
      setTimeout(function() {
        obj.removeChild(oDiv);
      }, 250);
    }

    return {
      cancel: cancel,
      getTap: getTap
    }
  }

  //初始化页面就加载虚拟键盘
  setPasswd();

  function setPasswd() {
    // 初始化
    passwd = '';
    oldPasswd = '';
    //加载虚拟键盘
    var key = document.getElementById("tmm-payment-setpwd");
    var keyboard = showkeyboard(key);
    keyboard.getTap(function(index) {
      passwd2box(index);
    }); 
  }

  var k = 0;
  //首次输入密码
  function passwd2box(index) {
    
    if (passwd.length >= 6) {
      if (index == 12) {
        passwd = passwd.substr(0, passwd.length - 1);
        if (k < passwd.length) {
          (document.getElementsByClassName("passwd-item")[k]).className = 'passwd-item pwd-input';
          k++;
        } else {
          if(k > 0) {
            k--;
            (document.getElementsByClassName("passwd-item")[k]).className = 'passwd-item';
          }
        }
      }
    } else {
      if (index == 11) {  
        passwd += 0;
      } else if (index == 12) {
        passwd = passwd.substr(0, passwd.length - 1);

      } else if (index == 10) {

      } else {
        passwd += index;
      }
      if (k < passwd.length) {
        (document.getElementsByClassName("passwd-item")[k]).className = 'passwd-item pwd-input';
        k++;
      } else {
        if(k > 0) {
          k--;
          (document.getElementsByClassName("passwd-item")[k]).className = 'passwd-item';
        }
      }
    }
    checkPasswdConfirm();
  } 

  //第二次输入密码(确认密码)
  function checkPasswdConfirm() {
    if (step == 1) {
      if (passwd.length == 6) {
        oldPasswd = passwd;
        passwd = '';
        k = 0;
        passwd2box(10);

        step = 2;
        for(var i =0; i < document.getElementsByClassName("passwd-item").length; i++){
          (document.getElementsByClassName("passwd-item")[i]).className = 'passwd-item';
        }
        document.getElementById("passwd-msg").innerText = '请再次输入支付密码';
        document.getElementById("passwd-button-hide").style.display = "block"; 
      }
    } else {
      if (passwd.length == 6) {
        document.getElementById("passwd-button-show").style.display = "block";
        document.getElementById("passwd-button-hide").style.display = "none";
      } else {
        document.getElementById("passwd-button-show").style.display = "none";
        document.getElementById("passwd-button-hide").style.display = "block";
      }
    }
  }

  //提交密码按钮，验证密码
  $scope.confirmPasswd = function() {
    if(passwd == oldPasswd) {
      var data = {
        "Password": {
            "_pwd": oldPasswd,
            "_confirm_pwd": passwd
          }
      };
      Resource.post(pwdlink, data).then(function(dataRes) {

        if(dataRes.status == 1){
          $location.path("/payment");
        }
      }, function(dataRes) {
        if(dataRes.msg) {
          resetPasswd(); //清空原来保存的密码值
          appFunc.alert(dataRes.msg);
        } else {
          appFunc.alert("网络错误");
        }
      });
    } else {
      resetPasswd(); //清空原来保存的密码值
      appFunc.alert('两次密码输入不一致，请重新输入');  
    }
  }

  function resetPasswd() {
    k = 0;
    passwd = '';
    oldPasswd = '';
    step = 1;
    for(var i =0; i < document.getElementsByClassName("passwd-item").length; i++){
      (document.getElementsByClassName("passwd-item")[i]).className = 'passwd-item';
    }
    document.getElementById("passwd-msg").innerText = '请输入支付密码';
    document.getElementById("passwd-button-show").style.display = "none";
    document.getElementById("passwd-button-hide").style.display = "none";
    passwd2box(10);
  }

})
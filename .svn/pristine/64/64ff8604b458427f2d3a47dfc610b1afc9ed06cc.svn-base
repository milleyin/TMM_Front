angular.module('tmm.controllers')
/**
 * [description]
 * @param  我的钱包
 */
.controller('MyWalletCtrl', function(
  $scope,
  $rootScope,
  $state,
  $ionicLoading,
  $location,
  $log,
  Tabs,
  getBurseInfo,
  getCash,
  tmmCache,
  appFunc) {
    $scope.withdraw = 0;
    $scope.withdraw_format = 0;//可提金额
    getBurseInfo(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $scope.json = dataRes.data;
          $scope.withdraw = dataRes.data.money;
          $scope.withdraw_format = dataRes.data.money_format;
        } else {
          if (data.form) {
            for (msgName in data.form) {              
              appFunc.alert(data.form[msgName][0]);
              break;
            }
          }
        }
      },
      function(dataRes, statusCode) {
        
      }
    );

    $scope.BankCardHasOrNot = function() {
      getCash(
        function(dataRes, statusCode) {
          if (dataRes.status != 0) {
            $state.go('tab.mywithdraw', {
              'withdraw': $scope.withdraw,
              'withdraw_format': $scope.withdraw_format
            });
          } else {
            appFunc.alert("请添加银行卡");
          }
        },
        function(dataRes, statusCode) {
          
        }
      );
    }

    $scope.BankCardManageLink = function() {
      getCash(
        function(dataRes, statusCode) {
          if (dataRes.status != 0) {
            $location.path('/tab/mybankcardmanagement');
          } else {
            $location.path('/tab/newbank');
          }
        },
        function(dataRes, statusCode) {
          
        }
      );
    }

    $scope.Traderecord = function() {
      $location.path('/tab/traderecord');
    }
})

/**
 * 提现申请
 * 
 */
.controller('MyWithDrawCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $ionicLoading,
  $location,
  $interval,
  $log,
  Tabs,
  getCash,
  withdrawCash,
  getWithDrawCode,
  withdrawMessage,
  tmmCache,
  appFunc) {
    $scope.withdraw = $stateParams.withdraw;
    $scope.withdraw_format = $stateParams.withdraw_format;
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

    $scope.json = {};
    $scope.phone = $rootScope.loginPhone;
    $scope.regText = {
      sms : '',
      key : ''
    };
    $scope.text = '获取验证码';
    $scope.flag = true;

    $scope.withdrawForm = function() {
      if($scope.withdraw_form.drawMoney.$error.required){
        appFunc.alert('提现金额不能为空');
      } else if(isNaN($scope.regText.drawMoney)){
        appFunc.alert('提现金额输入有误');
      } else if($scope.regText.drawMoney < 100){
        appFunc.alert('提现金额不能小于100元');
      } else if($scope.regText.drawMoney.length > 12){
        appFunc.alert('提现金额不能大于12位');
      } else if(parseFloat($scope.regText.drawMoney) > parseFloat($scope.withdraw)){
        var tixianMoney = "可提现金额不足" + $scope.regText.drawMoney + '元';
        appFunc.alert(tixianMoney);
      } else if($scope.withdraw_form.$valid){
        tmmCache.set("withdrawMoney", parseFloat($scope.regText.drawMoney)); //保存提现金额
        $scope.submitBank();            
      }
    }

    /* 先验证提现金额 */
    $scope.submitBank = function() {
      withdrawCash(
        {
          "Cash": {
            "price": tmmCache.get('withdrawMoney'),
          }
        },
        function(dataRes, statusCode) { //跳转短信验证
          if(dataRes.status == 1){
            $location.path("/tab/drawmoneymessage");
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
      getWithDrawCode(
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

      withdrawMessage(
        {
          "Cash" : { 
            "sms" :$scope.regText.sms,
            "price" : tmmCache.get('withdrawMoney')
          }
        },
        function(dataRes, statusCode) { //跳转短信验证
          if(dataRes.status == 1){
            $location.path('/tab/drawmoneyinfo');
          } else {
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                // 显示错误信息
                appFunc.alert(dataRes.form[msgName][0]);
                break;
              }
            } else {
              // 其它错误提醒
              appFunc.alert('验证码错误');
            } 
          }
        },
        function(dataRes, statusCode) {
          appFunc.alert('提现失败');
        }
      );
    }
  })

/**
 * 提现成功提示
 * @param  {[type]} $scope          [description]
 */
.controller('MyWithDrawInfoCtrl', function(
  $scope,
  $rootScope,
  $log,
  Tabs,
  tmmCache,
  appFunc) {
    $scope.withdrawMoney = tmmCache.get('withdrawMoney');
})

/**
 * 交易记录
 */
.controller('TradeRecordCtrl', function(
  $scope,
  $rootScope,
  $log,
  getTradeRecord,
  tmmCache,
  appFunc,
  PtrService) {

  $scope.list_data = [];
  $scope.listNum = 0;
  var nextLink = '';

  // 触发下拉刷新
  $scope.$on("$ionicView.loaded", function() {
    PtrService.triggerPtr('ptr-content');
  });
  $scope.tradeModel = {
    'pullingText': '松开刷新'
  };
  // 达到松开高度时触发
  $scope.doPulling = function() {
    $scope.tradeModel.pullingText = '松开刷新';
  };

  $scope.doRefresh = function() {
    getTradeRecord(
      '',
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $scope.listNum = dataRes.data.list_data.length;
          $scope.list_data = dataRes.data.list_data;
          nextLink = dataRes.data.page.next;
        } else {
          // 网络超时，请重试...
        }
        $scope.$broadcast('scroll.refreshComplete');
      },
      function(dataRes, statusCode) {
        // 网络超时，请重试...
        $scope.$broadcast('scroll.refreshComplete');
      }
    );
  }

  // 加载更多
  $scope.loadMore = function() {
    if (nextLink) {
      getTradeRecord(
        nextLink,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $scope.list_data = $scope.list_data.concat(dataRes.data.list_data);
            nextLink = dataRes.data.page.next;
          } else {
            // 网络超时，请重试...
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
        },
        function(dataRes, statusCode) {
          // 网络超时，请重试...
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      );
    }
  };
  // 是否还没更多数据
  $scope.hasMoreData = function() {
    if (nextLink) {
      return true;
    }
    return false;
  };

})

.controller('DrawMoneyRecordCtrl', function(
  $scope,
  $rootScope,
  $log,
  getDrawMoneyRecord,
  tmmCache,
  appFunc,
  PtrService) {

  $scope.list_data = [];
  $scope.listNum = 0;
  var nextLink = '';
  // 触发下拉刷新
  $scope.$on("$ionicView.loaded", function() {
    PtrService.triggerPtr('ptr-content');
  });
  $scope.drawMoneyModel = {
    'pullingText': '松开刷新'
  };
  // 达到松开高度时触发
  $scope.doPulling = function() {
    $scope.drawMoneyModel.pullingText = '松开刷新';
  };

  $scope.doRefresh = function() {
    getDrawMoneyRecord(
      '',
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $scope.listNum = dataRes.data.list_data.length;
          $scope.list_data = dataRes.data.list_data;
          nextLink = dataRes.data.page.next;
        } else {
          // 网络超时，请重试...
        }
        $scope.$broadcast('scroll.refreshComplete');
      },
      function(dataRes, statusCode) {
        // 网络超时，请重试...
        $scope.$broadcast('scroll.refreshComplete');
      }
    );
  }

  // 加载更多
  $scope.loadMore = function() {
    if (nextLink) {
      getDrawMoneyRecord(
        nextLink,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $scope.list_data = $scope.list_data.concat(dataRes.data.list_data);
            nextLink = dataRes.data.page.next;
          } else {
            // 网络超时，请重试...
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
        },
        function(dataRes, statusCode) {
          // 网络超时，请重试...
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      );
    }
  };
  // 是否还没更多数据
  $scope.hasMoreData = function() {
    if (nextLink) {
      return true;
    }
    return false;
  };

});


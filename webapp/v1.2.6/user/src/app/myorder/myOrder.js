angular.module('myorder', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myorder', {
      url: '/myorder',
      templateUrl: 'app/myorder/templates/my-order.html',
      controller: 'MyOrderCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, orderType) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.myorder') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getOrderList(orderType.myorder);

          }
        }
      }
    })
}])

//点订单详情
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myorderdetail_1', {
      url: '/myorderdetail_1/:link',
      templateUrl: 'app/myorder/templates/my-dot-order-detail.html',
      controller: 'OrderDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          if (isNaN(Number($stateParams.link))) {
            return Resource.get($stateParams.link);
          } else {
            return Resource.getOrderPayDetail($stateParams.link);
          }
        }
      }
    })
}])

//线订单详情
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myorderdetail_2', {
      url: '/myorderdetail_2/:link',
      templateUrl: 'app/myorder/templates/my-line-order-detail.html',
      controller: 'OrderDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          if (isNaN(Number($stateParams.link))) {
            return Resource.get($stateParams.link);
          } else {
            return Resource.getOrderPayDetail($stateParams.link);
          }
        }
      }
    })
}])

//活动订单详情 自费
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myorderdetail_3', {
      url: '/myorderdetail_3/:link',
      templateUrl: 'app/myorder/templates/my-line-order-detail.html',
      controller: 'OrderDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          if (isNaN(Number($stateParams.link))) {
            return Resource.get($stateParams.link);
          } else {
            return Resource.getOrderPayDetail($stateParams.link);
          }
        }
      }
    })
}])

//活动订单详情 代付
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myorderdetail_4', {
      url: '/myorderdetail_4/:link',
      templateUrl: 'app/myorder/templates/my-line-order-detail.html',
      controller: 'OrderDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          if (isNaN(Number($stateParams.link))) {
            return Resource.get($stateParams.link);
          } else {
            return Resource.getOrderPayDetail($stateParams.link);
          }
        }
      }
    })
}])

//订单列表页

.controller('MyOrderCtrl', function($scope, $ionicScrollDelegate, $ionicLoading, orderType, data, Resource, appFunc, payFunc) {

  var type = orderType.myorder; //觅境，觅趣的链接
  $scope.isActive = (type == 'order_dot_thrand') ? 1 : 2;
  $scope.model = {
    nextPage: data.page.next,
    list_data: data.list_data
  };

  //加载点击选项卡对应的订单  
  $scope.showTab = function(index) {
    if ($scope.isActive == index) return;
    $scope.isActive = index;
    if (index == 1) {
      orderType.myorder = type = 'order_dot_thrand';
    } else if (index == 2) {
      orderType.myorder = type = 'order_tour';
    }
    $scope.doRefresh();
    $ionicScrollDelegate.scrollTo(0, 0, true); //回到内容顶部
  };

  // 请求网络数据
  function getData() {
    Resource.getOrderList(type).then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {

      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  };

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {

        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      })
    }
  };

  //取消订单
  $scope.orderCancle = function(id) {
    appFunc.confirm('确定取消吗？', function() {
      Resource.orderCancle(id).then(function(data) {
        //appFunc.alert("取消成功");
        $ionicLoading.show({
          template: "取消成功",
          duration: 600
        });
        getData();
      }, function(data) {
        appFunc.alert("取消失败");
      });
    });
  };

  //支付订单
  $scope.orderPay = function(id, type, price) {

    payFunc.payOrder(id, type, price, function(dataRes, status) {
      if (dataRes.status == 1) {
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();

        try {
          if (isIPad || isIOS) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'PayCode': dataRes.data.alipay
              }, function(response) {})
            });
          } else if (isAndroid) { //Android
            var str = window.jsObj.payMoney(dataRes.data.alipay);
          }
        } catch (e) {

        }
      }
    }, function(dataRes) {
      appFunc.alert('网络超时，请重试');
    }, function(dataRes) {
      getData();
    });
  };

  // 退款
  $scope.refund = function() {
    appFunc.tmmWxCallPhone('400-019-7090');
  };

})



//订单详情页
.controller('OrderDetailCtrl', function($scope, $stateParams, $ionicModal, appFunc, QRCode, Resource, data, payFunc) {
  $scope.actback = 0;
  if ($stateParams.actOrder == "actOrder") {
    $scope.actback = 1;
  }
  $scope.model = data;
  $scope.hasRetinue = 0; //判断是否有随行人员，0：没有 1:有
  for (var i = 0; i < data.retinue.length; i++) {
    if (data.retinue[i].is_main == 0) {
      $scope.hasRetinue = 1;
      break;
    }
  }

  $ionicModal.fromTemplateUrl('app/myorder/templates/qr-code.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.showCode = function(link, type) {
    if (type != 1) return;

    Resource.get(link).then(function(data) {
      var barcode = data.barcode.value;
      var formatBarcode = appFunc.toFormatNum(barcode);
      var oDiv = $scope.modal.el.querySelector('.qr-code');
      var oTxt = $scope.modal.el.querySelector('.csu-code');
      oDiv.innerHTML = '';

      var qrcode = new QRCode(oDiv, {
        width: window.innerWidth * 0.6,
        height: window.innerWidth * 0.6,
      });
      qrcode.makeCode(barcode);
      oTxt.innerHTML = '消费码：' + formatBarcode;
      $scope.modal.show();
    }, function(data) {


    });
  };

  //支付订单
  $scope.orderPay = function(id, price) {
    payFunc.payOrder(id, $scope.model.status.order_type.value, price, function(dataRes, status) {
      if (dataRes.status == 1) {
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();

        try {
          if (isIPad || isIOS) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'PayCode': dataRes.data.alipay
              }, function(response) {});
            });
          } else if (isAndroid) { //Android
            var str = window.jsObj.payMoney(dataRes.data.alipay);
          }
        } catch (e) {

        }
      }
    }, function(dataRes) {
      appFunc.alert('网络超时，请重试');
    }, function(dataRes) {
      Resource.get($stateParams.link).then(function(data) {
        $scope.model = data;
      });
    });
  }

})

.factory('orderType', function() {
  return {
    joinact: 1,
    myorder: 'order_dot_thrand'
  }
})

.directive('orderItem', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/myorder/templates/my-order-item.html'
  }
})

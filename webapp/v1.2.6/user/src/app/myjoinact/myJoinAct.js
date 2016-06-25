angular.module('myjoinact', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.myjoinact', {
      url: '/myjoinact',
      templateUrl: 'app/myjoinact/templates/my-join-act.html',
      controller: 'MyJoinActCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, orderType) {
          if ($ionicHistory.backView() === null || $ionicHistory.backView().stateName !== 'tab.myjoinact') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getJoinActList(orderType.joinact);
          }
        }
      }
    })

    //我参加的觅趣--->代付的详情
    .state('tab.myjoinactdetail', {
      url: '/myjoinactdetail/:link',
      templateUrl: 'app/myjoinact/templates/my-joinact-detail.html',
      controller: 'MyJoinActDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, orderType) {
          if ($ionicHistory.backView() === null || $ionicHistory.backView().stateName !== 'tab.myjoinactdetail') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    });
}])


//我参加的活动列表页
.controller('MyJoinActCtrl', function($scope, $ionicScrollDelegate, $ionicPopover, $filter, $ionicLoading, orderType, data, Resource, autoRefresh, appFunc, modify, payFunc, uiCalendar) {

  var type = orderType.joinact; //自费还是代付的方式
  $scope.isPayType = type;
  $scope.model = {
    nextPage: '',
    list_data: []
  };
  $scope.model.nextPage = data.page.next;
  $scope.model.list_data = data.list_data;

  // .fromTemplateUrl() 方法
  $ionicPopover.fromTemplateUrl('app/myjoinact/templates/my-joinact-actType.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  //打开浮动层
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  //加载点击选项卡对应的订单  
  $scope.showTab = function(index) {
    if ($scope.isPayType == index) return;
    $scope.isPayType = index;
    if (index == 1) { //自费
      orderType.joinact = type = 1;
    } else if (index == 2) { //代付
      orderType.joinact = type = 2;
    }
    $scope.popover.hide(); //关闭浮动层
    $scope.doRefresh();
    $ionicScrollDelegate.scrollTo(0, 0, true); //回到内容顶部
  };

  // 请求网络数据
  function getData() {
    Resource.getJoinActList(type).then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {

      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  //上一页有取消订单，重新加载数据
  $scope.$on("$ionicView.enter", function() {
    if(modify.ismodify) {
      getData();
      modify.ismodify = false;
    }
   });
  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  }

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
  }

  //自费觅趣取消订单
  $scope.orderCancle = function(id) {
    appFunc.confirm('确定取消报名吗？', function() {
      Resource.orderCancle(id).then(function(data) {
        //appFunc.alert("取消报名成功");
        $ionicLoading.show({
          template: "取消报名成功",
          duration: 600
        });
        getData();
      }, function(data) {
        appFunc.alert("取消报名失败");
      })
    });
  }

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
  }

  //代付觅趣取消订单
  $scope.orderEnterCancle = function(id) {
    appFunc.confirm('确定取消报名吗？', function() {
      Resource.orderEnterCancle(id).then(function(data) {
        if (data.status == 1) {
          //appFunc.alert("取消报名成功");
          $ionicLoading.show({
            template: "取消报名成功",
            duration: 600
          });
          getData();
        } else {
          appFunc.alert("取消报名失败");
        }
      }, function(data) {
        appFunc.alert("取消报名失败");
      })
    });
  }

  //自费活动确认出游
  $scope.orderTourConfirm = function(id) {
    appFunc.confirm('确认出游吗', function() {
      Resource.tourConfirm(id).then(function(data){
        //appFunc.alert("确认出游成功");
        $ionicLoading.show({
          template: "确认出游成功",
          duration: 600
        });
        getData();
      }, function(data) {
        appFunc.alert("确认出游失败");
      })
    })
  },

  //代付设置出游日期
  $scope.setGoTime = function(gotimeLink){
    uiCalendar.show({
      selected: function(dates){
        var goTime = $filter('date')(dates[0],'yyyy-MM-dd');
        appFunc.confirm('出游日期确认为：' + goTime, function(){
          var data = {
            "Actives": {
              "go_time" : goTime
            }
          };
          Resource.post(gotimeLink, data).then(function(data){
            //appFunc.alert("出游日期确认成功");
            $ionicLoading.show({
              template: "出游日期确认成功",
              duration: 600
            });
            getData();
          }, function(data) {
            appFunc.alert(data.msg);
          })
        });
      },
      minDate: new Date(Date.now()+1*24*60*60*1000),
      num: 1
    });
  }

  //自费申请退款
  $scope.refund = function() {
    appFunc.tmmWxCallPhone('400-019-7090');
  }

})

.directive('joinactItem', function() {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: 'app/myjoinact/templates/my-joinact-item.html'
  }
})

//我参加的代付的觅趣详情页
.controller('MyJoinActDetailCtrl', function($scope, $http, $ionicHistory, $ionicLoading, data, Resource, appFunc, security, modify) {
  $scope.model = data;
  $scope.selType = 1;
  var actId = data.actives_id;
  var link = ""; //获取联系人的链接
  $scope.orderModel = null; //存储联系人列表所有信息
  $scope.orderListModel = null; //存储联系人
  var loadMoreJoinLink = ''; //参与人是否有分页
  $scope.loadmore = false;

  security.getUserInfo().then(function(data){
    $scope.userInfo = data.userInfo;
  });

  if (data.is_me == '1') {
    link = data.actives_info.attend_list;
  }

  if($scope.orderListModel == null && link != ""){
    Resource.get(link).then(function(data){
      $scope.orderModel = data;
      $scope.orderListModel = data.list_data;
      loadMoreJoinLink = data.page.next;
    }, function(data) {

    })
  }
  function isLoadMore(){
    if(loadMoreJoinLink != ""){
      $scope.loadmore = true;
    } else {
      $scope.loadmore = false;
    }
  }

  $scope.showTabs = function(index){
    if ($scope.selType == index) return;
    $scope.selType = index;
    if(index == 2) {
      isLoadMore();
    }
  }

  //加载更多参与人
  $scope.loadMoreParticipant = function (){
    if (loadMoreJoinLink) {
      Resource.get(loadMoreJoinLink).then(function(data) {
        loadMoreJoinLink = data.page.next;
        $scope.orderListModel = $scope.orderListModel.concat(data.list_data);
      }, function(data) {

      })
    }
    isLoadMore();
  }

  //代付觅趣取消订单
  $scope.orderEnterCancle = function(id) {
    appFunc.confirm('确定取消报名吗？', function() {
      Resource.orderEnterCancle(id).then(function(data) {
        if (data.status == 1) {
          modify.ismodify = true;
          //appFunc.alert("取消报名成功");
          $ionicLoading.show({
            template: "取消报名成功",
            duration: 600
          });
          $ionicHistory.goBack();
        } else {
          appFunc.alert("取消报名失败");
        }
      }, function(data) {
        appFunc.alert("取消报名失败");
      })
    });
  }

})

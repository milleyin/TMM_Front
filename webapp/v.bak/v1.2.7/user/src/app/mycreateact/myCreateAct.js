angular.module('mycreateact', ['mycreateactdetail', 'mysponsoract'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.mycreateact', {
      url: '/mycreateact',
      templateUrl: 'app/mycreateact/templates/my-create-act.html',
      controller: 'MyCreateActCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) { 
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.mycreateact') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getCreateActList();
          }
        }
      }
    })

  .state('tab.createactpay', { // 提交订单
    url: '/createactpay/:link/:orderlink/:orderid/:ordertype/:gotime',
    templateUrl: 'app/mycreateact/templates/my-createact-pay.html',
    controller: 'CreateActCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.createactpay') {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    }
  })

  .state('tab.participant', { // 参与人
    url: '/participant/:link',
    templateUrl: 'app/mycreateact/templates/my-participant.html',
    controller: 'Participant',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.participant') {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    }
  })

}])


//我发起的活动列表页
.controller('MyCreateActCtrl', function($scope, $http, $ionicHistory, $filter, $ionicLoading, data, Resource, autoRefresh, appFunc, payFunc, uiCalendar, modify, device) {
  $scope.model = {
    nextPage: '',
    list_data: []
  }
  $scope.model.nextPage = data.page.next;
  $scope.model.list_data = data.list_data;

  // 请求网络数据
  function getData() {
    Resource.getCreateActList().then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {

      $scope.$broadcast('scroll.refreshComplete');
    })
  }

  $scope.$on("$ionicView.enter", function() {
    if (modify.ismodify) {
      //autoRefresh.start('createact-content');
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
        $scope.model.nextPage = "";
        $scope.$broadcast("scroll.infiniteScrollComplete");
      })
    }
  }

  //提交审核
  $scope.reviewAct = function(actLink) {
    Resource.get(actLink).then(function(data) { //先得到这个觅趣的相关信息
      editActInfo(data); //后台暂未做单独的接口来提交审核，故用修改觅趣信息来更改审核状态
    }, function(data) {
    
    })
  }

  //编辑活动信息
  function editActInfo(model) {
    var actData = {
      "actives_thrand": 0,  //线路ID 点为0
      "is_insurance": 1,    //保险1=确认0=取消
      "shops_info": '',     //觅趣对应点的信息====多点
      "Actives": {          //觅趣信息
        "actives_type": 0,  //0=旅游觅趣1=农产品觅趣
        "tour_type": 1,     //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0,        //觅趣数量
        "price": 0.00,      //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "",       //旅游觅趣备注
        "start_time": "",   //报名开始日期
        "end_time": "",     //报名截止时间
        "go_time": '',      //出游日期     没填传 空值
        "is_organizer": 1,  //是否组织者 1=是 0=不是
        "is_open": 1,       //是否开放显示 1=开放 0=不开放
        "pay_type": 0       //付款方式 0=AA付款 1=全额付款
      },
      "Shops": {
        "name": ""           //商品名称
      },
      "Pro": {               //选中项目  线路ID不为0时，可传空
      },
      "ProFare": {           //选中项目对应价格  线路ID不为0时，可传空
      }
    };
  
    actData.actives_thrand = model.thrand_id;
    actData.Actives.number = model.actives_info.number.value;
    actData.Actives.tour_price = model.actives_info.tour_price.value;
    actData.Actives.start_time = model.actives_time.start_time;
    actData.Actives.end_time = model.actives_time.end_time;
    actData.Actives.is_organizer = model.is_organizer.value;
    actData.Actives.is_open = model.actives_is_open.value;
    actData.Actives.pay_type = model.actives_pay_type.value;
    if(model.actives_time.go_time == "出游日期未定"){
      actData.Actives.go_time = "";
    } else {
      actData.Actives.go_time = model.actives_time.go_time;
    }
    actData.Actives.remark = model.actives_info.remark;
    actData.Shops.name = model.name;

    var activeId = model.actives_id;

    Resource.editActInfo(activeId, actData).then(function(data){
      if(data.status == 1) {
        //appFunc.alert('觅趣提交审核成功');
        $ionicLoading.show({
          template: "觅趣提交审核成功",
          duration: 600
        });
        getData();
      }
    }, function(data){
      appFunc.alert(data.msg);
    })
  }

  //设置出游日期
  $scope.setGoTime = function(gotimeLink){
    uiCalendar.show({
      selected: function(dates){
        var goTime = $filter('date')(dates[0],'yyyy-MM-dd');
        appFunc.confirm('出游日期确认为：' + goTime, function(){
          var data = {
            "Actives": {
              go_time : goTime
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

  //取消觅趣
  $scope.cancelAct = function() {
    device.tmmWxCallPhone('400-019-7090');
  }
})

.directive('createactItem', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/mycreateact/templates/my-createact-item.html'
  }
})

//我发起的觅趣支付
.controller('CreateActCtrl', function($scope, $http, $ionicHistory, $stateParams, $ionicPopup, $location, $state, $filter, data, Resource, appFunc, payFunc, security, uiCalendar, backStep, modify, ENV) {

  $scope.model = data;
  security.getUserInfo().then(function(data){
    $scope.userInfo = data.userInfo;
  });

  $scope.total_price = countPrice(data.items_fare);

  var orderlink = $stateParams.orderlink;
  var orderid = $stateParams.orderid;
  var ordertype = $stateParams.ordertype;
  $scope.gotime = data.actives_time.go_time;
  var main_name = data.actives_info.attend.main.name; //如果不更改主要联系人的名字，还是默认的

  if(data.actives_time.go_time_value == 1){
    $scope.gotime_value = 1;
  } else {
    $scope.gotime_value = 0;
  }

  function getOrderDate(){ //重新获取数据
    Resource.get($stateParams.link).then(function(data){
      $scope.model = data;
    });
  }
  //计算总价钱
  function countPrice(items) {
    var total = 0;

    for (var x1 in items) {
      for (var x2 in items[x1]) {
        for (var x3 in items[x1][x2]) {
          if (items[x1][x2][x3].classliy.value === '1' || items[x1][x2][x3].classliy.value === '3') {
            for (var attr in items[x1][x2][x3].fare) {

              if (items[x1][x2][x3].fare[attr].info == '成人') {
                items[x1][x2][x3].fare[attr].number = data.actives_info.attend.people;
              } else if (items[x1][x2][x3].fare[attr].info == '儿童') {
                items[x1][x2][x3].fare[attr].number = data.actives_info.attend.children;

              }
              items[x1][x2][x3].fare[attr].count = items[x1][x2][x3].fare[attr].number * items[x1][x2][x3].fare[attr].price;
              total += items[x1][x2][x3].fare[attr].count;
            }
          } else if (items[x1][x2][x3].classliy.value === '2') {
            for (var attr in items[x1][x2][x3].fare) {

              items[x1][x2][x3].fare[attr].number = Math.ceil(data.actives_info.attend.people / items[x1][x2][x3].fare[attr].room_number);

              items[x1][x2][x3].fare[attr].count = items[x1][x2][x3].fare[attr].number * items[x1][x2][x3].fare[attr].price;
              total += items[x1][x2][x3].fare[attr].count;

            }
          }

        }
      }
    }

    total += data.actives_info.tour_price.value * data.actives_info.attend.number;
    return total.toFixed(2);
  }
  //设置出游日期
  $scope.selectDate = function(){
     uiCalendar.show({
      selected: function(dates){
        $scope.gotime = $filter('date')(dates[0],'yyyy-MM-dd');
      },
      minDate: new Date(),
      num: 1
    });
  };

  //设置主要联系人的名字
  $scope.setMainName = function() {
    $ionicPopup.prompt({
      title: '请输入联系人姓名',
      cancelText: '取消',
      inputType: 'text',
      okText: '确认',
      cssClass: 'tmm-ionic-prompt'
    }).then(function(res) {
      if(!res) return;
      Resource.post(data.actives_info.attend.main.link, {
        "Attend": {
          "name": res
        }
      }).then(function(data) {
        main_name = res;
        getOrderDate();
      }, function(data) {
        appFunc.alert(data.msg)
      })
    });
  }

  //提交订单
  $scope.actOrderPay = function() {
    var token = {
      "Order": {
        "order_price": $scope.total_price,
        "go_time": $scope.gotime
      },
      "OrderShops": {
        "shops_id": data.actives_id
      },
      "Attend": {
        "name": main_name
      }
    }

    if(ordertype == 1){ //已经生成订单，直接付款
      orderPay($scope.model.actives_info.order.value, $scope.total_price);
    } else if (ordertype == 0) { //还未生成订单，先生成订单，再付款
      if($scope.gotime == "出游日期未定"){
        appFunc.alert('请设置出游时间');
        return;
      }
      
      Resource.post(orderlink, token).then(function(data){
        ordertype = 1;
        Resource.get($stateParams.link).then(function(data){
          $scope.model = data;
        })
        orderPay(data.id.value, $scope.total_price);
      }, function(data){
        appFunc.alert(data.msg);
      })
    }

  }

  $scope.$on('wxPay', function(event, mas) {
    $ionicHistory.goBack();
  })

  //支付订单
  function orderPay(id, price) {
    modify.ismodify = true;
    payFunc.payOrder(id, 4, price, function(dataRes){
      
      try {
        if (ENV.iOS) { //ios
        
          connectWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('ObjcCallback', {
              'PayCode': dataRes.alipay
            }, function(response) {})
          });
        } else if (ENV.android) { //Android
          var str = window.jsObj.payMoney(dataRes.alipay); 
        }  
      } catch (e) { 

      }
      
    }, function(dataRes){
      appFunc.alert('网络超时，请重试');
    }, function(dataRes){
      $state.go('tab.myorderdetail_4', { //进订单详情页
        'link': dataRes.status.type.link,
        'actOrder': 'actOrder'
      }).then(function() {
        backStep.step = -2;
      });
    });
  }

})

//我发起的活动中参与人列表页
.controller('Participant', function($scope, $http, $ionicHistory, $stateParams, data, Resource, appFunc) {
  $scope.model = {
    nextPage: '',
    list_data: []
  }

  $scope.model.nextPage = data.page.next;
  $scope.model.list_data = data.list_data;

  // 请求网络数据
  function getData() {
    Resource.get($stateParams.link).then(function(data) {
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

})

.directive('participantItem', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/mycreateact/templates/my-participant-item.html'
  }
})


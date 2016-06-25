angular.module('order', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.order-dot', { // 点订单预定
      url: '/order/dot/:id',
      templateUrl: 'app/order/templates/order-dot.html',
      controller: 'OrderDotCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.order-dot') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getOrderDetail($stateParams.id);
          }
        }
      }
    })
    .state('tab.order-line', { // 线订单预定
      url: '/order/line/:id',
      templateUrl: 'app/order/templates/order-line.html',
      controller: 'OrderLineCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.order-line') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getOrderDetail($stateParams.id);
          }
        }
      }
    })
    .state('tab.order-act', { // 觅趣报名AA
      url: '/order/act/:id',
      templateUrl: 'app/order/templates/order-act.html',
      controller: 'OrderActCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.order-act') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getOrderDetail($stateParams.id);
          }
        }
      }
    })
    .state('tab.order-actA', { // 觅趣报名A，代付
      url: '/order/actA/:id',
      templateUrl: 'app/order/templates/order-actA.html',
      controller: 'OrderActACtrl'
    });

}])

/**
 * 创建点订单
 */
.controller('OrderDotCtrl', function($scope, $filter, $ionicModal, $state, $ionicLoading, backStep, Resource, modify, security, appFunc, MESSAGES, uiCalendar, data) {
  var price = 0,
    goTime;
  $scope.model = data;
  $scope.date = '';
  $scope.totalPrice = 0;

  Resource.getUserInfo().then(function(data) {
    security.userInfo = data;
    $scope.userInfo = data;
  });

  $ionicModal.fromTemplateUrl('app/order/templates/selected-retinue.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    $scope.modal.hide();
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    if (modify.ismodify) {

      Resource.getUserInfo().then(function(data) {
        security.userInfo = data;
        $scope.userInfo = data;
      });
      modify.ismodify = false;
    }
  });

  $scope.$watch('totalPrice');

  $scope.selectDate = function() {
    uiCalendar.show({
      selected: function(dates) {
        goTime = dates[0];
        $scope.date = $filter('date')(dates[0], 'yyyy-MM-dd');
      },
      minDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      num: 1
    });
  };

  $scope.selectHotelDate = function(ev, item) {
    if (!goTime) {
      appFunc.tipMsg(MESSAGES['order.goTime']);
      return;
    }
    uiCalendar.show({
      selected: function(dates) {

        item.start_date = $filter('date')(dates[0], 'yyyy-MM-dd');
        item.end_date = $filter('date')(dates[1], 'yyyy-MM-dd');
        item.hotel_number = parseInt((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24));
        ev.target.innerHTML = $filter('date')(dates[0], 'yyyy.MM.dd') + '-' + $filter('date')(dates[1], 'MM.dd') + '(共' + item.hotel_number + '晚)';

        $scope.totalPrice = countTotPrice().toFixed(2);

      },
      minDate: goTime,
      maxDate: new Date(goTime.getTime() + (1000 * 60 * 60 * 24) * 9),
      num: 2
    });
  };

  $scope.addNum = function(item) {
    item.number++;
    $scope.totalPrice = countTotPrice().toFixed(2);
  };

  $scope.subNum = function(item) {
    item.number = item.number - 1 > 0 ? item.number - 1 : 0;
    $scope.totalPrice = countTotPrice().toFixed(2);
  };

  // 提交订单
  $scope.submit = function() {

    var token = {};
    var OrderRetinue = [];
    var OrderItemsFare = [];

    OrderRetinue.push({
      "is_main": "1",
      "retinue_id": $scope.userInfo.main_retinueInfo.list[0].value
    });

    if ($scope.userInfo.retinueInfo.list) {
      for (var i = 0; i < $scope.userInfo.retinueInfo.list.length; i++) {
        if ($scope.userInfo.retinueInfo.list[i].isSelected) {
          var temp = {
            "is_main": "0",
            "retinue_id": $scope.userInfo.retinueInfo.list[i].value
          };
          OrderRetinue.push(temp);
        }

      }
    }
    var OrderItems = filterItem();

    if (!$scope.date) {
      appFunc.tipMsg(MESSAGES['order.goTime'], 1500);
      return;
    }

    if (!OrderItems) {
      appFunc.tipMsg('您有未选择入住和退房日期的项目', 1500);
      return;
    }

    if (OrderItems["0"].length === 0) {
      appFunc.tipMsg('请选择商品', 1500);
      return;
    }

    if (OrderRetinue.length === 0) {
      appFunc.tipMsg(MESSAGES['order.retinue'], 1500);
      return;
    }


    token = {
      "Order": {
        "user_price": "0", //服务费总计
        "order_type": "1", //点下单
        "pay_type": "1", //第三方支付接口 选择  默认 支付宝  1
        "order_price": $scope.totalPrice, //订单总计
        "son_order_count": "0", //子订单 统计
        "go_time": $scope.date, //出游日期
        "user_go_count": OrderRetinue.length //随行人员 人数
      },
      "OrderRetinue": OrderRetinue,
      "OrderItems": OrderItems
    };

    $ionicLoading.show({ template: '订单提交中' });
    Resource.createOrder(token).then(function(data) {
      $ionicLoading.hide();
      appFunc.alert('下单成功').then(function() {
        $state.go('tab.myorderdetail_1', {
          link: data.link
        }).then(function() {
          backStep.step = -2;

        });
      });
    }, function(data) {
      $ionicLoading.hide();
      appFunc.alert(data.msg);
    });
  };

  // 计算总价格
  function countTotPrice() {
    var items = $scope.model.items_fare;
    var totlePrice = 0;
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < items[i].fare.length; j++) {
        if (items[i].classliy.value == 2) {
          totlePrice += items[i].fare[j].number * items[i].fare[j].price * items[i].fare[j].hotel_number;
        } else {
          totlePrice += items[i].fare[j].number * items[i].fare[j].price;

        }

      }
    }
    return totlePrice;
  }

  // 商品项目过滤
  function filterItem() {
    var item = {},
      i = 0,
      j = 0,
      x, xx;
    item["0"] = [];

    item["0"]["0"] = {};
    item["0"]["0"][$scope.model.value] = [];

    // 拼接订单
    for (i = 0; i < $scope.model.items_fare.length; i++) {
      item["0"]["0"][$scope.model.value][i] = {};
      item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value] = [];

      for (j = 0; j < $scope.model.items_fare[i].fare.length; j++) {
        if ($scope.model.items_fare[i].fare[j].number > 0) {
          item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j] = {};
          item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value] = {};

          item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].price = $scope.model.items_fare[i].fare[j].price;
          item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].number = $scope.model.items_fare[i].fare[j].number;
          item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].count = $scope.model.items_fare[i].fare[j].price * $scope.model.items_fare[i].fare[j].number;

          if ($scope.model.items_fare[i].classliy.value == "2") {
            if ($scope.model.items_fare[i].fare[j].start_date == '0' || $scope.model.items_fare[i].fare[j].end_date == '0') {
              return false;
            }
            item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].start_date = $scope.model.items_fare[i].fare[j].start_date;
            item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].end_date = $scope.model.items_fare[i].fare[j].end_date;
            item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].hotel_number = $scope.model.items_fare[i].fare[j].hotel_number;
            item["0"]["0"][$scope.model.value][i][$scope.model.items_fare[i].value][j][$scope.model.items_fare[i].fare[j].value].count = $scope.model.items_fare[i].fare[j].price * $scope.model.items_fare[i].fare[j].number * $scope.model.items_fare[i].fare[j].hotel_number;
          }
        }
      }
    }

    // 过滤项目下面的商品
    for (x in item["0"]["0"]) {
      for (i = 0; i < item["0"]["0"][x].length; i++) {
        for (xx in item["0"]["0"][x][i]) {
          for (j = 0; j < item["0"]["0"][x][i][xx].length; j++) {
            if (!item["0"]["0"][x][i][xx][j]) {
              item["0"]["0"][x][i][xx].splice(j, 1);
              j--;
            }
          }
        }
      }
    }

    // 过滤项目
    for (x in item["0"]["0"]) {
      for (i = 0; i < item["0"]["0"][x].length; i++) {
        for (xx in item["0"]["0"][x][i]) {
          if (item["0"]["0"][x][i][xx].length === 0) {
            item["0"]["0"][x].splice(i, 1);
            i--;
          }
        }
      }
    }

    // 过滤点
    for (i = 0; i < item["0"].length; i++) {
      for (x in item["0"][i]) {
        if (item["0"][i][x].length === 0) {
          item["0"].splice(i, 1);
          i--;
        }
      }
    }

    return item;
  }

})

/**
 * 创建线订单
 */
.controller('OrderLineCtrl', function($scope, $filter, $state, $ionicModal, $ionicLoading, backStep, MESSAGES, appFunc, Resource, modify, security, uiCalendar, data) {
  var c_num = 0,
    e_num = 0; // 成人，儿童

  $scope.model = data;
  $scope.goTime = '';
  $scope.totlePrice = 0;
  $scope.num = 0;


  Resource.getUserInfo().then(function(data) {
    security.userInfo = data;
    $scope.userInfo = data;

  });

  $ionicModal.fromTemplateUrl('app/order/templates/selected-retinue.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    $scope.modal.hide();
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    if (modify.ismodify) {

      Resource.getUserInfo().then(function(data) {
        security.userInfo = data;
        $scope.userInfo = data;
      });
      modify.ismodify = false;
    }
  });

  // 选择时间
  $scope.selectDate = function() {
    uiCalendar.show({
      selected: function(dates) {
        $scope.goTime = $filter('date')(dates[0], 'yyyy-MM-dd');
      },
      minDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      num: 1
    });
  };


  // 添加人员
  $scope.addNum = function(type, key) {
    var list = $scope.model.dot_list;
    if (type == '成人') {
      $scope.model.OrderItemsFare[key].number = ++c_num;
    } else if (type == '儿童') {
      e_num++;
      if (c_num * 2 < e_num) {
        appFunc.tipMsg(MESSAGES['order.num']);
        e_num--;
        return;
      }
      $scope.model.OrderItemsFare[key].number = e_num;
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {

                if (list[attr1][i][attr2][j].fare[k].info == '成人') {
                  list[attr1][i][attr2][j].fare[k].number = c_num;
                  $scope.model.dot_list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                } else if (list[attr1][i][attr2][j].fare[k].info == '儿童') {
                  list[attr1][i][attr2][j].fare[k].number = e_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

                if (list[attr1][i][attr2][j].fare[k].room_number != '0') {
                  list[attr1][i][attr2][j].fare[k].number = Math.ceil(c_num / list[attr1][i][attr2][j].fare[k].room_number);
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

              }

            }
          }
        }
      }
    }
    $scope.totlePrice = countTotPrice();
  };

  // 减少人员
  $scope.subNum = function(type, key) {
    var list = $scope.model.dot_list;
    if (type == '成人') {
      if (c_num === 0) return;
      c_num--;
      if (c_num * 2 < e_num) {
        c_num++;
        appFunc.tipMsg(MESSAGES['order.num']);
        return;
      }
      $scope.model.OrderItemsFare[key].number = c_num;
    } else if (type == '儿童') {
      if (e_num === 0) return;
      e_num--;
      $scope.model.OrderItemsFare[key].number = e_num;
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {

                if (list[attr1][i][attr2][j].fare[k].info == '成人') {
                  list[attr1][i][attr2][j].fare[k].number = c_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                } else if (list[attr1][i][attr2][j].fare[k].info == '儿童') {
                  list[attr1][i][attr2][j].fare[k].number = e_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

                if (list[attr1][i][attr2][j].fare[k].room_number != '0') {
                  list[attr1][i][attr2][j].fare[k].number = Math.ceil(c_num / list[attr1][i][attr2][j].fare[k].room_number);
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

              }

            }
          }
        }
      }
    }
    $scope.totlePrice = countTotPrice();
  };

  // 提交订单
  $scope.submit = function() {

    if ($scope.goTime === '') {
      appFunc.tipMsg(MESSAGES['order.goTime']);
      return;
    } else if (c_num === 0) {
      appFunc.tipMsg(MESSAGES['order.goNum']);
      return;
    } else if (!$scope.userInfo.main_retinueInfo.list) {
      appFunc.tipMsg(MESSAGES['order.retinue']);
      return;
    }

    var token = {};
    var OrderRetinue = [];
    var OrderItemsFare = [];

    OrderRetinue.push({
      "is_main": "1",
      "retinue_id": $scope.userInfo.main_retinueInfo.list[0].value
    });

    if ($scope.userInfo.retinueInfo.list) {
      for (var i = 0; i < $scope.userInfo.retinueInfo.list.length; i++) {
        if ($scope.userInfo.retinueInfo.list[i].isSelected) {
          var temp = {
            "is_main": "0",
            "retinue_id": $scope.userInfo.retinueInfo.list[i].value
          };
          OrderRetinue.push(temp);
        }

      }
    }
    // 判断选择人数与随行人员不匹配
    if (OrderRetinue.length != c_num + e_num) {
      appFunc.tipMsg(MESSAGES['order.retinueNum']);
      return;
    }


    token = {
      "Order": {
        "user_price": "0",
        "order_type": "2",
        "order_price": $scope.totlePrice,
        "son_order_count": "0",
        "go_time": $scope.goTime,
        "user_go_count": OrderRetinue.length
      },
      "OrderRetinue": OrderRetinue,
      "OrderItems": spliceItem(),
      "OrderItemsFare": $scope.model.OrderItemsFare
    };

    $ionicLoading.show({ template: '订单提交中' });
    Resource.createOrder(token).then(function(data) {
      $ionicLoading.hide();
      appFunc.alert('下单成功').then(function() {
        $state.go('tab.myorderdetail_2', {
          link: data.link
        }).then(function() {
          backStep.step = -2;

        });
      });

    }, function(data) {
      $ionicLoading.hide();
      appFunc.alert(data.msg);

    });

  };

  // 计算总价格
  function countTotPrice() {
    var totlePrice = 0;
    var list = $scope.model.dot_list;

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {
            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {
                list[attr1][i][attr2][j].fare[k].count = list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price;
                totlePrice = (list[attr1][i][attr2][j].fare[k].count + totlePrice * 1).toFixed(2);
              }
            }

          }
        }
      }
    }
    $scope.num = c_num + e_num;
    totlePrice = totlePrice * 1;
    return totlePrice.toFixed(2);
  }

  // 拼接订单
  function spliceItem() {
    var item = {};
    var list = $scope.model.dot_list;

    for (var attr1 in list) {
      item[attr1] = [];
      for (var i = 0; i < list[attr1].length; i++) {
        item[attr1][i] = {};
        for (var attr2 in list[attr1][i]) {
          item[attr1][i][attr2] = [];
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {
              item[attr1][i][attr2][j] = {};
              item[attr1][i][attr2][j][list[attr1][i][attr2][j].value] = [];

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].price = list[attr1][i][attr2][j].fare[k].price;
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].number = list[attr1][i][attr2][j].fare[k].number;
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].count = list[attr1][i][attr2][j].fare[k].count;

              }
            }

          }
        }
      }
    }
    item.value = $scope.model.value;
    return item;
  }

})

/**
 * 觅趣报名AA
 */
.controller('OrderActCtrl', function($scope, $state, $filter, $ionicModal, $ionicLoading, orderType, backStep, MESSAGES, appFunc, Resource, modify, security, uiCalendar, data) {
  var c_num = 0,
    e_num = 0, // 成人，儿童
    service = 0, // 服务费单价
    servicePrice = 0;
  service = data.is_organizer.value ? data.price.value : 0; // 服务费单价


  $scope.model = data;
  $scope.goTime = '';
  $scope.totlePrice = 0;
  $scope.num = 0;

  Resource.getUserInfo().then(function(data) {
    security.userInfo = data;
    $scope.userInfo = data;
  });

  $ionicModal.fromTemplateUrl('app/order/templates/selected-retinue.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$ionicView.beforeLeave', function() {
    $scope.modal.hide();
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    if (modify.ismodify) {

      Resource.getUserInfo().then(function(data) {
        security.userInfo = data;
        $scope.userInfo = data;
      });
      modify.ismodify = false;
    }
  });

  // 添加人员
  $scope.addNum = function(type, key) {
    var list = $scope.model.dot_list;
    if (type == '成人') {
      $scope.model.OrderItemsFare[key].number = ++c_num;
    } else if (type == '儿童') {
      e_num++;
      if (c_num * 2 < e_num) {
        appFunc.tipMsg(MESSAGES['order.num']);
        e_num--;
        return;
      }
      $scope.model.OrderItemsFare[key].number = e_num;
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {

                if (list[attr1][i][attr2][j].fare[k].info == '成人') {
                  list[attr1][i][attr2][j].fare[k].number = c_num;
                  $scope.model.dot_list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                } else if (list[attr1][i][attr2][j].fare[k].info == '儿童') {
                  list[attr1][i][attr2][j].fare[k].number = e_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

                if (list[attr1][i][attr2][j].fare[k].room_number != '0') {
                  list[attr1][i][attr2][j].fare[k].number = Math.ceil(c_num / list[attr1][i][attr2][j].fare[k].room_number);
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

              }

            }
          }
        }
      }
    }
    $scope.totlePrice = countTotPrice();
  };

  // 减少人员
  $scope.subNum = function(type, key) {
    var list = $scope.model.dot_list;
    if (type == '成人') {
      if (c_num === 0) return;
      c_num--;
      if (c_num * 2 < e_num) {
        c_num++;
        appFunc.tipMsg(MESSAGES['order.num']);
        return;
      }
      $scope.model.OrderItemsFare[key].number = c_num;
    } else if (type == '儿童') {
      if (e_num === 0) return;
      e_num--;
      $scope.model.OrderItemsFare[key].number = e_num;
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {

                if (list[attr1][i][attr2][j].fare[k].info == '成人') {
                  list[attr1][i][attr2][j].fare[k].number = c_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                } else if (list[attr1][i][attr2][j].fare[k].info == '儿童') {
                  list[attr1][i][attr2][j].fare[k].number = e_num;
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

                if (list[attr1][i][attr2][j].fare[k].room_number != '0') {
                  list[attr1][i][attr2][j].fare[k].number = Math.ceil(c_num / list[attr1][i][attr2][j].fare[k].room_number);
                  list[attr1][i][attr2][j].fare[k].count = (list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price).toFixed(2);
                }

              }

            }
          }
        }
      }
    }
    $scope.totlePrice = countTotPrice();
  };

  // 提交订单
  $scope.submit = function() {

    if (c_num === 0) {
      appFunc.tipMsg(MESSAGES['order.goNum']);
      return;
    } else if (!$scope.userInfo.main_retinueInfo.list) {
      appFunc.tipMsg(MESSAGES['order.retinue']);
      return;
    }

    var token = {};
    var OrderRetinue = [];
    var OrderItemsFare = [];

    OrderRetinue.push({
      "is_main": "1",
      "retinue_id": $scope.userInfo.main_retinueInfo.list[0].value
    });
    if ($scope.userInfo.retinueInfo.list) {
      for (var i = 0; i < $scope.userInfo.retinueInfo.list.length; i++) {
        if ($scope.userInfo.retinueInfo.list[i].isSelected) {
          var temp = {
            "is_main": "0",
            "retinue_id": $scope.userInfo.retinueInfo.list[i].value
          };
          OrderRetinue.push(temp);
        }

      }

    }

    // 判断选择人数与随行人员不匹配
    if (OrderRetinue.length != c_num + e_num) {
      appFunc.tipMsg(MESSAGES['order.retinueNum']);
      return;
    }


    token = {
      "Order": {
        "user_price": servicePrice,
        "order_type": "3",
        "order_price": $scope.totlePrice,
        "son_order_count": "0",
        "user_go_count": OrderRetinue.length
      },
      "OrderRetinue": OrderRetinue,
      "OrderItems": spliceItem(),
      "OrderItemsFare": $scope.model.OrderItemsFare
    };

    $ionicLoading.show({ template: '觅趣报名中' });
    Resource.createOrder(token).then(function(data) {
      $ionicLoading.hide();
      appFunc.alert('报名成功').then(function() {
        orderType.joinact = 1;
        $state.go('tab.myorderdetail_3', {
          link: data.link
        }).then(function() {
          backStep.step = -2;
        });
      });
    }, function(data) {
      $ionicLoading.hide();
      appFunc.alert(data.msg)

    })

  };

  // 计算总价格
  function countTotPrice() {
    var totlePrice = 0;
    var list = $scope.model.dot_list;

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {
            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {
                list[attr1][i][attr2][j].fare[k].count = list[attr1][i][attr2][j].fare[k].number * list[attr1][i][attr2][j].fare[k].price;
                totlePrice = (list[attr1][i][attr2][j].fare[k].count + totlePrice * 1).toFixed(2);
              }
            }

          }
        }
      }
    }
    $scope.num = c_num + e_num;
    servicePrice = service * $scope.num;
    totlePrice = totlePrice * 1 + servicePrice * 1;
    return totlePrice.toFixed(2);
  }

  // 拼接订单
  function spliceItem() {
    var item = {};
    var list = $scope.model.dot_list;

    for (var attr1 in list) {
      item[attr1] = [];
      for (var i = 0; i < list[attr1].length; i++) {
        item[attr1][i] = {};
        for (var attr2 in list[attr1][i]) {
          item[attr1][i][attr2] = [];
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {
              item[attr1][i][attr2][j] = {};
              item[attr1][i][attr2][j][list[attr1][i][attr2][j].value] = [];

              for (var k = 0; k < list[attr1][i][attr2][j].fare.length; k++) {
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].price = list[attr1][i][attr2][j].fare[k].price;
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].number = list[attr1][i][attr2][j].fare[k].number;
                item[attr1][i][attr2][j][list[attr1][i][attr2][j].value][k][list[attr1][i][attr2][j].fare[k].value].count = list[attr1][i][attr2][j].fare[k].count;

              }
            }

          }
        }
      }
    }
    item.value = $scope.model.value;
    return item;
  }
})

/**
 * 觅趣报名A
 */
.controller('OrderActACtrl', function($scope, $state, $stateParams, orderType, removeBackView, Resource, appFunc, MESSAGES) {
  var c_num = 1,
    e_num = 0,
    timer = null;
  id = $stateParams.id;

  $scope.c_num = 1;
  $scope.e_num = 0;
  $scope.mainRetinueInfo = { name: '', phone: '', code: '' };
  $scope.adultRetinueInfo = [];
  $scope.childRetinueInfo = [];

  $scope.addNum = function(type) {
    if (type == 'adult') {
      $scope.c_num = ++c_num;
      $scope.adultRetinueInfo.push({ name: '', phone: '' });
    } else if (type == 'child') {
      e_num++;
      if (c_num * 2 < e_num) {
        appFunc.tipMsg(MESSAGES['order.num']);
        e_num--;
        return;
      }
      $scope.e_num = e_num;
      $scope.childRetinueInfo.push({ name: '' });
    }
  };
  $scope.subNum = function(type) {
    if (type == 'adult') {
      if (c_num === 1) return;
      c_num--;
      if (c_num * 2 < e_num) {
        c_num++;
        appFunc.tipMsg(MESSAGES['order.num']);
        return;
      }
      $scope.c_num = c_num;
      $scope.adultRetinueInfo.pop();
    } else if (type == 'child') {
      if (e_num === 0) return;
      e_num--;
      $scope.e_num = e_num;
      $scope.childRetinueInfo.pop();
    }
  };

  $scope.$on('destory', function() {
    clearInterval(timer);
  });

  $scope.getCode = function(e) {
    if ($scope.mainRetinueInfo.phone === '') {
      appFunc.tipMsg('请输入手机号码');
      return;
    } else if (!/^1[34578][0-9]{9}$/.test($scope.mainRetinueInfo.phone)) {
      appFunc.tipMsg('手机号码格式有误');
      return;
    }
    var ele = angular.element(e.target);
    var i = 60;
    if (ele.hasClass('gray')) {
      return;
    }
    ele.addClass('gray');
    ele.html('获取验证码(' + i + ')');
    timer = setInterval(function() {
      i--;
      ele.html('获取验证码(' + i + ')');
      if (i == 1) {
        ele.removeClass('gray');
        ele.html('获取验证码');

        clearInterval(timer);
      }

    }, 1000);


    var token = {
      "phone": $scope.mainRetinueInfo.phone
    };

    Resource.getApplyCode(id, token).then(function(data) {

    }, function(data) {
      appFunc.tipMsg(data.msg);
      ele.removeClass('gray');
      ele.html('获取验证码');
      clearInterval(timer)
    });
  };

  $scope.submit = function() {
    if (!checkForm()) return;
    var token = mergedata();
    Resource.actApply(id, token).then(function(data) {
      orderType.joinact = 2;
      $state.go('tab.myjoinact').then(function() {
        removeBackView.remove();
      });
    }, function(data) {
      for (var msgName in data.data.form) {
        for (var attr in data.data.form[msgName]) {
          appFunc.tipMsg(data.data.form[msgName][attr][0]);
        }
      }
    });
  };

  function checkForm() {
    var inputList = angular.element(document.querySelectorAll('.order.apply input'));
    inputList.removeClass('has-error');

    for (var i = 0; i < inputList.length; i++) {
      var ele = angular.element(inputList[i]);
      var type = ele.attr('data-type');
      var value = ele.val();

      if (type == 'name') {
        if (value === '') {
          appFunc.tipMsg('姓名不能为空');
          ele.addClass('has-error');
          return false;
        } else if (value.length > 10) {
          appFunc.tipMsg('姓名长度不能大于10个字符');
          ele.addClass('has-error');
          return false;
        }

      } else if (type == 'phone') {
        if (value === '') {
          appFunc.tipMsg('手机号码不能为空');
          ele.addClass('has-error');
          return false;
        } else if (!/^1[34578][0-9]{9}$/.test(value)) {
          appFunc.tipMsg('手机号码格式有误');
          ele.addClass('has-error');
          return false;
        }
      } else if (type == 'code') {
        if (value === '') {
          appFunc.tipMsg('短信验证码不能为空');
          ele.addClass('has-error');
          return false;
        }
      }
    }
    return true;
  }

  function mergedata() {
    var i = 0,
      tmp = [],
      token = {
        "Attend": [{
          "sms": $scope.mainRetinueInfo.code, //短信验证码 
          "name": $scope.mainRetinueInfo.name, //报名人姓名
          "phone": $scope.mainRetinueInfo.phone, //报名手机号 获取短信的手机号
          "people": $scope.adultRetinueInfo.length + 1, //成人数量 包含自己 （报名人员默认成人）
          "children": $scope.childRetinueInfo.length //儿童 数量
        }]
      };

    for (i = 0; i < $scope.adultRetinueInfo.length; i++) {
      $scope.adultRetinueInfo[i].is_people = 1;
      tmp.push($scope.adultRetinueInfo[i]);

    }

    for (i = 0; i < $scope.childRetinueInfo.length; i++) {
      $scope.childRetinueInfo[i].is_people = 0;
      tmp.push($scope.childRetinueInfo[i]);
    }

    token.Attend = token.Attend.concat(tmp);
    return token;
  }
})


.filter('roomNumber', function() {
  return function(info, type, num) {
    if (type !== '2') return info;
    return "单 双 三 四 五 六 七 八 九 十".split(" ")[parseInt(num) - 1] + "人间";
  };
})

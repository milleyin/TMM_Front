angular.module('order')

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.order-detail1', {
      url: '/orderdetail1/:type/:id',

      views: {
        'tab-order': {
          templateUrl: 'app/order/templates/dot-order-detail.html',
          controller: 'OrderDetailCtrl'
        }
      }

    })
    .state('tab.order-detail2', {
      url: '/orderdetail2/:type/:id',

      views: {
        'tab-order': {
          templateUrl: 'app/order/templates/line-order-detail.html',
          controller: 'OrderDetailCtrl'
        }
      }

    })
    .state('tab.order-detail3', {
      url: '/orderdetail3/:id/:link',

      views: {
        'tab-order': {
          templateUrl: 'app/order/templates/act-order-detail.html',
          controller: 'ActOrderDetailCtrl'
        }
      }

    })

}])

.controller('OrderDetailCtrl', function($stateParams, $scope,ENV, Resource, appFunc, modify) {
  var id = $stateParams.id;
  var link = ENV.apiEndpoint + '/index.php?r=store/store_order/view&id=' + id;
  $scope.dayNum = ['第一天上午', '第一天下午', '第二天上午', '第二天下午', '第三天上午', '第三天下午', '第四天上午', '第四天下午', '第五天上午', '第五天下午', '第六天上午', '第六天下午', '第七天上午', '第七天下午', '第八天上午', '第八天下午', '第九天上午', '第九天下午', '第十天上午', '第十天下午']
  $scope.flag = false;

  getData();

  function getData() {

    Resource.get(link).then(function(data) {
      $scope.model = data;
      id = data.value;
      if (data.status.order_status.value === '0') {
        $scope.flag = true;
      } else {
        $scope.flag = false;
      }
    }, function(data) {

    });
  }

  // 接收
  $scope.receive = function() {
    Resource.mjAcceptOrder(id).then(function(data) {
      getData();
      modify.isModify = true;
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };
  // 拒绝
  $scope.refuse = function() {
    Resource.mjRefuseOrder(id).then(function(data) {
      getData();
      modify.isModify = true;
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };

  $scope.sendCode = function(barcode) {
    Resource.confirmConsume(barcode).then(function(data){

    }, function(data){

    });
  };

})


.controller('ActOrderDetailCtrl', function($stateParams, $scope,ENV, Resource, appFunc, modify){
  var id = $stateParams.id;
  var link = $stateParams.link;
  $scope.dayNum = ['第一天上午', '第一天下午', '第二天上午', '第二天下午', '第三天上午', '第三天下午', '第四天上午', '第四天下午', '第五天上午', '第五天下午', '第六天上午', '第六天下午', '第七天上午', '第七天下午', '第八天上午', '第八天下午', '第九天上午', '第九天下午', '第十天上午', '第十天下午']
  $scope.flag = false;

  getData();

  function getData() {

    Resource.get(link).then(function(data) {
      $scope.model = data;
      id = data.value;
     
    }, function(data) {

    });
  }

  // 接收
  $scope.receive = function() {
    Resource.mjAcceptOrder(id).then(function(data) {
      getData();
      modify.isModify = true;
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };
  // 拒绝
  $scope.refuse = function() {
    Resource.mjRefuseOrder(id).then(function(data) {
      getData();
      modify.isModify = true;
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };

  $scope.sendCode = function(barcode) {
    Resource.confirmConsume(barcode).then(function(data){

    }, function(data){

    });
  };
})
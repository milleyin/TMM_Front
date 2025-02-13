angular.module('account', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.account', {
      url: '/account',

      views: {
        'tab-account': {
          templateUrl: 'app/income/templates/account.html',
          controller: 'AccountCtrl',
        }

      }

    });

}])

.controller('AccountCtrl', function($scope, $http, $timeout, Resource, autoRefresh) {

  var lock = false;
  $scope.model = {};

  $scope.$on("$ionicView.loaded", function() {
    autoRefresh.start('account-content');
  });

  $scope.doRefresh = function() {
    getNewData();
  };

  $scope.loadMore = function() {
    loadMoreData();
    
  };


  function getNewData() {
    lock = true;
    Resource.getAccount().then(function(data) {
      $scope.model = data;
      $scope.model.list_data = data.list_data;
      $scope.model.nextPage = data.page.next;
      $scope.$broadcast('scroll.refreshComplete');
      lock = false;
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
      lock = false;
    });
  }

  function loadMoreData() {
    if (!$scope.model.nextPage) return;
    Resource.get($scope.model.nextPage).then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
      $scope.$broadcast("scroll.infiniteScrollComplete");
    }, function(data) {
      $scope.$broadcast("scroll.infiniteScrollComplete");
    });
  }

  /*扫描二维码*/
  $scope.getCode = function() {
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    try {
      if (isIPad || isIOS) { //ios
        connectWebViewJavascriptBridge(function(bridge) {
          bridge.registerHandler('JavascriptHandler', function(data, responseCallback) {
            var str = data;
            //后台传值
            sendCode(str);
          });
          bridge.callHandler('ObjcCallback', {
            'QRCode': ''
          }, function(response) {});
        })
      } else if (isAndroid) { //Android
        //请求安卓后台
        var str = window.jsObj.scanCode();
        sendCode(str);
      }
    } catch (e) {

    }
  }

});

angular.module('item', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.item', {
      url: '/item',

      views: {
        'tab-item': {
          templateUrl: 'app/item/templates/item.html',
          controller: 'ItemCtrl',
          // resolve: {
          //   data: function($ionicViewSwitcher, $ionicHistory) {
          //     var currentView = $ionicHistory.currentView();
          //     if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
          //       $ionicViewSwitcher.nextTransition("none");
          //     }

          //   }
          // }

        }

      }

    });

}])

.controller('ItemCtrl', function($scope, $http, $ionicHistory, $timeout, Resource, autoRefresh) {

  var lock = false;
  $scope.model = {};

  $scope.$on("$ionicView.loaded", function() {
    autoRefresh.start('item-content');
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicHistory.clearHistory();
  });
  // 登录成功
  $scope.$on("loginSuccess", function(data, msg) {
    autoRefresh.start('item-content');
  });

  $scope.doRefresh = function() {
    getNewData();
  };

  $scope.loadMore = function() {
    loadMoreData();

  };


  function getNewData() {
    lock = true;
    Resource.getItem().then(function(data) {
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

});

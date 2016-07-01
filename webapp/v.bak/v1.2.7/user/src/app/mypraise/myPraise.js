angular.module('mypraise', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.mypraise', {
      url: '/mypraise',
      templateUrl: 'app/mypraise/templates/my-praise.html',
      controller: 'MyPraiseCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.mypraise') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.getMyPraise();
          }
        }
      }
    });
}])

.controller('MyPraiseCtrl', function($scope, $http, $ionicHistory, $rootScope, modify, data, Resource, autoRefresh) {

  $scope.model = {
    nextPage: '',
    list_data: []
  };
  $scope.model.nextPage = data.page.next;
  $scope.model.list_data = data.list_data;

  // 请求网络数据
  function getData() {
    Resource.getMyPraise().then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.model.nextPage = "";
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.$on("$ionicView.enter", function() {
    if (modify.ismodify) {
      getData();
      modify.ismodify = false;
    }
  });
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
      });
    }
  };
})

.directive('praiseItem', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/mypraise/templates/my-praise-item.html'
  }
})

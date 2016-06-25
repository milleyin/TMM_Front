angular.module('recommend', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.recommend', {
      url: '/recommend',

      templateUrl: 'app/recommend/recommend.html',
      controller: 'RecommendCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory) {
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none")
          }

        }
      }

    })
    .state('tab.seek', {
      url: '/seek',

      templateUrl: 'app/recommend/seek.html',
      controller: 'SeekCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory) {
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none")
          }
        }
      }

    })

}])

.controller('RecommendCtrl', function($scope, $http, $ionicHistory, $rootScope, Resource, autoRefresh) {

    $scope.model = {
      nextPage: '',
      list_data: []
    }
    
    // 请求网络数据
    function getData() {
      Resource.getRecommend().then(function(data) {
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = data.list_data;
        $scope.$broadcast('scroll.refreshComplete');
      }, function(data) {

        $scope.$broadcast('scroll.refreshComplete');
      })
    }

    $scope.$on("$ionicView.loaded", function() {
      autoRefresh.start('ptr-content');
    });

    $scope.$on("$ionicView.enter", function() {
      $ionicHistory.clearHistory();
    });

    // 下拉刷新
    $scope.doRefresh = function() {
      getData();
    }

    // 加载更多
    $scope.loadMore = function() {
      if ($scope.model.nextPage) {
        Resource.get($scope.model.nextPage).then(function(data) {
          console.log(data)
          $scope.model.nextPage = data.page.next;
          $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }, function(data) {
          $scope.$broadcast("scroll.infiniteScrollComplete");
        })
      }
    }


  })
  .controller('SeekCtrl', function($scope, $http, $ionicHistory, $rootScope, Resource, autoRefresh) {

    $scope.model = {
      nextPage: '',
      list_data: []
    }


    // 请求网络数据
    function getData() {
      Resource.getSeek().then(function(data) {
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = data.list_data;
        $scope.$broadcast('scroll.refreshComplete');
      }, function(data) {
        console.log('---', data)
        $scope.$broadcast('scroll.refreshComplete');
      })
    }

    $scope.$on("$ionicView.loaded", function() {
      autoRefresh.start('seek-content');
    });

    $scope.$on("$ionicView.enter", function() {
      $ionicHistory.clearHistory();
    });

    // 下拉刷新
    $scope.doRefresh = function() {
      getData();
    }

    // 加载更多
    $scope.loadMore = function() {
      if ($scope.model.nextPage) {
        Resource.get($scope.model.nextPage).then(function(data) {
          console.log(data)
          $scope.model.nextPage = data.page.next;
          $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }, function(data) {
          $scope.$broadcast("scroll.infiniteScrollComplete");
        })
      }
    }


  })
  .directive('recommendItem', function() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/recommend/recommend-item.html'
    }
  })

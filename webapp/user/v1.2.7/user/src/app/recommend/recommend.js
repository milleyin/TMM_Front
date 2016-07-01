angular.module('recommend', ['search'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    // .state('tab.recommend', {
    //   url: '/recommend',

    //   templateUrl: 'app/recommend/templates/recommend.html',
    //   controller: 'RecommendCtrl',
    //   resolve: {
    //     data: function($ionicViewSwitcher, $ionicHistory, ENV, device) {
    //       if (ENV.device === 'app') {
    //         device.exitSeekFresh();
    //       }
    //       var currentView = $ionicHistory.currentView();
    //       if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
    //         $ionicViewSwitcher.nextTransition("none");
    //       }

    //     }
    //   }

    // })
    .state('tab.seek', {
      url: '/seek',

      templateUrl: 'app/recommend/templates/seek.html',
      controller: 'SeekCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory, ENV, device) {
          if (ENV.device === 'app') {
            device.exitSeekFresh();
          }
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none");
          }
        }
      }

    });

}])

// .controller('RecommendCtrl', function($scope, $http, $ionicHistory, $rootScope, Resource, autoRefresh) {


//   $scope.model = {
//     nextPage: '',
//     list_data: []
//   };

//   // 请求网络数据
//   function getData() {
//     Resource.getRecommend().then(function(data) {
//       $scope.model.nextPage = data.page.next;
//       $scope.model.list_data = data.list_data;
//       $scope.$broadcast('scroll.refreshComplete');
//     }, function(data) {

//       $scope.$broadcast('scroll.refreshComplete');
//     });
//   }

//   $scope.$on("$ionicView.loaded", function() {
//     autoRefresh.start('recommend-content');
//   });

//   $scope.$on("$ionicView.enter", function() {
//     $ionicHistory.clearHistory();
//   });

//   $scope.$on("refreshLocation", function() {
//     getData();
//   });

//   // 下拉刷新
//   $scope.doRefresh = function() {
//     getData();
//   };

//   // 加载更多
//   $scope.loadMore = function() {
//     if ($scope.model.nextPage) {
//       Resource.get($scope.model.nextPage).then(function(data) {

//         $scope.model.nextPage = data.page.next;
//         $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
//         $scope.$broadcast("scroll.infiniteScrollComplete");
//       }, function(data) {
//         $scope.$broadcast("scroll.infiniteScrollComplete");
//       })
//     }
//   }


// })

.controller('SeekCtrl', function($scope, $http, $ionicHistory, $rootScope, modify, ENV, Resource, autoRefresh) {
  var url = ENV.apiEndpoint + '/index.php?r=api/shops/index&page=1';
  var selectTitle = "";

  $scope.noData = false;
  $scope.selectValue = '';
  $scope.selectTitle = '';
  $scope.address = '选择';
  $scope.model = {
    nextPage: '',
    list_data: [],
    search: [],
    tags: []
  };

  $scope.$on("$ionicView.loaded", function() {
    autoRefresh.start('seek-content');
  });

  $scope.$on("$ionicView.enter", function() {
    url = ENV.apiEndpoint + '/index.php?r=api/shops/index&page=1';
    $scope.isShowTag = false;
    if (modify.ismodify) {
      autoRefresh.start('seek-content');
      modify.ismodify = false;
    }
    $ionicHistory.clearHistory();
  });

  // 选择标题栏目
  $scope.selectTit = function(data, index) {
    if ($scope.selectTitle === index) {
      $scope.isShowTag = !$scope.isShowTag;
      return;
    }
    selectTitle = index;
    $scope.isShowTag = true;
    if (ENV.device === 'app' && ENV.iOS) {
      $scope.seekIos = true;
    }
    $scope.model.tags = data.son;
  };

  // 选择标签
  $scope.selectTag = function(link, value) {
    $scope.selectTitle = selectTitle;
    url = link;
    $scope.selectValue = value;
    $scope.isShowTag = false;
    autoRefresh.start('seek-content');
  };

  // 关闭标签
  $scope.closeTag = function(link, value) {
    $scope.isShowTag = false;
  };

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

  // 请求网络数据
  function getData() {
    Resource.get(url).then(function(data) {
      $scope.noData = !data.list_data.length;
      $scope.model.search = data.search;
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.address = data.orientation.value ? data.orientation.value.address_info.name : (data.location.value ? data.location.value.address_info.name : '选择');
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

})

.directive('recommendItem', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/recommend/templates/recommend-item.html',
    link: function(scope, element) {

      element.find('img').css({
        height: window.innerWidth * 2 / 3 + 'px'
      });

    }
  };
})

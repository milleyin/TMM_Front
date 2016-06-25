angular.module('order', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.order', {
      url: '/order',

      views: {
        'tab-order': {
          templateUrl: 'app/order/templates/order.html',
          controller: 'OrderCtrl'
        }

      }

    });

}])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.search', {
      url: '/search/:searchOpt',
      views: {
        'tab-order': {
          templateUrl: 'app/order/templates/search.html',
          controller: 'SearchCtrl',
        }
      }
    });
}])

.controller('OrderCtrl', function($scope, $http, $rootScope, $ionicScrollDelegate, $ionicHistory, $timeout, $state, modify, Resource, autoRefresh) {
  var mirrorData = {},
      funData = {};

  $scope.model = {};
  $scope.type = 1;

  $scope.$on("$ionicView.loaded", function() {
    autoRefresh.start('order-content');
  });

  $scope.$on("$ionicView.enter", function() {
    if (modify.isModify) {
      autoRefresh.start('order-content');
      modify.isModify = false;
    }
    $ionicHistory.clearHistory();
  });

  // 登录成功
  $scope.$on("loginSuccess", function(data, msg) {
    autoRefresh.start('order-content');
  });

  $scope.doRefresh = function() {
    if ($scope.type === 1) {
      getMirrorData();
    } else if ($scope.type === 2) {
      getFunData();
    }
  };

  $scope.loadMore = function() {
    loadMoreData();
  };

  $scope.changeData = function(type) {
    $scope.type = type;
    if (type === 1) {
      if (mirrorData.list_data !== undefined) {
        $scope.model = mirrorData;

      } else {
        autoRefresh.start('order-content');
      }
    } else if (type === 2) {
      if (funData.list_data !== undefined) {
        $scope.model = funData;
      } else {
        autoRefresh.start('order-content');
      }
    }
  };


  //觅境接受订单
  $scope.mjAcceptOrder = function(shopId){
    Resource.mjAcceptOrder(shopId).then(function(data) {
      getMirrorData();
    });
  };
  
  //觅境拒绝订单
  $scope.mjRefuseOrder = function(shopId){
    Resource.mjRefuseOrder(shopId).then(function(data) {
      getMirrorData();
    });
  };


  // 获取觅境数据
  function getMirrorData() {
    Resource.getMirror().then(function(data) {
      mirrorData.list_data = data.list_data;
      mirrorData.nextPage = data.page.next;
      $scope.model = mirrorData;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // 获取觅趣数据
  function getFunData() {
    Resource.getFun().then(function(data) {
      funData.list_data = data.list_data;
      funData.nextPage = data.page.next;
      $scope.model = funData;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');

    });
  }

  // 加载更多
  function loadMoreData() {
    if (!$scope.model.nextPage) return;
    Resource.get($scope.model.nextPage).then(function(data) {
      if ($scope.type === 1) {
        mirrorData.list_data = mirrorData.list_data.concat(data.list_data);
        mirrorData.nextPage = data.page.next;
        $scope.model = mirrorData;
      } else if ($scope.type === 2) {
        funData.list_data = funData.list_data.concat(data.list_data);
        funData.nextPage = data.page.next;
        $scope.model = funData;
      }
      $scope.$broadcast("scroll.infiniteScrollComplete");
    }, function(data) {
      $scope.$broadcast("scroll.infiniteScrollComplete");
    });
  }

  $scope.goToSearch = function (){
    $state.go('tab.search', {
      'searchOpt': $scope.type
    });
  }

})

.controller('SearchCtrl', function($scope,$ionicLoading, $ionicScrollDelegate, $stateParams, appFunc, Resource) {
  var searchText = '';
  $scope.storage = getStorage();
  $scope.isHistory = true;

  $scope.searchOpt = $stateParams.searchOpt;
  if($scope.searchOpt == 1){
    $scope.placeValue = "觅境搜索用户/项目/订单号";
  } else if($scope.searchOpt == 2){
    $scope.placeValue = "觅趣搜索用户/项目/订单号";
  }
  // 搜索框搜索
  $scope.searchContent = function() {

    var input = document.querySelectorAll('.item-input-wrapper .bar-search')[0];
    searchText = input.value;
    input.blur();
    getSearchList(searchText);
    if (searchText === '') return;
    setStorage(searchText);
  };

  $scope.clearContent = function() {
    var input = document.querySelectorAll('.item-input-wrapper .bar-search')[0];
    input.value = '';
    input.focus();
    $scope.isHistory = true;
  }


  // 点击搜索历史搜索
  $scope.searchHistory = function(ev) {
    getSearchList(ev.target.innerHTML);
  };

  /**
   * 清除历史记录
   * @return {[type]} [description]
   */
  $scope.clearHistory = function() {
    localStorage.setItem('searchHistory', null);
    $scope.storage = getStorage();
  };

  // 加载下一页
  $scope.loadMore = function() {
    if ($scope.nextPage) {
      Resource.get($scope.nextPage).then(function(data) {
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.nextPage = data.page.next;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  /**
   * 发送搜索请求
   * @return {[type]} [description]
   */
  function getSearchList(value) {
    $ionicLoading.show({template: '加载中...'});
    var key = 'search_info';
    Resource.getSearchList($scope.searchOpt, key, value).then(function(data){
      $scope.isHistory = false;
      $scope.model = data;
      $scope.nextPage = data.page.next;
      $ionicScrollDelegate.scrollTo(0, 0, true); //回到内容顶部
      $scope.$broadcast("scroll.infiniteScrollComplete");
      $ionicLoading.hide();
    }, function(data){$ionicLoading.hide();});
  }
  
  /**
   * 设置存储搜索历史
   * @param {[type]} item 存储的值
   */
  function setStorage(item) {
    try {
      arr = JSON.parse(localStorage.getItem('searchHistory'));
    } catch (e){
      arr = [];
    }
    arr = angular.isArray(arr) ? arr : [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
      if (arr[i] == item) return;
    }

    if (len >= 10 ) {
      arr.unshift(item);
      arr.pop();
    } else if (len === 0) {
      arr.push(item);
    } else {
      arr.unshift(item);
    }
    $scope.storage = arr;
    localStorage.setItem('searchHistory', JSON.stringify(arr));
  }

  /**
   * 获取存储的值
   * @return {[type]} [description]
   */
  function getStorage() {
    var arr = [];
    try {
      arr = JSON.parse(localStorage.getItem('searchHistory'));
    } catch (e) {
      arr = [];
    }
    return arr;
  }
})


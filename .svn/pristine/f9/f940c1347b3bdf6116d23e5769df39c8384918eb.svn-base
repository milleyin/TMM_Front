angular.module('search', [])

.config(function($stateProvider) {
  $stateProvider
    .state('tab.search', {
      url: '/search',
      templateUrl: 'app/search/templates/search.html',
      controller: 'SearchCtrl'
    });
})


.controller('SearchCtrl', function($scope,$ionicLoading, $ionicScrollDelegate, appFunc, Resource) {
  var searchText = '';
  $scope.storage = getStorage();
  $scope.isHistory = true;

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
    Resource.getSearchList(key, value).then(function(data){
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


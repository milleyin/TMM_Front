'use strict';
angular.module('tmm.controllers')
  /**
   * MeCtrl 我控制器
   */
  .controller('SeekCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    $ionicLoading,
    $log,
    Tabs,
    getSeekList,
    getShopDetail,
    tmmCache,
    PtrService) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      // 进入页面之前, 设置导航栏状态为显示，并通知MainCtrl更新导航栏状态
      Tabs.setState(false);
      $rootScope.$broadcast('updateState');
    });

    // 触发下拉刷新
    $scope.$on("$ionicView.loaded", function() {
      PtrService.triggerPtr('ptr-content');
    });
    // 下一页的链接
    var nextLink = '';
    $scope.seekModel = {
      'pullingText': '松开刷新',
      'seekList': []
    };
    // 达到松开高度时触发
    $scope.doPulling = function() {
      $scope.seekModel.pullingText = '松开刷新';
    };
    // 下拉刷新列表
    $scope.doRefresh = function() {
      // 获取推荐列表
      getSeekList(
        '',
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $scope.seekModel.seekList = dataRes.data.list_data;
            nextLink = dataRes.data.page.next;
          } else {
            // 网络超时，请重试...
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function(dataRes, statusCode) {
          // 网络超时，请重试...
          $scope.$broadcast('scroll.refreshComplete');
        }
      );

    };
    // 加载更多
    $scope.loadMore = function() {
      if (nextLink) {
        getSeekList(
          nextLink,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              $scope.seekModel.seekList = $scope.seekModel.seekList.concat(dataRes.data.list_data);
              nextLink = dataRes.data.page.next;
            } else {
              // 网络超时，请重试...
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
          },
          function(dataRes, statusCode) {
            // 网络超时，请重试...
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
        );
      }
    };
    // 是否还没更多数据
    $scope.hasMoreData = function() {
      if (nextLink) {
        return true;
      }
      return false;
    };

    // 显示商品详情页
    $scope.showView = function(type, url) {
      getShopDetail(
        url,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $ionicLoading.show({
              template: "正在载入数据，请稍后...",
            });
            
            var page = {
              1: 'tab.dot-detail',
              2: 'tab.line-detail',
              3: 'tab.act-detail'
            };
            setTimeout(function() {
              $ionicLoading.hide();
              $state.go(page[type], {
                'link': url,
                'type': type
              });
            }, 1000); 
            
          } else {
            $ionicLoading.show({
              template: "该景点未开放，请稍候再试",
              duration: 2000
            });
          }
        },
        function(dataRes, statusCode) {
          //$ionicLoading.hide();
        }
      );
    };

  });
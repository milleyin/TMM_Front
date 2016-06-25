'use strict';
angular.module('tmm.controllers')
  /**
   * MeCtrl 我控制器
   */
  .controller('MyCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    $log,
    Tabs,
    log,
    getUserInfo,
    userService,
    tmmCache,
    logout) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      // 进入页面之前, 设置导航栏状态为显示，并通知MainCtrl更新导航栏状态
      Tabs.setState(false);
      $rootScope.$broadcast('updateState');
    });

    $scope.myData = {
      'userInfo': {},
    };

    // 获取用户信息
    getUserInfo(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $log.debug('dat',dataRes);
          tmmCache.set("loginPhone", dataRes.data.userInfo.phone);
          $scope.myData.userInfo = dataRes.data.userInfo;
        }
      },
      function(dataRes, statusCode) {

      });

    // 退出登录
    $scope.logout = function() {
      logout(
        function(dataRes, statusCode) {
          $scope.myData.userInfo = {};
        },
        function(dataRes, statusCode) {

        });
    };

    log.info('MyCtrl....');
  })

.controller('MyPraiseCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    $ionicLoading,
    $log,
    Tabs,
    getMyPraiseList,
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
    $scope.praiseModel = {
      'pullingText': '松开刷新',
      'praiseList': []
    };
    // 达到松开高度时触发
    $scope.doPulling = function() {
      $scope.praiseModel.pullingText = '松开刷新';
    };
    // 下拉刷新列表
    $scope.doRefresh = function() {
      // 获取推荐列表
      getMyPraiseList(
        '',
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $scope.praiseModel.praiseList = dataRes.data.list_data;
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
        getMyPraiseList(
          nextLink,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              $scope.praiseModel.praiseList = $scope.praiseModel.praiseList.concat(dataRes.data.list_data);
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

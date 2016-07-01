'use strict';
angular.module('tmm.controllers')
  /**
   * MeCtrl 我控制器
   */
  .controller('MainCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    $ionicTabsDelegate,
    sessionData,
    log,
    Tabs) {
    log.info('MainCtrl....');
    // 设置导航栏状态为显示
    $rootScope.hiddenTabs = false;
    // 监听导航栏的设置状态
    $rootScope.$on('updateState', function() {
      $scope.hiddenTabs = Tabs.getState();
    });


    $scope.on_show = function(idx) {
      //$ionicTabsDelegate.select(idx);
      $state.go('tab.recommend');

      log.info('显示推荐列表....', idx);
    };

  });

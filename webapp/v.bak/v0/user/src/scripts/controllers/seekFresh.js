'use strict';
angular.module('tmm.controllers')
  /**
   * MeCtrl 我控制器
   */
  .controller('SeekFreshCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    Tabs,
    log) {

    $scope.$on('$ionicView.beforeEnter', function() {
      // 进入页面之前, 设置导航栏状态为显示，并通知MainCtrl更新导航栏状态
      Tabs.setState(false);
      $rootScope.$broadcast('updateState');
    });

    log.info('SeekFreshCtrl....');
  });

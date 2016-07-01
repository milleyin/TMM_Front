'use strict';
angular.module('tmm.controllers')
  
  /**
  * 我的订单
  */
  .controller('MyorderCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicActionSheet,
    $log,
    getOrderList,
    PtrService,
    Tabs) {

    // 触发下拉刷新
    $scope.$on("$ionicView.loaded", function() {
      PtrService.triggerPtr('ptr-content');
    });
    // 下一页的链接
    var nextLink = '';
    $scope.orderModel = {
      'pullingText': '松开刷新'
    };
    // 达到松开高度时触发
    $scope.doPulling = function() {
      $scope.orderModel.pullingText = '松开刷新';
    };

    var type = 'order_dot_thrand'; //觅境，觅趣的链接
    $scope.infoList = [];
	  $scope.isActive = 1;

    //加载点击选项卡对应的订单  
		$scope.showTab = function(index) {
			$scope.isActive = index;
      if(index == 1){
        type = 'order_dot_thrand';
      } else if(index == 2){
        type = 'order_tour';
      }
      $scope.doRefresh(type);   
		};

    //获得订单列表
    $scope.doRefresh = function(){ 
      getOrderList(
        '',
        type,
        function(dataRes, statusCode){
          if (dataRes.status == 1) {
            nextLink = dataRes.data.page.next;
            $scope.infoList = dataRes.data.list_data;
          } else {
            // 网络超时，请重试...
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function(dataRes, statusCode){
          $scope.$broadcast('scroll.refreshComplete');
        }
      );
    };

    // 加载更多
    $scope.loadMore = function() {
      if (nextLink) {
        getOrderList(
          nextLink,
          type,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              $scope.infoList = $scope.infoList.concat(dataRes.data.list_data);
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

    $log.info("77777777",$scope.hasMoreData());
  })
  

  /**
  * 我发起的活动
  */
.controller('MylaunchCtrl', function(
		$scope, 
		$rootScope,
		$ionicPopover,
    Tabs,
    log) {
    //浮动框
    $scope.popover = $ionicPopover.fromTemplateUrl('my-launch-act-popover.html', {
      scope: $scope
    });
	  // .fromTemplateUrl() method
	  $ionicPopover.fromTemplateUrl('my-launch-act-popover.html', {
	    scope: $scope
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });
	
	
	  $scope.openPopover = function($event) {
	    $scope.popover.show($event);
	  };
	  $scope.closePopover = function() {
	    $scope.popover.hide();
	  };

	});
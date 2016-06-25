angular.module('item', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.more-detail1', { //吃
      url: '/eat/:link',

      templateUrl: 'app/items/templates/eat.html',
      controller: 'MoreDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    })

  .state('tab.more-detail2', { //住
    url: '/live/:link',

    templateUrl: 'app/items/templates/live.html',
    controller: 'MoreDetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        $ionicLoading.show({
          template: '玩命加载中...',
          hideOnStateChange: true
        });
        return Resource.get($stateParams.link);
      }
    }
  })

  .state('tab.more-detail3', { //玩
    url: '/play/:link',

    templateUrl: 'app/items/templates/play.html',
    controller: 'MoreDetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        $ionicLoading.show({
          template: '玩命加载中...',
          hideOnStateChange: true
        });
        return Resource.get($stateParams.link);
      }
    }
  })

  // 分享项目兼容上一版本
  .state('tab.share-item1', {
    url: '/item/1/:id/1',

    templateUrl: 'app/items/templates/eat.html',
    controller: 'MoreDetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        $ionicLoading.show({
          template: '玩命加载中...',
          hideOnStateChange: true
        });
        return Resource.getItemDetail(1, $stateParams.id);
      }
    }
  })
  .state('tab.share-item2', {
    url: '/item/2/:id/2',

    templateUrl: 'app/items/templates/eat.html',
    controller: 'MoreDetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        $ionicLoading.show({
          template: '玩命加载中...',
          hideOnStateChange: true
        });
        return Resource.getItemDetail(2, $stateParams.id);
      }
    }
  })
  .state('tab.share-item3', {
    url: '/item/3/:id/3',

    templateUrl: 'app/items/templates/eat.html',
    controller: 'MoreDetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        $ionicLoading.show({
          template: '玩命加载中...',
          hideOnStateChange: true
        });
        return Resource.getItemDetail(3, $stateParams.id);
      }
    }
  })

}])

//吃，住，玩的详情页
.controller('MoreDetailCtrl', function($scope, $stateParams, $sce, $ionicPopover, $ionicPopup, data, Resource, appFunc, device, ENV) {
  $scope.info = data;
  $scope.contentHTML = $sce.trustAsHtml(data.content);
  if (ENV.device === 'app') {
    $scope.disMap = true;
  } else {
    $scope.disMap = false;
  }
  $ionicPopover.fromTemplateUrl('app/items/templates/item-intro.tpl.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.remove();
  };
  // 清除浮动框
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });


  //拨打电话确认框
  $scope.detailCall = function() {
    $scope.btnClick = true;
    var callNum = $scope.info.phone;

    device.tmmWxCallPhone(callNum).then(function() {
      $scope.btnClick = false;
    })
  }

  $scope.$on('modal.removed', function() {

  });

  $scope.linePraise = function() {

  }

  $scope.model = data;
  var shareUrl = ENV.apiEndpoint + '/index.php?r=site/share&share=' + $scope.model.value + '&type=' + 2;
  $scope.doShare = function() {
    device.shareMsg($scope.model.name, $scope.model.address, $scope.model.img, shareUrl);
  };

  if (ENV.device === 'weixin') {
    $scope.isWeixin = true;

    function share() {
      setTimeout(function() {
        device.share($scope.model.name, shareUrl, $scope.model.img, $scope.model.address);
      }, 250);
    }
    share();

  }

  $scope.showMapItemView = function(city, address, lng, lat) {
    if (ENV.device === 'app') {
      device.showMap(city, address, lng, lat);
    }
  }
})

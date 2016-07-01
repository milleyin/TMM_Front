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
  });

}])

//吃，住，玩的详情页
.controller('MoreDetailCtrl', function($scope, $stateParams, $sce, $ionicPopover, $ionicPopup, data, Resource, appFunc, device, ENV) {
  $scope.info = data;
  $scope.contentHTML = $sce.trustAsHtml(data.content);

  // $scope.popoverStyle = {
  //   width: window.innerWidth-32 + 'px',
  //   height: window.innerHeight - 88 + 'px',
  //   left: '16px',
  //   top: '50px'
  // }
  // .fromTemplateUrl() 方法
  $ionicPopover.fromTemplateUrl('app/items/templates/item-intro.tpl.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    //$scope.btnClick = false;
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
    //appFunc.tmmCallPhone(callNum, "");
    
    appFunc.tmmWxCallPhone(callNum).then(function() {
      
    $scope.btnClick = false;
    })
    // });
    // confirmPopup.then(function (res) {
    //   if (res) {
        
    //   } else {
    //     $scope.btnClick = false;
    //   }
    // });
  }

   $scope.$on('modal.removed', function() {

   });

  $scope.linePraise = function() {

  }

  $scope.model = data;

  function share() {
    setTimeout(function(){
      device.share($scope.model.name, window.location.href, $scope.model.img, $scope.model.address);
    }, 500)
  }
  share();
})

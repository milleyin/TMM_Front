angular.module('fresh', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.fresh', {
      url: '/fresh',

      templateUrl: 'app/fresh/templates/fresh.html',
      controller: 'FreshCtrl',
      resolve: {
        data: function(ENV, device) {
          if (ENV.device === 'app') {
            device.goFresh();
          }
        }
      }

    })
    .state('tab.fresh-item', {
      url: '/fresh-item/:name/:link',
      templateUrl: 'app/fresh/templates/fresh-item.html',
      controller: 'FreshItemCtrl'
    });


}])

.controller('FreshCtrl', function($scope, ENV, device) {


  if (ENV.device === 'weixin') {
    $scope.isWeixin = true;
    if (ENV.android) {
      var time = Date.now();
      var jumpflag = true;
      var freshTime = device.GET('freshTime');

      if (freshTime !==null && (Date.now() - freshTime) < 24*60*60*1000) {
        jumpflag = false;
        time = freshTime;
      }
        
      device.SET('freshTime', time);

      if (jumpflag) {
        window.location.href = ENV.freshHomePage;
      }
    }
  } else {
    $scope.isWeixin = false;
  }
  $scope.link = ENV.freshHomePage;

})

.controller('FreshItemCtrl', function($scope, $stateParams, device, ENV) {

  if (ENV.device === 'weixin') {
    $scope.isWeixin = true;

  } else {
    $scope.isWeixin = false;
    device.goFresh();
  }

  $scope.link = $stateParams.link;
  $scope.name = $stateParams.name;
});

tmmApp.controller('MiXianCtrl',['$scope','$rootScope','$http',function($scope,$rootScope, $http) {
  var url = 'http://wap.koudaitong.com/v2/showcase/feature?alias=129wsjuci';
  // window.jsObj.jumpActivity(url);
  // angular.element('#mixian').css('height', document.documentElement.clientHeight -50)

  $rootScope.goMixian(url);


}]);
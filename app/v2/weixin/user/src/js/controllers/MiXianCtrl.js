tmmApp.controller('MiXianCtrl',['$scope','$rootScope','$http',function($scope,$rootScope, $http) {
  var url = 'http://wap.koudaitong.com/v2/showcase/feature?alias=129wsjuci';
  // window.jsObj.jumpActivity(url);
  angular.element('#mixian').css({'height': document.documentElement.clientHeight -50})

  // $rootScope.goMixian(url);


}]);
tmmApp.controller('MiXianItemCtrl',['$scope','$rootScope','$http',function($scope,$rootScope, $http) {
  var url = 'http://wap.koudaitong.com/v2/showcase/feature?alias=129wsjuci';
  // window.jsObj.jumpActivity(url);
  angular.element('#mixianitem').css({'height': document.documentElement.clientHeight -45}).attr('src',$rootScope.tuiJianMoreUrl);
  // angular.element('#mixianitem').attr('src',$rootScope.tuiJianMoreUrl);

}]);
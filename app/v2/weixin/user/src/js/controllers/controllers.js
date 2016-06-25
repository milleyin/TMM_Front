/* 戴曦 */

tmmApp.controller('appController',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

}]);

tmmApp.controller('OrderCrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

   /* $http({
        method : 'GET',
        url : '../data/tuijiandetail/tuijianLine' + $routeParams.id +'.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });*/
}]);






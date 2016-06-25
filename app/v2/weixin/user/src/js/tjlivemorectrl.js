/**点  查看更多的控制器**/
tmmApp.controller('PointLiveMoreCtrl',['$scope','$http','$routeParams',function($scope, $http,$routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/tuijianpointmore' + $routeParams.id +'.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);
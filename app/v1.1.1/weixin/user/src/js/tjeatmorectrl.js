/**点  查看更多的控制器**/
tmmApp.controller('PointEatMoreCtrl',['$scope','$http','$routeParams',function($scope, $http,$routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/tuijianpointmore' + $routeParams.id +'.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        console.log("点查看更多之美食出错");
    });
}]);
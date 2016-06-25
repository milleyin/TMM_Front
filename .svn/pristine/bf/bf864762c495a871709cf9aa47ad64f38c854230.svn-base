tmmApp.controller('SelectItemCtrl', ['$scope','$http',function($scope, $http) {
    $scope.json = [];

    $http({
        method : 'GET',
        url : '../data/selectItem.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;
    }).error(function(data){

    });
}]);
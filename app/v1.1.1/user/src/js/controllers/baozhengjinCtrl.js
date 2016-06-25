/**保证金*/
tmmApp.controller("BaoZhengJinCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
  $scope.json = {};
  $http({
    methord:"get",
    url:"../data/myfinance/totalincome"+ $routeParams.id +".json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
  }).error(function(data){
    console.log("保证金出错了");
  })
}]);
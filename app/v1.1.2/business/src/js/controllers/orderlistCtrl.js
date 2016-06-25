/**订单列表*/
tmmApp.controller("orderlistCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
  $scope.json = {};
  $scope.state = "";
  $http({
    methord:"get",
    url:"../data/myincome/orderlist" +$routeParams.id+".json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
    $scope.state = $routeParams.id;
    console.log($routeParams.id);
  }).error(function(data){
    console.log("订单列表出错了");
  })
}]);
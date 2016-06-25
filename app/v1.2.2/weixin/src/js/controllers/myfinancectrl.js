/**我的财务*/
tmmApp.controller("MyFinanceCtrl",["$scope","$http",function($scope,$http){
  $scope.json = {};
  $http({
    methord:"get",
    url:"../data/myfinance/myfinance.json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
  }).error(function(data){
    console.log("我的财务报错");
  })
}]);
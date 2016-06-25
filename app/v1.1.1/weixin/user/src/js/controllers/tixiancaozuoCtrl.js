/**提现操作*/
tmmApp.controller("TiXianCaoZuoCtrl",["$scope","$http",function($scope,$http){
  $scope.json = {};
  $http({
    methord:"get",
    url:"../data/myfinance/tixiancaozuo.json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
  }).error(function(data){
    console.log("提现操作出错了");
  })
}]);
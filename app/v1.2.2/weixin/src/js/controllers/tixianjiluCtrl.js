/**提现记录*/
tmmApp.controller("TixianjiluCtrl",["$scope","$http",function($scope,$http){
  $scope.json = {};
  $http({
    methord:"get",
    url:"../data/myfinance/tixianjilu.json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
  }).error(function(data){
    console.log("总收入额报错");
  })
}]);
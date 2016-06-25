/**我的收入明细*/
tmmApp.controller("myincomedetailCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
  $scope.json = {};
  $scope.state = "";
  $http({
    methord:"get",
    url:"../data/myincome/myincomedetail"+ $routeParams.id+".json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
    $scope.state = $routeParams.id;
  }).error(function(data){
    console.log("我的收入明细出错了");
  })
}]);
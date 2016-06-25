/**订单列表详情*/
tmmApp.controller("orderlistdetailCtrl",["$scope","$http",function($scope,$http){
  $scope.json = {};
  $http({
    methord:"get",
    url:"../data/myincome/orderlistdetail.json"
  }).success(function(data,state,headers,config){
    $scope.json = data;
  }).error(function(data){
    console.log("订单列表详情出错了");
  })
}]);
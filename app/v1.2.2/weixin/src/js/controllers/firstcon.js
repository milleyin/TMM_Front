//tmmApp.controller('TansuoCtrl', ['$scope','$http',function($scope, $http) {
//
//  $scope.data = {};
//  $scope.xinqing
//
//  $scope.show = function(target) {
//      $('.sub_bar_con').css('display', 'none');
//      $('.nav_tit').removeClass('active');
//      $(target).addClass('active');
//      $(target).next().show();
//
//      $http.get("../data/tansuo.json").success(function(data) {
//          $scope.data = data;
//      });
//  }
//
//}]);

tmmApp.controller('tuijiandindCtrl', ['$scope','$http',function($scope, $http) {
	
	$scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/dingdang.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
	
//  $scope.data = {};
//  $scope.xinqing
//  
//  $scope.student = {
// 	firstName: "yiibai",
// 	lastName: "com",
// 	fullName: function() {
//   	var studentObject;
//   	studentObject = $scope.student;
//   	return studentObject.firstName + " " + studentObject.lastName;
// 	}
//	};

}]);

tmmApp.controller('jiebanyouzhuCtrl',['$scope','$http',function($scope, $http) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jiebany.json'
    }).success(function(data,state,headers,config){
    	
//  	for (var i = 0; i < data.length; i++) {
//          if (data[i].butt == null) {
//              data[i].Style() = 'tip1';
//          } else if (data[i].type == '自助游') {
//              data[i].class = 'tip2';
//          }
//      }
    	
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou0Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou1Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou2Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou3Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou4Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou5Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('jiebanyou6Ctrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/jbyxq' + $routeParams.id +'.json',
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);

tmmApp.controller('quxiaoCtrl',['$scope','$http',function($scope, $http) {
    $scope.json = {};

    $http({
        method : 'GET',
        url : '../data/tuijiandetail/quxiao.json'
    }).success(function(data,state,headers,config){
        $scope.json = data;

    }).error(function(data){
        
    });
}]);





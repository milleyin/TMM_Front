/**点  查看更多的控制器**/
tmmApp.controller('PointEatMoreCtrl',['$scope','$http','$rootScope','$location','$sce',function($scope, $http,$rootScope,$location,$sce) {
    $scope.info = {};
    $scope.contentHTML = '';
    $scope.showMap = false;

     // 如果刷新页面返回推荐页面
    if (!$rootScope.tuiJianMoreUrl) {
        $location.path('tuijian');
        return;
    }

    $http.get($rootScope.tuiJianMoreUrl).success(function(data) {
        $scope.info = data.data;
        $scope.contentHTML = $sce.trustAsHtml(data.data.content);
        console.log("详情",$scope.info);
    });


    $scope.showAddress = function(address) {
        $scope.showMap = true;
        console.log($scope.showMap)
    }

}]);
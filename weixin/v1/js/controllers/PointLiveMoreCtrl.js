/**住  查看更多的控制器**/
tmmApp.controller('PointLiveMoreCtrl',['$scope','$http','$rootScope','$location','$sce','$routeParams',function($scope, $http,$rootScope,$location,$sce,$routeParams) {
    $scope.info = {};
    $scope.contentHTML = '';
    $scope.showMap = false;
    $scope.showContent = false;


     // 如果刷新页面返回推荐页面
    // if (!$rootScope.tuiJianMoreUrl) {
    //     $location.path('tuijian');
    //     return;
    // }

    if ($routeParams.type == 2) {
        var url = API + '/index.php?r=api/hotel/view&id=' + $routeParams.id;
    } 

    $http.get(url).success(function(data) {
        $scope.info = data.data;
        $scope.contentHTML = $sce.trustAsHtml(data.data.content)
        console.log('住---',data);
    });

    $scope.showAddress = function() {
        $scope.showMap = true;
    }

    $scope.showContentDetail = function() {
        $scope.showContent = true;
    }

    $scope.hideContentDetail = function() {
        $scope.showContent = false;
    }

}]);
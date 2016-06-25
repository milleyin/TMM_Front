/**点  查看更多的控制器**/
tmmApp.controller('PointEatMoreCtrl',['$scope','$http','$rootScope','$location','$sce','$routeParams',function($scope, $http,$rootScope,$location,$sce,$routeParams) {
    $scope.info = {};
    $scope.contentHTML = '';
    $scope.showMap = false;

     // 如果刷新页面返回推荐页面
    // if (!$rootScope.tuiJianMoreUrl) {
    //     $location.path('tuijian');
    //     return;
    // }

    // console.log($routeParams)

    if ($routeParams.type == 1) {
        var url = API + '/index.php?r=api/eat/view&id=' + $routeParams.id;
    } else if ($routeParams.type == 3) {
        var url = API + '/index.php?r=api/play/view&id=' + $routeParams.id;
    } else if ($routeParams.type == -1) {
        // $rootScope.tuiJianMoreUrl = link;
        $location.path('mixianitem');
        return;
    }

    $http.get(url).success(function(data) {
        console.log(url)
        $scope.info = data.data;
        $scope.contentHTML = $sce.trustAsHtml(data.data.content);
        
    });


    $scope.showAddress = function(address) {
        $scope.showMap = true;
        console.log($scope.showMap)
    }

}]);
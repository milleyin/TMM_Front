/*戴曦*/
tmmApp.controller('JieBanYouLineCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location) {

    $scope.line = {};

    // 如果刷新页面返回推荐页面
    if (!$rootScope.tuiJianLineUrl) {
        $location.path('tuijian');
    }

    // 获取页面数据
    $http.get($rootScope.tuiJianLineUrl).success(function(data) {

        if (data.status != 1) {
            $location.path('xuanzhexian');
            return;
        }
        $scope.line = data.data;
    });

    $scope.showMore = function(link,type) {

        if (type == 2) { // 2 表示住

            $rootScope.tuiJianMoreUrl = link;
            console.log(link);
            console.log($rootScope.tuiJianMoreUrl);
            $location.path('tuijianpointmore_1');

        } else { // 表示：吃 玩

            $rootScope.tuiJianMoreUrl = link;
            $location.path('tuijianpointmore_0');
        }
    }

}]);
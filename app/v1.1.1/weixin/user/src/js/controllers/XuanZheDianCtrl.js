
tmmApp.controller('XuanZheDianCtrl', ['$scope','$http','$location','$rootScope',function($scope, $http,$location,$rootScope) {
    $scope.info = {};
     $scope.title = '选择点';

    var url = API + '/index.php?r=api/shops/index' + '&select_dot_thrand=dot';

    /* 获取页面数据 */
    $http.get(url).success(function(data) {

        if (data.status == 0) {
            $location.path('my');
            return;
        }
        $scope.info = data.data;

    });

    $scope.goToDetail = function(link) {
        $rootScope.tuiJianLineUrl = link;
        $location.path('jiebanyoupoint');
    }
}]);



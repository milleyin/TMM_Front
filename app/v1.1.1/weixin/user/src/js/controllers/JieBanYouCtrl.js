/*戴曦*/
tmmApp.controller('JieBanYouCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location) {

    // $http.get(API + '/index.php?r=api/shops/index'+'&select_dot_thrand=all').success(function(data) {
    //     console.log(data);
    // });

    $scope.isShow = false;

    $scope.show = function() {
        // $scope.isShow = !$scope.isShow;
        $location.path('xuanzhexian');

    }

}]);
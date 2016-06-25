tmmApp.controller('TuijianPointListCtrl',['$scope','$rootScope','$http','$location',function($scope, $rootScope, $http, $location) {
    $scope.info = [];
    $scope.list_data = [];

    $http.get(API + '/index.php?r=api/shops/index&select_dot_thrand=dot').success(function(data) {
        $scope.info = data.data;
        $scope.list_data = data.data.list_data;
        if($scope.list_data.length == 0){
        	$(".load6").css('display','none');
        }else if($scope.info.page.next == ""){
        	$(".load6").css('display','none');
        }
    });

    $scope.showMore = function() {
        
        if ($scope.info.page.next) { // 分页取数据

            $http.get($scope.info.page.next).success(function(data) {
                if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
                    $scope.info = data.data;
                    $scope.list_data = $scope.list_data.concat(data.data.list_data); 
                }
            });
        }else{
        	$(".load6").css('display','none');
        }
    }

    $scope.goDetailPage = function(type, link) {
        $rootScope.tuiJianDetailReturn = 0;
        if (type == 1) { // 点的详情页面
            $rootScope.tuiJianPointUrl = link;
            $location.path('tuijiandetail_0');
        } else if(type == 2){ // 到线的详情页面
            $rootScope.tuiJianLineUrl = link;
            $location.path('tuijiandetail_1');
        }
    }

}]);
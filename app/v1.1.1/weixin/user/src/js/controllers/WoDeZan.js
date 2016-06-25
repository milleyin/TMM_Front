tmmApp.controller('WoDeZan', ['$scope','$http','$location','$rootScope',function($scope, $http, $location, $rootScope) {
    $scope.info = [];
    $scope.list_data = [];
    $scope.listNum = 0;
    var url = API + '/index.php?r=api/shops/praise'

    /* 获取数据 */
    $http.get(url).success(function(data) {
    	console.log(data);
        $scope.info = data.data;
        $scope.list_data = data.data.list_data;
        $scope.listNum = data.data.list_data.length;
        /*没有数据时隐藏*/
        if($scope.list_data.length == 0){
        	$(".load6").css('display','none');
        }else if($scope.info.page.next == ""){//没有分页值时隐藏
            $(".load6").css('display', 'none');
        }
    })

    $scope.showMore = function() {
        
        if ($scope.info.page.next) { // 分页取数据

            $http.get($scope.info.page.next).success(function(data) {
                if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
                    $scope.info = data.data;
                    $scope.list_data = $scope.list_data.concat(data.data.list_data);
                }
            });
        }else{
        	$(".load6").css('display', 'none');
        }
    }

    $scope.goDetailPage = function(type, link, value) {
        $rootScope.tuiJianDetailReturn = 0;
        if (type == 1) { // 点的详情页面
            $rootScope.tuiJianPointUrl = link;
            $location.path('tuijiandetail_0/' + value);
        } else if(type == 2){ // 到线的详情页面
            $rootScope.tuiJianLineUrl = link;
            $location.path('tuijiandetail_1/' + value);
        }
    }

}]);
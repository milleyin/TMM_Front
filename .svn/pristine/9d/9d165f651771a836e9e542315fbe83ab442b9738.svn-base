tmmApp.controller('MyCtrl',['$scope','$http','$location','$rootScope','bottomBarService',function($scope,$http,$location,$rootScope, bottomBarService) {
    // $scope.isLogin = false;
    
    $scope.is_organizer = false;

    $http.get(API + '/index.php?r=api/user/view').success(function(data) {

        if (data.status == 0) {
            $rootScope.isLogin = false;
        } else {
            $rootScope.user = data.data;
            $scope.is_organizer = data.data.userInfo.is_organizer == 0 ? false : true;
            $rootScope.isLogin = true;
        }

    });

    // $scope.user = JSON.parse(localStorage.user);

    $scope.toLogin = function() {
        $location.path('login');
    }

    // 退出登录
    // $http.get(API + '/index.php?r=api/login/out').success(function(data) {

    // });

    // 显示滑动栏目
    $scope.showBar = function() {
        var tpl = '<div class="tuichu"><div class="tuichudenglu">退出登录</div><div class="quxiao">取消</div></div>'
        console.log(tpl);
        bottomBarService.showBar(document.getElementById('my'), tpl);

        $('.quxiao').bind('click', function() {
            bottomBarService.removeBar();
        });

        $('.tuichudenglu').bind('click', function() {
            $http.get(API + '/index.php?r=api/login/out').success(function(data) {
                if (data.status == 1) {
                    $location.path('login');  
                } else {
                    bottomBarService.removeBar();
                }
            });
        });
    }

    $scope.goPage = function(link) {

        if ($rootScope.isLogin) {
            $location.path(link);
        } else {
            $location.path('login');
        }

    }

}]);
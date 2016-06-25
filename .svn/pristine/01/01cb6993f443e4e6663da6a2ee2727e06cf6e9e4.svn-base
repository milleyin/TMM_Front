tmmApp.controller('myCtrl', ['$scope', '$http', '$location', 'bottomBarService',function($scope, $http, $location, bottomBarService) {
    // $scope.isLogin = false;
    
    $scope.is_organizer = false;
    $scope.json = {};
    $http.get(API + '/index.php?r=store/store_home/index').success(function(data) {
        $scope.name = data.data.name;
        $scope.phone = data.data.phone;
        $scope.json = data.data;
        console.log("我的",data.data);
    
    });

    /*$scope.toLogin = function() {
        $location.path('login');
    }*/
    $scope.toInfo = function() {
        $location.path('myziliao');
    }

    // 显示滑动栏目
    $scope.showBar = function() {
        var tpl = '<div class="tuichu"><div class="tuichudenglu">退出登录</div><div class="quxiao">取消</div></div>'
        bottomBarService.showBar(document.getElementById('my'), tpl);

        $('.quxiao').bind('click', function() {
            bottomBarService.removeBar();
        });

        $('.tuichudenglu').bind('click', function() {
            $http.get(API + '/index.php?r=store/store_login/out').success(function(data) {
                if (data.status == 1) {
                    $location.path('login');  
                } else {
                    bottomBarService.removeBar();
                }
            });
        });
    }

}]);
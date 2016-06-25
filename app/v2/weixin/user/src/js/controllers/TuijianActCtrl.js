tmmApp.controller('TuijianActCtrl',['$scope','$rootScope','$http','$location','$routeParams',function($scope, $rootScope, $http,$location,$routeParams) {

    $scope.act = {};
    $scope.dianZhan = {
        shops_id : '',
        user_address : '',
        key : '',
        dianZhanValue : ''
    };


    // 测试api
    // $rootScope.tuiJianLineUrl = 'http://172.16.1.219/tm/index.php?r=api/thrand/view&id=34';

    // 如果刷新页面返回推荐页面
    // if (!$rootScope.tuiJianLineUrl) {
    //     $location.path('tuijian');
    // }

    var url = API +"/index.php?r=api/actives/view&id=" + $routeParams.id;

    // 获取活动信息
    $http.get(url).success(function(data) {

        console.log(data);
        if (data.status != 1) {
            $location.path('tuijian');
            return;
        }
        if(data.data.collent_status == 1){
            $scope.dianZhan.dianZhanValue = 1;
        }
        $scope.act = data.data;

        $scope.dianZhan.shops_id = data.data.actives_id;
       // console.log($scope.act);
            
    });

   $scope.showMore = function(link,type,id) {
        if (type == 2) { // 2 表示住

            $rootScope.tuiJianMoreUrl = link;
            $location.path('item/'+type+'/'+id+'/'+type);
        } else if (type == -1){
            // 表示觅鲜
            // $rootScope.goMixian2(link);
            $rootScope.tuiJianMoreUrl = link;
            $location.path('mixianitem');

        } else { // 表示：吃 玩
            $rootScope.tuiJianMoreUrl = link;
            $location.path('item/'+type+'/'+id+'/'+type);
        }
    }

    //点赞
    $http.get(API + '/index.php?r=api/shops/collect'+'&csrf=csrf').success(function(data) {
        $scope.dianZhan.key = data.data.csrf.TMM_CSRF;
       
    });

    $scope.dianZhanOrNot = function(){
        var dianZhanToken = {
            "Collect": {
                "shops_id": $scope.dianZhan.shops_id,
                "user_address": ""
            },
            "TMM_CSRF": $scope.dianZhan.key
        }

        $http.post(
            API + '/index.php?r=api/shops/collect',
            dianZhanToken,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data) {
            console.log('dianZhan',data);
            if (data.status == 1) {
                
                if(data.data.value == 1){
                    $scope.dianZhan.dianZhanValue = 1;   
                } else {
                    $scope.dianZhan.dianZhanValue = 0;
                }

            } else {
                $rootScope.tuiJianDetailLoginUrl = 1;
                $location.path('/acc_login');
            }

        }).error(function(data) {
            
        });
    }

    // 线的去订单页面
    $scope.goOrder = function(id) {

        $http.get(API + '/index.php?r=api/user/view').success(function(data) {

            // 判断有没有登录
            if (data.status == 0) {
                $rootScope.isLogin = false;
                $location.path('login');
            } else { // 跳到订单页面
                $rootScope.user = data.data;
                // console.log('user--',$rootScope.user);
                $rootScope.isLogin = true;
                // console.log('user--', $rootScope.user)
                $location.path('order_1/' + id);
            }

        });
    }

}]);
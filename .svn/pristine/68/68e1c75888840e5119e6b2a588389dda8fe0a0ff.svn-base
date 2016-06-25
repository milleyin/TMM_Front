tmmApp.controller('TuijianPointCtrl',['$scope','$rootScope','$http','$location','$routeParams','bottomBarService',function($scope, $rootScope, $http,$location,$routeParams, bottomBarService) {

    $scope.point = {};
    $scope.isSale = '';
    $scope.dot_praise = 0;
    $scope.bookInfoId = $routeParams.id;
    $scope.dianZhan = {
        shops_id : '',
        user_address : '',
        key : '',
        dianZhanValue : '',
        start_date_format: '',
        end_date_format: ''

    };
    $scope.modal = {
        title : '',
        isShow: false
    }

    // 如果刷新页面返回推荐页面
    // if (!$rootScope.tuiJianPointUrl) {
    //     $location.path('tuijian');
    // }

    var url = API +"/index.php?r=api/dot/view&id=" + $routeParams.id;

    // 获取点的信息
    $http.get(url).success(function(data) {
        if (data.status != 1) {
            $location.path('tuijian');
            return;
        }
        if(data.data.collent_status == 1){
            $scope.dianZhan.dianZhanValue = 1;
        }
        $scope.dianZhan.shops_id = data.data.dot_id;
        $scope.point = data.data;
        console.log(data.data);
        $scope.isSale = data.data.is_sale.value;
        $scope.dot_praise = data.data.praise;

    });

    $scope.showMore = function(link,type,id) {
        // return;
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
            
            if (data.status == 1) {
                
                if(data.data.value == 1){
                    $scope.dianZhan.dianZhanValue = 1; 
                    $scope.dot_praise = parseInt($scope.dot_praise) + 1;     
                } else {
                    $scope.dianZhan.dianZhanValue = 0;
                    $scope.dot_praise = parseInt($scope.dot_praise) - 1;
                }

            } else {
                $rootScope.tuiJianDetailLoginUrl = 2;
                $location.path('/login');
            }

        }).error(function(data) {
            
        });
    }

    // 去订单页面
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
                $location.path('order_0/' + id);
            }

        });
    }

    //拨打电话
    $scope.tmmCallSure = function(phone) {
        $scope.modal.title = '请拨打电话：'+ phone;
        $(".tmm-modal-mask").css('display','block');
        var tmmCallContent = '<div class="tmm-call">请拨打电话：'+ phone +'</div>';
        $(".tmm-tit").append(tmmCallContent);
    }

    $scope.goCall = function(){
        var tplCall = '<div class="tmmCall"><div class="tmmAPP-Call" id="managePhone">联系运营商</div><div class="tmmAPP-Call" id="tmmAppCall">联系田觅觅客服</div><div class="tmmCall-cancel">取消</div></div>';
        bottomBarService.showBar(document.getElementById('pagetwo'), tplCall);

        $('#managePhone').bind('click', function() {
            $scope.tmmCallSure($scope.point.manage_phone);
            bottomBarService.removeBar();     
        });

        $('#tmmAppCall').bind('click', function() {
            $scope.tmmCallSure($scope.point.tmm_phone);
            bottomBarService.removeBar();
        });

        $('.tmmCall-cancel').bind('click', function() {
            bottomBarService.removeBar();
        });
    }

    // 弹出层确认
    $scope.modalOK = function() {
        $(".tmm-call").remove();
        $(".tmm-modal-mask").css('display','none');
        
    }

}]);

tmmApp.controller('dotExterior',['$scope','$rootScope','$http','$location','$routeParams',function($scope, $rootScope, $http,$location,$routeParams) {
    var url = API +"/index.php?r=api/dot/view&id=" + $routeParams.id;
    $http.get(url).success(function(data) {
        $scope.dotExteriorInfo = data.data;
        console.log($scope.dotExteriorInfo);   
    });

    $scope.exteriorShowMore = function(link,type,id) {
        // return;
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
}]);
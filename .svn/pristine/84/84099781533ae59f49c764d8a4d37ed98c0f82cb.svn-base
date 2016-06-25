tmmApp.controller('TuijianActCtrl',['$scope','$rootScope','$http','$location','$routeParams','bottomBarService',function($scope, $rootScope, $http,$location,$routeParams, bottomBarService) {

    $scope.act = {};
    $scope.act_praise = 0;
    $scope.dianZhan = {
        shops_id : '',
        user_address : '',
        key : '',
        dianZhanValue : ''
    };
    var showExpandValue = 0;
    $scope.modal = {
        title : '',
        isShow: false
    }


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
        $scope.act_praise = data.data.praise;
        $scope.dianZhan.shops_id = data.data.actives_id;
       // console.log($scope.act);
        
    
        var actRemark = '<p class="txt tmm-activity-txt-height">'+data.data.actives_info.remark+'</p>';   
        $(".tmm-item-content-height").append(actRemark);
    
        if ($(".tmm-activity-txt-height").height() < 44) {
            $(".tmm-item-toggle").css("display", "none");
        } else {
            $(".tmm-item-content-height").addClass('tmm-item-dispense');
        }
    });
    
    /*if ($(".tmm-activity-txt-height").height() < 10) {
        $(".tmm-item-toggle").css("display", "none");
    } else {
        $(".tmm-item-content-height").addClass('tmm-item-dispense');
    }*/

    $scope.showExpand = function() {
        if (showExpandValue == 1) {
          showExpandValue = 0;
          $(".tmm-item-content-height").addClass('tmm-item-dispense');
          $(".tmm-item-content-height").addClass('tmm-accordion-item-content');
          $(".tmm-item-toggle").removeClass('tmm-retract');
        } else if (showExpandValue == 0) { //展开
          showExpandValue = 1;
          $(".tmm-item-content-height").removeClass('tmm-item-dispense');
          $(".tmm-item-content-height").removeClass('tmm-accordion-item-content');
          $(".tmm-item-toggle").addClass('tmm-retract');
        }
    },
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
            console.log('dianZhan',$scope.act_praise);
            if (data.status == 1) {
                
                if(data.data.value == 1){
                    $scope.dianZhan.dianZhanValue = 1;
                    $scope.act_praise = parseInt($scope.act_praise) + 1 ;    
                } else {
                    $scope.dianZhan.dianZhanValue = 0;
                    $scope.act_praise = parseInt($scope.act_praise) - 1;
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
            $scope.tmmCallSure($scope.act.manage_phone);
            bottomBarService.removeBar();     
        });

        $('#tmmAppCall').bind('click', function() {
            $scope.tmmCallSure($scope.act.tmm_phone);
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
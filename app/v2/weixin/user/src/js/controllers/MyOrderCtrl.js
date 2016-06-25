tmmApp.controller('MyOrderCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope, $http, $location) {
     
    $scope.infoList = [];
    $scope.data = {};
    $scope.type = 1 // 觅镜 1，觅趣 2


    $scope.modal = {
        title : '',
        isShow: false,
        type: '',
        id : 0
    }

    $scope.changeType = function(type){
        if ($scope.type == type) return;
        $scope.type = type;
        $scope.getTypeInfo($scope.type);
    }

    $scope.getTypeInfo = function() {
        var url = '';
        $scope.infoList.length = 0;
        if ($scope.type == 1) {
            url = API + '/index.php?r=api/order/index&type=order_dot_thrand';
        } else if ($scope.type == 2) {
            url = API + '/index.php?r=api/order/index&type=order_tour';
        }

        $http.get(url).success(function(data) {
            $scope.data = data.data;
            $scope.infoList = $scope.infoList.concat($scope.data.list_data);
        });      
    }

    $scope.getTypeInfo($scope.type);

    // 分页
    $scope.getPageInfo = function() {
        console.log('data->',$scope.data.page.next)
        if ($scope.data.page.next) {
            $http.get($scope.data.page.next).success(function(data) {
                if ($scope.data.page.selectedPage < data.data.page.selectedPage) {
                    $scope.data = data.data;
                    $scope.infoList = $scope.infoList.concat($scope.data.list_data);
                    
                }
            });
        }else{
        	$(".load6").css('display', 'none');
        }
    }

    // 取消订单
    // $scope.removeOrder = function(id) {
    //     if(confirm('确认取消订单吗？')) {
    //         $http.get(API + '/index.php?r=api/order/cancel&id=' + id).success(function(data) {
    //             if (data.status == 1) {

    //                 $scope.getTypeInfo($scope.type);
    //             }
    //         });
            
    //     }
    // }

    // 去订单详情页面
    $scope.goOrderDetail = function(id, status) {
        $location.path('orderDetail2/'+id);
    }

    // 支付
    $scope.payOrder = function(id) {
        $scope.modal.title = '拨打电话：400-019-7090申请退款';
        $scope.modal.isShow = true;
        $scope.modal.type = 'payOrder';
        $scope.modal.id = id;
    }

    // 取消报名
    $scope.removeOrder = function(id) {
        $scope.modal.title = '是否取消订单？';
        $scope.modal.isShow = true;
        $scope.modal.type = 'removeOrder';
        $scope.modal.id = id;
    }

    // 申请退款
    $scope.refundOrder = function(id) {
        $scope.modal.title = '请拨打电话：400-019-7090申请退款';
        $scope.modal.isShow = true;
        $scope.modal.type = 'refundOrder';
        $scope.modal.id = id;
    }

    // 弹出层确认
    $scope.modalOK = function(type) {
        if (type == 'payOrder') {

        } else if (type == 'removeOrder') {
            $http.get(API + '/index.php?r=api/order/cancel&id=' + $scope.modal.id).success(function(data) {
                if (data.status == 1) {
                    $scope.getTypeInfo();
                }
            });
        } else if (type == 'refundOrder') {

        }
        $scope.modal.isShow = false;
    }

    // 弹出层取消
    $scope.modalCancel = function() {
        $scope.modal.isShow = false;
    }

}]);
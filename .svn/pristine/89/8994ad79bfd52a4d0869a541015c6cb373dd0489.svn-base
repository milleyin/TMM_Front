tmmApp.controller('MyJoinActCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope, $http, $location) {
     
    $scope.infoList = [];
    $scope.data = {};

    $scope.modal = {
        title : '',
        isShow: false,
        type: '',
        id : 0
    }

    var url = API + '/index.php?r=api/order/index&type=actives_tour';

    // 获取数据
    $scope.getInfo = function() {
        $http.get(url).success(function(data) {
            console.log(data)
            $scope.infoList = [];
            $scope.data = data.data;
            $scope.infoList = $scope.infoList.concat($scope.data.list_data);
        });
    }

    $scope.getInfo();

    // 分页
    $scope.getPageInfo = function() {
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
        $scope.modal.title = '是否取消报名？';
        $scope.modal.isShow = true;
        $scope.modal.type = 'removeOrder';
        $scope.modal.id = id;
    }

    // 确认出游
    $scope.confirmOrder = function(id) {
        $scope.modal.title = '确认出游吗？';
        $scope.modal.isShow = true;
        $scope.modal.type = 'confirmOrder';
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

        } else if (type == 'confirmOrder') {
            $http.get(API + '/index.php?r=api/order/confirm&id=' + $scope.modal.id).success(function(data) {
                if (data.status == 1) {
                    $scope.getInfo();
                }
            });
        } else if (type == 'removeOrder') {
            $http.get(API + '/index.php?r=api/order/cancel&id=' + $scope.modal.id).success(function(data) {
                if (data.status == 1) {
                    $scope.getInfo();
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
tmmApp.controller('OrderDetail2Ctrl',['$scope','$http','$location','$routeParams','$rootScope','$interval',function($scope,$http,$location,$routeParams,$rootScope,$interval) {

    $scope.orderinfo = {};
    $scope.isShowCode = false;
    $scope.csrf = '';
    $scope.msg = '等待确认';
    $scope.payFlag = false;

    $scope.dayNumer = ['第一天上午','第一天下午','第二天上午','第二天下午','第三天上午','第三天下午','第四天上午','第四天下午','第五天上午','第五天下午','第六天上午','第六天下午','第七天上午','第七天下午','第八天上午','第八天下午','第九天上午','第九天下午','第十天上午','第十天下午']


    // 获取订单信息
    $scope.getOrderInfo = function() {
        $http.get(API + '/index.php?r=api/order/view&id=' + $routeParams.id).success(function(data) {
            console.log(data);
            $scope.orderinfo = data.data;
            if ($scope.orderinfo.status.order_status.value == 1) {
                $interval.cancel(timer);
                $scope.msg = '确认';
                $scope.payFlag = true;
            }
        });
    }

    $scope.getOrderInfo();

    // 显示二维码
    $scope.showCode = function(link) {
        $http.get(link).success(function(data) {
            console.log(data);
            var $code = $('<div id="code"></div>');
            $('#myorderdetail').append($code);
            $scope.isShowCode = true;
            var qrcode = new QRCode($code.get(0), {
                width : 200,//设置宽高
                height : 200,
            });
        
            qrcode.makeCode(data.data.barcode.value);
            
        });
    }

    // 删除二维码
    $scope.deleteCode = function() {
        $scope.isShowCode = false;
        $('#code').remove();
    }
    
}]);
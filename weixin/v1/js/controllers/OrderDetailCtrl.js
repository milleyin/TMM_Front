tmmApp.controller('OrderDetailCtrl',['$scope','$http','$location','$routeParams','$rootScope','$interval',function($scope,$http,$location,$routeParams,$rootScope,$interval) {

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
            console.log($scope.orderinfo.status.order_type.value);
            if ($scope.orderinfo.status.order_status.value == 1) {
                $interval.cancel(timer);
                $scope.msg = '确认支付';
                $scope.payFlag = true;
            }
        });
    }

    $scope.getOrderInfo();

    var timer = $interval(function() {
        $scope.getOrderInfo();    
        if ($scope.orderinfo.status.order_status.value == 1) {
            $interval.cancel(timer);
            $scope.msg = '确认支付';
            $scope.payFlag = true;
        }
    }, 5000);

    // 显示二维码
    $scope.showCode = function(link) {
  
        $http.get(link).success(function(data) {
            var $code = $('<div id="code"></div>');
            $('#myorderdetail').append($code);
            $scope.isShowCode = true;
            var qrcode = new QRCode($code.get(0), {
                width : 200,//设置宽高
                height : 200,
            });
            
            // qrcode.makeCode(data.data.barcode.value);

            qrcode.makeCode('1111');
        });
    }


    // 删除二维码
    $scope.deleteCode = function() {
        $scope.isShowCode = false;
        $('#code').remove();
    }

    $scope.submit = function() {

        if ($scope.orderinfo.status.order_status.value == 1) {

            var url = API + '/index.php?r=api/order/payment';
            $http.get(url +'&csrf=csrf').success(function(data){
                $scope.csrf = data.data.csrf.TMM_CSRF;
                
                var token = {
                    "id" : $routeParams.id,
                    "pay_type" : "1",
                    "TMM_CSRF" : $scope.csrf
                }

                $http.post(
                    url,
                    token,
                    {
                        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).success(function(data) {
                    console.log(data.data.alipay);
                    
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'PayCode': data.data.alipay
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        var str = payMoneycallJava(data.data.alipay);
                    }

                    // if (str==1) {
                    //     alert('支付成功');
                    //     $location.path('myorder');
                    // } else {
                    //     alert('支付失败');
                    // }
                    $location.path('myorder');

                });
            });
        }
    }

    $scope.clearItem = function() {
        $interval.cancel(timer);
    }

}]);
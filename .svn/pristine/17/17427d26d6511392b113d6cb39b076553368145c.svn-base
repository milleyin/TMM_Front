tmmApp.controller('MyOrderCtrl',['$scope','$rootScope','$http','$location',function($scope,$rootScope, $http, $location) {
     
    $scope.infoList = [];
    $scope.data = [];

    var url = API + '/index.php?r=api/order/index';


    $http.get(url).success(function(data) {
        $scope.data = data.data;
        $scope.infoList = $scope.infoList.concat($scope.data.list_data);
        console.log($scope.data);
    });

    $scope.getInfo = function() {
        console.log('data->',$scope.data.page.next)
        if ($scope.data.page.next) {
            $http.get($scope.data.page.next).success(function(data) {
                $scope.data = data.data;
                $scope.infoList = $scope.infoList.concat($scope.data.list_data);

            });
        }else{
        	$(".load6").css('display', 'none');
        }
    }

    // 取消订单
    $scope.removeOrder = function(id) {
        if(confirm('确认取消订单吗？')) {
            $http.get(API + '/index.php?r=api/order/cancel&id=' + id).success(function(data) {
                if (data.status == 1) {

                    $http.get(url).success(function(data) {

                        $scope.infoList = data.data.list_data;
                    

                    });
                }
            });
            
        }
    }

    // 分页
    $scope.getPageInfo = function() {
        $scope.num++
        $scope.getInfo($scope.num);
    }

    // 去订单详情
    $scope.payOrder = function(id) {
        $location.path('orderDetail/'+id)
    }

    // 去订单详情
    $scope.goOrderDetail = function(id,type) {
        if (type == 0 || type == 1) {
            $location.path('orderDetail/'+id)
            
        } else {
            
            $location.path('orderDetail2/'+id)
        }
    }


    // 申请退款
    $scope.tuikuanOrder = function(id) {
        console.log('11');
        //alert("请拨打电话：\n400-019-7090\n申请退款");
        if ($rootScope.mobileType == 0) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                  'Tips': '请拨打电话：\n400-019-7090\n申请退款'
                }, function(response) {})
            });
        } else if ($rootScope.mobileType == 1) {
            window.jsObj.prompt("请拨打电话：\n400-019-7090\n申请退款");
        }   
    }

    // 刷新
    $scope.shuaxing = function() {
        $scope.infoList = [];
        $scope.data = [];
        $http.get(url).success(function(data) {
            $scope.data = data.data;
            $scope.infoList = $scope.infoList.concat($scope.data.list_data);
        });
    }

}]);
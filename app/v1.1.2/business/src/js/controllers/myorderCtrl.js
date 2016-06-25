/**我的订单*/
tmmApp.controller("myorderCtrl",["$scope","$http","$location",'$rootScope',function($scope,$http,$location,$rootScope){
    var url = API + '/index.php?r=store/store_items/index';

    $http.get(url).success(function(data) {
    	$scope.zz_info = data.data;
        if (data.data.login === false) {
            $location.path('login');
        }else{
        	if($scope.zz_info.page.next == ""){//没有分页值时隐藏
            	$(".load6").css('display', 'none');
        	} 
        }
    });

    $scope.isMiJing = true;
    $scope.showMj = 1;
    var url = API + '/index.php?r=store/store_order/index&type=order_dot_thrand';

    $scope.zzListShow = function(){  //觅境
        if ($scope.isMiJing) return;
        $('#jbList').removeClass('active');
        $('#zzList').addClass('active');
        $scope.isMiJing = true;
        $scope.showMj = 1;
        url = API + '/index.php?r=store/store_order/index&type=order_dot_thrand';
        $scope.zzOnloadShow();
    }
    $scope.jbListShow = function(){  //觅趣
        if (!$scope.isMiJing) return;
        $('#zzList').removeClass('active');
        $('#jbList').addClass('active');
        $scope.isMiJing = false;
        $scope.showMj = 0;
        url = API + '/index.php?r=store/store_order/index&type=actives_tour';
        $scope.mqOnloadShow();

    }


    /*自助游*/

    $scope.zz_info = [];
    $scope.zz_list_data = [];

    $scope.zzOnloadShow = function(){
        $http.get(url).success(function(data) { //自助游
            $scope.zz_info = data.data;
            $scope.zz_list_data = data.data.list_data;
            if($scope.zz_list_data != null){
                for (var i = 0; i < data.data.list_data.length; i++) {
                    if(data.data.list_data[i].status.order_status.value == 0){
                        data.data.list_data[i].status.order_status.class = "blue";
                    } else if(data.data.list_data[i].status.order_status.value == 1){
                        data.data.list_data[i].status.order_status.class = "red";
                    } else if(data.data.list_data[i].status.order_status.value == 2){
                        data.data.list_data[i].status.order_status.class = "purple";
                    } else if(data.data.list_data[i].status.order_status.value == 3){
                        data.data.list_data[i].status.order_status.class = "green";
                    } else if(data.data.list_data[i].status.order_status.value == "-3"){
                        data.data.list_data[i].status.order_status.class = "gray";
                    } else if(data.data.list_data[i].status.order_status.value == "-2"){
                        data.data.list_data[i].status.order_status.class = "yellow";
                    } else if(data.data.list_data[i].status.order_status.value == "-1"){
                        data.data.list_data[i].status.order_status.class = "orange";
                    }
                };
            } else {//没有数据时
            	$(".load6").css('display','none');
            }
            //console.log("自助游", data);
        }).error(function(data){
            console.log("加载我的自助游订单出错了");
        })
    }

    $scope.jb_info = [];
    $scope.jb_list_data = [];
    $scope.jbIsMiJing = false;
    /* 觅趣 */
    $scope.mqOnloadShow = function() {
        $http.get(url).success(function(data) {
            $scope.jb_info = data.data;
            $scope.jb_list_data = data.data.list_data;
            if ($scope.jb_list_data.length !== 0) {
                for (var i = 0; i < $scope.jb_list_data.length; i++) {
                    if ($scope.jb_list_data[i].actives_status.value == 0) {
                        $scope.jb_list_data[i].actives_status.class = "green";
                    } else if ($scope.jb_list_data[i].actives_status.value == 1) {
                        $scope.jb_list_data[i].actives_status.class = "red";
                    } else if ($scope.jb_list_data[i].actives_status.value == 2) {
                        $scope.jb_list_data[i].actives_status.class = "gray";
                    }
                }
            }

            if(data.data.page.next){
                $scope.jbIsMiJing = true;
            }

            $(".load6").css('display','none');
            
        }).error(function(data){
            $(".load6").css('display','none');
        });

        
    }

    //显示更多
    $scope.showZzMore = function() {
        if ($scope.isMiJing) { // 觅镜分页
            if ($scope.zz_info.page.next) { // 自助游分页取数据
       
                $http.get($scope.zz_info.page.next).success(function(data) {
                    if ($scope.zz_info.page.selectedPage < data.data.page.selectedPage) {
                        $scope.zz_info = data.data;
                        $scope.zz_list_data =  $scope.zz_list_data.concat(data.data.list_data);
                    }
                    if($scope.zz_list_data != null){ 
                         for (var i = 0; i < data.data.list_data.length; i++) {
                            if(data.data.list_data[i].status.order_status.value == 0){
                                data.data.list_data[i].status.order_status.class = "blue";
                            } else if(data.data.list_data[i].status.order_status.value == 1){
                                data.data.list_data[i].status.order_status.class = "red";
                            } else if(data.data.list_data[i].status.order_status.value == 2){
                                data.data.list_data[i].status.order_status.class = "purple";
                            } else if(data.data.list_data[i].status.order_status.value == 3){
                                data.data.list_data[i].status.order_status.class = "green";
                            } else if(data.data.list_data[i].status.order_status.value == "-3"){
                                data.data.list_data[i].status.order_status.class = "gray";
                            } else if(data.data.list_data[i].status.order_status.value == "-2"){
                                data.data.list_data[i].status.order_status.class = "yellow";
                            } else if(data.data.list_data[i].status.order_status.value == "-1"){
                                data.data.list_data[i].status.order_status.class = "orange";
                            }
                        };
                    }
                });
            } 
            else {//加载完成
            	$(".load6").css('display', 'none');
            }
            
        } else if ($scope.jbIsMiJing){ // 觅趣分页

            if ($scope.jb_info.page.next) {  
                $http.get($scope.jb_info.page.next).success(function(data) {
                    if ($scope.jb_info.page.selectedPage < data.data.page.selectedPage) {
                        $scope.jb_info = data.data;
                        $scope.jb_list_data =  $scope.jb_list_data.concat(data.data.list_data);
                    }
                    if($scope.jb_list_data != null){ 
                        for (var i = 0; i < $scope.jb_list_data.length; i++) {
                            if ($scope.jb_list_data[i].actives_status.value == 0) {
                                $scope.jb_list_data[i].actives_status.class = "green";
                            } else if ($scope.jb_list_data[i].actives_status.value == 1) {
                                $scope.jb_list_data[i].actives_status.class = "red";
                            } else if ($scope.jb_list_data[i].actives_status.value == 2) {
                                $scope.jb_list_data[i].actives_status.class = "gray";
                            }
                        }
                    }
                });
            } 
            else {//加载完成
                $(".load6").css('display', 'none');
            }
        }

    }

    $scope.zzOnloadShow();
    //自助游接受订单
    $scope.zzAcceptOrder = function(shopId){
        $http.get(API + '/index.php?r=store/store_order/receive&id=' + shopId).success(function(data) {
            if(data.status == 1){
                $scope.zzOnloadShow();
            } else { // 接受成功    
                if ($rootScope.mobileType == 0) { //ios
                     connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': data.msg
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt(data.msg);
                } 
            }
            //console.log(data);
        });
    }
    
    //自助游拒绝订单
    $scope.zzRefuseOrder = function(shopId){
        if(confirm('确认拒绝订单吗？')) {
            $http.get(API + '/index.php?r=store/store_order/refuse&id=' + shopId).success(function(data) {
                
                if(data.status == 1){
                    $scope.zzOnloadShow();
                    
                } else { //拒绝成功
                    //alert(data.msg);
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': data.msg
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt(data.msg);
                    }    
                }
                //console.log(data);
            });
        }
    }

    // 去活动详情列表页面
    $scope.goToTourOrder = function(id,link) {
        // $http.get(link).success(function(data) {
        //     console.log(data)
        // })

        $rootScope.orderTourLink = link;
        $location.path('myjbyorderdetail');
    }

}]);

/**我的订单详情  自助游*/
tmmApp.controller('zizhu1detailCtrl',['$scope','$http',"$routeParams",'$rootScope',function($scope, $http,$routeParams,$rootScope) {
    $scope.json = {};
    $scope.mainnPerson = {};
    $scope.otherPerson = {};
    $scope.flag = false;
    $scope.statusflag = true;
    $scope.payflag = true;

    $scope.dayNumer = ['第一天上午','第一天下午','第二天上午','第二天下午','第三天上午','第三天下午','第四天上午','第四天下午','第五天上午','第五天下午','第六天上午','第六天下午','第七天上午','第七天下午','第八天上午','第八天下午','第九天上午','第九天下午','第十天上午','第十天下午']

    var persons = new Array(),
        i=0 ,
        otherPerson = new Array();
    $scope.zzyOrder = function() {
        $http.get(API + '/index.php?r=store/store_order/view&id='+ $routeParams.id).success(function(data) {
            if(data.status==0){
                 if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': data.msg
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt(data.msg);
                }
                 console.log(data);
            }else{
                console.log(data);
                $scope.json = data.data;
                persons = $scope.json.retinue;
                for(i;i<persons.length;i++){
                    if(persons[i].is_main==1){
                        $scope.mainnPerson = persons[i];
                    }else{
                        otherPerson.push(persons[i]);
                    }

                }
                $scope.otherPerson = otherPerson;
            }
            console.log(data.data.status.order_status.name);
            if(data.data.status.pay_status.name=="待支付"){
                $scope.payflag = false;
            }

            if(data.data.status.order_status.name=="待处理"){
                $scope.flag = true;
                $scope.statusflag = false;
                /*接收拒接*/
                $scope.receive = function(){

                   $http.get(API + '/index.php?r=store/store_order/receive&id='+$routeParams.id).success(function(data) {
                    if(data.status==0){
                         if ($rootScope.mobileType == 0) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                  'Tips': data.msg
                                }, function(response) {})
                            });
                        } else if ($rootScope.mobileType == 1) {
                            window.jsObj.prompt(data.msg);
                        }
                        console.log(data);
                    }else{
                        $scope.flag=false;
                    }
                    });
                }
                    
                /*拒接*/
                $scope.refuse = function(){
                    console.log(API + '/index.php?r=store/store_order/refuse&id='+$routeParams.id);
                    $http.get(API + '/index.php?r=store/store_order/refuse&id='+$routeParams.id).success(function(data) {
                    if(data.status==0){
                         if ($rootScope.mobileType == 0) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                  'Tips': data.msg
                                }, function(response) {})
                            });
                        } else if ($rootScope.mobileType == 1) {
                            window.jsObj.prompt(data.msg);
                        }
                        console.log(data);
                    }else{
                        $scope.flag=false;
                    } 
                    });  
                }

            }
        });
    }   

    $scope.zzyOrder();
    
    //确认消费
    $scope.sendCode = function(barcode){
        if(confirm('确认消费吗？')) {
            var url = API + '/index.php?r=store/store_orderItems/scancode';

            $http.get(url + '&csrf=csrf').success(function(data) {
                  var csrf = data.data.csrf.TMM_CSRF;
                  var token = {
                    "code": barcode,
                    "TMM_CSRF": csrf
                }

                $http.post(
                    url,
                    token, {
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    }
                ).success(function(data) {
                    console.log("消费消费大", data);
                    if(data.data.status){
                        if(data.data.status.value != 1){
                           mobileMessage(data.data.status.name); 
                        } else {
                           $scope.zzyOrder();
                            mobileMessage(data.data.status.name); 
                        }
                    }
                });
            
            });
        }
    }
    
}]);


/* 我的订单 觅趣 */
tmmApp.controller('jbyorderdetailCtrl',['$scope','$http',"$location",'$rootScope',function($scope, $http,$location,$rootScope) {
    $scope.json = {};

    if (!$rootScope.orderTourLink) {
        $location.path('index');
        return;
    }

    $scope.dayNumer = ['第一天上午','第一天下午','第二天上午','第二天下午','第三天上午','第三天下午','第四天上午','第四天下午','第五天上午','第五天下午','第六天上午','第六天下午','第七天上午','第七天下午','第八天上午','第八天下午','第九天上午','第九天下午','第十天上午','第十天下午']

    $scope.jbyOrder = function() {
        $http.get($rootScope.orderTourLink).success(function(data) {
            console.log(data);

            if(data.status==0){
                 if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': data.msg
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt(data.msg);
                }
                 console.log(data);
            }else{
                $scope.json = data.data;
            }

        });
    }
    $scope.jbyOrder();

    $scope.sendCode = function(barcode){
        if(confirm('确认消费吗？')) {
            var url = API + '/index.php?r=store/store_orderItems/scancode';

            $http.get(url + '&csrf=csrf').success(function(data) {
                  var csrf = data.data.csrf.TMM_CSRF;
                  var token = {
                    "code": barcode,
                    "TMM_CSRF": csrf
                }

                $http.post(
                    url,
                    token, {
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    }
                ).success(function(data) {
                    if(data.data.status){
                        if(data.data.status.value != 1){
                           mobileMessage(data.data.status.name); 
                        } else {
                           $scope.jbyOrder();
                            mobileMessage(data.data.status.name); 
                        }
                    }
                });
            
            });
        }
    }
        
}]);
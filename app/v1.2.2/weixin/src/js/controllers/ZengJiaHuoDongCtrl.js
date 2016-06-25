tmmApp.controller('ZengJiaHuoDongCtrl', ['$scope','$http','$routeParams','$location','$rootScope',function($scope, $http,$routeParams,$location,$rootScope) {
    $scope.form = {};

    /* 验证提交表单 */
    $scope.signupForm = function() {
        /* 验证表单 */
        if ($scope.signup_form.zengjia_name.$error.required) {
            $scope.msg = "结伴游名称不能为空";
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': $scope.msg
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt($scope.msg);
            }
        } else if ($scope.signup_form.zengjia_time.$error.required) {
            $scope.msg = "活动截止报名时间不能为空";
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': $scope.msg
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt($scope.msg);
            }
        } else if ($scope.signup_form.zengjia_price.$error.required){
            $scope.msg = "服务费不能为空";
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': $scope.msg
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt($scope.msg);
            }
        } else if ($scope.signup_form.zengjia_price.$error.number) {
            $scope.msg = "服务费必须为数字";
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': $scope.msg
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt($scope.msg);
            }
        } else if ($scope.signup_form.zengjia_remark.$error.required) {
            $scope.msg = "备注不能为空";
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': $scope.msg
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt($scope.msg);
            }
        }

        /* 发送表单 */
        if($scope.signup_form.$valid) {
            $scope.form.end_time = $scope.form.end_time.Format("yyyy-MM-dd hh:mm:ss");
            $scope.submit();
        }

    }

    $scope.submit = function() {
        var url = API + '/index.php?r=api/group/create';

        $http.get(url+'&csrf=csrf').success(function(data) {
            console.log(data);
            $scope.form.csrf = data.data.csrf.TMM_CSRF;

            var token = {
                "group_type":"2",    //发起结伴游类型  1=点 2=线    
                "is_insurance":$scope.form.ischeck ? '1' : '0',  //是否购买保险    1=购买
                "Group":{
                    "group_thrand":$routeParams.id,  //线ID    group_type=2（线ID）  group_type=1（传0） 
                    "price":$scope.form.price,   //结伴游服务费
                    "remark":$scope.form.remark, //结伴游备注
                    "end_time":$scope.form.end_time //报名截止时间
                },      
                "Shops": {
                    "name": $scope.form.name  // 结伴游名称
                },
                "TMM_CSRF" : $scope.form.csrf
            }

            console.log(angular.toJson(token,true));
            console.log(url);

            $http.post(
                url,
                token,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
                if (data.status == 0) {
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': data.msg
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt(data.msg);
                    }     
                } else if(data.status == 1) {
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '提交成功'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("提交成功");
                    }
                    $location.path('jiebanyou');
                }
            }).error(function(data) {
                if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '提交失败'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("提交失败");
                }
            })
        });

    }

}]);
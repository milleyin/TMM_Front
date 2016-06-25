/*戴曦*/
tmmApp.controller('AddTagCtrl',['$scope','$http','$routeParams','$rootScope',function($scope, $http, $routeParams,$rootScope) {

    var url = API + '/index.php?r=api/user/tags_index' + '&id=' + $routeParams.id;
    var TMM_CSRF = '';
    $scope.info = {};

    /* 获取页面数据 */
    $http.get(url).success(function(data) {
        $scope.info = data.data;
        console.log(data);
    })

    /* 添加标签 */
    $scope.addTag = function(index) {
        var tag = $scope.info.not_select_tags.splice(index,1)
        $scope.info.select_tags.push(tag[0]);

    }

    /* 删除标签 */
    $scope.removeTag = function(index) {
        var tag = $scope.info.select_tags.splice(index,1)
        $scope.info.not_select_tags.push(tag[0]);
    }

    /* 保存标签 */
    $scope.saveTag = function() {
        /* 获取 csrf 码*/
        if ($scope.info.select_tags.length == 0) {
            if ($rootScope.mobileType == 0) { //ios
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '为了能给您更好的服务，标签至少选择一个!'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt('为了能给您更好的服务，标签至少选择一个');
            } 
            return;
        }

        var url = API + '/index.php?r=api/user/tags_select' + '&id=' + $routeParams.id;
        console.log(url)
        $http.get(url + '&csrf=csrf').success(function(data) {
            TMM_CSRF = data.data.csrf.TMM_CSRF;
            var ids = '';


            for (var i = 0; i < $scope.info.select_tags.length; i++) {
                if (i==0) {
                    ids = $scope.info.select_tags[i].value
                } else {
                    ids += ',' + $scope.info.select_tags[i].value;
                }
            };

            var token = {
                "TagsElement": {
                  "user_select_tags_type": ids
                },
                "TMM_CSRF": TMM_CSRF
            }

            console.log(url);
            console.log(token);
            $http.post(
                url,
                token,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
                console.log(data)
                if (data.status == 1) {
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '保存成功!'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("保存成功");
                    }    
                } else {
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '保存失败!'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("保存失败");
                    }
                }

            }).error(function(data) {
                if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '保存失败!'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("保存失败");
                }
            })

        });
    }

}]);
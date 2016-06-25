tmmApp.controller('OrderCtrl',['$scope','$http','$location','$routeParams','$rootScope',function($scope,$http,$location,$routeParams,$rootScope) {
    $scope.tianjia = { // 添加人员信息
        'name' : '',
        'identity' : '',
        'phone' : '',
        'email' : '',
        'delete_link' : '',
        'update_link' : ''
    }
    $scope.data = {};
    $scope.totPrice = 0;// 总价
    $scope.orderRetinue = [];// 主要联系人与随行人员需要提交的信息
    $scope.goTime = ''; // 时间

    $scope.selectedRetinues = []; // 已选择的随行人员
    $scope.notSelectedRetinues = []; // 没选择的随行人员
    $scope.isShowRetinues = false;

    $scope.getUserInfo = function() {

        $http.get(API + '/index.php?r=api/user/view').success(function(data) {

            if (data.status == 0) {
                $rootScope.isLogin = false;
            } else {
                $rootScope.user = data.data;
                // console.log('user--',$rootScope.user);
                $rootScope.isLogin = true;
                $scope.notSelectedRetinues = $rootScope.user.retinueInfo.list;
                console.log('user--', $scope.notSelectedRetinues);
                $scope.setOrderRetinue();
            }

        });
    }


    // 获取个人信息
    $scope.getUserInfo();

    // 获取表单信息
    $http.get(API + '/index.php?r=api/order/fare_dot&id=' + $routeParams.id).success(function(data) {
        // console.log(angular.toJson(data,true))
        // console.log(data.data)
        $scope.data = data.data;
        $rootScope.saveDotItem.push($scope.data);

        console.log('saveDotItem--',data.data);
        $scope.setTotPrice();

    });

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=api/retinue/create' + '&csrf=csrf').success(function(data){
       $scope.TMM_CSRF = data.data.csrf.TMM_CSRF;

    });

    /* 显示表单 */
    $scope.addRetinue = function(type) {
        var l = 70;
        var width = $(window).width() - l;
        var top = 70;

        $scope.showForm = true;
        $scope.showMask = true;
        $('.tianjia_form').css({'left': l/2,'top': top,'width': width,'zIndex': 101});

        $scope.tianjiaType = type;
        if (type==0) {
            $scope.tianjia = { // 添加人员信息
                    'name' : '',
                    'identity' : '',
                    'phone' : '',
                    'email' : '',
                    'delete_link' : '',
                    'update_link' : ''
                }
            $scope.tianjiaTit = '添加随行人员';
        } else if (type==1) {
            $scope.tianjia = { // 添加人员信息
                    'name' : '',
                    'identity' : '',
                    'phone' : '',
                    'email' : '',
                    'delete_link' : '',
                    'update_link' : ''
                }
            $scope.tianjiaTit = '添加主要成员';
            $scope.tianjia.phone = $scope.user.userInfo.phone;
        } else if (type==2) {
            $scope.tianjiaTit = '修改随行人员';   
        } else if (type==3) {
            $scope.tianjiaTit = '修改主要成员';
        }
    }

    /* 提交表单 */
    $scope.submitTianjia = function(type) {
        if ($scope.tianjiaRetinue.name.$error.required) {
            $scope.msg = "姓名不能为空";
        } else if ($scope.tianjiaRetinue.identity.$error.required) {
            $scope.msg = "身份证不能为空";
        } else if ($scope.tianjiaRetinue.phone.$error.required) {
            $scope.msg = "手机号不能为空";
        } else if ($scope.tianjiaRetinue.email.$error.email){
            $scope.msg = "邮箱格式错误";
        }

        if($scope.tianjiaRetinue.$valid) {

            $scope.sendRetinue(type);
        }

       
    }

    /* 发送表单 */
    $scope.sendRetinue = function(type) {
        
        var token = {
            "Retinue" : {
                "name" : $scope.tianjia.name,
                "identity" : $scope.tianjia.identity,
                "phone" : $scope.tianjia.phone,
                "email" : $scope.tianjia.email
            },
            "TMM_CSRF": $scope.TMM_CSRF
        }

        // 添加主要联系人和随行联系人
        if (type==0 || type==1) {

            $http.post(
                API + '/index.php?r=api/retinue/create' + '&type=' + type,
                token,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
               
                if (data.status == 0) {
                    if (data.form.Retinue_identity) {
                        $scope.msg = data.form.Retinue_identity[0];
                    } else if(data.form.Retinue_name) {
                        $scope.msg = data.form.Retinue_name[0];
                    } else if(data.form.Retinue_phone) {
                        $scope.msg = data.form.Retinue_phone[0];
                    } else if(data.form.Retinue_is_main){
                        $scope.msg = data.form.Retinue_is_main[0];
                    } else {
                        $scope.msg = "添加失败";
                    }
                } else if(data.status == 1) {
                    $scope.showForm = false;
                    $scope.showMask = false;
                    $scope.getUserInfo();               
                }
             
            }).error(function(data) {
                $scope.msg = '添加失败';
            })
        }

        // 更新随行人员与主要联系人
        if (type==2 || type==3) {
            if (type==2){
                url = API + '/index.php?r=api/retinue/update&id=' + $scope.tianjia.value;
            } else if (type == 3) {
                url = API + '/index.php?r=api/retinue/update_main&id=' + $scope.tianjia.value;
            }
            
            var token = {
                "Retinue" : {
                    "name" : $scope.tianjia.name,
                    "identity" : $scope.tianjia.identity,
                    "phone" : $scope.tianjia.phone,
                    "email" : $scope.tianjia.email
                },
                "TMM_CSRF": $scope.TMM_CSRF
            }

            $http.post(
                url,
                token,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
                if (data.status == 0) {
                    console.log(data);

                    if (data.form.Retinue_identity) {
                        $scope.msg = data.form.Retinue_identity[0];
                    } else if(data.form.Retinue_name) {
                        $scope.msg = data.form.Retinue_name[0];
                    } else if(data.form.Retinue_phone) {
                        $scope.msg = data.form.Retinue_phone[0];
                    } else if(data.form.Retinue_is_main){
                        $scope.msg = data.form.Retinue_is_main[0];
                    } else {
                        $scope.msg = "添加失败";
                    }
                } else if(data.status == 1) {
                    $scope.showForm = false;
                    $scope.showMask = false;
                    $scope.getUserInfo();               
                }
            });
        }

    }

    /* 清除提示信息 */
    $scope.clearMsg = function() {
        $scope.msg = '';
    }

    /* 修改随行人员表单 */
    $scope.updateRetinue = function(id,type) {
        var url = API + '/index.php?r=api/retinue/view' + '&id=' + id;

        $http.get(url).success(function(data) {
            $scope.tianjia = { // 添加人员信息
                'name' : data.data.name,
                'identity' : data.data.identity,
                'phone' : data.data.phone,
                'email' : data.data.email,
                'delete_link' : data.data.delete_link,
                'update_link' : data.data.update_link,
                'value' : data.data.value
            }

            $scope.addRetinue(type);

        });
    }

    /* 删除随行人员 */
    $scope.deleteRetinue = function(id,type) {
        if (confirm('您确认删除吗')){
            var url = API + '/index.php?r=api/retinue/delete&id=' + $scope.tianjia.value;
            $http.get(url).success(function(data){
                if (data.status == 1) {

                    $scope.showForm = false;
                    $scope.showMask = false;
                    $scope.getUserInfo();   
                } else {
                    $scope.msg = "删除失败";
                }
            });
            
        }
    }


    // 添加数量
    $scope.jiaNumber = function(wrapIndex,outerIndex,innerIndex) {
        console.log($rootScope.saveDotItem);
        console.log('1111',$rootScope.saveDotItem[wrapIndex].items_fare);
        $rootScope.saveDotItem[wrapIndex].items_fare[outerIndex].fare[innerIndex].number ++;
        
        $scope.setTotPrice();
    }

    // 减少数量
    $scope.jianNumber = function(wrapIndex,outerIndex,innerIndex) {
        if ($rootScope.saveDotItem[wrapIndex].items_fare[outerIndex].fare[innerIndex].number >=1) {
            $rootScope.saveDotItem[wrapIndex].items_fare[outerIndex].fare[innerIndex].number --;     
        }
        $scope.setTotPrice();
    }



    // 获取主要联系人与随行人员提交信息
    $scope.setOrderRetinue = function() {
        $scope.orderRetinue = [];
        var obj = {
            "is_main": "1",
            "retinue_id": $rootScope.user.main_retinueInfo.list[0].value
        }
        $scope.orderRetinue.push(obj);

        if (!$rootScope.user.retinueInfo.list) {
            $rootScope.user.retinueInfo.list = [];
        }
        for (var i = 0; i < $rootScope.user.retinueInfo.list.length; i++) {
            obj = {
                "is_main": "0",
                "retinue_id": $rootScope.user.retinueInfo.list[i].value
            }
            $scope.orderRetinue.push(obj);
        }
        
    }

    // 计算总价格
    $scope.setTotPrice = function() {
        $scope.totPrice = 0;
        for (var x = 0; x < $rootScope.saveDotItem.length; x++) {
            for (var i = 0; i < $rootScope.saveDotItem[x].items_fare.length; i++) {
                for (var j = 0; j < $rootScope.saveDotItem[x].items_fare[i].fare.length; j++) {
                   $scope.totPrice =(($rootScope.saveDotItem[x].items_fare[i].fare[j].number *$rootScope.saveDotItem[x].items_fare[i].fare[j].price*100 + $scope.totPrice*100)/100).toFixed(2);

                };
            };
        };
    }


    // 商品项目过滤
    $scope.filterItem = function() {

        var item = {}
        item["0"] = [];

        for (var i = 0; i < $rootScope.saveDotItem.length; i++) {
            item["0"][i] = {};
            item["0"][i][$rootScope.saveDotItem[i].value] = [];
            for (var j = 0; j < $rootScope.saveDotItem[i].items_fare.length; j++) {
                item["0"][i][$rootScope.saveDotItem[i].value][j] = {};
                item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value] = [];

                // item["0"][i][$rootScope.saveDotItem[i].value][j] = $rootScope.saveDotItem[j].items_fare[j];
                for (var x = 0; x < $rootScope.saveDotItem[i].items_fare[j].fare.length; x++) {
                    if ($rootScope.saveDotItem[i].items_fare[j].fare[x].number > 0) {
                        item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value][x] = {};
                        item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value][x][$rootScope.saveDotItem[i].items_fare[j].fare[x].value] = {};

                        item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value][x][$rootScope.saveDotItem[i].items_fare[j].fare[x].value]['price'] = $rootScope.saveDotItem[i].items_fare[j].fare[x].price;
                        item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value][x][$rootScope.saveDotItem[i].items_fare[j].fare[x].value]['number'] = $rootScope.saveDotItem[i].items_fare[j].fare[x].number;
                        item["0"][i][$rootScope.saveDotItem[i].value][j][$rootScope.saveDotItem[i].items_fare[j].value][x][$rootScope.saveDotItem[i].items_fare[j].fare[x].value]['count'] = $rootScope.saveDotItem[i].items_fare[j].fare[x].number * $rootScope.saveDotItem[i].items_fare[j].fare[x].price;
                    }

                };
            };
        };

        // 过滤项目子项目
        for (var i = 0; i < item["0"].length; i++) {
            for (var attr1 in item["0"][i]) {
                for (var j = 0; j < item["0"][i][attr1].length; j++) {
                    for (var attr2 in item["0"][i][attr1][j]) {
                        for (var x = 0; x < item["0"][i][attr1][j][attr2].length; x++) {
                            if (item["0"][i][attr1][j][attr2][x] == null) {

                                item["0"][i][attr1][j][attr2].splice(x,1);
                                x--;
                            }
                        }
                    }
                }

            }
        }

        // 过滤项目
        for (var i = 0; i < item["0"].length; i++) {
            for (var attr1 in item["0"][i]) {
                for (var j = 0; j < item["0"][i][attr1].length; j++) {
                    for (var attr2 in item["0"][i][attr1][j]) {
                        if (item["0"][i][attr1][j][attr2].length == 0) {
                            item["0"][i][attr1].splice(j,1);
                            j--;
                        }
                    }
                }

            }
        }

        // 过滤点
        for (var i = 0; i < item["0"].length; i++) {
            for (var attr1 in item["0"][i]) {
                if (item["0"][i][attr1].length == 0) {
                    item["0"].splice(i,1);
                    i--;
                }
            }
        }

        return item;
    }

    // 添加订单
    $scope.addItem = function() {

        $location.path('tuijianpointlist');
    }

    // 删除订单
    $scope.clearItem = function() {
        $rootScope.saveDotItem = [];
    }

    // 提交订单
    $scope.submit = function() {
        var items = $scope.filterItem();
        if ($scope.goTime == '') {
            alert('请确定出行时间');
            return;
        } else if (items['0'].length==0) {
            alert('请选择商品');
            return;
        }
        var token = {
            "Order": {
                "user_price": "0",              //服务费总计
                "order_type": "1",              //点下单
                "order_price": $scope.totPrice,       //订单总计
                "son_order_count": "0",         //子订单 统计
                "go_time": $scope.goTime.Format("yyyy-MM-dd"),        //出游时间
                "user_go_count": $rootScope.user.retinueInfo.list.length + 1            //随行人员 人数
            },
            "OrderRetinue": $scope.orderRetinue,
            "OrderItems" : items,
            "TMM_CSRF": $scope.TMM_CSRF
        };
        console.log('token',token);
        $http.post(
            API + '/index.php?r=api/order/create',
            token,
            {
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }
        ).success(function(data){
            console.log(data);
            if (data.status == 1) {
                $rootScope.orderInfoText = data.data;
                $rootScope.saveDotItem = [];
                // return;
                $location.path('orderDetail/'+data.data.id.value);
            } else {
                if (data.form.Order_go_time) {
                    alert(data.form.Order_go_time[0]);
                }
            }
           
        });
    }

    //$index == retinueNum?'iconfont h_left h_20': 'iconfont h_left h_20 active'

    // 添加随行人员
    $scope.addRetinues = function(index,attr) {

        attr.isSelected = !attr.isSelected;
        $scope.selectedRetinues = [];
        for (var i = 0; i < $scope.notSelectedRetinues.length; i++) {
            if ($scope.notSelectedRetinues[i].isSelected == true) {
                $scope.selectedRetinues.push($scope.notSelectedRetinues[i]);
            }
        }
        console.log($scope.selectedRetinues)
    }


    // 展示添加随行人员页面
    $scope.showRetinues = function() {
        $scope.isShowRetinues = true;
        $scope.showMask = true;
    }
}]);
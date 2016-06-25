tmmApp.controller('OrderLineCtrl',['$scope','$http','$location','$routeParams','$rootScope',function($scope,$http,$location,$routeParams,$rootScope) {
    $scope.tianjia = { // 添加人员信息
        'name' : '',
        'identity' : '',
        'phone' : '',
        'email' : '',
        'delete_link' : '',
        'update_link' : ''
    }

    var c = 0;
    var r = 0;



    $scope.info = {}; //线的详情信息
    $scope.totlePrice = 0;
    $scope.orderRetinue = [];// 主要联系人与随行人员需要提交的信息
    $scope.orderRetinueNum = 0;// 主要联系人的信息
    $scope.goTime = new Date(); // 时间
    $scope.showAddress = true;
    $scope.TMM_CSRF = '';

    $scope.selectedRetinues = []; // 已选择的随行人员
    $scope.notSelectedRetinues = []; // 没选择的随行人员
    $scope.isShowRetinues = false;

    $scope.dayNumer = ['第一天上午','第一天下午','第二天上午','第二天下午','第三天上午','第三天下午','第四天上午','第四天下午','第五天上午','第五天下午','第六天上午','第六天下午','第七天上午','第七天下午','第八天上午','第八天下午','第九天上午','第九天下午','第十天上午','第十天下午']

    // 获取个人信息
    $scope.getUserInfo = function() {

        $http.get(API + '/index.php?r=api/user/view').success(function(data) {

            if (data.status == 0) {
                $rootScope.isLogin = false;
            } else {
                $rootScope.user = data.data;
                // console.log('user--',$rootScope.user);
                $rootScope.isLogin = true;
                $scope.notSelectedRetinues = $rootScope.user.retinueInfo.list;
               
                //console.log("测试", $rootScope.user.main_retinueInfo.length);
                if($rootScope.user.main_retinueInfo.length != 0){
                    $scope.setOrderRetinue();
                }
            }

        });
    }
    // 获取个人信息
    $scope.getUserInfo();

     /* 获取csrf码 */
    $http.get(API + '/index.php?r=api/retinue/create' + '&csrf=csrf').success(function(data){
       $scope.TMM_CSRF = data.data.csrf.TMM_CSRF;

    });

    // 获取表单信息
    $http.get(API + '/index.php?r=api/order/fare_thrand&id=' + $routeParams.id).success(function(data) {

        console.log(data.data);
        // console.log(angular.toJson(data.data.dot_list,true));
        $scope.info = data.data;

        for (var m = 0; m < $scope.info.OrderItemsFare.length; m++) {
            if ($scope.info.OrderItemsFare[m]['info'] == '成人') {
                c = m;
                // $scope.info.OrderItemsFare[m]['number']++;
            } else {
                r = m;
            }
        }
    });

    // 添加成人或者儿童
    $scope.jiaNum = function(str) {

        var list = $scope.info.dot_list;



        if (str == '成人') {
            for (var m = 0; m < $scope.info.OrderItemsFare.length; m++) {
                if ($scope.info.OrderItemsFare[m]['info'] == '成人') {
                    $scope.info.OrderItemsFare[m]['number']++;
                } 
            }

            for(var attr1 in list) {

                for (var i = 0; i < list[attr1].length; i++) {

                    for (var attr2 in list[attr1][i]) {
                        if (attr2 != '$$hashKey') {
                            
                            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

                                for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                            
                                    if (list[attr1][i][attr2][j]['fare'][k]['info'] == '成人') {
                                        list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[c]['number'];
                                        list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                    } else if (list[attr1][i][attr2][j]['fare'][k]['room_number'] == 1) {
                                        list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[c]['number'];
                                        list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                    } else if (list[attr1][i][attr2][j]['fare'][k]['room_number'] == 2) {
                                        list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil($scope.info.OrderItemsFare[c]['number']/2);
                                        list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);
                                        
                                    }
                                }
                            }

                        }
                    }
                }
            }

        } else { // 儿童
           
            if ($scope.info.OrderItemsFare[c]['number']*2 <= $scope.info.OrderItemsFare[r]['number']) {
                // alert('儿童人数不能大于成人的两倍');
                if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '儿童人数不能大于成人的两倍'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("儿童人数不能大于成人的两倍");
                }
                return;
            }
            $scope.info.OrderItemsFare[r]['number']++;

            for(var attr1 in list) {

                for (var i = 0; i < list[attr1].length; i++) {

                    for (var attr2 in list[attr1][i]) {
                        if (attr2 != '$$hashKey') {
                            
                            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

                                for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                       
                                    if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                                        list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[r]['number'];
                                        list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                    }
                                }
                            }

                        }
                    }
                }
            }
        }

        $scope.setTotPrice();
       
    }

    // 减少成人或者儿童
    $scope.jianNum = function(str) {
        var list = $scope.info.dot_list;

        if (str == '成人') {
            
            if ($scope.info.OrderItemsFare[c]['number'] >= 1) {
                if (($scope.info.OrderItemsFare[c]['number']-1)*2 < $scope.info.OrderItemsFare[r]['number']) {

                    // alert('儿童人数不能大于成人的两倍');
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': '儿童人数不能大于成人的两倍'
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt("儿童人数不能大于成人的两倍");
                    }
                    return;

                }
                $scope.info.OrderItemsFare[c]['number']--;

                for(var attr1 in list) {

                    for (var i = 0; i < list[attr1].length; i++) {

                        for (var attr2 in list[attr1][i]) {
                            if (attr2 != '$$hashKey') {
                                
                                for (var j = 0; j < list[attr1][i][attr2].length; j++) {

                                    for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                                
                                        if (list[attr1][i][attr2][j]['fare'][k]['info'] == '成人') {
                                            list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[c]['number'];
                                            list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                        } else if (list[attr1][i][attr2][j]['fare'][k]['room_number'] == 1) {
                                            list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[c]['number'];
                                            list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                        } else if (list[attr1][i][attr2][j]['fare'][k]['room_number'] == 2) {
                                            list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil($scope.info.OrderItemsFare[c]['number']/2);
                                            list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);
                                            
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
                            

        } else { // 儿童
           
            if ($scope.info.OrderItemsFare[r]['number'] >= 1) {
                $scope.info.OrderItemsFare[r]['number']--;

                for(var attr1 in list) {

                    for (var i = 0; i < list[attr1].length; i++) {

                        for (var attr2 in list[attr1][i]) {
                            if (attr2 != '$$hashKey') {
                                
                                for (var j = 0; j < list[attr1][i][attr2].length; j++) {

                                    for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                           
                                        if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                                            list[attr1][i][attr2][j]['fare'][k]['number'] = $scope.info.OrderItemsFare[r]['number'];
                                            list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                                        }
                                    }
                                }

                            }
                        }
                    }
                }

            }
        }

        $scope.setTotPrice();
    }

    // 计算总价格
    $scope.setTotPrice = function() {
        $scope.totlePrice = 0;
        var list = $scope.info.dot_list;

        for(var attr1 in list) {

            for (var i = 0; i < list[attr1].length; i++) {

                for (var attr2 in list[attr1][i]) {
                    if (attr2 != '$$hashKey') {
                        for (var j = 0; j < list[attr1][i][attr2].length; j++) {

                            for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                                list[attr1][i][attr2][j]['fare'][k]['count'] = list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']
                                $scope.totlePrice = (list[attr1][i][attr2][j]['fare'][k]['count'] + $scope.totlePrice*1).toFixed(2);
                            }
                        }

                    }
                }
            }
        }

        console.log($scope.totlePrice)
    }


    /* 显示表单 */
    $scope.addRetinue = function(type) {
        var l = 70;
        var width = $(window).width() - l;
        var top = 70;

        if (type == 1 || type == 3) {
            $scope.showAddress = true;
        } else {
            $scope.showAddress = false;
        }

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
        console.log("type", type);
        if (type==0 || type==1) {
            /*if(type == 0){ //如果没有主要成员，添加子成员的时候提示
                if($rootScope.user.main_retinueInfo.length == 0 || $scope.orderRetinueNum == 0){
                    alert("请优先添加主要成员!");
                    return;
                } 
            }*/
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
                        $scope.msg = data.form.Reti
                        
                        nue_name[0];
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
                    $scope.showRetinues();

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

    // 获取主要联系人信息
    $scope.setOrderRetinue = function() {

        $scope.orderRetinue = [];

        var obj = {
            "is_main": "1",
            "retinue_id": $rootScope.user.main_retinueInfo.list[0].value
        }
        
        $scope.orderRetinue.push(obj);
        if($scope.orderRetinue.length != 0){
            $scope.orderRetinueNum = 1;

            for (var i = 0; i < $scope.selectedRetinues.length; i++) {
                obj = {
                    "is_main": "0",
                    "retinue_id": $scope.selectedRetinues[i].value
                }
                $scope.orderRetinue.push(obj);
            }

        }

        
    }

     // 添加随行人员
    $scope.addRetinues = function(index,attr) {

        attr.isSelected = !attr.isSelected;
        $scope.selectedRetinues = [];
        for (var i = 0; i < $scope.notSelectedRetinues.length; i++) {
            if ($scope.notSelectedRetinues[i].isSelected == true) {
                $scope.selectedRetinues.push($scope.notSelectedRetinues[i]);
            }
        }

        $scope.setOrderRetinue();
        console.log($scope.selectedRetinues)
    }


    // 展示添加随行人员页面
    $scope.showRetinues = function() {
        $scope.isShowRetinues = true;
        $scope.showMask = true;
    }

    // 添加随行人员（添加到数据库）
    $scope.addRetinueName = function() {
        $scope.isShowRetinues = false;
        $scope.showMask = false;

        $scope.addRetinue(0);
    }

    // 项目过滤
    $scope.filterItem = function() {
        var item = {};
        var list = $scope.info.dot_list;

        for(var attr1 in list) {
            item[attr1] = [];
            for (var i = 0; i < list[attr1].length; i++) {
                item[attr1][i] = {};
                for (var attr2 in list[attr1][i]) {
                    item[attr1][i][attr2] = [];
                    if (attr2 != '$$hashKey') {
                        
                        for (var j = 0; j < list[attr1][i][attr2].length; j++) {
                            item[attr1][i][attr2][j] = {};
                            item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']] = [];

                            for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k] = {};
                                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']] = {};
                                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['price'] = list[attr1][i][attr2][j]['fare'][k]['price'];
                                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['number'] = list[attr1][i][attr2][j]['fare'][k]['number'];
                                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['count'] = list[attr1][i][attr2][j]['fare'][k]['count'];

                            }
                        }

                    }
                }
            }
        }

        item['value'] = $scope.info.value;
        return item;
    }

    // 提交订单
    $scope.submit = function() {
        var items = $scope.filterItem();
        var crNum = 0;
        for (var i = 0; i < $scope.info.OrderItemsFare.length; i++) {
            crNum += $scope.info.OrderItemsFare[i]['number'];
        }
        
        if ($scope.goTime == '') {    
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '请确定出行时间'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("请确定出行时间");
            }
        } else if ($scope.info.OrderItemsFare[c]['number'] == 0) {    
            //alert('请选择人数')
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '请选择人数'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("请选择人数");
            }
            return;
        } else if($scope.orderRetinueNum == 0){
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '请添加主要成员'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("请添加主要成员");
            }
            return;
        } else if($scope.orderRetinue.length != crNum) {
            // alert('选择人数与随行人员不匹配');
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '选择人数与随行人员不匹配'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("选择人数与随行人员不匹配");
            }
            return;
        }

        var token = {
            "Order": {
                "user_price": "0",              //服务费总计
                "order_type": "2",              //点下单
                "order_price": $scope.totlePrice,       //订单总计
                "son_order_count": "0",         //子订单 统计
                "go_time": $scope.goTime.Format("yyyy-MM-dd"),        //出游时间
                "user_go_count": $scope.orderRetinue.length            //随行人员 人数
            },
            "OrderRetinue": $scope.orderRetinue,
            "OrderItems" : items,
            "OrderItemsFare" : $scope.info.OrderItemsFare,
            "TMM_CSRF": $scope.TMM_CSRF
        };
        console.log(angular.toJson(token ,true));
        // console.log(token);
        console.log(API + '/index.php?r=api/order/create')
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
                if (data.form) {

                    if (data.form.Order_go_time) {
                        if ($rootScope.mobileType == 0) { //ios
                            connectWebViewJavascriptBridge(function(bridge) {
                                bridge.callHandler('ObjcCallback', {
                                  'Tips': data.form.Order_go_time[0]
                                }, function(response) {})
                            });
                        } else if ($rootScope.mobileType == 1) {
                            window.jsObj.prompt(data.form.Order_go_time[0]);
                        }    
                    }
                }
            }
           
        });
    }
}]);
/*戴曦*/
tmmApp.controller('MyInfoCtrl',['$scope','$http','$location','$route','$rootScope',function($scope,$http,$location,$route,$rootScope) {

    $scope.data = { // 用户信息
        'main_retinueInfo' : [],
        'retinueInfo' : [],
        'tagsInfo' : [],
        'userInfo' : {},
        'status' : 0,
    };

    $scope.tianjia = { // 添加人员信息
        'name' : '',
        'identity' : '',
        'phone' : '',
        'email' : '',
        'delete_link' : '',
        'update_link' : ''
    }
    $scope.nickname = '';

    $scope.sex = 'f';

    $scope.TMM_CSRF = ''; // csrf码
    $scope.msg = ''; // 添加人员错误信息
    $scope.tianjiaType = 0; // 0 表示添加联系人，1 表示添加主要联系人
    $scope.tianjiaTit = '添加随行联系人';
    $scope.showAddress = true;

    $scope.showGender = false; // 显示男女
    $scope.showForm = false; // 显示表单
    $scope.showMask = false; // 显示遮罩

    /* 获取页面信息 */
    $http.get(API + '/index.php?r=api/user/view').success(function(data) {
      
            console.log(data);
        if (data.status == 1) { // 获取个人信息
            // 获取个人信息
            $scope.data.userInfo = data.data.userInfo;
            $scope.nickname = data.data.userInfo.nickname;

            // 获取主要联系人
            $scope.data.main_retinueInfo = data.data.main_retinueInfo.list;
            // 获取随行人员
            $scope.data.retinueInfo = data.data.retinueInfo.list;
            // 获取标签
            $scope.data.tagsInfo = data.data.tagsInfo;
            // myInfoTagService.tagsInfo = data.data.tagsInfo; // 通过myInfoTagService服务储存标签信息

            // console.log(myInfoTagService.tagsInfo);

        } else if (data.status == 0) { // 返回登录页面
            // $scope.data.userInfo = $scope.transInfo(JSON.parse(localStorage.user));

            $location.path('my')
        }
    });

    /* 获取csrf码 */
    $http.get(API + '/index.php?r=api/retinue/create' + '&csrf=csrf').success(function(data){
       $scope.TMM_CSRF = data.data.csrf.TMM_CSRF;

    });


    /* 修改昵称 */
    $scope.changeNickname = function() {

        if ($scope.data.userInfo.nickname.length > 20) {
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '昵称长度不能超过20位'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("昵称长度不能超过20位");
            }
            $scope.data.userInfo.nickname = $scope.nickname;
            return;
        }
        if ($scope.nickname != $scope.data.userInfo.nickname) {

            var url = API + '/index.php?r=api/user/update';
            var token = {
                "User": {
                  "nickname": $scope.data.userInfo.nickname, 
                  "gender": $scope.data.userInfo.gender
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
                if (data.status == 1) {
                    $scope.nickname = $scope.data.userInfo.nickname;
                } else {
                    $scope.data.userInfo.nickname = $scope.nickname;
                    if ($rootScope.mobileType == 0) { //ios
                        connectWebViewJavascriptBridge(function(bridge) {
                            bridge.callHandler('ObjcCallback', {
                              'Tips': data.form.User_nickname[0]
                            }, function(response) {})
                        });
                    } else if ($rootScope.mobileType == 1) {
                        window.jsObj.prompt(data.form.User_nickname[0]);
                    }
                }
            }).error(function(data){
                $scope.data.userInfo.nickname = $scope.nickname;
                if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '修改失败'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("修改失败");
                }
            });
        }

    }

    /* 修改性别 */
    // 显示男女选择框
    $scope.changeGender = function() {
        $scope.showGender = true;
        $scope.showMask = true;
    }

    // 选择男女
    $scope.selectGender = function(gender) {
        if (gender != $scope.data.userInfo.gender) {

            var url = API + '/index.php?r=api/user/update';
            var token = {
                "User": {
                  "nickname": $scope.data.userInfo.nickname, 
                  "gender": gender
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
                $scope.data.userInfo.gender = gender;
            }).error(function(data) {
                if ($rootScope.mobileType == 0) { //ios
                    connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': '修改失败'
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt("修改失败");
                }
            });
        }

        $scope.showGender = false;
        $scope.showMask = false;

    }


    /* 跳到标签修改页面 */
    $scope.goTagPage = function(attr) {

        $location.path('addtag/' + attr.value);
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
            $scope.tianjiaTit = '添加随行联系人';
            $scope.tianjia.name = '';
            $scope.tianjia.identity = '';
            $scope.tianjia.email = '';
        } else if (type==1) {
            $scope.tianjiaTit = '添加主要联系人';
            $scope.tianjia.phone = $scope.user.userInfo.phone;
            $scope.tianjia.name = '';
            $scope.tianjia.identity = '';
            $scope.tianjia.email = '';
        } else if (type==2) {
            $scope.tianjiaTit = '修改随行联系人';   
        } else if (type==3) {
            $scope.tianjiaTit = '修改主要联系人';
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
                    console.log(data.form);
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
                    $route.reload();               
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
                
            console.log(url)
            
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
                    $route.reload();               
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
                'value' : data.data.value,
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
                    $route.reload();   
                } else {
                    $scope.msg = "删除失败";
                }
            });
            
        }
    }


    $scope.sex = 'f'
    // 选择地址
    $scope.selectAddress = function() {
        $scope.sex = $('#selectSheng').val()
        console.log($scope.sex)

    
    }

    /* 跳转修改密码页面 */
    $scope.setPwd = function() {
        $location.path('set_pwd');
    }

    /* 跳转到修改手机号页面 */
    $scope.setPhone = function() {
        $location.path('set_phone');
    }

}]);
angular.module('mycreateactdetail', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.mycreateactdetail', {
      url: '/mycreateactdetail/:link',
      templateUrl: 'app/mycreateact/templates/my-createact-detail.html',
      controller: 'MyCreateActDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) { 
          if ($ionicHistory.backView() === null || $ionicHistory.backView().stateName !== 'tab.mycreateactdetail') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })

    /*编辑活动的名称*/
    .state('tab.editactname', {
      url: '/editactname/:actname/:actid',
      templateUrl: 'app/mycreateact/templates/edit-act-name.html',
      controller: 'MyActEditCtrl'
    })

    /*编辑参与人数*/
    .state('tab.editactnum', {
      url: '/editactname/:actnum/:actid',
      templateUrl: 'app/mycreateact/templates/edit-act-num.html',
      controller: 'MyActEditCtrl'
    })

    /*编辑服务费*/
    .state('tab.edittourprice', {
      url: '/edittourprice/:tourprice/:actid',
      templateUrl: 'app/mycreateact/templates/edit-tour-price.html',
      controller: 'MyActEditCtrl'
    })

}])


//我发起的活动详情页
.controller('MyCreateActDetailCtrl', function($scope, $http, $ionicActionSheet, $filter, $sce, $stateParams, $ionicLoading, data, modify, Resource, appFunc, uiCalendar, security, device, ENV) {

  $scope.model = data;

  $scope.selType = 1;
  var actId = data.actives_id;
  var link = null; //获取联系人的链接
  $scope.orderModel = null; //存储联系人以及相关信息
  $scope.orderListModel = null; //存储联系人
  var loadMoreJoinLink = ''; //参与人是否有分页
  $scope.loadmore = false;
  $scope.detailLink = $stateParams.link; //活动当前详情链接

  var remark = data.actives_info.remark;
  $scope.model.actives_info.remark = $sce.trustAsHtml($scope.model.actives_info.remark);
  

  security.getUserInfo().then(function(data){
    $scope.userInfo = data.userInfo;
  });

  $scope.$on("$ionicView.enter", function() { //上一级返回修改名字
    if (modify.ismodify) {
      if(modify.modifydate.actname != "") {
        $scope.model.name = modify.modifydate.actname;
      }
      if(modify.modifydate.actnum != "") {
        $scope.model.actives_info.number.value = modify.modifydate.actnum;
      }
      if(modify.modifydate.tourprice != "") {
        $scope.model.actives_info.tour_price.value = modify.modifydate.tourprice;
      } 
      if(modify.modifydate.changeline != "") {
        loadActDetail();
      }  
    }
  });

  //获取联系人
  if (data.actives_pay_type.value === '1') { //代付
    link = data.actives_info.attend_list;
  } else if (data.actives_pay_type.value === '0') { //自费
    link = data.actives_info.order_list;
  }

  

  if(Boolean(link)){

    Resource.get(link).then(function(data){
      $scope.orderModel = data;
      $scope.orderListModel = data.list_data;
      loadMoreJoinLink = data.page.next;
      $scope.participantNum = 1;
    }, function(data) {

    })
  } else {
    $scope.participantNum = 0;
  }

  function loadActDetail() {
    Resource.get($stateParams.link).then(function(data){
      $scope.model = data;
      $scope.model.actives_info.remark = $sce.trustAsHtml($scope.model.actives_info.remark);
    });
  }
  function isLoadMore(){
    if(loadMoreJoinLink != ""){
      $scope.loadmore = true;
    } else {
      $scope.loadmore = false;
    }
  }

  $scope.showTabs = function(index){
    if ($scope.selType == index) return;
    $scope.selType = index;
    if(index == 2) {
      isLoadMore();
    }
  }

  //加载更多参与人
  $scope.loadMoreParticipant = function (){
    if (loadMoreJoinLink) {
      Resource.get(loadMoreJoinLink).then(function(data) {
        loadMoreJoinLink = data.page.next;
        $scope.orderListModel = $scope.orderListModel.concat(data.list_data);
      }, function(data) {

      })
    }
    isLoadMore();
  }

  //删除参与人
  $scope.deletePepole = function (link, index){
    appFunc.confirm('确认删除所有参与人吗?', function(){
      Resource.get(link).then(function(data) {
        $scope.orderListModel.splice(index, 1);
        //appFunc.alert("删除成功");
        $ionicLoading.show({
          template: "删除成功",
          duration: 600
        });
      }, function(data) {

      }) 
    });
  }

  //提交审核
  $scope.reviewAct = function() { //后台暂未做单独的接口来提交审核，故用修改觅趣信息来更改审核状态  
    //编辑活动信息
    var model = data;
    var actData = {
      "actives_thrand": 0,  //线路ID 点为0
      "is_insurance": 1,    //保险1=确认0=取消
      "shops_info": '',     //觅趣对应点的信息====多点
      "Actives": {          //觅趣信息
        "actives_type": 0,  //0=旅游觅趣1=农产品觅趣
        "tour_type": 1,     //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0,        //觅趣数量
        "price": 0.00,      //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "",       //旅游觅趣备注
        "start_time": "",   //报名开始日期
        "end_time": "",     //报名截止时间
        "go_time": '',      //出游日期     没填传 空值
        "is_organizer": 1,  //是否组织者 1=是 0=不是
        "is_open": 1,       //是否开放显示 1=开放 0=不开放
        "pay_type": 0       //付款方式 0=AA付款 1=全额付款
      },
      "Shops": {
        "name": ""           //商品名称
      },
      "Pro": {               //选中项目  线路ID不为0时，可传空
      },
      "ProFare": {           //选中项目对应价格  线路ID不为0时，可传空
      }
    };
  
    actData.actives_thrand = model.thrand_id;
    actData.Actives.number = model.actives_info.number.value;
    actData.Actives.tour_price = model.actives_info.tour_price.value;
    actData.Actives.start_time = model.actives_time.start_time;
    actData.Actives.end_time = model.actives_time.end_time;
    actData.Actives.is_organizer = model.is_organizer.value;
    actData.Actives.is_open = model.actives_is_open.value;
    actData.Actives.pay_type = model.actives_pay_type.value;
    if(model.actives_time.go_time == "出游日期未定"){
      actData.Actives.go_time = "";
    } else {
      actData.Actives.go_time = model.actives_time.go_time;
    }
    actData.Actives.remark = remark;
    actData.Shops.name = model.name;

    var activeId = model.actives_id;

    Resource.editActInfo(activeId, actData).then(function(data){
      if(data.status == 1) {
        //appFunc.alert('觅趣提交审核成功');
        $ionicLoading.show({
          template: "觅趣提交审核成功",
          duration: 600
        });
        modify.ismodify = true;
        loadActDetail();
      }
    }, function(data){
      appFunc.alert(data.msg);
    })
  }

  //付款方式
  $scope.editPayType = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: '自费' }, //0
        { text: '代付' }  //1
      ],
      destructiveText: '取消',
      titleText: '选择付款方式',
      cssClass: 'tmm-action-sheet',
      destructiveButtonClicked: function() {
        return true;
      },
      buttonClicked: function(index) {
        var data = {
         "Actives": {
            "pay_type": index 
          }
        };
        Resource.editPayType(data, actId).then(function(data){
          //appFunc.alert("修改付款方式成功");
          $ionicLoading.show({
            template: "修改付款方式成功",
            duration: 600
          });
          $scope.model.actives_pay_type.value = index;
        }, function(data) {
          appFunc.alert(data.msg);
        })
        return true;
      }
    });
  };

  //修改活动公开性
  $scope.editActOpen = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: '私密' }, //0
        { text: '公开' }  //1
      ],
      destructiveText: '取消',
      titleText: '选择觅趣公开性',
      cssClass: 'tmm-action-sheet',
      destructiveButtonClicked: function() {
        return true;
      },
      buttonClicked: function(index) {
        var data = {
         "Actives": {
            "is_open": index 
          }
        };
        Resource.editActOpen(data, actId).then(function(data){
          //appFunc.alert("修改觅趣公开性成功");
          $ionicLoading.show({
            template: "修改觅趣公开性成功",
            duration: 600
          });
          $scope.model.actives_is_open.value = index;
        }, function(data) {
          appFunc.alert(data.msg);
        })
        return true;
      }
    });
  };

  //设置出游日期
  $scope.setActGoTime = function(){
    uiCalendar.show({
      selected: function(dates){
        var goTime = $filter('date')(dates[0],'yyyy-MM-dd');
        appFunc.confirm('出游日期确认为：' + goTime, function(){
          var data = {
            "Actives": {
              "go_time": goTime
            }
          };
          Resource.editActGotime(data, actId).then(function(data){
            //appFunc.alert("出游日期确认成功");
            $ionicLoading.show({
              template: "出游日期确认成功",
              duration: 600
            });
            $scope.model.actives_time.go_time = goTime;
            modify.ismodify = true;
          }, function(data) {
            appFunc.alert(data.msg);
          })
        });
      },
      minDate: new Date(Date.now()+1*24*60*60*1000),
      num: 1
    });
  };

  //更改报名日期
  $scope.editEnrolldate = function(){
    uiCalendar.show({
      selected: function(dates){
        var startTime = $filter('date')(dates[0],'yyyy-MM-dd');
        var endTime = $filter('date')(dates[1],'yyyy-MM-dd');
        appFunc.confirm('报名日期确认为：' + startTime + '至' + endTime, function(){
          var data = {
            "Actives": {
              "start_time": startTime, //报名开始时间
              "end_time": endTime, //报名截止时间
            }
          };
          Resource.editEnrolldate(data, actId).then(function(data){
            //appFunc.alert("修改报名日期成功");
            $ionicLoading.show({
              template: "修改报名日期成功",
              duration: 600
            });
            $scope.model.actives_time.start_time = startTime;
            $scope.model.actives_time.end_time = endTime;
          }, function(data) {
            appFunc.alert(data.msg);
          })
        });
      },
      minDate: new Date(),
      num: 2
    });
  };

  $scope.shareFriend = function() {
    appFunc.alert("请点击右上角分享邀请好友");
  }

   // 邀请好友参加
  function share() {
    setTimeout(function() {
      var desc = $scope.model.list_info ? $scope.model.list_info : '来自田觅觅的觅趣分享';
      var link = ENV.apiEndpoint + '/index.php?r=site/share&share=' + $scope.model.shops.value;

      device.share($scope.model.name ,link, $scope.model.image, desc);

    }, 500)
  };

  share();

})

.controller('MyActEditCtrl', function($scope, $stateParams, $ionicHistory, $ionicLoading, modify, Resource, appFunc) {
  
  $scope.name = $stateParams.actname;
  $scope.num = $stateParams.actnum;
  $scope.tourprice = $stateParams.tourprice;

  var actId = $stateParams.actid;
  $scope.model = {
    editactname: "",
    editactnum: "",
    edittourprice: ""
  };

  //编辑觅趣名称
  $scope.editName = function(){
    if ($scope.model.editactname == '') {
      appFunc.alert('觅趣名称不能为空');
      return;
    }
    var data = {
      "Shops": {
        "name": $scope.model.editactname //觅趣名称
      }
    };
    Resource.editActName(data, actId).then(function(data){
      //appFunc.alert("修改觅趣名称成功");
      $ionicLoading.show({
        template: "修改觅趣名称成功",
        duration: 600
      });
      modify.ismodify = true;
      modify.modifydate.actname = $scope.model.editactname;
      $ionicHistory.goBack();
    }, function(data) {
      appFunc.alert(data.msg);
    })
  }

  //编辑觅趣人数
  $scope.editNum = function(){
    if ($scope.model.editactnum == '') {
      appFunc.alert('觅趣参与人数不能为空');
      return;
    }
    var data = {
      "Actives": {
        "number": $scope.model.editactnum //觅趣人数
      }
    };
    Resource.editActNum(data, actId).then(function(data){
      //appFunc.alert("修改觅趣参与人数成功");
      $ionicLoading.show({
        template: "修改觅趣参与人数成功",
        duration: 600
      });
      modify.ismodify = true;
      modify.modifydate.actnum = $scope.model.editactnum;
      $ionicHistory.goBack();
    }, function(data) {
      appFunc.alert(data.msg);
    })
  }

  //编辑服务费
  $scope.editTourPrice = function(){
    if ($scope.model.edittourprice == '') {
      appFunc.alert('服务费不能为空');
      return;
    }
    var data = {
      "Actives": {
        "tour_price": $scope.model.edittourprice //觅趣人数
      }
    };
    Resource.editTourPrice(data, actId).then(function(data){
      //appFunc.alert("修改服务费成功");
      $ionicLoading.show({
        template: "修改服务费成功",
        duration: 600
      });
      modify.ismodify = true;
      modify.modifydate.tourprice = $scope.model.edittourprice;
      $ionicHistory.goBack();
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };



})


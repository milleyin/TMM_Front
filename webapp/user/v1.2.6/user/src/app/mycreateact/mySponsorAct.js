angular.module('mysponsoract', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.mysponsoract_1', {
      url: '/mysponsoract_1',
      templateUrl: 'app/mycreateact/templates/mysponsoract_1.html',
      controller: 'SponsorAct_1_Ctrl'
    })
    .state('tab.mysponsoract_2', {
      url: '/mysponsoract_2/:type/:actId/:actDetailLink',
      templateUrl: 'app/mycreateact/templates/mysponsoract_2.html',
      controller: 'SponsorAct_2_Ctrl'
    })
    .state('tab.mysponsoract_3', {
      url: '/mysponsoract_3',
      templateUrl: 'app/mycreateact/templates/mysponsoract_3.html',
      controller: 'SponsorAct_3_Ctrl'
    })
    .state('tab.mysponsoract_4', {
      url: '/mysponsoract_4',
      templateUrl: 'app/mycreateact/templates/mysponsoract_4.html',
      controller: 'SponsorAct_4_Ctrl'
    });
}])

.controller('SponsorAct_1_Ctrl', function($scope, $state, $filter, sponsorData, appFunc, uiCalendar) {
  var calendar = uiCalendar.show({
    contrainer: document.querySelector('.mysponsoract .calendar'),
    selected: function(data) {
      // sponsorData.go_time = $filter('date')(data[0], 'yyyy-MM-dd');
      sponsorData.go_time = data[0];
    },
    minDate: new Date(Date.now()+1*24*60*60*1000),
    num: 1
  });

  $scope.nextStep = function() {
    if (!sponsorData.go_time) {
      appFunc.tipMsg('请选择出游日期');
    } else {
      $state.go('tab.mysponsoract_2');
    }
  };

  $scope.skipStep = function() {
    sponsorData.go_time = "";
    calendar.clearDate();
    $state.go('tab.mysponsoract_2');
  };

})

.controller('SponsorAct_2_Ctrl', function($scope, $state, $ionicPopover, $stateParams, modify, appFunc, API, Resource, autoRefresh, modify, sponsorData) {
  var url = API.journey_index;

  $scope.isDistance = true;
  $scope.checkedItem = null;
  $scope.isReplaceStroke = $stateParams.type;
  $scope.selectType = '按人气';
  $scope.selectLeft = true;
  var actId = $stateParams.actId;
  var actLink = $stateParams.actDetailLink;

  getData();

  var template = '<ion-popover-view class="mysponsoract-popular"><div class="tit" ng-click="selectedPopuler(1)">按人气</div><div class="tit" ng-click="selectedPopuler(2)">按距离</div></ion-popover-view>';
  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  $scope.$on("$ionicView.enter", function() {
    if (modify.ismodify) {
      url = API.journey_index;
      autoRefresh.start('journey-content');
      modify.ismodify = false;
    }
  });

  function getData() {
    Resource.get(url).then(function(data) {
      $scope.model = data;
      $scope.model.nextPage = data.page.next;
      $scope.$broadcast('scroll.refreshComplete');
      $scope.noData = !$scope.model.list_data.length;
      sponsorData.id = null;
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // 右边选择按钮
  $scope.selectPopular = function(ev) {

    $scope.popover.show(ev);
  };
  $scope.selectedPopuler = function(type) {
    if (type == 1) {
      $scope.selectType = '按人气';
      url = API.journey_popular;
      autoRefresh.start('journey-content');
      $scope.isDistance = false;
    } else if (type == 2) {
      $scope.selectType = '按距离';
      url = API.journey_index;
      autoRefresh.start('journey-content');
      $scope.isDistance = true;
    }
    $scope.selectLeft = false;
    $scope.popover.hide();
  };

  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  };

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  // 选择行程
  $scope.selectItem = function(id) {
    sponsorData.id = id;
  };

  // 下一步
  $scope.nextStep = function() {
    if (!sponsorData.id) {
      appFunc.tipMsg("请选择行程");
      return;
    }

    $state.go('tab.mysponsoract_3');
  };

  $scope.changeLine = function(){
    if (!sponsorData.id) {
      appFunc.tipMsg("请选择行程");
      return;
    } else {
      var data = {
        "actives_thrand": sponsorData.id
      };
      Resource.changeLine(data, actId).then(function(data){
        appFunc.alert("修改觅趣线路成功");
        modify.ismodify = true;
        modify.modifydate.changeline = "changeline";
        $state.go("tab.mycreateactdetail", {
          'link' : actLink
        });
      }, function(data) {
         appFunc.alert(data.msg);
      })
    }
  }
  
})


.controller('SponsorAct_3_Ctrl', function($scope, $state, sponsorData) {
  if (!sponsorData.id) {
    $state.go('tab.my');
  }


  $scope.selectPayType = function(type) {
    sponsorData.pay_type = type;
    $state.go('tab.mysponsoract_4');

  };

})

.controller('SponsorAct_4_Ctrl', function($scope, $state, $filter, $ionicHistory, modify, appFunc, uiCalendar, Resource, sponsorData, security) {
  if (!sponsorData.id || sponsorData.pay_type === undefined) {
    $state.go('tab.my');
  }

  var start_time, end_time, go_time=sponsorData.go_time;

  $scope.model = {};

  security.getUserInfo().then(function(data) {
    $scope.model.userInfo = data.userInfo;
  });

  $scope.selectedDate = function() {
    uiCalendar.show({
      selected: function(dates) {
        if (sponsorData.go_time) {
          if (sponsorData.go_time.getTime() < dates[0].getTime()) {
            appFunc.tipMsg('报名开始日期必须小于出游日期');
            return;
          }
        }
        start_time = dates[0];
        end_time = dates[1];
        $scope.model.time = $filter('date')(start_time,'yyyy.MM.dd') + '-' + $filter('date')(end_time,'yyyy.MM.dd');
      },
      minDate: new Date(),
      num: 2
    });
  };

  $scope.submit = function() {
    if (!checkform()) return;
    var token = {
      "actives_thrand": sponsorData.id, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "shops_info": '', //觅趣对应点的信息====多点
      "Actives": { //觅趣信息
        "actives_type": 0, //0=旅游觅趣1=农产品觅趣
        "tour_type": 1, //-1=农产品觅趣,0=多个点,1=一条线
        "number": $scope.model.number, //觅趣数量
        "price": 0.00, //觅趣单价(农产品传值)
        "tour_price": $scope.model.tour_price, //服务费
        "remark": $scope.model.remark, //旅游觅趣备注
        "start_time": $filter('date')(start_time,'yyyy-MM-dd'), //报名开始日期
        "end_time": $filter('date')(end_time,'yyyy-MM-dd'), //报名截止时间
        "go_time": go_time ? $filter('date')(go_time,'yyyy-MM-dd') : "", //出游日期     没填传 空值
        "is_organizer": $scope.model.userInfo.is_organizer, //是否组织者 1=是 0=不是
        "is_open": Number(!$scope.model.is_close), //是否开放显示 1=开放 0=不开放
        "pay_type": sponsorData.pay_type //付款方式 0=AA付款 1=全额付款
      },
      "Shops": {
        "name": $scope.model.name //商品名称
      },
      "Pro": { //选中项目  线路ID不为0时，可传空
      },
      "ProFare": { //选中项目对应价格  线路ID不为0时，可传空
      }
    };


    Resource.createAct(token).then(function(data){
      appFunc.alert('创建成功！').then(function() {
        $ionicHistory.goBack(-4);
        modify.ismodify = true;
        
      })
    }, function(data){
      appFunc.tipMsg(data.msg, 1500);
    });
  };

  function checkform() {

    if (!$scope.model.name) {
      appFunc.tipMsg("觅趣名称不能为空");
      return false;
    }

    if (!(end_time && start_time)) {
      appFunc.tipMsg("请选择觅趣开始和结束时间");
      return false;
    }

    if (!$scope.model.number) {
      appFunc.tipMsg("觅趣参与人数不能为空");
      return false;
    }

    if ($scope.model.userInfo.is_organizer && $scope.model.userInfo.organizer.status !== '0') {
      if (!$scope.model.tour_price) {
        appFunc.tipMsg("服务费不能为空");
        return false;
      }
    } else {
      $scope.model.tour_price = '0.00';
    }

    return true;
  }

})


.factory('sponsorData', function() {
  return {};
})

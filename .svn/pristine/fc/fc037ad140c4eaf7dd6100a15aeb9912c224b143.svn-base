angular.module('shop', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.shop1', { // 点
      url: '/recommend/1/:link/:type',

      templateUrl: 'app/shops/shop-dot-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if (!$ionicHistory.backView()) {
            $ionicLoading.show({
              template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })

    .state('tab.shop2', { // 线
      url: '/recommend/2/:link/:type',

      templateUrl: 'app/shops/shop-line-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if (!$ionicHistory.backView()) {
            $ionicLoading.show({
              template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })

    .state('tab.shop3', { // 活动
      url: '/recommend/3/:link/:type',

      templateUrl: 'app/shops/shop-act-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if (!$ionicHistory.backView()) {
            $ionicLoading.show({
              template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })

    .state('tab.book-info', { // 点和线的预订须知
      url: '/recommend/:type/:id',

      templateUrl: 'app/shops/shop-book-info.html',
      controller: 'BookInfoCtrl',
    })

    .state('tab.more-detail1', { //吃
      url: '/recommend/:link',

      templateUrl: 'app/shops/shop-eat-detail.html',
      controller: 'MoreDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    })

    .state('tab.more-detail3', { //玩
      url: '/recommend/:link',

      templateUrl: 'app/shops/shop-eat-detail.html',
      controller: 'MoreDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    })

    .state('tab.more-detail2', { //住
      url: '/recommend/:link',

      templateUrl: 'app/shops/shop-live-detail.html',
      controller: 'MoreDetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ios-small" class="resolve-loading"></ion-spinner> <span style="line-height:100%;">数据加载中...</span>',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    })

}])

.controller('DetailCtrl', function($scope, $ionicActionSheet, $ionicScrollDelegate, $ionicPopup, $ionicLoading, $location, $stateParams, data, Resource) {
  $scope.shopModel = {
    'url': '',
    'shopObj': {},
    praise_status: '',
    shop_praise: '',
    free: '',
    noFree: '',
    key: ''
  };

  var oImage = document.getElementById('fleximage')

  $scope.getScrollPosition = function() {
    if ($ionicScrollDelegate.getScrollPosition().top <= 0) {
      oImage.style.top = $ionicScrollDelegate.getScrollPosition().top + 'px';
    }
  }
  $scope.shopModel.shopObj = data;

  //获取点赞的状态跟赞数
  if($scope.shopModel.shopObj.collent_status == 1){
    $scope.shopModel.praise_status = 1;
  } else {
    $scope.shopModel.praise_status = 0;
  }
  $scope.shopModel.shop_praise = $scope.shopModel.shopObj.praise;

  //判断点
  var separateFramDate = function(data) {
    var info = {
      itemList: [],
      farmList: []
    };

    for (var i = 0, length = data.length; i < length; i++) {
      if (data[i].item_type.value == -1) {
        info.farmList.push(data[i]);
      } else {
        info.itemList.push(data[i]);
      }
    }

    return info;
  };

  var countItemIsFree = function(arr) {
    for (var i = 0, length = arr.length; i < length; i++) {
      if (arr[i].free_status.value == 1)
        return false;
    }
    return true;
  };

  //判断线
  var fetchItemList = function(data) {
    var arr = [];
    for (var i in data) {
      for (var j in data[i]['dot_list'][0]['day_item']) {
        arr.push(data[i]['dot_list'][0]['day_item'][j]);
      }
    }
    return arr;
  };

  //判断景点是否免费
  var type = $stateParams.type;
  if(type == 1){ //点
    $scope.shopModel.free = countItemIsFree((separateFramDate(data.list)).itemList);   
    $scope.shopModel.noFree = !($scope.shopModel.free);
  } else if(type == 2){ //线
    $scope.shopModel.free = countItemIsFree(fetchItemList(data.list));
    $scope.shopModel.noFree = !($scope.shopModel.free);
  }  

  //点详情---》点赞
  $scope.dotPraise = function(){

    var type = $stateParams.type;

    var id = 0;
    if(type == 1){ //点
      id = $scope.shopModel.shopObj.dot_id;
    } else if(type == 2){ //线
      id = $scope.shopModel.shopObj.thrand_id;
    } else if(type == 3){ //活动
      id = $scope.shopModel.shopObj.actives_id;
    }

    Resource.postPraise(id).then(function(dataRes) {
      if(dataRes.status == 1){
        if(dataRes.data.value == 1){
          $ionicLoading.show({
            template: "点赞成功",
            duration: 1000
          });
          $scope.shopModel.praise_status = 1; 
          $scope.shopModel.shop_praise = parseInt($scope.shopModel.shop_praise) + 1;     
        } else { //取消点赞
          $ionicLoading.show({
            template: "取消赞成功",
            duration: 1000
          });
          $scope.shopModel.praise_status = 0;
          $scope.shopModel.shop_praise = parseInt($scope.shopModel.shop_praise) - 1;
        }
      } else {
        $ionicLoading.show({
          template: "请先登录",
          duration: 1000
        });
        setTimeout(function() {
          $ionicLoading.hide();
          //$location.path('/tab/login');
        }, 1000);
      }  
    })
  };

  //拨打电话弹出层
  $scope.dotCall = function(type){
    // Show the action sheet
    var textType = (type == 'act') ? '联系代理商' : '联系运营商';
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: textType},
        { text: '联系田觅觅客服' }
      ],
      cssClass: 'tmm-call-button-color',
      destructiveText: '取消',
      destructiveButtonClicked : function() {
        return true;
      },
      buttonClicked: function(index) {
        if(index == 0){
          //联系运营商
          $scope.tmmCall(($scope.shopModel.shopObj.manage_phone).replace(/-/g, ""));
        }
        if(index == 1){
          //联系田觅觅客服
          $scope.tmmCall(($scope.shopModel.shopObj.tmm_phone).replace(/-/g, ""));
        }
       return true;
      }
   });
  };

  //拨打电话确认框
  $scope.tmmCall = function(callNum){
    var confirmPopup = $ionicPopup.confirm({
      template: '请拨打电话 ' + callNum,
      cssClass: 'tmm-call-popup',
      
      buttons: [{
        text: '取消',
        type: 'button-default',
      }, {
        text: '拨打电话',
        type: 'button-default',
        onTap: function(e) {
          var isIPad = ionic.Platform.isIPad();
          var isIOS = ionic.Platform.isIOS();
          var isAndroid = ionic.Platform.isAndroid();
          try {
            if (isIPad || isIOS) { //ios
              connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                  "phone": callNum
                }, function(response) {})
              });
            } else if (isAndroid) { //Android
              window.jsObj.callPhone(callNum);
            }
          } catch (e) {

          }
        }
      }]

    });
  }
})

//点和线的预订须知
.controller('BookInfoCtrl', function($scope, $stateParams, $sce, Resource) {
  var type = $stateParams.type;
  var id = $stateParams.id;

  Resource.getBookInfo(type, id).then(function(data) {
    $scope.bookInfo =  $sce.trustAsHtml(data.book_info);
    $scope.costInfo =  $sce.trustAsHtml(data.cost_info); 
  }, function(data) {

  })
  
  Resource.getBookInfo(type, id);
})

//吃，住，玩的详情页
.controller('MoreDetailCtrl', function($scope, $stateParams, $sce, $ionicPopover, $ionicPopup, data, Resource) {
  $scope.info = data;
  $scope.contentHTML = $sce.trustAsHtml(data.content);

  //浮动框
  $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  });

  // .fromTemplateUrl() 方法
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  // 清除浮动框
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  //拨打电话确认框
  $scope.detailCall = function(){
    var callNum = $scope.info.phone;
    var confirmPopup = $ionicPopup.confirm({
      template: '请拨打电话 ' + callNum,
      cssClass: 'tmm-call-popup',
      
      buttons: [{
        text: '取消',
        type: 'button-default',
      }, {
        text: '拨打电话',
        type: 'button-default',
        onTap: function(e) {
          var isIPad = ionic.Platform.isIPad();
          var isIOS = ionic.Platform.isIOS();
          var isAndroid = ionic.Platform.isAndroid();
          try {
            if (isIPad || isIOS) { //ios
              connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                  "phone": callNum
                }, function(response) {})
              });
            } else if (isAndroid) { //Android
              window.jsObj.callPhone(callNum);
            }
          } catch (e) {

          }
        }
      }]

    });
  }

  $scope.linePraise = function() {
    
  }

  $scope.model = data;

})

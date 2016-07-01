'use strict';
/**
 * @ngdoc module
 * @name Recommend
 * @description 推荐相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:12:58+0800
 */
angular.module('tmm.controllers')

/**
 * @ngdoc Controller
 * @name RecommendCtrl
 * @description 推荐控制器
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:13:54+0800
 */
.controller('RecommendCtrl', function(
  $scope,
  $rootScope,
  $state,
  $ionicLoading,
  log,
  Tabs,
  getRecommendList,
  getShopDetail,
  tmmCache,
  PtrService) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // 进入页面之前, 设置导航栏状态为显示，并通知MainCtrl更新导航栏状态
    Tabs.setState(false);
    $rootScope.$broadcast('updateState');
  });
  // 触发下拉刷新
  $scope.$on("$ionicView.loaded", function() {
    PtrService.triggerPtr('ptr-content');
  });
  // 下一页的链接
  var nextLink = '';
  $scope.recommendModel = {
    'pullingText': '松开刷新',
    'recommendList': []
  };
  // 达到松开高度时触发
  $scope.doPulling = function() {
    $scope.recommendModel.pullingText = '松开刷新';
  };
  // 下拉刷新列表
  $scope.doRefresh = function() {
    // 获取推荐列表
    getRecommendList(
      '',
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $scope.recommendModel.recommendList = dataRes.data.list_data;
          nextLink = dataRes.data.page.next;
        } else {
          // 网络超时，请重试...
        }
        $scope.$broadcast('scroll.refreshComplete');
      },
      function(dataRes, statusCode) {
        // 网络超时，请重试...
        $scope.$broadcast('scroll.refreshComplete');
      }
    );

  };
  // 加载更多
  $scope.loadMore = function() {
    if (nextLink) {
      getRecommendList(
        nextLink,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $scope.recommendModel.recommendList = $scope.recommendModel.recommendList.concat(dataRes.data.list_data);
            nextLink = dataRes.data.page.next;
          } else {
            // 网络超时，请重试...
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
        },
        function(dataRes, statusCode) {
          // 网络超时，请重试...
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      );
    }
  };
  // 是否还没更多数据
  $scope.hasMoreData = function() {
    if (nextLink) {
      return true;
    }
    return false;
  };
  // 显示商品详情页
  $scope.showView = function(type, url) {   
    getShopDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          $ionicLoading.show({
            template: "正在载入数据，请稍后..."
          });
          var page = {
            1: 'tab.dot-detail',
            2: 'tab.line-detail',
            3: 'tab.act-detail'
          };
          tmmCache.set('shopDetail', dataRes.data);
          setTimeout(function() {
            $ionicLoading.hide();
            $state.go(page[type], {
              'link': url,
              'type': type
            });
          }, 1000);
        } else {
          $ionicLoading.show({
            template: "该景点未开放，请稍候再试",
            duration: 2000
          });
        }
      },
      function(dataRes, statusCode) {
        $ionicLoading.hide();
      }
    );
  };

})

/**
 * @ngdoc Controller
 * @name DotDetailCtrl
 * @description 点详情控制器
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:16:27+0800
 */
.controller('DotDetailCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $location,
  $ionicLoading,
  $ionicActionSheet,
  $ionicPopup,
  $log,
  log,
  Tabs,
  getShopDetail,
  shopCollect,
  getBookInfo,
  tmmCache) {

  $scope.shopModel = {
    'url': '',
    'shopObj': {},
    praise_status: '',
    shop_praise: '',
    free: '',
    noFree: ''
  };
  // 取到详情的链接
  $scope.shopModel.url = $stateParams.link;
  getShopDetail(
    $scope.shopModel.url,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        $scope.shopModel.shopObj = dataRes.data;

        //判断景点是否免费
        var type = $stateParams.type;
        if(type == 1){ //点
          $scope.shopModel.free = $scope.countItemIsFree(($scope.separateFramDate(dataRes.data.list)).itemList);   
          $scope.shopModel.noFree = !($scope.shopModel.free);
        } else if(type == 2){ //线
          $scope.shopModel.free = $scope.countItemIsFree($scope.fetchItemList(dataRes.data.list));
          $scope.shopModel.noFree = !($scope.shopModel.free);
        }  

        //获取点赞的状态跟赞数
        if($scope.shopModel.shopObj.collent_status == 1){
          $scope.shopModel.praise_status = 1;
        } else {
          $scope.shopModel.praise_status = 0;
        }
        $scope.shopModel.shop_praise = $scope.shopModel.shopObj.praise;
      }
    }
  );
  
  $scope.separateFramDate = function(data) {
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

  $scope.countItemIsFree = function(arr) {
    for (var i = 0, length = arr.length; i < length; i++) {
      if (arr[i].free_status.value == 1)
        return false;
    }
    return true;
  };

  $scope.fetchItemList = function(data) {
    var arr = [];
    for (var i in data) {
      for (var j in data[i]['dot_list'][0]['day_item']) {
        arr.push(data[i]['dot_list'][0]['day_item'][j]);
      }
    }
    return arr;
  },

  log.info('shopDetail...', $scope.shopModel.shopObj);
  log.info('$state...', $stateParams);

  
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

    shopCollect(
      {
        "Collect": {
          "shops_id": id,
          "user_address": ""
        }
      },
      function(dataRes, statusCode) { //点赞
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
            $location.path('/tab/login');
          }, 1000);  
        }
      },
      function(dataRes, statusCode) {
        $ionicLoading.hide();
      }
    );
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
  };

  // 显示点，线的预订须知
  $scope.showBookInfo = function(type, id) {
    $ionicLoading.show({
      template: "正在载入数据，请稍后..."
    });
    var url ="";
    if(type == "1"){
      url = "/index.php?r=api/dot/view&id=";
    } else if(type == "2"){
      url = "/index.php?r=api/thrand/view&id=";
    }
    getBookInfo(
      url,
      id,
      function(dataRes, statusCode) { 
        if (dataRes.status == 1) {
          $state.go('tab.book-info', {
            'type': type,
            'id': id
          });
        }
        $ionicLoading.hide();
      },
      function(dataRes, statusCode) {
        $ionicLoading.hide();
      }
    );
  };

  /**
   * 加载吃，住，玩更多详情
   * @param  {[type]} link [description]
   * @param  {[type]} type [description]
   * @param  {[type]} id   [description]
   * @return {[type]}      [description]
   */
  $scope.showMore = function(link,type,id) {
    if(type == 2) { //住
      $state.go('tab.live-detail', {
        'link': link
      });
    } else if(type == -1) { //觅鲜

    } else {  //吃，玩
      $state.go('tab.eat-detail', {
        'link': link
      });
    } 
  }
  
})

/**
 * @ngdoc Controller
 * @name EatDetailCtrl
 * @description 吃，玩详情
 */
.controller('EatDetailCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $location,
  $sce,
  $ionicLoading,
  $ionicPopup,
  $ionicPopover,
  $log,
  Tabs,
  getItemDetail,
  tmmCache) {
  $scope.showMap = false;
  var eatDetailLink = $stateParams.link;
  getItemDetail(
    eatDetailLink,
    function(dataRes, statusCode) { 
      if (dataRes.status == 1) {
        $scope.info = dataRes.data;
        $scope.contentHTML = $sce.trustAsHtml(dataRes.data.content);
      }
    },
    function(dataRes, statusCode) {

    }
  );

  $scope.showAddress = function(address) {
    $scope.showMap = true;
  }

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
  // 在隐藏浮动框后执行
  $scope.$on('popover.hidden', function() {

  });
  // 移除浮动框后执行
  $scope.$on('popover.removed', function() {

  });

//浮动框

})

/**
 * @ngdoc Controller
 * @name DotBookInfoCtrl
 * @description 点的预订须知
 */
.controller('BookInfoCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $location,
  $sce,
  $ionicLoading,
  $ionicPopup,
  log,
  Tabs,
  getBookInfo,
  tmmCache) {
    var type = $stateParams.type;
    var id = $stateParams.id;
    var url ="";
    if(type == "1"){
      url = "/index.php?r=api/dot/view&id=";
    } else if(type == "2"){
      url = "/index.php?r=api/thrand/view&id=";
    }
    getBookInfo(
      url,
      id,
      function(dataRes, statusCode) { 
        if (dataRes.status == 1) {
          $scope.bookInfo =  $sce.trustAsHtml(dataRes.data.book_info);
          $scope.costInfo =  $sce.trustAsHtml(dataRes.data.cost_info); 
        }
      },
      function(dataRes, statusCode) {

      }
    );
  
})

/**
 * @ngdoc Controller
 * @name DotDetailCtrl
 * @description 线详情控制器
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:16:27+0800
 */
.controller('LineDetailCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $location,
  $ionicLoading,
  $ionicPopup,
  log,
  Tabs,
  getShopDetail,
  tmmCache) {
  // before enter view event
  // $scope.$on('$ionicView.beforeEnter', function() {
  //   // 进入页面之前, 设置导航栏状态为隐藏，并通知MainCtrl更新导航栏状态
  //   Tabs.setState(true);
  //   $rootScope.$broadcast('updateState');
  // });

  $scope.lineModel = {
    'url': '',
    'lineObj': {}
  };
  // 取到详情的链接
  $scope.lineModel.url = $stateParams.link;
  // 获取线的详情
  $scope.lineModel.lineObj = tmmCache.get('shopDetail');
})

/**
 * @ngdoc Controller
 * @name ActDetailCtrl
 * @description 活动详情控制器
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:16:27+0800
 */
.controller('ActDetailCtrl', function(
  $scope,
  $rootScope,
  $state,
  $stateParams,
  $location,
  $ionicActionSheet,
  $ionicLoading,
  log,
  Tabs,
  getShopDetail,
  tmmCache) {

  // before enter view event
  // $scope.$on('$ionicView.beforeEnter', function() {
  //   // 进入页面之前, 设置导航栏状态为隐藏，并通知MainCtrl更新导航栏状态
  //   Tabs.setState(true);
  //   $rootScope.$broadcast('updateState');
  // });

  $scope.actModel = {
    'url': '',
    'actObj': {}
  };
  // 取到详情的链接
  $scope.actModel.url = $stateParams.link;
  // 获取活动的详情
  $scope.actModel.actObj = tmmCache.get('shopDetail');
});

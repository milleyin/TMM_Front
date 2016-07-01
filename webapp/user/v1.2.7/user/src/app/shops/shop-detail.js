angular.module('shop', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.shop1', { // 点
      url: '/recommend/1/:link/:type/:hasSub',

      templateUrl: 'app/shops/templates/shop-dot-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.shop1') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })

  .state('tab.shop2', { // 线
    url: '/recommend/2/:link/:type/:hasSub',

    templateUrl: 'app/shops/templates/shop-line-detail.html',
    controller: 'DetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.shop2') {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    }
  })

  .state('tab.shop3', { // 活动
    url: '/recommend/3/:link/:type/:hasSub',

    templateUrl: 'app/shops/templates/shop-act-detail.html',
    controller: 'DetailCtrl',
    resolve: {
      data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
        if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.shop3') {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.get($stateParams.link);
        }
      }
    }
  })

  .state('tab.book-info', { // 点和线的预订须知
    url: '/recommend/:type/:id',

    templateUrl: 'app/shops/templates/shop-book-info.html',
    controller: 'BookInfoCtrl',
  })

  .state('tab.farm-list', { // 点和线的预订须知
    url: '/farmList/:link',
    templateUrl: 'app/shops/templates/farm-list.html',
    controller: 'FarmListCtrl',
  })

  // 分享备用连接
  .state('tab.share-shop1', { // 点
      url: '/tuijiandetail_0/:id',
      templateUrl: 'app/shops/templates/shop-dot-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, ENV) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.share-shop1') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get(ENV.apiEndpoint + '/index.php?r=api/dot/view&id=' + $stateParams.id);
          }
        }
      }
    })
    .state('tab.share-shop2', { // 线
      url: '/tuijiandetail_1/:id',
      templateUrl: 'app/shops/templates/shop-line-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, ENV) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.share-shop2') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get(ENV.apiEndpoint + '/index.php?r=api/thrand/view&id=' + $stateParams.id);
          }
        }
      }
    })
    .state('tab.share-shop3', { // 活动
      url: '/tuijiandetail_2/:id',
      templateUrl: 'app/shops/templates/shop-act-detail.html',
      controller: 'DetailCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory, ENV) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.share-shop3') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get(ENV.apiEndpoint + '/index.php?r=api/actives/view&id=' + $stateParams.id);
          }
        }
      }
    });;



}])

.controller('DetailCtrl', function($scope, $sce, $stateParams, appFunc, data, bookInfo, farmList, device, ENV) {
  var id;
  var hasSub = $stateParams.hasSub;
  $scope.hasSub = !hasSub;
  $scope.model = data;

  if ($scope.model.c_id === '1') {
    id = $scope.model.dot_id;
  } else if ($scope.model.c_id === '2') {
    id = $scope.model.thrand_id;
  } else if ($scope.model.c_id === '3') {
    id = $scope.model.actives_id;
  }

  $scope.link = $stateParams.link;
  if ($scope.model.c_id == 3 || $scope.model.c_id == 2) {
    $scope.model.list = appFunc.mergeLineDay($scope.model.list);
  }

  // 农产品分离
  if ($scope.model.c_id == 1) {
    var List = separateFarmDate($scope.model.list);
    $scope.model.list = List.itemList;
    farmList.list = $scope.model.exterior_link_arr;
  }

  bookInfo.bookInfo = data.book_info;
  bookInfo.costInfo = data.cost_info;
  if ($scope.model.actives_info) {
    $scope.active_intro = $sce.trustAsHtml($scope.model.actives_info.remark);
  }

  function separateFarmDate(data) {
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
  }

  var shareUrl = ENV.apiEndpoint + '/index.php?r=site/share&share=' + id;
  $scope.doShare = function() {
    device.shareMsg($scope.model.name, $scope.model.page_info, $scope.model.share_image, shareUrl);
  };

  if (ENV.device === 'weixin') {

    function share() {
      setTimeout(function() {
        device.share($scope.model.name, shareUrl, $scope.model.share_image, $scope.model.page_info);
      }, 250);
    }
    share();

  }

})

// 点的农产品列表
.controller('FarmListCtrl', function($scope, $state, $stateParams, ENV, device, Resource, farmList) {
  if (farmList.list) {
    $scope.model = farmList.list;

  } else {
    Resource.get($stateParams.link).then(function(data) {
      $scope.model = data.exterior_link_arr;
    });
  }

  $scope.goFresh = function(title, description, thumb_url, webpageUrl) {
    if (ENV.device === 'app') {
      device.goSeekFreshDetail2(title, description, thumb_url, webpageUrl);
    } else {
      $state.go("tab.fresh-item", { link: webpageUrl, name: title });
    }
  }
})

//点和线的预订须知
.controller('BookInfoCtrl', function($scope, $sce, $state, bookInfo) {

  if (bookInfo.bookInfo === undefined) {
    $state.go('tab.recommend');
  }
  $scope.bookInfo = $sce.trustAsHtml(bookInfo.bookInfo);
  $scope.costInfo = $sce.trustAsHtml(bookInfo.costInfo);
})

.factory('bookInfo', function() {
    return {};
  })
  .factory('farmList', function() {
    return {};
  })


.directive('shopBanner', function($window, Resource, $ionicLoading, $ionicActionSheet, $ionicPopup, appFunc, ENV, modify, device) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/shops/templates/shop-banner.tpl.html',
    link: function(scope, element, attr) {
      element.css({
        height: $window.innerWidth * 2 / 3 + 'px',
        overflow: 'hidden',
        position: 'relative'
      }).find('img').css({
        display: 'block',
        width: '100%',
        height: '100%'
      });

      // 判断是否为微信设备
      if ('weixin' === ENV.device) {
        scope.isWeixin = true;
      }

      var model = scope.model;
      var id = model.c_id == '1' ? model.dot_id : model.c_id == '2' ? model.thrand_id : model.c_id == '3' ? model.actives_id : 0;

      /**
       * 点赞
       * @return {[type]} [description]
       */
      scope.doPraise = function() {

        Resource.postPraise(id).then(function(dataRes) {
          if (dataRes.value == 1) {
            $ionicLoading.show({
              template: "点赞成功",
              duration: 600
            });
            model.collent_status = 1;
            model.praise = parseInt(model.praise) + 1;
          } else { //取消点赞
            $ionicLoading.show({
              template: "取消赞成功",
              duration: 600
            });
            model.collent_status = 0;
            model.praise = parseInt(model.praise) - 1;
            modify.ismodify = true;
          }
        });
      };

      /**
       * 拨打电话
       * @return {[type]} [description]
       */
      scope.doCall = function() {
        var textType = (model.c_id == '3') ? '联系代理商' : '联系运营商';
        var hideSheet = $ionicActionSheet.show({
          /*buttons: [
            { text: '<a href="tel:' + model.manage_phone + '">' + textType + '</a>' },
            { text: '<a href="tel:' + model.tmm_phone + '">联系田觅觅客服</a>' }
          ],*/
          buttons: [
            { text: textType },
            { text: '联系田觅觅客服' }
          ],
          destructiveText: '取消',
          cssClass: 'tmm-action-sheet',
          destructiveButtonClicked: function() {
            return true;
          },
          buttonClicked: function(index) {
            if (index === 0) {
              //联系运营商
              device.tmmWxCallPhone(model.manage_phone);
            }
            if (index === 1) {
              //联系田觅觅客服
              device.tmmWxCallPhone(model.tmm_phone);
            }
            return true;
          }
        });
      };

    }
  };
})


.directive('shopIndicator', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    template: '',
    link: function(scope, element, attrs) {
      var type = attrs.type;

      var template = '';

      if (scope.hasSub) {


        // 活动判断条件
        if ('act' == type) {
          template = createActTpl();

        } else if ('line' == type) {

          template = createLineTpl();
        } else if ('dot' == type) {
          template = createDotTpl();
        }
        var ele = $compile(template)(scope);

        element.append(ele);
      }



      // 创建活动模版
      function createActTpl() {
        var template;
        if (scope.model.is_sale.value == 1) { //  审核可卖的状态 
          if (scope.model.actives_status.value == 0) { // 报名时间未开始
            template = '<div class="tmm-detail-btn gray-btn">报名时间还未开始</div>';

          } else if (scope.model.actives_status.value == 1) { // 正在报名中
            if (scope.model.actives_info.order_number.value == 0) { // 报名人数已满
              template = '<div class="tmm-detail-btn gray-btn">报名人数已满</div>';
            } else { // 报名人数未满
              if (scope.model.actives_pay_type.value == 1) { // A 支付，代付
                template = '<div ui-sref="tab.order-actA({id: model.actives_id})" class="tmm-detail-btn act-btn">{{model.actives_time.value == 1 ? "我也想去" : "我也要报名"}}</div>';
              } else { // AA支付
                if (scope.model.order_actives.value == -1) { // 未报名
                  template = '<div ui-sref="tab.order-act({id: model.actives_id})" class="tmm-detail-btn act-btn">{{model.actives_time.value == 1 ? "我也想去" : "我也要报名"}}</div>';
                } else { // 已报名
                  template = '<div class="tmm-detail-btn gray-btn">已报名</div>';
                }
              }
            }
          } else if (scope.model.actives_status.value == 2) { // 报名结束
            template = '<div class="tmm-detail-btn gray-btn">报名结束</div>';
          }
        } else { // 不能下单 
          template = '<div class="tmm-detail-btn gray-btn">此点正在开发中，敬请期待</div>';
        }
        return template;
      }
      // 创建线的模版
      function createLineTpl() {
        var template;
        if (scope.model.is_sale.value == 1) {
          if (isFree(fetchItemList(scope.model.list))) {
            template = '<div class="tmm-detail-btn gray-btn">线路免费</div>';
          } else {
            template = '<div ui-sref="tab.order-line({id: model.thrand_id})" class="tmm-detail-btn line-btn">我也想去</div>';
          }
        } else {
          template = '<div class="tmm-detail-btn gray-btn">此点正在开发中，敬请期待</div>';
        }
        return template;
      }

      // 创建点的模版
      function createDotTpl() {
        var template;
        if (scope.model.is_sale.value == 1) {
          if (isFree(scope.model.list)) {
            template = '<div class="tmm-detail-btn gray-btn">景点免费</div>';
          } else {
            template = '<div ui-sref="tab.order-dot({id: model.dot_id})" class="tmm-detail-btn dot-btn">我也想去</div>';
          }
        } else {
          template = '<div class="tmm-detail-btn gray-btn">此点正在开发中，敬请期待</div>';
        }
        return template;
      }

      // 计算项目列表是否免费
      function isFree(arr) {
        for (var i = 0, length = arr.length; i < length; i++) {
          if (arr[i].free_status.value == 1)
            return false;
        }
        return true;
      }

      // 提取线与觅趣的项目
      function fetchItemList(data) {
        var arr = [];
        for (var i in data) {
          for (var j in data[i]['dot_list'][0]['day_item']) {
            arr.push(data[i]['dot_list'][0]['day_item'][j]);
          }
        }
        return arr;
      }
    }

  }

})

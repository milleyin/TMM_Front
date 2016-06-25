/**
 * @method joinAct
 * @description  活动报名相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-06T15:41:43+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  joinActList_tpl = require('./join-act-list.tpl.html'),
  joinActListCard_tpl = require('./join-act-list-card.tpl.html'),
  orderDetail = require('./orderDetail'),
  orderModule = require('./order'),
  roleModule = require('../role/role');
/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 选择标签页的url
 * @type {String}
 */
var selectUrl = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;
var moreLoading = false;

var joinAct = {
  init: function() {
    joinAct.bindEvent();
  },

  /**
   * 显示活动列表页面
   * @return {[type]} [description]
   */
  loadJoinActList: function() {
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.redirectToLogin();
      return;
    }
    tmmApp.showIndicator();

    httpService.getOrderActList('', function(dataRes) {


      if (dataRes.status == 1) {
        appFunc.hideToolbar();
        var data = dataRes.data;
        var output = appFunc.renderTpl(joinActList_tpl, data)
        tmmApp.getCurrentView().router.load({
          content: output
        });
        joinAct.init();
      } else {
        tmmApp.hideIndicator();
        if ('login' in dataRes.data) {
          roleModule.redirectToLogin();
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }

      tmmApp.hideIndicator();
    }, function(dataRes) {
      tmmApp.hideIndicator();
      tmmApp.alert('网络超时，请重试');
    })
  },

  refreshList: function() {
    httpService.getOrderActList('',
      function(dataRes) {

        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 刷新处理
        var output = appFunc.renderTpl(joinActListCard_tpl, dataRes.data);
        $$('#join-act-list .tmm-order-card-list').html(output);

        setTimeout(function() {
          tmmApp.pullToRefreshDone();

        }, 200);
      },
      function(dataRes) {
        tmmApp.alert('网络超时，请重试');
        tmmApp.pullToRefreshDone();
      }
    );
  },


  infiniteList: function() {
    if (nextPageLink) {
      if (loading) return;
      loading = true;
      tmmApp.showIndicator();

      httpService.getOrderActivesList(
        nextPageLink,
        function(dataRes, statusCode) {
          nextPageLink = dataRes.data.page.next;

          var output = appFunc.renderTpl(joinActListCard_tpl, dataRes.data);
          $$('#join-act-list .tmm-order-card-list').append(output);

          setTimeout(function() {
            tmmApp.hideIndicator();
            loading = false;
          }, 100);

        },
        function(dataRes, statusCode) {
          tmmApp.hideIndicator();
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;

      setTimeout(function() {
        tmmApp.hideIndicator();
        moreLoading = false;
        $$("#join-act-list #no-more").css('display', 'block');
        $$("#join-act-list #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      setTimeout(function() {
        $$("#join-act-list #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);
    }
  },

  /**
   * @method orderCancle
   * @description 订单取消
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T19:01:40+0800
   */
  orderCancle: function() {
    var _this = this;
    var order_id = $$(_this).attr('data-id');
    tmmApp.confirm('确定取消吗?', '', function() {
      httpService.orderCancle(
        order_id,
        function(dataRes, status) {
          if (dataRes.status == 1) {
            tmmApp.alert('已成功取消', '', function() {
              joinAct.refreshList();
            });
          } else {
            tmmApp.alert('取消失败，请重试');
          }

        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
        }
      );
    });

  },

  /**
   * @method orderRefund
   * @description 退款
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T19:01:40+0800
   */
  orderRefund: function() {
    appFunc.orderRefund()
  },

  /**
   * 确认出游
   * @return {[type]} [description]
   */
  orderConfirm: function() {
    var order_id = $$(this).attr('data-id');

    tmmApp.confirm('确认出游吗', '', function() {
      httpService.tourConfirm(
        order_id,
        function(dataRes, status) {
          if (dataRes.status == 1) {
            tmmApp.alert('确认出游成功', '', function() {
              joinAct.refreshList();
            });
          } else {
            tmmApp.alert('确认出游成功失败');
          }

        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
        }
      );
    })
  },

  bindEvent: function() {
    var bindings = [{
        element: '#myView',
        selector: '#join-act-list .pull-to-refresh-content',
        event: 'refresh',
        handler: joinAct.refreshList
      }, {
        element: '#myView',
        selector: '#join-act-list .pull-to-refresh-content',
        event: 'infinite',
        handler: joinAct.infiniteList
      }, {
        element: '#myView',
        selector: '#join-act-list .tmm-my-order-detail-show',
        event: 'click',
        handler: orderDetail.loadView
      },
      // 取消出游
      {
        element: '#myView',
        selector: '#join-act-list .tmm-button-cancle',
        event: 'click',
        handler: joinAct.orderCancle
      },
      // 确认出游
      {
        element: '#myView',
        selector: '#join-act-list .tmm-button-confirm',
        event: 'click',
        handler: joinAct.orderConfirm
      },
      // 支付订单
      {
        element: '#myView',
        selector: '#join-act-list .tmm-button-pay',
        event: 'click',
        handler: orderModule.orderPayListPage
      },
      // 申请退款
      {
        element: '#myView',
        selector: '#join-act-list .tmm-button-refund',
        event: 'click',
        handler: joinAct.orderRefund
      }
    ];

    appFunc.bindEvents(bindings);
  }
};

module.exports = joinAct;

var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  orderViewModel = require('./orderView'),
  orderDetailModule = require('./orderDetail'),
  roleModule = require('../role/role');

/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoading = false;
// 觅镜1 觅趣2
var type = 1;

var order = {
  init: function() {
    type = 1;
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.redirectToLogin();
      return;
    }
    log.info('order init...');

    // 获取订单列表信息
    order.getOrderList();
    // 绑定页面元素对象事件
    order.bingEvent();
  },
  getOrderList: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    // 发送获取推荐列表请求
    httpService.getOrderList(
      type,
      function(dataRes, status) {
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          orderViewModel.getOrderList(dataRes.data);
          // 隐藏正在加载的图标
          tmmApp.hideIndicator();
          appFunc.hideToolbar();
        } else {
          tmmApp.hideIndicator();
          if ('login' in dataRes.data) {
            roleModule.redirectToLogin();
          } else {
            tmmApp.alert('网络超时，请重试');
          }
        }
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  refreshOrderList: function() {
    // 获取推荐列表
    httpService.getOrderList(
      type,
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        orderViewModel.refreshOrderList(dataRes.data);
      },
      function(dataRes, status) {}
    );
  },
  infiniteOrderList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    if (nextPageLink) {
      log.info('myOrderCtrl---infiniteOrderList---nextPageLink---', nextPageLink);
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();
      httpService.getOrderListToPage(
        nextPageLink,
        function(dataRes, status) {
          // 获取数据完毕，重置加载flag为false
          loading = false;
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          orderViewModel.infiniteOrderList(dataRes.data);
          tmmApp.hideIndicator();
        },
        function(dataRes, status) {
          tmmApp.hideIndicator();
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;
      //tmmApp.showIndicator();
      setTimeout(function() {
        tmmApp.hideIndicator();
        moreLoading = false;
        // tmmApp.alert('没有更多的数据了');
        $$("#tmm-my-order-page #no-more").css('display', 'block');
        $$("#tmm-my-order-page #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
      setTimeout(function() {
        $$("#tmm-my-order-page #no-more").hide();
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
              order.refreshOrderList();
            });
          } else {
            tmmApp.alert('取消失败，请重试');
          }
          tmmApp.hideIndicator();
        },
        function(dataRes, status) {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试');
        }
      );
    });

    log.info('orderCancle--', order_id);
  },
  /**
   * @method orderPay
   * @description 订单支付
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T19:01:40+0800
   */
  orderPay: function() {

    var _this = this;
    var order_id = $$(_this).attr('data-id');
    var price = $$(_this).attr('data-price');

    appFunc.payOrder(id, price, 
      function(dataRes, status) {

        if (dataRes.status == 1) {

          if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'PayCode': dataRes.data.alipay
              }, function(response) {})
            });
          } else if (tmmApp.device.android) {
            var str = window.jsObj.payMoney(dataRes.data.alipay);
          }
          order.getOrderList();
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('支付失败，请重试');
        }
        tmmApp.hideIndicator();
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      },function() {
        order.getOrderList();
      });

    // var data = {
    //   "id": order_id,
    //   "pay_type": "1"
    // };

    // httpService.orderPay(
    //   data,

    //   function(dataRes, status) {

    //     if (dataRes.status == 1) {

    //       if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
    //         connectWebViewJavascriptBridge(function(bridge) {
    //           bridge.callHandler('ObjcCallback', {
    //             'PayCode': dataRes.data.alipay
    //           }, function(response) {})
    //         });
    //       } else if (tmmApp.device.android) {
    //         var str = window.jsObj.payMoney(dataRes.data.alipay);
    //       }
    //       order.getOrderList();
    //     } else {
    //       tmmApp.hideIndicator();
    //       tmmApp.alert('支付失败，请重试');
    //     }
    //     tmmApp.hideIndicator();
    //   },
    //   function(dataRes, status) {
    //     tmmApp.hideIndicator();
    //     tmmApp.alert('网络超时，请重试');
    //   }
    // );

    log.info('orderPay--', order_id);
  },
  /**
   * @method orderPay
   * @description 订单支付
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T19:01:40+0800
   */
  orderPayListPage: function() {

    var _this = this;
    var order_id = $$(_this).attr('data-id');
    var price = $$(_this).attr('data-price');

    // var data = {
    //   "id": order_id,
    //   "pay_type": "1"
    // };

    appFunc.payOrder(order_id, price, 
      function(dataRes, status) {

        if (dataRes.status == 1) {

          if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'PayCode': dataRes.data.alipay
              }, function(response) {})
            });
          } else if (tmmApp.device.android) {
            var str = window.jsObj.payMoney(dataRes.data.alipay);
          }

        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('支付失败，请重试');
        }
        tmmApp.hideIndicator();
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      },function(){
        order.refreshOrderList();
      });

    // httpService.orderPay(
    //   data,

    //   function(dataRes, status) {

    //     if (dataRes.status == 1) {

    //       if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
    //         connectWebViewJavascriptBridge(function(bridge) {
    //           bridge.callHandler('ObjcCallback', {
    //             'PayCode': dataRes.data.alipay
    //           }, function(response) {})
    //         });
    //       } else if (tmmApp.device.android) {
    //         var str = window.jsObj.payMoney(dataRes.data.alipay);
    //       }

    //     } else {
    //       tmmApp.hideIndicator();
    //       tmmApp.alert('支付失败，请重试');
    //     }
    //     tmmApp.hideIndicator();
    //   },
    //   function(dataRes, status) {
    //     tmmApp.hideIndicator();
    //     tmmApp.alert('网络超时，请重试');
    //   }
    // );

    log.info('orderPay--', order_id);
  },
  /**
   * @method orderRefund
   * @description 退款
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T19:01:40+0800
   */
  orderRefund: function() {
    appFunc.orderRefund();
  },

  /**
   * 选择觅镜或者觅趣
   * @return {[type]} [description]
   */
  selectType: function() {
    var oldType = type;
    type = $$(this).attr('date-type');
    if (type != oldType) {
      $$('#myView .my-order-list').removeClass('active');
      $$(this).addClass('active');
      order.refreshOrderList();
    }

  },
  /**
   * @method bingEvent
   * @description 给页面元素绑定事件
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T02:06:54+0800
   */
  bingEvent: function() {
    var bindings = [
      // 列表下拉刷新事件
      {
        element: '#myView',
        selector: '#tmm-my-order-page .pull-to-refresh-content',
        event: 'refresh',
        handler: order.refreshOrderList
      },
      // 滚动加载事件
      {
        element: '#myView',
        selector: '#tmm-my-order-page .pull-to-refresh-content',
        event: 'infinite',
        handler: order.infiniteOrderList
      },
      // 进入订单详情页
      {
        element: '#myView',
        selector: '#tmm-my-order-page .tmm-my-order-detail-show',
        event: 'click',
        handler: orderDetailModule.loadView
      },
      // 取消订单
      {
        element: '#myView',
        selector: '#tmm-my-order-page .tmm-button-cancle',
        event: 'click',
        handler: order.orderCancle
      },
      // 支付订单
      {
        element: '#myView',
        selector: '#tmm-my-order-page .tmm-button-pay',
        event: 'click',
        handler: order.orderPayListPage
      },
      // 申请退款
      {
        element: '#myView',
        selector: '#tmm-my-order-page .tmm-button-refund',
        event: 'click',
        handler: order.orderRefund
      }, {
        element: '#myView',
        selector: '.my-order-list',
        event: 'click',
        handler: order.selectType
      }
    ];
    // 调用bindEvents方法进行事件绑定
    appFunc.bindEvents(bindings);
  }
};

module.exports = order;

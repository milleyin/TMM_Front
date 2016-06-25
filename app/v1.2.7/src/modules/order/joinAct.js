/**
 * @method joinAct
 * @description  觅趣报名相关模块
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
  roleModule = require('../role/role'),
  actPayADetail = require('./payA-detail.tpl.html');
// act = require('../createAct/activity');
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
var link = httpService.apiJoinActAA;
var payTypeSel = 1;

// 数据模型
var model = {};
var orderListModel = null;
var actAddTime = null;

/* 加载更多的div */
var loadMoreDiv = null;
/** @type {String} 参与人数加载更多的连接 */
var loadMoreJoinLink = '';

/**
 * 参与人加载更多方法
 * @return {[type]} [description]
 */
function getMoreJoinData(link) {
  var itemHtml = '{{#each list_data}}' +
    '<div class="join-item">' +
    '<div class="item-top">' +
    '<span class="time">{{this.add_time}}</span><span class="status green">{{this.status.order_status.name}}</span>' +
    '</div>' +
    '<div class="item-inner">' +
    '<p class="tit"><span class="name">{{this.main_retinue.name}}</span><span class="phone">{{this.main_retinue.phone}}</span></p>' +
    '<p class="describe"><span class="join-num">参与人数：{{this.user_go_count}}人</span><span class="order-price">订单金额：{{this.order_price}}元</span></p>' +
    '</div>' +
    '</div>' +
    '{{/each}}';
  loadMoreDiv.innerHTML = '努力加载中...';
  // $$('.seekfun-detail-page .join-block .join-list').append();
  httpService.get(link, function(data) {
    if (data.status === 1) {
      var output = appFunc.renderTpl(itemHtml, data.data);
      $$('.seekfun-detail-page .join-block .join-list').append(output);
      loadMoreJoinLink = data.data.page.next;
    }
    loadMoreDiv.innerHTML = '点击加载更多';
  }, function(data) {
    loadMoreDiv.innerHTML = '点击加载更多';
  })
}

var joinAct = {
  init: function() {
    joinAct.bindEvent();
  },

  /**
   * 显示觅趣列表页面
   * @return {[type]} [description]
   */
  loadJoinActList: function() {
    link = httpService.apiJoinActAA;
    nextPageLink = '';
    payTypeSel = 1;
    // if (!appFunc.getLocalUserInfo()) {
    //   //tmmApp.alert('请先登录', '');
    //   roleModule.redirectToLogin(); 
    //   return;
    // }
    tmmApp.showIndicator();
    httpService.getOrderActList(link, function(dataRes) {

      if (dataRes.status == 1) {
        nextPageLink = dataRes.data.page.next;
        appFunc.hideToolbar();
        //var data = dataRes.data;
        var data = {
          actData: dataRes.data,
          payType: payTypeSel
        };
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
    httpService.getOrderActList(link,
      function(dataRes) {

        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        var data = {
          actData: dataRes.data,
          payType: payTypeSel
        };
        // 刷新处理
        var output = appFunc.renderTpl(joinActListCard_tpl, data);
        $$('#join-act-list .tmm-order-card-list').html(output);

        if ($$('#join-act-list .activityGoTimeSel') != null) {
          $$.each($$('#join-act-list .payAactGoTimeSel'), function(index, value) {
            joinAct.activityGoTime(value);
          });
        }
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
      httpService.getOrderActList(
        nextPageLink,
        function(dataRes, statusCode) {
          nextPageLink = dataRes.data.page.next;
          var data = {
            actData: dataRes.data,
            payType: payTypeSel
          };
          var output = appFunc.renderTpl(joinActListCard_tpl, data);
          $$('#join-act-list .tmm-order-card-list').append(output);
          if ($$('#join-act-list .activityGoTimeSel') != null) {
            $$.each($$('#join-act-list .payAactGoTimeSel'), function(index, value) {
              joinAct.activityGoTime(value);
            });
          }
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
        //$$("#join-act-list #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
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
            tmmApp.alert('确认出游失败');
          }

        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
        }
      );
    })
  },

  /**
   * 代付 取消报名
   * @return {[type]} [description]
   */
  cancelActEnter: function() {
    var order_id = $$(this).attr('data-id');
    var isDetail = 0;
    if ($$(this).attr('data-detail')) {
      isDetail = $$(this).attr('data-detail');
    }
    //isDetail = $$(this).attr('data-detail');
    tmmApp.confirm('确认取消报名吗', '', function() {
      httpService.cancelActEnterA(
        order_id,
        function(dataRes, status) {
          if (dataRes.data.status == 1) {
            tmmApp.alert('取消报名成功', '', function() {
              joinAct.refreshList();
              if (isDetail == 1) {
                tmmApp.getCurrentView().router.back();
              }
            });
          } else {
            tmmApp.alert('取消报名失败');
          }

        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
        }
      );
    })
  },
  orderPayAct: function() {
    var _this = this;
    var order_id = $$(_this).attr('data-id');
    var price = $$(_this).attr('data-price');

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
      },
      function() {
        joinAct.refreshList();
      });
  },

  showSelect: function() {

    var clickedLink = this;
    var popoverHTML = '<div class="popover journey-subnavbar-popover">' +
      '<div class="popover-inner">' +
      '<div class="list-block">' +
      '<ul>' +
      '<li ><a href="javascript:;" id="tmm_select_AA" class="item-link list-button">自费</li>' +
      '<li ><a href="javascript:;" id="tmm_select_A" class="item-link list-button">代付</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>';
    tmmApp.popover(popoverHTML, clickedLink);
    joinAct.bindEvent();
  },

  //AA付款
  loadJoinActAAList: function() {
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.redirectToLogin();
      return;
    }
    $$("body").find(".tmm-pay-type-list").html('自费');
    tmmApp.showIndicator();
    link = httpService.apiJoinActAA;
    httpService.getOrderActList(link, function(dataRes) {
      if (dataRes.status == 1) {
        nextPageLink = dataRes.data.page.next;
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        appFunc.hideToolbar();
        //var data = dataRes.data;
        payTypeSel = 1;
        var data = {
          actData: dataRes.data,
          payType: payTypeSel
        };

        var output = appFunc.renderTpl(joinActListCard_tpl, data);
        $$('#join-act-list .tmm-order-card-list').html(output);

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
      tmmApp.closeModal();
    }, function(dataRes) {
      tmmApp.hideIndicator();
      tmmApp.alert('网络超时，请重试');
    })
  },

  //统一代付
  loadJoinActAList: function() {
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.redirectToLogin();
      return;
    }
    $$("body").find(".tmm-pay-type-list").html('代付');
    link = httpService.apiJoinActA;
    tmmApp.showIndicator();
    httpService.getOrderActList(link, function(dataRes) {
      if (dataRes.status == 1) {
        nextPageLink = dataRes.data.page.next;
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        appFunc.hideToolbar();
        //var data = dataRes.data;
        payTypeSel = 0;
        var data = {
          actData: dataRes.data,
          payType: payTypeSel
        };

        var output = appFunc.renderTpl(joinActListCard_tpl, data);
        $$('#join-act-list .tmm-order-card-list').html(output);

        joinAct.init();
        if ($$('#join-act-list .activityGoTimeSel') != null) {
          $$.each($$('#join-act-list .payAactGoTimeSel'), function(index, value) {
            joinAct.activityGoTime(value);
          });
        }
      } else {
        tmmApp.hideIndicator();
        if ('login' in dataRes.data) {
          roleModule.redirectToLogin();
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
      tmmApp.hideIndicator();
      tmmApp.closeModal();
    }, function(dataRes) {
      tmmApp.hideIndicator();
      tmmApp.alert('网络超时，请重试');
    })
  },

  /*代付确定出游日期*/
  activityGoTime: function(ele) {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    var id = $$(ele).attr('data-id');
    var goTimeLink = $$(ele).attr('data-link');

    tmmApp.calendar({
      input: ele,
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {

        var goTime = appFunc.dateFormt(year, month, day);
        setTimeout(function() {
          tmmApp.confirm('出游日期确认为：' + goTime, '', function() {
            var data = {
              "Actives[go_time]=": goTime
            };
            httpService.setActityGoTime(
              goTimeLink,
              data,
              function(dataRes, statusCode) {
                if (dataRes.status == 1) {
                  tmmApp.alert('出游日期确认成功!');
                  joinAct.refreshList();
                  /* if($$("div").find('.tmm-set-act-date').hasClass("tmm-add-act-date")){
                     $$('.normal-group').find(".tmm-set-act-date").remove();
                     $$('.tmmGoTime').append('<div class="normal-cell">'+ goTime +'</div>');
                   }*/

                } else {
                  if (dataRes.form) {
                    for (var msgName in dataRes.form) {
                      tmmApp.alert(dataRes.form[msgName][0]);
                      break;
                    }
                  } else {
                    tmmApp.alert('网络超时，请重试');
                  }
                }
              },
              function(dataRes, statusCode) {
                tmmApp.alert('网络超时，请重试');
              });
          });
        }, 80);
      }
    });
  },

  /*显示选择时间时的遮罩层*/
  showModalList: function() {
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },

  /**
   * 显示代付觅趣详情页
   * @return {[type]} [description]
   */
  goActPayADetail: function() {
    var link = $$(this).attr('data-link');
    if (!appFunc.getLocalUserInfo()) {
      roleModule.redirectToLogin();
      return;
    }
    tmmApp.showIndicator();
    httpService.get(link, function(dataRes) {

      if (dataRes.status == 1) {
        appFunc.hideToolbar();
        model = dataRes.data;
        orderListModel = null;
        var output = appFunc.renderTpl(actPayADetail, dataRes.data);
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
  showTabs: function(ev) {
    $$(this).find('span').removeClass('active');
    $$(ev.target).addClass('active');
    if ($$(ev.target).hasClass('journery')) {
      $$('.payA-detail-page .join-block').css('display', 'none');
      $$('.payA-detail-page .intro-block').css('display', 'none');
      $$('.payA-detail-page .journery-block').css('display', 'block');
    } else if ($$(ev.target).hasClass('join')) {
      if (model.is_me === 0) {
        model = model;
        joinAct.joinPeopleTpl();
      } else {
        if (model.actives_pay_type.value === '1') {
          link = model.actives_info.attend_list;
        } else if (model.actives_pay_type.value === '0') {
          link = model.actives_info.order_list;
        }
      }
      if (orderListModel === null && !!link) {
        httpService.get(link, function(data) {
          if (data.status == 1) {
            orderListModel = data.data;
            model.orderListModel = orderListModel;
            joinAct.joinPeopleTpl();
          } else {

          }
        }, function(data) {

        })
      }
      $$('.payA-detail-page .intro-block').css('display', 'none');
      $$('.payA-detail-page .journery-block').css('display', 'none');
      $$('.payA-detail-page .join-block').css('display', 'block');
    } else if ($$(ev.target).hasClass('intro')) {
      $$('.payA-detail-page .join-block').css('display', 'none');
      $$('.payA-detail-page .journery-block').css('display', 'none');
      $$('.payA-detail-page .intro-block').css('display', 'block');
    }
  },

  /*参与人html页面*/
  joinPeopleTpl: function() {
    loadMoreDiv = document.createElement('div');
    loadMoreDiv.className = 'loadmore';
    loadMoreDiv.innerHTML = '点击加载更多';
    loadMoreDiv.removeEventListener('click', getMoreJoinData, false);
    loadMoreDiv.addEventListener('click', getMoreJoinData, false);
    var html = '<div class="join-first-item">' +
      '{{#js_compare "this.actives_pay_type.value === \'1\'"}}' +
      //代付 A
      '<p class="txt">已参与人数：<span>{{orderListModel.people}}成人  {{orderListModel.children}}儿童</span></p>' +
      '{{/js_compare}}' +
      //自费 AA
      '{{#js_compare "this.actives_pay_type.value === \'0\'"}}' +
      '<p class="txt">已参与人数：<span>{{js "this.actives_info.number.value - this.actives_info.order_number.value"}}/{{actives_info.number.value}}</span></p>' +
      '<p class="txt">费用总额：<span>{{actives_info.total.value}}元</span></p>' +
      '{{/js_compare}}' +
      '<span class="share-invite invite">邀请好友加入</span>' +
      '</div>' +
      //代付 A
      '{{#js_compare "this.actives_pay_type.value === \'1\'"}}' +
      '<div class="join-list">' +
      '{{#each orderListModel.list_data}}' +
      //主要联系人
      '{{#js_compare "this.is_main === 1"}}' +
      '<div class="join-item" style="margin:0px;">' +
      '<div class="item-top item-pepole">' +
      '<span class="time">主要联系人</span>' +
      '</div>' +
      '<div class="item-inner">' +
      '<p class="tit"><span class="name">{{this.name}}</span></p>' +
      '<p class="describe"><span class="join-num">手机：{{this.phone}}</p>' +
      '</div>' +
      '</div>' +
      '{{/js_compare}}' +
      //联系人列表
      '{{#js_compare "this.is_main === 0"}}' +
      '<div class="join-item" style="margin:0px;">' +
      '<div class="item-top item-pepole">' +
      '<span class="time">{{this.add_time}}</span>' +
      '</div>' +
      '<div class="item-inner">' +
      '<p class="tit"><span class="name">{{this.name}}</span><span class="phone">{{this.phone}}</span></p>' +
      '<p class="describe"><span class="join-num">参与人数：{{this.people}}成人</span>{{#js_compare "this.number - this.people > \'0\'"}}<span class="order-price">{{js "this.number - this.people"}}儿童</span>{{/js_compare}}</p>' +
      '</div>' +
      '</div>' +
      '{{/js_compare}}' +
      '{{/each}}' +
      '</div>' +
      '{{/js_compare}}' +
      //自费 AA
      '{{#js_compare "this.actives_pay_type.value === \'0\'"}}' +
      '<div class="join-list">' +
      '{{#each orderListModel.list_data}}' +
      '<div class="join-item">' +
      '<div class="item-top item-pepole">' +
      '<span class="time">{{this.add_time}}</span><span class="status green">{{this.status.order_status.name}}</span>' +
      '</div>' +
      '<div class="item-inner">' +
      '<p class="tit"><span class="name">{{this.main_retinue.name}}</span><span class="phone">{{this.main_retinue.phone}}</span></p>' +
      '<p class="describe"><span class="join-num">参与人数：{{this.user_go_count}}人</span><span class="order-price">订单金额：{{this.order_price}}元</span></p>' +
      '</div>' +
      '</div>' +
      '{{/each}}' +
      '</div>' +
      '{{/js_compare}}';

    var htmlIsNotMe = '<div class="join-first-item">' +
      '{{#js_compare "this.actives_pay_type.value === \'1\'"}}' +
      '<p class="txt">已参与人数：<span>{{actives_info.attend_list.people}}成人  {{actives_info.attend_list.children}}儿童</span></p>' +
      '<p class="txt">报名时间：<span>{{add_time}}</span></p>' +
      '{{/js_compare}}' +
      '</div>' +
      '<div class="join-list">' +
      '<div class="join-item" style="margin:0px;">' +
      '<div class="item-pepole">' +
      '<span  class="people-tit">主要联系人</span>' +
      '</div>' +
      '<div class="item-inner-pepole">' +
      '<p class="people-tit"><span class="name">{{actives_info.attend_list.name}}</span><span class="phone">{{actives_info.attend_list.phone}}</span></p>' +
      '</div>' +
      '{{#js_compare "this.actives_info.attend_list.children > \'0\'"}}' +
      '<div class="item-pepole">' +
      '<span class="people-tit">随行人</span>' +
      '</div>' +
      '<div class="item-inner-pepole">' +
      '{{#each actives_info.attend_list.son}}' +
      '<p class="people-tit b-border"><span class="name">{{this.name}}</span><span class="phone">{{this.phone}}</span><span class="people-type">{{this.is_people.name}}</span></p>' +
      '{{/each}}' +
      '</div>' +
      '{{/js_compare}}' +
      '</div>' +
      '</div>';
    console.log("活动加载出行人员", model);
    if (model.is_me == 0) {
      var output = appFunc.renderTpl(htmlIsNotMe, model);
      $$('.payA-detail-page .join-block').html(output);
    } else if (model.is_me == 1) {
      var output = appFunc.renderTpl(html, model);
      $$('.payA-detail-page .join-block').html(output).append(loadMoreDiv);
      loadMoreJoinLink = model.orderListModel.page.next;
      if (loadMoreJoinLink) {
        loadMoreDiv.style.display = 'block';
      } else {
        loadMoreDiv.style.display = 'none';
      }
    }
    $$('.share-invite').off('click', shareMsg);
    $$('.share-invite').on('click', shareMsg);

    function shareMsg() {
      var link = httpService.apiUrl + '/index.php?r=site/share&share=' + model.shops.value;
      appFunc.shareMsg(model.name, '来自田觅觅的觅趣分享', model.image, link);
    }
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
        selector: '#join-act-list .tmm-my-order-detail-show-act',
        event: 'click',
        handler: orderDetail.loadActDetail
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
        handler: joinAct.orderPayAct
      },
      // 申请退款
      {
        element: '#myView',
        selector: '#join-act-list .tmm-button-refund',
        event: 'click',
        handler: joinAct.orderRefund
      }, {
        element: '#myView',
        selector: '#tmm_add_pay',
        event: 'click',
        handler: joinAct.showSelect
      }, {
        element: 'body',
        selector: '#tmm_select_AA',
        event: 'click',
        handler: joinAct.loadJoinActAAList
      }, {
        element: 'body',
        selector: '#tmm_select_A',
        event: 'click',
        handler: joinAct.loadJoinActAList
      }, {
        element: 'body',
        selector: '.tmm-button-A-cancle',
        event: 'click',
        handler: joinAct.cancelActEnter
      }, {
        element: '#myView',
        selector: '.payAactGoTimeSel',
        event: 'click',
        handler: joinAct.showModalList
      }, {
        element: '#myView',
        selector: '.payType-go-seekfun-detail',
        event: 'click',
        handler: joinAct.goActPayADetail
      }, {
        element: '#myView',
        selector: '.payA-detail-page .seekfun-tabs',
        event: 'click',
        handler: joinAct.showTabs
      }
    ];

    appFunc.bindEvents(bindings);
  }
};

module.exports = joinAct;

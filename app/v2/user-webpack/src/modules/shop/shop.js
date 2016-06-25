var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  itemModule = require('../item/item'),
  roleModule = require('../role/role'),
  dot_template = require('./dot-detail.tpl.html'),
  line_template = require('./line-detail.tpl.html'),
  act_template = require('./activity-detail.tpl.html'),
  createLineOrder = require('./createLineOrder'),
  createDotOrder = require('./createDotOrder'),
  createActOrder = require('./createActOrder'),
  myPraiseView = require('../myPraise/myPraiseView'),
  bookingsTpl = require('./booking-information.tpl.html'),
  bridge = require('../utils/pageBridge'),
  local_template = require('./local-specialty.html');
  applySeekfun = require('./applySeekfun');

var dataListInfo = {};
var bookingsInfo = {};
var link = '';
var type = '';
var isFromJourneyPage = '';
var actType = '';

var shop = {
  init: function() {
    log.info('shopModule init...');
    shop.bindEvent();
  },
  initDetail: function() {
    
    shop.init();
    var _this = this;
    // 类型，点，线，觅趣
    type = $$(_this).attr('data-type');
    // 点，线，觅趣的链接
    link = $$(_this).attr('data-link');

    isFromJourneyPage = $$(_this).attr('data-select');

    if (type == 'dot' || type == 1) {
      shop.getDotDetail(link, false);
    } else if (type == 'line' || type == 2) {
      shop.getLineDetail(link, isFromJourneyPage, false);
    } else if (type == 'act' || type == 3) {
      actType = $$(_this).attr('data-acttype');
      // 0为觅趣（旅游）1 为觅趣（农产品）
      if (actType === '0') {
        shop.getActDetail(link, false);
      }
    } else {
      tmmApp.alert('请求的链接不存在');
    }
  },
  refreshDetail: function() {
    shop.init();
    var _this = this;

    if (type == 'dot' || type == 1) {
      shop.getDotDetail(link , true);
    } else if (type == 'line' || type == 2) {
      shop.getLineDetail(link, isFromJourneyPage, true);
    } else if (type == 'act' || type == 3) {

      if (actType === '0') {
        shop.getActDetail(link , true);
      }
    } else {
      tmmApp.alert('请求的链接不存在');
    }
  },
  getDotDetail: function(url, isRefresh) {
    tmmApp.showIndicator();
    httpService.getDotDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          dataListInfo = {};
          var isDotPraise = true;
          if (dataRes.data.collent_name == '已赞') {
            isDotPraise = true;
          } else if (dataRes.data.collent_name == '取消') {
            isDotPraise = false;
          };
          // 预定需知
          bookingsInfo = {
            book_info: dataRes.data.book_info,
            cost_info: dataRes.data.cost_info
          };
          dataListInfo = shop.separateFramDate(dataRes.data.list); // 景点列表，农产品分离
          var isFree = shop.countItemIsFree(dataListInfo.itemList); // 计算景点是否全部免费
          var data = {
            dotObj: dataRes.data,
            isDotPraise: isDotPraise,
            dataListInfo: dataListInfo,
            isFree: isFree
          };


          var output = appFunc.renderTpl(dot_template, data);

          tmmApp.getCurrentView().router.load({
            content: output,
            reload: isRefresh
          });
          appFunc.showNavbar();
          appFunc.hideToolbar();
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('该景点未开放，请稍候再试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  getLineDetail: function(url,isFromJourneyPage , isRefresh) {
    tmmApp.showIndicator();
    httpService.getLineDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          log.info("线的详情页面", dataRes);
          var isLinePraise = false;
          if (dataRes.data.collent_name == '已赞') {
            isLinePraise = true;
            log.info("init-isPraise", isLinePraise);
          } else if (dataRes.data.collent_name == '取消') {
            isLinePraise = false;
            log.info("init-isPraise", isLinePraise);
          }
     
            // dataRes.data.list = null;
            dataRes.data.list = appFunc.mergeLineDay(dataRes.data.list);

          var data = {
            lineObj: dataRes.data,
            isLinePraise: isLinePraise,
            isFree: shop.countItemIsFree(shop.fetchItemList(dataRes.data.list)),
            isFromJourneyPage: isFromJourneyPage
          };

          // 预定需知
          bookingsInfo = {
            book_info: dataRes.data.book_info,
            cost_info: dataRes.data.cost_info
          };


          var output = appFunc.renderTpl(line_template, data);

          tmmApp.getCurrentView().router.load({
            content: output,
            reload: isRefresh
          });
          appFunc.showNavbar();
          appFunc.hideToolbar();
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('该线路未开放，请稍候再试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  getActDetail: function(url, isRefresh) {
    tmmApp.showIndicator();
    httpService.getActDetail(
      url,
      function(dataRes, statusCode) {

        if (dataRes.status == 1) {

          var isActPraise = false;
          if (dataRes.data.collent_name == '已赞') {
            isActPraise = true;
            log.info("init-isPraise", isActPraise);
          } else if (dataRes.data.collent_name == '取消') {
            isActPraise = false;
            log.info("init-isPraise", isActPraise);
          };

          dataRes.data.list = appFunc.mergeLineDay(dataRes.data.list);
          var data = {
            actObj: dataRes.data,
            isActPraise: isActPraise
          };
          var output = appFunc.renderTpl(act_template, data);

          tmmApp.getCurrentView().router.load({
            content: output,
            reload: isRefresh
          });
          var height = appFunc.lockHeight($$('.act-info-remark')[0], 40);
          if (!height) $$('.icon.ticon-expand').css('display', 'none');
          appFunc.showNavbar();
          appFunc.hideToolbar();
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('该觅趣未开放，请稍候再试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method praiseShop
   * @description 商品点赞
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T21:17:15+0800
   */
  praiseShop: function() {
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.goToLogin();
      return;
    }
    var _this = this;
    var shop_id = $$(_this).attr('data-shop-id');
    log.info("id号码", shop_id);
    //是否点赞
    var isPraise;
    httpService.shopCollect({
        'Collect': {
          'shops_id': shop_id,
          'user_address': ''
        }
      },
      function(dataRes, statusCode) {
        log.info("点赞，取消赞", dataRes);
        if (dataRes.status == 1) {
          // tmmApp.alert(dataRes.data.name + '成功', '');

          if (dataRes.data.value == 1) {
            $$(".modal").addClass("toast-modal");
            appFunc.showToast("点赞成功");
            setTimeout(function() {
              appFunc.hideToast();
            }, 1000);
            isPraise = true;
            $$(".tmm-praise-shop i").removeClass("gray");
            $$(".tmm-praise-shop span").removeClass("gray");
            $$(".tmm-praise-shop span").text(parseInt($$(".tmm-praise-shop span").text()) + 1);
            //刷新 我的赞列表
            shop.refreshMyPraiseList();
          } else if (dataRes.data.value == 0) {
            $$(".modal").addClass("toast-modal");
            appFunc.showToast("取消赞成功");
            setTimeout(function() {
              appFunc.hideToast();
            }, 1000);
            isPraise = false;
            $$(".tmm-praise-shop i").addClass("gray");
            $$(".tmm-praise-shop span").addClass("gray");
            $$(".tmm-praise-shop span").text(parseInt($$(".tmm-praise-shop span").text()) - 1);
            //刷新 我的赞列表
            shop.refreshMyPraiseList();

          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  refreshMyPraiseList: function() {
    httpService.getMyPraiseList(
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        myPraiseView.refreshMyPraiseList(dataRes.data);
      },
      function(dataRes, status) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method createOrder
   * @description 创建商品订单
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T21:36:18+0800
   */
  createOrder: function() {

    // var dotDetailPage = $$('#recommendView').find('.page[data-page="dot-detail"]:not(.cached)');
    // var dotOrderPage = $$('#recommendView').find('.page.cached[data-page="dot-order"]');
    // var selectDotPage = $$('#recommendView').find('.page[data-page="select-dot"]:not(.cached)');

    // if (selectDotPage.length > 0) {
    //   dotDetailPage.remove();
    //   dotOrderPage.remove();
    //   selectDotPage.remove();
    //   $$('#recommendView').find('.navbar-inner:not(.cached)').remove();
    // }


    var _this = this;
    var shop_id = $$(_this).attr('data-shop-id');
    // 商品类型，1点，2线
    var shop_type = $$(_this).attr('data-shop-type');

    if (shop_type == 1) {
      createDotOrder.showView(shop_id);
      //tmmApp.getCurrentView().router.load({content:dot_order_template});
    } else if (shop_type == 2) {
      // 进入线订单创建模块
      createLineOrder.showView(shop_id);

    } else if (shop_type == 3) {
      // 进入觅趣订单创建模块
      createActOrder.showView(shop_id);
    }
    log.info('创建订单....', shop_id);
  },

  /**
   * 分享信息
   * @return {[type]} [description]
   */
  shareMsg: function() {
    var tit = $$(this).attr('data-tit');
    var img = $$(this).attr('data-link');
    var con = $$(this).attr('data-con');
    var id = $$(this).attr('data-id');
    var link = httpService.apiUrl + '/index.php?r=site/share&share=' + id;
    appFunc.shareMsg(tit, con, img, link);
  },
  gotoTop: function() {
    log.info("回到顶部");
    var view = $$(this).attr('data-view');
    appFunc.gotoTop(view);
  },

  /** 展开觅趣简介 */
  showExpand: function() {

    var thatObj =  $$(this);

    if (thatObj.hasClass('tmm-retract')) {
      appFunc.transitionHeight($$('.act-info-remark')[0], '40px');
      $$(this).removeClass('tmm-retract');
    } else {
      appFunc.transitionHeight($$('.act-info-remark')[0]);
      $$(this).addClass('tmm-retract');
    }
    
  },

  dotCall: function() {
    var managePhone = $$(this).attr("data-manage-phone");
    var type = $$(this).attr("data-type");
    var callManagePhone = managePhone.replace(/-/g, "");
    var text = '';
    var tmmPhone = $$(this).attr("data-tmm-phone");
    var callTmmPhone = tmmPhone.replace(/-/g, "");

    text = (type == 'act') ? '联系代理商' : '联系运营商';

    var buttons1 = [{
      text: text,
      onClick: function() {
        appFunc.dotCallService(managePhone, callManagePhone);
      }
    }, {
      text: '联系田觅觅客服',
      onClick: function() {
        appFunc.dotCallService(tmmPhone, callTmmPhone);
      }
    }];

    var buttons2 = [{
      text: '取消',
      color: 'red'
    }];
    var groups = [buttons1, buttons2];

    tmmApp.actions(groups);

    $$(".actions-modal-group").addClass("tmmAPP-Call");
    var isRemove = $$(".actions-modal").hasClass('modal-out');
    if (isRemove) {
      $$(".actions-modal-group").removeClass('tmmAPP-Call');
    }
  },

  /**
   * 预定须知
   * @return {[type]} [description]
   */

  shareItemMore: function() {

    var output = appFunc.renderTpl(bookingsTpl, bookingsInfo)
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  /**
   * 显示特产列表
   * @return {[type]} [description]
   */
  showLocalSpecialty: function() {

    appFunc.hideToolbar();

    var output = appFunc.renderTpl(local_template, dataListInfo);
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },

  goLocalSpecialty: function(argument) {
    var title = $$(this).attr('data-name');
    var description = $$(this).attr('data-info');
    var thumb_url = $$(this).attr('data-img');
    var webpageUrl = $$(this).attr('data-link');
    appFunc.goSeekFreshDetail(webpageUrl);
    appFunc.goSeekFreshDetail2(title, description, thumb_url, webpageUrl);
  },

  /**
   * 分离农产品数据
   * @return {[type]} [description]
   */
  separateFramDate: function(data) {
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
  },

  /**
   * 提取线与觅趣的项目
   * @param  {[type]} data 线与觅趣的list
   * @return {[type]} arr 线与觅趣的项目集合
   */
  fetchItemList: function(data) {
    var arr = [];
    for (var i in data) {
      for (var j in data[i]['dot_list'][0]['day_item']) {
        arr.push(data[i]['dot_list'][0]['day_item'][j]);
      }
    }
    return arr;
  },

  /**
   * 计算项目列表是否免费
   */
  countItemIsFree: function(arr) {
    for (var i = 0, length = arr.length; i < length; i++) {
      if (arr[i].free_status.value == 1)
        return false;
    }
    return true;
  },

  /*  选择线路 */
  selectJourney: function() {

    bridge.fire('goLineDeital');
    
  },

  bindEvent: function() {
    var bindings = [{
      element: '#recommendView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    }, {
      element: '#recommendView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    }, {
      element: '#recommendView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    }, {
      element: '#recommendView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    }, {
      element: '#seekView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    }, {
      element: '#seekView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    }, {
      element: '#seekView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    }, {
      element: '#seekView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    }, {
      element: '#myView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    }, {
      element: '#myView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    }, {
      element: '#myView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    }, {
      element: '#myView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    }, {
      element: '#recommendView',
      selector: '.ticon-share',
      event: 'click',
      handler: shop.shareMsg
    }, {
      element: '#seekView',
      selector: '.ticon-share',
      event: 'click',
      handler: shop.shareMsg
    }, {
      element: '#myView',
      selector: '.ticon-share',
      event: 'click',
      handler: shop.shareMsg
    }, {
      element: '#recommendView',
      selector: '.tmm-item-more',
      event: 'click',
      handler: shop.shareItemMore
    }, {
      element: '#seekView',
      selector: '.tmm-item-more',
      event: 'click',
      handler: shop.shareItemMore
    }, {
      element: '#myView',
      selector: '.tmm-item-more',
      event: 'click',
      handler: shop.shareItemMore
    }, {
      element: '.views',
      selector: '.goTop',
      event: 'click',
      handler: shop.gotoTop
    }, {
      element: '.views',
      selector: '.icon.ticon-expand',
      event: 'click',
      handler: shop.showExpand
    }, {
      element: '.views',
      selector: '.tmm-phone',
      event: 'click',
      handler: shop.dotCall
    }, {
      element: '.views',
      selector: '.local-specialty',
      event: 'click',
      handler: shop.showLocalSpecialty
    }, {
      element: '.views',
      selector: '.tmm-local-specialty-card',
      event: 'click',
      handler: shop.goLocalSpecialty
    },
     {
      element: '#myView',
      selector: '.select-journery-in-line-page',
      event: 'click',
      handler: shop.selectJourney
    }
    ,{ // 觅趣付款A支付方式
      element: '.views',
      selector: '.payment-act-A-type',
      event: 'click',
      handler: window.applySeekfun
    }
    ];
    appFunc.bindEvents(bindings);
  }
};

module.exports = shop;

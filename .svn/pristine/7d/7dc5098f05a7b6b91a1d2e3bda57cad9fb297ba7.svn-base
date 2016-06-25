var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  itemModule = require('../item/item'),
  roleModule = require('../role/role'),
  dot_template = require('./dot-detail.tpl.html'),
  line_template = require('./line-detail.tpl.html'),
  createLineOrder = require('./createLineOrder'),
  createDotOrder = require('./createDotOrder'),
  myPraiseView = require('../myPraise/myPraiseView');

var shop = {
  init: function() {
    log.info('shopModule init...');
    shop.bindEvent();
  },
  initDetail: function() {
    shop.init();
    var _this = this;
    // 类型，点，线，活动
    var type = $$(_this).attr('data-type');
    // 点，线，活动的链接
    var link = $$(_this).attr('data-link');

    if (type == 'dot') {
      shop.getDotDetail(link);
    } else if (type == 'line') {
      shop.getLineDetail(link);
    } else if (type == 'act') {
      
    } else {
      tmmApp.alert('请求的链接不存在');
    }
  },
  getDotDetail: function(url) {
    httpService.getDotDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          log.info("点的详情页面",dataRes);
          var isDotPraise = true;
          if(dataRes.data.collent_name == '已赞'){
            isDotPraise = true;
            log.info("init-isPraise",isDotPraise);
          }else if(dataRes.data.collent_name == '取消'){
            isDotPraise = false;
            log.info("init-isPraise",isDotPraise);
          };
          var data = {
            dotObj: dataRes.data,
            isDotPraise: isDotPraise
          };
          var output = appFunc.renderTpl(dot_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
          appFunc.hideToolbar();
        } else {
          tmmApp.alert('该景点未开放，请稍候再试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  getLineDetail: function(url) {
    httpService.getLineDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          log.info("线的详情页面",dataRes);
          var isLinePraise = false;
          if(dataRes.data.collent_name == '已赞'){
            isLinePraise = true;
            log.info("init-isPraise",isLinePraise);
          }else if(dataRes.data.collent_name == '取消'){
            isLinePraise = false;
            log.info("init-isPraise",isLinePraise);
          };
          var data = {
            lineObj: dataRes.data,
            isLinePraise: isLinePraise
          };
          var output = appFunc.renderTpl(line_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
          appFunc.hideToolbar();
        } else {
          tmmApp.alert('该景点未开放，请稍候再试');
        }
      },
      function(dataRes, statusCode) {
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
    if (! appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.goToLogin();
      return ;
    }
    var _this = this;   
    var shop_id = $$(_this).attr('data-shop-id');
    log.info("id号码",shop_id);
    //是否点赞
    var isPraise;
    httpService.shopCollect(
      {'Collect':{'shops_id': shop_id, 'user_address': ''}},
      function(dataRes, statusCode) {
        log.info("点赞，取消赞",dataRes);
        if (dataRes.status == 1) {
            // tmmApp.alert(dataRes.data.name + '成功', '');
            if(dataRes.data.value == 1){
              isPraise = true;
              $$(".tmm-praise-shop i").removeClass("gray");
              //觅境的点赞数+1
              $$("#recommend_"+shop_id).text(parseInt($$("#recommend_"+shop_id).text())+1);
              //推荐的点赞数+1
              $$("#seek_"+shop_id).text(parseInt($$("#seek_"+shop_id).text())+1);
              //刷新 我的赞列表
              shop.refreshMyPraiseList();
            }else if(dataRes.data.value == 0){
              isPraise = false;
              $$(".tmm-praise-shop i").addClass("gray");
              //觅境的点赞数-1
              $$("#recommend_"+shop_id).text(parseInt($$("#recommend_"+shop_id).text())-1);
              //推荐的点赞数-1
              $$("#seek_"+shop_id).text(parseInt($$("#seek_"+shop_id).text())-1);
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
      
    } else {
      tmmApp.alert('网络超时，请重试');
    }
    log.info('创建订单....', shop_id);
  },
  bindEvent: function() {
    var bindings = [{
      element: '#recommendView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    },
    {
      element: '#recommendView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    },
    {
      element: '#recommendView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    },
    {
      element: '#recommendView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    },
    {
      element: '#seekView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    },
    {
      element: '#seekView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    },
    {
      element: '#seekView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    },
    {
      element: '#seekView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    },
     {
      element: '#myView',
      selector: '.go-item',
      event: 'click',
      handler: shop.createOrder
    },
    {
      element: '#myView',
      selector: '.showmore',
      event: 'click',
      handler: itemModule.loadItemView
    },
    {
      element: '#myView',
      selector: '.tmm-img-showmore',
      event: 'click',
      handler: itemModule.loadItemViewForImg
    },
    {
      element: '#myView',
      selector: '.tmm-praise-shop',
      event: 'click',
      handler: shop.praiseShop
    }
    ];
    appFunc.bindEvents(bindings);
  }
};

module.exports = shop;

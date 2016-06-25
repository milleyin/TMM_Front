var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  myPraiseView = require('./myPraiseView'),
  shopModule = require('../shop/shop'),
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

var myPraise = {
  init: function() {
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.redirectToLogin();
      return;
    }
    myPraise.getMyPraiseList();
    myPraise.bindEvent();
  },
  refreshMyPraiseView: function() {
    myPraise.getMyPraiseList();
  },
  /**
   * @method getMyPraiseList
   * @description 获取我的赞列表
   */
  getMyPraiseList: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getMyPraiseList(
      function(dataRes, status) {
        log.info("我的赞列表", dataRes);
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          // 进行渲染视图
          myPraiseView.getMyPraiseList(dataRes.data);

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
   * 动画加载分页
   */
  infiniteMyPraiseList: function() {
    if (nextPageLink) {
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();
      httpService.getMyPraiseListToPage(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          log.info('new --infiniteMyPraiseList-- nextPageLink ----', nextPageLink);
          // 调用视图模型的infiniteRecommendList方法进行渲染视图
          myPraiseView.infiniteMyPraiseList(dataRes.data);

          // 获取数据完毕，重置加载flag为false
          setTimeout(function() {
            tmmApp.hideIndicator();
            loading = false;
          }, 1000);

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
        $$("#myPraise #no-more").css('display', 'inline-block');
        $$("#myPraise #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 1000);
      setTimeout(function() {
        $$("#myPraise #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);
    }
  },

  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '#myPraise .pull-to-refresh-content',
      event: 'refresh',
      handler: myPraise.refreshMyPraiseList
    }, {
      element: '#myView',
      selector: '#myPraise .pull-to-refresh-content',
      event: 'infinite',
      handler: myPraise.infiniteMyPraiseList
    }, {
      element: '#myView',
      selector: '#myPraise .tmm-shops-detail',
      event: 'click',
      handler: shopModule.initDetail
    }];
    appFunc.bindEvents(bindings);
  }
};

module.exports = myPraise;

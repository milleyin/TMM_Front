var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  recommendView = require('./recommendView'),
  shopModule = require('../shop/shop'),
  seekSearchModule = require('../search/seekSearch');

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

var recommend = {
  init: function() {
    appFunc.exitSeekFresh();
    appFunc.showToolbar();
    recommend.getRecommendList();
    recommend.bindEvent();
  },
  refreshRecommendView: function() {
    recommend.getRecommendList();
  },
  /**
   * @method getRecommendList
   * @description 获取推荐列表
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T01:54:01+0800
   */
  getRecommendList: function() {
    // 显示正在加载的图标
    tmmApp.pullToRefreshTrigger('#recommendView .pull-to-refresh-content');
    //return;
    // 发送获取推荐列表请求
    httpService.getRecommendList(
      function(dataRes, status) {
        log.info("推荐的数据", dataRes);
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        // 进行渲染视图
        recommendView.getRecommendList(dataRes.data);

        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        setTimeout(function() {
          tmmApp.pullToRefreshDone();
        }, 1000);
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
        setTimeout(function() {
          tmmApp.pullToRefreshDone();
        }, 1000);
      }
    );
  },
  refreshRecommendList: function() {
    log.info('refreshRecommendList...');
    // 发送获取推荐列表请求
    httpService.getRecommendList(
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        recommendView.refreshRecommendList(dataRes.data);
      },
      function(dataRes, status) {
        tmmApp.alert('网络超时，请重试');
        tmmApp.pullToRefreshDone();
      }
    );
  },
  infiniteRecommendList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    if (nextPageLink) {
      log.info('recommendCtrl---infiniteRecommendList---nextPageLink---', nextPageLink);
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();
      httpService.getRecommendListToPage(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          log.info('new ---- nextPageLink ----', nextPageLink);
          // 调用视图模型的infiniteRecommendList方法进行渲染视图
          recommendView.infiniteRecommendList(dataRes.data);

          // 获取数据完毕，重置加载flag为false
          setTimeout(function() {
            tmmApp.hideIndicator();
            loading = false;
          }, 100);

        },
        function(dataRes, status) {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试', '');
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;
      //tmmApp.showIndicator();
      setTimeout(function() {
        tmmApp.hideIndicator();
        moreLoading = false;
        //tmmApp.alert('没有更多的数据了');
        $$("#recommendView #no-more").css('display', 'inline-block');
        $$("#recommendView #no-more").css('background', '#fff');
        $$("#recommendView #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
      // 没有更多数据了，即销毁到滚动加载的事件
      //tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      setTimeout(function() {
        $$("#recommendView #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);

    }
  },
  bindEvent: function() {

    var bindings = [{
      element: '#recommendView',
      selector: '.pull-to-refresh-content',
      event: 'refresh',
      handler: recommend.refreshRecommendList
    }, {
      element: '#recommendView',
      selector: '.pull-to-refresh-content',
      event: 'infinite',
      handler: recommend.infiniteRecommendList
    }, {
      element: '#recommendView',
      selector: '.tmm-recommend-detail',
      event: 'click',
      handler: shopModule.initDetail
    }, {
      element: '#recommendView',
      event: 'show',
      handler: recommend.init
    }, {
      element: '#recommendView',
      selector: '.ticon-search',
      event: 'click',
      handler: seekSearchModule.init
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = recommend;

var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  recommendView = require('./recommendView.js');

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


var recommend = {
  init: function() {
    appFunc.showToolbar();
    this.getRecommendList();
    this.bindEvent();
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
    tmmApp.showIndicator();
    // 发送获取推荐列表请求
    httpService.getRecommendList(
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        // 进行渲染视图
        recommendView.getRecommendList(dataRes.data);

        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
      }
    );
  },
  refreshRecommendList: function() {
    // 发送获取推荐列表请求
    httpService.getRecommendList(
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        // 进行渲染视图
        recommendView.refreshRecommendList(dataRes.data);
      },
      function(dataRes, status) {
        tmmApp.alert('网络超时，请重试');
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
            }, 1000);
            
          },
          function(dataRes, status) {
            tmmApp.hideIndicator();
          }
        );
      } else {
        // 没有更多数据了，即销毁到滚动加载的事件
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
        tmmApp.alert('没有更多的数据了');
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
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = recommend;

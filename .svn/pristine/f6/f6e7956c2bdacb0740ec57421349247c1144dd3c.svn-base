var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./my.tpl.html'),
  httpService = require('../services/httpService');
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


var my = {
  init: function() {
    this.bindEvents();
  },
  getUserInfo: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        // 调用视图模型的getRecommendList方法进行渲染视图
        my.renderUserInfo(dataRes);
        // 已经登录
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  refreshMyView: function() {
    my.getUserInfo();
  },
  renderUserInfo: function(dataRes) {
     var renderData = {
        isLogin: false,
        userInfo: {},
      };

    log.info('renderUserInfo---dataRes--', dataRes);
    if (dataRes.status == 1) {
      var renderData = {
        isLogin: true,
        userInfo: dataRes.data.userInfo,
      };
    }

    var output = appFunc.renderTpl(template, renderData);


    $$('#myView').find('.tmm-my-page-contnet').html(output);
    // 实现图片懒加载...
    //tmmApp.initImagesLazyLoad(mainView.activePage.container);

  },
  bindEvents: function() {
    var bindings = [{
      element: '#myView',
      event: 'show',
      handler: my.getUserInfo
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = my;

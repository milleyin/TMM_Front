var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  dotManageViewModel = require('./dotManageView');

var dotManage = {
  init: function() {
    log.info('dotManage init...');
    appFunc.hideToolbar();
  },
  showDotList: function() {
    dotManage.bindEvent();
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getDotList(
      function(dataRes, statusCode) {
        dotManageViewModel.getDotList(dataRes.data);
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试...', '');
      }
    );
  },
  showDotDetail: function() {
    log.info('showDotDetail---');

    var _this = this;
    var link = $$(_this).attr('data-link');
    tmmApp.showIndicator();
    httpService.getDotDetail(
      link,
      function(dataRes, statusCode) {
        dotManageViewModel.showDotDetail(dataRes);
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试...', '');
      }
    );


    // // 显示正在加载的图标
    // tmmApp.showIndicator();
    // httpService.getDotList(
    //   function(dataRes, statusCode) {
    //     dotManageViewModel.getDotList(dataRes.data);
    //     // 隐藏正在加载的图标
    //     tmmApp.hideIndicator();
    //   },
    //   function(dataRes, statusCode) {
    //     // 隐藏正在加载的图标
    //     tmmApp.hideIndicator();
    //     tmmApp.alert('网络超时，请重试...', '');
    //   }
    // );


    log.info('showDotDetail...');

  },
  bindEvent: function() {
    var bindings = [{
      element: '#recommendView',
      selector: '.tmm-select-dot-detail',
      event: 'click',
      handler: dotManage.showDotDetail
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = dotManage;

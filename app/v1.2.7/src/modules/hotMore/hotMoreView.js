
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var hot_more_tpl = require('./hot-more.tpl.html');

var hotMoreView = {
  /*
  *觅趣更多
   */
  getHotMoreList: function() {
    // 转成对象赋值给页面上
    var output = appFunc.renderTpl(hot_more_tpl);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = hotMoreView;

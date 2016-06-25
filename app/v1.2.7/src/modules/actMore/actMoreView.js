
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var act_more_tpl = require('./act-more.tpl.html');

var actMoreView = {
  /*
  *觅趣更多
   */
  getActMoreList: function() {
    // 转成对象赋值给页面上
    var output = appFunc.renderTpl(act_more_tpl);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = actMoreView;

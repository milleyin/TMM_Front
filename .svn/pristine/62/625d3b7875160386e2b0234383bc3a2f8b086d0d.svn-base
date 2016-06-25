/**
 * @name myView
 * @description 我的视图模型模块
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T02:09:03+0800
 */
var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  template = require('./my.tpl.html');

var myView = {
  /**
   * @method loadMyInfoView 渲染用户信息
   * @param    {Object} dataRes 用户数据
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T10:04:06+0800
   */
  loadMyInfoView: function(dataRes) {
    // 删除缓存中重复的值
    appFunc.removeCachedPage('myView', 'my');
    var renderData = {
      isLogin: false,
      userInfo: {},
    };


    if (dataRes.status == 1) {
      var renderData = {
        isLogin: true,
        userInfo: dataRes.data.userInfo,
      };
    }
    $$('#myView').find('#tmm-myview-navbar-inner').removeClass('cached')
    log.info('myView---loadMyInfoView---renderData--', renderData);
    
    var output = appFunc.renderTpl(template, renderData);

    $$('#myView').find('.tmm-my-page-contnet').html(output);

    // tmmApp.getCurrentView().router.load({
    //   content: output,
    //   reload: true,
    //   animatePages: false
    // });

    // 实现图片懒加载...
    //tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

  }
};

module.exports = myView;

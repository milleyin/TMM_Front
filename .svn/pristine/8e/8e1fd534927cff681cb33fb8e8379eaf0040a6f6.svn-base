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

      var uInfo = {
        'phone': dataRes.data.userInfo.phone,
        'gender': dataRes.data.userInfo.gender,
        'is_organizer': dataRes.data.userInfo.is_organizer,
        'organizer_status': dataRes.data.userInfo.organizer.status
      };
      // 更新本地缓存的用户信息
      appFunc.setLocalUserInfo(uInfo);
    } else {
      // 清除本地缓存的用户信息
      appFunc.clearLocalUserInfo();
    }

    var output = appFunc.renderTpl(template, renderData);

    $$('#myView').find('.tmm-my-page-contnet').html(output);
  }
};

module.exports = myView;

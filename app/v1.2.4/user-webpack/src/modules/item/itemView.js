/**
 * @name itemView
 * @description 推荐视图模型模块
 * 
 * @author Moore Mo
 * @datetime 2015-10-27T16:45:06+0800
 */
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');

var itemView = {
  getDotDetail: function(url) {
    httpService.getDotDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          var data = {
            dotObj: dataRes.data
          };
          var output = appFunc.renderTpl(dot_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
        } else {
          tmmApp.alert('网络超时，请重试');
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
          var data = {
            lineObj: dataRes.data
          };
          var output = appFunc.renderTpl(line_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  }
};

module.exports = itemView;

var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  dot_order_template = require('./dot-order.tpl.html'),
  line_order_template = require('./line-order.tpl.html');

var orderManage = {
  init: function() {
    log.info('orderManage init...');
    appFunc.hideToolbar();
  }
};

module.exports = orderManage;


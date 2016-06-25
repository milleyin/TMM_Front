/**
 * @name recordView
 * @description 记录视图模型模块
 * 
 * @author Moore Mo
 * @datetime 2015-12-18T15:14:34+0800
 */
var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  draw_money_record_tpl = require('./draw-money-record.tpl.html'),
  draw_money_record_li_tpl = require('./draw-money-record-li.tpl.html'),
  trade_record_tpl = require('./trade-record.tpl.html'),
  trade_record_li_tpl = require('./trade-record-li.tpl.html');

var recordView = {
  /**
   * @method getDrawMoneyRecordList
   * @description 获取提现记录
   * 
   * @author Moore Mo
   * @datetime 2015-12-21T14:28:01+0800
   */
  getDrawMoneyRecordList: function(dataRes) {
    var data = {
      'cashRecordList': dataRes
    };
    var output = appFunc.renderTpl(draw_money_record_tpl, data);
    tmmApp.getCurrentView().router.load({
      'content': output
    });
  },
  /**
   * @method refreshdrawMoneyRecordList
   * @description 提现记录（下拉刷新）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:34+0800
   */
  refreshDrawMoneyRecordList: function(dataRes) {
    var data = {
      cashRecordList: dataRes
    };
    var output = appFunc.renderTpl(draw_money_record_li_tpl, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#tmm-draw-money-record-page').find('#tmm-draw-money-record-ul').html(output);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);
  },
  /**
   * @method infinitedrawMoneyRecordList
   * @description 提现记录（上拉加载）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:51+0800
   */
  infiniteDrawMoneyRecordList: function(dataRes) {
    var data = {
      recommend: dataRes
    };
    var output = appFunc.renderTpl(draw_money_record_li_tpl, data);
    // 把后面获取的数据，追加到页面上
    $$('#tmm-draw-money-record-page').find('#tmm-draw-money-record-ul').append(output);
  },
  /**
   * @method getTradeRecordList
   * @description 获取交易记录
   * 
   * @author Moore Mo
   * @datetime 2015-12-21T14:29:57+0800
   */
  getTradeRecordList: function(dataRes) {
    var data = {
      'tradeRecordList': dataRes
    };
    var output = appFunc.renderTpl(trade_record_tpl, data);
    tmmApp.getCurrentView().router.load({
      'content': output
    });
  },
  /**
   * @method refreshdrawMoneyRecordList
   * @description 交易记录（下拉刷新）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:34+0800
   */
  refreshTradeRecordList: function(dataRes) {
    var data = {
      'tradeRecordList': dataRes
    };
    var output = appFunc.renderTpl(trade_record_li_tpl, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
     $$('#tmm-trade-record-page').find('#tmm-trade-record-ul').html(output);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);
  },
  /**
   * @method infinitedrawMoneyRecordList
   * @description 交易记录（上拉加载）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:51+0800
   */
  infiniteTradeRecordList: function(dataRes) {
    var data = {
      'tradeRecordList': dataRes
    };
    var output = appFunc.renderTpl(trade_record_li_tpl, data);
    // 把后面获取的数据，追加到页面上
    $$('#tmm-trade-record-page').find('#tmm-trade-record-ul').append(output);
  }
};

module.exports = recordView;

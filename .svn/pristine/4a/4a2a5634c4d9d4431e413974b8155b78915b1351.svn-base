/**
 * @name cash
 * @description 提现相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-12-18T14:15:10+0800
 */
var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService'),
  recordViewModule = require('./recordView'),
  draw_money_phone_tpl = require('./draw-money-phone.tpl.html'),
  draw_money_success_tpl = require('./draw-money-success.tpl.html'),
  my_wallet_tpl = require('./my-wallet.tpl.html');

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
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoading = false;
/**
 * 交易记录下一的页面链接
 * @type {String}
 */
var nextPageLinkTrade = '';
/**
 * 交易记录控制滚动加载的flag
 * @type {Boolean}
 */
var loadingTrade = false;
/**
 * 交易记录控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoadingTrade = false;
/**
 *  定时器
 * @type {Object}
 */
var timer = null;
/**
 * 短信倒计等待时间
 * @type {Number}
 */
var waitTime = 60;
/**
 * 保存提现信息
 * @type {Object}
 */
var cashInfo = {};

var cash = {
  init: function() {
    cash.bindEvent();
  },
  /**
   * @method drawMoney
   * @description 提现申请(第一步)
   * 
   * @author Moore Mo
   * @datetime 2015-12-17T17:09:37+0800
   */
  drawMoneyBefore: function() {
    var money = $$('#money').val();
    var cash_money = parseFloat($$('#cash_money').val());

    if (money == '') {
      tmmApp.alert('提现金额不能为空');
      return;
    }
    if (isNaN(money)) {
      tmmApp.alert('请填写正确的金额');
      return;
    }
    if (money < 100.00) {
      tmmApp.alert('提现金额不能小于100元');
      return;
    }

    if (money > cash_money) {
      tmmApp.alert('可提现金额不足' + money + '元');
      return;
    }

    cashInfo.price = money;
    var data = {
      'phone': appFunc.replacePhone(JSON.parse(appFunc.getLocalUserInfo()).phone)
    };
    var output = appFunc.renderTpl(draw_money_phone_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });

    if (timer) {
      clearTimeout(timer);
    }
  },
  /**
   * @method drawMoneySubmit
   * @description  提现申请（完成）
   * 
   * @author Moore Mo
   * @datetime 2015-12-17T18:06:43+0800
   */
  drawMoneySubmit: function() {
    var sms_code = $$('#sms_code_money').val();

    if (sms_code == '') {
      tmmApp.alert('验证码不能为空');
      return;
    }

    var data = {
      'Cash': {
        'sms': sms_code,
        'price': cashInfo.price
      }
    };

    // 请求提现操作
    tmmApp.showIndicator();
    httpService.createCash(
      data,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          var output = appFunc.renderTpl(draw_money_success_tpl, data);
          tmmApp.getCurrentView().router.load({
            'content': output
          });
        } else {
          // 处理表单错误时的提示
          if (dataRes.form) {
            for (msgName in dataRes.form) {
              // 显示错误信息
              tmmApp.alert(dataRes.form[msgName][0]);
              break;
            }
          } else {
            // 其它错误提醒
            tmmApp.alert('输入错误，请重试');
          }
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );

  },
  /**
   * @method getSmsCodeMoney
   * @description 用户提现，获取短信验证码
   * 
   * @author Moore Mo
   * @datetime 2015-12-17T18:16:38+0800
   */
  getSmsCodeMoney: function() {
    var that = $$(this);
    // 60秒倒计时锁定发送短信按钮
    var getCodeTimeOut = function() {
      if (waitTime === 0) {
        // 60秒到后解锁按钮,使其可点击
        that.removeAttr('disabled');
        // 重置文本信息
        that.html('获取验证码');
        // 重置回60秒
        waitTime = 60;
        if (timer) {
          clearTimeout(timer);
        }
      } else {
        // 锁定按钮,使其不可点击
        that.attr('disabled', true);
        // 倒计时提示文本
        that.html(waitTime + '秒后重试');
        // 倒计时自减
        waitTime--;
        // 每秒回调
        timer = setTimeout(function() {
          getCodeTimeOut();
        }, 1000);
      }
    };
    // 请求获取短信验证码
    httpService.captchaCash(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          // 成功后，60秒倒计时锁定发送按钮
          getCodeTimeOut();
        } else {
          // 处理表单错误时的提示
          if (dataRes.form) {
            for (msgName in dataRes.form) {
              // 显示错误信息
              tmmApp.alert(dataRes.form[msgName][0]);
              break;
            }
          } else {
            // 其它错误提醒
            tmmApp.alert('网络超时，请重试');
          }
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );

  },
  /**
   * @method backToWallet
   * @description 返回钱包
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T10:44:21+0800
   */
  backToWallet: function() {
    var noBank = true;
    // 查询钱包信息
    var getWalletinfo = function() {
      httpService.getBurseInfo(
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            appFunc.hideToolbar();
            tmmApp.hideIndicator();
            var data = {
              'walletObj': dataRes.data,
              'noBank': noBank
            };
            // 提现成功，回退到我的钱包
            // 由于层级页面太多，所以需要删除缓存的上层页面，只留上的“我的”那一层
            appFunc.removeCachedPage('myView', 'draw-money');
            appFunc.removeCachedPageNavbar('myView', 'draw-money-navbar');
            appFunc.removeCachedPage('myView', 'my-wallet');
            appFunc.removeCachedPageNavbar('myView', 'my-wallet-navbar');
            var output = appFunc.renderTpl(my_wallet_tpl, data);
            // 回退重新加载“我的钱包”的页面，
            tmmApp.getCurrentView().router.back({
              'content': output,
              'force': true
            });


          } else {
            tmmApp.hideIndicator();
            tmmApp.alert('网络超时，请重试');
          }
        },
        function(dataRes, statusCode) {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试', '');
        }
      );
    };
    // 查询绑定的银行卡信息
    tmmApp.showIndicator();
    httpService.bankCardList(
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          noBank = false;
        }
        getWalletinfo();
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method tradeRecord
   * @description 交易记录
   * 
   * @author Moore Mo
   * @datetime 2015-12-17T17:10:02+0800
   */
  tradeRecord: function() {
    log.info('交易记录...');
    tmmApp.showIndicator();
    httpService.accountLogList(
      '',
      function(dataRes, statusCode) {

        // 成功后把下一页链接赋值给nextPageLinkTrade
        nextPageLinkTrade = dataRes.data.page.next;
        // 进行渲染视图
        recordViewModule.getTradeRecordList(dataRes.data.list_data);
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        // 绑定事件
        appFunc.bindEvents([{
          element: '#tmm-trade-record-page',
          selector: '.pull-to-refresh-content',
          event: 'refresh',
          handler: cash.refreshTradeRecordList
        }, {
          element: '#tmm-trade-record-page',
          selector: '.pull-to-refresh-content',
          event: 'infinite',
          handler: cash.infiniteTradeRecordList
        }]);
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method refreshdrawMoneyRecordList
   * @description 交易记录（下拉刷新）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:34+0800
   */
  refreshTradeRecordList: function() {
    // 发送获取交易记录请求
    httpService.accountLogList(
      '',
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLinkTrade
        nextPageLinkTrade = dataRes.data.page.next;
        if (nextPageLinkTrade) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        recordViewModule.refreshTradeRecordList(dataRes.data.list_data);
      },
      function(dataRes, status) {
        tmmApp.pullToRefreshDone();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method infinitedrawMoneyRecordList
   * @description 交易记录（上拉加载）
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T15:14:51+0800
   */
  infiniteTradeRecordList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    var tipEle = $$('#tmm-trade-record-page .load');
    if (nextPageLinkTrade) {
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loadingTrade) return;
      // 正在获取数据，设置flag为true
      loadingTrade = true;
      tipEle.show();
      httpService.accountLogList(
        nextPageLinkTrade,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLinkTrade = dataRes.data.page.next;
          // 调用视图模型的infiniteDrawMoneyRecordList方法进行渲染视图
          recordViewModule.infiniteTradeRecordList(dataRes.data.list_data);

          // 获取数据完毕，重置加载flag为false
          setTimeout(function() {
            tipEle.hide();
            loadingTrade = false;
          }, 100);

        },
        function(dataRes, status) {
          tipEle.hide();
          setTimeout(function() {
            tmmApp.alert('网络超时，请重试', '');
            loadingTrade = false;
          }, 100);
        }
      );
    } else {
      if (moreLoadingTrade) return;
      moreLoadingTrade = true;
      setTimeout(function() {
        tipEle.show().html('没有更多了');
        moreLoadingTrade = false;
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
      // 没有更多数据了，即销毁到滚动加载的事件
      setTimeout(function() {
        tipEle.hide().html('正在加载...');
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);

    }
  },
  /**
   * @method drawMoneyRecord
   * @description 提现记录
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T11:12:59+0800
   */
  drawMoneyRecord: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getCashInfo(
      '',
      function(dataRes, statusCode) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        // 进行渲染视图
        recordViewModule.getDrawMoneyRecordList(dataRes.data.list_data);
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        // 绑定事件
        appFunc.bindEvents([{
          element: '#tmm-draw-money-record-page',
          selector: '.pull-to-refresh-content',
          event: 'refresh',
          handler: cash.refreshDrawMoneyRecordList
        }, {
          element: '#tmm-draw-money-record-page',
          selector: '.pull-to-refresh-content',
          event: 'infinite',
          handler: cash.infiniteDrawMoneyRecordList
        }]);
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method refreshDrawMoneyRecordList
   * @description 提现记录(下拉刷新)
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T16:05:39+0800
   */
  refreshDrawMoneyRecordList: function() {
    // 发送获取提现记录请求
    httpService.getCashInfo(
      '',
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        recordViewModule.refreshDrawMoneyRecordList(dataRes.data.list_data);
      },
      function(dataRes, status) {
        tmmApp.pullToRefreshDone();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method infiniteDrawMoneyRecordList
   * @description 提现记录(上拉加载)
   * 
   * @author Moore Mo
   * @datetime 2015-12-18T16:10:38+0800
   */
  infiniteDrawMoneyRecordList: function() {
    log.info('infiniteDrawMoneyRecordList...');
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    var tipEle = $$('#tmm-draw-money-record-page .tip');
    if (nextPageLink) {
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tipEle.show();
      httpService.getCashInfo(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          // 调用视图模型的infiniteDrawMoneyRecordList方法进行渲染视图
          recordViewModule.infiniteDrawMoneyRecordList(dataRes.data.list_data);

          // 获取数据完毕，重置加载flag为false
          setTimeout(function() {
            tipEle.hide();
            loading = false;
          }, 100);

        },
        function(dataRes, status) {
          tipEle.hide();
          setTimeout(function() {
            tmmApp.alert('网络超时，请重试', '');
            loading = false;
          }, 100);
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;
      setTimeout(function() {
        tipEle.show().html('没有更多了');
        moreLoading = false;
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
      // 没有更多数据了，即销毁到滚动加载的事件
      setTimeout(function() {
        tipEle.hide().html('正在加载...');
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);

    }
  },
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '#draw-money-before',
      event: 'click',
      handler: cash.drawMoneyBefore
    }, {
      element: '#myView',
      selector: '#draw-money-submit',
      event: 'click',
      handler: cash.drawMoneySubmit
    }, {
      element: '#myView',
      selector: '#get_sms_code_money',
      event: 'click',
      handler: cash.getSmsCodeMoney
    }, {
      element: '#myView',
      selector: '#tmm-my-wallet-back',
      event: 'click',
      handler: cash.backToWallet
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = cash;

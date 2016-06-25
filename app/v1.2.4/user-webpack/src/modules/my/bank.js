/**
 * @name bank
 * @description 银行卡相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-12-16T17:34:24+0800
 */
var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService'),
  add_bank_tpl = require('./add-bank.tpl.html'),
  verify_phone_tpl = require('./verify-phone.tpl.html'),
  bank_protocol_tpl = require('./bank-protocol.tpl.html'),
  bankcard_management_tpl = require('./bankcard-management.tpl.html'),
  change_verify_phone_tpl = require('./change-verify-phone.tpl.html'),
  change_bank_tpl = require('./change-bank.tpl.html'),
  my_wallet_tpl = require('./my-wallet.tpl.html'),
  my_wallet_content_tpl = require('./my-wallet-content.tpl.html');

/**
 * 所要绑定的银行卡的信息
 * @type {Object}
 */
var bankInfo = {};
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
 * 银行卡id
 * @type {Number}
 */
var bankId = 0;
/**
 * 标示是进行添加银行卡操作add，还是更换银行卡操作update
 * @type {String}
 */
var bank_operation = 'add';

var bank = {
  init: function() {
    bank.bindEvent();
  },
  /**
   * @method manageBank
   * @description 管理银行卡(目前暂时只有一张)
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T16:24:50+0800
   */
  manageBank: function() {
    log.info('app...', tmmApp.Views);
    bank_operation = 'update';
    httpService.bankCardList(
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          var data = {
            'bankObj': dataRes.data[0]
          };
          // 保存银行卡id
          bankId = dataRes.data[0].id;
          var output = appFunc.renderTpl(bankcard_management_tpl, data);
          tmmApp.getCurrentView().router.load({
            content: output
          });
        } else {
          tmmApp.alert('您还未添加银行卡');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method changeBankcard
   * @description 更换银行卡
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T16:24:26+0800
   */
  changeBankcard: function() {
    var data = {
      'phone': appFunc.replacePhone(JSON.parse(appFunc.getLocalUserInfo()).phone)
    };
    var output = appFunc.renderTpl(change_verify_phone_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    if (timer) {
      clearTimeout(timer);
    }
  },
  /**
   * @method changeNextStep
   * @description 更换银行卡(第一步)
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T16:59:45+0800
   */
  changeNextStep: function() {
    var sms_code = $$('#sms_code').val();

    if (sms_code == '') {
      tmmApp.alert('验证码不能为空');
      return;
    }
    bankInfo['User'] = {
      'sms': sms_code
    };
    httpService.getBankList(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          tmmApp.hideIndicator();
          var data = {
            'bankList': dataRes.data
          };
          var output = appFunc.renderTpl(change_bank_tpl, data);
          tmmApp.getCurrentView().router.load({
            content: output
          });
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method updateBankcard
   * @description 更换银行卡(完成)
   * 
   * @return   {[type]}                 [description]
   * @author Moore Mo
   * @datetime 2015-12-16T16:39:23+0800
   */
  updateBankcard: function() {

    var isChecked = $$('#agree_create').prop('checked');

    var bank_id = $$('#bank_id').val();
    var bank_name = $$('#bank_name').val();
    var bank_branch = $$('#bank_branch').val();
    var bank_code = $$('#bank_code').val();
    // var bank_identity = $$('#bank_identity').val();

    if (bank_id == '') {
      tmmApp.alert('请选择开户行');
      return;
    }
    if (bank_branch == '') {
      tmmApp.alert('开户支行不能为空');
      return;
    }
    if (bank_name == '') {
      tmmApp.alert('开户名不能为空');
      return;
    }
    if (bank_code == '') {
      tmmApp.alert('卡号不能为空');
      return;
    }
    // if (bank_identity == '') {
    //   tmmApp.alert('身份证号不能为空');
    //   return;
    // }

    if (!isChecked) {
      tmmApp.alert('请先查看"银行卡管理协议"并同意');
      return;
    }

    bankInfo['BankCard'] = {
      'bank_id': bank_id,
      'bank_name': bank_name,
      'bank_branch': bank_branch,
      'bank_code': bank_code,
      'bank_identity': ''
    };
    // 请求更换银行卡
    tmmApp.showIndicator();
    httpService.updateBankCard(
      bankId,
      bankInfo,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 重置数组
          bankInfo = {};
          waitTime = 60;
          bank.backToWallet();
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
            tmmApp.alert('输入有误，请重试');
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
   * @method backToWallet
   * @return   {[type]}                 [description]
   * @author Moore Mo
   * @datetime 2015-12-17T17:07:17+0800
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

            // 添加银行卡时，更新回退视图
            if (bank_operation == 'add') {
              var output = appFunc.renderTpl(my_wallet_content_tpl, data);
              $$('#myView').find('.tmm-my-wallet-page').html(output);
              // 回退到“我的钱包页面”，并更新数据
              tmmApp.getCurrentView().router.back({
                'pageName': 'my-wallet',
                'force': true
              });
              // 初始化银行管理模块
              bank.init();
            }
            // 更换银行卡，更新回退视图
            if (bank_operation == 'update') {
              // 由于层级页面太多，所以需要删除缓存的上层页面，只留上的“我的”那一层
              appFunc.removeCachedPage('myView', 'bank-card-manage');
              appFunc.removeCachedPageNavbar('myView', 'bank-card-manage-navbar');
              appFunc.removeCachedPage('myView', 'my-wallet');
              appFunc.removeCachedPageNavbar('myView', 'my-wallet-navbar');
              var output = appFunc.renderTpl(my_wallet_tpl, data);
              // 回退重新加载“我的钱包”的页面，
              tmmApp.getCurrentView().router.back({
                'content': output,
                'force': true
              });
            }

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
   * @method addBank
   * @description 添加银行卡
   * 
   * @author Moore Mo
   * @datetime 2015-12-15T14:35:22+0800
   */
  addBank: function() {
    // log.info('添加银行卡...');
    bank_operation = 'add';
    tmmApp.showIndicator();
    httpService.getBankList(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          tmmApp.hideIndicator();
          var data = {
            'bankList': dataRes.data
          };
          var output = appFunc.renderTpl(add_bank_tpl, data);
          tmmApp.getCurrentView().router.load({
            content: output
          });
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },

  showBankProtocol: function() {
    tmmApp.getCurrentView().router.load({
      content: bank_protocol_tpl
    });
  },
  /**
   * @method createBankBefore
   * @description 用户绑定银行卡，（第一步）
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T11:07:13+0800
   */
  createBankBefore: function() {
    var isChecked = $$('#agree_create').prop('checked');

    var bank_id = $$('#bank_id').val();
    var bank_name = $$('#bank_name').val();
    var bank_branch = $$('#bank_branch').val();
    var bank_code = $$('#bank_code').val();
    // var bank_identity = $$('#bank_identity').val();

    if (bank_id == '') {
      tmmApp.alert('请选择开户行');
      return;
    }
    if (bank_branch == '') {
      tmmApp.alert('开户支行不能为空');
      return;
    }
    if (bank_name == '') {
      tmmApp.alert('开户名不能为空');
      return;
    }
    if (bank_code == '') {
      tmmApp.alert('卡号不能为空');
      return;
    }
    // if (bank_identity == '') {
    //   tmmApp.alert('身份证号不能为空');
    //   return;
    // }

    if (!isChecked) {
      tmmApp.alert('请先查看"银行卡管理协议"并同意');
      return;
    }

    bankInfo['BankCard'] = {
      'bank_id': bank_id,
      'bank_name': bank_name,
      'bank_branch': bank_branch,
      'bank_code': bank_code,
      'bank_identity': ''
    };

    var data = {
      'phone': appFunc.replacePhone(JSON.parse(appFunc.getLocalUserInfo()).phone)
    };
    var output = appFunc.renderTpl(verify_phone_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    if (timer) {
      clearTimeout(timer);
    }
  },
  /**
   * @method createBank
   * @description 用户绑定银行卡(完成)
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T11:06:27+0800
   */
  createBank: function() {
    var sms_code = $$('#sms_code').val();

    if (sms_code == '') {
      tmmApp.alert('验证码不能为空');
      return;
    }

    bankInfo['User'] = {
      'sms': sms_code
    };
    // 请求绑定银行卡
    tmmApp.showIndicator();
    httpService.createBankCard(
      bankInfo,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // my-wallet
          // 重置数组
          bankInfo = {};
          waitTime = 60;
          // tmmApp.getCurrentView().router.back({
          //   'pageName': 'my-wallet',
          //   'force': true
          // });
          bank.backToWallet();
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
            tmmApp.alert('输入有误，请重试');
          }
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
    log.info('createBank...', bankInfo);
  },
  /**
   * @method getSmsCode
   * @description 用户绑定银行账户，获取短信验证码
   * 
   * @author Moore Mo
   * @datetime 2015-12-16T11:05:21+0800
   */
  getSmsCode: function() {
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
    httpService.captchaBankCardSms(
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
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '#tmm-add-bank',
      event: 'click',
      handler: bank.addBank
    }, {
      element: '#myView',
      selector: '#tmm-manage-bank',
      event: 'click',
      handler: bank.manageBank
    }, {
      element: '#myView',
      selector: '#next_step',
      event: 'click',
      handler: bank.createBankBefore
    }, {
      element: '#myView',
      selector: '#create_bank_end',
      event: 'click',
      handler: bank.createBank
    }, {
      element: '#myView',
      selector: '#get_sms_code',
      event: 'click',
      handler: bank.getSmsCode
    }, {
      element: '#myView',
      selector: '#bank_protocol',
      event: 'click',
      handler: bank.showBankProtocol
    }, {
      element: '#myView',
      selector: '#change_bankcard',
      event: 'click',
      handler: bank.changeBankcard
    }, {
      element: '#myView',
      selector: '#change_next_step',
      event: 'click',
      handler: bank.changeNextStep
    }, {
      element: '#myView',
      selector: '#update_bank',
      event: 'click',
      handler: bank.updateBankcard
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = bank;

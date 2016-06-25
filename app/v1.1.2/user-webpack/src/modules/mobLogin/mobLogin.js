var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  mob_login_template = require('./mob-login.tpl.html');

/**
 * CSRF检验码
 * @type {String}
 */
var g_csrf = '';
/**
 * 验证码HASH值
 * @type {String}
 */
var g_hash = '';
/**
 * 短信倒计等待时间
 * @type {Number}
 */
var waitTime = 60;
/**
 * 获取短信的标签对象
 * @type {Object}
 */
var codeObj = {};
/**
 * 验证码错误的次数，3次错误后刷新
 * @type {Number}
 */
var verifycodeError = 3;


/**
 * @name mobLogin
 * @description 手机短信登录控制器
 * 
 * @author Moore Mo
 * @datetime 2015-10-27T11:36:30+0800
 */
var mobLogin = {
  init: function() {
    appFunc.hideToolbar();
    log.info('mobLogin init....');
    mobLogin.bindEvent();
    mobLogin.refresh();
  },
  /**
   * @method loginSubmit
   * @description 登录函数
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:36:43+0800
   */
  loginSubmit: function() {
    var loginName = $$('#tmm-mob-phone').val();
    var sms = $$('#tmm-mob-sms').val();
    var verifycode = $$('#tmm-mob-verifycode').val();

    if (!appFunc.isPhone(loginName)) {
      tmmApp.alert('手机号码格式不对');
    } else if (sms == '') {
      tmmApp.alert('短信验证码不能为空');
    } else if (verifycode == '') {
      tmmApp.alert('图形验证码不能为空');
    } else {
      // 要发送的表单数据
      var data = {
          "UserSmsLoginForm": {
            "phone": loginName,
            "sms": sms,
            "verifyCode": verifycode
          },
          "TMM_CSRF": g_csrf
        }
        // 显示加载图标提示
      tmmApp.showPreloader('正在登录...');
      // 发送登录请求
      httpService.login_sms(
        data,
        // 成功后的回调函数
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            // 隐藏错误信息提示栏
            $$('.tmm-showMsg-li').hide();
            // 正确后，请求到我的模块主页
            appFunc.setLocalUserInfo(dataRes.data.phone);
            tmmApp.getCurrentView().router.load({
              pageName: 'myView'
            });
          } else {
            // 验证表单错误时的提示
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                if (msgName == 'UserSmsLoginForm_verifyCode') {
                  // 自减
                  --verifycodeError;
                  // 错误三次后，刷新验证码
                  if (verifycodeError <= 0) {
                    mobLogin.refresh();
                  }
                }
                mobLogin.showErrorMsg(dataRes.form[msgName][0]);
              }
            } else {
              mobLogin.showErrorMsg('输入有误，请重试');
            }
          }
          // 隐藏加载图标
          tmmApp.hidePreloader();
        },
        // 失败后的回调函数
        function(dataRes, statusCode) {
          tmmApp.hidePreloader();
          mobLogin.showErrorMsg('网络超时，请重试');
        }
      );
    }
  },
  /**
   * @method sendSms
   * @description 发送手机短信，获取短信验证码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:39:15+0800
   */
  sendSms: function() {
    var loginName = $$('#tmm-mob-phone').val();
    var verifycode = $$('#tmm-mob-verifycode').val();
    if (!appFunc.isPhone(loginName)) {
      tmmApp.alert('手机号码格式不对');
    } else if (verifycode == '') {
      tmmApp.alert('图形验证码不能为空');
    } else {
      // 要发送的表单数据
      var data = {
          "phone": loginName,
          "verifyCode": verifycode,
          "TMM_CSRF": g_csrf
        }
        // 发送短信的按钮对象
      codeObj = $$('.get-code');
      // 发送获取短信验证码请求
      httpService.login_captcha_sms(
        data,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            // 成功后，60秒倒计时锁定发送按钮
            mobLogin.getCodeTimeOut();
            // 隐藏错误信息提示栏
            $$('.tmm-showMsg-li').hide();
          } else {
            // 处理表单错误时的提示
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                // 如果是验证码错误
                if (msgName == 'verifyCode') {
                  --verifycodeError;
                  // 错误三次后，刷新验证码
                  if (verifycodeError <= 0) {
                    mobLogin.refresh();
                  }
                }
                // 显示错误信息
                mobLogin.showErrorMsg(dataRes.form[msgName][0]);
              }
            } else {
              // 其它错误提醒
              mobLogin.showErrorMsg('输入有误，请重试');
            }
          }
          tmmApp.hidePreloader();
        },
        function(dataRes, statusCode) {
          tmmApp.hidePreloader();
          mobLogin.showErrorMsg('网络超时，请重试');
        }
      );

    }
  },
  /**
   * @method getCodeTimeOut
   * @description 60秒倒计时锁定发送短信按钮
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:42:07+0800
   */
  getCodeTimeOut: function() {
    if (waitTime === 0) {
      // 60秒到后解锁按钮,使其可点击
      codeObj.removeAttr('disabled');
      // 重置文本信息
      codeObj.html('获取验证码');
      // 重置回60秒
      waitTime = 60;
    } else {
      // 锁定按钮,使其不可点击
      codeObj.attr('disabled', true);
      // 倒计时提示文本
      codeObj.html(waitTime + '秒后重试');
      // 倒计时自减
      waitTime--;
      // 每秒回调
      setTimeout(function() {
        mobLogin.getCodeTimeOut();
      }, 1000);
    }

  },
  /**
   * @method refresh
   * @description 刷新验证码
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T11:36:30+0800
   */
  refresh: function() {
    // 重置错误次数
    verifycodeError = 3;
    // 请求获取验证码
    httpService.verifycode(
      function(csrf, dataRes, status) {
        // 把获取到的CSRF检验码赋给g_csrf
        g_csrf = csrf;
        g_hash = dataRes.hash1;
        // 把图片验证码连接显示到img元素标签上
        $$('.tmm-verifycode-img').attr('src', httpService.apiUrl + dataRes.url);
      },
      function(dataRes, status) {
        tmmApp.alert('网络超时，请重试');
        log.error('dataRes', dataRes, 'status', status);
      }
    );
  },
  /**
   * @method loginView
   * @description 显示登录页面
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T10:29:03+0800
   */
  loginView: function() {
    mobLogin.init();
    var output = appFunc.renderTpl(mob_login_template, {});
    // 删除缓存中重复的值
    appFunc.removeCachedPage('myView', 'mob-login');

    tmmApp.getCurrentView().router.load({
      content: output,
      animatePages: true
    });
  },
  /**
   * @method showErrorMsg
   * @description 在表单页面上显示错误消息
   * 
   * @param    {String} msg 要显示的信息
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T10:26:11+0800
   */
  showErrorMsg: function(msg) {
    $$('.tmm-showMsg-li').show();
    $$('.tmm-showMsg').html(msg);
  },
  bindEvent: function() {
    var bindings = [{
        element: '#myView',
        selector: '#tmm-mob-login-submit',
        event: 'click',
        handler: mobLogin.loginSubmit
      }, {
        element: '#myView',
        selector: '.tmm-verifycode-img',
        event: 'click',
        handler: mobLogin.refresh
      },
      // 获取短信验证码按钮
      {
        element: '#myView',
        selector: '.get-code',
        event: 'click',
        handler: mobLogin.sendSms
      }
    ];

    appFunc.bindEvents(bindings);
  }
};

module.exports = mobLogin;

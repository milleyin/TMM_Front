var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  acc_login_template = require('./acc-login.tpl.html');

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
 * 验证码错误的次数，3次错误后刷新
 * @type {Number}
 */
var verifycodeError = 3;

/**
 * @name accLogin
 * @description 帐号密码登录控制器
 * 
 * @author Moore Mo
 * @datetime 2015-10-27T11:36:30+0800
 */
var accLogin = {
  init: function() {
    appFunc.hideToolbar();
    log.info('accLogin init....');
    accLogin.bindEvent();
    accLogin.refresh();
  },
  /**
   * @method loginSubmit
   * @description 登录函数
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:04:28+0800
   */
  loginSubmit: function() {
    var loginName = $$('#tmm-phone').val();
    var password = $$('#tmm-password').val();
    var verifycode = $$('#tmm-verifycode').val();
    if (!appFunc.isPhone(loginName)) {
      tmmApp.alert('手机号码格式不对');
    } else if (!appFunc.validatePassword(password)) {
      tmmApp.alert('密码必须有数字和字母组合！');
    } else if (verifycode == '') {
      tmmApp.alert('验证码不能为空');
    } else if (! appFunc.validateVerifyCodeHash(verifycode, g_hash)) {
      tmmApp.alert('验证码不正确');
    } else {
      // 要发送的表单数据
      var data = {
        "UserLoginForm": {
          "phone": loginName,
          "password": password,
          "verifyCode": verifycode
        },
        "TMM_CSRF": g_csrf
      };

      tmmApp.showPreloader('正在登录...');
      // 发送登录请求
      httpService.login(
        data,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            // 隐藏错误信息提示栏
            $$('.tmm-showMsg-li').hide();
            // 正确后，请求到我的模块主页
            appFunc.setLocalUserInfo(dataRes.data.phone);
            tmmApp.getCurrentView().router.load({pageName:'myView'});
          } else {
            // 验证表单错误时的提示
            if (dataRes.form) {
              for (msgName in dataRes.form) {
                if (msgName == 'UserLoginForm_verifyCode') {
                  // 自减
                  --verifycodeError;
                  // 错误三次后，刷新验证码
                  if (verifycodeError <= 0) {
                    accLogin.refresh();
                  }
                }
                accLogin.showErrorMsg(dataRes.form[msgName][0]);
              }
            } else {
              accLogin.showErrorMsg('输入有误，请重试');
            }
          }
          tmmApp.hidePreloader();
        },
        function(dataRes, statusCode) {
          tmmApp.hidePreloader();
          tmmApp.alert('网络超时，请重试');
        }
      );
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
        g_hash =  dataRes.hash1;
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
    accLogin.init();
    // var output = appFunc.renderTpl(acc_login_template, {});
    var data = {
      phone: localStorage.getItem("phone")
    }
    var output = appFunc.renderTpl(acc_login_template, data);
    // 删除缓存中重复的值
    appFunc.removeCachedPage('myView', 'acc-login');

    tmmApp.getCurrentView().router.load({
      content: output,
      //ignoreCache: true,
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
      selector: '#tmm-acc-login-submit',
      event: 'click',
      handler: accLogin.loginSubmit
    }, {
      element: '#myView',
      selector: '.tmm-verifycode-img',
      event: 'click',
      handler: accLogin.refresh
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = accLogin;

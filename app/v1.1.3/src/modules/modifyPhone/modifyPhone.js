var appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService'),
  modify_template = require('./modify-phone.tpl.html'),
  loginModule = require('../login/login');

var timer = null; //定时器
var oldFlag = true; //能否点击获取验证码
var newFlag = true; //能否点击获取验证码

var modifyPhone = {
  init: function() {
    modifyPhone.bindEvent();
  },
  modifyPhone: function() {

  },
  /**
   * 显示修改手机页面
   * @return {[type]} [description]
   */
  showView: function() {
    var output = appFunc.renderTpl(modify_template, {});
    tmmApp.getCurrentView().router.load({
      content: output
    });
    modifyPhone.init();
  },

  /**
   * 点击获取旧手机号码短信验证的方法
   * @return {[type]} [description]
   */
  getOldNote: function() {
    if (!oldFlag) {
      return;
    }
    var str = $$('#oldPhoneNum').val();
    if (modifyPhone.checkPhone(str)) {

      var data = {
        'phone': str
      }
      httpService.getModifyPhoneCode(data, 'old', function(data) {
        var msg = '';
        if (data.status == 1) {
          modifyPhone.setTime($$('.get_old_code'), 'old');
        } else {
          if (data.form) {
            if (data.form.phone) {
              
              msg = data.form.phone[0];
            } else if (data.form.verifyCode) {
              msg = data.form.verifyCode[0];
            } else {
              msg = "发送数据失败";
            }
          } else {
            msg = "发送数据失败";
          }
          tmmApp.alert(msg);  

        }

      }, function(data) {
        tmmApp.alert('发送数据失败');
      });
    }

  },
  /**
   * 点击获取新手机号码短信验证的方法
   * @return {[type]} [description]
   */
  getNewNote: function() {
    if (!newFlag) {
      return;
    }
    var str = $$('#newPhoneNum').val();

    if (modifyPhone.checkPhone(str)) {

      var data = {
        'phone': str
      }
      httpService.getModifyPhoneCode(data, 'new', function(data) {
        var msg = '';
        if (data.status == 1) {
          modifyPhone.setTime($$('.get_new_code'), 'new');
        } else {
          if (data.form) {
            if (data.form.phone) {
              // alert(data.form.phone[0])
              msg = data.form.phone[0];
            } else if (data.form.verifyCode) {
              msg = data.form.verifyCode[0];
            } else {
              msg = "发送数据失败";
            }
          } else {
            msg = "发送数据失败";
          }
          tmmApp.alert(msg);

        }

      }, function(data) {
        tmmApp.alert('发送数据失败');
      });
    }

  },
  /**
   * 设置定时器
   */
  setTime: function(code, type) {
    var num = 60;
    if (type == 'old') {
      oldFlag = false;
    } else {
      newFlag = false;
    }

    code.html(--num + '秒后重新获取').addClass('disable');
    timer = setInterval(function() {
      if (num == 1) {
        code.html('获取验证码').removeClass('disable');
        if (type == 'old') {
          oldFlag = true;
        } else {
          newFlag = true;
        }
        clearInterval(timer);
      } else {
        code.html(--num + '秒后重新获取');
      }

    }, 1000);
  },

  /**
   * 手机号码验证
   * @param  {[type]} str 手机号
   * @return {[type]}     成功返回true，失败返回false
   */
  checkPhone: function(str) {

    if (appFunc.isEmpty(str)) {
      tmmApp.alert('手机号码不能为空');
      return false;
    } else if (!appFunc.isPhone(str)) {
      tmmApp.alert('手机号不是有效值');
      return false;
    }

    return true;
  },
  /**
   * 提交验证
   * @param  {[type]} str  手机号
   * @param  {[type]} code 验证码
   * @return {[type]}      [description]
   */
  checkSubmit: function(str, code) {
    if (modifyPhone.checkPhone(str)) {
      if (appFunc.isEmpty(code)) {
        tmmApp.alert('验证码不能为空');
        return false;
      }
      return true;
    }
    return false;
  },
  /**
   * 提交修改旧手机号验证码
   * @return {[type]} [description]
   */
  submitOldPhone: function() {
    var str = $$('#oldPhoneNum').val();
    var code = $$('#oldPhoneNote').val()
    if (!modifyPhone.checkSubmit(str, code)) {
      return;
    }
    var data = {
      "User": {
        "phone": str,
        "sms": code
      }
    }

    httpService.updateModifyPhone(data, 'old', function(data) {
      var msg = '';
      if (data.status == 1) {

        $$('.set-old-phone-wrap').css({
          'left': '-100%',
          'opacity': 0
        });
        $$('.set-new-phone-wrap').css('left', 0);
      } else {

        if (data.form) {
          if (data.form.User_sms) {
            msg = data.form.User_sms[0];
          } else {
            msg = '发送数据失败';
          }
        } else {
          msg = "发送数据失败";
        }
        tmmApp.alert(msg);

      }

    }, function(data) {
      tmmApp.alert('发送数据失败');
    });

  },
  /**
   * 提交修改新手机号验证码
   * @return {[type]} [description]
   */
  submitNewPhone: function() {
    var str = $$('#newPhoneNum').val();
    var code = $$('#newPhoneNote').val()
    if (!modifyPhone.checkSubmit(str, code)) {
      return;
    }
    var data = {
      "User": {
        "phone": str,
        "sms": code
      }
    }

    httpService.updateModifyPhone(data, 'new', function(data) {
      var msg = '';
      if (data.status == 1) {
        tmmApp.alert(msg, function() {
          modifyPhone.logout();
          // myView.router.back();
        });
      } else {

        if (data.form) {
          if (data.form.User_sms) {
            msg = data.form.User_sms[0];
          } else {
            msg = '发送数据失败';
          }
        } else {
          msg = "发送数据失败";
        }
        tmmApp.alert(msg);

      }

    }, function(data) {
      tmmApp.alert('发送数据失败');
    });

  },
  logout: function() {
      httpService.logout(
        function(dataRes, status) {
          if (dataRes.status == 1) {
            // 成功退出后，回到登录页面
            //meView.router.loadPage('tpls/login.html');
            appFunc.clearLocalUserInfo();
            loginModule.loginView();
          } else {
            // 弹框提示
            tmmApp.alert('网络超时，请重试');
          }
        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
          log.error('dataRes', dataRes, 'status', status);
        }
      );
  },
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.get_old_code',
      event: 'click',
      handler: modifyPhone.getOldNote
    }, {
      element: '#myView',
      selector: '.get_new_code',
      event: 'click',
      handler: modifyPhone.getNewNote
    }, {
      element: '#myView',
      selector: '#oldPhoneSubmit',
      event: 'click',
      handler: modifyPhone.submitOldPhone
    }, {
      element: '#myView',
      selector: '#newPhoneSubmit',
      event: 'click',
      handler: modifyPhone.submitNewPhone
    }];

    appFunc.bindEvents(bindings);
  }
}
module.exports = modifyPhone;

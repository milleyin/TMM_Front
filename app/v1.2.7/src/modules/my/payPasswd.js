var appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService'),
  payManageTpl = require('./pay-manage.tpl.html'),
  verfityPhoneTpl = require('./verify-phone.tpl.html'),
  setPasswdTpl = require('./setPasswd.tpl.html');

var type = 'passwd';
var info = {};
var modifyMessage = {
  '-3': '设置支付密码',
  '-2': '设置支付密码',
  '-1': '设置支付密码',
  '0': '设置支付密码',
  '1': '设置支付密码'
};
var passwd = '';
var oldPasswd = '';
var step = 1;
var timer = null;

var payPasswd = {
  init: function() {
    info = {
      type: {},
      data: {}
    };
    payPasswd.showView();
    payPasswd.bindEvent();

  },
  showView: function() {
    tmmApp.showIndicator();
    httpService.getPayPasswd(function(data) {
      tmmApp.hideIndicator();

      if (data.status == 1) {

        info.data = data.data;

        info.type.status = data.data.value;
        info.type.value = modifyMessage[data.data.value];
        var output = appFunc.renderTpl(payManageTpl, info)
        tmmApp.getCurrentView().router.load({
          content: output
        });
      } else {
        // tmmApp.alert('');
      }
    }, function() {
      tmmApp.hideIndicator();
    })

  },

  showVerifyPhone: function() {

    var dataVerifyPhone = {
      'phone': appFunc.replacePhone(JSON.parse(appFunc.getLocalUserInfo()).phone),
      'isPasswd': true
    }
    httpService.getIsvalidate(function(data) {

      if (data.status == 1) {
        if (data.data.value == 1) {
          payPasswd.setPasswd('current');
        } else {
          var output = appFunc.renderTpl(verfityPhoneTpl, dataVerifyPhone);
          tmmApp.getCurrentView().router.load({
            content: output,
          });
        }
      }
    }, function(data) {
      var output = appFunc.renderTpl(verfityPhoneTpl, dataVerifyPhone);
      tmmApp.getCurrentView().router.load({
        content: output,
      });
    });


  },

  getPhoneCode: function() {
    var self = this;

    httpService.getPhoneCode(info.data.sms_link, function(data) {

      if (data.status == 1) {
        payPasswd.wait60button(self);
      } else {
        if ('phone' in data.form) {
          tmmApp.alert(data.form['phone'][0]);
        }
      }
    }, function(data) {

    });
  },

  updatePhoneCode: function() {

    var sms_code = $$('#sms_code').val();
    if (sms_code == '') {
      tmmApp.alert('验证码不能为空');
      return;
    }

    clearInterval(timer);
    timer = null;

    var token = {
      "Password": {
        "sms": sms_code
      }
    }

    httpService.updatePayPasswd(info.data.validate, token, function(data) {

      if (data.status == 1) {
        payPasswd.setPasswd();
      } else {
        if ('Password_sms' in data.form) {
          tmmApp.alert(data.form['Password_sms'][0]);
        } else {
          tmmApp.alert('短信验证码 错误')
        }
      }
    }, function(data) {

      tmmApp.alert('网络错误');
    })

  },

  setPasswd: function(current) {
    if (current == 'current') {
      tmmApp.getCurrentView().router.load({
        content: setPasswdTpl,
      });
    } else {
      tmmApp.getCurrentView().router.load({
        content: setPasswdTpl,
        reload: true
      });
    }

    var container = tmmApp.getCurrentView().activePage.container;
    var keyboard = appFunc.keyboard(container);
    // 初始化
    passwd = '';
    oldPasswd = '';
    step = 1;
    keyboard.getTap(function(index) {
      payPasswd.passwd2box(index);
    });
  },

  passwd2box: function(index) {

    if (passwd.length >= 6) {
      if (index == 12) {
        passwd = passwd.substr(0, passwd.length - 1);
        $$('.passwd-wrap .passwd-item').each(function(index, obj) {

          if (index < passwd.length) {
            obj.className = 'passwd-item input';
          } else {
            obj.className = 'passwd-item';
          }
        });
      }
    } else {
      if (index == 11) {
        passwd += 0;
      } else if (index == 12) {

        passwd = passwd.substr(0, passwd.length - 1);

      } else if (index == 10) {

      } else {
        passwd += index;
      }

      $$('.passwd-wrap .passwd-item').each(function(index, obj) {

        if (index < passwd.length) {
          obj.className = 'passwd-item input';
        } else {
          obj.className = 'passwd-item';
        }
      });

    }

    payPasswd.checkPasswdConfirm();

  },

  wait60button: function(self) {
    var i = 60;
    $$(self).attr('disabled', true);
    i--;
    $$('#get_sms_code_passwd').html(i + '秒后重试');
    clearInterval(timer);
    timer = null;
    timer = setInterval(function() {
      if (i == 0) {
        $$(self).removeAttr('disabled');
        $$(self).html('获取验证码');
        clearInterval(timer);
        timer = null;
      } else {

        $$(self).html(i + '秒后重试');
        i--
      }

    }, 1000)
  },

  confirmPasswd: function() {

    if ($$(this).attr('data-flag') == 'disable') return;

    if (passwd == oldPasswd) {
      var token = {
        "Password": {
          "_pwd": oldPasswd,
          "_confirm_pwd": passwd
        }
      }

      httpService.updatePayPasswd(info.data.link, token, function(data) {

        var msg = '';
        if (data.status == 1) {
          tmmApp.getCurrentView().router.back();
          payPasswd.showView();
        } else {
          if ('Password__pwd' in data.form) {
            msg = data.form.Password__pwd[0];
          } else if ("Password__confirm_pwd" in data.form) {
            msg = data.form.Password__confirm_pwd[0];
          } else {
            msg = '密码验证不通过';
          }
          tmmApp.alert(msg, function(){
            // 密码重置
            payPasswd.resetPasswd();
          });  

        }
      }, function(data) {
        tmmApp.alert('网络错误');
      })

    } else {
      tmmApp.alert('两次密码输入不一致，请重新输入', function(){
        payPasswd.resetPasswd();
      });
    }

  },

  resetPasswd: function() {
    passwd = '';
    oldPasswd = '';
    step = 1;
    $$('.set-passwd-page .passwd-msg').html('请输入支付密码');
    $$('.set-passwd-page .passwd-button').css('display', 'none');
    payPasswd.passwd2box(10);
  },

  checkPasswdConfirm: function() {

    if (step == 1) {
      if (passwd.length == 6) {
        oldPasswd = passwd;
        passwd = '';
        payPasswd.passwd2box(10);

        step = 2;
        $$('.set-passwd-page .passwd-msg').html('请再次输入支付密码');
        $$('.set-passwd-page .passwd-button').css('display', 'block');
        $$('.set-passwd-page .passwd-button').addClass('disable').attr('data-flag', 'disable');
      }
    } else {
      if (passwd.length == 6) {
        $$('.set-passwd-page .passwd-button').removeClass('disable').attr('data-flag', 'able');
      } else {
        $$('.set-passwd-page .passwd-button').addClass('disable').attr('data-flag', 'disable');
      }
    }
  },

  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.set-pay-passwd',
      event: 'click',
      handler: payPasswd.showVerifyPhone
    }, {
      element: '#myView',
      selector: '#get_sms_code_passwd',
      event: 'click',
      handler: payPasswd.getPhoneCode
    }, {
      element: '#myView',
      selector: '#modify_passwd_end',
      event: 'click',
      handler: payPasswd.updatePhoneCode
    }, {
      element: '#myView',
      selector: '.set-passwd-page .passwd-button',
      event: 'click',
      handler: payPasswd.confirmPasswd
    }];

    appFunc.bindEvents(bindings);
  }

}

module.exports = payPasswd;

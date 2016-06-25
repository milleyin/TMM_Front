var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./modifyPwd.tpl.html'),
  httpService = require('../services/httpService'),
  myInfoTemplate = require('../myInfo/myinfo.tpl.html'),
  loginModule = require('../login/login');
  // accLoginModule = require('../accLogin/accLogin');

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
 * 是否显示错误信息
 * @type {Boolean}
 */
var isShow =false;
/**
 * 错误提示信息
 * @type {Object}
 */
var message = {};

var modifyPwd = {

  init: function() {
    appFunc.hideToolbar();
    modifyPwd.bindEvent();
  },
  showView: function(){
    modifyPwd.init();
    log.info('modifyPwd-init');
    var data ={
      phone: localStorage.getItem("phone"),
      is_set: localStorage.getItem("is_set")
    }; 
        
     log.info('电话号码：',data);
    //回填模板
    var output = appFunc.renderTpl(template, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    // //删除保存的号码
    // localStorage.removeItem("phone");
    // localStorage.removeItem("is_set");
  },

  getCode: function() {
    log.info('短信定时器-init');
    var data ={
      phone: localStorage.getItem("phone")
      // phone: "183591425296"
    }; 
    // modifyPwd.goTime();
    httpService.pwd_captcha_sms(
      data,
      function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            log.info("pwd_captcha_sms-getCode");
            modifyPwd.goTime();
          } else {
            if (dataRes.form) {
              tmmApp.alert(dataRes.form.phone[0],"");
            } else {
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
   * @method goTime
   * @description 60秒倒计时锁定发送短信按钮
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:42:07+0800
   */
  goTime: function() {
    if (waitTime === 0) {
      // 60秒到后解锁按钮,使其可点击
      $$(".get_code").removeAttr('disabled');
      // 重置文本信息
      $$(".get_code").html('获取验证码');
      // 重置回60秒
      waitTime = 60;
    } else {
      // 锁定按钮,使其不可点击
      $$(".get_code").attr('disabled', true);
      // 倒计时提示文本
      $$(".get_code").html(waitTime + '秒后重试');
      // 倒计时自减
      waitTime--;
      // 每秒回调
      setTimeout(function() {
        modifyPwd.goTime();
      }, 1000);
    }

  },
  updatePwd: function() {
    log.info('修改密码-init');
    var sms = $$("#sms").val(),
        pwd = $$("#pwd").val(),
        confirm_pwd = $$("#confirm_pwd").val();
    if(sms == "" || pwd == "" || confirm_pwd == "" || pwd!=confirm_pwd){
      if(sms == ""){
        // isShow = true;
        // message = "验证码不能为空";
        tmmApp.alert("验证码不能为空");
      }else if(pwd == ""){
        tmmApp.alert("密码不能为空");
        // isShow = true;
        // message = "密码不能为空";
      }else if(confirm_pwd == ""){
        tmmApp.alert("确认密码不能为空");
        // isShow = true;
        // message = "确认密码不能为空";
      }else if(pwd!=confirm_pwd){
        tmmApp.alert("两次输入的密码不一致");
        // isShow = true;
        // message = "两次输入的密码不一致";
      }
    }else{

      var token = {
          "User" : {
              "phone" : localStorage.getItem("phone"),
              "sms" : sms,
              "_pwd": pwd,
              "confirm_pwd": confirm_pwd
          }
      }
      log.info("修改密码表单数据",token.User);

      httpService.updatePwd(
        token,
        function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              log.info("pwd_captcha_sms-success！");
               // tmmApp.getCurrentView().router.back();
               // accLoginModule.loginView();
               // loginModule.loginView();
               modifyPwd.logout();
            } else {
              if (dataRes.form) {
                tmmApp.alert(dataRes.form.User_sms[0],"");
              } else {
                tmmApp.alert('网络超时，请重试');
              }
            }
          },
          function(dataRes, statusCode) {
            tmmApp.alert('网络超时，请重试');
          }
      );
    }

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
      selector: '.get_code',
      event: 'click',
      handler: modifyPwd.getCode
    },{
      element: '#myView',
      selector: '#updatePwd',
      event: 'click',
      handler: modifyPwd.updatePwd
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = modifyPwd;

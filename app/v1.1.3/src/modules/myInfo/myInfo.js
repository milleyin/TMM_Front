var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./myinfo.tpl.html'),
  httpService = require('../services/httpService'),
  loginModule = require('../login/login'),
  modifyModule = require('../modifyPhone/modifyPhone'),
  addRetinue = require('./addRetinue'),
  modifyPwdModule = require('../modifyPwd/modifyPwd');



var myInfo = {

  init: function() {
    myInfo.bindEvent();
  },
  /**
   * 获取用户信息
   * @return {[type]} [description]
   * @author 唐亚敏
   */
  getUserInfo: function() {
    myInfo.init();
    log.info('myInfo-getUserInfo-init');
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        //接收数据
        var infoData = {
          userInfo: dataRes.data.userInfo,
          main_retinueInfo: dataRes.data.main_retinueInfo.list,
          retinueInfo: dataRes.data.retinueInfo.list,
          tagsInfo: dataRes.data.tagsInfo,
          noMain: true,
          noOther: true
        };

        //保存电话号码、是否设置了密码
        localStorage.setItem("phone",infoData.userInfo.phone);
        localStorage.setItem("is_set",infoData.userInfo.is_set);
        
        log.info('myInfo-data-', infoData);

        // 隐藏正在加载的图标
        tmmApp.hideIndicator();

        //回填模板
        var output = appFunc.renderTpl(template, infoData);
        tmmApp.getCurrentView().router.load({
          content: output
        });
        appFunc.hideToolbar();
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );

  },
  /**
   * 刷新用户信息
   * @return {[type]} [description]
   * @author 唐亚敏
   */
  refreshUserInfo: function() {
    myInfo.init();
    log.info('myInfo-getUserInfo-init');
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        //接收数据
        var infoData = {
          userInfo: dataRes.data.userInfo,
          main_retinueInfo: dataRes.data.main_retinueInfo.list,
          retinueInfo: dataRes.data.retinueInfo.list,
          tagsInfo: dataRes.data.tagsInfo,
          noMain: true,
          noOther: true
        };

        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        //回填模板
        var output = appFunc.renderTpl(template, infoData);

        tmmApp.getCurrentView().router.load({
          content: output,
          reload: true,
          animatePages: false
        });
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );

  },

  /**
   * [changeGender 修改性别]
   * @return {[type]} [description]
   * @author 唐亚敏
   */
  changeGender: function() {
    log.info("changeGender-init");
    //原来的昵称 
    var nickname = $$('#nickname').text(),
        post_gender = '0';
    //选择按钮
    var buttons = [{
        text: '男',
        onClick: function() {
          var dataObj = {
            "User": {
              "nickname": nickname,
              "gender": "1"
            }
          };
          httpService.updateUserInfo(
            dataObj,
            function(dataRes, statusCode) {
              if (dataRes.status == 1) {
                myInfo.refreshUserInfo();
              } else {
                if (dataRes.form) {
                  tmmApp.alert(dataRes.form.User_nickname[0]);
                } else {
                  tmmApp.alert('网络超时，请重试');
                }
              }
            },
            function(dataRes, statusCode) {
              tmmApp.alert('网络超时，请重试');
            });
       } /*onClick*/
    },
    {
      text: '女',
      onClick: function() {
        var dataObj = {
            "User": {
              "nickname": nickname,
              "gender": "2"
            }
        };
        httpService.updateUserInfo(
          dataObj,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              myInfo.refreshUserInfo();
            } else {
              if (dataRes.form) {
                tmmApp.alert(dataRes.form.User_nickname[0]);
              } else {
                tmmApp.alert('网络超时，请重试');
              }
            }
          },
          function(dataRes, statusCode) {
            tmmApp.alert('网络超时，请重试');
          });
      }
    },
    {
      text: '取消',
      color: 'red'
    },];
      
    tmmApp.actions(buttons);
  },
  /**
  * [updateUserInfo 修改用户信息]
  * @return {[type]} [description]
  * @author 唐亚敏
  */
  updateUserInfo: function() {
    log.info("changeNickname-init-");
    //原来的昵称 、性别
    var nickname = $$('#nickname').text(),
      gender = $$('#gender').text();
    var post_gender = '0';
    //性别的文字装换为数字
    if (gender == "保密") {
      post_gender = '0';
    } else if (gender == "男") {
      post_gender = '1';
    } else if (gender == "女") {
      post_gender = '2';
    }
    log.info("nickname-", nickname, "gender", gender, "post_gender", post_gender);
    tmmApp.prompt('', '修改昵称', function(data) {
      // @data contains input value
      log.info("new-nickname-", dataObj);
      if(appFunc.getCharLength(data)<2 || appFunc.getCharLength(data)>11){
        tmmApp.alert("昵称 必须是2-11位字符组成");
        return false;
      }else{
        var dataObj = {
          "User": {
            "nickname": data,
            "gender": post_gender
          }
        };
        httpService.updateUserInfo(
          dataObj,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              myInfo.refreshUserInfo();
            } else {
              if (dataRes.form) {
                tmmApp.alert(dataRes.form.User_nickname[0]);
              } else {
                tmmApp.alert('网络超时，请重试');
              }
            }
          },
          function(dataRes, statusCode) {
            tmmApp.alert('网络超时，请重试');
          });
      }
    });
  },
  
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.myinfo-retinue',
      event: 'click',
      handler: addRetinue.showView
    }, {
      element: '#myView',
      selector: '.changeGender',
      event: 'click',
      handler: myInfo.changeGender
    }, {
      element: '#myView',
      selector: '.changeNickname',
      event: 'click',
      handler: myInfo.updateUserInfo
    },{
      // 修改手机号码
      element: '#myView',
      selector: '#modify-phone',
      event: 'click',
      handler: modifyModule.showView
    },{
      // 修改密码
      element: '#myView',
      selector: '#modify_pwd',
      event: 'click',
      handler: modifyPwdModule.showView
    }];

    appFunc.bindEvents(bindings);
  }
  };

module.exports = myInfo;

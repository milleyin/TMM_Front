var appFunc = require('../utils/appFunc'),
  template = require('./add-retinue.tpl.html'),
  myInfo = require('./myInfo'),
  httpService = require('../services/httpService');


var retinueInfo = {}

var addRetinue = {
  init: function() {
    addRetinue.bindEvent();
  },
  /**
   * 显示视图
   * @return {[type]} [description]
   */
  showView: function() {
    var _this = this;
    var link = $$(this).attr('data-link');
    // 1 修改随行人员; 2 添加随行人员; 3 修改主要联系人; 4 添加主要联系人
    var type = $$(this).attr('data-type');
    if (link) {


      httpService.getRetinue(link, function(data) {
        retinueInfo = data.data;

        if (type == 1) {
          retinueInfo.title = '修改随行人员';
          retinueInfo.type = 1;
          retinueInfo.canDelete = true;
          retinueInfo.emailTxt = '选填';
        } else {
          retinueInfo.title = '修改主要联系人';
          retinueInfo.type = 3;
          retinueInfo.readonly = true;
          retinueInfo.canDelete = false;
          retinueInfo.emailTxt = '必填';
        }

        var output = appFunc.renderTpl(template, retinueInfo);
        tmmApp.getCurrentView().router.load({
          content: output
        });
        addRetinue.init();
      }, function(data) {

      })
    } else {
      retinueInfo = {};
      if (type == 2) {
        retinueInfo.title = '添加随行人员';
        retinueInfo.type = 2;
        retinueInfo.canDelete = false;
        retinueInfo.emailTxt = '选填';
      } else {
        retinueInfo.title = '添加主要联系人';
        retinueInfo.type = 4;
        retinueInfo.phone = $$(_this).attr('data-phone');
        retinueInfo.canDelete = false;
        retinueInfo.emailTxt = '必填';
      }


      var output = appFunc.renderTpl(template, retinueInfo);
      tmmApp.getCurrentView().router.load({
        content: output
      });
      addRetinue.init();
    }


  },

  /**
   * 提交修改随行人员或主要联系人
   * @return {[type]} [description]
   */
  submitRetinue: function() {

    var name = $$('#retinueName').val();
    var identity = $$('#retinueIdentity').val();
    var phone = $$('#retinuePhone').val();
    var email = $$('#retinueEmail').val();

    var token = {
      "Retinue": {
        "name": name,
        "identity": identity,
        "phone": phone,
        "email": email
      }
    }

    if (addRetinue.checkName(name) && addRetinue.checkPhone(phone) && addRetinue.checkIdentity(identity) && addRetinue.checkEmail(email)) {
      httpService.updateRetinue(retinueInfo.update_link, token, retinueInfo.type, function(data) {
        var msg = '';
        if (data.status == 0) {
          if (data.form) {
            for (msgName in data.form) {
              tmmApp.alert(data.form[msgName][0]);
              break;
            }
          } else {
            tmmApp.alert('输入有误，请重试');
          }
        } else if (data.status == 1) { // 提交成功
          if (retinueInfo.type == 2 || retinueInfo.type == 4) {
            msg = '添加成功';
          } else {
            msg = '修改成功';
          }
          tmmApp.alert(msg, function() {

            tmmApp.getCurrentView().router.back();
          });
        }
      }, function(data) {
        tmmApp.alert('提交失败');
      })
    }
  },

  deleteRetinue: function() {
    tmmApp.confirm('确定删除吗?', function() {
      httpService.deleteRetinue(retinueInfo.delete_link, function(dataRes, statusCode) {
        tmmApp.alert('删除成功', function() {
          tmmApp.getCurrentView().router.back();
        });
      }, function(dataRes, statusCode) {
        tmmApp.alert('删除失败');
      });

    });
  },

  checkPhone: function(phone) {
    if (phone == '') {
      tmmApp.alert('手机号不能为空');
      return false;
    }
    if (phone.length != 11) {
      tmmApp.alert('手机号为11位数字');
      return false;
    } else if (!appFunc.isPhone(phone)) {
      tmmApp.alert('手机号不是有效值');
      return false;
    }
    return true;
  },
  checkName: function(name) {
    if (name == '') {
      tmmApp.alert('姓名不能为空');
      return false;
    }
    return true;
  },
  checkIdentity: function(identity) {
    if (identity == '') {
      tmmApp.alert('身份证号码不能为空');
      return false;
    }
    return true;
  },
  checkEmail: function(email) {
    if (!email) return true;
    if (appFunc.isEmail(email)) {
      return true;
    }
    tmmApp.alert('邮箱格式错误');
    return false;
  },


  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.myinfo-add',
      event: 'click',
      handler: addRetinue.showView
    }, {
      element: '#myView',
      selector: '#submitRetinue',
      event: 'click',
      handler: addRetinue.submitRetinue
    }, {
      element: '#myView',
      selector: '#deleteRetinue',
      event: 'click',
      handler: addRetinue.deleteRetinue
    }];

    appFunc.bindEvents(bindings);
  }

}

module.exports = addRetinue;

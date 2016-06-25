var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  selectRetinue_tpl = require('./selectRetinue.tpl.html'),
  template = require('../myInfo/add-retinue.tpl.html');



var info = {};
var initType = 0;
//var retinueSelectDefault = [];//保存复选框选中的值

var addRetinueShop = {
  init: function(type) {
    var _this = this;
    addRetinueShop.showView(type, _this);
    addRetinueShop.bindEvent();
  },

  showView: function(type, _this) {
    if (type == 2) {
      info.phone = '';
      info.title = '添加随行人员';
      info.emailTxt = '选填'
      info.type = 2;
      initType = 2;
    } else {
      info.phone = $$(_this).attr('data-phone');

      info.title = '添加主要联系人';
      info.emailTxt = '必填'
      info.type = 4;
    }

    var output = appFunc.renderTpl(template, info);
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },

  showList: function() {
    httpService.getUserInfo(function(dataRes) {

      info.userInfo = dataRes.data;
      var retinueBack = 0; //是否是返回按钮
      var popupHTML = appFunc.renderTpl(selectRetinue_tpl, info.userInfo);

      tmmApp.popup(popupHTML);
      if (info.userInfo.retinueInfo.list != null) {
        $$("#noRetinue").css('display', 'none');
      } else {
        $$("#noRetinue").css('display', 'block');
      }
      log.info("弹出层关闭事件------------新添加联系人", retinueSelectDefault);
      //随行人员的默认值
      $$.each($$('.select-retinue'), function(index, value) {
        for (var j = 0; j < retinueSelectDefault.length; j++) {
          if ($$(value).attr('data-id') == retinueSelectDefault[j]) {
            $$(value).attr('checked', 'checked');
          }
        }
      });

      $$('.retinueBackClose').on('click', function() {
        retinueBack = 1;
        tmmApp.closeModal('.popup')
      });

      //添加随行人员事件
      $$('.order-add-retinue').on('click', function() {
        // $$('.popup').
        tmmApp.closeModal('.popup')
        setTimeout(function() {
          addRetinueShop.init(2);

        }, 200)
      })


      //弹出层关闭事件
      $$('.popup').on('close', function() {
        var str = '';
        retinueSelect = [];
        if (retinueBack != 1) {
          retinueSelectDefault = [];
        }

        $$.each($$('.select-retinue'), function(index, value) {
          if ($$(value).prop('checked')) {
            if (retinueBack != 1) {
              retinueSelectDefault.push($$(value).attr('data-id'));
            }
            retinueSelect.push({
              'retinue_id': $$(value).attr('data-id'),
              'name': $$(value).val(),
              'is_main': "0"
            });

            str += '<div class="w_33 retinue">' + $$(value).val() + '</div>';
          }
        });
        if (retinueBack != 1) {
          $$('#tmm-order-retinue-list .retinue').remove();
          $$('#tmm-order-retinue-list').prepend(str);
        }
      });

    }, function(dataRes) {

    });
  },
  /**
   * 添加主要联系人和随行人员
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

    if (addRetinueShop.checkName(name) && addRetinueShop.checkPhone(phone) && addRetinueShop.checkIdentity(identity) && addRetinueShop.checkEmail(email)) {
      httpService.updateRetinue('', token, info.type, function(data) {
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
          msg = '添加成功'
          if (initType == 2) {
            tmmApp.alert(msg, '', function() {
              tmmApp.getCurrentView().router.back();
              addRetinueShop.showList();
            });
          } else {
            tmmApp.alert(msg, '', function() {
              tmmApp.getCurrentView().router.back();
            });
          }
        }
      }, function(data) {
        tmmApp.alert('提交失败');
      })
    }
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
      element: '#submitRetinue',
      event: 'click',
      handler: addRetinueShop.submitRetinue
    }];

    appFunc.bindEvents(bindings);
  }

}

module.exports = addRetinueShop;

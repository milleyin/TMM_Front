angular.module('resources', [])

.factory('Resource', function($rootScope, $http, $q, $log, $ionicLoading, security, ENV) {

  var api = ENV.apiEndpoint;


  var thenFactoryMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ', response);

      if (response.data.status === 1) {
        if (response.data.data.login === false) {
          $rootScope.$broadcast("getUserInfo", null);
          security.userInfo = null;
          security.login();

          return $q.reject({
            code: '1',
            msg: '您没有登录'
          });

        }

        var result = new Resource(response.data.data);
        return result;
      } else {
        return $q.reject({
          data: response.data.form,
          code: '0',
          msg: '没有相关数据'
        });
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg: '网络连接错误'
      });
    });
  };

  var Resource = function(data) {
    angular.extend(this, data);
  };
  var thenFactoryPostMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ', response);

      if (response.data.status === 1) {
        var result = new Resource(response.data.data);
        return result;
      } else {
        if (response.data.form) {
          for (var msgName in response.data.form) {
            // 显示错误信息
            return $q.reject({
              code: '1',
              msg: response.data.form[msgName][0],
              data: response.data
            });

          }
        } else {
          return $q.reject({
            code: '0',
            msg: '没有相关数据'
          });
        }
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg: '网络连接错误'
      });
    });
  };



  Resource.get = function(url) {
    var httpPromise = $http.get(url);
    return thenFactoryMethod(httpPromise);
  };


  Resource.post = function(url, data) {
    return $http.get(url + '&csrf=csrf').then(function(dataRes) {
      console.log(dataRes)
      if (dataRes.data.status == 1) {
        data.TMM_CSRF = dataRes.data.data.csrf.TMM_CSRF;
        var httpPromise = $http.post(url, data);
      } else {
        for (var msgName in dataRes.data.form) {
          // 显示错误信息
          return $q.reject({
            code: '1',
            msg: dataRes.data.form[msgName][0],
            data: dataRes.data
          });
        }
      }
      return thenFactoryPostMethod(httpPromise);

    }, function(dataRes) {

      return $q.reject(response);
    });
  };

  Resource.post2 = function(url1, url2, data) {
    return $http.get(url1 + '&csrf=csrf').then(function(dataRes) {
      data.TMM_CSRF = dataRes.data.data.csrf.TMM_CSRF;
      var httpPromise = $http.post(url2, data);
      return thenFactoryPostMethod(httpPromise);
    }, function(dataRes) {

      return $q.reject(response);
    });
  };

  /** 我的订单模块 **/
  // 获取觅境订单
  Resource.getMirror = function() {
    return this.get(api + '/index.php?r=store/store_order/index&type=order_dot_thrand');
  };
  // 获取觅趣订单
  Resource.getFun = function() {
    return this.get(api + '/index.php?r=store/store_order/index&type=actives_tour');
  };
  // 觅境接受订单
  Resource.mjAcceptOrder = function(id) {
    return this.get(api + '/index.php?r=store/store_order/receive&id=' + id);
  };
  // 觅境拒绝订单
  Resource.mjRefuseOrder = function(id) {
    return this.get(api + '/index.php?r=store/store_order/refuse&id=' + id);
  };

  // 确认消费
  Resource.confirmConsume = function(barcode) {
    return this.post(api + '/index.php?r=store/store_orderItems/scancode', { "code": barcode });
  };

  /** 我的订单模块 **/

  // 获取我的项目
  Resource.getItem = function() {
    return this.get(api + '/index.php?r=store/store_items/index');
  };

  //获取账号密码的csrf
  Resource.showAccCode = function() {
    return this.get(api + '/index.php?r=store/store_login/index&csrf=csrf');
  };

  //账号密码登录
  Resource.accLogin = function(data) {
    var accLoginUrl = api + '/index.php?r=store/store_login/index';
    return this.post(accLoginUrl, data);
  };

  //获取快捷方式登录的csrf
  Resource.showMobCode = function() {
    return this.get(api + '/index.php?r=store/store_login/login_sms&csrf=csrf');
  };

  //获取快捷方式短信验证码
  Resource.getMobCode = function(data) {
    var mobLoginUrl = api + '/index.php?r=store/store_login/captcha_sms';
    return $http.post(mobLoginUrl, data);
  };


  //快捷方式登录
  Resource.mobLogin = function(data) {
    var accLoginUrl = api + '/index.php?r=store/store_login/login_sms';
    return this.post(accLoginUrl, data);
  };

  //得到我的收入
  Resource.getAccount = function() {
    return this.get(api + '/index.php?r=store/store_accountLog/count');
  };

  //获取登录信息
  Resource.getMyInfo = function() {
    return this.get(api + '/index.php?r=store/store_home/index');
  };

  //退出登录
  Resource.loginOut = function() {
    return this.get(api + '/index.php?r=store/store_login/out');
  }

  //可提的现金
  Resource.getBurseInfo = function() {
    return this.get(api + '/index.php?r=store/store_account/view');
  }

  //获取银行卡的相关信息
  Resource.getCash = function() {
    return $http.get(api + '/index.php?r=store/store_store/store_bank');
  }

  //获取银行信息列表
  Resource.getBankList = function() {
    return this.get(api + '/index.php?r=store/store_store/bank_index');
  }

  //添加或者更换银行卡，提交验证银行卡的信息
  Resource.createBankCard = function(data) {
    var createBankCardUrl = api + '/index.php?r=store/store_store/bank';
    return this.post(createBankCardUrl, data);
  };

  //获取短信验证码
  Resource.getBankcardCode = function() {
    return this.get(api + '/index.php?r=store/store_store/captcha_bank_sms');
  }

  //验证更改银行卡的短信
  Resource.validateBankCardCode = function(data) {
    var withdrawMesUrl = api + '/index.php?r=store/store_store/bank_sms';
    return this.post(withdrawMesUrl, data);
  };

  //提现发送短信验证码之前先验证提现金额
  Resource.withdrawCash = function(data) {
    var withdrawCashUrl = api + '/index.php?r=store/store_cash/cash_verify_price';
    return this.post(withdrawCashUrl, data);
  };

  //获取银行提现短信验证码
  Resource.getWithDrawCode = function() {
    return this.get(api + '/index.php?r=store/store_cash/captcha_cash');
  };

  //获取所有提现记录
  Resource.getWithDrawRecord = function() {
    return this.get(api + '/index.php?r=store/store_cash/index&page=1');
  };

  //发送提现短信验证表单
  Resource.withdrawMessage = function(data) {
    var withdrawMessageUrl = api + '/index.php?r=store/store_cash/create';
    return this.post(withdrawMessageUrl, data);
  };

  // 修改密码发送短信验证码
  Resource.sendModifyPwdCode = function(phone) {
    var url1 = api + '/index.php?r=store/store_login/index';
    var url2 = api + '/index.php?r=store/store_store/captcha_pwd_sms';

    return this.post2(url1, url2, { "phone": phone });
  };

  // 修改密码
  Resource.modifyPwd = function(token) {
    var url = api + '/index.php?r=store/store_store/pwd';
    return this.post(url, token);
  };

  // 修改手机号：发送旧/新手机验证码
  Resource.getUpdatePhoneCode = function(token, type) {
    var url1 = api + '/index.php?r=store/store_login/index';
    var url2;
    if (type == 'old') {
      url2 = api + '/index.php?r=store/store_store/captcha_old_sms';
    } else {

      url2 = api + '/index.php?r=store/store_store/captcha_new_sms';
    }
    return this.post2(url1, url2, token);
  }

  // 修改手机号：提交旧手机
  Resource.updateOldPhone = function(token) {
    return this.post(api + '/index.php?r=store/store_store/phone_old', token)
  }

  // 修改手机号：提交新手机
  Resource.updateNewPhone = function(token) {
    return this.post(api + '/index.php?r=store/store_store/phone_new', token)
  }

  // 获取剩余保证金
  Resource.getDispoit = function() {
    return this.get(api + '/index.php?r=store/store_deposit/index');
  };

  //所有的交易记录记录
  Resource.getTradeRecord = function() {
    return this.get(api + '/index.php?r=store/store_accountLog/index&page=1');
  };

  //搜索记录
  Resource.getSearchList = function(searchOpt, key, value) {
    var searchUrl = "";
    if(searchOpt == 1){
      searchUrl = '/index.php?r=store/store_order/index&type=order_dot_thrand&' + key + '=' + value;
    } else if (searchOpt == 2) {
      searchUrl = '/index.php?r=store/store_order/index&type=actives_tour&' + key + '=' + value;
    }
    return this.get(api + searchUrl);
  };


  return Resource;

});

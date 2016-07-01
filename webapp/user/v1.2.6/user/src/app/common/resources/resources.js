angular.module('resources', ['security'])

.factory('Resource', function($http, $q, $log, $rootScope, $ionicLoading, security, ENV) {

  var api = ENV.apiEndpoint;


  var thenFactoryMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ',response);
  
      if (response.data.status === 1) {
        var result = new Resource(response.data.data);
        return result;
      } else {
        if (response.data.form) {
          for (var msgName in response.data.form) {
            // 显示错误信息
            return $q.reject({
              code: '0',
              msg:response.data.form[msgName][0]
            });
       
          }
        } else if (response.data.data.login === 0){
          $rootScope.$broadcast("getUserInfo", null);
          security.userInfo = null;
          security.login();

          return $q.reject({
            code: '2',
            msg:'您没有登录'
          });
        }  else {
          return $q.reject({
            code: '0',
            msg:'没有相关数据'
          });
        }
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg:'网络连接错误'
      });
    });
  };

  var thenFactoryPostMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ',response);
  
      if (response.data.status === 1) {
        var result = new Resource(response.data.data);
        return result;
      } else {
        if (response.data.form) {
          for (var msgName in response.data.form) {
            // 显示错误信息
            return $q.reject({
              code: '1',
              msg:response.data.form[msgName][0],
              data: response.data
            });
       
          }
        } else {
          return $q.reject({
            code: '0',
            msg:'没有相关数据'
          });
        }
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg:'网络连接错误'
      });
    });
  };

  var Resource = function(data) {
    angular.extend(this, data);
  };

  Resource.get = function(url) {
    var httpPromise = $http.get(url);
    return thenFactoryMethod(httpPromise);
  };

  Resource.post = function(url, data) {
    return this.get(url + '&csrf=csrf').then(function(response){
      data.TMM_CSRF = response.csrf.TMM_CSRF;
      var httpPromise = $http.post(url, data);
      return thenFactoryPostMethod(httpPromise);
    }, function(response){

      return $q.reject(response);
    });
  };

  /**
   * 用户信息模块
   */
  Resource.getRecommend = function() {
    return this.get(api + '/index.php?r=api/shops/selected&page=1');
  };

  Resource.getSeek = function() {
    return this.get(api + '/index.php?r=api/shops/index&page=1');
  };

  Resource.getUser = function() {
    return this.get(api + '/index.php?r=api/user/view');
  };

  Resource.logout = function() {
    return this.get(api + '/index.php?r=api/login/out');
  };

  Resource.postPraise = function(id) {
    var praiseUrl = api + '/index.php?r=api/shops/collect';
    return this.post(praiseUrl, {
      "Collect": {
        "shops_id": id,
        "user_address": ""
      }
    });
  };

  //获取登录用户信息
  Resource.getUserInfo = function() {
    return this.get(api + '/index.php?r=api/user/view');
  };

  //退出用户登录
  Resource.logOut = function() {
    return this.get(api + '/index.php?r=api/login/out');
  };

  //获取账号密码的csrf
  Resource.showAccCode = function() {
    return this.get(api + '/index.php?r=api/login/index&csrf=csrf');
  };

  //账号密码登录
  Resource.accLogin = function(data) {
    var accLoginUrl = api + '/index.php?r=api/login/index';
    return this.post(accLoginUrl, data);
  };

  //获取快捷方式登录的csrf
  Resource.showMobCode = function() {
    return this.get(api + '/index.php?r=api/login/login_sms&csrf=csrf');
  };

  //获取快捷方式短信验证码
  Resource.getMobCode = function(data) {
    var mobLoginUrl = api + '/index.php?r=api/login/captcha_sms';
    return $http.post(mobLoginUrl, data);
  };

  //快捷方式登录
  Resource.mobLogin = function(data) {
    var mobLoginUrl = api + '/index.php?r=api/login/login_sms';
    return this.post(mobLoginUrl, data);
  };

  /**
   * 我的钱包模块
   */
  
  //获取钱包余额
  Resource.getBurseInfo = function() {
    return this.get(api + '/index.php?r=api/account/my_burse');
  };

  //判断是否可以提现
  Resource.getCash = function() {
    return $http.get(api + '/index.php?r=api/bankCard/view_list');
  };

  //提现发送短信验证码之前先验证提现金额
  Resource.withdrawCash = function(data) {
    var withdrawCashUrl = api + '/index.php?r=api/Cash/cash_verify_price';
    return this.post(withdrawCashUrl, data);
  };

  //获取银行提现短信验证码
  Resource.getWithDrawCode = function() {
    return this.get(api + '/index.php?r=api/cash/captcha_cash');
  };

  //发送提现短信验证表单
  Resource.withdrawMessage = function(data) {
    var withdrawMesUrl = api + '/index.php?r=api/cash/create';
    return this.post(withdrawMesUrl, data);
  };

  //更换银行卡，得到所有的银行
  Resource.getBankList  = function() {
    return $http.get(api + '/index.php?r=api/bankCard/bank_index');
  };

  //添加或者更换银行卡，提交验证银行卡的信息
  Resource.createBankCard = function(data) {
    var createBankCardUrl = api + '/index.php?r=api/bankCard/create';
    return this.post(createBankCardUrl, data);
  };

  //获取更改银行卡短信验证码
  Resource.getBankcardCode = function() {
    return this.get(api + '/index.php?r=api/user/captcha_bank_sms');
  };

  //验证更改银行卡的短信
  Resource.validateBankCardCode = function(data) {
    var withdrawMesUrl = api + '/index.php?r=api/bankCard/bankcard_sms';
    return this.post(withdrawMesUrl, data);
  };

  //获取所有提现记录
  Resource.getWithDrawRecord = function() {
    return this.get(api + '/index.php?r=api/cash/index&page=1');
  };

  //获取所有的交易记录
  Resource.getTradeRecord = function() {
    return this.get(api + '/index.php?r=api/accountLog/index&page=1');
  };

  //设置支付密码，先得到相关信息
  Resource.getPayPasswd = function() {
    return this.get(api + '/index.php?r=api/password/view');
  };

  //设置支付密码，判断是否需要短信验证
  Resource.getIsvalidate = function() {
    return $http.get(api + '/index.php?r=api/password/isvalidate&type=0');
  };
  /**
   * 我的钱包模块结束
   */
  
  /**
   * 我的赞模块
   */
  Resource.getMyPraise = function() {
    return this.get(api + '/index.php?r=api/shops/praise&page=1');
  };
  /**
   * 我的赞模块结束
   */
  
  /**
   * 我的订单模块
   */
  //觅境和觅趣订单
  Resource.getOrderList = function(type) { //type用来判断是觅境还是觅趣
    return this.get(api + '/index.php?r=api/order/index&type='+ type+'&page=1');
  };



  //取消订单&&自费的活动取消报名
  Resource.orderCancle = function(id) {
    return this.get(api + '/index.php?r=api/order/cancel&id='+ id);
  };

  //支付订单
  Resource.orderPay = function(data) {
    var orderPayUrl = api + '/index.php?r=api/order/payment';
    return this.post(orderPayUrl, data);
  };

  // 微信支付
  Resource.weixinPay = function(id) {
    return this.get(api + '/api/order/paywx/id/' + id);
  };

   //发送支付密码
  Resource.sendPayPasswd = function(data, id) {
    var payPwdUrl = api + '/index.php?r=api/callback/account&id=' + id;
    return this.post(payPwdUrl, data);
  };

  // 修改用户昵称和性别
  Resource.updateUserInfo = function(data) {
    return this.post(api + '/index.php?r=api/user/update', data);
  };
  
  // 修改用户密码时获取的短信验证码
  Resource.getPwdCode = function(data) {
    return this.get(api + '/index.php?r=api/user/pwd' + '&csrf=csrf').then(function(response){
      data.TMM_CSRF = response.csrf.TMM_CSRF;
      var httpPromise = $http.post(api + '/index.php?r=api/user/captcha_pwd_sms', data);
      return thenFactoryPostMethod(httpPromise);
    }, function(response){

      return $q.reject(response);
    });
  };

  // 修改用户密码
  Resource.updatePwd = function(data) {
    return this.post(api + '/index.php?r=api/user/pwd', data);
  };

  /**
   * 修改手机号获取的验证码
   * @param  {[type]} data 发送数据
   * @param  {[type]} type 修改类型：old 获取旧手机的验证码，new 获取新手机的验证码。
   * @return {[type]}      [description]
   */

  Resource.getUpdatePhoneCode = function(data, type) {
    var url = '';
    var scrfUrl = '';
    if (type == 'old') {
      url = api + '/index.php?r=api/user/captcha_old_sms';
      scrfUrl = api + '/index.php?r=api/user/phone_old&csrf=csrf';
    } else if (type == 'new') {
      url = api + '/index.php?r=api/user/captcha_new_sms';
      scrfUrl = api + '/index.php?r=api/user/phone_new&csrf=csrf';
    }
    return this.get(scrfUrl).then(function(response){
      data.TMM_CSRF = response.csrf.TMM_CSRF;
      var httpPromise = $http.post(url, data);
      return thenFactoryPostMethod(httpPromise);
    }, function(response){

      return $q.reject(response);
    });
  };

  // 修改手机号：提交旧手机号
  Resource.updateOldPhone = function(data) {
    return this.post(api + '/index.php?r=api/user/phone_old', data);
  };

  // 修改手机号：提交新手机号
  Resource.updateNewPhone = function(data) {
    return this.post(api + '/index.php?r=api/user/phone_new', data);
  };

   /**
   * 我参加的觅趣模块
   */
  //得到参加的觅趣的列表
  Resource.getJoinActList = function(type) { //type用来判断是自费还是代付 1:自费 2:代付
    if(type == 1) { //1:自费
      return this.get(api + '/index.php?r=api/order/index&type=actives_tour&page=1');
    } else if (type == 2) { //2:代付
      return this.get(api + '/index.php?r=api/attend/index&page=1');
    }
  };
  
  //代付的取消报名
  Resource.orderEnterCancle = function(id) {
    return this.get(api + '/index.php?r=api/attend/delete&id='+ id);
  };

  //自费的确认出游
  Resource.tourConfirm = function(id) {
    return this.get(api + '/index.php?r=api/order/confirm&id='+ id);
  };

  /**
    * 搜索请求
    * @param  {[type]} key   [description]
    * @param  {[type]} value [description]
    * @return {[type]}       [description]
    */
  Resource.getSearchList = function(key, value) {
    return this.get(api + '/index.php?r=api/shops/index&' + key + '=' + value);
  };

  // 设置目的地
  Resource.getAreaList = function() {
    return this.get(api + '/index.php?r=api/area/index');
  };

  /**订单模块**/
  // 获点，线，觅趣的订单信息
  Resource.getOrderDetail = function(id) {
    return this.get(api + '/index.php?r=api/order/fare&id=' + id);
  };

  // 获点，线，觅趣的订单详情信息
  Resource.getOrderPayDetail = function(id) {
    return this.get(api + '/index.php?r=api/order/view&id=' + id);
  };
   /**
   * 我创建的觅趣模块
   */
  //我发起的觅趣列表
  Resource.getCreateActList = function() {
    return this.get(api + '/index.php?r=api/orderActives/index&page=1');
  };

  //编辑活动信息
  Resource.editActInfo = function(id, data) {
    var editActInfoUrl = api + '/index.php?r=api/actives/update&id=' + id;
    return this.post(editActInfoUrl, data);
  };
  /**
   * 我创建的觅趣模块结束
   */
  
  Resource.createOrder = function(data) {
    return this.post(api + '/index.php?r=api/order/create', data);
  };

  // 活动代付报名获取手机号
  Resource.getApplyCode = function(id, data) {
    return this.post(api + '/index.php?r=api/attend/captcha_sms&id=' + id, data);
  };

   // 活动代付报名
  Resource.actApply = function(id, data) {
    return this.post(api + '/index.php?r=api/attend/create&id=' + id, data);
  };

  //修改觅趣名称
  Resource.editActName = function(data, id) {
    var editActNameUrl = api + '/index.php?r=api/actives/UpdateShopsName&id=' + id;
    return this.post(editActNameUrl, data);
  };

  //修改觅趣人数
  Resource.editActNum = function(data, id) {
    var editActNumUrl = api + '/index.php?r=api/actives/UpdateNumber&id=' + id;
    return this.post(editActNumUrl, data);
  };



  /**
   * 发布觅趣模块
   */
  // 提交觅趣
  Resource.createAct = function(data) {
    return this.post(api + '/index.php?r=api/actives/create',data);
  };


  //修改付款方式
  Resource.editPayType = function(data, id) {
    var editPayTypeUrl = api + '/index.php?r=api/actives/UpdatePayType&id=' + id;
    return this.post(editPayTypeUrl, data);
  };

  //修改觅趣公开性
  Resource.editActOpen = function(data, id) {
    var editActOpenUrl = api + '/index.php?r=api/actives/UpdateIsOpen&id=' + id;
    return this.post(editActOpenUrl, data);
  };

  //修改觅趣出游时间
  Resource.editActGotime = function(data, id) {
    var editActGotimeUrl = api + '/index.php?r=api/actives/UpdateGoTime&id=' + id;
    return this.post(editActGotimeUrl, data);
  };

  //修改觅趣报名日期
  Resource.editEnrolldate = function(data, id) {
    var editEnrolldateUrl = api + '/index.php?r=api/actives/UpdateStartEndTime&id=' + id;
    return this.post(editEnrolldateUrl, data);
  };

  //修改觅趣服务费
  Resource.editTourPrice = function(data, id) {
    var editTourPriceUrl = api + '/index.php?r=api/actives/UpdateTourPrice&id=' + id;
    return this.post(editTourPriceUrl, data);
  };

  //更换行程
  Resource.changeLine = function(data, id) {
    var changeLineUrl = api + '/index.php?r=api/actives/UpdateThrand&id=' + id;
    return this.post(changeLineUrl, data);
  };

  // 获取微信sdk签名信息
  Resource.getWeixinToken = function(url) {
    return this.get( api + '/index.php?r=api/shops/wxgps&wxgps=wxgps&url=' + url);
  };

  // 设置定位信息
  Resource.setLoactionGPS = function(data) {
    return this.post( api + '/index.php?r=api/area/gps', data);
  };

  return Resource;
});
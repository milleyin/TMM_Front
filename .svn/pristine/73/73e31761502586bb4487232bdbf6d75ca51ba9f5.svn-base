/**
 * @name httpService
 * @description 封装相关api请求的服务函数模块
 * 
 * @author Moore Mo
 * @datetime 2015-10-24T01:15:42+0800
 */
require('framework7');
var log = require('../utils/log');
/**
 * 远程接口地址
 * @type {String}
 */
// 测试服上
var apiServerHost = 'http://test2.365tmm.net';
// var apiServerHost = 'http://localhost/tmm';
//var apiServerHost = 'http://172.16.1.103/tmm';
// 正式服上
// var apiServerHost = 'https://m.365tmm.com';

var httpService = {
  apiUrl: apiServerHost,
  /**
   * @method verifycode
   * @description 获取验证码接口
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：scrf 表单检验码 dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:17:15+0800
   */
  verifycode: function(successCb, errorCb) {
    // 获取成功后回调
    var callback = function(dataRes, statusCode) {
      var scrf = dataRes.data.csrf.TMM_CSRF;
      // 再次请求，获取图片验证码的链接
      $$.ajax({
        method: 'GET',
        url: apiServerHost + dataRes.data.verifyCode,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('verifycode---callback---', dataRes);

          successCb(scrf, dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('verifycode---callback---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };
    // 请求拿取验证码连接
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/login/index' + '&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('verifycode---', dataRes);

        if (dataRes.status == 1) {
          // 成功后，回调获取图片验证码的链接
          callback(dataRes, statusCode);
        } else {
          //errorCb(dataRes, statusCode);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('verifycode---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method login
   * @description 登录接口
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:22:07+0800
   */
  login: function(data, successCb, errorCb) {
    $$.ajax({
      method: 'POST',
      url: apiServerHost + '/index.php?r=api/login/index',
      data: data,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('login---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('login---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method logout
   * @description 退出登录接口
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:24:27+0800
   */
  logout: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/login/out',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('logout---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('logout---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method login_captcha_sms
   * @description 登录时，获取手机短信验证码接口
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:24:42+0800
   */
  login_captcha_sms: function(data, successCb, errorCb) {
    $$.ajax({
      method: 'POST',
      url: apiServerHost + '/index.php?r=api/login/captcha_sms',
      data: data,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('login_captcha_sms---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('login_captcha_sms---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method login_sms
   * @description 手机短信登录接口
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:26:12+0800
   */
  login_sms: function(data, successCb, errorCb) {
    $$.ajax({
      method: 'POST',
      url: apiServerHost + '/index.php?r=api/login/login_sms',
      data: data,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('login_sms---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('login_sms---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getUserInfo
   * @description 获取用户信息
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T11:13:48+0800
   */
  getUserInfo: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/user/view',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);



        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getUserInfo---', dataRes);
        errorCb(dataRes, statusCode);

      }
    });
  },
  /**
   * @method getBurseInfo
   * @description 获取我的钱包
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-06T15:10:02+0800
   */
  getBurseInfo: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/account/my_burse',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.error('getBurseInfo---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getBurseInfo---', dataRes);
        errorCb(dataRes, statusCode);

      }
    });
  },
  /**
   * @method updateUserInfo
   * @description 更新用户信息（昵称，性别）
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T17:30:08+0800
   */
  updateUserInfo: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      log.info("nihao", data);
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/user/update',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('updateUserInfo---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('updateUserInfo---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/user/update&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('updateUserInfo---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getCashInfo
   * @description 获取提现申请记录
   *
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-06T15:13:13+0800
   */
  getCashInfo: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/cash/index',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.error('getCashInfo---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getCashInfo---', dataRes);
        errorCb(dataRes, statusCode);

      }
    });
  },
  /**
   * @method getCashBank
   * @description 用户提现时获取银行账户信息
   *
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-06T15:17:08+0800
   */
  getCashBank: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/cash/create',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getCashBank---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getCashBank---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method captchaCash
   * @description 用户提现，获取短信验证码
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-06T15:21:30+0800
   */
  captchaCash: function(data, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/cash/captcha_cash',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('captchaCash---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('captchaCash---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method createCash
   * @description 用户提现
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-06T15:19:49+0800
   */
  createCash: function(data, successCb, errorCb) {
    $$.ajax({
      method: 'POST',
      url: apiServerHost + '/index.php?r=api/cash/create',
      data: data,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('createCash---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('createCash---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getRecommendList
   * @description 获取收入列表接口
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:27:39+0800
   */
  getRecommendList: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/shops/selected',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getRecommendList---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getRecommendList---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getRecommendListToPage
   * @description 获取收入列表接口（根据分页链接）
   *
   * @param    String} url 分页链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T01:27:39+0800
   */
  getRecommendListToPage: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/selected&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getRecommendListToPage---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getRecommendListToPage---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getOrderDetail
   * @description 获取订单的详情
   * @param    String} url 点的请求链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T14:48:52+0800
   */
  getOrderDetail: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getOrderDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getOrderDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getOrderList
   * @description 获取订单列表接口
   * @param    {Functoin} type      选择全部 0, 觅镜 1， 觅趣 2
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T17:31:38+0800
   */
  getOrderList: function(type, successCb, errorCb) {
    if (type == 0) {
      type = '';
    } else if (type == 1) {
      type = '&type=order_dot_thrand';
    } else if (type == 2) {
      type = '&type=order_tour';
    } else {
      return;
    }
    url = apiServerHost + '/index.php?r=api/order/index' + type;

    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getOrderList---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getOrderList---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * 获取活动列表接口
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  getOrderActList: function(url, successCb, errorCb) {
    url = url || apiServerHost + '/index.php?r=api/order/index&type=actives_tour';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);


        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getOrderListToPage
   * @description 获取订单列表接口（根据分页链接）
   *
   * @param    String} url 分页链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T17:32:38+0800
   */
  getOrderListToPage: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/order/index&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getOrderListToPage---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getOrderListToPage---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getDotDetail
   * @description 获取点的详情
   * 
   * @param    String} url 点的请求链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-26T20:10:17+0800
   */
  getDotDetail: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getDotDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getDotDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getLineDetail
   * @description 获取线的详情
   * 
   * @param    String} url 线的请求链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-26T20:10:17+0800
   */
  getLineDetail: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getLineDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getLineDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getActDetail
   * @description 获取活动的详情
   * 
   * @param    String} url 活动的请求链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-26T20:10:17+0800
   */
  getActDetail: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getActDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getActDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },

  /**
   * 获取探索页面详情
   * @param  {[type]} url       [description]
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   *
   * @author daixi
   */
  getSeekList: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/index';

    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('getSeekList---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getSeekList---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });

  },
  /**
   * @method getItemDetail
   * @description 获取项目的详情
   * 
   * @param    String} url 项目的请求链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T16:52:01+0800
   */
  getItemDetail: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getItemDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getItemDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method shopCollect
   * @description 商品点赞
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T17:30:08+0800
   */
  shopCollect: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/shops/collect',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('shopCollect---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('shopCollect---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/shops/collect&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('shopCollect---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @description 获取“我的赞”的列表
   */
  getMyPraiseList: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/shops/praise',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getMyPraiseList---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getMyPraiseList---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },

  getMyPraiseListToPage: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/praise&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('getMyPraiseListToPage---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getMyPraiseListToPage---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },

  getSeekSearchList: function(type, typeValue, url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/index&' + type + '=' + typeValue;
    log.info("路径路径", url);
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getMySeekSeachToPage---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },

  /**
   * [pwd_captcha_sms 修改密码获取短信接口]
   * @param  {[type]} data      [description]
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  pwd_captcha_sms: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf.data.csrf.TMM_CSRF;
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/user/captcha_pwd_sms',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('pwd_captcha_sms---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('pwd_captcha_sms---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };
    // 请求拿取验证码连接
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=/api/user/pwd' + '&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('verifycode---', dataRes);

        if (dataRes.status == 1) {
          // 成功后，回调获取图片验证码的链接
          callback(dataRes, statusCode);
        } else {
          //errorCb(dataRes, statusCode);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('verifycode---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * [updatePwd 修改密码接口]
   * @param  {[type]} data      [description]
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  updatePwd: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf.data.csrf.TMM_CSRF;
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/user/pwd',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('pwd_captcha_sms---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('pwd_captcha_sms---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };
    // 请求拿取验证码连接
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=/api/user/pwd' + '&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        log.info('verifycode---', dataRes);

        if (dataRes.status == 1) {
          // 成功后，回调获取图片验证码的链接
          callback(dataRes, statusCode);
        } else {
          //errorCb(dataRes, statusCode);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('verifycode---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });



  },

  /**
   * 修改手机号模块 获取手机号验证码
   * @param  {[type]} data      发送的数据
   * @param  {[type]} type      判断是新号还是老号
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   *
   * @author daixi
   */
  getModifyPhoneCode: function(data, type, successCb, errorCb) {
    var url = '';
    var scrfUrl = '';
    if (type == 'old') {
      url = apiServerHost + '/index.php?r=api/user/captcha_old_sms';
      scrfUrl = apiServerHost + '/index.php?r=api/user/phone_old&csrf=csrf';
    } else if (type == 'new') {
      url = apiServerHost + '/index.php?r=api/user/captcha_new_sms';
      scrfUrl = apiServerHost + '/index.php?r=api/user/phone_new&csrf=csrf';
    }

    var callback = function(csrf) {
      data.TMM_CSRF = csrf;


      $$.ajax({
        method: 'POST',
        url: url,
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);


          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('shopCollect---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: scrfUrl,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {

        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },

  /**
   * 修改手机号模块 提交修改手机号
   * @param  {[type]} data      发送的数据
   * @param  {[type]} type      [判断是新号还是老号]
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  updateModifyPhone: function(data, type, successCb, errorCb) {
    var url = '';
    var scrfUrl = '';
    if (type == 'old') {
      url = apiServerHost + '/index.php?r=api/user/phone_old';
      scrfUrl = apiServerHost + '/index.php?r=api/user/phone_old&csrf=csrf'
    } else if (type == 'new') {
      url = apiServerHost + '/index.php?r=api/user/phone_new';
      scrfUrl = apiServerHost + '/index.php?r=api/user/phone_new&csrf=csrf'
    }

    var callback = function(csrf) {
      data.TMM_CSRF = csrf;

      $$.ajax({
        method: 'POST',
        url: url,
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {

          var dataRes = JSON.parse(dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('shopCollect---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: scrfUrl,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {

        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });

  },
  /**
   * @method orderCancle
   * @description 取消订单
   * 
   * @param    {Int}   id 订单id
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T18:38:18+0800
   */
  orderCancle: function(id, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/cancel&id=' + id,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('orderCancle---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('orderCancle---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method orderPay
   * @description 订单支付
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-28T18:42:44+0800
   */
  orderPay: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/order/payment',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('orderPay---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('orderPay---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/payment&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('orderPay---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },

  /**
   * 获取随行人员或者主要联系人信息
   * @param  {[type]} url       api连接
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  getRetinue: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {

        errorCb(dataRes, statusCode);
      }
    });
  },

  /**
   * 提交修改随行人员或主要联系人信息
   * @param  {[type]} url       api连接
   * @param  {[type]} data      数据
   * @param  {[type]} type      1 修改随行人员; 2 添加随行人员; 3 修改主要联系人; 4 添加主要联系人
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  updateRetinue: function(url, data, type, successCb, errorCb) {
    var urlApi = '';
    if (type == 1 || type == 3) {
      urlApi = url;
    } else if (type == 2) {
      urlApi = apiServerHost + '/index.php?r=api/retinue/create&type=0';
    } else if (type == 4) {
      urlApi = apiServerHost + '/index.php?r=api/retinue/create&type=1';
    }

    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      $$.ajax({
        method: 'POST',
        url: urlApi,
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/retinue/create&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {

        errorCb(dataRes, statusCode);
      }
    });
  },


  /**
   * 删除随行人员或者主要联系人
   * @param  {[type]} successCb [description]
   * @param  {[type]} errorCb   [description]
   * @return {[type]}           [description]
   */
  deleteRetinue: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {

        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method orderCreate
   * @description 创建订单
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-29T17:27:01+0800
   */
  orderCreate: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      data = JSON.stringify(data);
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/order/create',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {

          var dataRes = JSON.parse(dataRes);
          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/create&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('orderCreate---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @getFareOrder
   * @description  获点，线，活动的订单信息
   * 
   * @param    {Int}   id 点id
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-29T17:29:14+0800
   */
  getFareOrder: function(id, successCb, errorCb) {

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/fare&id=' + id,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('getFareDot---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getFareDot---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   *
   */
  getQrCode: function(link, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: link,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method actCreate
   * @description 创建活动
   * 
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T11:03:30+0800
   */
  actCreate: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;

      data = JSON.stringify(data);

      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/actives/create',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/actives/create&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('orderCreate---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method actUpdate
   * @description 编辑活动
   *
   * @param    {Int}      id   活动id
   * @param    {Object}   data 要发送的表单数据 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T11:03:30+0800
   */
  actUpdate: function(id, data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;

      data = JSON.stringify(data);

      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/actives/update&id=' + id,
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/actives/update&csrf=csrf&id=' + id,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('orderCreate---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getOrderActivesList
   * @description 我发起的活动列表
   *
   * @param    {String}   url       分页链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T11:24:10+0800
   */
  getOrderActivesList: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/orderActives/index&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('getOrderActivesList---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getOrderActivesList---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },

  getActStateDetail: function(url, successCb, errorCb) {
    //log.info("测试状态路径", url);
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);

        //log.info('getActStateDetail---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getActStateDetail---', dataRes);

        errorCb(dataRes, statusCode);
      }
    });
  },

  setActityGoTime: function(goTimeLink, data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      log.info("nihao", goTimeLink);
      $$.ajax({
        method: 'POST',
        //url: apiServerHost + '/index.php?r=api/orderActives/gotime&id=' + goTimeValue,
        url: goTimeLink,
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          log.info('setActityGoTime---', dataRes);

          successCb(dataRes, statusCode);
        },
        error: function(dataRes, statusCode) {
          log.error('setActityGoTime---', dataRes);

          errorCb(dataRes, statusCode);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/orderActives/gotime&csrf=csrf&id=' + goTimeLink,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }
      },
      error: function(dataRes, statusCode) {
        log.error('setActityGoTime---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },

  ActivityEnrollInfoList: function(url, successCb, errorCb) {
    url = url;
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);


        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getLineList
   * @description 获取线的列表
   *
   * @param    {String}   url       分页链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T15:33:59+0800
   */
  getLineList: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/index&select_dot_thrand=thrand&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('getLineList---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getLineList---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  /**
   * @method getDotList
   * @description 获取线的列表
   *
   * @param    {String}   url       分页链接
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T15:33:59+0800
   */
  getDotList: function(url, successCb, errorCb) {
    var url = url || apiServerHost + '/index.php?r=api/shops/index&select_dot_thrand=dot&page=1';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('getDotList---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getDotList---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },
  tourConfirm: function(value, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/confirm&id=' + value,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        log.info('tourConfirm---', dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.info('errorConfirm---', dataRes);
        errorCb(dataRes, statusCode);
      }
    });
  },

  // 获取地区列表数据
  getAreaList: function(successCb, errorCb) {
    var url = apiServerHost + '/index.php?r=api/area/index';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },

  // 获取本地定位数据
  getLocationCity: function(successCb, errorCb) {
    var url = apiServerHost + '/index.php?r=api/area/get';
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },

  // 切换城市
  setSelectCity: function(url, successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: url,
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        var dataRes = JSON.parse(dataRes);
        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      }
    });
  },
  // 提交GPS定位城市
  setGPSCity: function(data, successCb, errorCb) {
    var callback = function(csrf) {
      data.TMM_CSRF = csrf;
      console.log('----------',data)
      $$.ajax({
        method: 'POST',
        url: apiServerHost + '/index.php?r=api/area/gps',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function(dataRes, statusCode) {
          var dataRes = JSON.parse(dataRes);

          successCb(dataRes);
        },
        error: function(dataRes, statusCode) {
          errorCb(dataRes);
        }
      });
    };

    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/area/gps&csrf=csrf',
      xhrFields: {
        withCredentials: true
      },
      success: function(dataRes, statusCode) {
        
        var dataRes = JSON.parse(dataRes);
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        }

      },
      error: function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);

      }
    });
  }

};

module.exports = httpService;

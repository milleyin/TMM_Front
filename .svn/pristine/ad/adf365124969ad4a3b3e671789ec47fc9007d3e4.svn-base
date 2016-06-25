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
var apiServerHost = 'http://test.365tmm.net';

var httpService = {
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

        log.info('getUserInfo---', dataRes);

        successCb(dataRes, statusCode);
      },
      error: function(dataRes, statusCode) {
        log.error('getUserInfo---', dataRes);

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
   * @method getOrderList
   * @description 获取订单列表接口
   * 
   * @param    {Functoin} successCb 成功后的回调函数 
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @param    {Functoin} errorCb   失败后的回调函数
   * 参数为：dataRes 响应回来的数据 statusCode 状态码
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T17:31:38+0800
   */
  getOrderList: function(successCb, errorCb) {
    $$.ajax({
      method: 'GET',
      url: apiServerHost + '/index.php?r=api/order/index',
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
};

module.exports = httpService;

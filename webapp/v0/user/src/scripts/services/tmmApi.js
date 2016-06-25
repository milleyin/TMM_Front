'use strict';
/**
 * @ngdoc module
 * @name tmmApi
 * @description API模块
 *  
 * @author Moore Mo
 * @datetime 2015-11-08T10:42:48+0800
 */
angular.module('tmm.services')

/**
 * @ngdoc function
 * @name  getVerifycode
 * @description 获取验证码
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：scrf 表单检验码 dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T10:42:48+0800
 */
.factory('getVerifycode', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    // 获取成功后回调
    var callback = function(dataRes, statusCode) {
      var csrf = dataRes.data.csrf.TMM_CSRF;
      // 再次请求，获取图片验证码的链接
      $http.get(sessionData.locData.apiHost + dataRes.data.verifyCode)
        .success(function(dataRes, statusCode) {
          log.info('getVerifycode...', dataRes);
          successCb(csrf, dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('getVerifycode...', dataRes);
          errorCb(statusCode);
        });
    };
    $http.get(sessionData.locData.apiHost + '/index.php?r=api/login/index' + '&csrf=csrf')
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          // 成功后，回调获取图片验证码的链接
          callback(dataRes, statusCode);
        } else {
          //errorCb(dataRes, statusCode);
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name login
 * @description 手机密码登录
 *
 * @param {Object} dataPost 要发表的表单数据
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T10:41:19+0800
 */
.factory('login', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    $http.post(
        sessionData.locData.apiHost + '/index.php?r=api/login/index',
        dataPost
      )
      .success(function(dataRes, statusCode) {
        log.info('login...', dataRes);
        successCb(dataRes);
      })
      .error(function(dataRes, statusCode) {
        log.error('login...', dataRes);
        errorCb(statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name logout
 * @description 退出登录
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T10:50:54+0800
 */
.factory('logout', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(sessionData.locData.apiHost + '/index.php?r=api/login/out')
      .success(function(dataRes, statusCode) {
        log.info('logout...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('logout...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name loginCaptachSms
 * @description 手机登录时，获取短信验证码
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T10:53:57+0800
 */
.factory('loginCaptachSms', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    $http.post(
        sessionData.locData.apiHost + '/index.php?r=api/login/captcha_sms',
        dataPost
      )
      .success(function(dataRes, statusCode) {
        log.info('loginCaptachSms...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('loginCaptachSms...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name loginSms
 * @description 手机短信验证码登录
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:14:03+0800
 */
.factory('loginSms', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    $http.post(
        sessionData.locData.apiHost + '/index.php?r=api/login/login_sms',
        dataPost
      )
      .success(function(dataRes, statusCode) {
        log.info('loginSms...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('loginSms...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getUserInfo
 * @description 获取用户信息
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:14:21+0800
 */
.factory('getUserInfo', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/user/view'
      )
      .success(function(dataRes, statusCode) {
        log.info('getUserInfo...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getUserInfo...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

.factory('userService', function($http, $q, log, sessionData) {
  return {
   getUserInfo: function() {
     var deferred = $q.defer();
     $http.get(sessionData.locData.apiHost + '/index.php?r=api/user/view')
       .success(function(dataRes) { 
          deferred.resolve({
            'dataRes': dataRes
          });
       }).error(function(msg, code) {
          deferred.reject(msg);
          log.error(msg, code);
       });
     return deferred.promise;
   }
  }
 })

/**
 * @ngdoc function
 * @name updateUserInfo
 * @description 更新用户信息（昵称，性别）
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:15:57+0800
 */
.factory('updateUserInfo', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/user/update',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('updateUserInfo...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('updateUserInfo...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/user/update&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name pwdCaptchaSms
 * @description 修改密码时获取短信验证码
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:32:49+0800
 */
.factory('pwdCaptchaSms', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/user/captcha_pwd_sms',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('pwdCaptchaSms...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('pwdCaptchaSms...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/user/pwd&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name updatePwd
 * @description 修改密码
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:32:49+0800
 */
.factory('updatePwd', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/user/pwd',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('updatePwd...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('updatePwd...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/user/pwd&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name updatePhoneCaptchaSms
 * @description 修改手机号时获取手机号验证码
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {String}   type    判断是新号还是老号
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:38:26+0800
 */
.factory('updatePhoneCaptchaSms', function($http, log, sessionData) {
  return function(dataPost, type, successCb, errorCb) {
    var url = '';
    var scrfUrl = '';
    if (type == 'old') {
      url = sessionData.locData.apiHost + '/index.php?r=api/user/captcha_old_sms';
      scrfUrl = sessionData.locData.apiHost + '/index.php?r=api/user/phone_old&csrf=csrf';
    } else if (type == 'new') {
      url = sessionData.locData.apiHost + '/index.php?r=api/user/captcha_new_sms';
      scrfUrl = sessionData.locData.apiHost + '/index.php?r=api/user/phone_new&csrf=csrf';
    }
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          url,
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('updatePhoneCaptchaSms...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('updatePhoneCaptchaSms...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        scrfUrl
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name updatePhone
 * @description 修改手机号
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {String}   type    判断是新号还是老号
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:40:53+0800
 */
.factory('updatePhone', function($http, log, sessionData) {
  return function(dataPost, type, successCb, errorCb) {
    var url = '';
    var scrfUrl = '';
    if (type == 'old') {
      url = sessionData.locData.apiHost + '/index.php?r=api/user/phone_old';
      scrfUrl = sessionData.locData.apiHost + '/index.php?r=api/user/phone_old&csrf=csrf';
    } else if (type == 'new') {
      url = sessionData.locData.apiHost + '/index.php?r=api/user/phone_new';
      scrfUrl = sessionData.locData.apiHost + '/index.php?r=api/user/phone_new&csrf=csrf';
    }
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          url,
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('updatePhone...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('updatePhone...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        scrfUrl
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getRetinue
 * @description 获取随行人员
 *
 * @param {String}      url 随行人员链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:44:33+0800
 */
.factory('getRetinue', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getRetinue...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getRetinue...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name updateRetinue
 * @description 修改随行人员或主要联系人信息
 * @param    {String}   url      请求的api地址
 * @param    {type}     type   1 修改随行人员; 2 添加随行人员; 3 修改主要联系人; 4 添加主要联系人
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {String}   type    判断是新号还是老号
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:40:53+0800
 */
.factory('updateRetinue', function($http, log, sessionData) {
  return function(url, type, dataPost, successCb, errorCb) {
    var urlApi = '';
    if (type == 1 || type == 3) {
      urlApi = url;
    } else if (type == 2) {
      urlApi = sessionData.locData.apiHost + '/index.php?r=api/retinue/create&type=0';
    } else if (type == 4) {
      urlApi = sessionData.locData.apiHost + '/index.php?r=api/retinue/create&type=1';
    }
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          urlApi,
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('updateRetinue...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('updateRetinue...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/retinue/create&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name deleteRetinue
 * @description 删除随行人员或者主要联系人
 *
 * @param    {String}   url     执行删除的api
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:21:12+0800
 */
.factory('deleteRetinue', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('deleteRetinue...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('deleteRetinue...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getBurseInfo
 * @description 获取我的钱包
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:21:12+0800
 */
.factory('getBurseInfo', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/account/my_burse'
      )
      .success(function(dataRes, statusCode) {
        log.info('getBurseInfo...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getBurseInfo...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 读取是否存在银行卡
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(successCb, errorCb) {    $http.get(        sessionData.locData.apiHost + '/index.php?r [description]
 * @return {[type]}              [description]
 */
.factory('getCash', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/bankCard/view_list'
      )
      .success(function(dataRes, statusCode) {
        log.info('getCash...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getCash...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 提现金额
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(dataPost, successCb, errorCb) {        var callback [description]
 * @return {[type]}              [description]
 */
.factory('withdrawCash', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
        sessionData.locData.apiHost + '/index.php?r=api/Cash/cash_verify_price',
        dataPost
      )
      .success(function(dataRes, statusCode) {
        log.info('withdrawCash...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('withdrawCash...', dataRes);
        errorCb(dataRes, statusCode);
      });
    };
    $http.get(
      sessionData.locData.apiHost + '/index.php?r=api/Cash/cash_verify_price&csrf=csrf'
    )
    .success(function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        callback(dataRes.data.csrf.TMM_CSRF);
      } else {
        // 网络超时，请重试...
        successCb(dataRes, statusCode);
      }
    })
    .error(function(dataRes, statusCode) {
      errorCb(dataRes, statusCode);
    });
  };
})

/**
 * 获取银行提现短信验证码
 */
.factory('getWithDrawCode', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/cash/captcha_cash'
      )
      .success(function(dataRes, statusCode) {
        log.info('getCashInfo...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getCashInfo...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 发送提现短信验证表单
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(dataPost, successCb, errorCb) {        var callback [description]
 * @return {[type]}              [description]
 */
.factory('withdrawMessage', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/cash/create',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('withdrawMessage...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('withdrawMessage...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/cash/create&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
          successCb(dataRes, statusCode);
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getCashInfo
 * @description 获取提现申请记录
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:27:08+0800
 */
.factory('getCashInfo', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/cash/index'
      )
      .success(function(dataRes, statusCode) {
        log.info('getCashInfo...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getCashInfo...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 获取银行信息列表
 */
.factory('getBankList', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/bankCard/bank_index'
      )
      .success(function(dataRes, statusCode) {
        log.info('getBankList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getBankList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})
/**
 * @ngdoc function
 * @name getCashBank
 * @description 用户提现时获取银行账户信息
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:28:34+0800
 */
.factory('getCashBank', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/cash/create'
      )
      .success(function(dataRes, statusCode) {
        log.info('getCashBank...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getCashBank...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name createCash
 * @description 用户提现
 * 
 * @param    {Object}   dataPost 要发送的表单数据 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T11:30:18+0800
 */
.factory('createCash', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/cash/create',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('createCash...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('createCash...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/cash/create&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 创建银行卡
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(dataPost, successCb, errorCb) {        var callback [description]
 * @return {[type]}              [description]
 */
.factory('createBankCard', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/bankCard/create',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('createBankCard...', dataPost);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('createBankCard...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/bankCard/create&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 创建银行时获取短信验证码
 */
.factory('getBankcardCode', function($http, log, sessionData) {
  return function(successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/user/captcha_bank_sms'
      )
      .success(function(dataRes, statusCode) {
        log.info('getBankcardCode...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getBankcardCode...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 创建银行卡验证短信
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(dataPost, successCb, errorCb) {        var callback [description]
 * @return {[type]}              [description]
 */
.factory('validateBankCardCode', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/bankCard/bankcard_sms',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('validateBankCardCode...', dataPost);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('validateBankCardCode...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/bankCard/bankcard_sms&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 获取交易记录
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(url, successCb, errorCb) {    var url [description]
 * @return {[type]}              [description]
 */
.factory('getTradeRecord', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/accountLog/index&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getTradeRecord...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getTradeRecord...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * 提现记录
 * @param  {[type]} $http        [description]
 * @param  {[type]} log          [description]
 * @param  {[type]} sessionData) {             return function(url, successCb, errorCb) {    var url [description]
 * @return {[type]}              [description]
 */
.factory('getDrawMoneyRecord', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/cash/index&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getDrawMoneyRecord...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getDrawMoneyRecord...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})
/**
 * @ngdoc function
 * @name getRecommendList
 * @description 获取推荐列表(根据分页链接)
 *
 * @param    {String}   url 分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:32:25+0800
 */
.factory('getRecommendList', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/selected&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getRecommendList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getRecommendList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getOrderList
 * @description 获取我的订单列表(根据分页链接)
 *
 * @param    {String}   url 分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:34:14+0800
 */
.factory('getOrderList', function($http, log, sessionData) {
  return function(url, type, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/order/index&type='+ type+'&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getOrderList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getOrderList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getOrderDetail
 * @description 获取订单详情
 *
 * @param    {String}   url    订单详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:34:05+0800
 */
.factory('getOrderDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getOrderDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getOrderDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getShopDetail
 * @description 获取商品（点，线，活动）的详情
 *
 * @param    {String}   url    商品（点，线，活动）的详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-20T17:45:21+0800
 */
.factory('getShopDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getShopDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getShopDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getDotDetail
 * @description 获取点的详情
 *
 * @param    {String}   url    点的详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:37:25+0800
 */
.factory('getDotDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getDotDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getDotDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name orderCancle
 * @description 点，线订单中预订须知
 *
 * @param    {String}   id    获取到订单id
 * 
 */
.factory('getBookInfo', function($http, log, sessionData) {
  return function(url, id, successCb, errorCb) {
    $http.get(
      sessionData.locData.apiHost + url + id
    )
    .success(function(dataRes, statusCode) {
      log.info('bookinfo...', dataRes);
      successCb(dataRes, statusCode);
    })
    .error(function(dataRes, statusCode) {
      log.error('bookinfo...', dataRes);
      errorCb(dataRes, statusCode);
    });
  };
})

/**
 * @ngdoc function
 * @name getLineDetail
 * @description 获取线的详情
 *
 * @param    {String}   url    线的详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:38:09+0800
 */
.factory('getLineDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getLineDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getLineDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getActDetail
 * @description 获取活动的详情
 *
 * @param    {String}   url    活动的详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:39:00+0800
 */
.factory('getActDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getActDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getActDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getSeekList
 * @description 获取觅境列表(根据分页链接)
 *
 * @param    {String}   url    分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 *
 * @author Moore Mo
 * @datetime 2015-11-08T14:43:33+0800
 */
.factory('getSeekList', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/index&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getSeekList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getSeekList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getItemDetail
 * @description 获取项目详情
 *
 * @param    {String}   url    项目详情链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 *
 * @author Moore Mo
 * @datetime 2015-11-08T14:47:03+0800
 */
.factory('getItemDetail', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getItemDetail...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getItemDetail...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name shopCollect
 * @description 商品点赞
 *
 * @param    {Object} dataPost 要发表的表单数据
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:48:31+0800
 */
.factory('shopCollect', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/shops/collect',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('shopCollect...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('shopCollect...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/shops/collect&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        /*if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }*/
        if(dataRes.status != 0){
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          callback("");
        }
        
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getMyPraiseList
 * @description 获取我的赞列表(根据分页链接)
 *
 * @param    {String}   url    分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:50:58+0800
 */
.factory('getMyPraiseList', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/praise&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getMyPraiseList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getMyPraiseList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getSeekSearchList
 * @description 搜索列表(根据分页链接)
 *
 * @param    {String}   url    分页链接
 * @param    {String}   type   要搜索的类型
 * @param    {String}   typeValue 要搜索的值
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:51:41+0800
 */
.factory('getSeekSearchList', function($http, log, sessionData) {
  return function(url, type, typeValue, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/index&' + type + '=' + typeValue;
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getSeekSearchList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getSeekSearchList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name orderCancle
 * @description 取消订单
 *
 * @param    {String}   id    要取消的订单id
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:54:58+0800
 */
.factory('orderCancle', function($http, log, sessionData) {
  return function(id, successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/order/cancel&id=' + id
      )
      .success(function(dataRes, statusCode) {
        log.info('orderCancle...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('orderCancle...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name orderPay
 * @description 支付订单
 *
 * @param    {Object}   dataPost 要发送的表单数据 
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:58:01+0800
 */
.factory('orderPay', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/order/payment',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('orderPay...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('orderPay...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/order/payment&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name orderCreate
 * @description 创建订单
 *
 * @param    {Object}   dataPost 要发送的表单数据 
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T14:59:01+0800
 */
.factory('orderCreate', function($http, log, sessionData) {
  return function(dataPost, successCb, errorCb) {
    // 获取成功后回调
    var callback = function(csrf) {
      // 带上表单检验码
      dataPost.TMM_CSRF = csrf;
      $http.post(
          sessionData.locData.apiHost + '/index.php?r=api/order/create',
          dataPost
        )
        .success(function(dataRes, statusCode) {
          log.info('orderCreate...', dataRes);
          successCb(dataRes, statusCode);
        })
        .error(function(dataRes, statusCode) {
          log.error('orderCreate...', dataRes);
          errorCb(dataRes, statusCode);
        });
    };
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/order/create&csrf=csrf'
      )
      .success(function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          callback(dataRes.data.csrf.TMM_CSRF);
        } else {
          // 网络超时，请重试...
        }
      })
      .error(function(dataRes, statusCode) {
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getFareDot
 * @description 获取点的价格 点的数据
 *
 * @param    {Int}   id        点的id
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:02:07+0800
 */
.factory('getFareDot', function($http, log, sessionData) {
  return function(id, successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/order/fare_dot&id=' + id
      )
      .success(function(dataRes, statusCode) {
        log.info('getFareDot...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getFareDot...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getFareLine
 * @description 获取线的价格 线的数据
 *
 * @param    {Int}   id        线的id
 * 
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:02:07+0800
 */
.factory('getFareLine', function($http, log, sessionData) {
  return function(id, successCb, errorCb) {
    $http.get(
        sessionData.locData.apiHost + '/index.php?r=api/order/fare_thrand&id=' + id
      )
      .success(function(dataRes, statusCode) {
        log.info('getFareLine...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getFareLine...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getQrCode
 * @description 获取二维码
 *
 * @param    {String}   url    二维码链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:05:13+0800
 */
.factory('getQrCode', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getQrCode...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getQrCode...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getDotList
 * @description 获取点的列表(根据分页链接)
 *
 * @param    {String}   url    分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:07:11+0800
 */
.factory('getDotList', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/index&select_dot_thrand=dot&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getDotList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getDotList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
})

/**
 * @ngdoc function
 * @name getLineList
 * @description 获取线的列表(根据分页链接)
 *
 * @param    {String}   url    分页链接
 * @param    {Functoin} successCb 成功后的回调函数 
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @param    {Functoin} errorCb   失败后的回调函数
 * 参数为：dataRes 响应回来的数据 statusCode 状态码
 * 
 * @author Moore Mo
 * @datetime 2015-11-08T15:08:24+0800
 */
.factory('getLineList', function($http, log, sessionData) {
  return function(url, successCb, errorCb) {
    var url = url || sessionData.locData.apiHost + '/index.php?r=api/shops/index&select_dot_thrand=thrand&page=1';
    $http.get(
        url
      )
      .success(function(dataRes, statusCode) {
        log.info('getLineList...', dataRes);
        successCb(dataRes, statusCode);
      })
      .error(function(dataRes, statusCode) {
        log.error('getLineList...', dataRes);
        errorCb(dataRes, statusCode);
      });
  };
});

angular.module('resources', [])

.factory('Resource', function(API_CONFIG, $http, $q, $log, $ionicLoading) {

  var api = API_CONFIG.url;


  var thenFactoryMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ',response)
  
      if (response.data.status === 1) {
        var result = new Resource(response.data.data);
        return result;
      } else {
        return $q.reject({
          code: '0',
          msg:'没有相关数据'
        })
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg:'网络连接错误'
      })
    })
  }

  var thenFactoryPostMethod = function(httpPromise) {

    return httpPromise.then(function(response) {
      $log.debug('debug: ',response);
  
      if (response.data.status === 1) {
        var result = new Resource(response.data);
        return result;
      } else {
        if (response.data.form) {
          for (var msgName in response.data.form) {
            // 显示错误信息
            return $q.reject({
              code: '0',
              msg:response.data.form[msgName][0]
            })
            break;
          }
        } else {
          return $q.reject({
            code: '0',
            msg:'相关数据出错'
          })
        }
      }

    }, function(response) {

      return $q.reject({
        code: '-1',
        msg:'网络连接错误'
      })
    })
  }

  var Resource = function(data) {
    angular.extend(this, data);
  }

  Resource.get = function(url) {
    var httpPromise = $http.get(url);
    return thenFactoryMethod(httpPromise);
  }

  Resource.post = function(url, data) {
    return $http.get(url + '&csrf=csrf').then(function(dataRes) {
      data.TMM_CSRF = dataRes.data.data.csrf.TMM_CSRF;
      var httpPromise = $http.post(url, data);
      return thenFactoryPostMethod(httpPromise);
    }, function(dataRes) {

    });
  }

  Resource.getRecommend = function() {
    return this.get(api + '/index.php?r=api/shops/selected&page=1');
  }

  Resource.getSeek = function() {
    return this.get(api + '/index.php?r=api/shops/index&page=1');
  }

  Resource.getUser = function() {
    return this.get(api + '/index.php?r=api/user/view');
  }

  Resource.logout = function() {
    return this.get(api + '/index.php?r=api/login/out');
  }

  Resource.postPraise = function(id) {
    var praiseUrl = api + '/index.php?r=api/shops/collect';
    return this.post(praiseUrl, {
      "Collect": {
        "shops_id": id,
        "user_address": ""
      }
    });
  }

  //预订须知
  Resource.getBookInfo = function(type, id) {
    var url ="";
    if(type == "1"){
      url = "/index.php?r=api/dot/view&id=";
    } else if(type == "2"){
      url = "/index.php?r=api/thrand/view&id=";
    }
    return this.get(api + url + id);
  }

  //获取登录用户信息
  Resource.getUserInfo = function() {
    return this.get(api + '/index.php?r=api/user/view');
  }

  //退出用户登录
  Resource.logOut = function() {
    return this.get(api + '/index.php?r=api/login/out');
  }

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

  //获取钱包余额
  Resource.getBurseInfo = function() {
    return this.get(api + '/index.php?r=api/account/my_burse');
  }

  //判断是否可以提现
  Resource.getCash = function() {
    return $http.get(api + '/index.php?r=api/bankCard/view_list');
  }
  
  return Resource;
})
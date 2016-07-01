angular.module('myInfo', [])

.config(function($stateProvider) {
  $stateProvider
    .state('tab.myInfo', {
      url: '/myInfo',

      templateUrl: 'app/my/templates/myInfo.html',
      controller: 'MyInfoCtrl',
      resolve: {
        data: function(security) {
          return security.getUserInfo();
        }
      }
    })
    .state('tab.updateLinkman', {
      // type: 0 添加主要联系人，1 修改主要联系人，2 添加随行人员，3，修改随行人员
      url: '/updateLinkman/:type/:link',
      templateUrl: 'app/my/templates/linkman.html',
      controller: 'UpdateLinkmanCtrl'
    })
    .state('tab.updatePwd', {
      url: '/updatePwd',
      templateUrl: 'app/my/templates/updatePwd.html',
      controller: 'UpdatePwdCtrl'
    })
    .state('tab.updatePhone', {
      url: '/updatePhone',
      templateUrl: 'app/my/templates/updatePhone.html',
      controller: 'UpdatePhoneCtrl'
    })

})

/**
 * 我的信息控制器
 */
.controller('MyInfoCtrl', function($scope, $ionicPopup, $ionicActionSheet, modify, appFunc, Resource, data) {
  $scope.model = data;

  $scope.$on('$ionicView.beforeEnter', function() {
    if (modify.ismodify) {

      Resource.getUserInfo().then(function(data) {
        $scope.model = data;

      })
      modify.ismodify = false;
    }
  })


  $scope.updateNickname = function() {
    $ionicPopup.prompt({
      title: '修改昵称',
      cancelText: '取消',
      inputType: 'text',
      okText: '确认',
      cssClass: 'tmm-ionic-prompt'
    }).then(function(res) {
      if(!res) return;
      Resource.updateUserInfo({
        "User": {
          "nickname": res,
          "gender": $scope.model.userInfo.gender
        }
      }).then(function(data) {
        $scope.model.userInfo.nickname = res;
      }, function(data) {
        appFunc.alert(data.msg)
      })
    });
  };

  $scope.updateGender = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: '男' },
        { text: '女' }
      ],
      destructiveText: '取消',
      cssClass: 'tmm-action-sheet',
      destructiveButtonClicked: function() {
        return true;
      },
      buttonClicked: function(index) {
        var post_gender = index + 1;

        Resource.updateUserInfo({
          "User": {
            "nickname": $scope.model.userInfo.nickname,
            "gender": post_gender + ''
          }
        }).then(function(data) {
          $scope.model.userInfo.gender = post_gender;
        }, function(data) {
          appFunc.alert(data.msg)
        })
        return true;
      }
    });
  };

})

/**
 * 修改联系人
 */
.controller('UpdateLinkmanCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory, API, modify, Resource, appFunc) {
  var titles = ['添加主要联系人', '修改主要联系人', '添加随行人员', '修改随行人员'];
  var link = $stateParams.link;
  var msg = "";
  $scope.type = $stateParams.type;
  $scope.title = titles[$stateParams.type];
  $scope.model = {};
 
  if ($scope.type == 1 || $scope.type == 3) {
    Resource.get(link).then(function(data) {
      $scope.model = data;
      link = $scope.model.update_link;
    });
  } else if($scope.type == 0) {
    link = API.create_mainretinue;
  } else if($scope.type == 2) {
    link = API.create_retinue;
  }
 
  $scope.submit = function() {
    if (!checkForm()) return;
    var token = {
      "Retinue": {
        "name": $scope.model.name,
        "identity": $scope.model.identity,
        "phone": $scope.model.phone,
        "email": $scope.model.email
      }
    };


    Resource.post(link, token).then(function(data) {
      if ($scope.type == 0 || $scope.type == 2) {
        msg = "添加成功";
      } else {
        msg = "修改成功";
      }
      appFunc.alert(msg).then(function(data) {
        $ionicHistory.goBack();
        modify.ismodify = true;
      })
    }, function(data) {

      appFunc.alert(data.msg);
    });
  };

  $scope.deleteman = function() {
    appFunc.confirm('确认删除联系人吗?', function() {
      Resource.get($scope.model.delete_link).then(function(data) {
        appFunc.alert('删除成功').then(function(){
          $ionicHistory.goBack();
          modify.ismodify = true;  
        })
      }); 
    });
  };

  function checkForm() {
    if (!$scope.model.name) {
      appFunc.alert("姓名不能为空");
      return false;
    } else if (!$scope.model.identity) {
      appFunc.alert("身份证不能为空");
      return false;
    } else if (!$scope.model.phone) {
      appFunc.alert("手机号不能为空");
      return false;
    } else if (!appFunc.isPhone($scope.model.phone)) {
      appFunc.alert("手机号格式有误");
      return false;
    } else if ($scope.model.email && !appFunc.isEmail($scope.model.email)) {
      appFunc.alert("邮箱格式错误");
      return false;
    }

    return true;
  }

})

/**
 * 修改密码
 */
.controller('UpdatePwdCtrl', function($scope, $interval, $ionicHistory, Resource, appFunc, security) {
  var timer = null;
  $scope.disable = false;
  $scope.txt = "获取验证码";

  $scope.$on('$destroy', function(data) {
    $interval.cancel(timer);
  })

  security.getUserInfo().then(function(data) {
    $scope.model = angular.extend({}, data.userInfo);
  });

  $scope.getCode = function() {
    if (timer !== null) return;
    var token = {
      "phone": $scope.model.phone
    };

    Resource.getPwdCode(token).then(function(data) {
      setTime();
    }, function(data) {

      appFunc.alert(data.msg);

    });
  };

  $scope.submit = function() {
    if (!checkForm()) return;

    var token = {
      "User": {
        "phone": $scope.model.phone,
        "sms": $scope.model.code,
        "_pwd": $scope.model.pwd,
        "confirm_pwd": $scope.model.comfirmPwd
      }
    };

    Resource.updatePwd(token).then(function(data) { 
      Resource.logOut().then(function(data) {
        security.userInfo = null;
        security.login();
      }, function(data) {

      });
      
      security.getUserInfo().then(function(data) {
        if(data.userInfo !== null){ 
          $ionicHistory.goBack();
        } 
      }, function(data) {

      }); 
    }, function(data) {
      appFunc.alert(data.msg);
    });
  };

  function setTime() {
    $interval.cancel(timer);
    $scope.disable = true;
    var i = 60;
    $scope.txt = i + '秒后获取';

    timer = $interval(function() {
      $scope.txt = --i + '秒后获取';

      if (i === 0) {
        $interval.cancel(timer);
        $scope.txt = "获取验证码";
        $scope.disable = false;
        timer = null;
      }

    }, 1000);
  }

  function checkForm() {
    if (!$scope.model.phone) {
      appFunc.alert('手机号不能为空');
      return false;
    } else if (!appFunc.isPhone($scope.model.phone)) {
      appFunc.alert('手机号必须为11位数字');
      return false;
    } else if (!$scope.model.code) {
      appFunc.alert('验证码不能为空');
      return false;
    } else if (!$scope.model.pwd) {
      appFunc.alert('密码不能为空');
      return false;
    } else if ($scope.model.pwd != $scope.model.comfirmPwd) {
      appFunc.alert('两次密码不一致');
      return false;
    }
    return true;
  }
})

/**
 * 修改手机号
 */
.controller('UpdatePhoneCtrl', function($scope, $interval, $ionicHistory, modify, appFunc, Resource) {
  var timer = null;
  $scope.isNext = false;
  $scope.disable = false;
  $scope.txt = "获取验证码";
  $scope.old = {};
  $scope.new = {};

  $scope.$on('$destroy', function(data) {
    $interval.cancel(timer);
  });

  $scope.getCode = function(type) {
    if (!checkPhone($scope[type].phone)) return;
    if (timer !== null) return;

    var token = {
      "phone": $scope[type].phone
    };
    Resource.getUpdatePhoneCode(token, type).then(function(data) {
      setTime();

    }, function(data) {
      appFunc.alert(data.msg);
    })
  };

  // $scope.getNewCode = function() {
  //   if (!checkPhone($scope.new.phone)) return;
  //   if (timer !== null) return;
  //   setTime();
  // };

  $scope.nextStep = function() {
    if (checkPhone($scope.old.phone) && checkCode($scope.old.code)) {
      var token = {
        "User": {
          "phone": $scope.old.phone,
          "sms": $scope.old.code
        }
      };

      Resource.updateOldPhone(token).then(function(data) {
        $scope.isNext = true;
        $interval.cancel(timer);
        $scope.txt = "获取验证码";
        $scope.disable = false;
        timer = null;
      }, function(data) {
        appFunc.alert(data.msg);
      });
    }
  };

  $scope.submit = function() {
    if (checkPhone($scope.new.phone) && checkCode($scope.new.code)) {
      var token = {
        "User": {
          "phone": $scope.new.phone,
          "sms": $scope.new.code
        }
      };
      Resource.updateNewPhone(token).then(function(data) {
        $ionicHistory.goBack();
        modify.ismodify = true;
      }, function(data) {
        appFunc.alert(data.msg);
      });
    }
  };


  function setTime() {
    $interval.cancel(timer);
    $scope.disable = true;
    var i = 60;
    $scope.txt = i + '秒后获取';

    timer = $interval(function() {
      $scope.txt = --i + '秒后获取';

      if (i === 0) {
        $interval.cancel(timer);
        $scope.txt = "获取验证码";
        $scope.disable = false;
        timer = null;
      }

    }, 1000);
  }

  function checkPhone(phone) {
    if (!phone) {
      appFunc.alert('手机号码不能为空');
      return false;
    } else if (!appFunc.isPhone(phone)) {
      appFunc.alert('手机号不是有效值');
      return false;
    }
    return true;
  }

  function checkCode(code) {
    if (!code) {
      appFunc.alert('验证码不能为空');
      return false;
    }
    return true;
  }

})

.factory('modify', function() {
  return {
    ismodify: false,
    modifydate: {'actname':'', 'actnum':'', 'tourprice':'', 'changeline':''}
  }
})

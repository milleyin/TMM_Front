/**我的收入*/
tmmApp.controller("wodeshouruCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.mainjson = {}; /*主账号的信息*/
  $scope.sonjson = {}; /*主账号下子账号的信息*/
  $scope.son = {}; /*子账号的信息*/
  $scope.no_data = false;

  if (localStorage.getItem("userInfo")) {
    $scope.is_main = JSON.parse(localStorage.getItem("userInfo")).is_main;
  } else {
    $scope.is_main = false;
  }


  $http.get(API + '/index.php?r=store/store_accountLog/index').success(function(data) {
    if (data.status == 0) {
      //alert(data.msg);
      if ($rootScope.mobileType == 0) { //ios
        connectWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('ObjcCallback', {
            'Tips': data.msg
          }, function(response) {})
        });
      } else if ($rootScope.mobileType == 1) {
        window.jsObj.prompt(data.msg);
      }

    } else {
      console.log(data);
      $scope.mainjson = data.data;
    }
  });

  function sendCode(code) {
    var url = API + '/index.php?r=store/store_orderItems/scancode';
    
    $http.get(url + '&csrf=csrf').success(function(data) {
      var csrf = data.data.csrf.TMM_CSRF;
      var token = {
        "code": code,
        "TMM_CSRF": csrf
      }

      $http.post(
        url,
        token, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).success(function(data) {

        if (data.status == 1) {
          tipAlert(data.data.status.name);
          if (data.data.status.value == 1) { // 扫码消费成功
            if (data.data.status.classliy.value == 1 || data.data.status.classliy.value == 2) { // 点，线
              $location.path('myzizhuorderdetail/' + data.data.status.link_value);
            } else if (data.data.status.classliy.value == 0) { // 活动总单
              $rootScope.orderTourLink = data.data.status.link;
              $location.path('myjbyorderdetail/');
            }
          }
        } else {
          tipAlert("扫码错误");
        }
      });
    });
  }

  function tipAlert(msg) {
    if ($rootScope.mobileType == 0) {
      connectWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('ObjcCallback', {
          'Tips': msg
        }, function(response) {})
      });
    } else if ($rootScope.mobileType == 1) {
      window.jsObj.prompt(msg);
    }
  }

  /*扫描二维码*/
  $scope.getCode = function() {
    if ($rootScope.mobileType == 0) { //ios
      connectWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler('JavascriptHandler', function(data, responseCallback) {
          var str = data;
          //后台传值
          sendCode(str);

        })
      })
    } else if ($rootScope.mobileType == 1) { //安卓
      //请求安卓后台
      var str = window.jsObj.scanCode();
      sendCode(str);
    }
  }


  /*扫描二维码*/
/*  $scope.getCode = function() {

    if ($rootScope.mobileType == 0) { //ios
      connectWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler('JavascriptHandler', function(data, responseCallback) {
          var str = data;
          //后台传值
          var url = API + '/index.php?r=store/store_orderItems/scancode'
          $http.get(url + '&csrf=csrf').success(function(data) {
            var csrf = data.data.csrf.TMM_CSRF;
            var token = {
              "code": str,
              "TMM_CSRF": csrf
            }

            $http.post(
              url,
              token, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
            ).success(function(data) {
              console.log(data);
              if (data.status == 1) {
                if (data.data.status.value == 1) {
                  bridge.callHandler('ObjcCallback', {
                      'QRCodeResult': data.data.status.name
                    }, function(response) {})
                    // 订单详情页
                  $location.path(data.data.status.link);
                } else {
                  bridge.callHandler('ObjcCallback', {
                    'QRCodeResult': data.data.status.name
                  }, function(response) {})
                  $location.path('wodeshouru');
                }
              } else {
                bridge.callHandler('ObjcCallback', {
                  'QRCodeResult': "扫码错误"
                }, function(response) {})
                if (data.data.status.classliy) {
                  if (data.data.status.classliy == 3) {
                    $rootScope.orderTourLink = data.data.status.link;
                    $location.path('myjbyorderdetail/');
                  } else {
                    $location.path('myzizhuorderdetail/' + data.data.status.link_value);
                  }
                } else {
                  $location.path('myzizhuorderdetail/' + data.data.status.link_value);
                }
              }
            });
          });

        })

        bridge.callHandler('ObjcCallback', {
          'QRCode': ''
        }, function(response) {})

      })

    } else if ($rootScope.mobileType == 1) { //安卓
      //请求安卓后台
      var str = window.jsObj.scanCode();
      //后台传值
      var url = API + '/index.php?r=store/store_orderItems/scancode'
      $http.get(url + '&csrf=csrf').success(function(data) {
        var csrf = data.data.csrf.TMM_CSRF;
        var token = {
          "code": str,
          "TMM_CSRF": csrf
        }

        $http.post(

          url,
          token, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        ).success(function(data) {

          //扫码成功与否

          if (data.status == 1) {
            if (data.data.status.value == 1) {
              window.jsObj.prompt(data.data.status.name);
              // 订单详情页
              if (data.data.status.classliy) {
                if (data.data.status.classliy == 3) {
                  $rootScope.orderTourLink = data.data.status.link;
                  $location.path('myjbyorderdetail/');
                } else {
                  $location.path('myzizhuorderdetail/' + data.data.status.link_value);
                }
              } else {
                $location.path('myzizhuorderdetail/' + data.data.status.link_value);
              }

            } else {
              window.jsObj.prompt(data.data.status.name);
              $location.path('wodeshouru');
            }
          } else {
            window.jsObj.prompt("扫码错误");
            $location.path('wodeshouru');
          }

          //          alert(data.status);
        });
      });
    }
  }
*/
}]);

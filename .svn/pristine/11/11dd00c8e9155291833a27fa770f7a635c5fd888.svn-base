/**我的收入*/
tmmApp.controller("wodeshouruCtrl", ["$scope", "$http", "$location", '$rootScope', '$q', function($scope, $http, $location, $rootScope, $q) {
  $scope.mainjson = {}; /*主账号的信息*/
  $scope.sonjson = {}; /*主账号下子账号的信息*/
  $scope.son = {}; /*子账号的信息*/
  $scope.no_data = false;
  $scope.info = {};
  $scope.list_data = [];

  if (localStorage.getItem("userInfo")) {
    $scope.is_main = JSON.parse(localStorage.getItem("userInfo")).is_main;
  } else {
    $scope.is_main = false;
  }


  $http.get(API + '/index.php?r=store/store_accountLog/count').success(function(data) {
    if (data.status == 0) {
      mobileMessage(data.msg);
      /*if ($rootScope.mobileType == 0) { //ios
        connectWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('ObjcCallback', {
            'Tips': data.msg
          }, function(response) {})
        });
      } else if ($rootScope.mobileType == 1) {
        window.jsObj.prompt(data.msg);
      }*/

    } else {
      $scope.info = data.data;
      $scope.list_data = data.data.list_data;
    }
  });

  $scope.showMore = function() {
    if ($scope.info.page.next) { // 分页取数据
      $http.get($scope.info.page.next).success(function(data) {
        if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
          $scope.info = data.data;
          $scope.list_data = $scope.list_data.concat(data.data.list_data);
        }
      });
    } else {
      $(".load").css('display', 'none');
    }
  }


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

        });
        bridge.callHandler('ObjcCallback', {
          'QRCode': ''
        }, function(response) {});
      })
    } else if ($rootScope.mobileType == 1) { //安卓
      //请求安卓后台
      var str = window.jsObj.scanCode();
      sendCode(str);
    }
  }
}]);

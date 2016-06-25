angular.module('destination', [])

.config(function($stateProvider) {
  $stateProvider
    .state('tab.destination', {
      url: '/destination',
      templateUrl: 'app/search/templates/destination.html',
      controller: 'DestinationCtrl',
      resolve: {
        data: function(Resource, $ionicLoading) {
          $ionicLoading.show({
            template: '玩命加载中...',
            hideOnStateChange: true
          });
          return Resource.getAreaList();
        }
      }
    });
})

.controller('DestinationCtrl', function($scope, $http, $ionicHistory, modify, Resource, data, device) {
  // Resource.getWeixinToken({wxgps:'wxgps', url: window.location.href}).then(function(data) {
  //   wx.config({
  //     debug: true, 
  //     appId: data.appId,
  //     timestamp: data.timestamp, 
  //     nonceStr: data.nonceStr, 
  //     signature: data.signature, 
  //     jsApiList: ['getLocation'] 
  //   });
  // });

  // $http.get('http://test2.365tmm.net/index.php?r=api/shops/wxgps&wxgps=wxgps&url=' + 'http://wx.365tmm.net/#/destination').success(function(data){

  //       wx.config({
  //         debug: true, 
  //         appId: data.data.appId,
  //         timestamp: data.data.timestamp, 
  //         nonceStr: data.data.nonceStr, 
  //         signature: data.data.signature, 
  //         jsApiList: ['getLocation'] 
  //       });

  // })
  var listCity = data.list_data;
  $scope.model = data;
  $scope.searchText = '';
  $scope.isSearch = false;
  $scope.hasData = true;

  $scope.selectCity = function(link) {
    Resource.get(link).then(function(data) {
      $ionicHistory.goBack();
      modify.ismodify = true;
    });
  };

  $scope.clearText = function() {
    $scope.isSearch = false;
    $scope.searchText = '';
    $scope.model.list_data = listCity;
  };

  $scope.changeText = function() {
    var flag = false;
    if ($scope.searchText === '') {
      $scope.model.list_data = listCity;
    } else {
      var re = new RegExp("^" + $scope.searchText, "i");
      var tmp = [];
      var filter = {};
      for (var key in listCity) {
        tmp = listCity[key].filter(function(value) {
          return re.test(value.spell) || value.name.match($scope.searchText);
        });
        if (tmp.length !== 0) {
          filter[key] = tmp;
          flag = true;
        }
      }
      $scope.hasData = flag;
      $scope.model.list_data = filter;
    }
  };

  $scope.getLocation = function() {
    device.getLocation(function(){
      $ionicHistory.goBack();
      modify.ismodify = true;
    });
  };

  wx.ready(function() {

  });

  wx.error(function(res) {

  });

})

angular.module('wallet', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.mywallet', {
      url: '/wallet',
      templateUrl: 'app/wallet/my-wallet.html',
      controller: 'WalletCtrl',
    });

}])

.controller('WalletCtrl', function($scope, $http, Resource, appFunc) {
  $scope.withdraw = 0;
  $scope.withdraw_format = 0;//可提金额
  Resource.getBurseInfo().then(function(dataRes) {
    $scope.json = dataRes;
    $scope.withdraw = dataRes.money;
    $scope.withdraw_format = dataRes.money_format;
  }, function(dataRes) {

  });

  //判断是否可以提现
  $scope.BankCardHasOrNot = function() {
    Resource.getCash().then(function(dataRes) {
      if (dataRes.data.status != 0) {
        /*$state.go('tab.mywithdraw', {
          'withdraw': $scope.withdraw,
          'withdraw_format': $scope.withdraw_format
        });*/
      } else {
        appFunc.alert("请添加银行卡");
      }
    }, function(dataRes) {

    });
  }
});

/**
 * 我的钱包
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("mywalletCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.json = {};
  $rootScope.withdraw = 0; //可提现金额
  $rootScope.withdraw_format = 0; //可提现金额
  $http.get(API+'/index.php?r=store/store_account/view').success(function(data){
    $scope.json = data.data;
    if(data.status != 0){
      $rootScope.withdraw = data.data.money;
      $rootScope.withdraw_format = data.data.money_format;
    }
  }).error(function(data){
    console.log("我的财务报错");
  })

  //判断是否有银行卡
  $http.get(API+'/index.php?r=store/store_store/store_bank&csrf=csrf').success(function(data){ 
    $rootScope.bankCard = 0;  //没有银行卡
    
    if(data.status != 0){
      $rootScope.bankCard = 1;
    }
  }).error(function(data){
    console.log("我的银行卡报错");
  })

  

  $scope.BankCardHasOrNot = function() {
    if($rootScope.bankCard == 0){
      mobileMessage("请添加银行卡");
    } else if($rootScope.bankCard == 1){
      /* 先判断是否有未处理的银行信息状态 */
      /*$http.get(API + '/index.php?r=store/store_cash/cash_verify_price&csrf=csrf').success(function(data) {  
          if(data.status == 0){
            console.log(data);
            if (data.form) {
              for (msgName in data.form) {
                // 显示错误信息
                mobileMessage(data.form[msgName][0]);
                break;
              }
            }
            
          } else {
            $location.path("withdraw");
          }
      });*/
      $location.path("withdraw");
    }
  }

 }]);

/**
 * 交易记录
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("traderecordCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.list_data = [];
  $scope.info = [];
  $scope.listNum = 0;

  $http.get(API+'/index.php?r=store/store_accountLog/index').success(function(data){
    $scope.json = data.data;
    if(data.status != 0){
      $scope.info = data.data;
      $scope.list_data = data.data.list_data;
      $scope.listNum = data.data.list_data.length;
      $(".load").css('display', 'none');
      console.log("交易记录",$scope.json);
    }
  }).error(function(data){
    console.log("交易记录报错");
  })

  $scope.showMore = function(){
    if ($scope.info.page.next) { // 分页取数据
      $http.get($scope.info.page.next).success(function(data) {
        if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
          $scope.info = data.data;
          $scope.list_data = $scope.list_data.concat(data.data.list_data);
        }  
      });
    }else{
      $(".load").css('display', 'none');
    }
  }
}]);

/**
 * 提现记录
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("drawmoneyrecordCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.list_data = [];
  $scope.info = [];
  $scope.listNum = 0;
  $http.get(API+'/index.php?r=store/store_cash/index').success(function(data){
    if(data.status == 1){
      console.log(data.data);
      $scope.list_data = data.data.list_data;
      $scope.listNum = data.data.list_data.length;
      $scope.info = data.data;  
    }else{
      console.log(data.msg);
    }
  }).error(function(data){
    console.log("提现记录出错");
  });

  $scope.showMore = function() {    
    if ($scope.info.page.next) { // 分页取数据
      $http.get($scope.info.page.next).success(function(data) {
        $scope.info = data.data;
        $scope.list_data =  $scope.list_data.concat(data.data.list_data);
      });
    }
    }
 }]);
/**
 * 银行卡管理
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("bankCardManagementCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.bankCardInfo = {};
  $scope.bank_info = "";
  $http.get(API+'/index.php?r=store/store_store/store_bank&csrf=csrf').success(function(data){ 
    if(data.status != 0){
      $scope.bankCardInfo = data.data[0];
      console.log("银行卡信息",data); 
    }
  }).error(function(data){
    console.log("我的银行卡报错");
  })

 }]);

/**
 * 提现申请
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("withdrawCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.json = {};
  $http.get(API + "/index.php?r=store/store_cash/create&csrf=csrf").success(function(data){
    $scope.json = data.data.data;
  }).error(function(){
    console.log(data.msg);
  })


 }]);

/**
 * 银行卡管协议
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $http       [description]
 * @param  {[type]} $location   [description]
 * @param  {[type]} $rootScope) {             }] [description]
 * @return {[type]}             [description]
 */
tmmApp.controller("bankprotocolCtrl", ["$scope", "$http", "$location", '$rootScope', function($scope, $http, $location, $rootScope) {
 
 }]);

/**保证金*/
tmmApp.controller("BaoZhengJinCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
  $scope.info = [];
  $scope.list_data = [];

  $http.get(API+'/index.php?r=store/store_deposit/index').success(function(data){
    if(data.status==0){
      // alert(data.msg);
      console.log(data.msg);
    }else{
      $scope.info = data.data;
      $scope.list_data = data.data.list_data;
      console.log("保证金",data.data);
    }
  }).error(function(data){
    console.log("保证金出错了");
  })
  //保证金显示更多
  $scope.showBZJMore = function() {
    if ($scope.info.page.next) { // 分页取数据
      $http.get($scope.info.page.next).success(function(data) {
        if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
          $scope.info = data.data;
          $scope.list_data = $scope.list_data.concat(data.data.list_data);
        }  
      });
    }
  }

}]);

/**我的财务*/
tmmApp.controller('mycaiwuCtrl',['$scope','$http','$rootScope',function($scope, $http,$rootScope) {
  $scope.json = {};
  $scope.status;
  $rootScope.withdraw = 0; //可提现金额
  $http.get(API+'/index.php?r=store/store_account/view').success(function(data){
    console.log("我的财务",data);
    $scope.status = data.status;
    $scope.json = data.data;
    if($scope.status !=0){
       $rootScope.withdraw = data.data.money;
       console.log("可提现金额",$rootScope.withdraw);
    }
  }).error(function(data){
    console.log("我的财务报错");
  })
}]);

/**可提现金额*/
tmmApp.controller("TotalIncomeCtrl",["$scope","$http","$location",'$rootScope',function($scope,$http,$location,$rootScope){
   $scope.money = $rootScope.withdraw;
  //$scope.money = 101;
    if($scope.money >=100){
      $scope.getMoney = function () {
        $http.get(API + "/index.php?r=store/store_cash/create&csrf=csrf").success(function(data){
          console.log("提示",data.data.data);
          if(data.data.data == null){
            if ($rootScope.mobileType == 0) { //ios
               connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                  'Tips': '请先添加银行卡！!'
                }, function(response) {})
              });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("请先添加银行卡！");
            }
            return;
          } else {
            $location.path("/tixiancaozuo");
          }
        }).error(function(){
          console.log(data.msg);
        })
      }
    }else{
      $(".tixian").css({"background":"#EEEEEE","border":"#CCCCCC","color":"#959595"});
    }

}]);
/**提现操作*/
tmmApp.controller("TiXianCaoZuoCtrl",["$scope","$http","$location",'$rootScope',function($scope,$http,$location,$rootScope){
  $scope.json = {};
  $scope.money = $rootScope.withdraw; 
  $http.get(API + "/index.php?r=store/store_cash/create&csrf=csrf").success(function(data){
    $scope.json = data.data.data;
    console.log("提现操作",data.data);
  }).error(function(){
    console.log(data.msg);
  })
}]);
/**提现申请记录*/
tmmApp.controller("TixianjiluCtrl",["$scope","$http",function($scope,$http){
  $scope.list_data = [];
  $scope.info = [];
  $scope.listNum = 0;
  $http.get(API+'/index.php?r=store/store_cash/index').success(function(data){
  /*$http({
    methord:"get",
    url:"../data/myfinance/tixian.json"
  }).success(function(data){*/
    if(data.status == 1){
      $scope.list_data = data.data.list_data;
      $scope.listNum = data.data.list_data.length;
      $scope.info = data.data;
      console.log(data);
      // alert(data.msg);
      
    }else{
      console.log(data.msg);
    }
  }).error(function(data){
    console.log("提现申请出错");
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
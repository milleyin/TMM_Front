/**/
tmmApp.controller('searchCtrl', ['$scope','$http',"$routeParams",'$location','$rootScope',function($scope, $http, $routeParams, $location, $rootScope) {

    $scope.json = {
        'searchText' : '',
        'search_info' : '',
        'list' : []
    };
    $scope.filterHistory = [];
    $scope.listNum = 1;
    $scope.showMj = $routeParams.type;
    $scope.isMiJing = true;
    if(localStorage.keyword_arr != null){
        $scope.filterHistory = $.parseJSON(localStorage.keyword_arr);
        $scope.showHistory = true;
    } else{
        $scope.showHistory = false;
    }

    $scope.info = [];
    $scope.showContent = false;  //控制查询结果的显示

    if($scope.showMj == 1){
       $("#searchContent").attr('placeholder','觅境搜索用户/项目/订单号');
       $scope.isMiJing = true; 
    } else if($scope.showMj == 0){
       $("#searchContent").attr('placeholder','觅趣搜索用户/项目/订单号'); 
       $scope.isMiJing = false;
    }

    $http.get(API + '/index.php?r=store/store_order/index').success(function(data,state,headers,config) { //得到对象search_info的值
        $scope.json.search_info = data.data.search_info;
     });

    $scope.souSuoContent = function(){
        var temp = [];
        var keyword_arr = [];

        if ($scope.json.searchText == "" || $scope.json.searchText == null) {
            $("#searchContent").attr('placeholder','请输入有效的字符');
            return;
        } else {
            //存储搜索历史记录
            $("#searchContent").removeAttr('placeholder');
            $("#searchContent").blur();
            if (localStorage.getItem('keyword_arr')) {
               keyword_arr = JSON.parse(localStorage.getItem('keyword_arr'));

               //判断是否已经存储过相同的数据
               var locArrayBoolean = true;
               var locArray = eval(JSON.parse(localStorage.getItem('keyword_arr')));
               for(var i = 0; i < locArray.length; i++){
                    if(locArray[i] == $scope.json.searchText){
                        //locArrayBoolean = false;
                        keyword_arr.splice(i,1);
                        i--;
                        break;
                   }
               };
               
               if(locArrayBoolean){     //localStorage存储数据
                    //$scope.filterHistory.push($scope.json.searchText);
                    $scope.filterHistory.unshift($scope.json.searchText);
                    keyword_arr.unshift($scope.json.searchText);
                    localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));
               }
               
            }
            else{  //存储第一次搜索记录
                $scope.filterHistory.push($scope.json.searchText);
                keyword_arr.push($scope.json.searchText);
                localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));   
            } 
            
            $scope.searchResult($scope.json.search_info, $scope.json.searchText);  
        }
    }
  
    $scope.souSuoInfoContent = function(tagValue){
        $scope.searchResult($scope.json.search_info, tagValue);
    }

    $scope.clearLocal = function(){
        $scope.filterHistory = [];
        localStorage.clear();
    }

    //得到历史记录
    $scope.getLocal = function(){
        console.log("blur");
        if ($scope.json.searchText == "" || $scope.json.searchText == null) {
            $scope.showHistory = true;   //控制历史记录的显示
            $scope.showContent = false;  //控制查询结果的显示
        }
    }

    $scope.searchResult = function(type, typeValue){ //根据条件查询
        var linkMJorMQ = '';
        if($scope.showMj == 1){
            linkMJorMQ = '/index.php?r=store/store_order/index&type=order_dot_thrand&';
        } else {
            linkMJorMQ = '/index.php?r=store/store_order/index&type=actives_tour&';
        }
        var linkParams = API + linkMJorMQ + type +'=' + typeValue;
        $http.get(linkParams).success(function(data,state,headers,config) {
            $scope.info = data.data;
            $scope.json.list =  data.data.list_data;
            if($scope.json.list.length == 0){
                $scope.listNum = 0;
            }
            $scope.showHistory = false;   //控制历史记录的显示
            $scope.showContent = true;  //控制查询结果的显示
        }).error(function(data){   
            console.log("抱歉，查询出错！");
        });
    }

    $scope.showMore = function() {
        
        if ($scope.info.page.next) { //分页取数据

            $http.get($scope.info.page.next).success(function(data) {
                if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
                    $scope.info = data.data;
                    $scope.json.list =  $scope.json.list.concat(data.data.list_data);
                }
            });
        }
    }

    // 去活动详情列表页面
    $scope.goToTourOrder = function(id,link) {
        $rootScope.orderTourLink = link;
        $location.path('myjbyorderdetail');
    }

    //自助游接受订单
    $scope.zzAcceptOrder = function(shopId){
        $http.get(API + '/index.php?r=store/store_order/receive&id=' + shopId).success(function(data) {
            if(data.status == 1){
                $scope.searchResult($scope.json.search_info, $scope.json.searchText);
            } else { // 接受成功    
                if ($rootScope.mobileType == 0) { //ios
                     connectWebViewJavascriptBridge(function(bridge) {
                        bridge.callHandler('ObjcCallback', {
                          'Tips': data.msg
                        }, function(response) {})
                    });
                } else if ($rootScope.mobileType == 1) {
                    window.jsObj.prompt(data.msg);
                } 
            }
            //console.log(data);
        });
    }
    
    //自助游拒绝订单
    $scope.zzRefuseOrder = function(shopId){
        if(confirm('确认拒绝订单吗？')) {
            $http.get(API + '/index.php?r=store/store_order/refuse&id=' + shopId).success(function(data) {
                
                if(data.status == 1){
                    $scope.searchResult($scope.json.search_info, $scope.json.searchText);     
                } else { //拒绝成功
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
                }
                //console.log(data);
            });
        }
    }

}]);
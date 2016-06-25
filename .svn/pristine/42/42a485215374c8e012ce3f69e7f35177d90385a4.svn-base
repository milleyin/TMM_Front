/**/
tmmApp.controller('SousuoCtrl', ['$scope','$http','$location','$rootScope',function($scope, $http, $location, $rootScope) {

    $scope.json = {
        'searchText' : '',
        'search_info' : '',
        'search_tags' : '',
        'list' : []
    };
    $scope.filterHistory = [];
    $scope.listNum = 1;
    if(localStorage.keyword_arr != null){
        $scope.filterHistory = $.parseJSON(localStorage.keyword_arr);
        $scope.showHistory = true;
    } else{
        $scope.showHistory = false;
    }

    $scope.info = [];
    $scope.showContent = false;  //控制查询结果的显示

    $http.get(API + '/index.php?r=api/shops/index').success(function(data,state,headers,config) { //得到对象search_info的值
        $scope.json.search_info = data.data.search_info;
        $scope.json.search_tags = data.data.search_tags;
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
            
            if (localStorage.getItem('keyword_arr')) {
               keyword_arr = JSON.parse(localStorage.getItem('keyword_arr'));

               //判断是否已经存储过相同的数据
               var locArrayBoolean = true;
               var locArray = eval(JSON.parse(localStorage.getItem('keyword_arr')));
               for(var i = 0; i < locArray.length; i++){
                    if(locArray[i] == $scope.json.searchText){
                        locArrayBoolean = false;
                        break;
                   }
               };

               if(locArrayBoolean){     //localStorage存储数据
                    $scope.filterHistory.push($scope.json.searchText);
                    keyword_arr.push($scope.json.searchText);
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
        //alert("aaaaaaaaaaa");
        if ($scope.json.searchText == "" || $scope.json.searchText == null) {
            $scope.showHistory = true;   //控制历史记录的显示
            $scope.showContent = false;  //控制查询结果的显示
        }
    }

    $scope.searchResult = function(type, typeValue){ //根据条件查询
        var linkParams = API + '/index.php?r=api/shops/index&'+ type +'=' + typeValue;
        console.log(linkParams);
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

    $scope.goDetailPage = function(type, link,value) {
        if (type == 1) { // 点的详情页面
            $rootScope.tuiJianPointUrl = link;
            $location.path('tuijiandetail_0/' + value);
        } else if(type == 2){ // 到线的详情页面
            $rootScope.tuiJianLineUrl = link;
            $location.path('tuijiandetail_1/' + value);
        } else if(type == 3){ // 到活动的详情页面
            $location.path('tuijiandetail_2/' + value);
        }
    }

}]);
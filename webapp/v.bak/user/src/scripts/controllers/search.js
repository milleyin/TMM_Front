'use strict';
angular.module('tmm.controllers')
/**
  *搜索控制器
 */
 .controller('SearchCtrl', function(
    $scope,
    $rootScope,
    $state,
    $location,
    $ionicLoading,
    $log,
    Tabs,
    tmmCache,
    getSeekList,
    getSeekSearchList,
    getShopDetail,
    appFunc) {
    $scope.json = {
      'searchText' : '',
      'search_info' : '',
      'search_tags' : '',
      'list' : []
    };
    $scope.filterHistory = [];
    $scope.json.list = {};

    $scope.searchModel = {
      'pullingText': '松开刷新',
      'seekList': []
    };
    // 达到松开高度时触发
    $scope.doPulling = function() {
      $scope.searchModel.pullingText = '松开刷新';
    };
    if(localStorage.keyword_arr != null){
      $scope.filterHistory = JSON.parse(localStorage.keyword_arr);
      $scope.showHistory = true;
    } else{
      $scope.showHistory = false;
    }

    // 下一页的链接
    var nextLink = '';
    $scope.showContent = false;  //控制查询结果的显示
    getSeekList(
      '',
      function(dataRes, statusCode){
        $scope.json.search_info = dataRes.data.search_info;
        $scope.json.search_tags = dataRes.data.search_tags;
      },
      function(dataRes, statusCode){

      }
    );


    //搜索内容并且存储搜索历史记录
    $scope.souSuoContent = function(){
      var temp = [];
      var keyword_arr = [];

      if ($scope.json.searchText == "" || $scope.json.searchText == null) {
        appFunc.alert("请输入有效的字符！");
        return;
      } else {
        document.getElementById("searchContent").blur();
        //存储搜索历史记录    
        if (localStorage.getItem('keyword_arr')) {
          keyword_arr = JSON.parse(localStorage.getItem('keyword_arr'));

          //判断是否已经存储过相同的数据
          var locArray = eval(JSON.parse(localStorage.getItem('keyword_arr')));
          for(var i = 0; i < locArray.length; i++){
            if(locArray[i] == $scope.json.searchText){
              keyword_arr.splice(i,1);
              i--;
              break;
            }
          };

          //localStorage存储数据
          $scope.filterHistory.unshift($scope.json.searchText);
          keyword_arr.unshift($scope.json.searchText);
          localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));   
        }
        else{  //存储第一次搜索记录
          //$scope.filterHistory.push($scope.json.searchText);
          keyword_arr.push($scope.json.searchText);
          localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));   
        } 
        $scope.filterHistory = JSON.parse(localStorage.keyword_arr); 
        $scope.searchResult($scope.json.search_info, $scope.json.searchText);  
      }
    }
  
    $scope.souSuoInfoContent = function(tagValue){
      $scope.searchResult($scope.json.search_info, tagValue);
    }

    //控制取消按钮的显示
    $scope.btnClear = false;
    $scope.searchChange = function() {
      if ($scope.json.searchText == "" || $scope.json.searchText == null) {
        $scope.btnClear = false;
        if(localStorage.keyword_arr != null){
          $scope.showHistory = true;   //控制历史记录的显示
          $scope.showContent = false;  //控制查询结果的显示
        }
      } else {
        $scope.btnClear = true;
      }
    }

    //取消按钮
    $scope.btnClearCon = function() {
      $scope.json.searchText = "";
      $scope.showHistory = true;   //控制历史记录的显示
      $scope.showContent = false;  //控制查询结果的显示
      $scope.btnClear = false;
    }

    //清除搜索历史   
    $scope.clearLocal = function(){
      $scope.filterHistory = [];
      localStorage.clear();
      $scope.showHistory = false;
    }

    //得到历史记录
    $scope.getLocal = function(){
      if ($scope.json.searchText == "" || $scope.json.searchText == null) {
        $scope.showHistory = true;   //控制历史记录的显示
        $scope.showContent = false;  //控制查询结果的显示
      }
    };

    $scope.doRefresh = function() {
      $scope.searchResult($scope.json.search_info, $scope.json.searchText);
    };

    $scope.searchResult = function(type, typeValue){ //根据条件查询
      getSeekSearchList(
        '',
        type,
        typeValue,
        function(dataRes, statusCode){
          nextLink = dataRes.data.page.next;
          $scope.json.list =  dataRes.data.list_data;
          if($scope.json.list.length == 0){
            $scope.showHistory = true;   //控制历史记录的显示
            $scope.showContent = false;  //控制查询结果的显示
            appFunc.alert("没有搜索到相关的数据！");
          } else {
            $scope.showHistory = false;   //控制历史记录的显示
            $scope.showContent = true;  //控制查询结果的显示  
          }
          $scope.$broadcast('scroll.refreshComplete');
        },
        function(dataRes, statusCode){
          appFunc.alert("抱歉，查询出错！");
          $scope.$broadcast('scroll.refreshComplete');
        }
      );
    };


    // 加载更多
    $scope.loadMore = function() {
      if (nextLink) {
        getSeekList(
          nextLink,
          function(dataRes, statusCode) {
            if (dataRes.status == 1) {
              $scope.json.list = $scope.json.list.concat($scope.json.list);
              nextLink = dataRes.data.page.next;
            } else {
              // 网络超时，请重试...
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
          },
          function(dataRes, statusCode) {
            // 网络超时，请重试...
            $scope.$broadcast("scroll.infiniteScrollComplete");
          }
        );
      }
    };

    // 是否还没更多数据
    $scope.hasMoreData = function() {
      if (nextLink) {
        return true;
      }
      return false;
    };

    // 显示商品详情页
    $scope.showView = function(type, url) {
      getShopDetail(
        url,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            $ionicLoading.show({
              template: "正在载入数据，请稍后...",
            });
            
            var page = {
              1: 'tab.dot-detail',
              2: 'tab.line-detail',
              3: 'tab.act-detail'
            };
            setTimeout(function() {
              $ionicLoading.hide();
              $state.go(page[type], {
                'link': url,
                'type': type
              });
            }, 1000); 
            
          } else {
            $ionicLoading.show({
              template: "该景点未开放，请稍候再试",
              duration: 2000
            });
          }
        },
        function(dataRes, statusCode) {
          //$ionicLoading.hide();
        }
      );
    };

  });

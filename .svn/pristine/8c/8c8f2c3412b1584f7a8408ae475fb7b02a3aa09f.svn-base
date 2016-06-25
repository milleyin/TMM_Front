/**我的项目*/

/* 项目列表显示 */
tmmApp.controller('myxmCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
  $scope.list_data = [];
  $scope.info = [];
  var url = API + '/index.php?r=store/store_items/index';

  $http.get(url).success(function(data) {
  	console.log(data)
  	$scope.info = data.data;
    $scope.list_data = data.data.list_data;
   	$(".load6").css('display', 'none');
  })

  /*加载更多*/
  $scope.showMore = function() {
    	if ($scope.info.page.next) { // 分页取数据
	        $http.get($scope.info.page.next).success(function(data) {
	        	if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
			        $scope.info = data.data;
			        $scope.list_data = $scope.list_data.concat(data.data.list_data);
			    }  
        	});
      	}else{
	    	$(".load6").css('display', 'none');
	    }
    }
    /*获取详情*/
  $scope.goDetailPage = function(type, link) {

    if (type == 1) { //吃的详情页面 
      $rootScope.xmDetailUrl = link;
      $location.path('xiangmu_1');
    } else if (type == 2) { //住的详情页面
      $rootScope.xmDetailUrl = link;
      $location.path('xiangmu_2');
    } else if (type == 3) { //玩的详情页面
      $rootScope.xmDetailUrl = link;
      $location.path('xiangmu_3');
    }
  }

}]);

//吃的详情页面 
tmmApp.controller('xiangmu1Ctrl',['$scope','$rootScope','$http','$location','$sce',function($scope, $rootScope, $http, $location,$sce) {    $scope.data = {};
    $scope.data.img_list = [];
    $scope.contentHTML = '';
    $scope.showMap = false;
    $scope.imgLength = 0; //总共多少张图片
    $scope.imgIdx = 0; 	//当前第几张图片

    $http.get($rootScope.xmDetailUrl).success(function(data){
      $scope.data = data.data;
      $scope.data.img_list = data.data.img_list; 
      $scope.imgLenght = data.data.img_list.length; 

      $scope.contentHTML = $sce.trustAsHtml(data.data.content)
    }).error(function(data){
        console.log("获取吃的详情出错！");
    });

    $scope.showAddress = function(address) {
        $scope.showMap = true;
        //console.log($scope.showMap)
    }

}]);

//住的详情页面
tmmApp.controller('xiangmu2Ctrl',['$scope','$rootScope','$http','$location','$sce',function($scope, $rootScope, $http, $location,$sce) {
    $scope.data = {};
    $scope.data.img_list = {};
    $scope.contentHTML = '';
    $scope.showMap = false;

   $http.get($rootScope.xmDetailUrl).success(function(data){
		console.log(data.data);
        $scope.data = data.data;
        $scope.data.img_list = data.data.img_list;

        $scope.contentHTML = $sce.trustAsHtml(data.data.content)
        console.log(data);
    }).error(function(data){
        console.log("获取住的详情出错！");
    });

    $scope.showAddress = function(address) {
        $scope.showMap = true;
        //console.log($scope.showMap)
    }
}]);

//玩的详情页面
tmmApp.controller('xiangmu3Ctrl', ['$scope', '$rootScope', '$http', '$location', '$sce', function($scope, $rootScope, $http, $location, $sce) {
  $scope.data = {};
  $scope.data.img_list = [];
  $scope.contentHTML = '';
  $scope.showMap = false;

  $http.get($rootScope.xmDetailUrl).success(function(data){
    $scope.data = data.data;
    $scope.data.img_list = data.data.img_list;
  	$scope.contentHTML = $sce.trustAsHtml(data.data.content)
  }).error(function(data) {
    console.log("获取玩的详情出错！");
  });

  $scope.showAddress = function(address) {
    $scope.showMap = true;
  }
}]);

/*我的资料*/
tmmApp.controller('ziliaoCtrl', ['$scope', '$http', '$location', '$rootScope',function($scope, $http, $location,$rootScope) {
  $scope.json = {}; //主账号信息
  $scope.setPassw = '';
  $rootScope.phone;
  $http.get(API + '/index.php?r=store/store_home/index').success(function(data) {
    		console.log(data)
      $http.get(data.data.link).success(function(data) {
        $scope.json = data.data;
        console.log("我的资料",data); return;
        $rootScope.phone = $scope.json.store_info.phone;
        
        var store_info = $scope.json.store_info;
        if (store_info.is_set == false) {
          $scope.setPassw = '未设置';
        }

      });
    });

   /*申请编辑*/
  if ($rootScope.mobileType == 0) { //ios
    connectWebViewJavascriptBridge(function(bridge) {
      // 申请编辑
	    $scope.edit = function() {
	        // alert("打电话");
	        bridge.callHandler('ObjcCallback', {
	          'phone': '400-019-7090'
	        }, function(response) {})
	      }
	    })

  } else if ($rootScope.mobileType == 1) { //安卓
    $scope.edit = function() {
      window.jsObj.callPhone("400-019-7090");
    }
  }

}]);
  

/*查看子账号信息*/
tmmApp.controller('suboneCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
  $scope.subInfo = {}; //子账号信息
  $http.get(API + '/index.php?r=store/store_store/son_view&id=' + $routeParams.id).success(function(data) {
    $scope.subInfo = data.data;
    console.log("查看子账号信息",$scope.subInfo.store_info.phone);
  });

}]);


tmmApp.controller('subtoCtrl', ['$scope', '$http', "$routeParams", function($scope, $http, $routeParams) {
  $scope.json = {};

  $http({
    method: 'GET',
    url: "../data/myincome/sub" + $routeParams.id + ".json"
  }).success(function(data, state, headers, config) {
    $scope.json = data;

  }).error(function(data) {

  });
}]);

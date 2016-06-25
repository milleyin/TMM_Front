/**/
tmmApp.controller('TansuoCtrl', ['$scope','$http','$location','$rootScope',function($scope, $http, $location, $rootScope) {
    $scope.json = {
        'xinqing' : [],
        'address' : [],
        'desAddress' : [],
        'skin' : [],
        'season' : [],
        'list' : []
    };
    $scope.info = [];
    $scope.subbarList = [];
    $scope.showMap = false;
    var linkParams = API + '/index.php?r=api/shops/index'


    $http.get(linkParams).success(function(data,state,headers,config) {

        $scope.subbarList = data.data.search;
        $scope.info = data.data;
        $scope.json.list =  data.data.list_data;
        $rootScope.praise = $scope.info.list_data.collect_count
        //没有数据
        if($scope.json.list.length == 0){
            $(".load6").css('display','none');
        }else if($scope.info.page.next == ""){//没有分页值时隐藏
            $(".load6").css('display', 'none');
        }
    }).error(function(data){
        
    });
    $scope.tanSouOnload = function(linkParams){      

        $http.get(linkParams).success(function(data,state,headers,config) {
                
            $scope.info = data.data;
            $scope.json.list =  data.data.list_data;
            $rootScope.praise = $scope.info.list_data.collect_count
            console.log("探索", $scope.info);
            //没有数据
            if($scope.json.list.length == 0){
	        	$(".load6").css('display','none');
	        }else if($scope.info.page.next == ""){//没有分页值时隐藏
	            $(".load6").css('display', 'none');
	        }
        }).error(function(data){
            
        });
    }

    $scope.show = function(target) {
        $('.sub_bar_con').css('display', 'none');
        $('.nav_tit').removeClass('active');
        console.log(target)
        $(target).addClass('active');     
        $(target).next().show(); 
        $scope.showMap = true;     
    } 

    // window.onload = $scope.tanSouOnload(linkParams); //页面初始化加载

    $scope.hide = function(dataAttr){  
        $scope.showMap = false;  
        $('.sub_bar_con').css('display', 'none');
        if(dataAttr == "" || dataAttr == null){
            dataAttr = linkParams;
        }
        $scope.tanSouOnload(dataAttr); //根据选择的条件查询加载
    }

    $scope.navHide = function(){
        $scope.showMap = false;
        $('.sub_bar_con').css('display', 'none'); 
    }

    $scope.showMore = function() {
        
        if ($scope.info.page.next) { // 分页取数据

            $http.get($scope.info.page.next).success(function(data) {
                if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
                    $scope.info = data.data;
                    $scope.json.list =  $scope.json.list.concat(data.data.list_data);
                }
            });
        }else{
        	$(".load6").css('display', 'none');
        }
    }

    $scope.goDetailPage = function(type, link, value) {
        if (type == 1) { // 点的详情页面
            $rootScope.tuiJianPointUrl = link;
            $location.path('tuijiandetail_0/' + value);
        } else if(type == 2){ // 到线的详情页面
            $rootScope.tuiJianLineUrl = link;
            $location.path('tuijiandetail_1/' + value);
        }
    }
    
}]);
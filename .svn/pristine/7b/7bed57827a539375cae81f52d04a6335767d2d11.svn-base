tmmApp.controller('TuijianCtrl', ['$scope','$http','$location','$rootScope',function($scope, $http, $location, $rootScope) {
    $scope.$emit('LOAD');
    $scope.info = [];
    $scope.list_data = [];
    var url = API + '/index.php?r=api/shops/selected';
	
	//加载时显示动画
//	$rootScope.showload = function(){
//		
//		var str = '<div class="load6">
//					  <div class="bounce1"></div>
//					  <div class="bounce2"></div>
//					  <div class="bounce3"></div>
//					</div>';
//		
//		body.append(str);
//		
//	}
	
	//隐藏
//	$rootScope.hideload = function(){
	
//		$('.spinner').remove();
//	}
	//$rootScope.showload();定义全局的加载动画，每个控制器里只需调showload()方法
	
//	msg_list_loading = false;
//	
//		$('.load6').on('scroll', function(){
//			if ( ! msg_list_loading ){
//				load_more_msg();
//			}
//		})
//	
//	//内容动态加载方法
//	function load_more_msg(){
//			
//			var msg_list = $('.load6');
//	
//			if ( msg_list.height() + msg_list[0].scrollTop >= msg_list[0].scrollHeight - 60 ) { 
//				msg_list_loading = true;
//				msg_list.append('<div class="loading"></div>');
//				$.get('ajax_data.html').done(function( data ){ 
//					msg_list.find(".loading").remove();
//					msg_list.append( data );
//					msg_list_loading = false;
//				});
//				
//			} 
//		} 
	
	
    /* 获取数据 */
    $http.get(url).success(function(data) {
        $scope.info = data.data;
        $scope.list_data = data.data.list_data;
        console.log(data);
        $scope.$emit('UNLOAD');
        if($scope.list_data.length == 0){
        	$(".load6").css('display','none');
        }else if($scope.info.page.next == ""){//没有分页值时隐藏
            $(".load6").css('display', 'none');
        }
    })

    $scope.showMore = function() {
        $rootScope.selected = $scope.info.page.selected;

        if ($scope.info.page.next) { // 分页取数据
			
            $http.get($scope.info.page.next).success(function(data) {
                if ($scope.info.page.selectedPage < data.data.page.selectedPage) {
                    $scope.info = data.data;
                    $scope.list_data = $scope.list_data.concat(data.data.list_data);
                    $scope.$emit('UNLOAD');
                }
  
            });
        }else{
        	$(".load6").css('display', 'none');
        }
    }

    $scope.goDetailPage = function(type, link) {
        $rootScope.tuiJianDetailReturn = 0;
        if (type == 1) { // 点的详情页面
            $rootScope.tuiJianPointUrl = link;
            $location.path('tuijiandetail_0');
        } else if(type == 2){ // 到线的详情页面
            $rootScope.tuiJianLineUrl = link;
            $location.path('tuijiandetail_1');
        }
    }
    
}]); 


tmmApp.controller('Loading', ['$scope','$http','$location','$rootScope',function($scope, $http, $location, $rootScope) {    
    var str = '<div class="load6"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
    $("#loading").append(str);
    
    
    
}]);



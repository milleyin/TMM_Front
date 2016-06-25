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
		console.log(data);
        $scope.data = data.data;
        $scope.data.img_list = data.data.img_list; 
        $scope.imgLenght = data.data.img_list.length; 

          var list = $scope.data.img_list;
          
          //图片滑动效果
          console.log('list---', list);

          	//构造函数
		function Slider(opts){
			//构造函数需要的参数
			this.wrap = opts.dom;
			this.list = opts.list;
			//构造三步奏
			this.init();
			this.renderDOM();
			this.bindDOM();
		}

		//第一步 -- 初始化
		Slider.prototype.init = function() {
			//设定窗口比率
			this.radio = window.innerHeight/window.innerWidth;
			//设定一页的宽度
			this.scaleW = window.innerWidth;
			//设定初始的索引值
			this.idx = 0;
		};

		//第二步 -- 根据数据渲染DOM
		Slider.prototype.renderDOM = function(){
			var wrap = this.wrap;
			var data = this.list;
			var len = data.length;

			this.outer = document.createElement('ul');
			//根据元素的
			for(var i = 0; i < len; i++){
				var li = document.createElement('li');
				var item = data[i];
				li.style.width = window.innerWidth +'px';
				li.style.webkitTransform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
				if(item){
					//根据窗口的比例与图片的比例来确定
					//图片是根据宽度来等比缩放还是根据高度来等比缩放
					if(item['height']/item['width'] > this.radio){
						li.innerHTML = '<img height="'+ window.innerHeight +'" src="'+ item['img'] +'">';
					}else{
						li.innerHTML = '<img width="'+ window.innerWidth +'" src="'+ item['img'] +'">';
					}
				}
				this.outer.appendChild(li);
			}

			//UL的宽度和画布宽度一致
			this.outer.style.cssText = 'width:' + this.scaleW +'px';

			wrap.style.height = 230 + 'px';//设置图片的高度
			wrap.appendChild(this.outer);
		};

		Slider.prototype.goIndex = function(n){
			var idx = this.idx;
			var lis = this.outer.getElementsByTagName('li');
			var len = lis.length;
			var cidx;

			//如果传数字 2,3 之类可以使得直接滑动到该索引
			if(typeof n == 'number'){
				cidx = idx;
			//如果是传字符则为索引的变化
			}else if(typeof n == 'string'){
				cidx = idx + n*1;
			}

			//当索引右超出
			if(cidx > len-1){
				cidx = len - 1;
			//当索引左超出	
			}else if(cidx < 0){
				cidx = 0;
			}

			//保留当前索引值
			this.idx = cidx;

			$scope.imgIdx = this.idx;
			console.log("图片", $scope.imgIdx);

			//改变过渡的方式，从无动画变为有动画
			lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

			//改变动画后所应该的位移值
			lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ this.scaleW +'px, 0, 0)');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ this.scaleW +'px, 0, 0)');
		};

		//第三步 -- 绑定 DOM 事件
		Slider.prototype.bindDOM = function(){
			var self = this;
			var scaleW = self.scaleW;
			var outer = self.outer;
			var len = self.list.length;

			//手指按下的处理事件
			var startHandler = function(evt){

				//记录刚刚开始按下的时间
				self.startTime = new Date() * 1;

				//记录手指按下的坐标
				self.startX = evt.touches[0].pageX;

				//清除偏移量
				self.offsetX = 0;

				//事件对象
				var target = evt.target;
				while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
					target = target.parentNode;
				}
				self.target = target;

			};

			//手指移动的处理事件
			var moveHandler = function(evt){
				//兼容chrome android，阻止浏览器默认行为
				evt.preventDefault();

				//计算手指的偏移量
				self.offsetX = evt.targetTouches[0].pageX - self.startX;

				var lis = outer.getElementsByTagName('li');
				//起始索引
				var i = self.idx - 1;
				//结束索引
				var m = i + 3;

				//最小化改变DOM属性
				for(i; i < m; i++){
					lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
					lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)');
				}
			};

			//手指抬起的处理事件
			var endHandler = function(evt){
				evt.preventDefault();

				//边界就翻页值
				var boundary = scaleW/6;

				//手指抬起的时间值
				var endTime = new Date() * 1;

				//所有列表项
				var lis = outer.getElementsByTagName('li');

				//当手指移动时间超过300ms 的时候，按位移算
				if(endTime - self.startTime > 300){
					if(self.offsetX >= boundary){
						self.goIndex('-1');
					}else if(self.offsetX < 0 && self.offsetX < -boundary){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(self.offsetX > 50){
						self.goIndex('-1');
					}else if(self.offsetX < -50){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}
			};

			//绑定事件
			outer.addEventListener('touchstart', startHandler);
			outer.addEventListener('touchmove', moveHandler);
			outer.addEventListener('touchend', endHandler);
		};

		//初始化Slider 实例
		new Slider({
			dom : document.getElementById('canvas'),
			list : list
		});

        $scope.contentHTML = $sce.trustAsHtml(data.data.content)
        console.log(data);
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
    $scope.data.img_list = [];
    $scope.contentHTML = '';
    $scope.showMap = false;

   $http.get($rootScope.xmDetailUrl).success(function(data){
		console.log(data);
        $scope.data = data.data;
          $scope.data.img_list = data.data.img_list;
          
          var list = $scope.data.img_list;
          
          //图片滑动效果
          console.log('list---', list);

          	//构造函数
		function Slider(opts){
			//构造函数需要的参数
			this.wrap = opts.dom;
			this.list = opts.list;
			//构造三步奏
			this.init();
			this.renderDOM();
			this.bindDOM();
		}

		//第一步 -- 初始化
		Slider.prototype.init = function() {
			//设定窗口比率
			this.radio = window.innerHeight/window.innerWidth;
			//设定一页的宽度
			this.scaleW = window.innerWidth;
			//设定初始的索引值
			this.idx = 0;
		};

		//第二步 -- 根据数据渲染DOM
		Slider.prototype.renderDOM = function(){
			var wrap = this.wrap;
			var data = this.list;
			var len = data.length;

			this.outer = document.createElement('ul');
			//根据元素的
			for(var i = 0; i < len; i++){
				var li = document.createElement('li');
				var item = data[i];
				li.style.width = window.innerWidth +'px';
				li.style.webkitTransform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
				if(item){
					//根据窗口的比例与图片的比例来确定
					//图片是根据宽度来等比缩放还是根据高度来等比缩放
					if(item['height']/item['width'] > this.radio){
						li.innerHTML = '<img height="'+ window.innerHeight +'" src="'+ item['img'] +'">';
					}else{
						li.innerHTML = '<img width="'+ window.innerWidth +'" src="'+ item['img'] +'">';
					}
				}
				this.outer.appendChild(li);
			}

			//UL的宽度和画布宽度一致
			this.outer.style.cssText = 'width:' + this.scaleW +'px';

			wrap.style.height = 230 + 'px';//设置图片的高度
			wrap.appendChild(this.outer);
		};

		Slider.prototype.goIndex = function(n){
			var idx = this.idx;
			var lis = this.outer.getElementsByTagName('li');
			var len = lis.length;
			var cidx;

			//如果传数字 2,3 之类可以使得直接滑动到该索引
			if(typeof n == 'number'){
				cidx = idx;
			//如果是传字符则为索引的变化
			}else if(typeof n == 'string'){
				cidx = idx + n*1;
			}

			//当索引右超出
			if(cidx > len-1){
				cidx = len - 1;
			//当索引左超出	
			}else if(cidx < 0){
				cidx = 0;
			}

			//保留当前索引值
			this.idx = cidx;

			//改变过渡的方式，从无动画变为有动画
			lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

			//改变动画后所应该的位移值
			lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ this.scaleW +'px, 0, 0)');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ this.scaleW +'px, 0, 0)');
		};

		//第三步 -- 绑定 DOM 事件
		Slider.prototype.bindDOM = function(){
			var self = this;
			var scaleW = self.scaleW;
			var outer = self.outer;
			var len = self.list.length;

			//手指按下的处理事件
			var startHandler = function(evt){

				//记录刚刚开始按下的时间
				self.startTime = new Date() * 1;

				//记录手指按下的坐标
				self.startX = evt.touches[0].pageX;

				//清除偏移量
				self.offsetX = 0;

				//事件对象
				var target = evt.target;
				while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
					target = target.parentNode;
				}
				self.target = target;

			};

			//手指移动的处理事件
			var moveHandler = function(evt){
				//兼容chrome android，阻止浏览器默认行为
				evt.preventDefault();

				//计算手指的偏移量
				self.offsetX = evt.targetTouches[0].pageX - self.startX;

				var lis = outer.getElementsByTagName('li');
				//起始索引
				var i = self.idx - 1;
				//结束索引
				var m = i + 3;

				//最小化改变DOM属性
				for(i; i < m; i++){
					lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
					lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)');
				}
			};

			//手指抬起的处理事件
			var endHandler = function(evt){
				evt.preventDefault();

				//边界就翻页值
				var boundary = scaleW/6;

				//手指抬起的时间值
				var endTime = new Date() * 1;

				//所有列表项
				var lis = outer.getElementsByTagName('li');

				//当手指移动时间超过300ms 的时候，按位移算
				if(endTime - self.startTime > 300){
					if(self.offsetX >= boundary){
						self.goIndex('-1');
					}else if(self.offsetX < 0 && self.offsetX < -boundary){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(self.offsetX > 50){
						self.goIndex('-1');
					}else if(self.offsetX < -50){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}
			};

			//绑定事件
			outer.addEventListener('touchstart', startHandler);
			outer.addEventListener('touchmove', moveHandler);
			outer.addEventListener('touchend', endHandler);
		};

		//初始化Slider 实例
		new Slider({
			dom : document.getElementById('canvas'),
			list : list
		});

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
		console.log(data);
        $scope.data = data.data;
          $scope.data.img_list = data.data.img_list;
          
          var list = $scope.data.img_list;
          
          //图片滑动效果
          console.log('list---', list);

          	//构造函数
		function Slider(opts){
			//构造函数需要的参数
			this.wrap = opts.dom;
			this.list = opts.list;
			//构造三步奏
			this.init();
			this.renderDOM();
			this.bindDOM();
		}

		//第一步 -- 初始化
		Slider.prototype.init = function() {
			//设定窗口比率
			this.radio = window.innerHeight/window.innerWidth;
			//设定一页的宽度
			this.scaleW = window.innerWidth;
			//设定初始的索引值
			this.idx = 0;
		};

		//第二步 -- 根据数据渲染DOM
		Slider.prototype.renderDOM = function(){
			var wrap = this.wrap;
			var data = this.list;
			var len = data.length;

			this.outer = document.createElement('ul');
			//根据元素的
			for(var i = 0; i < len; i++){
				var li = document.createElement('li');
				var item = data[i];
				li.style.width = window.innerWidth +'px';
				li.style.webkitTransform = 'translate3d('+ i*this.scaleW +'px, 0, 0)';
				if(item){
					//根据窗口的比例与图片的比例来确定
					//图片是根据宽度来等比缩放还是根据高度来等比缩放
					if(item['height']/item['width'] > this.radio){
						li.innerHTML = '<img height="'+ window.innerHeight +'" src="'+ item['img'] +'">';
					}else{
						li.innerHTML = '<img width="'+ window.innerWidth +'" src="'+ item['img'] +'">';
					}
				}
				this.outer.appendChild(li);
			}

			//UL的宽度和画布宽度一致
			this.outer.style.cssText = 'width:' + this.scaleW +'px';

			wrap.style.height = 230 + 'px';//设置图片的高度
			wrap.appendChild(this.outer);
		};

		Slider.prototype.goIndex = function(n){
			var idx = this.idx;
			var lis = this.outer.getElementsByTagName('li');
			var len = lis.length;
			var cidx;

			//如果传数字 2,3 之类可以使得直接滑动到该索引
			if(typeof n == 'number'){
				cidx = idx;
			//如果是传字符则为索引的变化
			}else if(typeof n == 'string'){
				cidx = idx + n*1;
			}

			//当索引右超出
			if(cidx > len-1){
				cidx = len - 1;
			//当索引左超出	
			}else if(cidx < 0){
				cidx = 0;
			}

			//保留当前索引值
			this.idx = cidx;

			//改变过渡的方式，从无动画变为有动画
			lis[cidx].style.webkitTransition = '-webkit-transform 0.2s ease-out';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

			//改变动画后所应该的位移值
			lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
			lis[cidx-1] && (lis[cidx-1].style.webkitTransform = 'translate3d(-'+ this.scaleW +'px, 0, 0)');
			lis[cidx+1] && (lis[cidx+1].style.webkitTransform = 'translate3d('+ this.scaleW +'px, 0, 0)');
		};

		//第三步 -- 绑定 DOM 事件
		Slider.prototype.bindDOM = function(){
			var self = this;
			var scaleW = self.scaleW;
			var outer = self.outer;
			var len = self.list.length;

			//手指按下的处理事件
			var startHandler = function(evt){

				//记录刚刚开始按下的时间
				self.startTime = new Date() * 1;

				//记录手指按下的坐标
				self.startX = evt.touches[0].pageX;

				//清除偏移量
				self.offsetX = 0;

				//事件对象
				var target = evt.target;
				while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
					target = target.parentNode;
				}
				self.target = target;

			};

			//手指移动的处理事件
			var moveHandler = function(evt){
				//兼容chrome android，阻止浏览器默认行为
				evt.preventDefault();

				//计算手指的偏移量
				self.offsetX = evt.targetTouches[0].pageX - self.startX;

				var lis = outer.getElementsByTagName('li');
				//起始索引
				var i = self.idx - 1;
				//结束索引
				var m = i + 3;

				//最小化改变DOM属性
				for(i; i < m; i++){
					lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
					lis[i] && (lis[i].style.webkitTransform = 'translate3d('+ ((i-self.idx)*self.scaleW + self.offsetX) +'px, 0, 0)');
				}
			};

			//手指抬起的处理事件
			var endHandler = function(evt){
				evt.preventDefault();

				//边界就翻页值
				var boundary = scaleW/6;

				//手指抬起的时间值
				var endTime = new Date() * 1;

				//所有列表项
				var lis = outer.getElementsByTagName('li');

				//当手指移动时间超过300ms 的时候，按位移算
				if(endTime - self.startTime > 300){
					if(self.offsetX >= boundary){
						self.goIndex('-1');
					}else if(self.offsetX < 0 && self.offsetX < -boundary){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(self.offsetX > 50){
						self.goIndex('-1');
					}else if(self.offsetX < -50){
						self.goIndex('+1');
					}else{
						self.goIndex('0');
					}
				}
			};

			//绑定事件
			outer.addEventListener('touchstart', startHandler);
			outer.addEventListener('touchmove', moveHandler);
			outer.addEventListener('touchend', endHandler);
		};

		//初始化Slider 实例
		new Slider({
			dom : document.getElementById('canvas'),
			list : list
		});

    $scope.contentHTML = $sce.trustAsHtml(data.data.content)
    console.log(data);
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

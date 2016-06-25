var tmmApp = angular.module('tmmApp', ['ngRoute','ngTouch']);

var API = 'https://m.365tmm.com';
// var API = 'http://172.16.1.219/tm';
 // var API = 'http://test2.365tmm.net';

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

tmmApp.run(['$rootScope','$location', function($rootScope,$location) {

    $rootScope.isLogin = false;
    $rootScope.user = {}; // 存储用户信息
    $rootScope.tuiJianDetailUrl = ''; // 推荐详情获取地址
    $rootScope.tuiJianPointUrl = ''; // 推荐点地址
    $rootScope.tuiJianLineUrl = ''; // 推荐线地址
    $rootScope.tuiJianMoreUrl = ''; // 推荐详情查看更多地址
    $rootScope.tuiJianDetailLoginUrl = 0; //推荐详情点赞登录后仍留在详情页
    $rootScope.tuiJianDetailReturn = 0; //详情后退按钮返回推荐，如果需要登录后的返回2层
    
    $rootScope.saveDotItem = []; // 存储点的订单信息

    $rootScope.orderInfoText = {}; // 订单详情页面信息
    $rootScope.mobileType = MobileType();  //手机类型

    // 支付成功处理
    $rootScope.payResult = function(str) {
        if (str == 1) {
            $location.path('myorder');       
        } else {
            if ($rootScope.mobileType == 0) { //ios
                connectWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('ObjcCallback', {
                      'Tips': '支付失败!'
                    }, function(response) {})
                });
            } else if ($rootScope.mobileType == 1) {
                window.jsObj.prompt("支付失败!");
            }
        }
    }

    // 主页跳到觅鲜页面
    $rootScope.goMixian = function(url) {
        if ($rootScope.mobileType == 0) { //ios
          connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'youzan_1': url
              }, function(response) {})
          });
        } else if ($rootScope.mobileType == 1) {
          window.jsObj.jumpActivity(url, 0);
        } 
    }

    // 详情页面跳到觅鲜页面
    $rootScope.goMixian2 = function(url) {
        if ($rootScope.mobileType == 0) { //ios
          connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'youzan_2': url
              }, function(response) {})
          });
        } else if ($rootScope.mobileType == 1) {
          window.jsObj.jumpActivity(url, 1);
        } 
    }

    // 退出觅鲜页面
    $rootScope.exitMixian = function() {

        if ($rootScope.mobileType == 0) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('ObjcCallback', {
                    'youzan_exit': ''
                  }, function(response) {})
              });
        } else if ($rootScope.mobileType == 1) {
            window.jsObj.hindJumpActivity();
        }
    }

    //
    $rootScope.loadApp = function() {
        window.location.href = "http://m.365tmm.com/index.php?r=admin/tmm_qrcode/user";
    }

}]);

tmmApp.config(['$routeProvider','$httpProvider',function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/tuijian',{
            templateUrl : 'tpls/tuijian.html',
            controller : 'TuijianCtrl'
        })
        .when('/tuijiandetail_0/:id',{
            templateUrl : 'tpls/tuijiandetail_0.html',
            controller : 'TuijianPointCtrl'
        })
        .when('/tuijiandetail_1/:id',{
            templateUrl : 'tpls/tuijiandetail_1.html',
            controller : 'TuijianLineCtrl'
        })
        .when('/mybookinfo/:id/:type',{ 
            templateUrl : 'tpls/myBookInfo.html',
            controller : 'MyBookInfo'
        })
        .when('/dotexterior/:id',{ 
            templateUrl : 'tpls/dotExterior.html',
            controller : 'dotExterior'
        })
        .when('/tuijiandetail_2/:id',{
            templateUrl : 'tpls/tuijiandetail_2.html',
            controller : 'TuijianActCtrl'
        })
        .when('/jiebanyouline',{
            templateUrl : 'tpls/jiebanyouline.html',
            controller : 'JieBanYouLineCtrl'
        })
        .when('/order_0/:id',{
            templateUrl : 'tpls/order_0.html',
            controller : 'OrderCtrl'
        })
        .when('/order_1/:id',{
            templateUrl : 'tpls/order_1.html',
            controller : 'OrderLineCtrl'
        })
        .when('/orderDetail/:id',{
            templateUrl : 'tpls/myorderdetail_1.html',
            controller : 'OrderDetailCtrl'
        })
        .when('/orderDetail2/:id',{
            templateUrl : 'tpls/myorderdetail_2.html',
            controller : 'OrderDetail2Ctrl'
        })
        .when('/tuijianpointlist',{
            templateUrl : 'tpls/tuijianpointlist.html',
            controller : 'TuijianPointListCtrl'
        })
        .when('/tansuo',{
            templateUrl : 'tpls/tansuo.html',
            controller : 'TansuoCtrl'
        })
        .when('/my',{
            templateUrl : 'tpls/my.html',
            controller : 'MyCtrl'
        })
        .when('/qidai',{
            templateUrl : 'tpls/qidai.html',
        })
        .when('/myinfo',{
            templateUrl : 'tpls/myinfo.html',
            controller : 'MyInfoCtrl'
        })
        .when('/set_pwd',{
            templateUrl : 'tpls/set_pwd.html',
            controller : 'SetPwdCtrl'
        })
        .when('/set_phone',{
            templateUrl : 'tpls/set_phone.html',
            controller : 'SetPhoneCtrl'
        })
        .when('/confirm_phone',{
            templateUrl : 'tpls/set_phone.html',
            controller : 'ConfirmPhoneCtrl'
        })
        .when('/addtag/:id',{
            templateUrl : 'tpls/addtag.html',
            controller : 'AddTagCtrl'
        })
        .when('/login',{
            templateUrl : 'tpls/login.html'
        })
        .when('/acc_login',{
            templateUrl : 'tpls/acc_login.html',
            controller : 'AccLoginCtrl'
        })
        .when('/pagethree1',{
        	templateUrl : 'tpls/pagethree1.html',
        	controller : 'tuijiandindCtrl'
        })
        .when('/mob_login',{
            templateUrl : 'tpls/mob_login.html',
            controller : 'MobLoginCtrl'
        })
        .when('/jiebanyou',{
        	templateUrl : 'tpls/jiebanyou.html',
        	controller : 'JieBanYouCtrl'
        })
        .when('/jbydetail_0/:id',{
        	templateUrl : 'tpls/jbydetail_0.html',
        	controller : 'jiebanyou0Ctrl'
        })
        .when('/jbydetail_1/:id',{
        	templateUrl : 'tpls/jbydetail_1.html',
          controller : 'jiebanyou1Ctrl'
        })
        .when("/quxiaodetail",{
        	templateUrl : 'tpls/quxiaodetail.html',
        	controller : 'quxiaoCtrl'
        })
        .when('/sousuo',{
            templateUrl : 'tpls/sousuo.html',
            controller : 'SousuoCtrl'
        })
        .when('/xuanzhedian',{
            templateUrl : 'tpls/xuanzhedian.html',
            controller : 'XuanZheDianCtrl'
        })
        .when('/xuanzhexian',{
            templateUrl : 'tpls/xuanzhedian.html',
            controller : 'XuanZheXianCtrl'
        })
        .when('/selectitem',{
            templateUrl : 'tpls/selectitem.html',
            controller : 'SelectItemCtrl'
        })
        .when('/zengjiahuodong/:id',{
            templateUrl : 'tpls/zengjiahuodong.html',
            controller : 'ZengJiaHuoDongCtrl'
        })
        // .when('/tuijianpointmore_0',{   /*唐亚敏增加*/
        //     templateUrl : 'tpls/tuijianpointmore_0.html',
        //     controller : 'PointEatMoreCtrl'
        // })
        // .when('/tuijianpointmore_1',{
        //     templateUrl : 'tpls/tuijianpointmore_1.html',
        //     controller : 'PointLiveMoreCtrl'
        // })
        // 项目页面
        .when('/item/1/:id/:type',{
            templateUrl : 'tpls/tuijianpointmore_0.html',
            controller : 'PointEatMoreCtrl'
        })
        .when('/item/2/:id/:type',{
            templateUrl : 'tpls/tuijianpointmore_1.html',
            controller : 'PointLiveMoreCtrl'
        })
        .when('/item/3/:id/:type',{
            templateUrl : 'tpls/tuijianpointmore_0.html',
            controller : 'PointEatMoreCtrl'
        })
        // .when('/item/-1/:id/:type',{
        //     templateUrl : 'tpls/tuijianpointmore_0.html',
        //     controller : 'PointEatMoreCtrl'
        // })

        .when('/myfinance',{
            templateUrl : 'tpls/myfinance.html',
            controller : 'MyFinanceCtrl'
        })
        .when('/totalincome/:id',{
            templateUrl : 'tpls/totalIncome.html',
            controller : 'TotalIncomeCtrl'
        })
        .when('/tixianjilu',{
            templateUrl : 'tpls/tixianjilu.html',
            controller : 'TixianjiluCtrl'
        })
        .when('/tixiancaozuo',{
            templateUrl : 'tpls/tixiancaozuo.html',
            controller : 'TiXianCaoZuoCtrl'
        })
        .when('/baozhengjin/:id',{
            templateUrl : 'tpls/baozhengjin.html',
            controller : 'BaoZhengJinCtrl'
        })

        .when('/wodezan',{
            templateUrl : 'tpls/wodezan.html',
            controller : 'WoDeZan'
        })

        .when('/myorder',{
            templateUrl : 'tpls/myorder.html',
            controller : 'MyOrderCtrl'
        })
        .when('/myjoinact',{
            templateUrl : 'tpls/myjoinact.html',
            controller : 'MyJoinActCtrl'
        })
        .when('/myorderdetail_2/:id',{
            templateUrl : 'tpls/myorderdetail_2.html',
            controller : 'zizhu2dddetailCtrl'
        })
        .when('/myjieborderdetail_1/:id',{
            templateUrl : 'tpls/myjieborderdetail_1.html',
            controller : 'jiebdddetailCtrl'
        })
        .when('/dingzhiyou',{
            templateUrl : 'tpls/dingzhiyou.html',
            controller : 'dingzCtrl'
        })
        // 蜜鲜
        .when('/mixian',{ 
            templateUrl : 'tpls/mixian.html',
            controller : 'MiXianCtrl'
        })
        .when('/mixianitem',{ 
            templateUrl : 'tpls/mixianitem.html',
            controller : 'MiXianItemCtrl'
        })
        .otherwise({
            redirectTo : '/tuijian'
        });
    
}]);
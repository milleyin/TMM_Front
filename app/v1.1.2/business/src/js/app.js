var tmmApp = angular.module('tmmApp', ['ngRoute','ngTouch']);


// var API = 'https://m.365tmm.com';
//var API = 'http://172.16.1.219/tm';
var API = 'http://test2.365tmm.net';
// var API = 'http://172.16.1.103/tmm';

var is_main;
tmmApp.run(['$rootScope','$location', function($rootScope,$location) {

    $rootScope.login = {};
    $rootScope.login.isLogin = false;
    $rootScope.login.username = '';
    $rootScope.login.password = '';
    $rootScope.login.key = '';
    $rootScope.loginPhone = '';
    $rootScope.xmDetailUrl = ''; //项目详情链接地址
    $rootScope.mobileType = MobileType();  //手机类型
    $rootScope.orderTourLink = '';// 活动详情api地址

    $rootScope.roomNumber = function(roomNum){
        var roomName = "人间";
        if(roomNum == 1){
            return "一" + roomName;
        } else if(roomNum == 2){
            return "二" + roomName;
        } else if(roomNum == 3){
            return "三" + roomName;
        } else if(roomNum == 4){
            return "四" + roomName;
        } else if(roomNum == 5){
            return "五" + roomName;
        } else if(roomNum == 6){
            return "六" + roomName;
        } else if(roomNum == 7){
            return "七" + roomName;
        } else if(roomNum == 8){
            return "八" + roomName;
        } else if(roomNum == 9){
            return "九" + roomName;
        } else if(roomNum == 10){
            return "十" + roomName;
        } else {
            return "多" + roomName;
        }
    }

}]);

tmmApp.config(['$routeProvider','$httpProvider',function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/index',{
            templateUrl : 'tpls/myorder.html',
            controller : 'myorderCtrl'
        })
        .when('/search/:type',{
            templateUrl : 'tpls/search.html',
            controller : 'searchCtrl'
        })
        .when('/login',{
            templateUrl : 'tpls/login.html'
        })
        .when('/wodeshouru',{
            templateUrl : 'tpls/wodeshouru.html',
            controller : 'wodeshouruCtrl'
        })
        .when('/code',{
            templateUrl : 'tpls/saomiaoerweima.html'
        })
        .when('/myincomedetail/:id',{
            templateUrl : 'tpls/myincomedetail.html',
            controller : 'myincomedetailCtrl'
        })
        .when('/orderlist/:id',{
            templateUrl : 'tpls/orderlist.html',
            controller : 'orderlistCtrl'
        })
        .when('/orderlistdetail',{
            templateUrl : 'tpls/orderlistdetail.html',
            controller : 'orderlistdetailCtrl'
        })
        .when('/myorder',{
            templateUrl : 'tpls/myorder.html',
            controller : 'myorderCtrl'
        })
        .when('/myxiangmu',{
            templateUrl : 'tpls/myxiangmu.html',
            controller : 'myxmCtrl'
        })
        .when('/xiangmu_1',{
            templateUrl : 'tpls/xiangmu_1.html',
            controller : 'xiangmu1Ctrl'
        })
        .when('/xiangmu_2',{
            templateUrl : 'tpls/xiangmu_2.html',
            controller : 'xiangmu2Ctrl'
        })
        .when('/xiangmu_3',{
            templateUrl : 'tpls/xiangmu_3.html',
            controller : 'xiangmu3Ctrl'
        })
        .when('/my',{
            templateUrl : 'tpls/my.html',
            controller : 'myCtrl'
        })
        .when('/mycaiwu',{
            templateUrl : 'tpls/mycaiwu.html',
            controller : 'mycaiwuCtrl'
        })
        .when('/totalincome',{
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
        .when('/acc_login',{
            templateUrl : 'tpls/acc_login.html',
            controller : 'AccLoginCtrl'
        })
        .when('/mob_login',{
            templateUrl : 'tpls/mob_login.html',
            controller : 'MobLoginCtrl'
        })
        .when('/myziliao',{
            templateUrl : 'tpls/myziliao.html',
            controller : 'ziliaoCtrl'
        })
        .when('/modifi_pwd',{
            templateUrl : 'tpls/modifi_pwd.html',
            controller : 'SetPwdCtrl'
        })
        .when('/subaccount/:id',{
            templateUrl : 'tpls/subaccount.html',
            controller : 'suboneCtrl'
        })
        .when('/newbank/:id',{
            templateUrl : 'tpls/newbank.html',
            controller : 'newbankCtrl'
        })
        .when('/changebank',{
            templateUrl : 'tpls/changebank.html',
            controller : 'changebankCtrl'
        })
        .when('/myorderdetail/:id',{
            templateUrl : 'tpls/myorderdetail.html',
            controller : 'jieb1detailCtrl'
        })
        .when('/myzizhuorderdetail/:id',{
            templateUrl : 'tpls/myzizhuorderdetail.html',
            controller : 'zizhu1detailCtrl'
        })
        .when('/myjbyorderdetail',{
            templateUrl : 'tpls/myjbyorderdetail.html',
            controller : 'jbyorderdetailCtrl'
        })
        .when('/duanxyanz',{
            templateUrl : 'tpls/duanxyanz.html',
            controller : 'newbankCtrl'
        })
        .when('/wodexiaoxi',{
            templateUrl : 'tpls/wodexiaoxi.html'
        })
        .when('/login',{
            templateUrl : 'tpls/login.html'
        })
        .when('/set_phone',{
            templateUrl : 'tpls/set_phone.html',
            controller : 'SetPhoneCtrl'
        })
        .when('/confirm_phone',{
            templateUrl : 'tpls/set_phone.html',
            controller : 'ConfirmPhoneCtrl'
        })
        .when('/tixianduanxin',{
            templateUrl : 'tpls/tixianduanxin.html',
            controller : 'tixianduanxinCtrl'
        })
        .when('/mywallet',{
            templateUrl : 'tpls/my-wallet.html',
            controller : 'mywalletCtrl'
        })
        .when('/traderecord',{
            templateUrl : 'tpls/trade_record.html',
            controller : 'traderecordCtrl'
        })
        .when('/drawmoneyrecord',{
            templateUrl : 'tpls/draw-money-record.html',
            controller : 'drawmoneyrecordCtrl'
        })
        .when('/bank_card_management',{
            templateUrl : 'tpls/bank_card_management.html',
            controller : 'bankCardManagementCtrl'
        })
        .when('/verifyphone',{
            templateUrl : 'tpls/verify_phone.html',
            controller : 'verifyphoneCtrl'
        })
        /*.when('/withdraw',{
            templateUrl : 'tpls/withdraw.html',
            controller : 'withdrawCtrl'
        })*/
        .when('/withdraw',{
            templateUrl : 'tpls/withdraw.html',
            controller : 'tixianduanxinCtrl'
        })
        .when('/tixianinfo',{
            templateUrl : 'tpls/tixianinfo.html',
            controller : ''
        })
        .when('/addbank',{
            templateUrl : 'tpls/add_bank.html',
            controller : 'addbankCtrl'
        })
        .when('/bankprotocol',{
            templateUrl : 'tpls/bank_protocol.html',
            controller : 'bankprotocolCtrl'
        })
        
        .otherwise({
            redirectTo : '/myorder'
        });
}]);

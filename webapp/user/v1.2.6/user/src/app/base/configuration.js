angular.module('app')

.constant('ENV', {
  debug: false,
  device: 'weixin', // weixin 微信， app 手机app
  apiEndpoint: 'https://m.365tmm.com'
})

.constant('MESSAGES', {
  'order.num': '一个成人最多只能带两个儿童',
  'order.goTime': '请选择出游日期',
  'order.goNum': '请设置出游人数',
  'order.retinue': '请添加主要联系人',
  'order.retinueNum': '请确保主要联系人和随行人员总数与出游人数一致',
})

.factory('API', function(ENV) {
  var api = ENV.apiEndpoint;
  return {
    journey_index: api + '/index.php?r=api/shops/index&select_dot_thrand=thrand&page=1',
    journey_popular: api + '/index.php?r=api/shops/index&select_dot_thrand=thrand&page=1&order_brow=order_brow&is_area=is_area',
    journey_distance: api + '/index.php?r=api/shops/index&select_dot_thrand=thrand&is_area=is_area',
    
    create_mainretinue: api + '/index.php?r=api/retinue/create&type=1',
    create_retinue: api + '/index.php?r=api/retinue/create&type=0',
  };
})


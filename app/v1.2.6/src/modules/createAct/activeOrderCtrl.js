var ViewController = require('../app/ViewController'),
  appFunc = require('../utils/appFunc'),
  tpl = require('./ceateActA.tpl.html'),
  orderTpl = require('../order/act-order.tpl.html'),
  participant = require('./participantCtrl'),
  httpService = require('../services/httpService');



function OrderDetail(opts) {
  ViewController.call(this, opts);
  this.go_time = '';
  this.main_name = '';

}

OrderDetail.prototype = appFunc.extend({}, ViewController.prototype, {
  constructor: OrderDetail,
  pageWillDisplay: function() {
    this.model.total_price = this.countPrice(this.model.items_fare);
    this.model.userInfo = JSON.parse(appFunc.getLocalUserInfo());
    if (this.opts.isSetTime === '1') {
      this.go_time = this.model.actives_time.go_time;
    }
    if (this.model.actives_info.attend.main.link) {
      this.model.canSetName = true;
    } else {
      this.model.canSetName = false;
    }
  },
  pageEndDisplay: function() {
    if (this.opts.isSetTime === '0') {
      this.selectTime();
    }

    this.bind('.act-order-A-detail', 'click', this);
    // this.bind('.act-order-A-detail .submit-btn', this.submit.bind(this));
  },

  handleEvent: function(ev) {
    var ele = $$(ev.target);
    if (ele.hasClass('submit-btn')) {
      this.submit();
    } else if (ele.hasClass('set-main-name')) {
      this.setMainName(ele);
    } else if (ele.hasClass('show-people')) {
      this.showPeopole();

    }
  },

  setMainName: function(ele) {
    var self = this;
    if (self.model.actives_info.attend.main.link) {
      tmmApp.prompt('请输入联系人姓名', function(value) {
        httpService.post(self.model.actives_info.attend.main.link, {
          "Attend": {
            "name": value
          }
        }, function(data) {
          
          if (data.status == 1) {
            self.model.main_name = value;
            ele.html(self.model.main_name);
          } else {
            if (data.form) {
              for (var msg in data.form) {
                tmmApp.alert(data.form[msg][0]);
                break;
              }            
            }
          }
        }, function(data) {

        })
      })

    } else {

    }
  },

  showPeopole: function() {
    participant(this.model.actives_info.attend_list);

  },
  countPrice: function(items) {
    var total = 0;

    for (var x1 in items) {
      for (var x2 in items[x1]) {
        for (var x3 in items[x1][x2]) {
          if (items[x1][x2][x3].classliy.value === '1' || items[x1][x2][x3].classliy.value === '3') {
            for (var attr in items[x1][x2][x3].fare) {

              if (items[x1][x2][x3].fare[attr].info == '成人') {
                items[x1][x2][x3].fare[attr].number = this.model.actives_info.attend.people;
              } else if (items[x1][x2][x3].fare[attr].info == '儿童') {
                items[x1][x2][x3].fare[attr].number = this.model.actives_info.attend.children;

              }
              items[x1][x2][x3].fare[attr].count = items[x1][x2][x3].fare[attr].number * items[x1][x2][x3].fare[attr].price;
              total += items[x1][x2][x3].fare[attr].count;
            }
          } else if (items[x1][x2][x3].classliy.value === '2') {
            for (var attr in items[x1][x2][x3].fare) {

              items[x1][x2][x3].fare[attr].number = Math.ceil(this.model.actives_info.attend.people / items[x1][x2][x3].fare[attr].room_number);

              items[x1][x2][x3].fare[attr].count = items[x1][x2][x3].fare[attr].number * items[x1][x2][x3].fare[attr].price;
              total += items[x1][x2][x3].fare[attr].count;

            }
          }

        }
      }
    }

    total += this.model.actives_info.tour_price.value * this.model.actives_info.attend.number;
    return total.toFixed(2);
  },

  showPeople: function() {

  },

  selectTime: function(e) {
    var self = this;
    var oInput = document.querySelector('.act-order-A-detail .selectday-input');

    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);

    tmmApp.calendar({
      input: oInput,
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {

        self.go_time = appFunc.dateFormt(year, month, day);
        oInput.innerHTML = self.go_time;
      }

    });
  },



  /**
   * 提交订单
   * @return {[type]} [description]
   */
  submit: function() {
    var url = httpService.apiSubmitOrderForA;
    var self = this;
    var token = {
      "Order": {
        "order_price": self.model.total_price,
        "go_time": self.go_time
      },
      "OrderShops": {
        "shops_id": self.model.actives_id
      },
      "Attend": {
        "name": self.main_name
      }
    }
    if (self.opts.type === '1') {
      self.payId = self.model.actives_info.order.value;
      self.payOrder()
    } else if (self.opts.type === '0') {
      if (self.go_time === '') {
        tmmApp.alert('请设置出游时间');
        return;
      }
      httpService.post(url, token, function(data) {
        if (data.status == 1) {
          self.payId = data.data.id.value;
          self.paylink = data.data.link;
          self.payOrder();
        } else {

        }

      }, function(data) {
        tmmApp.alert('网络错误')
      })
    }



  },

  payOrder: function() {
    var self = this;
    

    appFunc.payOrder(self.payId, self.model.total_price, function(data) {
      if (data.status == 1) {

        if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
          connectWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler('ObjcCallback', {
              'PayCode': data.data.alipay
            }, function(response) {})
          });
        } else if (tmmApp.device.android) {
          var str = window.jsObj.payMoney(data.data.alipay);
        }

      } else {
        tmmApp.hideIndicator();
        tmmApp.alert('支付失败，请重试');
      }
      tmmApp.hideIndicator();
    }, function(data) {
      tmmApp.hideIndicator();
      tmmApp.alert('网络超时，请重试');
    }, function(data) {
      
      self.refreshPage(data.data.status.type.link, self.payId)
    });
  },

  refreshPage: function(url, id) {
    // tmmApp.getCurrentView().router.back({
    //   force: true,
    //   pageName: 'myView',
    //   animatePages: false
    // });
    
    httpService.getOrderDetail(
      url,
      function(dataRes, statusCode) {
        
        var hasRetinue = 0;
        for (var i = 0; i < dataRes.data.retinue.length; i++) {
          if (dataRes.data.retinue[i].is_main == 0) {
            hasRetinue = 1;
            break;
          }
        }
        if (dataRes.status == 1) {
          var data = {
            orderObj: dataRes.data,
            hasRetinue: hasRetinue,
            orderOwn: {
              'type': 3,
              'url': url
            }
          };

          var output = appFunc.renderTpl(orderTpl, data);
          tmmApp.getCurrentView().router.load({
            content: output,
            reload: true,
          });

        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        
        tmmApp.alert('网络超时，请重试');
      }
    );
  }
})

function main() {
  var link = $$(this).attr('data-link');
  var orderlink = $$(this).attr('data-shoplink');
  var isSetTime = $$(this).attr('data-time');
  var type = $$(this).attr('data-type');

  var orderDetail = new OrderDetail({
    link: link,
    orderlink: orderlink,
    tpl: tpl,
    isSetTime: isSetTime,
    type: type
  });
}

module.exports = main;

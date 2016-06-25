angular.module('payType',[])

.factory('payFunc', function($ionicPopup,$http, Resource, appFunc, device, ENV) {
  return {
    /**
     * 支付方式付款
     * @param  {[type]} id    订单id
     * @param  {[type]} type  详情页类型(1,2,3,4)=>(点,线,活动,代付)
     * @param  {[type]} money 所需要付款的钱
     * @param  {[type]} sfn   支付宝支付成功回调
     * @param  {[type]} efn   支付宝支付失败回调
     * @param  {[type]} ffn   钱包支付成功回调
     * @return {[type]}       [description]
     */
    payOrder: function(id, type,  money, sfn, efn, ffn) {
      var mask = createEle('div', 'modal-mask'),
        box = createEle('div', 'pay-order-choice'),
        oTit = createEle('div', 'pay-tit'),
        oTitClose = createEle('i', 'icon-close ticon-close'),
        oTitSpan = createEle('span', '', '选择付款方式'),
        oWrap = createEle('div', 'pay-wrap'),
        oPayWallet = createEle('div', 'pay-item'),
        oPayZhifubao = createEle('div', 'pay-item'),
        oPayWeixin = createEle('div', 'pay-item'),
        oPayPrice = createEle('div', 'pay-price', '支付'),
        oPrice = createEle('div', 'pric-num', '￥' + money),
        oBtn = createEle('div', 'zhifubao-button', '确认'),
        oWxBtn = createEle('div', 'wx-button', '确认'),
        passwd = '',
        sendFlag = true,
        isWallet = false,
        keyboard = null;

      oTit.appendChild(oTitClose);
      oTit.appendChild(oTitSpan);
      oPayPrice.appendChild(oPrice);
      box.appendChild(oTit);
      box.appendChild(oWrap);
      //支付宝支付
      if(ENV.device !== 'weixin') {
        oPayZhifubao.innerHTML = '<i class="zifubao"></i>支付宝<span class="right-arrow"><i class="icon-right-arrow"></i></span>';
      } else {
        // 添加微信支付
      }
    
      oPayWeixin.innerHTML = '<i class="icon wx"></i>微信支付<span class="right-arrow"><i class="icon-right-arrow"></i></span>';
      
      
      // 获取钱包余额
      Resource.getBurseInfo().then(function(data) {

        isWallet = Number(data.money) > Number(money);
        popupModel(data.money);   
      }, function(data) {

      });

      // 弹出模态窗口
      function popupModel(balance) {
        if (isWallet) {
          oPayWallet.innerHTML = '<i class="icon icon-wallet"></i>钱包（余额' + balance + '元）<span class="right-arrow"><i class="icon-right-arrow"></i></span>';
          oPayWallet.addEventListener('click', payUseWallet);
        } else {
          oPayWallet.className = 'pay-item disabled';
          oPayWallet.innerHTML = '<i class="icon icon-wallet"></i>钱包（余额不足）<span class="right-arrow"><i class="icon-right-arrow"></i></span>'
        }
        oTitClose.addEventListener('click', closeModel);
        //支付宝支付
        if(ENV.device !== 'weixin') {
          oPayZhifubao.addEventListener('click', payUseZhifubao);
        } else {
          // 微信支付按钮绑定事件
        }
        oPayWeixin.addEventListener('click', payUseWx);
     
        

        document.body.appendChild(mask);
        document.body.appendChild(box);
        mask.style.opacity = 1;
        
        
        
        if(ENV.device !== 'weixin') {
          payUseZhifubao();
        } else {
          payUseWx();
        }
      }

      // 支付宝付款窗口
      function payUseZhifubao() {
        oTitSpan.innerHTML = '支付宝支付';
        oWrap.innerHTML = '';
        oWrap.appendChild(oPayPrice);
        oWrap.appendChild(oPayZhifubao);
        oWrap.appendChild(oBtn);


        oPayZhifubao.removeEventListener('click', payUseZhifubao);
        oPayZhifubao.addEventListener('click', back2Pay);
        oBtn.addEventListener('click', payZhifubao);
      }

      // 微信支付窗口
      function payUseWx() {
        oTitSpan.innerHTML = '微信支付';
        oWrap.innerHTML = '';
        oWrap.appendChild(oPayPrice);
        oWrap.appendChild(oPayWeixin);
        oWrap.appendChild(oWxBtn);

        oPayWeixin.removeEventListener('click', payUseWx);
        oPayWeixin.addEventListener('click', back2Pay);
        oWxBtn.addEventListener('click', payWx);
      }

      // 返回选择支付页面
      function back2Pay() {
        oTitSpan.innerHTML = '选择付款方式';
        oWrap.innerHTML = '';
        oWrap.appendChild(oPayWallet);
        if(ENV.device !== 'weixin') {
          oWrap.appendChild(oPayZhifubao);
        }
        // app和微信环境里都有持微信支付(暂时只有微信里面才有)
        
        oWrap.appendChild(oPayWeixin);
        
        if (keyboard) keyboard.cancel();
        keyboard = null;
        box.className = 'pay-order-choice';
        if (isWallet) {
            oPayWallet.removeEventListener('click', back2Pay);
            oPayWallet.addEventListener('click', payUseWallet);
        }
        
        oPayZhifubao.removeEventListener('click', back2Pay);
        oPayZhifubao.addEventListener('click', payUseZhifubao);
        
        // 微信支付绑定事件 by Moore Mo
        
        oPayWeixin.removeEventListener('click', back2Pay);
        oPayWeixin.addEventListener('click', payUseWx);
        
      }

      // 关闭模态窗口
      function closeModel() {
        document.body.removeChild(box);
        mask.style.opacity = 0;
        setTimeout(function() {
            document.body.removeChild(mask);
        }, 400);
        if (keyboard) keyboard.cancel();
        keyboard = null;
      }

      // 支付宝支付窗口
      function payZhifubao() {
        var token = {
          "id": id,
          "pay_type": "1"
        };

        Resource.orderPay(token).then(function(data){
          sfn(data);
        }, function(data){
          efn(data);
        });
        closeModel();
      }

      // 发送微信支付请示
      function payWx() {


        if (ENV.device === 'app') {
          $http.get(ENV.apiEndpoint+ "/api/order/paywx?id="+id + '&type=1').success(function(data){
            device.wxPay(data.data.wxpay);
            closeModel();
          }).error(function(data){
            
          });
        } else {

          var arr = ['myorderdetail_1', 'myorderdetail_2', 'myorderdetail_3', 'myorderdetail_4'];
          var currentUrl = window.location.href;
          var parameter1 = arr[type - 1];
          var parameter2 = currentUrl.substring(currentUrl.indexOf('#')+2);

          var url = ENV.apiEndpoint+ "/api/order/paywx?id="+id+'&page=' + parameter1 + '&error=' + parameter2;

          window.location.href = url;
        }

        return;
        
      }

      // 钱包支付窗口
      function payUseWallet() {
        var oPasswd = createEle('div', 'passwd-wrap'),
          oPayItem,
          aPayItems = [],
          i = 0;
        passwd = '';
        oTitSpan.innerHTML = '请输入支付密码';


        oPayWallet.removeEventListener('click', payUseWallet);
        oPayWallet.addEventListener('click', back2Pay);

        oPrice.innerHTML = '￥' + money;
        for (; i < 6; i++) {
          oPayItem = createEle('div', 'passwd-item');
          oPayItem.index = i;
          aPayItems.push(oPayItem)
          oPasswd.appendChild(oPayItem);
        }

        oPayPrice.appendChild(oPrice);
        oWrap.innerHTML = '';
        oWrap.appendChild(oPayPrice);
        oWrap.appendChild(oPayWallet);
        oWrap.appendChild(oPasswd);
        box.className = 'pay-order-choice pay-wallet';

        keyboard = showkeyboard(document.body);
        keyboard.getTap(function(index) {
          passwd2box(index, aPayItems);
        })
      }

      // 展示密码到窗口
      function passwd2box(index, items) {
        if (passwd.length < 6) {
          if (index == 11) {
            passwd += 0;
          } else if (index == 12) {
            passwd = passwd.substr(0, passwd.length - 1);

          } else if (index == 10) {

          } else {
            passwd += index;
          }

          for (var i = 0; i < items.length; i++) {
            if (i < passwd.length) {
                items[i].className = 'passwd-item pwd-input';
            } else {
                items[i].className = 'passwd-item';
            }
          };
        } else {
          if (index == 12) {
            passwd = passwd.substr(0, passwd.length - 1);
            for (var i = 0; i < items.length; i++) {
              if (i < passwd.length) {
                  items[i].className = 'passwd-item pwd-input';
              } else {
                  items[i].className = 'passwd-item';
              }
            };
          }
        }
        if (passwd.length == 6) {
          if (sendFlag) {
            sendPasswd(passwd, items);
            sendFlag = false;
          }
        }
      }


      // 创建元素
      function createEle(tag, name, txt) {
        var ele = document.createElement(tag);
        if (name) ele.className = name;
        if (txt) ele.innerHTML = txt;
        return ele;
      }

      // 发送支付密码
      function sendPasswd(pass, items) {
        var token = {
          "Password": {
            "_pwd": pass
          }
        }

        Resource.sendPayPasswd(token, id).then(function(data) {
          var msg = '';


          if (data.value == 1) {
            if (data.status.value == 1) {
              // 支付成功
              msg = data.status.info;
              appFunc.alert(msg);
              closeModel();
              if (ffn) ffn(data);
              return;
            } else {
              msg = data.status.info;
            }
          } else {
            msg = data.name;
          }
          
          passwd = '';
          passwd2box(10, items);
          appFunc.alert(msg);
          sendFlag = true;
        }, function(data) {
          appFunc.alert('网络错误');
          sendFlag = true;
        });
      }
      //判断是否是微信环境
      function isWeixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      }

      /*
       *虚拟键盘
       */
      function showkeyboard(obj) {
        var items = [],
        oSpan,
        oDiv = document.createElement('div');

        oDiv.className = 'keyboard';
        for (var i = 0; i < 12; i++) {
          oSpan = document.createElement('span');
          oSpan.index = i;
          items.push(oSpan);
          oSpan.className = 'keyboard-item';
          oDiv.appendChild(oSpan);
        };

        obj.appendChild(oDiv);

        setTimeout(function() {
          oDiv.style.transform = 'translate3d(0, 0, 0)';
          oDiv.style.webkitTransform = 'translate3d(0, 0, 0)';
        }, 0);

        // 获取哪个键盘按钮点击(1-12)
        function getTap(fn) {
          oDiv.addEventListener('click', function(e) {
            fn(e.target.index + 1);
          });
        }

        // 注销键盘
        function cancel() {
          oDiv.style.transform = 'translate3d(0, 100%, 0)';
          oDiv.style.webkitTransform = 'translate3d(0, 100%, 0)';
          setTimeout(function() {
            obj.removeChild(oDiv);
          }, 250);
        }

        return {
          cancel: cancel,
          getTap: getTap
        }
      }
    }
  };
});


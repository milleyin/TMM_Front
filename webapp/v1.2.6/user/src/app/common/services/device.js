angular.module('device', [])

.factory('device', function(ENV, Resource) {

  function getLocation(fn) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fn);
    }
  }

  return {
    local: {
      SET: function(key, value) {

      },
      GET: function(key) {

      },
      RM: function(key) {

      },
      CR: function() {

      }
    },

    share: function(title, link, imgUrl, desc) {
      
      var url = window.location.href;
      Resource.getWeixinToken(url).then(function(data) {

        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"]
        });
        wx.ready(function() {
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
        })



      })

    },

    // 获取地理位置信息
    getLocation: function(fn) {
      if (ENV.isWeixin) {
        var url = window.location.href;

        Resource.getWeixinToken(url).then(function(data) {

          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['getLocation']
          });
          wx.ready(function() {
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function(res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                var token = {
                  "location": {
                    "lng": longitude,
                    "lat": latitude
                  }
                };
                Resource.setLoactionGPS(token).then(function(data) {
                 
                  fn && fn();
                }, function(data) {
                  
                });
              }
            });
          });
        })
      } else {
        getLocation(function(position) {

          var token = {
            "location": {
              "lng": position.coords.longitude,
              "lat": position.coords.latitude
            }
          };
          Resource.setLoactionGPS(token).then(function(data) {
            fn && fn();
          });

        })

      }
    }

  };
})

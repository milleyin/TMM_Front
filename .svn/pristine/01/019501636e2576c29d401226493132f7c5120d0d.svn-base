var api = 'http://pad.365tmm.net';
var image_api = api + "/ad/image.html";
var video_api = api + "/ad/video.html";
var shop_api = api + "/shop/index.html";
var award_api = api + "/config/index.html";
var state_api = api + "/pad/state.html";
var chance_api = api + "/chance/index.html";
var prize_api = api + "/prize/index.html";
var qr_api = api + "/pad/index.html";
var record_api = api + "/record/index.html"


var connectStateWorker;
var autoGetChanceWorker
var recordWorker;

// http_get
function http_get(url, successfn, errorfn) {
  $.ajax({
    type: "get",
    async: false,
    url: url,
    dataType: "json",

    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: function(data) {
      successfn && successfn(data);
    },
    error: function() {
      errorfn && errorfn();
    }
  });
}


// 视频自动播放
// var autoplay = function() {

//   var video = document.getElementById('video');
//   video.play();
// }

// $(function() {
//   var video = document.getElementById('video');
//   video.onplaying = function() {
//     jsObj.removeTimeHandler();
//   }

//   video.onclick = function() {
//     video.play();
//   }
// });


// 5秒连接一次服务器
$(function() {

  // function connectState() {
  //   http_get(state_api, function(data) {});
  // }

  // setInterval(function() {
  //   connectState();
  // }, 5000);

  if (typeof(connectStateWorker) == "undefined") {
    connectStateWorker = new Worker("js/connectState.js");
  }
  // connectStateWorker.onmessage = function(event) {
  //   // 回调不做处理
  // };
});

// banner 图
$(function() {
  var width = 452,
    i = 0,
    len = 0;
  imgSrces = [];

  http_get(image_api, function(data) {
    if (data.content.list instanceof Array) {
      data.content.list.forEach(function(item) {
        imgSrces.push(api + item.path);
      });
      len = imgSrces.length;

      main();
    }
  });

  function main() {
    var imgHtml = '';
    imgSrces.forEach(function(item) {
      imgHtml += '<img src="' + item + '" />';
    });
    var $wrap = $('.banner .banner-wrap');
    $wrap.html(imgHtml);

    setInterval(function() {
      i++;
      if (i == len) {
        i = 0;
      }
      $wrap.css('-webkit-transform', 'translate3d(' + (-i * width) + 'px,0,0)');
    }, 5000);
  }

});

// 视频
$(function() {
  http_get(video_api, function(data) {
    var video = document.getElementById('video');
    var src = api + data.content.path;
    try {
      jsObj.setVideo(494, 278, 30, 48, src);

    } catch (e) {
      video.src = src;
    }
  });
});

// 抽奖
$(function() {
  var num = 0;
  var flag = true; // 转盘是否正在转动
  var hasChange = false; // 查看有没有机会
  var path = ''; // 转盘图片路径
  var change_num = 0;
  var old_name = ''; // 姓名

  // 获取转盘图片
  http_get(award_api, function(data) {
    $('.chou img').bind('tap', function() {
      if ($('#alert1').hasClass('award-enter') || $('#alert3').hasClass('award-enter')) {} else {
        $('#alert2').addClass('award-enter');
        $('#alert2 .rule').html(data.content.info)
      }
    });
    $("#lotteryBtn").attr("src", api + data.content.path)
    path = data.content.path;
  });

  // 获取二维码
  http_get(qr_api, function(data) {
    var qr_url = data.content.url;

    var oDiv = document.getElementById('qr-code');
    var qrcode = new QRCode(oDiv, {
      width: 120,
      height: 120,
    });
    qrcode.makeCode(qr_url);
  });

  // auto_get_change();

  // // 自动获取扫码信息
  // function auto_get_change() {
  //   var change_num = 0;
  //   http_get(chance_api, function(data) {
  //     num = data.content.number;

  //     if (num == 0) {
  //       if (hasChange) {
  //         $('.qr-code').show();
  //         $('.count-box').hide();
  //       }
  //       hasChange = false;
  //       setTimeout(auto_get_change, 2000);
  //     } else {
  //       if (num != change_num) {
  //         $('.count-box .surplus').html("剩余" + num + "次抽奖机会");
  //       }
  //       if (!hasChange) {
  //         $('.qr-code').hide();
  //         $('.count-box').show();
  //       }
  //       hasChange = true;
  //       change_num = num;
  //       setTimeout(auto_get_change, 2000);
  //     }

  //   }, function(data) {
  //     if (hasChange) {
  //       $('.qr-code').show();
  //       $('.count-box').hide();
  //     }
  //     hasChange = false;
  //     setTimeout(auto_get_change, 2000);
  //   });
  // }

  if (typeof(autoGetChanceWorker) == "undefined") {
    autoGetChanceWorker = new Worker("js/autoGetChance.js");
  }

  autoGetChanceWorker.onmessage = function(event) {
    var name = event.data.name;
    num = event.data.number;

    if (num == 0) {
      if (hasChange) {
        $('.qr-code').show();
        $('.count-box').hide();
      }
      hasChange = false;
      // setTimeout(auto_get_change, 2000);
    } else {
      if (num != change_num || name != old_name) {
        $('.count-box .surplus').html("剩余" + num + "次抽奖");
        $('.count-box .name').html(name);
      }
      if (!hasChange) {
        $('.qr-code').hide();
        $('.count-box').show();
      }
      hasChange = true;
      change_num = num;
      old_name = name;
      // setTimeout(auto_get_change, 2000);
    }

  };

  var awards_type, awards_text, awards_url;

  var rotateFunc = function(awards, angle, text, url) { //awards:奖项，angle:奖项对应的角度
    awards_type = awards;
    awards_text = text;
    awards_url = url;
    setTimeout(function() {
      $('#lotteryBtn').css({ "-webkit-transform": "rotate(" + angle + "deg)", "transition": "all 5s ease" });
    }, 0);

  };

  $('#lotteryBtn').bind('transitionend', function() {

    if (awards_type == -1) {

    } else {
      if (awards_url) {
        var oDiv = document.getElementById('qr-url');
        oDiv.innerHTML = "";
        var qrcode = new QRCode(oDiv, {
          width: 180,
          height: 180,
        });

        qrcode.makeCode(awards_url);
        $('#alert3').addClass('award-enter');
        $('#alert3 .txt').html(awards_text);
      } else {
        $('#alert1').addClass('award-enter');
        $('#alert1 .txt').html(awards_text);
      }
    }
    awards_type = '';
    awards_text = '';
    awards_url = '';
    setTimeout(function() {
      flag = true;
    }, 500);
  });


  $('.lottery-star').bind('tap', function() {
    if (flag && hasChange) {
      flag = false;
      $('#lotteryBtn').css({ "-webkit-transform": "rotate(" + 0 + "deg)", "transition": "all 0s" });
      $('#lotteryBtn').addClass('auto-rotate')
      http_get(prize_api, function(data) {
        $('#lotteryBtn').removeClass('auto-rotate');
        if (data.content.config.path == path) {
          rotateFunc(data.content.status.value, data.content.angle, data.content.name, data.content.url);
        } else {
          path = data.content.config.path;
          var img = $('#lotteryBtn').get(0);
          img.src = api + data.content.config.path;
          img.onload = function() {
            rotateFunc(data.content.status.value, data.content.angle, data.content.name, data.content.url);
          }
          $('#alert2 .rule').html(data.content.config.info)
        }
      }, function() {
        $('#lotteryBtn').removeClass('auto-rotate');
        alert('网络错误，请重新抽奖');
        flag = true;
      })
    }
  })

  $('.award-alert .close').bind('tap', function() {
    $(this).parent().removeClass('award-enter');
  });
  $('.award-alert .btn').bind('tap', function() {
    $(this).parent().removeClass('award-enter');
  });
});


// 底部广告
$(function() {

  http_get(shop_api, function(data) {
    var imgSrces = [];
    var imgs = '';
    data.content.shop.forEach(function(item) {
      imgSrces.push(api + item.path);
    });
    
    try {
      imgs = imgSrces.join(',');

      jsObj.setImages(315, 606, 0, 10, 10, 10, imgs);
    } catch (e) {
      var html = '';
      imgSrces.forEach(function(item) {
        html += '<li class="item"><img src="' + item + '" /></li>';
      });
      $('.slider ul').css({"width": data.content.shop.length * (315+24)})
      $('.slider ul').html(html);
    }

    // new IScroll('.footer .slider', { scrollX: true, scrollY: false});

  });
});


// 获奖信息
$(function() {
  var contents = [];
  var isShow = false;
  var timer = null;

  // 获取获奖人信息
  // function get_record() {
  http_get(record_api, function(data) {

    data.content.list.forEach(function(item, index) {
      contents.push("恭喜" + item.name.substring(0, 5) + "　　" + "获得" + item.prize_name + index);
    });

    if (contents.length <= 3) {

      $('.winning').hide();
      isShow = false;
    } else {
      if (!isShow) {
        $('.winning').show();
        render();
      }
      isShow = true;
    }
  });
  // }

  function render() {
    var i = 0;
    $ul = $('.con-items ul');
    clearInterval(timer);
    if ($ul.find('li').length < 3) {
      for (; i < 3; i++) {
        $ul.append('<li>' + contents[i] + '</li>');

      }
    }
    timer = setInterval(function() {

      if (i == contents.length) {
        i = 0;
      }
      var len = $ul.find('li').length;
      if (len >= 20) {
        $ul.find('li').forEach(function(item, index) {
          if (index <= len - 5) {
            item.remove()
          }

        })
      }
      $ul.append('<li>' + contents[i++] + '</li>');
    }, 1000)
  }

  // get_record();

  if (typeof(recordWorker) == "undefined") {
    recordWorker = new Worker("js/record.js");
  }
  recordWorker.onmessage = function(event) {
    var content = event.data;

    if (event.data) {
      contents.length = 0;
      content.list.forEach(function(item, index) {
        contents.push("恭喜" + item.name.substring(0, 5) + "　　" + "获得" + item.prize_name);
      });
    }

    if (contents.length <= 3) {
      $('.winning').hide();
      isShow = false;
    } else {
      if (!isShow) {
        $('.winning').show();
        render();
      }
      isShow = true;
    }

    // contents.length = 0;
    // content.list.forEach(function(item) {
    //   contents.push("恭喜" + item.name + "　　" + "获得" + item.prize_name);
    // });
    // if (contents.length <= 3) {
    //   $('.winning').hide();
    //   isShow = false;
    // } else {
    //   if (!isShow) {
    //     $('.winning').show();
    //     render();
    //   }
    //   isShow = true;
    // }
  };


  // setInterval(get_record, 12000);
});

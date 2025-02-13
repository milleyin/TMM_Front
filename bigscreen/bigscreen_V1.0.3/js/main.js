var api = 'http://pad.365tmm.net';
// var api = 'https://pad.365tmm.com';
var image_api = api + "/ad/image.html";
var video_api = api + "/ad/video.html";
var shop_api = api + "/shop/index.html";
var award_api = api + "/config/index.html"; //原始获取抽奖规则的内容
var award_image_api = api + "/prize/image.html"; //获取转盘的8张图片
var state_api = api + "/pad/state.html";
var chance_api = api + "/chance/index.html";
var prize_api = api + "/prize/index.html";
var qr_api = api + "/pad/index.html";
var record_api = api + "/record/index.html"; //获奖的名单
var prizes_sel_url = api + "/record/select.html"; //是否有未领取的奖品



var connectStateWorker;
var autoGetChanceWorker;
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
      if (data.errorCode == 404) return;
      successfn && successfn(data);
    },
    error: function() {
      errorfn && errorfn();
    }
  });
}

function alertFn(str) {
  try {
    jsObj.prompt(str);
  } catch (e) {
    alert(str);
  }
}

// 隐藏导航栏
$(function() {
  try {
    window.jsObj.hideNavigationBar();
  } catch (e) {

  }
});

// 5秒连接一次服务器
$(function() {
  if (typeof(connectStateWorker) == "undefined") {
    connectStateWorker = new Worker("js/connectState.js");
  }
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



// 抽奖
$(function() {
  var num = 0;
  var flag = true; // 转盘是否正在转动
  var hasChange = false; // 查看有没有机会
  var path = ''; // 转盘图片路径
  var change_num = 0;
  var old_name = ''; // 姓名

  var canAnimation;
  var index = 1; //这个用来记录当前循环的次数，比如点了抽奖要转四圈，每转一圈有8个奖品，那一共就要循环8*圈数
  var circles = 1; //抽奖要转的圈数
  var currentcircles = 1; //记录当前是第几圈setinterval的第二个参数，通过操纵他来实现变速
  var speed = 0; //转动的速度

  var turntable_con = []; //保存初始转盘内容
  // 打印的内容
  var printContent = {};
  // 免费抽奖--打印的链接
  var freePrintUrl = "";

  /**
   * DOM 全局变量
   */
  var $roundelGoods = $('.roundelgoods');
  var $turn1 = $('#turn1');
  var $idAlert = []; //存储7个alert提示
  for (var i = 0; i < 8; i++) {
    $idAlert.push($("#alert" + i));
  }

  //获取抽奖规则的内容
  http_get(award_api, function(data) {
    $('.chou img').bind('tap', function() {
      if ($idAlert[1].hasClass('award-enter') || $idAlert[3].hasClass('award-enter') || $idAlert[4].hasClass('award-enter') || $idAlert[5].hasClass('award-enter') || $idAlert[6].hasClass('award-enter') || $idAlert[7].hasClass('award-enter')) {} else {
        $idAlert[2].addClass('award-enter');
        $idAlert[2].find(".rule").html(data.content.info);
      }
    });
  });

  //获取转盘奖项的内容并填充
  http_get(award_image_api, function(data) {
    for (var i = 0; i < 8; i++) {
      $("#turn" + data.content[i].position + " img").attr("src", api + data.content[i].path);
      turntable_con.push(data.content[i].path);
    }
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


  if (typeof(autoGetChanceWorker) == "undefined") {
    autoGetChanceWorker = new Worker("js/autoGetChance.js");
  }

  autoGetChanceWorker.onmessage = function(event) {
    if (event.data.errorCode == 302 && event.data.location === "/login/index.html") {
      try {
        window.jsObj.hideImages();
        window.jsObj.hideVedio();
      } catch (e) {

      }
      window.location.href = "index.html";
    }

    var name = event.data.content.name;
    num = event.data.content.number;
    if (num == 0 || num === undefined) { //显示扫码还是抽奖
      if (hasChange) {
        $('.qr-code').show();
        $('.count-box').hide();
      }
      hasChange = false;
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
    }

  };


  /**
   * receive_type 1:没中奖 2:中奖没有二维码 3:中奖有二维码
   * awards_type 中奖或者没中奖
   * awards_text 中奖的类型
   * endpointPos 抽奖停留的位置
   * awards_url 生成奖品二维码的链接
   * awards_pay 1：付费抽奖
   * endpoint 抽中的位置
   * prizes_sel_val 奖品处于的状态 （-2：待选择）
   * user_name 中奖人的名字
   */
  var awards_type, awards_text, awards_url, endpoint, awards_pay_type, prizes_sel_val, user_name;
  var rotateFunc = function(awards, receive, endpointPos, text, url, awards_pay, prizes_val, name) { //awards:奖项，angle:奖项对应的角度
    awards_type = awards; //中奖的类型
    receive_type = receive;
    awards_text = text;
    awards_url = url;
    endpoint = endpointPos;
    awards_pay_type = awards_pay;
    prizes_sel_val = prizes_val;
    user_name = name;
  };

  //初始进来判断付费抽奖是否有未领取的，如果有则弹出领奖框
  function hasOrNotPrize() {
    try {
      $.ajax({
        type: "get",
        async: false,
        url: prizes_sel_url,
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
          if (data.errorCode == 200) {
            $idAlert[6].find(".tit").html("恭喜 " + data.content.name + " 抽中");
            $idAlert[6].find(".txt").html(data.content.prize_name);
            $idAlert[6].addClass('award-enter');
            prizes_sel_val = -2;
          }
        },
        error: function() {
          //抽奖禁止转动
          window.cancelAnimationFrame(canAnimation);
          alertFn('网络错误，请重新抽奖');
          flag = true;
          return;
        }
      });
    } catch (e) {
      //抽奖禁止转动
      window.cancelAnimationFrame(canAnimation);
      alertFn('网络错误，请重新抽奖');
      flag = true;
      return;
    }
  }

  hasOrNotPrize();
  //显示中奖的信息
  var showPrizeInfo = function() {

    if (awards_type == -1) {

    } else { //需要扫描领取的奖品
      if (awards_pay_type == 1) { //付费抽奖
        $idAlert[6].find(".tit").html("恭喜 " + user_name + "抽中");
        $idAlert[6].find(".txt").html(awards_text);
        $idAlert[6].addClass('award-enter');
      } else { //免费抽奖
        if (receive_type == 1 || receive_type == 3) {
          var oDiv = document.getElementById('qr-url');
          oDiv.innerHTML = "";
          var qrcode = new QRCode(oDiv, {
            width: 180,
            height: 180,
          });

          qrcode.makeCode(awards_url);
          $idAlert[3].find(".tit").html("恭喜 " + user_name + "抽中");
          $idAlert[3].find(".txt").html(awards_text);
          $idAlert[3].addClass('award-enter');
        } else if (receive_type == 2) { //打印小票领取的奖品
          $idAlert[1].find(".tit").html("恭喜 " + user_name + "抽中");
          $idAlert[1].find(".txt").html(awards_text);
          $idAlert[1].addClass('award-enter');
        }
      }

    }
    awards_type = '';
    awards_text = '';
    awards_url = '';
  }

  //获取抽奖内容相关数据
  var rotateInfo = function() {
    try {
      $.ajax({
        type: "get",
        async: false,
        url: prize_api,
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
          if (data.errorCode == 404) {
            //抽奖禁止转动
            window.cancelAnimationFrame(canAnimation);
            alertFn('奖品已抽完，请重新抽奖');
            flag = true;
            return;
          } else if (data.errorCode == 302 && data.location == "/record/select.html") {
            //抽奖禁止转动
            window.cancelAnimationFrame(canAnimation);
            hasOrNotPrize();
            flag = true;
            return;
          }
          endpoint = data.content.site;

          //判断转盘中奖品设置是否有更改
          var turntable_array = data.content.prizes; //存储新读出的转盘数据
          var turntable_count = 0;

          for (key in turntable_array) {
            var count = 0;
            var stra = turntable_array[key].path;
            var strb = turntable_con[key];
            if (stra == strb) {
              count++;
            }
            if (count === 0) { //如转盘哪个图片有更换，就重新加载
              turntable_count = 1;
              $("#turn" + turntable_array[key].position + " img").attr("src", api + turntable_array[key].path);
            }
          }
          if (turntable_count != 0) {
            turntable_con = [];
            for (key in turntable_array) {
              turntable_con.push(turntable_array[key].path);
            }
            $idAlert[2].find(".rule").html(data.content.config.info);
          }
          if (data.content.type.value == 0 || data.content.receive_type.value == 2) { //免费抽奖---需打印---保存打印地址
            freePrintUrl = data.content.print_status.url;
          }
          rotateFunc(data.content.status.value, data.content.receive_type.value, data.content.site, data.content.name, data.content.url, data.content.type.value, data.content.select.value, data.content.user_name);
        },
        error: function() {
          //抽奖禁止转动
          window.cancelAnimationFrame(canAnimation);
          alertFn('网络错误，请稍后再试');
          flag = true;
          return;
        }
      });
    } catch (e) {
      //抽奖禁止转动
      window.cancelAnimationFrame(canAnimation);
      alertFn('网络错误，请重新抽奖');
      flag = true;
      return;
    }
  };

  var $drawturn = []; //存储8个奖项的元素
  for (var i = 0; i < 8; i++) {
    $drawturn.push($("#turn" + (i + 1)));
  }

  //点击抽奖按钮，开始抽奖
  $('.count-box').bind('tap', function() {
    var pagerStatusVal = jsObj.pagerStatus();
    // var pagerStatusVal = 0;
    if (pagerStatusVal == 1) { //先判断是否有纸 0:有纸 1.纸接近末端 2.无纸 3.打印机异常
      $idAlert[7].find('.txt').html('打印纸已快使用完,请联系商家处理');
      $idAlert[7].addClass('award-enter');
      return;
    } else if (pagerStatusVal == 2) {
      $idAlert[7].find('.txt').html('打印纸已使用完，请联系商家处理');
      $idAlert[7].addClass('award-enter');
      return;
    } else if (pagerStatusVal == 3) {
      $idAlert[7].find('.txt').html('打印机异常, 请联系商家处理');
      $idAlert[7].addClass('award-enter');
      return;
    }

    if (flag == false) {
      return;
    }
    circles = Math.round(Math.random() + 3); //随机旋转的圈数(3-4圈)

    //当前的圈数
    currentcircles = 1;
    speed = 0;
    //当前循环的次数
    index = 0;
    // 重置选中状态，回到第一个选中的状态
    $roundelGoods.removeClass("turn-round");
    $turn1.addClass("turn-round");

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
      function(callback) {
        setTimeout(callback, speed);
      };

    //总圈数
    var count_index;
    //开始循环
    if (flag) {

      //循环奖品方法
      function HighTurn() {
        flag = false;
        window.cancelAnimationFrame(canAnimation);
        // 移除其它奖品的选中状态
        //$roundelGoods.removeClass("turn-round");
        if (index != 0) {
          $drawturn[(index - 1) % 8].removeClass('turn-round');
        }
        //转到当前奖品的样式
        $drawturn[index % 8].addClass('turn-round');

        index++;

        //用来判断是否循环完了
        if (count_index == index) {
          //清除canAnimation
          window.cancelAnimationFrame(canAnimation);
          flag = true;
          showPrizeInfo(); //显示中奖信息
          return;
        }
        requestAnimationFrame(HighTurn);
      }

      canAnimation = requestAnimationFrame(HighTurn);
    }

    rotateInfo();
    count_index = endpoint + circles * 8;
  });



  $('.award-alert .close').bind('tap', function() {
    $(this).parent().removeClass('award-enter');
  });

  //放弃奖品，继续抽
  $(".btn #give-up").bind('tap', function() {
    if (prizes_sel_val == -2) {
      try {
        $.ajax({
          type: "get",
          async: false,
          url: prizes_sel_url,
          dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: function(data) {
            http_get(data.content.quit.url, function(data) {
              if (data.content.result == true) {
                $idAlert[6].removeClass('award-enter');
              } else {
                alertFn('网络错误');
                return;
              }
            });
          },
          error: function() {
            alertFn('网络错误');
            return;
          }
        });
      } catch (e) {
        alertFn('网络错误');
        return;
      }
    } else {
      $idAlert[6].removeClass('award-enter');
    }
  });

  //付费和免费---打印小票
  function printPrizeTicket(printUrl) {
    http_get(printUrl, function(data) {
      try {
        printContent = data.content;
        var printValue = jsObj.printTicket(JSON.stringify(data.content));
        //返回值
        printCallback(printValue);
      } catch (e) {
        console.log('无法调用此方法jsObj.printTicket()');
      }
    });
  }

  /**
   * [printCallback 打印回调方法]
   * @param  {int} status 状态 0 成功 -1 失败
   */
  var printCallback = function(status) {
    if (status == 0) {
      $idAlert[5].removeClass('award-enter');
      $idAlert[6].removeClass('award-enter');
      $idAlert[1].removeClass('award-enter');
      $idAlert[4].addClass('award-enter');

      // 发送打印成功通知
      http_get(printContent.success, function(data) {}, function(data) {});
    } else if (status == -1) {
      $idAlert[1].removeClass('award-enter');
      $idAlert[6].removeClass('award-enter');
      var pagerStatusVal = jsObj.pagerStatus();
      if (pagerStatusVal == 1) { //先判断是否有纸 0:有纸 1.纸接近末端 2.无纸
        $idAlert[5].find('.txt').html('打印纸已快使用完,请联系商家处理');
        $idAlert[5].addClass('award-enter');
      } else if (pagerStatusVal == 2) {
        $idAlert[5].find('.txt').html('打印纸已使用完，请联系商家处理');
        $idAlert[5].addClass('award-enter');
      } else if (pagerStatusVal == 3) {
        $idAlert[5].find('.txt').html('打印机异常，请联系商家处理');
        $idAlert[5].addClass('award-enter');
      } else {
        $idAlert[5].find('.txt').html('请联系商家处理');
        $idAlert[5].addClass('award-enter');
      }
    }
  };

  //付费领取奖品--打印小票
  $(".btn #receive").bind("tap", function() {
    try {
      $.ajax({
        type: "get",
        async: false,
        url: prizes_sel_url,
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
          http_get(data.content.confirm.url, function(data) {
            $idAlert[1].removeClass('award-enter');
            $idAlert[6].removeClass('award-enter');
            if (data.content.receive_type.value == 1 || data.content.receive_type.value == 3) {
              var oDiv = document.getElementById('qr-url');
              oDiv.innerHTML = "";
              var qrcode = new QRCode(oDiv, {
                width: 180,
                height: 180,
              });

              qrcode.makeCode(data.content.url);
              $idAlert[3].find(".tit").html("恭喜 " + data.content.user_name + " 抽中");
              $idAlert[3].find(".txt").html(data.content.name);
              $idAlert[3].addClass('award-enter');
            } else if (data.content.receive_type.value == 2) { //打印小票领取的奖品
              //调用android的方法
              if (data.content.print_status.value == 0) { //0：打印
                printPrizeTicket(data.content.print_status.url);
              }
            }
          });
        },
        error: function() {
          alertFn('网络错误');
          return;
        }
      });
    } catch (e) {
      alertFn('网络错误');
      return;
    }
  });

  //免费抽奖---打印小票
  $idAlert[1].find(".free-btn").bind("tap", function() {
    printPrizeTicket(freePrintUrl);
  });

  //重新打印小票
  $(".btn #restart-receive").bind("tap", function() {
    if (jsObj.pagerStatus() == 0) { //先判断是否有纸 0:有纸 1.纸接近末端 2.无纸
      //调用android的方法
      var printValue = jsObj.printTicket(JSON.stringify(printContent));
      //返回值
      printCallback(printValue);
    }
  })
});

// 获奖信息
$(function() {

  var contents = [];
  var timer = null;
  var index = 0;
  var setTextObj = [];
  var getData_count = 20;
  for (var i = 0; i < 4; i++) {
    setTextObj.push($(".con-items li").eq(i));
  }

  function getData() {
    // 获取获奖人信息
    http_get(record_api, function(data) {

      data.content.list.forEach(function(item, index) {
        contents.push("恭喜" + item.name.substring(0, 8) + "　　" + "获得" + item.prize_name);
      });

      if (contents.length > 4) {
        if (contents.length % 4 == 1) {
          contents.concat(contents.slice(0, 3));
        } else if (contents.length % 4 == 2) {
          contents.concat(contents.slice(0, 2));
        } else if (contents.length % 3 == 1) {
          contents.concat(contents.slice(0, 1));
        }
      }
    });
  }

  /**
   * 更新中奖信息
   */
  function setText() {
    //统计12次后更新数据
    if (getData_count == 20) {
      getData_count = 0;
      getData();
    }
    if (index >= contents.length) {
      index = 0;
    }
    setTextObj[0].html(contents[index]);
    setTextObj[1].html(contents[index + 1]);
    setTextObj[2].html(contents[index + 2]);
    setTextObj[3].html(contents[index + 3]);
    index += 4;
    getData_count++;
  }
  //定时器
  setInterval(setText, 1000);
});

// 底部广告和视频
window.onload = function() {
  var count = 0;
  var imgs, src;

  http_get(shop_api, function(data) {
    var imgSrces = [];
    data.content.shop.forEach(function(item) {
      imgSrces.push(api + item.path);
    });
    imgs = imgSrces.join(',');
    setTimeout(function() {
      try {
        jsObj.setImages(315, 606, 0, 10, 10, 10, imgs);

      } catch (e) {
        var html = '';
        var imgSrces = imgs.split(',');
        imgSrces.forEach(function(item) {
          html += '<li class="item"><img src="' + item + '" /></li>';
        });
        $('.slider ul').css({ "width": imgSrces.length * (315 + 24) });
        $('.slider ul').html(html);
      }
    }, 500);

  });

  http_get(video_api, function(data) {
    src = api + data.content.path;
    setTimeout(function() {
      try {
        jsObj.setVideo(494, 278, 30, 48, src);

      } catch (e) {

      }
    }, 500);

  });

};
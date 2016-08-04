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
      if (data.errorCode === 404) return;
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
  try{
    window.jsObj.hideNavigationBar();
  } catch(e) {

  }
});

// 视频自动播放
/*var autoplay = function() {

  var video = document.getElementById('video');
  video.play();
}

$(function() {
  var video = document.getElementById('video');
  video.onplaying = function() {
    jsObj.removeTimeHandler();
  }

  video.onclick = function() {
    video.play();
  }
});*/


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



// 抽奖
$(function() {
  var num = 0;
  var flag = true; // 转盘是否正在转动
  var hasChange = false; // 查看有没有机会
  var path = ''; // 转盘图片路径
  var change_num = 0;
  var old_name = ''; // 姓名

  var t; //用它存放setinterval，window.clearInterval(t)
  var index = 1; //这个用来记录当前循环的次数，比如点了抽奖要转四圈，每转一圈有8个奖品，那一共就要循环8*圈数
  var circles = 1; //抽奖要转的圈数
  var currentcircles = 1; //记录当前是第几圈setinterval的第二个参数，通过操纵他来实现变速
  var speed = 0; //转动的速度
  var endpoint = 0; //最后停止的位置，即选中了谁

  //获取抽奖规则的内容
  http_get(award_api, function(data) {

    $('.chou img').bind('tap', function() {
      if ($('#alert1').hasClass('award-enter') || $('#alert3').hasClass('award-enter')) {} else {
        $('#alert2').addClass('award-enter');
        $('#alert2 .rule').html(data.content.info);
      }
    });
   /* console.log("图片",api + data.content.path);
    $("#lotteryBtn").attr("src", api + data.content.path);
    path = data.content.path;*/
    /*var imgSrc = "img/close.png";
    for(var i = 1; i < 9; i++){
      $("#turn" + [i] +" img").attr("src", imgSrc);
    }*/
  });

  //获取转盘奖项的内容并填充
  http_get(award_image_api, function(data) {
    console.log("图片",api + data.content);
    for(var i = 0; i < 8; i++){
      $("#turn" + data.content[i].position +" img").attr("src", api + data.content[i].path);
      i++;
    }
    // path = data.content.path;
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
    if (event.data.errorCode === 302 && event.data.location === "/login/index.html") {
      try {
        window.jsObj.hideImages();
        window.jsObj.hideVedio();
      } catch(e) {

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

  /**
   * receive_type 1:没中奖 2:中奖没有二维码 3:中奖有二维码
   * awards_type 中奖或者没中奖
   * awards_text 中奖的类型
   * angle 抽奖停留的位置
   * awards_url 生成奖品二维码的链接
   */
  var awards_type, awards_text, awards_url;
  var rotateFunc = function(awards, receive, angle, text, url) { //awards:奖项，angle:奖项对应的角度
    awards_type = awards; //中奖的类型
    receive_type = receive;
    awards_text = text;
    awards_url = url;

    if (awards_type == -1) {

    } else { //需要扫描领取的奖品
      if (receive_type == 1 || receive_type == 3) {
        var oDiv = document.getElementById('qr-url');
        oDiv.innerHTML = "";
        var qrcode = new QRCode(oDiv, {
          width: 180,
          height: 180,
        });

        qrcode.makeCode(awards_url);
        $('#alert3 .txt').html(awards_text);
        $('#alert3').addClass('award-enter');
      } else if (receive_type == 2) { //打印小票领取的奖品
        $('#alert1 .txt').html(awards_text);
        $('#alert1').addClass('award-enter');
      }
    }
    awards_type = '';
    awards_text = '';
    awards_url = '';
    setTimeout(function() {
      flag = true;
    }, 500);
  };

  //获取抽奖相关数据
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
          if (data.errorCode == 404){
            //window.clearInterval(t); //抽奖禁止转动
            alertFn('网络错误，请重新抽奖');
            flag = true;
            return;
          }
          
          /*if (data.content.config.path == path) { //判断转盘中奖品设置是否有更改
            console.log("data.content");
            rotateFunc(data.content.status.value, data.content.receive_type.value, data.content.angle, data.content.name, data.content.url);
          } else {
            path = data.content.config.path;
            var img = $('#lotteryBtn').get(0);
            img.src = api + data.content.config.path;
            img.onload = function() {
              rotateFunc(data.content.status.value, data.content.receive_type.value, data.content.angle, data.content.name, data.content.url);
            };
            $('#alert2 .rule').html(data.content.config.info);
          }*/
        },
        error: function() {
          //window.clearInterval(t); //抽奖禁止转动
          alertFn('网络错误，请重新抽奖');
          flag = true;
          return;
        }
      });
    } catch (e) {
      //window.clearInterval(t); //抽奖禁止转动
      alertFn('网络错误，请重新抽奖');
      flag = true;
      return;
    }
  };

  //点击抽奖按钮，开始抽奖
  $('.count-box').bind('tap', function() {
    console.log("count-box");
    if(flag == false){
      return;
    }
    flag = false;
    circles = Math.round(Math.random() * 10 + 3);
    endpoint = Math.round(Math.random() * 7);

    //当前的圈数
    currentcircles = 1;
    speed = 100;
    //当前循环的次数
    index =1;
    var goods = document.getElementsByName("roundelgoods");
    var drawturn = [];
    for (var i = 0; i <(8); i++) {
      if($('#turn'+ (i + 1)).hasClass("turn-round") ){
        if((i + 1) > 1 ) {
          $('#turn'+ (i + 1)).removeClass("turn-round");
        }
      }
      drawturn.push(document.getElementById("turn"+(i+1)));
    }

    //开始循环 
    t= setInterval(HighTurn,speed);
  });

  //循环奖品方法
  function HighTurn() {

    if (index > 1) {
      if ((index % 8) == 1) {
        $('#turn8').removeClass("turn-round");
      } else {
        $("#turn" + ((index - (8 * (currentcircles - 1))) - 1)).removeClass("turn-round");
      }
    }
    //转到当前奖品的样式
    $("#turn" + (index - (8 * (currentcircles - 1)))).addClass('turn-round');

    if ((index % 8) == 0) {
      //进入下一圈就得当前圈数+1
      currentcircles++;
    }

    index++;
    
    /*if (currentcircles == 1) { //设定的规则是在第一圈是每经过一个奖品则速度+80
      window.clearInterval(t);
      speed -= 80;
      t = setInterval(HighTurn, speed);
    } else */if (currentcircles == circles ) { //在下设定的在最后一圈的时候开始减速
      window.clearInterval(t);
      speed += 80;
      t = setInterval(HighTurn, speed);
    }

    //用来判断是否循环完了
    if (circles == currentcircles && ((index - 1) % 8) == endpoint) {
      //清除setInterval
      window.clearInterval(t);
      flag = true;
      alert("恭喜抽中了" + endpoint + "号奖品");
      return;
    }
  }

  $('.award-alert .close').bind('tap', function() {
    $(this).parent().removeClass('award-enter');
  });

  //放弃奖品，继续抽
  $(".btn #give-up").bind('tap', function(){
    $(this).parent().parent().removeClass('award-enter');
    console.log("num", num);
    /*if (num != 0 && num != undefined) { //放弃后自动抽
      $('.count-box').trigger("tap");
    }*/
  });

  //领取奖品
  $(".btn #receive").bind("tap", function(){
    $(this).parent().parent().removeClass('award-enter');
    $('#alert4').addClass('award-enter');
  })
});

// 获奖信息
$(function() {

  var contents = [];
  var timer = null;
  var index = 0;

  getData();

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

      setText();

    });
  }

  function setText() {
    if (index >= contents.length) {
      index = 0;
    }
    $('.con-items li').eq(0).html(contents[index]);
    $('.con-items li').eq(1).html(contents[index+1]);
    $('.con-items li').eq(2).html(contents[index+2]);
    $('.con-items li').eq(3).html(contents[index+3]);
    index += 4;
  }

  setInterval(setText, 1000);

  setInterval(getData, 12000);
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

      }catch(e) {
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
    setTimeout(function(){
      try {
        jsObj.setVideo(494, 278, 30, 48, src);

      } catch(e) {

      }
    }, 500);

  });

};

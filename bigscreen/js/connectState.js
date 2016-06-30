var api = 'http://pad.365tmm.net';
// var api = 'https://pad.365tmm.com';
var state_api = api + "/pad/state.html";

// 封装为函数
function Ajax(options) {

  var defaults = {
    method: 'get', // 默认提交的方法,get post
    url: '', // 请求的路径 required
    data: {}, // 请求的参数
    dataType: 'json', // 返回的内容的类型, text, xml, json
    success: function() {}, // 回调函数 required
    error: function() {}
  };

  // 用户参数覆盖默认参数    
  for (var pro in options) {
    defaults[pro] = options[pro];
  }
  // 创建ajax对象
  var xhr = null;
  try {
    xhr = new ActiveXObject('MSxml2.XMLHTTP'); // IE6以上的版本
  } catch (e) {
    try {
      xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE6以下版本
    } catch (e) {
      try {
        xhr = new XMLHttpRequest();
        if (xhr.overrideMineType) {
          xhr.overrideMineType('text/xml');
        }
      } catch (e) {
        console.log('您的浏览器不支持Ajax');
      }
    }
  }


  var method = defaults.method.toUpperCase();
  // 用于清除缓存
  var random = Math.random();


  if (typeof defaults.data == 'object') {
    var str = '';
    for (var key in defaults.data) {
      str += key + '=' + defaults.data[key] + '&';
    }
    // method=get&url=
    defaults.data = str.replace(/&$/, '');
  }

  xhr.withCredentials = true;
  if (method === 'GET') {
    if (defaults.data) {
      xhr.open('GET', defaults.url + '?' + defaults.data, true);
    } else {
      xhr.open('GET', defaults.url + '?t=' + random, true);
    }
    xhr.send();
  } else if (method === 'POST') {
    xhr.open('POST', url, true);
    // 如果需要像html表单那样POST数据，请使用setRequestHeader()来添加http头信息
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(defaults.data);
  }


  // 处理返回数据
  xhr.onreadystatechange = function() {
    var returnValue;
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        switch (defaults.dataType) {
          case 'xml':
            returnValue = xhr.responseXML;
            break;
          case 'json':
            var jsonText = xhr.responseText;
            if (jsonText) {
              returnValue = eval("(" + jsonText + ")");
            }
            break;
          default:
            returnValue = xhr.responseText;
            break;
        }
        defaults.success(returnValue);
      } else {
        defaults.error(xhr.status);
      }
    }
  }

}

// 5秒连接一次服务器
function connectState() {
  Ajax({
    method: 'get', // 默认提交的方法,get post
    url: state_api, // 请求的路径 required
    success: function(response) {

    }
  });

  setTimeout(function() {
    connectState();
  }, 5000);

}
connectState();
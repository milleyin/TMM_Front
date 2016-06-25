/**
 * [MobileType 判读是IOS/Android]
 * 0  IOS
 * 1  Android
 */
function MobileType() {
  var u = navigator.userAgent,
    app = navigator.appVersion;
  //android终端或者uc浏览器
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  //ios终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  // alert('是否是Android：' + isAndroid);
  // alert('是否是iOS：' + isiOS);
  if (isiOS) {
    return 0;
  } else if (isAndroid) {
    return 1;
  }
};
/*IOS参数初始化*/
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function() {
      callback(WebViewJavascriptBridge)
    }, false)
  }
}
connectWebViewJavascriptBridge(function(bridge) {
  bridge.init(function(message, responseCallback) {

  })
})


function mobileMessage(promptMessage){
  if (MobileType() == 0) { //ios
      connectWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('ObjcCallback', {
            'Tips': promptMessage
          }, function(response) {})
      });
  } else if (MobileType() == 1) {
      window.jsObj.prompt(promptMessage);
  }
}
/*
两个类样式轮番换
tagName：选择器名
currentClass：当前类名
newClass：要改变为的类名
*/
function my_toggleClass(tagName,currentClass,newClass){
    $(tagName).removeClass(currentClass).addClass(newClass);
};
/*
改变隐藏状态
tagName：选择器
newState:新的状态
*/
function my_toggleHide(tagName,newState){
  if(newState == "visible" || newState == "hidden"){
    $(tagName).css("visibility",newState);
  }else if(newState == "block" || newState == "none"){
    $(tagName).css("display",newState);
  }
  
};
/***
弹出层
sHtml:弹出层内容
**/
function popupDiv(sHtml){
     var oHeight=$("html").outerHeight(true),
         oWidth=$("html").width(),   //获取当前页面的高度和宽度
         wHeight=document.documentElement.clientHeight;  //可视区域的高度

    var $height = $("html").outerHeight(true),
        $width = $("html").width(),
        $mask = $("<div id='mask'></div>");
    $mask.height($height);
    $mask.width($width);
    $("body").append($mask);
    //创建弹出框
    var $popup_div = $("<div class='popup_box'><div class='head'><a id='close' href='#'><img src='../css/agent/images/line/delete_big.png'></a></div><div class='content'></div></div>"); //弹出窗体
    //窗体内容
    $popup_div.find(".content").append(sHtml);
    $("body").append($popup_div);
    
    var pWidth = $popup_div.outerWidth(true),
        pHeight = $popup_div.outerHeight(true);//弹出框的高度和宽度
    $(".popup_box").css("left",(oWidth-pWidth)/2);
    $(".popup_box").css("top",(wHeight-pHeight)/2);
    $(".popup_box .head a").css("left",(oWidth-pWidth)/2+pWidth-30);
    $(".popup_box .head a").css("top",(wHeight-pHeight)/2-15);
    //关闭
    $("#close").click(function(){
        $mask.remove();
        $popup_div.remove();
    })
    if($().find()){

    }
    return 
};

/***
动态计算div高度
用法：window.setInterval("calculate(1800,'.left_box','contentFrame')",1000); 
originalHeight:原始高度
originalClass：要被改变的div的class名（".className"）
referID:参照物的ID名（"IdName"）
**/
function calculate(originalHeight,originalClass,referID){
    var $lHeight=$(originalClass).height(); //原来高度
    var $tHeight= $(document.getElementById(referID).contentWindow.document.body).height(); //获取右边的高度
    if($lHeight < $tHeight){   
       /* alert("大于"+$tHeight);*/
        $(originalClass).height($tHeight+100);
    }else if($tHeight < originalHeight){
      /* alert("小于"+$tHeight);*/
        $(originalClass).height(originalHeight);
    } 
};

/***
iframe自适应高度
用法：<iframe id='contentFrame' name='contentFrame' frameborder='0' scrolling='no' width='100%' height='1500' src='home.html' 
onload="autoHeigt(this.height,'contentFrame')"/>

originalHeight:iframe原始高度
iframeId:iframe的ID名
注意：所有iframe页面的原始页面的高度要一致，否则会出错
**/
function autoHeigt(originalHeight,iframeId){    
    var sh= $(document.getElementById(iframeId).contentWindow.document.body).height(); //获取右边的高度
     // alert(originalHeight);  
     // alert(sh);
    if(originalHeight < sh){
      $("#"+iframeId).height(sh+100);
    }else{
      $("#"+iframeId).height(originalHeight);
    }
};

/**节点的一些操作**/
/**
 * [获取节点下标]
 * @param  {[type]} className [类名]
 * @return {[type]}           [返回节点下标]
 */
function index(className) {
  return $(className).parents(".top_line").index();
};
/**
 * @param  {[type]} $div      [要交换的选择器]
 * @param  {[type]} index_old [之前的下标]
 * @param  {[type]} html_old  [之前的html]
 * @param  {[type]} index_new [新的下标]
 * @param  {[type]} html_new  [新的html]
 */
function swap_html($div,index_old, html_old, index_new, html_new) {
  $div.eq(index_new).html(html_old);
  $div.eq(index_old).html(html_new);
};

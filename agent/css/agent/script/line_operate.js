/**
 * [创建的步骤]
 */
$("document").ready(function(){   
    //选择项目
    $("#choose_business").click(function(){
     window.location.href="line_create_steptwo.html";
     window.event.returnValue=false;
    })
    //填写账号信息)
    $("#choose_tag").click(function(){
     window.location.href="line_create_stepthree.html";
     window.event.returnValue=false;
    })
})
$(function(){
    //点击插入
    var initial_text;  //原始文本内容  "第一天上午"
    $(".date_all a span").hover(function(e){
        initial_text = $(this).text();
        $(this).text("点击插入");  
    },function(e){
        $(this).html(initial_text);
    })
    $(".date_all a").click(function(e){

    })
 })

$(".btn_group a").click(function(){
    return false;
})
//待添加节点的删除
$(".message .delete").click(function(e){
  var $index = $(this).parents(".spot").index(),
      $search_div = $(this).parents(".spot_div").find(".spot").eq($index),
      $num = $(".left .spot").size();
    if($num == 1){
      alert("不能再删了!");
    }else if($num >1){
      $search_div.remove();
    }     
  return false;
});
//添加按钮
var dayJson = [
    {"day":"第一天上午"},
    {"day":"第一天下午"},
    {"day":"第二天上午"},
    {"day":"第二天下午"},
    {"day":"第三天上午"},
    {"day":"第三天下午"},
    {"day":"第四天上午"},
    {"day":"第四天下午"}
];
$("body").on("click","#add",function(){   
    var $spot=$(".left .spot"),
        module = $spot.eq(0).clone(true),
        num = $spot.size(),
        text = $spot.find(".date_all a span").eq(num-1).text(),
        new_text;
    for(var p in dayJson){//遍历json数组时，p为索引
       if($.trim(text) == dayJson[p].day){
        new_text = dayJson[parseInt(p)+1].day;
        module.find(".date_all span").text(new_text);
       }
    }
    if(num >= 6){
        alert("太多了，不能再加了！");
    }else{
        $(".box.left .spot_div").append(module);
    }
    return false;
})
//文本插入 “第一天上午”
$(".date_all a").click(function(e){
    var top = $(this).position().top+70;
    $(".box_div.right .triangle").css("top",top);
    return false;

})
 //选择
$(".btn_group .choose").click(function(e){
    popupDiv($("#line_operate #spot_detail_pack").html());
}) 

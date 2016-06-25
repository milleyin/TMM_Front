var httpService = require('../services/httpService'),
    joinActModule = require('../order/joinAct'),
    appFunc = require('../utils/appFunc'),
    selectPepoleTpl = require('./applySeekfunTpl/select-people.tpl.html'),
    addPepoleTpl = require('./applySeekfunTpl/add-people.tpl.html'),
    checkPhoneTpl = require('./applySeekfunTpl/check-phone.tpl.html'),
    applySuccessTpl = require('./applySeekfunTpl/apply-success.tpl.html');

/////////////////////////////////////////////第一步
var adultNum = 0;
var childNum = 0;
var activeId = ""; //觅趣id
var actIsOpen = ""; //觅趣的公开性 公开的觅趣 用ID或者觅趣消费码 都可以报名 没有公开的觅趣 只能用觅趣消费码报名 ID 无效(暂时用id)
var retinueInfo = {
    mainRetinueInfo: [],
    adultRetinueInfo: [],
    childRetinueInfo: []
};


function main() {
    adultNum = 0;
    childNum = 0;

    tmmApp.getCurrentView().router.load({
        content: selectPepoleTpl
    });
    activeId = $$(this).attr("data-actId");
    actIsOpen = $$(this).attr("data-actOpen");
    bindEvent()
    
}

function bindEvent() {
    removeEvent();
    $$(document).on('click', '.payment-select-pepole .payment-next-step-select-pepole', step1);
    $$('.payment-select-pepole').on('click', '.adult .fare-item', modifyAdult);
    $$('.payment-select-pepole').on('click', '.child .fare-item', modifyChild);
    $$(document).on('click', '.payment-add-pepole .payment-next-step-add-pepole', step2);
    $$(document).on('click', '.payment-check-phone .payment-next-step-check-phone', step3);
    $$(document).on('click', '.payment-check-phone .send-coder', sendCode);
    $$(document).on('click', '.payment-apply-success .payment-next-step-apply-success', goActListPage);

}

function removeEvent() {
    $$(document).off('click', '.payment-select-pepole .payment-next-step-select-pepole', step1);
    $$('.payment-select-pepole').off('click', '.adult .fare-item', modifyAdult);
    $$('.payment-select-pepole').off('click', '.child .fare-item', modifyChild);
    $$(document).off('click', '.payment-add-pepole .payment-next-step-add-pepole', step2);
    $$(document).off('click', '.payment-check-phone .payment-next-step-check-phone', step3);
    $$(document).off('click', '.payment-check-phone .send-coder', sendCode);
    $$(document).off('click', '.payment-apply-success .payment-next-step-apply-success', goActListPage);
}

function modifyAdult(e) {

    var tmp = adultNum;
    if ($$(e.target).hasClass('add-num')) {
        adultNum++;
    } else if ($$(e.target).hasClass('sub-num')) {
        adultNum--;
    } else {
        return;
    }
    if (!checkPeople()) {
        adultNum = tmp;
        return;
    }

    $$(this).find('.num').html(adultNum);
}

function modifyChild(e) {
    var tmp = childNum;
    if ($$(e.target).hasClass('add-num')) {
        childNum++;
    } else if ($$(e.target).hasClass('sub-num')) {
        childNum--;
    } else {
        return;
    }
    if (!checkPeople()) {
        childNum = tmp;
        return;
    }
    $$(this).find('.num').html(childNum);
}

function checkPeople() {
    if (childNum < 0 || adultNum < 0) return;
    if (childNum > adultNum * 2) {
        tmmApp.alert('一个成人最多只能带两个儿童');
        return false;
    }
    return true;
}

function step1() {
    if (adultNum === 0) {
        tmmApp.alert('请选择出游人数');
        return false;
    }
    retinueInfo.adultRetinueInfo.length = retinueInfo.childRetinueInfo.length = retinueInfo.mainRetinueInfo.length = 0;
    retinueInfo.adultRetinueInfo.length = adultNum - 1;
    retinueInfo.childRetinueInfo.length = childNum;
    for (var i = 0; i < retinueInfo.adultRetinueInfo.length; i++) {
        retinueInfo.adultRetinueInfo[i] = {};
        retinueInfo.adultRetinueInfo[i].index = i + 1;
    }
    for (var j = 0; j < retinueInfo.childRetinueInfo.length; j++) {
        retinueInfo.childRetinueInfo[j] = {};
        retinueInfo.childRetinueInfo[j].index = i + j + 1;
    }

    var output = appFunc.renderTpl(addPepoleTpl, retinueInfo)
    tmmApp.getCurrentView().router.load({
        content: output
    });
}
/////////////////////////////////////////////第二步

function checkFormPeople() {
    var aInput = $$('.payment-add-pepole').find('input'),
        type = '',
        value = '';

    aInput.removeClass('warn');

    for (var i = 0; i < aInput.length; i++) {
        type = $$(aInput[i]).attr('type');
        value = $$(aInput[i]).val();
        if (value === '') {
            $$(aInput[i]).addClass('warn');
            appFunc.autoToast('请填写完整信息');
            return false;
        } else {
            if (type === 'tel' && !appFunc.isPhone(value)) {
                $$(aInput[i]).addClass('warn');
                appFunc.autoToast('输入正确的手机号码');
                return false;
            } else if (type === 'text' && value.length > 10) {
                $$(aInput[i]).addClass('warn');
                appFunc.autoToast('姓名必须小于10个字符');
                return false;
            }
        }
    }
    retinueInfo.adultRetinueInfo.length = retinueInfo.childRetinueInfo.length = retinueInfo.mainRetinueInfo.length = 0;
    $$('.payment-add-pepole').find('.main-wrap').each(function() {
        retinueInfo.mainRetinueInfo.push(addRetinueToData.call(this));
    })
    $$('.payment-add-pepole').find('.adult-wrap').each(function() {
        retinueInfo.adultRetinueInfo.push(addRetinueToData.call(this));
    })
    $$('.payment-add-pepole').find('.child-wrap').each(function() {
        retinueInfo.childRetinueInfo.push(addRetinueToData.call(this));
    })
    return true;

}

function addRetinueToData() {
    var retinue = {};
    retinue.name = $$(this).find('input.name').val();
    retinue.is_people = 0;
    if ($$(this).find('input.phone').length !== 0) {
        retinue.phone = $$(this).find('input.phone').val();
        retinue.is_people = 1;
    }

    return retinue;
}

var timer = null;

function step2() {
    if (!checkFormPeople()) return;
    var phone = retinueInfo.mainRetinueInfo[0].phone;
    phone = phone.substr(0, 3) + '****' + phone.substr(7);

    tmmApp.getCurrentView().router.load({
        content: checkPhoneTpl
    });

    $$('.payment-check-phone .phone-num').html(phone);
    clearInterval(timer);

}
/////////////////////////////////////////////第三步


function sendCode() {
    var self = $$(this);
    var i = 60;
    if (self.hasClass('gray')) {
        return;
    }
    self.addClass('gray');
    self.html('获取验证码(' + i + ')')
    var timer = setInterval(function() {
        i--;
        $$(self).html('获取验证码(' + i + ')');
        if (i == 1) {
            self.removeClass('gray');
            self.html('获取验证码');
            
            clearInterval(timer);
        }

    }, 1000);
    // 请求觅趣报名获取短信验证码
    var url = "/index.php?r=api/attend/captcha_sms&id=";
    var data = {
        "phone": retinueInfo.mainRetinueInfo[0].phone
    }
    httpService.editActInfo(
        url,
        data,
        activeId,
        function(dataRes, statusCode) {
            
            if (dataRes.status == 1) {
               

            } else {
                if (dataRes.form) {
                    for (var msgName in dataRes.form) {
                        tmmApp.alert(dataRes.form[msgName][0]);            
                        break;
                    }
                } else {
                    tmmApp.alert('网络超时，请重试');
                }
            }
        },
        function(dataRes, statusCode) {
            
            tmmApp.alert('网络超时，请重试');
        }
    );

}



function step3() {
    if ($$('.payment-check-phone .phone-coder').val() === '') {
        tmmApp.alert('请填写验证码');
        return;
    }

    disposalData($$('.payment-check-phone .phone-coder').val());


}


function disposalData(sms) {
    var i = 0,
        tmp = [],
        token = {
            "Attend": [{
                "sms": sms, //短信验证码 
                "name": retinueInfo.mainRetinueInfo[0].name, //报名人姓名
                "phone": retinueInfo.mainRetinueInfo[0].phone, //报名手机号 获取短信的手机号
                "people": retinueInfo.adultRetinueInfo.length + 1, //成人数量 包含自己 （报名人员默认成人）
                "children": retinueInfo.childRetinueInfo.length //儿童 数量
            }]
        };

    for (i = 0; i < retinueInfo.adultRetinueInfo.length; i++) {
        tmp.push(retinueInfo.adultRetinueInfo[i])

    }

    for (i = 0; i < retinueInfo.childRetinueInfo.length; i++) {
        tmp.push(retinueInfo.childRetinueInfo[i])
    }

    token.Attend = token.Attend.concat(tmp);

    sendPaymentForA(token);

}

function sendPaymentForA(postData) {

    httpService.sendPaymentForA(postData, activeId, function(data) {
        
        if (data.status === 1) {

            tmmApp.getCurrentView().router.load({
                content: applySuccessTpl
            });
 
        } else {
            if (data.form) {
                for (var msgName in data.form) {
                    for (var attr in data.form[msgName]) {
                        tmmApp.alert(data.form[msgName][attr][0]);
                        break;
                    } 
                    break;
                }
            } else {
                tmmApp.alert('网络超时，请重试');
            }
        }
    }, function(data) {
         tmmApp.alert('网络超时，请重试');
    });
}

function goActListPage() {
    removeEvent()
    if (tmmApp.getCurrentView().selector === '#seekView') {
        tmmApp.getCurrentView().router.back({
            force: true,
            pageName: 'seek',
            animatePages: false

        });

        tmmApp.showTab('#myView');
    }
    if (tmmApp.getCurrentView().selector === '#recommendView') {
        tmmApp.getCurrentView().router.back({
            force: true,
            pageName: 'recommendView',
            animatePages: false

        });

        tmmApp.showTab('#myView');
    }
    if (tmmApp.getCurrentView().selector === '#myView') {
        tmmApp.getCurrentView().router.back({
            force: true,
            pageName: 'myView',
            animatePages: false

        });
    }

    joinActModule.loadJoinActList();
}

module.exports = main;

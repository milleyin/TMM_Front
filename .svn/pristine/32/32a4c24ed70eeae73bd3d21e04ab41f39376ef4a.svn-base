var httpService = require('../services/httpService'),
    appFunc = require('../utils/appFunc'),
    log = require('../utils/log'),
    shopModule = require('../shop/shop'),
    template = require('./index.tpl.html'),
    seekSearchModule = require('../search/seekSearch'),
    ViewController = require('../app/ViewController'),
    Slider = require("../utils/slider"),
    iScroll = require("../utils/iScroll");

function IndexViewController(opts) {
    // banner
    this.bannerHeight = window.innerWidth * 1.13;
    this.banner = $$('.index-page .banner');
    this.bannerIndex = 0;
    this.swiper = null;
    this.horiboxScroll = {};
    // this.scorllTimer = null;
    // this.ptrContent = $$('.index-page.pull-to-refresh-content');
    this.link = {
        banner: httpService.apiUrl + '/index.php?r=api/ad/index', // banner
        hotact: httpService.apiUrl + '/index.php?r=api/shops/hot', // 热门活动
        hotsell: httpService.apiUrl + '/index.php?r=api/ad/index&type=1', // 当季热销
        choiceness: httpService.apiUrl + '/index.php?r=api/shops/selected', // 小觅精选
        circumtour: httpService.apiUrl + '/index.php?r=api/shops/nearby' // 热门景区
    }
    ViewController.call(this, opts);
}

IndexViewController.prototype = appFunc.extend({}, ViewController.prototype, {

    getData: function() {
        var count = 0;
        var self = this;

        function counter(type, data) {
            count++;
            data.list_data.length = data.list_data.length > 5 ? 5 : data.list_data.length;
            self.model[type] = data.list_data;
            if (type == 'banner') {
                self.setBannerImage();
            } else {
                self.setGroupImage(type, data.list_data);
            }
            if (count == 5) {
                tmmApp.pullToRefreshDone();
            }
        }

        httpService.get(self.link.banner, function(data) {
            counter('banner', data.data)
        }, function() {
            tmmApp.pullToRefreshDone();
        });
        httpService.get(self.link.hotact, function(data) {
            counter('hotact', data.data)
        }, function() {
            tmmApp.pullToRefreshDone();
        });
        httpService.get(self.link.hotsell, function(data) {
            counter('hotsell', data.data)
        }, function() {
            tmmApp.pullToRefreshDone();
        });
        httpService.get(self.link.choiceness, function(data) {
            counter('choiceness', data.data)
        }, function() {
            tmmApp.pullToRefreshDone();
        });
        httpService.get(self.link.circumtour, function(data) {

            counter('circumtour', data.data)
        }, function() {
            tmmApp.pullToRefreshDone();
        });


    },
    setBannerImage: function() {
        var html = '';
        for (var i = 0; i < this.model.banner.length; i++) {
            var tmp = this.model.banner[i];
            html += '<img class="swiper-slide img-link" data-title="' + tmp.name + '" src="' + tmp.img + '" data-link="' + tmp.link + '" data-type="' + tmp.link_type.value + '">';
        }
        this.banner.find('.swiper-wrapper').html(html);
        if (this.swiper !== null) return;
        this.banner.css({ height: this.bannerHeight + 'px' });
        this.swiper = new Swiper(this.banner[0], {
            speed: 400,
            pagination: '.swiper-pagination',
            autoplay: 3000,
            autoplayDisableOnInteraction: false
        })
    },
    setGroupImage: function(type, data) {
        var self = this;
        var html = '';
        var len = data.length;
        var width = window.innerWidth - 14 - 18 + 8;
        if (len == 0) return;
        for (var i = 0; i < len; i++) {
            var tmp = data[i];
            var name = tmp.name;
            var link = tmp.link;
            var subhtml = '',
                img, shopType;
            if (type == 'hotsell') {
                img = tmp.img;
                shopType = tmp.link_type.value;
            } else if (type == 'hotact') {
                img = tmp.image;
                shopType = tmp.classliy.value;
                var goActTime = tmp.actives.actives_time.value === 0 ? tmp.actives.actives_time.go_time : '出游日期 ' + tmp.actives.actives_time.go_time;
                subhtml = '<div class="txt">' + goActTime + '　报名人数 ' + (tmp.actives.number.value - tmp.actives.order_number.value) + '/' + tmp.actives.number.value + '</div>';
            } else if (type == 'choiceness') {
                img = tmp.image;
                shopType = tmp.classliy.value;
                subhtml = '<div class="txt">' + tmp.selected_info + '</div>'
            } else if (type == 'circumtour') {
                img = tmp.image;
                shopType = tmp.classliy.value;
                subhtml = '<div class="txt distance"><div>' + tmp.info + '</div><div>距离' + tmp.distance + '</div></div>'
            }

            html += '<div class="horibox sliderItem">' +
                '<img class="img-link" data-title="' + name + '" src="' + img + '" data-type="' + shopType + '" data-link="' + link + '">' +
                '<div class="intro">' +
                '<div class="tit">' + name + '</div>' + subhtml + '</div>' + '</div>';
        }

        var horibox = $$('.index-page .index-wrap').find('.' + type)

        horibox.css({ display: 'block' }).find('.contentView').html(html);
        horibox.find('.img-link').css({
            width: (width - 8) + 'px',
            height: (width - 8) * 2 / 3 + 'px'
        })
        horibox.find('.contentView').css({ width: ((width) * len + 14) + 'px' });
        horibox.find('.sliderItem').css({ width: (width - 8) + 'px' });

        if (self.horiboxScroll[type]) {
            self.horiboxScroll[type].destroy();
            self.horiboxScroll[type].null;
        }
        self.horiboxScroll[type] = new iScroll(horibox.find('.scrollView')[0], {
            eventPassthrough: 'vertical',
            scrollX: true
        });

        self.horiboxScroll[type].on('scrollEnd', function() {
            if (self.horiboxScroll[type].initiated === 1) return;
            var d = Math.round(self.horiboxScroll[type].x / width) * width
            self.horiboxScroll[type].scrollTo(d, 0, 4500, self.horiboxScroll[type].utils.ease.quadratic)
        })
    },
    refresh: function() {

        indexCtrl.getData();


    },
    reScroll: function() {
        var self = this;
        var width = window.innerWidth - 14 - 18 + 8;
        for (var type in self.horiboxScroll) {
            var horibox = $$('.index-page .index-wrap').find('.' + type);
            if (self.horiboxScroll[type]) {
                self.horiboxScroll[type].destroy();
                self.horiboxScroll[type].null;
            }
            // console.log(self.horiboxScroll[type])
            self.horiboxScroll[type] = new iScroll(horibox.find('.scrollView')[0], {
                eventPassthrough: 'vertical',
                scrollX: true
            });

            (function(horiboxScroll) {

                horiboxScroll.on('scrollEnd', function() {
                    if (horiboxScroll.initiated === 1) return;
                    var d = Math.round(horiboxScroll.x / width) * width
                    horiboxScroll.scrollTo(d, 0, 4500, horiboxScroll.utils.ease.quadratic)
                })

            })(self.horiboxScroll[type])

            // console.log(self.horiboxScroll[type])
        }
    },
    goPageDetail: function(e) {
        var type = $$(e.target).attr('data-type');
        var link = $$(e.target).attr('data-link');
        var thumb_url = $$(e.target).attr('src');
        var title = $$(e.target).attr('data-title');
        type = parseInt(type);
        if (type > 3 && type < 7) {

            return;
        } else if (type == 7 || type == 8) {
            appFunc.goSeekFreshDetail(link);
            appFunc.goSeekFreshDetail2(title, title, thumb_url, link);
            return;
        } else if (type == 3) {
            $$(e.target).attr('data-acttype', '0');
        }
        shopModule.initDetail.call(e.target);
    },

    setStyle: function() {
        var width = window.innerWidth - 14 - 18;

        $$('.index-page').css({ paddingBottom: '49px', paddingTop: '44px' });

        this.banner.css({ height: this.bannerHeight + 'px' });
        this.banner.find('.sliderwrap').css({ width: (window.innerWidth * 5) + 'px' })
        this.banner.find('.sliderItem').css({ width: window.innerWidth + 'px' })
        $$('.index-page .contentView .horibox img').css({
            width: width + 'px',
            height: (width * 2 / 3) + 'px'
        });
        $$('.index-page .contentView .horibox').css({
            width: width + 'px',
        });
        $$('.index-page .contentView').each(function(index, ele) {
            var len = $$(ele).find('.horibox').length;
            ele.style.width = ((width + 8) * len + 14) + 'px';
        })


    }
});
var indexCtrl = null;
var recommend = {
    init: function() {
        indexCtrl = new IndexViewController({
            tpl: template,
            link: httpService.apiIndexPage
        });
        recommend.bindEvents();
    },
    loadRecommendView: function() {
        appFunc.exitSeekFresh();
        indexCtrl.reScroll();
    },
    refresh: function() {
        indexCtrl.reScroll();
    },
    bindEvents: function() {
        var bindings = [{
            element: '#recommendView',
            selector: '.tmm-recommend-detail',
            event: 'click',
            handler: shopModule.initDetail
        }, {
            element: '#recommendView',
            event: 'show',
            handler: recommend.loadRecommendView
        }, {
            element: '#recommendView',
            selector: '.index-page.pull-to-refresh-content',
            event: 'refresh',
            handler: indexCtrl.refresh
        }, {
            element: '#recommendView',
            selector: '.index-page .img-link',
            event: 'click',
            handler: indexCtrl.goPageDetail
        }, {
            element: '#recommendView',
            selector: '#tmm-seek-search .ticon-search',
            event: 'click',
            handler: seekSearchModule.init
        }];

        appFunc.bindEvents(bindings);
    }
}

module.exports = recommend;

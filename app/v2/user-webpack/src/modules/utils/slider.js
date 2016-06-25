var _elementStyle = document.createElement('div').style;
var transform = prefixStyle('transform');
var transition = prefixStyle('transition');

function prefixStyle(style) {
    var prefixs = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
        transform,
        i = 0,
        l = prefixs.length;
    for (; i < l; i++) {
        transform = prefixs[i] + 'ransform';
        if (transform in _elementStyle) break;
    }
    if (i === 0) return style;
    return prefixs[i] + style.substr(1);
}

function extend() {
    var prop, i,
        len = arguments.length;

    for (i = 0; i < len - 1; i++) {
        for (prop in arguments[i + 1]) {
            arguments[0][prop] = arguments[i + 1][prop];
        }
    }
    return arguments[0];
}

function Slider(ele, opts) {
    this.log = document.createElement('div');
    
    this.wrap = ele;
    this.silderWrap = this.wrap.querySelector('.sliderwrap');
    this.silderItem = this.wrap.querySelectorAll('.sliderItem');

    this.len = this.silderItem.length;
    this.index = 0;
    this.pagination = document.createElement('ul');
    this.paginations = [];
    this.timer = null;
    this.opts = {
        w: window.innerWidth,
        t: '0.25',
        hoverColor: '#007aff',
        ispagination: true
    }
    extend(this.opts, opts);
    this.init();
}

Slider.prototype = {
    constructor: Slider,
    init: function() {
        this.render();

        this.bind();

        this.autoSlider();
    },
    render: function() {

        if (this.opts.ispagination) {
            this.pagination.style.cssText = "width:100%; position:absolute; bottom:5px; text-align:center;";

            for (var i = 0; i < this.len; i++) {
                var o = document.createElement('li');
                o.style.cssText = "display:inline-block; width:5px; height:5px; margin:0 8px; border-radius:50%; background-color:#fff;";
                this.paginations.push(o);
                this.pagination.appendChild(o);
            }
            this.wrap.appendChild(this.pagination);
            this.paginations[0].style.backgroundColor = this.opts.hoverColor;
        }

    },
    bind: function() {
        var self = this;
        var startTime,
            startX,
            startY,
            offsetX;

        var startHandler = function(ev) {
            clearInterval(self.timer);
            self.timer = null;
            startTime = new Date() * 1;
            startX = ev.touches[0].pageX;
            startY = ev.touches[0].pageY;
            offsetX = 0;
        }

        var moveHandler = function(ev) {
            // ev.preventDefault();
            offsetY = ev.targetTouches[0].pageY - startY;
            offsetX = ev.targetTouches[0].pageX - startX;

            if (Math.abs(offsetX) < Math.abs(offsetY)){
                // ev.preventDefault();
                return;
            } 
          
            // if (offsetX > self.opts.w /6 && self.index == 0) {
            //     offsetX = self.opts.w /6;
            // } else if (offsetX < -self.opts.w /6 && self.index == self.len-1) {
            //     offsetX = -self.opts.w /6;
            // }

            self.silderWrap.style[transition] = 'all 0s ease-out';
            self.silderWrap.style[transform] = 'translate3d(' + -(self.index * self.opts.w - offsetX) + 'px, 0, 0)';

        }

        var endHandler = function(ev) {
            // ev.preventDefault();

            var boundary = self.opts.w / 4;
            var endTime = new Date() * 1;

            if (endTime - startTime > 300) {
                if (offsetX >= boundary) {
                    self.goIndex(-1);
                } else if (offsetX <= -boundary) {
                    self.goIndex(1);
                } else {
                    self.goIndex(0);
                }
            } else {
                if (offsetX > 50) {
                    self.goIndex(-1);
                } else if (offsetX < -50) {
                    self.goIndex(1);
                } else {
                    self.goIndex(0);
                }
            }
            self.autoSlider();
        }

        this.wrap.addEventListener('touchstart', startHandler);
        this.wrap.addEventListener('touchmove', moveHandler);
        this.wrap.addEventListener('touchend', endHandler);
    },
    autoSlider: function() {
        var self = this;
        this.timer = setInterval(function() {
            if (self.index == self.len - 1) {
                self.index = -1;
            }
            self.goIndex(1);
        }, 3000)
    },
    goIndex: function(n) {
        var oldIndex = this.index;
        var len = this.len;
        var elms = this.silderItem;
        var w = this.opts.w;
        this.index = this.index + n;


        if (this.index > len - 1) {
            this.index = len - 1;
        } else if (this.index < 0) {
            this.index = 0;
        }
        // alert(transform + ' '+ this.opts.t +'s ease-out')
        this.silderWrap.style[transition] = 'all '+ this.opts.t +'s ease-out';
        this.silderWrap.style[transform] = 'translate3d(' + -w * this.index + 'px, 0, 0)';

        if (this.opts.ispagination) {
            for (var i = 0; i < len; i++) {
                this.paginations[i].style.backgroundColor = "#fff";
            }
            this.paginations[this.index].style.backgroundColor = this.opts.hoverColor;
            
        }
    }
}

module.exports = Slider;

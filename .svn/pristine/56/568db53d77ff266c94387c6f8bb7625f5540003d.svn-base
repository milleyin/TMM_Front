var appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService');

function extend(newObj, oldObj) {
  for (var attr in oldObj) {
    newObj[attr] = oldObj[attr];
  }
  return newObj;
}

function ViewController(opts) {
  this.model = {};
  this.opts = {};
  this.opts = opts === undefined ? {} : extend(this.opts, opts);

  this.init();
  this.getData();
}

ViewController.prototype = {
  constructor: ViewController,
  init: function(opts) {
    this.opts = opts === undefined ? this.opts : extend(this.opts, opts);
  },
  bind: function(selector,type, fn) {
    var aDOM = document.querySelectorAll(selector);
    for (var i=0,len=aDOM.length; i<len; i++) {
      aDOM[i].addEventListener(type, fn, false);
    }
  },
  getData: function(sfn, efn) {
    var self = this;
    if (self.opts.link) {
      httpService.get(self.opts.link, function(data) {

        if (data.status === 1) {
          self.model = data.data;
          self.renderPage();
          sfn && sfn(data);
        } else {
          efn && efn(data)
        }
      }, function(data){
        efn && efn(data)
      });
    } else {
      self.renderPage()
    }
  },
  renderPage: function() {
    this.pageWillDisplay();
    var output = appFunc.renderTpl(this.opts.tpl, this.model);
    tmmApp.getCurrentView().router.load({
      content: output
    })
    this.pageEndDisplay();
  },
  pageWillDisplay: function() {
    
  },
  pageEndDisplay: function() {

  },
  destroy: function(){
    
  }
}


module.exports = ViewController
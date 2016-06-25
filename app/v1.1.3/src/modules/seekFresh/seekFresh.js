var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc');

var seekFresh = {
  init: function(){
    seekFresh.bindEvent();
    
  },

  goSeekFresh: function() {
    appFunc.goSeekFresh();
  },
  bindEvent: function() {
     var bindings = [{
      element: '#seekFreshView',
      event: 'show',
      handler: seekFresh.goSeekFresh
    }];

    appFunc.bindEvents(bindings);
  }
}

module.exports = seekFresh;
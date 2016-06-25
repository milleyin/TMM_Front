var log = require('../utils/log'),
  httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  my_act_tpl = require('./my-create-act.tpl.html'),
  my_act_tpl_list = require('./my-create-act-list.tpl.html');



var activityView = {

  refreshActivityList: function(dataRes) {
    var renderData = {
      'actList': dataRes.list_data
    };

    var output = appFunc.renderTpl(my_act_tpl_list, renderData);

    $$('#tmm-my-activity-page').find('.tmm-activity-card-list').html(output);
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);

  },

  infiniteActivityList: function(dataRes) {
    var renderData = {
      'actList': dataRes.list_data
    };

    var output = appFunc.renderTpl(my_act_tpl_list, renderData);

    $$('#tmm-my-activity-page').find('.tmm-activity-card-list').append(output);
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
}

module.exports = activityView;

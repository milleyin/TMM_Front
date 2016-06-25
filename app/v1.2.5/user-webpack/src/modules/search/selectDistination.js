var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  selectTpl = require('./select-distination.tpl.html');
selectSearchTpl = require('./select-search-distination.tpl.html');
/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoading = false;

var type = '';
var typeValue = '';

// 本页数据
var data = {};
// 过滤数据
var dataFilter = {};


var selectDistination = {
  init: function() {
    appFunc.hideToolbar();
    selectDistination.getSeekSearchList();
    selectDistination.bindEvent();
  },

  getSeekSearchList: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();

    httpService.getAreaList(function(dataRes) {

      if (dataRes.status == 1) {
        data = dataRes.data;
        data.loactionCity = window.device.location.city;

        var output = appFunc.renderTpl(selectTpl, data);
        tmmApp.getCurrentView().router.load({
          content: output
        });
        tmmApp.hideIndicator();

      }

    }, function(dataRes) {

    })

  },

  showSearchBar: function() {

    dataFilter = data.list_data;;
    
    var output = appFunc.renderTpl(selectSearchTpl, dataFilter);

    tmmApp.getCurrentView().router.load({
      content: output,
      reload: true
    });
    tmmApp.hideIndicator();
  },

  showCityList: function() {

    var output = appFunc.renderTpl(selectTpl, data);
    tmmApp.getCurrentView().router.load({
      content: output,
      reload: true
    });
    tmmApp.hideIndicator();
  },

  selectCity: function() {
    var url = $$(this).attr('data-link');
    httpService.setSelectCity(
      url,
      function(dataRes) {
        
        tmmApp.getCurrentView().router.back();
      },
      function(dataRes) {
        // body...
      })

  },
  filterCity: function() {

    // console.log(this.value)
    var inputValue = this.value;
    var filter = [];
    var _html = '';
    var re = new RegExp("^" + inputValue, "i");
    var arrayData = selectDistination.json2Array(dataFilter);

    if (inputValue == '') {
      for (attr in dataFilter) {
        _html += '<div class="city-list-tit">' + attr + '</div><div class="city-list-con">'
        for (var i = 0; i < dataFilter[attr].length; i++) {
          _html += '<p class="select-city-confirm" data-id="' + dataFilter[attr][i]['value'] + '" data-link="' + dataFilter[attr][i]['link'] + '">' + dataFilter[attr][i]['name'] + '</p>';
        };
        _html += '</div>';
      }
    } else {
      filter = arrayData.filter(function(value) {
        return re.test(value.spell) || value.name.match(inputValue);
      })

      _html += '<div class="city-list-con">'
      for (var i = 0; i < filter.length; i++) {
        _html += '<p class="select-city-confirm" data-id="' + filter[i]['value'] + '" data-link="' + filter[i]['link'] + '">' + filter[i]['name'] + '</p>';
      }
      if (filter.length <= 0) {
        _html += '没有相关城市'
      }
      _html += '</div>';
    }

    log.info('filterCity...', _html);

    $$('.city-list').html(_html);
  },
  json2Array: function(json) {
    var arr = [];
    var i = 0;

    for (var attr in json) {
      arr = arr.concat(json[attr]);
    }

    return arr;
  },
  // 设置gps定位城市
  setLocationCity: function() {

    appFunc.getDeviceLocation(function(dataLoation) {
      httpService.setGPSCity({
         "location": {
          "lng": dataLoation.lng,
          "lat": dataLoation.lat
        }
      }, function(dataRes) {
        
        tmmApp.getCurrentView().router.back();
      }, function(dataRes) {
       
      });


    },function() {
      tmmApp.alert('获取位置信息失败');
    })
    
    

  },
  bindEvent: function() {

    var bindings = [{
      element: '#seekView',
      selector: '.tmm-show-select-city',
      event: 'click',
      handler: selectDistination.showSearchBar
    }, {
      element: '#seekView',
      selector: '.tmm-select-distination-cancel',
      event: 'click',
      handler: selectDistination.showCityList
    }, {
      element: '#seekView',
      selector: '.select-city-confirm',
      event: 'click',
      handler: selectDistination.selectCity
    }, {
      element: '#seekView',
      selector: '.tmm-seek-distination-input',
      event: 'input',
      handler: selectDistination.filterCity
    }, {
      element: '#seekView',
      selector: '.tmm-get-location-to-set-location',
      event: 'click',
      handler: selectDistination.setLocationCity
    }];
    appFunc.bindEvents(bindings);
  }
};

module.exports = selectDistination;

var appFunc = require('../utils/appFunc'),
  recommendModule = require('../recommend/recommend'),
  seekModule = require('../seek/seek'),
  myModule = require('../my/my'),
  seekFreshModule = require('../seekFresh/seekFresh'),
  roleModule = require('../role/role');

module.exports = {
  init: function() {
    recommendModule.init();
    seekModule.init();
    myModule.init();
    roleModule.init();
    seekFreshModule.init();
  }
};

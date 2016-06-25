var httpService = require('../services/httpService'),
  ViewController = require('../app/ViewController'),
  appFunc = require('../utils/appFunc'),
  participantTpl = require('./participant.tpl.html');


function ParticipantCtrl(opts) {
  ViewController.call(this, opts);
  this.loading = false;
}

ParticipantCtrl.prototype = appFunc.extend({}, ViewController.prototype, {
  constructor: ParticipantCtrl,
  pageWillDisplay: function() {

    this.model.list = [];
    for (var i = 0; i < 10; i++) this.model.list.push(i);
  },
  pageEndDisplay: function() {
    this.bind('.participant .infinite-scroll', 'infinite', this);
  },
  loadMore: function() {
    var self = this;

    if (self.model.page.next) {
      if (self.loading) return;
      self.loading = true;
      httpService.get(self.model.page.next, function(data) {
        if (data.status == 1) {
          self.model = data.data;
          self.appendItem();
        }
        self.loading = false;
      }, function(data) {
        self.loading = false;
      });
    }
  },
  appendItem: function() {
    var html = '{{#each list_data}}' +
      '<div class="participant-list">' +
      '<div class="add-time">{{add_time}}</div>' +
      '<div class="name">{{name}}　{{phone}}</div>' +
      '<div class="join-people">参与人数：{{people}}成人，{{children}}儿童</div>' +
      '</div>' +
      '{{/each}}';

    var output = appFunc.renderTpl(html, this.model);
    $$('.participant .participant-list').append(output);


  },

  handleEvent: function(ev) {
    if (ev.type == 'infinite') {
      this.loadMore()
    }
  }

})

function main(link) {

  new ParticipantCtrl({
    link: link,
    tpl: participantTpl
  });

}

module.exports = main;

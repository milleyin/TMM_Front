/**
 * @name log
 * @description 日志处理相关函数
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T01:11:37+0800
 */


var config = {
  // 开启调试模式
  debug: true
};

var log = {
  startTime: new Date().getTime(),
  /**
   * @method info
   * @description 正常信息（包括成功信息）打印函数，暂定可以传5个参数
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T01:12:15+0800
   */
  info: function(msg, data1, data2, data3, data4, data5) {
    if (config.debug) {
      var now = new Date();
      var diff = now.getTime() - log.startTime;

      msg = msg || 'info';
      data1 = data1 || '';
      data2 = data2 || '';
      data3 = data3 || '';
      data4 = data4 || '';
      data5 = data5 || '';
      console.log('(MS ' + diff + ') ' + msg, data1, data2, data3, data4, data5);
    }
  },
  /**
   * @method error
   * @description 错误信息打印函数，暂定可以传5个参数
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T01:12:15+0800
   */
  error: function(msg, data1, data2, data3, data4, data5) {
    if (config.debug) {
      msg = msg || 'error';
      data1 = data1 || '';
      data2 = data2 || '';
      data3 = data3 || '';
      data4 = data4 || '';
      data5 = data5 || '';
      console.log('ERROR - ' + msg, data1, data2, data3, data4, data5)
    }
  },
};

module.exports = log;

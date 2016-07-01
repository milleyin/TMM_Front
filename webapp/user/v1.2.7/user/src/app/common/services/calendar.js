angular.module('calendar', ['ionic'])

.factory('uiCalendar', [
  '$rootScope',
  '$compile',
  '$timeout',
  '$ionicBody',
  '$animate',
  function($rootScope, $compile, $timeout, $ionicBody, $animate) {
    return {
      show: showCalendar
    }

    function showCalendar(opts) {
      var scope = $rootScope.$new(true),
        noop = angular.noop,
        selectedDate = [],
        defaultDate = {};

      scope.opts = {};

      angular.extend(scope.opts, {
        contrainer: null,
        defaultDate: null,
        selecting: noop,
        selected: noop,
        cancel: noop,
        format: '-',
        maxDate: null,
        minDate: null,
        num: 1
      }, opts || {});

      defaultDate.date = scope.opts.defaultDate;

      scope.opts.minDate = scope.opts.minDate ? new Date(scope.opts.minDate.getFullYear(), scope.opts.minDate.getMonth(), scope.opts.minDate.getDate()) : null;
      scope.opts.maxDate = scope.opts.maxDate ? new Date(scope.opts.maxDate.getFullYear(), scope.opts.maxDate.getMonth(), scope.opts.maxDate.getDate()) : null;

      scope.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      scope.dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

      scope.year = new Date().getFullYear();
      scope.month = new Date().getMonth() + 1;
      scope.canPrev = true;
      scope.canNext = true;
      scope.weeks = getWeeks(scope.year, scope.month);

      if (!scope.opts.contrainer) {
        $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); });

      }

      scope.nextMonth = function(canNext) {
        if (!canNext) return;
        if (scope.month == 12) {
          scope.year = scope.year + 1;
          scope.month = 1;
        } else {
          scope.month = scope.month + 1;
        }
        scope.weeks = getWeeks(scope.year, scope.month);
      };

      scope.prevMonth = function(canPrev) {
        if (!canPrev) return;
        if (scope.month == 1) {
          scope.year = scope.year - 1;
          scope.month = 12;
        } else {
          scope.month = scope.month - 1;
        }
        scope.weeks = getWeeks(scope.year, scope.month);
      };

      function getWeeks(year, month) {
        var oDate = new Date(),
          nowDay = oDate.getDate(),
          nowMonth = oDate.getMonth() + 1,
          nowYear = oDate.getFullYear(),
          dayNum = getMonthNum(year, month),
          prevMonth,
          nextMonth,
          prevYear,
          nextYear,
          i,
          j,
          weeks = [],
          resulte = [];

        prevMonth = (1 == month) ? 12 : month - 1;
        prevYear = (1 == month) ? year - 1 : year;
        nextMonth = (12 == month) ? 1 : month + 1;
        nextYear = (12 == month) ? year + 1 : year;


        oDate.setFullYear(year);
        oDate.setMonth(month - 1);
        oDate.setDate(1);

        var dayDate = null;
        var disabled = false;
        var isSelected = false;
        for (i = oDate.getDay(), j = getMonthNum(prevYear, prevMonth); i > 0; i--) {
          dayDate = new Date(prevYear, prevMonth - 1, j + 1 - i);
          if ((scope.opts.minDate && dayDate.getTime() < scope.opts.minDate) || (scope.opts.maxDate && dayDate.getTime() > scope.opts.maxDate)) {
            disabled = true;
          }
          if (compareDate(defaultDate.date, dayDate)) {
            weeks.push(defaultDate);
          } else {
            weeks.push({
              date: dayDate,
              isOther: true,
              isSelected: false,
              disabled: disabled,
              isToday: (j + 1 - i == nowDay) && (prevMonth == nowMonth) && (prevYear == nowYear)
            });
          }
          disabled = false;
        }
        for (i = 1; i <= dayNum; i++) {
          dayDate = new Date(year, month - 1, i);
          if ((scope.opts.minDate && dayDate.getTime() < scope.opts.minDate) || (scope.opts.maxDate && dayDate.getTime() > scope.opts.maxDate)) {
            disabled = true;
          }
          if (compareDate(defaultDate.date, dayDate)) {
            weeks.push(defaultDate);
          } else {
            weeks.push({
              date: dayDate,
              isOther: false,
              isSelected: false,
              disabled: disabled,
              isToday: (i == nowDay) && (month == nowMonth) && (year == nowYear)
            });
          }
          disabled = false;
        }
        for (i = 1, j = weeks.length; i <= 42 - j; i++) {
          dayDate = new Date(nextYear, nextMonth - 1, i);
          if ((scope.opts.minDate && dayDate.getTime() < scope.opts.minDate) || (scope.opts.maxDate && dayDate.getTime() > scope.opts.maxDate)) {
            disabled = true;
          }
          if (compareDate(defaultDate.date, dayDate)) {
            weeks.push(defaultDate);
          } else {

            weeks.push({
              date: dayDate,
              isOther: true,
              isSelected: false,
              disabled: disabled,
              isToday: (i == nowDay) && (nextMonth == nowMonth) && (nextYear == nowYear)
            });
          }
          disabled = false;
        }

        for (i = 0; i < 6; i++) {
          resulte.push(weeks.splice(0, 7));
        }

        scope.canPrev = true;
        scope.canNext = true;

        if (scope.opts.minDate && (scope.opts.minDate > new Date(prevYear, prevMonth - 1, getMonthNum(prevYear, prevMonth)).getTime())) {
          scope.canPrev = false;
        }
        if (scope.opts.maxDate && (scope.opts.maxDate < new Date(nextYear, nextMonth - 1, 1).getTime())) {
          scope.canNext = false;
        }

        return resulte;
      }

      function compareDate(date1, date2) {
        if ((date1 instanceof Date) && (date2 instanceof Date)) 
          return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate());
        else
          return false;
      }

      function getMonthNum(year, month) {
        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          return 31;
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
          return 30;
        } else if (month == 2 && isLeapYear(year)) {
          return 29;
        } else {
          return 28;
        }
      }

      function isLeapYear(year) {
        if (year % 4 === 0 && year % 100 !== 0) {
          return true;
        } else {
          if (year % 400 === 0) {
            return true;
          } else {
            return false;
          }
        }
      }

      function formatDate(data) {
        var day = data.getDate() + '';
        var month = (data.getMonth() + 1) + '';
        var year = data.getFullYear() + '';

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return year + scope.format + month + scope.format + day;
      }

      function string2Date(str) {

      }

      element = $compile('<ui-calendar></ui-calendar>')(scope);
      var calendar = angular.element(element[0].querySelector('.calendar-wrapper'));
      var calendarDay = angular.element(calendar[0].querySelector('.calendar-day'));
      var flag = true;
      // calendarDay.bind('click', selecteEle);

      scope.selecteDate = function(m, n) {
        if (scope.opts.contrainer !== null) {
          defaultDate.isSelected = false;
          scope.weeks[m][n].isSelected = true;
          defaultDate = scope.weeks[m][n];
          selectedDate[0] = scope.weeks[m][n].date;
          scope.opts.selected(selectedDate);
        } else {
          if (!flag) return;
          scope.weeks[m][n].isSelected = true;
          selectedDate.push(scope.weeks[m][n].date);
          scope.opts.selecting(selectedDate);
          if (selectedDate.length == scope.opts.num) {
            if (scope.opts.num == 2) {
              if (compareDate(selectedDate[0], selectedDate[1])) {
                selectedDate.pop();
                return;
              }
              
            }

            selectedDate.sort(function(date1, date2) {
              return date1.getTime() - date2.getTime();
            });

            scope.opts.selected(selectedDate);

            if (scope.opts.contrainer !== null) {

            } else {
              $timeout(function() {
                scope.removeCalendar();
              }, 350);
            }
            flag = false;
            return;
          }

        }


      };


      scope.showSheet = function(done) {
        $ionicBody.append(element);

        $animate.addClass(element, 'active');
        $timeout(function() {
          calendar.addClass('calendar-up');
        }, 20, false);

      };

      scope.removeCalendar = function(done) {
        if (scope.removed) return;

        scope.removed = true;

        calendar.removeClass('calendar-up');
        $animate.removeClass(element, 'active').then(function() {
          scope.$destroy();
          element.remove();

          (done || noop)(selectedDate);
        });
      };

      scope.cancel = function() {
        scope.opts.cancel();
        scope.removeCalendar();
      };

      if (scope.opts.contrainer === null) {
        scope.showSheet();
      } else {
        element.addClass('static');
        calendar.addClass('calendar-up');
        angular.element(scope.opts.contrainer).append(element);
      }

      clearDate = function() {
        defaultDate = {};
        scope.weeks = getWeeks(scope.year, scope.month);
      };


      return {
        clearDate:clearDate
      }
    }

  }
])

.directive('uiCalendar', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    template: '<div class="calendar-backdrop">' +
      '<div class="calendar-wrapper">' +
      '<div class="calendar-toolbar">' +
      '<i ng-click="prevMonth(canPrev)" ng-class="{true:\'touchstyle\',false:\'disabled\'}[canPrev]" class="icon arrow-left"></i>' +
      '<div class="current-year">{{year}}年</div>' +
      '<div class="current-month">{{months[month-1]}}</div>' +
      '<i ng-click="nextMonth(canNext)" ng-class="{true:\'touchstyle\',false:\'disabled\'}[canNext]" class="icon arrow-right"></i>' +
      '</div>' +
      '<table class="calendar-month">' +
      '<thead>' +
      '<tr class="week">' +
      '<th ng-repeat="day in dayNames">{{day}}</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody class="calendar-day">' +
      '<tr class="week-day" ng-repeat="week in weeks track by $index" ng-init="m=$index">' +
      '<td ng-class="{\'otherMonth\':day.isOther}" ng-repeat="day in week track by $index" ng-init="n=$index"><span ng-click="day.disabled || selecteDate(m,n)" ng-class="{\'disabled\':day.disabled, \'today\':day.isToday, \'selected\':day.isSelected}">{{day.date.getDate()}}</span></td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>',
    link: function(scope, element, attr) {

      var backdropClick = function(e) {
        if (e.target == element[0]) {
          scope.cancel();
          scope.$apply();
        }
      };

      scope.$on('$destroy', function() {
        element.remove();
      });
      element.bind('click', backdropClick);
    }
  };

}]);

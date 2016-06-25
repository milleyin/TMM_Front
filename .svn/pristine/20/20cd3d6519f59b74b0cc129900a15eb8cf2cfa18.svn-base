// 导航栏js
$(function() {
  navSlider();
  showSubnav();

  function navSlider() {
    var width = 130;
    var $nav = $('.navbar');
    var $slider = $('.slider-box');
    var index = $('.navbar .selected').index()

    function main() {
      leaveNav();
      bindEvent();
    }

    function bindEvent() {
      $nav.on('mouseenter', '.list', enterNav);
      $nav.on('mouseleave', leaveNav);
    }

    function enterNav() {
      var index = $(this).index();
      $nav.find('.list').removeClass('selected')
      $(this).addClass('selected')
      $slider.css({
        left: width * index + 20
      })
    }

    function leaveNav() {
      $nav.find('.list').removeClass('selected')
      $nav.find('.list').eq(index).addClass('selected')
      $slider.css({
        left: width * index + 20
      })
    }

    return main();
  }

  function showSubnav() {
    var $nav = $('.navbar');
    var index = -1;
    var timer = null;

    function main() {
      bindEvent();
    }

    function bindEvent() {
      $nav.on('mouseenter', '.list', enterBtn);
      $nav.on('mouseleave', '.list', leaveBtn);
    }

    function enterBtn() {
      var oldIndex = $(this).index();

      if (oldIndex == 0 || oldIndex == 3) {

        index == oldIndex;
      } else {
        clearTimeout(timer);
        timer = null;

        if (index === -1) {
          $(this).find('.subnav').stop(true, true).slideDown();
          index = oldIndex;
        } else {
          if (oldIndex !== index) {
            $('.subnav').stop(true, true).fadeOut();
            $(this).find('.subnav').stop(true, true).fadeIn(function() {
              index = oldIndex;
            });
          }

        }
      }
    }

    function leaveBtn() {
      if (!timer) {
        timer = setTimeout(function() {
          $('.subnav').stop(true, true).slideUp();
          index = -1;

        }, 300)
      }
    }

    return main();
  }

});

// 回到顶部js
$(function() {
  $('.icon-to-top').click(function() {
    $('body,html').animate({
      scrollTop: 0
    });
    return false;
  })

  $(window).scroll(function() {
    console.log($(window).scrollTop())
    if ($(window).scrollTop() > 800) {
      $('.icon-to-top').fadeIn();
    } else {
      $('.icon-to-top').fadeOut();
    }
  });
});

'use strict';

var template = $(require('raw!./layout.html'));

/*
 * Quasar Page
 */

Vue.component('quasar-layout', {
  template: template.find('#quasar-layout').html(),
  ready: function() {
    var
      layout = $(this.$el),
      header = layout.find('.quasar-header'),
      page = layout.find('.quasar-page'),
      footer = layout.find('.quasar-footer'),
      manager = layout.getAttributesManager()
      ;

    if (footer.length > 0 && !manager.hasEmpty('keep-marginals') && manager.hasEmpty('keep-footer')) {
      page.css('padding-bottom', footer.height() + 20 + 'px');
    }

    manager.withEmpty('keep-footer', function() {
      footer.addClass('fixed-bottom');
    });

    manager.withEmpty('scroll-shadow', function() {
      if (!manager.hasEmpty('keep-marginals retract-header shrink-header')) {
        return;
      }

      var target = manager.hasEmpty('keep-marginals') ? page : $(window);

      target.scroll(function() {
        var shouldHaveShadow = target.scrollTop() > 0;

        header[shouldHaveShadow ? 'addClass' : 'removeClass']('shadow');
      });
    });

    manager.withEmpty('keep-marginals', function() {
      layout.addClass('fixed-top layout vertical window-height');
      page.addClass('scroll flex');
    });

    manager.withEmpty('shrink-header', function() {
      header.addClass('fixed-top').css('z-index', 1);
      page.css('padding-top', header.height() + 20 + 'px');

      var headerHeight = header.height();

      $(window).scroll(function() {
        var
          offset = $(window).scrollTop(),
          translate = Math.min(headerHeight, offset)
          ;

        header.css('height', Math.max(64, headerHeight - Math.min(headerHeight, offset)) + 'px');
        header.find('.quasar-row:not(:first-of-type)').css('display', offset > 0 ? 'none' : '');
      });
    });

    manager.withEmpty('retract-header', function() {
      header.addClass('fixed-top').css('z-index', 1);
      page.css('padding-top', header.height() + 20 + 'px');

      var
        lastOffset = 0,
        lastTranslate = 0,
        headerHeight = header.height()
        ;

      $(window).scroll(function() {
        var
          offset = $(window).scrollTop(),
          delta = offset - lastOffset,
          translate = Math.max(0, Math.min(headerHeight, lastTranslate + delta))
          ;

        header.css({'transform': 'translate3d(0,-' + translate + 'px, 0)'});
        lastOffset = offset;
        lastTranslate = translate;
      });
    });
  }
});

/*
 * Quasar Content
 */

Vue.component('quasar-page', {
  template: template.find('#quasar-page').html()
});

/*
 * Quasar Headers
 */

Vue.component('quasar-header', {
  template: template.find('#quasar-header').html()
});


Vue.component('quasar-navigation', {
  template: template.find('#quasar-navigation').html(),
  ready: function() {
    var
      nav = $(this.$el),
      scroller = nav.find('> .tabsContainer'),
      content = scroller.find('> .tabsContent'),
      leftScroll = nav.find('> .left-scroll'),
      rightScroll = nav.find('> .right-scroll')
      ;

    function scrollToSelectedIfNeeded(tab) {
      if (!nav.hasClass('scrollable')) {
        return;
      }

      var contentRect = content[0].getBoundingClientRect();
      var tabRect = tab[0].getBoundingClientRect();

      var tabWidth = tabRect.width;
      var tabOffsetLeft = tabRect.left - contentRect.left;

      var leftPosition = tabOffsetLeft - scroller.scrollLeft();

      if (leftPosition < 0) {
        scroller[0].scrollLeft += leftPosition;
      }
      else {
        leftPosition += tabWidth - scroller[0].offsetWidth;
        if (leftPosition > 0) {
          scroller[0].scrollLeft += leftPosition;
        }
      }
    }

    function updateScrollIndicator() {
      nav.addClass('scrollable');
      if (scroller.width() >= scroller[0].scrollWidth) {
        nav.removeClass('scrollable');
      }

      leftScroll.removeClass('invisible');
      rightScroll.removeClass('invisible');
      if (scroller.scrollLeft() <= 0) {
        leftScroll.addClass('invisible');
      }
      if (scroller.scrollLeft() + scroller.innerWidth() + 5 >= scroller[0].scrollWidth) {
        rightScroll.addClass('invisible');
      }
    }

    scroller.scroll(updateScrollIndicator);
    $(window).resize(updateScrollIndicator);
    q.nextTick(function() {
      updateScrollIndicator();
    });

    leftScroll.click(function() {scroller[0].scrollLeft -= 40;});
    rightScroll.click(function() {scroller[0].scrollLeft += 40;});

    nav.find('a.quasar-tab:not(.left-scroll):not(.right-scroll)')
      .click(function() {
        var self = $(this);

        scrollToSelectedIfNeeded(self);

        if (self.hasClass('active')) {
          return;
        }
        self.siblings().removeClass('active');
        self.addClass('active');
      })
      .each(/* istanbul ignore next */ function() {
        var hammer = $(this).hammer().getHammer();
        var lastOffset = 0;

        hammer.on('panmove', function(ev) {
          scroller[0].scrollLeft += lastOffset - ev.deltaX;
          lastOffset = ev.deltaX;
        });
        hammer.on('panend', function(ev) {
          lastOffset = 0;
        });
      });
  }
});

Vue.component('quasar-tab', {
  template: template.find('#quasar-tab').html()
});

Vue.component('quasar-row', {
  template: template.find('#quasar-row').html()
});

Vue.component('quasar-title', {
  template: template.find('#quasar-title').html()
});

Vue.component('quasar-footer', {
  template: template.find('#quasar-footer').html()
});
var LandgingController,
  __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

LandgingController = (function() {
  function LandgingController() {
    this.stickyForm = __bind(this.stickyForm, this);
    this.rewindBackward = __bind(this.rewindBackward, this);
    this.prevSlide = __bind(this.prevSlide, this);
    this.rewindForward = __bind(this.rewindForward, this);
    this.nextSlide = __bind(this.nextSlide, this);
    this.removeJump = __bind(this.removeJump, this);
    this.rebuildPlayer = __bind(this.rebuildPlayer, this);
    var i, item, _i, _len, _ref;
    this.itype = 'click';
    this.html = $('html');
    if (this.html.hasClass('touch')) {
      this.itype = 'touchstart';
    }
    this.form = $('.registration_form');
    $(window).on('scroll', this.stickyForm);
    $(window).on('resize', this.rebuildPlayer);
    this.stickyForm();
    this.current = 0;
    this.time = 600;
    this.slider = $('.slider .slides');
    this.list = this.slider.find('.list');
    this.next = this.slider.find('nav .next');
    this.prev = this.slider.find('nav .prev');
    this.next.on(this.itype, this.nextSlide);
    this.prev.on(this.itype, this.prevSlide);
    this.width = this.list.width();
    this.current_slide = this.list.find('.slide:first');
    this.first = this.current_slide.clone(true).addClass('cloned');
    this.last = this.list.find('.slide:last').clone(true).addClass('cloned');
    this.list.find('.slide:first').before(this.last);
    this.list.find('.slide:last').after(this.first);
    this.list.css('left', -this.width + 'px');
    window.setTimeout(this.removeJump, 0);
    this.items = this.list.find('.slide');
    i = 0;
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.setAttribute('data-num', i);
      i++;
    }
  }

  LandgingController.prototype.rebuildPlayer = function() {
    this.width = this.list.width();
    return this.list.css('left', (-this.width * parseInt(this.current_slide.attr('data-num'), 10)) + 'px');
  };

  LandgingController.prototype.removeJump = function() {
    return this.list.removeClass('jump');
  };

  LandgingController.prototype.nextSlide = function() {
    var tmp;
    tmp = this.current_slide.next();
    if (tmp.length === 0) {
      this.current_slide = this.list.find('.slide:eq(1)');
      this.list.addClass('jump');
      window.setTimeout((function(_this) {
        return function() {
          _this.list.css('left', (-_this.width * parseInt(_this.current_slide.attr('data-num'), 10) + 1) + 'px');
          return window.setTimeout(_this.rewindForward, 50);
        };
      })(this), 0);
      return;
    }
    this.current_slide = tmp;
    return this.list.css('left', (-this.width * parseInt(this.current_slide.attr('data-num'), 10)) + 'px');
  };

  LandgingController.prototype.rewindForward = function() {
    this.list.removeClass('jump');
    return this.next.trigger(this.itype);
  };

  LandgingController.prototype.prevSlide = function(event) {
    var tmp;
    tmp = this.current_slide.prev();
    if (tmp.length === 0) {
      this.current_slide = this.list.find('.slide:eq(-2)');
      this.list.addClass('jump');
      window.setTimeout((function(_this) {
        return function() {
          _this.list.css('left', (-_this.width * parseInt(_this.current_slide.attr('data-num'), 10)) + 'px');
          return window.setTimeout(_this.rewindBackward, 50);
        };
      })(this), 0);
      return;
    }
    this.current_slide = tmp;
    return this.list.css('left', (-this.width * parseInt(this.current_slide.attr('data-num'), 10)) + 'px');
  };

  LandgingController.prototype.rewindBackward = function() {
    this.list.removeClass('jump');
    return this.prev.trigger(this.itype);
  };

  LandgingController.prototype.stickyForm = function(event) {
    var top;
    top = $(window).scrollTop();
    if (top > 208) {
      this.form.toggleClass('sticky', true);
      return this.form.css('height', 'auto');
    } else {
      this.form.toggleClass('sticky', false);
      return this.form.css('height', Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 423 + top);
    }
  };

  return LandgingController;

})();

$(document).ready(function() {
  return new LandgingController();
});

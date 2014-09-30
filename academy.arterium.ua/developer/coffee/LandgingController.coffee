class LandgingController
  constructor: ->
    @itype = 'click'
    @html = $ 'html'
    if @html.hasClass('touch')
      @itype = 'touchstart'

    @form = $ '.registration_form'
    $(window).on 'scroll', @stickyForm
    $(window).on 'resize', @rebuildPlayer
    @stickyForm()

    @current = 0
    @time = 600

    @slider = $ '.slider .slides'
    @list = @slider.find '.list'

    @next = @slider.find 'nav .next'
    @prev = @slider.find 'nav .prev'
    @next.on @itype, @nextSlide
    @prev.on @itype, @prevSlide
    
    @width = @list.width()
    @current_slide = @list.find '.slide:first'
    @first = @current_slide.clone(true).addClass('cloned')
    @last = @list.find('.slide:last').clone(true).addClass('cloned')
    @list.find('.slide:first').before(@last)
    @list.find('.slide:last').after(@first)
    @list.css 'left', -@width+'px'

    window.setTimeout @removeJump, 0

    @items = @list.find '.slide'
    i = 0
    for item in @items
      item.setAttribute 'data-num', i
      i++

  rebuildPlayer: =>
    @width = @list.width()
    @list.css 'left',
      (-@width*parseInt(@current_slide.attr('data-num'),10))+'px'

  removeJump: =>
    @list.removeClass('jump')

  nextSlide: =>
    tmp = @current_slide.next()

    if tmp.length == 0
      @current_slide = @list.find('.slide:eq(1)')
      @list.addClass('jump')
      window.setTimeout =>
        @list.css 'left',
          (-@width*parseInt(@current_slide.attr('data-num'),10)+1)+'px'
        window.setTimeout(@rewindForward, 50)
      , 0
      return

    @current_slide = tmp
    @list.css 'left',
      (-@width*parseInt(@current_slide.attr('data-num'),10))+'px'


  rewindForward: =>
    @list.removeClass 'jump'
    @next.trigger @itype

  prevSlide: (event)=>
    tmp = @current_slide.prev()

    if tmp.length == 0
      @current_slide = @list.find('.slide:eq(-2)')
      @list.addClass('jump')
      window.setTimeout =>
        @list.css 'left',
          (-@width*parseInt(@current_slide.attr('data-num'),10))+'px'
        window.setTimeout(@rewindBackward, 50)
      , 0
      return

    @current_slide = tmp
    @list.css 'left',
      (-@width*parseInt(@current_slide.attr('data-num'),10))+'px'

  rewindBackward: =>
    @list.removeClass 'jump'
    @prev.trigger @itype



  stickyForm: (event)=>
    if $(window).scrollTop() > 208
      @form.toggleClass 'sticky', true
    else
      @form.toggleClass 'sticky', false

    
$(document).ready ()->
  new LandgingController()
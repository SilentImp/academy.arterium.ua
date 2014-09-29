class LandgingController
  constructor: ->
    @itype = 'click'
    @html = $ 'html'
    if @html.hasClass('touch')
      @itype = 'touchstart'
    
$(document).ready ()->
  new LandgingController()
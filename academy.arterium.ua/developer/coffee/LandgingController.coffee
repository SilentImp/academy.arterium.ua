class LandgingController
  constructor: ->
    @itype = 'click'
    @html = $ 'html'
    if @html.hasClass('touch')
      @itype = 'touchstart'

    @form = $ '.registration_form'

  
    
$(document).ready ()->
  new LandgingController()
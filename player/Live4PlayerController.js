function Live4PlayerController(player){

  this.player = player;
  
  this.heatmap =        this.player.querySelector('.live4player-navigation-progressbar-heatmap');
  this.base_button =    this.player.querySelector('.live4player-base')
  this.video =          this.player.querySelector('.live4player-video');
  this.current =        this.player.querySelector('.live4player-navigation-progressbar-progress');
  this.seekable =       this.player.querySelector('.live4player-navigation-progressbar-seekable');
  this.time_current =   this.player.querySelector('.live4player-navigation-time-current');
  this.time_duration =  this.player.querySelector('.live4player-navigation-time-duration');

  this.realWidth = null;
  this.realHeight = null;

  this.default_height = this.video.getAttribute('height');
  this.default_width = this.video.getAttribute('width');

  this.heatmap.addEventListener('load', this.markLoaded.bind(this), false);
  if(this.heatmap.completed==true){
    this.markLoaded();
  }

  this.video.addEventListener('loadedmetadata', this.loadedMetaData.bind(this), false);
  this.video.addEventListener('canplay', this.startPlay.bind(this), false);
  this.video.addEventListener('durationchange', this.showDuration.bind(this), false);
  this.video.addEventListener('timeupdate', this.showCurrent.bind(this), false);
  this.video.addEventListener('progress', this.progressChange.bind(this), false);
  this.video.addEventListener('waiting', this.waiting.bind(this), false);
  this.video.addEventListener('stalled', this.waiting.bind(this), false);
  this.video.addEventListener('loadstart', this.waiting.bind(this), false);
  this.video.addEventListener('seeking', this.waiting.bind(this), false);
  this.video.addEventListener('seeked', this.seeked.bind(this), false);
  this.seekable.addEventListener('click', this.seek.bind(this), false);

  this.play_button = this.player.querySelector('.live4player-navigation-play');
  this.pause_button = this.player.querySelector('.live4player-navigation-pause');  
  this.play_button.addEventListener('click', this.play.bind(this), false);
  this.pause_button.addEventListener('click', this.pause.bind(this), false);
  this.base_button.addEventListener('click', this.togglePlayState.bind(this), false);

  this.video.addEventListener('playing', this.playState.bind(this), false)
  this.video.addEventListener('pause', this.playState.bind(this), false);
  this.video.addEventListener('play', this.playState.bind(this), false);
  this.video.addEventListener('ended', this.ended.bind(this), false);
  
  this.playState();

  this.mute_button = this.player.querySelector('.live4player-navigation-mute');
  this.unmute_button = this.player.querySelector('.live4player-navigation-unmute');
  this.mute_button.addEventListener('click', this.mute.bind(this), false);
  this.unmute_button.addEventListener('click', this.unmute.bind(this), false);
  this.video.addEventListener('volumechange', this.volumeState.bind(this), false);

  this.volumeState();

  this.fson_button = this.player.querySelector('.live4player-navigation-fson');
  this.fsoff_button = this.player.querySelector('.live4player-navigation-fsoff');
  this.fson_button.addEventListener('click', this.fson.bind(this), false);
  this.fsoff_button.addEventListener('click', this.fsoff.bind(this), false);

  this.video.load();

  // debug
  window.debugPlayer = {
    'player': this
  }
}

Live4PlayerController.prototype.registerMetaLoadedCallback = function(callback){
  if(typeof callback !== 'function'){
    throw { 
        name:        "Player Controller Error", 
        message:     "Metadata callback must be a function", 
        toString:    function(){return this.name + ": " + this.message;} 
      };
  }
  if(!isNaN(this.video.duration)){
    // console.log('duration: ', this.video.duration);
    callback(this.video.duration);
  }
  this.video.addEventListener('loadedmetadata', function(){
    // console.log('map meta loaded: ', this.video.duration);
    callback(this.video.duration);
  }.bind(this), false);
};

Live4PlayerController.prototype.registerTimeUpdateCallback = function(callback){
  if(typeof callback !== 'function'){
    throw { 
        name:        "Player Controller Error", 
        message:     "Timeupdate callback must be a function", 
        toString:    function(){return this.name + ": " + this.message;} 
      };
  }
  this.video.addEventListener('timeupdate', function(){
    callback(this.video.currentTime)
  }.bind(this), false);
};

Live4PlayerController.prototype.seekTime = function(time){
  if(isNaN(time)||time<0||time>this.video.duration){
    return;
  }
  if(typeof this.video.fastSeek != 'undefined'){
    this.video.fastSeek(time);
  }else{
    this.video.currentTime = time;
  }
};

Live4PlayerController.prototype.seeked = function(event){
  this.player.classList.remove('live4player-loading');
};

Live4PlayerController.prototype.markLoaded = function(event){
  this.heatmap.classList.add('loaded');
};

Live4PlayerController.prototype.fson = function(event){
  this.player.classList.add('live4player-fsmode');
  if(this.player.requestFullscreen){
    this.player.requestFullscreen();
  }else if(this.player.msRequestFullscreen){
    this.player.msRequestFullscreen();
  }else if(this.player.mozRequestFullScreen){
    this.player.mozRequestFullScreen();
  }else if(this.player.webkitRequestFullscreen){
    this.player.webkitRequestFullscreen();
  }
  this.video.setAttribute('height', '100%');
  this.video.setAttribute('width', '100%');

};

Live4PlayerController.prototype.fsoff = function(event){
  this.player.classList.remove('live4player-fsmode');
  if(document.exitFullscreen){
    document.exitFullscreen();
  }else if(document.mozCancelFullScreen){
    document.mozCancelFullScreen();
  }else if(document.msExitFullscreen){
    document.msExitFullscreen();
  }else if(document.webkitExitFullscreen){
    document.webkitExitFullscreen();
  }
  this.video.setAttribute('height', this.default_height);
  this.video.setAttribute('width', this.default_width);

};

Live4PlayerController.prototype.seek = function(event){
  var time = this.video.seekable.start(0)+((event.layerX/this.seekable.offsetWidth)*(this.video.seekable.end(0)-this.video.seekable.start(0)));
  this.seekTime(time);
};

Live4PlayerController.prototype.play = function(event){
  this.video.play();
};

Live4PlayerController.prototype.pause = function(event){
  this.video.pause();
};

Live4PlayerController.prototype.togglePlayState = function(event){
  if(this.player.classList.contains('live4player-playing')){
    this.video.pause();
  }else{
    this.video.play();
  }
};

Live4PlayerController.prototype.playState = function(event){
  if(this.video.paused){
    this.player.classList.remove('live4player-playing');
  }else{
    this.player.classList.add('live4player-playing');
    this.player.classList.remove('live4player-loading');
  }
};

Live4PlayerController.prototype.ended = function(event){
  this.player.classList.remove('live4player-playing');
};

Live4PlayerController.prototype.mute = function(event){
  this.video.muted = true;
};
  
Live4PlayerController.prototype.unmute = function(event){
  this.video.muted = false;
};

Live4PlayerController.prototype.volumeState = function(event){
  if(this.video.muted){
    this.player.classList.add('live4player-muted');
  }else{
    this.player.classList.remove('live4player-muted');
  }
};

Live4PlayerController.prototype.waiting = function(event){
  this.player.classList.add('live4player-loading');
};

Live4PlayerController.prototype.loadedMetaData = function(event){
  this.showCurrent();
  this.showDuration();
  if(this.video.duration == Infinity){
    this.player.classList.add('live4player-live');
  }
  this.player.classList.add('live4player-meta-loaded');
};

Live4PlayerController.prototype.progressChange = function(event){
  try{
    this.seekable.style.width = parseFloat((this.video.seekable.end(0)-this.video.seekable.start(0))*100/this.video.duration,10)+'%';
    this.seekable.style.left = parseFloat(this.video.seekable.start(0)*100/this.video.duration,10)+'%';
  }catch (error) {}
};

Live4PlayerController.prototype.showDuration = function(event){
  if(this.video.duration == Infinity){
    return;
  }
  var duration_m = this.addLeadingZero(Math.floor(this.video.duration/60));
  var duration_s = this.addLeadingZero(Math.ceil(this.video.duration%60));
  this.time_duration.innerHTML = ' '+duration_m + ":" + duration_s+' ';
};

Live4PlayerController.prototype.addLeadingZero = function(digital){
  if(digital<10){
    return '0'+digital;
  }
  return digital;
};

Live4PlayerController.prototype.showCurrent = function(event){

  if(this.realWidth==null&&this.video.videoWidth>0){
    this.realWidth = this.video.videoWidth;
    this.realHeight = this.video.videoHeight;
    this.video.height = Math.floor(this.realHeight*this.video.offsetWidth/this.realWidth);
  }

  this.current.style.width = (this.video.currentTime*100/this.video.duration)+'%';
  var played_m = this.addLeadingZero(Math.floor(this.video.currentTime/60));
  var played_s = this.addLeadingZero(Math.ceil(this.video.currentTime%60));
  this.time_current.innerHTML = ' '+played_m + ':' + played_s+' ';
  if(this.player.classList.contains('live4player-loading')){
    this.player.classList.remove('live4player-loading');
  }
  this.progressChange();
};

Live4PlayerController.prototype.startPlay = function(event){  
  this.player.classList.remove('live4player-loading');
  this.video.play();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl2ZTRQbGF5ZXJDb250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiTGl2ZTRQbGF5ZXJDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIExpdmU0UGxheWVyQ29udHJvbGxlcihwbGF5ZXIpe1xuXG4gIHRoaXMucGxheWVyID0gcGxheWVyO1xuICBcbiAgdGhpcy5oZWF0bWFwID0gICAgICAgIHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1uYXZpZ2F0aW9uLXByb2dyZXNzYmFyLWhlYXRtYXAnKTtcbiAgdGhpcy5iYXNlX2J1dHRvbiA9ICAgIHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1iYXNlJylcbiAgdGhpcy52aWRlbyA9ICAgICAgICAgIHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci12aWRlbycpO1xuICB0aGlzLmN1cnJlbnQgPSAgICAgICAgdGhpcy5wbGF5ZXIucXVlcnlTZWxlY3RvcignLmxpdmU0cGxheWVyLW5hdmlnYXRpb24tcHJvZ3Jlc3NiYXItcHJvZ3Jlc3MnKTtcbiAgdGhpcy5zZWVrYWJsZSA9ICAgICAgIHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1uYXZpZ2F0aW9uLXByb2dyZXNzYmFyLXNlZWthYmxlJyk7XG4gIHRoaXMudGltZV9jdXJyZW50ID0gICB0aGlzLnBsYXllci5xdWVyeVNlbGVjdG9yKCcubGl2ZTRwbGF5ZXItbmF2aWdhdGlvbi10aW1lLWN1cnJlbnQnKTtcbiAgdGhpcy50aW1lX2R1cmF0aW9uID0gIHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1uYXZpZ2F0aW9uLXRpbWUtZHVyYXRpb24nKTtcblxuICB0aGlzLnJlYWxXaWR0aCA9IG51bGw7XG4gIHRoaXMucmVhbEhlaWdodCA9IG51bGw7XG5cbiAgdGhpcy5kZWZhdWx0X2hlaWdodCA9IHRoaXMudmlkZW8uZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgdGhpcy5kZWZhdWx0X3dpZHRoID0gdGhpcy52aWRlby5nZXRBdHRyaWJ1dGUoJ3dpZHRoJyk7XG5cbiAgdGhpcy5oZWF0bWFwLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm1hcmtMb2FkZWQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICBpZih0aGlzLmhlYXRtYXAuY29tcGxldGVkPT10cnVlKXtcbiAgICB0aGlzLm1hcmtMb2FkZWQoKTtcbiAgfVxuXG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCB0aGlzLmxvYWRlZE1ldGFEYXRhLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5zdGFydFBsYXkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2R1cmF0aW9uY2hhbmdlJywgdGhpcy5zaG93RHVyYXRpb24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCB0aGlzLnNob3dDdXJyZW50LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHRoaXMucHJvZ3Jlc3NDaGFuZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmcnLCB0aGlzLndhaXRpbmcuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YWxsZWQnLCB0aGlzLndhaXRpbmcuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsIHRoaXMud2FpdGluZy5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignc2Vla2luZycsIHRoaXMud2FpdGluZy5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignc2Vla2VkJywgdGhpcy5zZWVrZWQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLnNlZWthYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zZWVrLmJpbmQodGhpcyksIGZhbHNlKTtcblxuICB0aGlzLnBsYXlfYnV0dG9uID0gdGhpcy5wbGF5ZXIucXVlcnlTZWxlY3RvcignLmxpdmU0cGxheWVyLW5hdmlnYXRpb24tcGxheScpO1xuICB0aGlzLnBhdXNlX2J1dHRvbiA9IHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1uYXZpZ2F0aW9uLXBhdXNlJyk7ICBcbiAgdGhpcy5wbGF5X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucGxheS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMucGF1c2VfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wYXVzZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMuYmFzZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZVBsYXlTdGF0ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgdGhpcy5wbGF5U3RhdGUuYmluZCh0aGlzKSwgZmFsc2UpXG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCB0aGlzLnBsYXlTdGF0ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsIHRoaXMucGxheVN0YXRlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuZW5kZWQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICBcbiAgdGhpcy5wbGF5U3RhdGUoKTtcblxuICB0aGlzLm11dGVfYnV0dG9uID0gdGhpcy5wbGF5ZXIucXVlcnlTZWxlY3RvcignLmxpdmU0cGxheWVyLW5hdmlnYXRpb24tbXV0ZScpO1xuICB0aGlzLnVubXV0ZV9idXR0b24gPSB0aGlzLnBsYXllci5xdWVyeVNlbGVjdG9yKCcubGl2ZTRwbGF5ZXItbmF2aWdhdGlvbi11bm11dGUnKTtcbiAgdGhpcy5tdXRlX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubXV0ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIHRoaXMudW5tdXRlX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMudW5tdXRlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCd2b2x1bWVjaGFuZ2UnLCB0aGlzLnZvbHVtZVN0YXRlLmJpbmQodGhpcyksIGZhbHNlKTtcblxuICB0aGlzLnZvbHVtZVN0YXRlKCk7XG5cbiAgdGhpcy5mc29uX2J1dHRvbiA9IHRoaXMucGxheWVyLnF1ZXJ5U2VsZWN0b3IoJy5saXZlNHBsYXllci1uYXZpZ2F0aW9uLWZzb24nKTtcbiAgdGhpcy5mc29mZl9idXR0b24gPSB0aGlzLnBsYXllci5xdWVyeVNlbGVjdG9yKCcubGl2ZTRwbGF5ZXItbmF2aWdhdGlvbi1mc29mZicpO1xuICB0aGlzLmZzb25fYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5mc29uLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy5mc29mZl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmZzb2ZmLmJpbmQodGhpcyksIGZhbHNlKTtcblxuICB0aGlzLnZpZGVvLmxvYWQoKTtcblxuICAvLyBkZWJ1Z1xuICB3aW5kb3cuZGVidWdQbGF5ZXIgPSB7XG4gICAgJ3BsYXllcic6IHRoaXNcbiAgfVxufVxuXG5MaXZlNFBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnJlZ2lzdGVyTWV0YUxvYWRlZENhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICBpZih0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpe1xuICAgIHRocm93IHsgXG4gICAgICAgIG5hbWU6ICAgICAgICBcIlBsYXllciBDb250cm9sbGVyIEVycm9yXCIsIFxuICAgICAgICBtZXNzYWdlOiAgICAgXCJNZXRhZGF0YSBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIiwgXG4gICAgICAgIHRvU3RyaW5nOiAgICBmdW5jdGlvbigpe3JldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2U7fSBcbiAgICAgIH07XG4gIH1cbiAgaWYoIWlzTmFOKHRoaXMudmlkZW8uZHVyYXRpb24pKXtcbiAgICAvLyBjb25zb2xlLmxvZygnZHVyYXRpb246ICcsIHRoaXMudmlkZW8uZHVyYXRpb24pO1xuICAgIGNhbGxiYWNrKHRoaXMudmlkZW8uZHVyYXRpb24pO1xuICB9XG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCBmdW5jdGlvbigpe1xuICAgIC8vIGNvbnNvbGUubG9nKCdtYXAgbWV0YSBsb2FkZWQ6ICcsIHRoaXMudmlkZW8uZHVyYXRpb24pO1xuICAgIGNhbGxiYWNrKHRoaXMudmlkZW8uZHVyYXRpb24pO1xuICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucmVnaXN0ZXJUaW1lVXBkYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gIGlmKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgdGhyb3cgeyBcbiAgICAgICAgbmFtZTogICAgICAgIFwiUGxheWVyIENvbnRyb2xsZXIgRXJyb3JcIiwgXG4gICAgICAgIG1lc3NhZ2U6ICAgICBcIlRpbWV1cGRhdGUgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIsIFxuICAgICAgICB0b1N0cmluZzogICAgZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlO30gXG4gICAgICB9O1xuICB9XG4gIHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIGZ1bmN0aW9uKCl7XG4gICAgY2FsbGJhY2sodGhpcy52aWRlby5jdXJyZW50VGltZSlcbiAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG5MaXZlNFBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnNlZWtUaW1lID0gZnVuY3Rpb24odGltZSl7XG4gIGlmKGlzTmFOKHRpbWUpfHx0aW1lPDB8fHRpbWU+dGhpcy52aWRlby5kdXJhdGlvbil7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmKHR5cGVvZiB0aGlzLnZpZGVvLmZhc3RTZWVrICE9ICd1bmRlZmluZWQnKXtcbiAgICB0aGlzLnZpZGVvLmZhc3RTZWVrKHRpbWUpO1xuICB9ZWxzZXtcbiAgICB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgfVxufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5zZWVrZWQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpdmU0cGxheWVyLWxvYWRpbmcnKTtcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUubWFya0xvYWRlZCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5oZWF0bWFwLmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5mc29uID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLnBsYXllci5jbGFzc0xpc3QuYWRkKCdsaXZlNHBsYXllci1mc21vZGUnKTtcbiAgaWYodGhpcy5wbGF5ZXIucmVxdWVzdEZ1bGxzY3JlZW4pe1xuICAgIHRoaXMucGxheWVyLnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gIH1lbHNlIGlmKHRoaXMucGxheWVyLm1zUmVxdWVzdEZ1bGxzY3JlZW4pe1xuICAgIHRoaXMucGxheWVyLm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgfWVsc2UgaWYodGhpcy5wbGF5ZXIubW96UmVxdWVzdEZ1bGxTY3JlZW4pe1xuICAgIHRoaXMucGxheWVyLm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gIH1lbHNlIGlmKHRoaXMucGxheWVyLndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKXtcbiAgICB0aGlzLnBsYXllci53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICB9XG4gIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScpO1xuICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTAwJScpO1xuXG59O1xuXG5MaXZlNFBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLmZzb2ZmID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKCdsaXZlNHBsYXllci1mc21vZGUnKTtcbiAgaWYoZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4pe1xuICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XG4gIH1lbHNlIGlmKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pe1xuICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgfWVsc2UgaWYoZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbil7XG4gICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpO1xuICB9ZWxzZSBpZihkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbil7XG4gICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgfVxuICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy5kZWZhdWx0X2hlaWdodCk7XG4gIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHRoaXMuZGVmYXVsdF93aWR0aCk7XG5cbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuc2VlayA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdmFyIHRpbWUgPSB0aGlzLnZpZGVvLnNlZWthYmxlLnN0YXJ0KDApKygoZXZlbnQubGF5ZXJYL3RoaXMuc2Vla2FibGUub2Zmc2V0V2lkdGgpKih0aGlzLnZpZGVvLnNlZWthYmxlLmVuZCgwKS10aGlzLnZpZGVvLnNlZWthYmxlLnN0YXJ0KDApKSk7XG4gIHRoaXMuc2Vla1RpbWUodGltZSk7XG59O1xuXG5MaXZlNFBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMudmlkZW8ucGxheSgpO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy52aWRlby5wYXVzZSgpO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS50b2dnbGVQbGF5U3RhdGUgPSBmdW5jdGlvbihldmVudCl7XG4gIGlmKHRoaXMucGxheWVyLmNsYXNzTGlzdC5jb250YWlucygnbGl2ZTRwbGF5ZXItcGxheWluZycpKXtcbiAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XG4gIH1lbHNle1xuICAgIHRoaXMudmlkZW8ucGxheSgpO1xuICB9XG59O1xuXG5MaXZlNFBsYXllckNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlTdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgaWYodGhpcy52aWRlby5wYXVzZWQpe1xuICAgIHRoaXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpdmU0cGxheWVyLXBsYXlpbmcnKTtcbiAgfWVsc2V7XG4gICAgdGhpcy5wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnbGl2ZTRwbGF5ZXItcGxheWluZycpO1xuICAgIHRoaXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpdmU0cGxheWVyLWxvYWRpbmcnKTtcbiAgfVxufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5lbmRlZCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnbGl2ZTRwbGF5ZXItcGxheWluZycpO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5tdXRlID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLnZpZGVvLm11dGVkID0gdHJ1ZTtcbn07XG4gIFxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS51bm11dGUgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMudmlkZW8ubXV0ZWQgPSBmYWxzZTtcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUudm9sdW1lU3RhdGUgPSBmdW5jdGlvbihldmVudCl7XG4gIGlmKHRoaXMudmlkZW8ubXV0ZWQpe1xuICAgIHRoaXMucGxheWVyLmNsYXNzTGlzdC5hZGQoJ2xpdmU0cGxheWVyLW11dGVkJyk7XG4gIH1lbHNle1xuICAgIHRoaXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpdmU0cGxheWVyLW11dGVkJyk7XG4gIH1cbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUud2FpdGluZyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnbGl2ZTRwbGF5ZXItbG9hZGluZycpO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5sb2FkZWRNZXRhRGF0YSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5zaG93Q3VycmVudCgpO1xuICB0aGlzLnNob3dEdXJhdGlvbigpO1xuICBpZih0aGlzLnZpZGVvLmR1cmF0aW9uID09IEluZmluaXR5KXtcbiAgICB0aGlzLnBsYXllci5jbGFzc0xpc3QuYWRkKCdsaXZlNHBsYXllci1saXZlJyk7XG4gIH1cbiAgdGhpcy5wbGF5ZXIuY2xhc3NMaXN0LmFkZCgnbGl2ZTRwbGF5ZXItbWV0YS1sb2FkZWQnKTtcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUucHJvZ3Jlc3NDaGFuZ2UgPSBmdW5jdGlvbihldmVudCl7XG4gIHRyeXtcbiAgICB0aGlzLnNlZWthYmxlLnN0eWxlLndpZHRoID0gcGFyc2VGbG9hdCgodGhpcy52aWRlby5zZWVrYWJsZS5lbmQoMCktdGhpcy52aWRlby5zZWVrYWJsZS5zdGFydCgwKSkqMTAwL3RoaXMudmlkZW8uZHVyYXRpb24sMTApKyclJztcbiAgICB0aGlzLnNlZWthYmxlLnN0eWxlLmxlZnQgPSBwYXJzZUZsb2F0KHRoaXMudmlkZW8uc2Vla2FibGUuc3RhcnQoMCkqMTAwL3RoaXMudmlkZW8uZHVyYXRpb24sMTApKyclJztcbiAgfWNhdGNoIChlcnJvcikge31cbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuc2hvd0R1cmF0aW9uID0gZnVuY3Rpb24oZXZlbnQpe1xuICBpZih0aGlzLnZpZGVvLmR1cmF0aW9uID09IEluZmluaXR5KXtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGR1cmF0aW9uX20gPSB0aGlzLmFkZExlYWRpbmdaZXJvKE1hdGguZmxvb3IodGhpcy52aWRlby5kdXJhdGlvbi82MCkpO1xuICB2YXIgZHVyYXRpb25fcyA9IHRoaXMuYWRkTGVhZGluZ1plcm8oTWF0aC5jZWlsKHRoaXMudmlkZW8uZHVyYXRpb24lNjApKTtcbiAgdGhpcy50aW1lX2R1cmF0aW9uLmlubmVySFRNTCA9ICcgJytkdXJhdGlvbl9tICsgXCI6XCIgKyBkdXJhdGlvbl9zKycgJztcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuYWRkTGVhZGluZ1plcm8gPSBmdW5jdGlvbihkaWdpdGFsKXtcbiAgaWYoZGlnaXRhbDwxMCl7XG4gICAgcmV0dXJuICcwJytkaWdpdGFsO1xuICB9XG4gIHJldHVybiBkaWdpdGFsO1xufTtcblxuTGl2ZTRQbGF5ZXJDb250cm9sbGVyLnByb3RvdHlwZS5zaG93Q3VycmVudCA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuICBpZih0aGlzLnJlYWxXaWR0aD09bnVsbCYmdGhpcy52aWRlby52aWRlb1dpZHRoPjApe1xuICAgIHRoaXMucmVhbFdpZHRoID0gdGhpcy52aWRlby52aWRlb1dpZHRoO1xuICAgIHRoaXMucmVhbEhlaWdodCA9IHRoaXMudmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgdGhpcy52aWRlby5oZWlnaHQgPSBNYXRoLmZsb29yKHRoaXMucmVhbEhlaWdodCp0aGlzLnZpZGVvLm9mZnNldFdpZHRoL3RoaXMucmVhbFdpZHRoKTtcbiAgfVxuXG4gIHRoaXMuY3VycmVudC5zdHlsZS53aWR0aCA9ICh0aGlzLnZpZGVvLmN1cnJlbnRUaW1lKjEwMC90aGlzLnZpZGVvLmR1cmF0aW9uKSsnJSc7XG4gIHZhciBwbGF5ZWRfbSA9IHRoaXMuYWRkTGVhZGluZ1plcm8oTWF0aC5mbG9vcih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lLzYwKSk7XG4gIHZhciBwbGF5ZWRfcyA9IHRoaXMuYWRkTGVhZGluZ1plcm8oTWF0aC5jZWlsKHRoaXMudmlkZW8uY3VycmVudFRpbWUlNjApKTtcbiAgdGhpcy50aW1lX2N1cnJlbnQuaW5uZXJIVE1MID0gJyAnK3BsYXllZF9tICsgJzonICsgcGxheWVkX3MrJyAnO1xuICBpZih0aGlzLnBsYXllci5jbGFzc0xpc3QuY29udGFpbnMoJ2xpdmU0cGxheWVyLWxvYWRpbmcnKSl7XG4gICAgdGhpcy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSgnbGl2ZTRwbGF5ZXItbG9hZGluZycpO1xuICB9XG4gIHRoaXMucHJvZ3Jlc3NDaGFuZ2UoKTtcbn07XG5cbkxpdmU0UGxheWVyQ29udHJvbGxlci5wcm90b3R5cGUuc3RhcnRQbGF5ID0gZnVuY3Rpb24oZXZlbnQpeyAgXG4gIHRoaXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpdmU0cGxheWVyLWxvYWRpbmcnKTtcbiAgdGhpcy52aWRlby5wbGF5KCk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
'use strict';

(function () {
	
var player = {
   media: null,
   mediaTimer: null,
   isPlaying: false,
   played: '',
   duration: '',
   min:0,
   max:100,
   doc: null,
   currPos: 0,
   playpausecmd: '',
   currentClip: null,
   
   initMedia: function(path) {
      player.media = new Media(
         path,
         function() {
            console.log('Media file played succesfully');
            if (player.media !== null)
               player.media.release();
            player.resetLayout();
            var event = {type: "ended", detail:{}};
            this.fire(event);
         },
         function(error) {
            navigator.notification.alert(
               'Unable to read the media file.',
               function(){},
               'Error'
            );
            player.changePlayButton('play');
            console.log('Unable to read the media file (Code): ' + error.code);
         }
      );
   },
   actualPlay: function(clip, path) {
	   player.initMedia(path);
	   player.media.play();
       player.changePlayButton('pause');
       player.isPlaying = true;
	   
       player.mediaTimer = setInterval(
          function() {
             player.media.getCurrentPosition(
                function(position) {
                   if (position > -1)
                   {
                	  player.played = Utility.formatTime(position);
                	   //angular.element(  querySelector("#media-played")).text();
                      player.updateSliderPosition(position);
                      //console.log('setting played position ' + player.played);
                   }
                },
                function(error) {
                   console.log('Unable to retrieve media position: ' + error.code);
                   //angular.element(doc.querySelector("#media-played")).text(Utility.formatTime(0));
                   player.played = Utility.formatTime(0);
                }
             );
          },
          1000
       );
	   
       var timerDuration = setInterval(
          function() {
             //counter++;
             //if (counter > 20)
               // clearInterval(timerDuration);

             var duration = player.media.getDuration();
             if (duration > -1)
             {
                clearInterval(timerDuration);
                player.duration = Utility.formatTime(duration);
                player.max = Math.round(duration);
                
//                angular.element(doc.querySelector("#media-duration")).text(Utility.formatTime(duration));
//                angular.element(doc.querySelector("#time-slider")).attr('max', Math.round(duration));
//                angular.element(doc.querySelector("#time-duration")).slider('refresh');
             }
             else
            	 player.duration = "Unknown";
            	 //angular.element(doc.querySelector("#media-duration")).text('Unknown');
          },
          100
       );
   },
   play: function(clip) {
	   var path = clip.url;
       var counter = 0;

	   player.stop();
	   
	   //if (player.media === null)
	   //let's check if the file already locally available, then change the path
	   console.log("checking for file:" + 'sw/clips/'+ clip.ID + '.mp3');
	   
	   var temp = new FileManager().file_exists('sw/clips/', clip.ID + '.mp3', function(successPath) {
		   path=successPath;
		   console.log("media path:" + path);
		   player.actualPlay(clip, path);

	   },
	   function (failurePath) {
		   path=failurePath;
		   
		   console.log("media path:" + path + " setting to remote url");
		   if (path == "") {
			   //path = clip.url;
			   console.log("trying to load from server");
		   }
		   player.actualPlay(clip, path);
	   }
	   );
   },
   pause: function() {
	   player.media.pause();
	   clearInterval(player.mediaTimer);
	   player.changePlayButton('play');
	   player.isPlaying = false;;
   },
   stop: function() {
      if (player.media !== null) {
         player.media.stop();
         player.media.release();
      }
      clearInterval(player.mediaTimer);
      player.media = null;
      player.isPlaying = false;
      player.resetLayout();
   },
   resetLayout: function() {
      angular.element(player.doc.querySelector("#media-played")).text(Utility.formatTime(0));
      player.changePlayButton('play');
      player.updateSliderPosition(0);
   },
   updateSliderPosition: function(seconds) {
      /*   
      var $slider = angular.element(player.doc.querySelector("#time-slider"));
 
      if (seconds < $slider.attr('min'))
         $slider.val($slider.attr('min'));
      else if (seconds > $slider.attr('max'))
         $slider.val($slider.attr('max'));
      else
         $slider.val(Math.round(seconds));
 
      $slider.slider('refresh');
      */
      player.currPos = Math.round(seconds);
      var event = {type: "change", detail:{currPos : player.currPos}};
      this.fire(event);
   },
   seekPosition: function(seconds) {
      if (player.media === null)
         return;
 
      player.media.seekTo(seconds * 1000);
      player.updateSliderPosition(seconds);
   },
   changePlayButton: function(imageName) {
	  player.playpausecmd =  imageName;
      /*	  
      var background = angular.element(player.doc.querySelector("#player-play"))
      .css('background-image')
      .replace('url(', '')
      .replace(')', '');
 
      angular.element(player.doc.querySelector("#player-play")).css(
         'background-image',
         'url(' + background.replace(/images\/.*\.png$/, 'images/' + imageName + '.png') + ')'
      );
      */
   }
   ,_listeners: {}
   ,addListener: function(type, listener){
        if (typeof this._listeners[type] == "undefined"){
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },
    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this._listeners[event.type] instanceof Array){
            var listeners = this._listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this._listeners[type] instanceof Array){
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },
    removeAllListeners: function (type) {
    	 if (this._listeners[type] instanceof Array){
             var listeners = this._listeners[type];
             for (var i=0, len=listeners.length; i < len; i++){
            	 listeners = listeners.splice(listeners.length - 1, 1);
             }
         }
    }

};

angular.module('swMobile.swPlayer', [])
    .factory('Player', [
        function () {
            return {
                getPlayer: function () {
                    return player;
                }
            }

}]);

}());

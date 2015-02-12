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
	  if (player.media != null) {
		  player.media.stop();
		  player.media.release();
	  }
      player.media = new Media(
         path,
         function() {
            //Utility.debug('Media file played succesfully');
            //if (player.media !== null)
               //player.media.release();
            player.resetLayout();
            var event = {type: "ended", detail:{}};
            Utility.debug("firing ended event");
            player.fire(event);
         },
         function(error) {
            
        	 //Utility.debug()
        	 //navigator.notification.alert(
               //'Unable to read the media file.',
               //function(){},
               //'Error'
            //);
            player.changePlayButton('pause');
            Utility.debug('Unable to read the media file:' + JSON.stringify(error));
         }, function (status) {
        	 Utility.debug("in status change:" + status);
        	 switch(status) {
        	 case Media.MEDIA_PAUSED:
        		 Utility.debug("Media Paused");
        		 break;
        	 case Media.MEDIA_STOPPED:
        		 Utility.debug("Media Stopped");
                 //var event = {type: "ended", detail:{}};
                 //player.fire(event);
        		 break;
        	 }
        	 /*Media.MEDIA_NONE = 0;
        	 Media.MEDIA_STARTING = 1;
        	 Media.MEDIA_RUNNING = 2;
        	 Media.MEDIA_PAUSED = 3;
        	 Media.MEDIA_STOPPED = 4;*/       	 
         }
      );
   },  
   actualPlay: function(clip, path) {
	   Utility.debug("Going to play:" + clip.title);
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
                      //Utility.debug('setting played position ' + player.played);
                      window.localStorage.setItem("nowPlayingClipPosition", position);
                   }
                },
                function(error) {
                   Utility.debug('Unable to retrieve media position: ' + error.code);
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
   resume : function() {
	 player.media.play();
	 player.isPlaying = true;

   },
   play: function(clip, $http) {
	   var path = clip.url;
       var counter = 0;

	   player.stop();
	   
	   //let's save the clip id in the now playing localstorage
	   
	   window.localStorage.setItem("nowPlayingClip", JSON.stringify(clip));
	   
	   //if (player.media === null)
	   //let's check if the file already locally available, then change the path
	   Utility.debug("checking for file:" + 'sw/clip/'+ clip.ID + '.mp3');
	   
	   var temp = new FileManager().file_exists('sw/clip', clip.ID + '.mp3', function(successPath) {
		   path=successPath;
		   Utility.debug("media path:" + path);
		   
		   clip.clipLocationImg = "img/device.png";
		   clip.clipLocation = "device";
		   //player.
		   player.actualPlay(clip, path);

		   //played the clip from local, so lets update stats explicitly
		   Utility.updateClipStats(clip, $http);
		   
		   
		   
	   },
	   function (failurePath) {
		   path=failurePath;
		   
		   Utility.debug("media path:" + path + " setting to remote url");
		   if (path == "") {
			   path = clip.url + "&userid=" + Utility.getUserId();
		   }
		   clip.clipLocationImg = "img/cloud.png";
		   clip.clipLocation = "cloud";
		   
		   player.actualPlay(clip, path);
	   }
	   );
   },
   pause: function() {
	   Utility.debug("pause method on player called");
	   player.media.pause();
	   //clearInterval(player.mediaTimer);
	   player.isPlaying = false;
	   //player.changePlayButton('play');
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
      if (player.doc != null)
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
      player.fire(event);
   },
   seekPosition: function(seconds) {
      if (player.media === null)
         return;
 
      player.media.seekTo(seconds * 1000);
      player.updateSliderPosition(seconds);
   },
   changePlayButton: function(imageName) {
	   //player.playpausecmd =  imageName;
	   var event = {type: "changeplaypause"};
       player.fire(event);
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

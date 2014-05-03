// JavaScript Document
var Utility = {
   formatTime: function(milliseconds) {
      if (milliseconds <= 0)
         return '00:00';
 
      var seconds = Math.round(milliseconds);
      var minutes = Math.floor(seconds / 60);
      if (minutes < 10)
         minutes = '0' + minutes;
 
      seconds = seconds % 60;
      if (seconds < 10)
         seconds = '0' + seconds;
 
      return minutes + ':' + seconds;
   },
   endsWith: function(string, suffix) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
   }
   
};


loadCoverArts = function($http, clips, startFrom) {
	var allclipids = "";
	for (var j = startFrom; j < clips.length; j++) {
		allclipids += clips[j].ID + "~";
		//_gaq.push(['_trackEvent', 'Clips', 'GetCoverArt', clips[j].ID + ":" + clips[j].title + ":thumbnail"]);
	}

	if (allclipids != "") {
		//load cover art
		$http({
				method: 'POST',
				url: 'http://app.songwallah.com/sw/getcoverarts.srvc',
				data : {
					a: allclipids
					//,t: "thumbnail"
				},
				headers: {'Content-Type' : 'application/json'}
		}).
        success(function(data, status) {
         //   $scope.status = status;
			if(data != null){
			//	console.log(data);
				var coverarts = data;
				//var i = 0;
				angular.forEach(coverarts.processedResults,function(coverart, key) {

					var coverartimagebytes = coverart.coverArtImageBytes;

					if (coverartimagebytes != "") {
						clips[key].coverArtImageBytes = coverartimagebytes;
						//i++;
					} 
				});
			}
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;         
        });
    }				
}
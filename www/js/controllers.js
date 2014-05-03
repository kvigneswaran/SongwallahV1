'use strict';


angular.module('swMobile.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', '$http', function ($scope, $rootScope, $window, $location, $http) {
    	
    	
	   $rootScope.userId =  "madala123@gmail.com"; 
	   $rootScope.guestId = "guest100";
	   $rootScope.fbId = "madala.kayan@gmail.com"
	   $rootScope.fbLongtermToken = "longterm12345";
	   $rootScope.userName = "Kalyan Madala";
	   $rootScope.userProfilePic = "profile.jpeg";
	   $rootScope.type = "SW";

    	$rootScope.navButtonState = ["disabled", "disabled", "disabled", "disabled", "disabled"];
    	$rootScope.showNavBar = true;
        $scope.slide = '';
        $rootScope.back = function() {
          $scope.slide = 'slide-right';
          $window.history.back();
        }
        $rootScope.go = function(path){
          $scope.slide = 'slide-left';
          $location.url(path);
        }
        
        $scope.navigateTo = function(pageId){
        	
        	switch(pageId){
        	case 4 :
        				$location.path('/myoptions');
        				break;
        	}
        }
        
    }])
    .controller('ClipListCtrl', ['$scope', '$rootScope', '$http', 'ClipSearchResults', function ($scope, $rootScope, $http, ClipSearchResults) {
    	
    	 //remove other highlights
    	 $rootScope.showNavBar = true;
    	 $rootScope.navButtonState = ["disabled", "disabled", "active", "disabled", "disabled"];
        
    	 var filter=$rootScope.selectedfilter === undefined ? 2 : $rootScope.selectedfilter;
    	 $rootScope.selectedfilter = filter;
    	 $scope.headeritemstyle=[(filter == 2 ? "with" : "no") + "border", (filter == 3 ? "with" : "no") + "border" ,(filter == 4 ? "with" : "no") + "border"];
    	 
    	 $scope.clips= ClipSearchResults.getClips();
    	 $scope.playlists= ClipSearchResults.getPlaylists();
    	 $scope.radios = ClipSearchResults.getRadios();
    	 
    	 $scope.url = 'http://app.songwallah.com/sw/clipfullsearch.srvc';
    	 $scope.coverArtUrl = "http://app.songwallah.com/sw/getcoverarts.srvc";
    	 $scope.searchTerm = ClipSearchResults.getLastSearchTerm();
    	 
    	 $scope.changeFilter = function (filter) {
    		 $rootScope.selectedfilter = filter;
    		 $scope.headeritemstyle=[(filter == 2 ? "with" : "no") + "border", (filter == 3 ? "with" : "no") + "border" ,(filter == 4 ? "with" : "no") + "border"];
    		 ClipSearchResults.resetSearch();
    		 $scope.clips = new Array();
    		 $scope.playlists = new Array(); 
    		 $scope.radios = new Array();
    		 $scope.loadClips();
    	 }
    	 
    	 $scope.swipeRight = function() {
    		 $rootScope.selectedfilter = $rootScope.selectedfilter - 1;
    		 if ($rootScope.selectedfilter < 2)
    			 $rootScope.selectedfilter = 4;
    		 $scope.changeFilter($rootScope.selectedfilter);
    	 }
    	
    	 $scope.swipeLeft = function() {
    		 $rootScope.selectedfilter = $rootScope.selectedfilter + 1;
    		 if ($rootScope.selectedfilter > 4)
    			 $rootScope.selectedfilter = 2;
    		 $scope.changeFilter($rootScope.selectedfilter);
    	 }
    	 
    	 $scope.loadCoverArts = function(startFrom) {
    				var allclipids = "";
    				for (var j = startFrom; j < $scope.clips.length; j++) {
    					allclipids += $scope.clips[j].ID + "~";
    					//_gaq.push(['_trackEvent', 'Clips', 'GetCoverArt', clips[j].ID + ":" + clips[j].title + ":thumbnail"]);
    				}

    				if (allclipids != "") {
    					//load cover art
    					$http({
    							method: 'POST',
    							url: $scope.coverArtUrl,
    							data : {
    								a: allclipids
    								//,t: "thumbnail"
    							},
    							headers: {'Content-Type' : 'application/json'}
    					}).
    		             success(function(data, status) {
    		                 $scope.status = status;
 							if(data != null){
						//		console.log(data);
								console.log("loaded cover arts");
						
								var coverarts = data;
								//var i = 0;
								angular.forEach(coverarts.processedResults,function(coverart, key) {

									var coverartimagebytes = coverart.coverArtImageBytes;

									if (coverartimagebytes != "") {
										$scope.clips[key].coverArtImageBytes = coverartimagebytes;
										//i++;
									} 
								});
							}
    		             })
    		             .error(function(data, status) {
    		                 $scope.data = data || "Request failed";
    		                 $scope.status = status;         
    		             });
    		         };    				
    	 };
    	 $scope.loadMore = function() {
    		 $scope.loadClips();
    	 };
    	 
    	 $scope.loadClips = function() {
    		 $http({
					method: 'POST',
					url: $scope.url,
					data : {
						searchterm: ClipSearchResults.getLastSearchTerm(),
						start: ClipSearchResults.getResultsStart(),
						len: ClipSearchResults.getResultsLen(),
						f: $rootScope.selectedfilter
					},
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	     	    $scope.status = status;
	            $scope.clips = $scope.clips.concat(data.processedResults.clips);
	            $scope.playlists = $scope.playlists.concat(data.processedResults.playLists);
	            $scope.radios = $scope.radios.concat(data.processedResults.radios);
	            ClipSearchResults.setClips($scope.clips);
	            ClipSearchResults.setPlaylists($scope.playlists);
	            ClipSearchResults.setRadios($scope.radios);
	            if ($scope.clips != null && $scope.clips.length > 0)
	            	$scope.loadCoverArts(ClipSearchResults.getResultsStart());
	            ClipSearchResults.setResultsStart(ClipSearchResults.getResultsLen() + data.processedResults.clips.length);
	            
	       })
	       .error(function(data, status) {
	           $scope.data = data || "Request failed";
	           $scope.status = status;         
	       });
    	 };
    	 
         $scope.clipSearch = function() {
        	 ClipSearchResults.setLastSearchTerm($scope.searchTerm);
        	 ClipSearchResults.resetSearch();
        	 ClipSearchResults.setResultsStart(0);
             $scope.loadClips();
         };
         
    }])
    .controller('ClipDetailCtrl', ['$rootScope', '$scope', '$document', '$routeParams', 'ClipSearchResults', 'Player', 'Playlist', 'Radio', function ($rootScope, $scope, $document, $routeParams, ClipSearchResults, Player, Playlist, Radio) {
    	 //load clip
    	
    	$rootScope.showNavBar = false;
    	$scope.minval = 0;
        $scope.maxval = 100;
    	$scope.duration = 100;
    	$scope.currPos = 50;
    	$scope.played = "";
    	$scope.playpausecmd = "Play";    
    	$scope.showmore = false;
    	
    	$scope.convertDate = function(val) {
    		return moment(val, "YYYY-MM-DDThh:mm:ss.SSSZ").fromNow();
    	}
    	
    	if ($routeParams.clipIndex !== undefined) {
    		if($routeParams.clipIndex == -9999) {
    			if (Playlist.getCurrentPlaylist !=null) {
    				$scope.clip = Playlist.getClip(Playlist.getCurrentIndex());
    				$rootScope.nowPlaying = true;
    			}
    			else if (Radio.getCurrentRadio !=null) {
    				$scope.clip = Radio.getClip();
    				$rootScope.nowPlaying = true;
    			}
    			else {
    				$scope.clip = null;
    				$rootScope.nowPlaying = false;
    			}
    		} else if($routeParams.clipIndex == -9997){ //prev
    			//move within the currently loaded playlist
    			$scope.clip = Playlist.getPrevClip();
    			$rootScope.nowPlaying = true;
    		} else if ($routeParams.clipIndex == -9998){ //next
    			$scope.clip = Playlist.getNextClip();
    			$rootScope.nowPlaying = true;
    		} else {
	    		$scope.currentClipIndex = $routeParams.clipIndex;
	    		var tempClip = ClipSearchResults.getClip($scope.currentClipIndex);
	        	var index = Playlist.addToPlaylist(tempClip);
	        	if (!Player.isPlaying) {
	        		$scope.clip = tempClip;
	        		Playlist.setCurrentIndex(index);       		
	        	}
	        	$rootScope.nowPlaying = true;
    		}
    	}
    	
    	
    	$scope.userRated = false;
    	$scope.othersRated = false;
    	
    	$scope.userRatedClass = "color:green;";
    	$scope.otherRatedClass = "color:yellow;";
    	
    	if ($scope.clip.userRating !== undefined && $scope.clip.userRating > 0) {
    		$scope.userRated = true;
        	$scope.othersRated = false;
    	} else if ($scope.clip.usageData.avgRating > 0){
    		$scope.othersRated = true;
    		$scope.userRated = false;
    		$scope.clip.userRating = $scope.clip.usageData.avgRating;
    	} else {
    		$scope.userRated = false;
        	$scope.othersRated = false;
    	}
    	
    	function setupClip(clip, reset) {
    		$scope.clip = clip;
        	$scope.userRated = false;
        	$scope.othersRated = false;
        	
        	$scope.userRatedClass = "color:green;";
        	$scope.otherRatedClass = "color:yellow;";
        	
        	if ($scope.clip.userRating !== undefined && $scope.clip.userRating > 0) {
        		$scope.userRated = true;
            	$scope.othersRated = false;
        	} else if ($scope.clip.usageData.avgRating > 0){
        		$scope.othersRated = true;
        		$scope.userRated = false;
        		$scope.clip.userRating = $scope.clip.usageData.avgRating;
        	} else {
        		$scope.userRated = false;
            	$scope.othersRated = false;
        	}
        	//console.log($scope.clip);
        	if (reset) {
	        	$scope.minval = 0;
	            $scope.maxval = 100;
	        	$scope.duration = 100;
	        	$scope.currPos = 50;
	        	$scope.played = "";
	        	$scope.playpausecmd = "Play";    
	        	$scope.showmore = false;
	        	$scope.apply();
        	
	        	setTimeout(function () {
	        		Player.getPlayer().doc = $document[0];
	        		Player.getPlayer().play($scope.clip );
	            }, 500);
	        	$rootScope.nowPlaying = false;
        	}
    	}
   	
    	$scope.showhideClipDetails = function(){
    		$scope.showmore = !$scope.showmore;
    	};
    	
    	$scope.downloadClip = function() {
    		var a = new DirManager(); // Initialize a Folder manager
            a.create_r('/sw/clips',Log('created successfully'));
            
            new FileManager().download_file($scope.clip.url,'/sw/clips/',$scope.clip.ID + '.mp3',Log('downloaded sucess ' + $scope.clip.ID));
    	}
    	$scope.shareClip = function() {
    		window.plugins.socialsharing.share('Clip:' + $scope.clip.ID);
    	};

    	Player.getPlayer().addListener("change", function() {
        	$scope.minval = Player.getPlayer().min;
        	$scope.maxval = Player.getPlayer().max;
        	$scope.duration = Player.getPlayer().duration;
        	$scope.currPos = Player.getPlayer().currPos;
        	$scope.played = Player.getPlayer().played;
        	$scope.playpausecmd = Player.getPlayer().playpausecmd;    	
            $scope.$apply();   
        });
    	
    	Player.getPlayer().addListener("ended", function() {
    		if (Playlist.getCurrentPlaylist() != null) {
    			setupClip(Playlist.getNextClip(), true);
    			$scope.playClip();
    		}
    		else if (Radio.getCurrentRadio() != null) {
    			setupClip(Radio.getNextClip(), true);
    			$scope.playClip();
    		}
        });
        
    	$scope.playClip = function() {
	    	//play the clip
	    	setTimeout(function () {
	    		if (!$rootScope.nowPlaying) {
	    			Player.getPlayer().doc = $document[0];
	    			Player.getPlayer().stop();
	    			Player.getPlayer().play($scope.clip.url);
	    		}
	        }, 500);
    	};
    	
    	$scope.playClip();
    	
    }])
     .controller('PlaylistDetailCtrl', ['$rootScope', '$scope', '$http', '$document', '$routeParams', 'Player', 'Playlist', 'Radio', 'ClipSearchResults', function ($rootScope, $scope, $http, $document, $routeParams, Player, Playlist, Radio, ClipSearchResults) {
    	 
    	 $scope.showmore = false;
    	 if ($routeParams.playlistIndex !== undefined) {
     		if($routeParams.playlistIndex == -9999) {
     	    	 $scope.playlist = Playlist.getCurrentPlaylist();
     		} else {
 	    		$scope.currentPlaylistIndex = $routeParams.playlistIndex;
 	    		var tempPlaylist = ClipSearchResults.getPlaylist($scope.currentPlaylistIndex);
        		$scope.playlist= tempPlaylist;
     		}
     	}
    	 
    	Playlist.setCurrentPlaylist($scope.playlist);
    	
    	
    	$scope.userRated = false;
    	$scope.othersRated = false;
    	
    	$scope.userRatedClass = "color:green;";
    	$scope.otherRatedClass = "color:yellow;";
    	
    	if ($scope.playlist.userRating !== undefined && $scope.playlist.userRating > 0) {
    		$scope.userRated = true;
        	$scope.othersRated = false;
    	} else if ($scope.playlist.userRating !== undefined && $scope.playlist.usageData.avgRating > 0){
    		$scope.othersRated = true;
    		$scope.userRated = false;
    		$scope.playlist.userRating = $scope.playlist.usageData.avgRating;
    	} else {
    		$scope.userRated = false;
        	$scope.othersRated = false;
    	}
    	
    	$scope.convertDate = function(val) {
    		return moment(val, "YYYY-MM-DDThh:mm:ss.SSSZ").fromNow();
    	}
    	
		$scope.showhidePlaylistDetails = function(){
    		$scope.showmore = !$scope.showmore;
    	};
        	
    	 $scope.convert = function(val) {
    		 return Utility.formatTime(val/1000);
    	 };
    	 
		 $scope.loadPlaylistClips = function(playlist) {
    		if (playlist.clips == null || playlist.clips.length <= 0) {
    		   $http({
    					method: 'POST',
    					url:  "http://app.songwallah.com/sw/playlist.srvc",
    					data : {
    						o : "plgc",
    						pi  : playlist.ID
    					},
    					headers: {'Content-Type' : 'application/json'}
    			}).
    	       success(function(data, status) {
    	     	    playlist.clips = data.processedResults;
    	     	    Playlist.setClips(playlist.clips);
    	       })
    	       .error(function(data, status) {
    	           console.log("failed:" + data);         
    	       });
    		}
    	};
        	
    	$scope.loadPlaylistClips($scope.playlist);
    	
    	$scope.playFromPlaylist = function (index) {
    		Playlist.setCurrentIndex(index);
    		Radio.clearRadio();
    		$rootScope.nowPlaying = true;
    		//play the clip
    	    setTimeout(function () {
    	    		Player.getPlayer().doc = $document[0];
    	    		Player.getPlayer().play($scope.playlist.clips[index]);
    	    }, 500);
    	 }
    	 
     }])
      .controller('RadioDetailCtrl', ['$rootScope', '$scope', '$http', '$document', '$routeParams', 'Player', 'Playlist', 'Radio', 'ClipSearchResults', function ($rootScope, $scope, $http, $document, $routeParams, Player, Playlist, Radio, ClipSearchResults) {
    	 $scope.showmore = false;
    	 if ($routeParams.radioIndex !== undefined) {
     		if($routeParams.radioIndex == -9999) {
     	    	 $scope.radio = Radio.getCurrentRadio();
     		} else {
 	    		$scope.currentRadioIndex = $routeParams.radioIndex;
 	    		var tempRadio = ClipSearchResults.getRadio($scope.currentRadioIndex);
        		$scope.radio= tempRadio;
     		}
     	}
    	 
    	Radio.setCurrentRadio($scope.radio);
    	
    	$scope.userRated = false;
    	$scope.othersRated = false;
    	
    	$scope.userRatedClass = "color:green;";
    	$scope.otherRatedClass = "color:yellow;";
    	
    	if ($scope.radio.userRating !== undefined && $scope.radio.userRating > 0) {
    		$scope.userRated = true;
        	$scope.othersRated = false;
    	} else if ($scope.radio.usageData.avgRating > 0){
    		$scope.othersRated = true;
    		$scope.userRated = false;
    		$scope.radio.userRating = $scope.radio.usageData.avgRating;
    	} else {
    		$scope.userRated = false;
        	$scope.othersRated = false;
    	}
    	
    	$scope.convertDate = function(val) {
    		return moment(val, "YYYY-MM-DDThh:mm:ss.SSSZ").fromNow();
    	}
    	
		$scope.showhideRadioDetails = function(){
    		$scope.showmore = !$scope.showmore;
    	};
        	
    	$scope.convert = function(val) {
    		 return Utility.formatTime(val/1000);
    	};
    	         	
    	$scope.playRadio = function (index) {
    		Playlist.clearPlaylist();
    	    setTimeout(function () {
    	    		Player.getPlayer().doc = $document[0];
    	    		Player.getPlayer().play($scope.getNextRadioClip());
    	    }, 500);
    	};
    	
    	$scope.getNextRadioClip = function() {
    		$http({
				method: 'POST',
				url:  "http://app.songwallah.com/sw/radio.srvc",
				data : {
					r : $scope.radio.ID,
    				op : "nextclip",
    				d : 1,
    				e : "true"
				},
				headers: {'Content-Type' : 'application/json'}
    		})
		    .success(function(data, status) {
			   Radio.setCurrentIndex($scope.radio.ID);
			   $scope.clip = data.processedResults.clip;
 
	    	   $rootScope.nowPlaying = true;
	    	   //play the clip
	    	   setTimeout(function () {
	    	    		Player.getPlayer().doc = $document[0];
	    	    		Player.getPlayer().play($scope.clip);
	    	   }, 500);
	       })
	       .error(function(data, status) {
	           console.log("failed:" + data);         
	       });
    	};
     }])
     .controller('MyOptionsCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    	 
    	 $scope.gotoMyOption = function(selectedOption){
    		 
    		 switch(selectedOption)
    		 {
	    		 case 1 :
	    			 		$location.path('/myfavorites');
	    			 		break;
	    			 	
	    		 case 2 : 
	    			       break;
	    			       
	    		 case 3 : 
				       		break;
	    		 case 4 : 
				       		break;
	    		 case 5 : 
				       		break;
    		 }
    	 }
    	 
     }])
     .controller('MyFavoritesCtrl', ['$scope', '$rootScope', '$http', '$location', 'Playlist', function ($scope, $rootScope, $http, $location, Playlist) {
    	 
    	 $scope.init = function () {
    		   console.log(" Getting  my favorites from server");
    			$http({
    				method: 'POST',
    				url:  "http://app.songwallah.com/sw/sidebar.srvc",
    				data : {
    					t : "favorites",
    					start : 0,
    					len : 10,
    					'songwallah.user' : $rootScope.userId,
    					'songwallah.guest': $rootScope.dummyId
    				},
    				headers: {'Content-Type' : 'application/json'}
        		})
    		    .success(function(data, status) {
    		    	console.log(data);			
    				$scope.favoritesresults = data.processedResults;
    				// load coverarts
    				loadCoverArts($http, $scope.favoritesresults.clips, 0);
    	       })
    	       .error(function(data, status) {
    	           console.log("failed:" + data);         
    	       });
          }
    	 $scope.openfavorite = function(type, index){
    		 if(type == 'clip'){
    			 var index = Playlist.addToPlaylist($scope.favoritesresults.clips[index]);
    			 Playlist.setCurrentIndex(index);
    			 $location.path('/clips/-9999');
    			 
    		 }else  if (type == 'playlist'){
    			 Playlist.setCurrentPlaylist($scope.favoritesresults.playLists[index]);
    			 $location.path('/playlists/-9999');
    		 }
    	 }
    	  $scope.init();
     }]);

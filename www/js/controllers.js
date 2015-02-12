'use strict';


angular.module('swMobile.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', '$http', 'LocalClipStore', 'Player', 'Playlist', function ($scope, $rootScope, $window, $location, $http, LocalClipStore, Player, Playlist) {
    	
    	$rootScope.nowPlaying = false;	    
    	$rootScope.navButtonState = ["disabled", "disabled", "disabled", "disabled", "disabled"];
    	$rootScope.showNavBar = true;
        $scope.slide = '';
        $rootScope.url = 'http://app.songwallah.com/sw/clipfullsearch.srvc';
        
        $rootScope.loading = false;
		$rootScope.showclips = false;
		$rootScope.selectedgroup = "all";
		$rootScope.usersignedin = false;

   	 $rootScope.verifyUserSignInStatus = function (){
		 
     	$rootScope.userid = window.localStorage.getItem("songwallah.user");
     	if($rootScope.userid != undefined && $rootScope.userid != "" && $rootScope.userid.length > 0)
     	{
     			$rootScope.usersignedin = true;
     			$rootScope.username = window.localStorage.getItem("songwallah.user.name");
     			$rootScope.userprofilepic = window.localStorage.getItem("songwallah.user.profile.pic.url");
     			$rootScope.userType = window.localStorage.getItem("songwallah.user.type");
     			$rootScope.userRole = window.localStorage.getItem("songwallah.user.role");
     			$rootScope.fbHandle =	window.localStorage.getItem("songwallah.user.fb.uid");
     			$rootScope.fbLongTermCookie =	window.localStorage.getItem("songwallah.user.fb.longtermtoken");
     			$rootScope.userNickName = window.localStorage.getItem("songwallah.user.nickname");
     	}else {
     		$rootScope.usersignedin = false;
     		$rootScope.username = "";
     		$rootScope.userprofilepic = "";
     		$rootScope.userType = "";
     		$rootScope.userRole = "";
     		$rootScope.fbHandle =	"";
     		$rootScope.fbLongTermCookie =	"";
     		$rootScope.userNickName = "";
     	}
 		 
 	 }		

    	$rootScope.setupClip = function(clip, reset) {
    		$rootScope.clip = clip;
    		$rootScope.userRated = false;
    		$rootScope.othersRated = false;
        	
        	$rootScope.userRatedClass = "color:green;";
        	$rootScope.otherRatedClass = "color:yellow;";
        	
        	if ($rootScope.clip.userRating !== undefined && $rootScope.clip.userRating > 0) {
        		$rootScope.userRated = true;
        		$rootScope.othersRated = false;
        	} else if ($rootScope.clip.usageData.avgRating > 0){
        		$rootScope.othersRated = true;
        		$rootScope.userRated = false;
        		$rootScope.clip.userRating = $rootScope.clip.usageData.avgRating;
        	} else {
        		$rootScope.userRated = false;
        		$rootScope.othersRated = false;
        	}
        	// Utility.debug($scope.clip);
        	if (reset) {
        		$rootScope.minval = 0;
        		$rootScope.maxval = 100;
        		$rootScope.duration = 100;
        		$rootScope.currPos = 50;
        		$rootScope.played = "";
        		$rootScope.playpausecmd = "Play";    
        		$rootScope.showmore = false;
        		$rootScope.$apply();
        	
	        	setTimeout(function () {
	        		//Player.getPlayer().doc = $document[0];
	        		Player.getPlayer().play($scope.clip, $http);
	            }, 500);
	        	$rootScope.nowPlaying = false;
        	}
    	};

		$rootScope.playClip = function(clip, playNow) {
			Utility.debug("rootScope.playClip:" + JSON.stringify(clip));
			
	    	// play the clip
	    	setTimeout(function () {
				Utility.debug("rootScope.playClip.setTimeout(), playNow=" + playNow);
	    		if (playNow) {
					Utility.debug("rootScope.playClip.playNow=true");
	    			//Player.getPlayer().doc = $document[0];
	    			Player.getPlayer().stop();
	    			Player.getPlayer().play(clip, $http);
	    			if (clip.currentPos !== undefined && clip.currentPos > 0) {
	    				Player.getPlayer().seekTo(clip.currentPos);
	    			}
	    			$rootScope.nowPlaying=true;
	    		}
	        }, 500);
    	};
    	
    	
        $rootScope.back = function() {
          $scope.slide = 'slide-right';
          $window.history.back();
        }
        $rootScope.go = function(path){
          $scope.slide = 'slide-left';
          $location.url(path);
        }

    	$rootScope.convertDate = function(val) {
    		return moment(val, "YYYY-MM-DDThh:mm:ss.SSSZ").fromNow();
    	}
        
    	$rootScope.formatTime = function(time){
    		return Utility.formatTime(time);
    	}
    	
    	    

        $scope.navigateTo = function(pageId){
        	
        	switch(pageId){
        	case 1:
        				$location.path('/explore');
        				break;
        	case 2:
        				$location.path('/record');
    					break;
        	case 3:
        				$location.path('/clipsearch');
        				break;
        	case 4 :
        				$location.path('/myoptions');
        				break;
        	case 5 : 
						$location.path("/settings");
						break;        				
        	}
        }
        
        
   	$rootScope.swcloudavailable = true;
   	$rootScope.swcloudenabled = true;
   	
   	$rootScope.checkSWCloudSearchAvaibility = function() {
    	 $http({
				method: 'POST',
				url: $rootScope.url,
				data : Utility.enhanceDataForServiceCall({
					op: "ping"
				}),
				headers: {'Content-Type' : 'application/json'}
		}).
       success(function(data, status) {
    	   if (data != null) {
    		   if (data == "true") {
    			   $rootScope.swcloudavailable = true;
    		   } else {
    			   $rootScope.swcloudavailable = false;
    		   }
    	   }
       })
       .error(function(data, status) {
    	   $rootScope.swcloudavailable = false;
       });
     }
     
     //this function is invoked when user clicks on the sw cloud icon
     $rootScope.checkcloud = function(){
    	 /* 
    	 if(swclouddisabled icon displayed){
    		 check cloud availability - call service to check elastic search availability
    		 if available
    		   prompt user confirmation to enable cloud
    		   else 
    			   msg box user  cloud not available
    	
    	 }else, i.e. sw cloud enabled icon displayed 
    		 
    		 prompt user conformation to disable cloud
    	 }
           */
    	 if ($scope.swcloudenabled) {
    		 var disableCloud = window.confirm("Do you want turn off Songwallah cloud search?");
			 if (disableCloud == "true") {
				 $rootScope.swcloudenabled = false;
			 }
    	 } else {
        	 $rootScope.checkSWCloudSearchAvaibility();
    		 if ($rootScope.swcloudavailable) {
    			 var enableCloud = window.confirm("Do you want to turn on Songwallah cloud search?");
    			 if (enableCloud == "true") {
    				 $rootScope.swcloudenabled = true;
    			 } else {
    				 $rootScope.swcloudenabled = false;
    			 }
    		 } else {
    			 window.alert("Songwallah cloud is not available :(");
    		 }
    	 }
     }
     
     $rootScope.deleteLocalClip = function(clipId) {
 	 	//let's remove the clip data from WebSQL, LocalStorage
 	 	LocalClipStore.deleteClip(clipId);
 		window.localStorage.removeItem("clip:" + clipId);
			
			//let's remove the clip from local file system
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				Utility.debug("fileSystem:" + fileSystem.name);
				fileSystem.root.getDirectory("sw", {create:false, exclusive: false}, function(swDir) {
						Utility.debug("sw dir:" + swDir.name);
						swDir.getDirectory("clip", {create: false, exclusive: false}, function (clipDir) {
							Utility.debug("clip dir:" + clipDir.name);
							clipDir.getFile(clipId + ".mp3", {create: false, exclusive: true}, function(clipFileEntry) {
								clipFileEntry.remove(function() {
									Utility.debug("successfully deleted file:" + clipId + ".mp3");
								}, function(failure) {
									Utility.debug("couldn't delete file:" + clipId + ".mp3");
								});
							}, function(failure) {
								Utility.debug("couldn't get file");
							});
						}, function(failure) {
							Utility.debug("couldn't get directory clip dir");
						});
					}, function(failure) {
						Utility.debug("couldn't get sw dir");
					});
				}, function(failure) {
					Utility.debug("couldn't get file system");
				});
     	}

 	Player.getPlayer().addListener("change", function() {
    	$rootScope.minval = Player.getPlayer().min;
    	$rootScope.maxval = Player.getPlayer().max;
    	$rootScope.duration = Player.getPlayer().duration;
    	$rootScope.currPos = Player.getPlayer().currPos;
    	$rootScope.played = Player.getPlayer().played;
    	$rootScope.playpausecmd = Player.getPlayer().playpausecmd;    	
    	$rootScope.$apply();   
        
        //TODO save the position in local storage
    	var tempClip = Playlist.getClip(Playlist.getCurrentIndex());
    	//tempClip.currentPos = $rootScope.currPos;
        window.localStorage.setItem("currentClipId", tempClip.ID);
        window.localStorage.setItem("currentClipPos", $rootScope.currPos);
    });
	
	Player.getPlayer().addListener("ended", function() {
		Utility.debug("Play ended, current playlist length:" + Playlist.getClips().length);
		if (Playlist.getCurrentPlaylist() != null) {
			$rootScope.setupClip(Playlist.getNextClip(), true);
			$rootScope.playClip($rootScope.clip, true);
		}
		else if (Radio.getCurrentRadio() != null) {
			setupClip(Radio.getNextClip(), true);
			$rootScope.playClip($rootScope.clip, true);
		}
		Utility.debug("Play ended, current playlist length:" + Playlist.getClips().length);
    });

     Playlist.loadCurrentPlaylistFromLocal();
     var lastClipId =window.localStorage.getItem("currentClipId"); 
     if ( lastClipId != null) {
    	 var tempClip = Playlist.getClip(Playlist.getCurrentIndex());
    	 if (tempClip != null && tempClip.ID == lastClipId) {
    		 if (window.localStorage.getItem("currentClipPos") != null) {
    			 try { 
    			 	tempClip.currentPos = parseInt(window.localStorage.getItem("currentClipPos"));
    			 } catch(error) {
    				 tempClip.currentPos = 0;
    			 }
    		 }
    		 $rootScope.playClip(tempClip);
    	 }
     }
    }])
     .controller('FeaturedPlaylistsCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    	
    	 // remove other highlights
    	 $rootScope.showNavBar = false;
    	 $scope.resultsStart = 0;
    	 $scope.featuredPlaylists= new Array();
    	 
    	 $scope.url = 'http://app.songwallah.com/sw/cliplist.srvc';
    	     	 
    	 $scope.openPlaylist = function(index) {
			 Playlist.setCurrentPlaylist($scope.featuredPlaylists[index]);
			 $location.path('/playlists/-9999');
    	 }
    	 
    	 $scope.loadLatestClips = function() {
    		 $http({
    				method: 'POST',
					url: "http://app.songwallah.com/sw/playlist.srvc",
					data : Utility.enhanceDataForServiceCall({
						o : "getfea",
	    				f : $scope.resultsStart,
	    				l : 10
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	            $scope.featuredPlaylists = $scope.featuredPlaylists.concat(data.processedResults.playlists);
	            
	            $scope.resultsStart = $scope.featuredPlaylists.length;
	       })
	       .error(function(data, status) {
	           //$scope.data = data || "Request failed";
	           //$scope.status = status;
	    	   Utility.debug("loading featured playlists failed:" + status);
	       });
    	 };
    	
    	 $scope.loadMore = function() {
    		 $scope.loadFeaturedPlaylists();
    	 };
    	 
    	 
    	 $scope.loadFeaturedPlaylists();
         
    }])
     .controller('LatestUploadsCtrl', ['$scope', '$rootScope', '$http','Playlist', function ($scope, $rootScope, $http, Playlist) {
    	
    	 // remove other highlights
    	 $rootScope.showNavBar = false;
    	 $scope.resultsStart = 0;
    	 $scope.latestClips= new Array();
    	 
    	 $scope.url = 'http://app.songwallah.com/sw/cliplist.srvc';
    	     	 
    	 $scope.openClip = function(index) {
			 var ind= Playlist.addToPlaylist($scope.latestClips[index]);
			 Playlist.setCurrentIndex(ind);
			 $location.path('/clips/-9999');
    	 }
    	 
    	 $scope.loadLatestClips = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/cliplist.srvc",
					data : Utility.enhanceDataForServiceCall({
						c :'',
			 			l : '',
			 			g : '',
			 			start : $scope.resultsStart,
			 			len : 10,
			 			s : true
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	    	    var temp = $scope.latestClips.length;
	            $scope.latestClips = $scope.latestClips.concat(data.processedResults.clips);
	            
	            if ($scope.latestClips != null && $scope.latestClips.length > 0)
	            	Utility.loadCoverArts($http, $scope.latestClips, temp);
	            
	            $scope.resultsStart = $scope.latestClips.length;
	       })
	       .error(function(data, status) {
	           //$scope.data = data || "Request failed";
	           //$scope.status = status;
	    	   Utility.debug("loading latest clips failed:" + status);
	       });
    	 };
    	
    	 $scope.loadMore = function() {
    		 $scope.loadLatestClips();
    	 };
    	 
    	 
    	 $scope.loadLatestClips();
         
    }])
    .controller('ExploreCtrl', ['$scope', '$rootScope', '$http', '$location', 'Playlist', 'LocalClipStore', function ($scope, $rootScope, $http, $location, Playlist, LocalClipStore) {
    	
    	 // remove other highlights
    	 $rootScope.showNavBar = true;
    	 $rootScope.navButtonState = ["active", "disabled", "disabled", "disabled", "disabled"];
        
    	 $scope.latestClips = new Array();

    	 $scope.recentClips = new Array();
    	 
    	 $scope.recentradios = new Array();
    	 
    	 $scope.recentPlaylists = new Array();
    	 
    	 //TODO call this method when the controller starts
    	 $scope.loadNowPlaying = function() {
    		//load the current playlist
    		Playlist.loadCurrentPlaylistFromLocal();
    		if (Playlist.getCurrentPlaylist() != null)
    			$location.path('/clips/-9999');
              
    	 };
    	 
    	 $scope.loadRecentClips = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/sidebar.srvc",
					data : Utility.enhanceDataForServiceCall({
						t : "recentclips",
						n : 5
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	            
	    	   var remoteRecentClips = new Array();
	    	   if(data.processedResults !== undefined && data.processedResults.clips !== undefined) {
		    	   for (var i = 0; i < data.processedResults.clips.length; i++) {
		    		   remoteRecentClips.push({clipData : data.processedResults.clips[i], ts: data.processedResults.timeStamps[i]});
		    	   }
	
		    	   var localRecentClips = JSON.parse(window.localStorage.getItem("recentclips"));
		    	   
		    	   //let's merge with local clips and eliminate dups, sort by timestamp and grab 5
		           if (localRecentClips != null) {
			    	   var mergedClips = localRecentClips.concat(remoteRecentClips);
			    	   mergedClips.sort(function(a, b){
			    		   var tsA=a.ts, tsB=b.ts;
			    		   if (tsA < tsB) //sort string ascending
			    		    return -1; 
			    		   if (tsA > tsB)
			    		    return 1;
			    		   return 0; //default return value (no sorting)
			    		  });
			    	   
			    	    var totalClipsNeeded = 5;
			    	   	for (var i = 0; i< mergedClips.length; i++) {
			    	   		if ($scope.recentClips.filter(function(elem) {return elem.clipData.ID == mergedClips.clipData.ID;}).length() > 0) {
			    	   			//don't add, its already there
			    	   		} else {
			    	   			$scope.recentClips.push(mergedClips[i]);
			    	   			if ($scope.recentClips.length >= totalClipsNeeded) {
			    	   				break;
			    	   			}
			    	   		}	    	   		
			    	   	}
		           } else {
		        	   $scope.recentClips = remoteRecentClips;
		           }
		           
		            if ($scope.recentClips != null && $scope.recentClips.length > 0)
		            	Utility.loadCoverArts($http, $scope.recentClips, 0);
	    	   }
	       })
	       .error(function(data, status) {
	           //$scope.data = data || "Request failed";
	           //$scope.status = status;
	    	   Utility.debug("loading latest clips failed:" + status);
	       });
    	 };


    	 $scope.loadRecentRadios = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/radio.srvc",
					data : Utility.enhanceDataForServiceCall({
						op : "recentradios",
						s : 0,
						l : 10
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	    	   if (data.processedResults !== undefined) {
	    		   $scope.recentradios = data.processedResults;
	    	   }
	       })
	       .error(function(data, status) {
	    	   Utility.debug("loading latest radios failed:" + status);
	       });
    	 };

    	 
    	 $scope.loadRecentPlaylists = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/sidebar.srvc",
					data : Utility.enhanceDataForServiceCall({
						t : "recentplaylists",
						n : 5
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	            
	    	   var remoteRecentPlaylists = new Array();
	    	   //recentplaylists = data.processedResults;
	    	   
	    	   if(data.processedResults != undefined && data.processedResults != null && 
	    			   data.processedResults.playLists != undefined && data.processedResults.playLists != null ){
		    	   for (var j = 0; j < data.processedResults.playLists.length; j++) {
		    		   remoteRecentPlaylists.push({playlistData : data.processedResults.playLists[j], ts: data.processedResults.timeStamps[j]});
		    	   }
	    	   }

	    	   var localRecentPlaylists = JSON.parse(window.localStorage.getItem("recentplaylists"));
	    	   
	    	   //let's merge with local clips and eliminate dups, sort by timestamp and grab 5
	           if (localRecentPlaylists != null) {
		    	   var mergedPlaylists = localRecentPlaylists.concat(remoteRecentPlaylists);
		    	   mergedPlaylists.sort(function(a, b){
		    		   var tsA=a.ts, tsB=b.ts;
		    		   if (tsA < tsB) //sort string ascending
		    		    return -1; 
		    		   if (tsA > tsB)
		    		    return 1;
		    		   return 0; //default return value (no sorting)
		    		  });
		    	   
		    	    var totalPlaylistsNeeded = 5;
		    	   	for (var i = 0; i< mergedPlaylists.length; i++) {
		    	   		if ($scope.recentPlaylists.filter(function(elem) {return elem.playlistData.ID == mergedClips.playlistData.ID;}).length() > 0) {
		    	   			//don't add, its already there
		    	   		} else {
		    	   			$scope.recentPlaylists.push(mergedPlaylists[i]);
		    	   			if ($scope.recentPlaylists.length >= totalPlaylistsNeeded) {
		    	   				break;
		    	   			}
		    	   		}	    	   		
		    	   	}
	           } else {
	        	   $scope.recentPlaylists = remoteRecentPlaylists;
	           }
	       })
	       .error(function(data, status) {
	    	   Utility.debug("loading latest playlists failed:" + status);
	       });
    	 };

    	 $scope.loadLatestClips = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/cliplist.srvc",
					data : Utility.enhanceDataForServiceCall({
						c :'',
			 			l : '',
			 			g : '',
			 			start : 0,
			 			len : 10,
			 			s : true
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	            $scope.latestClips = data.processedResults.clips;
	            if ($scope.latestClips != null && $scope.latestClips.length > 0)
	            	Utility.loadCoverArts($http, $scope.latestClips, 0);
	       })
	       .error(function(data, status) {
	           //$scope.data = data || "Request failed";
	           //$scope.status = status;
	    	   Utility.debug("loading latest clips failed:" + status);
	       });
    	 };
    	 
    	 $scope.loadFeaturedPlaylists = function() {
    		 $http({
					method: 'POST',
					url: "http://app.songwallah.com/sw/playlist.srvc",
					data : Utility.enhanceDataForServiceCall({
						o : "getfea",
	    				f : 0,
	    				l : 10
					}),
					headers: {'Content-Type' : 'application/json'}
			}).
	       success(function(data, status) {
	    	    if(data != null && data.processedResults != null && data.processedResults.playLists != null && data.processedResults.playLists != undefined)
	    	    	$scope.featuredPlaylists = data.processedResults.playLists;
	            
	       })
	       .error(function(data, status) {
	           //$scope.data = data || "Request failed";
	           //$scope.status = status;
	    	   Utility.debug("loading featured playlists failed:" + status);
	       });
    	 };
    	 
    	 
    	 
    	 
    	 $scope.openLatest = function(index) {
			 var ind = Playlist.addToPlaylist($scope.latestClips[index]);
			 Playlist.setCurrentIndex(ind);
			 $location.path('/clips/-9999');
    	 }
    	
    	 $scope.openRecentClip = function(index) {
			 var ind = Playlist.addToPlaylist($scope.recentClips[index].clipData);
			 Playlist.setCurrentIndex(ind);
			 $location.path('/clips/-9999');
    	 }

    	 $scope.openFeatured = function(index) {
			 Playlist.setCurrentPlaylist($scope.featuredPlaylists[index]);
			 $location.path('/playlists/-9999');
    	 }
    	 
    	 $scope.openRecentPlaylist = function(index) {
			 Playlist.setCurrentPlaylist($scope.recentPlaylists[index].playlistData);
			 $location.path('/playlists/-9999');
    	 }
    	 
    	 //fire up load methods
    	 $scope.loadLatestClips();
    	 $scope.loadRecentClips();
    	 $scope.loadRecentRadios();
    	 $scope.loadRecentPlaylists();
    	 $scope.loadFeaturedPlaylists();

    }])
    .controller('ClipListCtrl', ['$scope', '$rootScope', '$http', 'ClipSearchResults', 'Playlist', function ($scope, $rootScope, $http, ClipSearchResults, Playlist) {
    	
    	 // remove other highlights
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
    	 
    	 $scope.isPlaying = function(clipId){
    		 return Playlist.isClipPlaying(clipId);
    	 }
    	 
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
    	 
    	 $scope.loadMore = function() {
    		 $scope.loadClips();
    	 };
    	 
    	 $scope.loadClips = function() {
    		 $http({
					method: 'POST',
					url: $scope.url,
					data : Utility.enhanceDataForServiceCall({
						searchterm: ClipSearchResults.getLastSearchTerm(),
						start: ClipSearchResults.getResultsStart(),
						len: ClipSearchResults.getResultsLen(),
						f: $rootScope.selectedfilter
					}),
					headers: {'Content-Type' : 'application/json'}
					//headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
			}).
	       success(function(data, status) {
	     	    $scope.status = status;
	     	    if (data.processedResults !== undefined && data.processedResults.clips !== undefined) {
		            $scope.clips = $scope.clips.concat(data.processedResults.clips);
		            $scope.playlists = $scope.playlists.concat(data.processedResults.playLists);
		            $scope.radios = $scope.radios.concat(data.processedResults.radios);
		            ClipSearchResults.setClips($scope.clips);
		            ClipSearchResults.setPlaylists($scope.playlists);
		            ClipSearchResults.setRadios($scope.radios);
		            if ($scope.clips != null && $scope.clips.length > 0)
		            	Utility.loadCoverArts($http,  $scope.clips, ClipSearchResults.getResultsStart());
		            ClipSearchResults.setResultsStart(ClipSearchResults.getResultsLen() + data.processedResults.clips.length);
	     	    }
	       })
	       .error(function(data, status) {
	           $scope.data = data || "Request failed";
	           $scope.status = status;         
	       });
    	 };
    	 
         $scope.clipSearch = function() {
        	 ClipSearchResults.setLastSearchTerm($scope.searchTerm);
        	 ClipSearchResults.resetSearch();
        	 $scope.clips = new Array();
        	 ClipSearchResults.setResultsStart(0);
             $scope.loadClips();
         };

         $scope.checkSWCloudSearchAvaibility();
         
    }])
    .controller('LocalClipListCtrl', ['$scope', '$rootScope', '$http', 'LocalClipStore', 'Playlist', function ($scope, $rootScope, $http, LocalClipStore, Playlist) {
    	
    	 // remove other highlights
    	 $rootScope.showNavBar = true;
    	 $rootScope.navButtonState = ["disabled", "disabled", "active", "disabled", "disabled"];
        
    	 var filter=$rootScope.selectedfilter === undefined ? 2 : $rootScope.selectedfilter;
    	 $rootScope.selectedfilter = filter;
    	 $scope.headeritemstyle=[(filter == 2 ? "with" : "no") + "border", (filter == 3 ? "with" : "no") + "border" ,(filter == 4 ? "with" : "no") + "border"];
    	 
    	 $scope.downloadedClips = new Array();
    	 
    	 LocalClipStore.getAllClips($scope);
    	 
    	 //TODO enable this after implementing saving playlists locally
    	 //$scope.playlists= ClipSearchResults.getPlaylists();
    	 
    	 $scope.isPlaying = function(clipId){
    		 return Playlist.isClipPlaying(clipId);
    	 }

    	 /*
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
    	 */
    	 
         $scope.checkSWCloudSearchAvaibility();
         
    }])
    .controller('ClipDetailCtrl', ['$rootScope', '$scope', '$document', '$routeParams', '$http', 'ClipSearchResults', 'Player', 'Playlist', 'Radio', 'LocalClipStore', function ($rootScope, $scope, $document, $routeParams, $http, ClipSearchResults, Player, Playlist, Radio, LocalClipStore) {
    	 // load clip
    	
    	Utility.debug("In clip detail load, clipindex:" + $routeParams.clipIndex);
    	Player.getPlayer().doc = $document[0];
    	$rootScope.showNavBar = false;
    	$rootScope.minval = 0;
    	$rootScope.maxval = 100;
    	$rootScope.duration = 100;
    	$rootScope.currPos = 50;
    	$rootScope.played = "";
    	$rootScope.showmore = false;
    	   	
    	$scope.showhideClipDetails = function(){
    		$scope.showmore = !$scope.showmore;
    	};
    	
    	
    	$scope.playPauseClick = function() {
    		Utility.debug("In play pause click method");    		
    		if ($scope.playing) {
    			Player.getPlayer().pause();
    			$scope.playing = false;
    		}
    		else {
    			Player.getPlayer().resume();
    			$scope.playing = true;
    		}
    	};
    	
    	$scope.downloadClip = function() {
    		
    		//these 2 lines are temporarily here for testing with emulate.phonegap.com (ripple plugin on google chrome is required for this testing)
    		
    		window.localStorage.setItem("clip:" + $scope.clip.ID, JSON.stringify($scope.clip));
			LocalClipStore.saveClip($scope.clip);
    		
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				Utility.debug("fileSystem:" + fileSystem.name);
				fileSystem.root.getDirectory("sw", {create:true, exclusive: false}, function(swDir) {
						Utility.debug("sw dir:" + swDir.name);
						swDir.getDirectory("clip", {create: true, exclusive: false}, function (clipDir) {
							Utility.debug("clip dir:" + clipDir.name);
							clipDir.getFile($scope.clip.ID + ".mp3", {create: true, exclusive: true}, function(newFileEntry) {
								new FileTransfer().download(encodeURI($scope.clip.url), newFileEntry.toURL(), function(success){
									Utility.debug("downloaded successfully:" + newFileEntry.toURL());
									window.localStorage.setItem("clip:" + $scope.clip.ID, JSON.stringify($scope.clip));
									LocalClipStore.saveClip(clip);
									Utility.debug("saved clip details locally:" + $scope.clip.ID);
								}, function(failure) {
									Utility.debug("couldn't download:" + newFileEntry.toURL());
								});
							}, function(failure) {
								Utility.debug("couldn't get file");
							});
						}, function(failure) {
							Utility.debug("couldn't get directory clip dir");
						});
					}, function(failure) {
						Utility.debug("couldn't get sw dir");
					});
				}, function(failure) {
					Utility.debug("couldn't get file system");
				});
            
            //new FileManager().download_file($scope.clip.url,'sw/clip',$scope.clip.ID + '.mp3',Log('downloaded sucess ' + $scope.clip.ID));
    	}
    	$scope.shareClip = function() {
    		//https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin for all the available options
    		//window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')
    		var message = $scope.clip.title + "(" + $scope.clip.album + ")";
    		var subject = window.localStorage.getItem("songwallah.user.name") + " shared a clip with you on Songwallah";
    		var image = "http://www.songwallah.com/sw/images/swlogo.png";
    		var link = "http://www.songwallah.com/sw/html/index.html?c=" + $scope.clip.ID;
    		window.plugins.socialsharing.share(message, subject, image, link);
    	};

    	
    	/*Player.getPlayer().addListener("changeplaypause", function(detail) {
    		Utility.debug("change play pause event");
    		//if (Play.getPlayer().isPlaying)
    		//$scope.playcmdimage = "img/header" + detail.image + "white.png";
    	});*/
        
    	
    	//controller code
    	var playNow = false;
    	Utility.debug("start logic:" + $routeParams.clipIndex);
    	if ($routeParams.clipIndex !== undefined) {
    		if($routeParams.clipIndex == -9999) {
    			//TODO check whether clicking on a clip will stop playing the currently playing clip, we need to add to playlist 
    			//not stop the current play. "Play All" or "Play Playlist" or "Play Radio" are the only functions which will stop current play and play 
    			//new clips
    			
    			if (Playlist.getCurrentPlaylist() !=null) {
    				$rootScope.clip = Playlist.getClip(Playlist.getCurrentIndex());
    				if (!$rootScope.nowPlaying)
    					playNow = true;
    				// $rootScope.nowPlaying = true;
    			}
    			else if (Radio.getCurrentRadio !=null) {
    				$rootScope.clip = Radio.getClip();
    				// $rootScope.nowPlaying = true;
    				if (!$rootScope.nowPlaying)
    					playNow = true;
    			}
    			else {
    				$rootScope.clip = null;
    				$rootScope.nowPlaying = false;
    			}
    		} else if($routeParams.clipIndex == -9997){ // prev
    			// move within the currently loaded playlist
    			$rootScope.clip = Playlist.getPrevClip();
    			if (!$rootScope.nowPlaying)
					playNow = true;    		
    			} else if ($routeParams.clipIndex == -9998){ // next
    			$rootScope.clip = Playlist.getNextClip();
    			if (!$rootScope.nowPlaying)
					playNow = true;
    			} else {
	    			var currentClipIndex = $routeParams.clipIndex;
		    		var tempClip = ClipSearchResults.getClip(currentClipIndex);
		        	var index = Playlist.addToPlaylist(tempClip);
		        	if (!$rootScope.nowPlaying) {
		        		$rootScope.clip = tempClip;
		        		Playlist.setCurrentIndex(index);    
		        		playNow = true;
		        	}
		        	Utility.debug("clip to load:" + JSON.stringify(tempClip) + " playNow=" + playNow + " $rootScope.nowPlaying=" + $rootScope.nowPlaying);
    			}
    		}
    	
	    	$scope.userRated = false;
	    	$scope.othersRated = false;
	    	
	    	$scope.userRatedClass = "color:green;";
	    	$scope.otherRatedClass = "color:yellow;";
	    	
	    	if($scope.clip != undefined && $scope.clip != null){
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
	    	}	    	
	    	Utility.debug("$rootScope.playNow=" + playNow);
	    	LocalClipStore.determineClipLocation($rootScope.clip);
	    	$rootScope.playClip($rootScope.clip, playNow);
    }])
     .controller('PlaylistDetailCtrl', ['$rootScope', '$scope', '$http', '$document', '$routeParams', '$location', 'Player', 'Playlist', 'Radio', 'ClipSearchResults', function ($rootScope, $scope, $http, $document, $routeParams, $location, Player, Playlist, Radio, ClipSearchResults) {
    	 
    	 $scope.backToNowPlaying = function() {
    		 $location.path('/clips/-9999');
    	 };
    	 
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
    	
    	$scope.showSavePlaylist = false;
    	$scope.playlistKeywords = "";
    	$scope.playlistTitle = "";
    	$scope.playlistDesc = "";
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
    					data : Utility.enhanceDataForServiceCall({
    						o : "plgc",
    						pi  : playlist.ID
    					}),
    					headers: {'Content-Type' : 'application/json'}
    			}).
    	       success(function(data, status) {
    	     	    playlist.clips = data.processedResults;
    	     	    Playlist.setClips(playlist.clips);
    	       })
    	       .error(function(data, status) {
    	           Utility.debug("failed:" + data);         
    	       });
    		}
    	};
        	
    	$scope.loadPlaylistClips($scope.playlist);
    	
    	$scope.playFromPlaylist = function (index) {
    		Playlist.setCurrentIndex(index);
    		Radio.clearRadio();
    		$rootScope.nowPlaying = true;
    		// play the clip
    	    setTimeout(function () {
    	    		//Player.getPlayer().doc = $document[0];
    	    		Player.getPlayer().play($scope.playlist.clips[index], $http);
    	    }, 500);
    	 }
    	 
    	$scope.deletePlaylistClip = function(index) {
    		Playlist.deleteClip(index);
    	}
    	
    	$scope.deleteAllPlaylistClips = function(index) {
    		Playlist.clearPlaylistClips();
    	}
    	
    	$scope.savePlaylist = function() {
    		var clip = "";
    		var clips = Playlist.getClips();
    		for (var x=0;x<clips.length;x++) {
    			clip += clips[x].ID + ",";
    		}
    		$http({
				method: 'POST',
				url:  "http://app.songwallah.com/sw/playlist.srvc",
				data : Utility.enhanceDataForServiceCall({
					o : "cpl",
					pln : $scope.playlistTitle,
					eu : "everyone",
					vu : "everyone",
					pld : $scope.playlistDesc,
					plk : $scope.playlistKeywords,
					c : clip
				}),
				headers: {'Content-Type' : 'application/json'}
    		})
		    .success(function(data, status) {
		    	Utility.debug("Playlist " + $scope.playlistTitle + " saved");
			   $scope.showSavePlaylist = false;
			   $scope.playlist = data.processedResults;
	       })
	       .error(function(data, status) {
	           Utility.debug("failed:" + data);         
	       });
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
    	// TODO enable the start recording button only after title and
		// description are entered
    	 
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
    	    		//Player.getPlayer().doc = $document[0];
    	    		Player.getPlayer().play($scope.getNextRadioClip(), $http);
    	    }, 500);
    	};
    	
    	$scope.getNextRadioClip = function() {
    		$http({
				method: 'POST',
				url:  "http://app.songwallah.com/sw/radio.srvc",
				data : Utility.enhanceDataForServiceCall({
					r : $scope.radio.ID,
    				op : "nextclip",
    				d : 1,
    				e : "true"
				}),
				headers: {'Content-Type' : 'application/json'}
    		})
		    .success(function(data, status) {
			   Radio.setCurrentIndex($scope.radio.ID);
			   $scope.clip = data.processedResults.clip;
 
	    	   $rootScope.nowPlaying = true;
	    	   // play the clip
	    	   setTimeout(function () {
	    	    		//Player.getPlayer().doc = $document[0];
	    	    		Player.getPlayer().play($scope.clip, $http);
	    	   }, 500);
	       })
	       .error(function(data, status) {
	           Utility.debug("failed:" + data);         
	       });
    	};
     }])
     .controller('MyOptionsCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    	 
    	 $rootScope.showNavBar = true;
    	 $rootScope.navButtonState = ["disabled", "disabled", "disabled", "active",  "disabled"];
    	 
    	 
    	 $scope.gotoMyOption = function(selectedOption){
    		 if (selectedOption != 5 && !$rootScope.usersignedin) {
    			 $location.path('/settings');
    		 } else {
	    		 switch(selectedOption)
	    		 {
		    		 case 1 :   $location.path('/myfavorites');
		    			 		break;
		    		 case 2 :   $location.path('/myplaylists');
		    			        break;
		    		 case 3 :   $location.path('/myradios');
					       		break;
		    		 case 4 : 
					       		$location.path('/myrecordings');
		    			 		break;
		    		 case 5 : 
		    			 		$location.path('/mydevice');
		    			 		break;
	    		 }
    		 }
    	 }
    	 
    	 //actual logic
    	 $rootScope.verifyUserSignInStatus();
     }])
     .controller('MyFavoritesCtrl', ['$scope', '$rootScope', '$http', '$location', 'Playlist', function ($scope, $rootScope, $http, $location, Playlist) {
    	 
    	 $scope.startfav = 0;
    	 $scope.len = 10;
    	 $scope.favoritesresults = new Object();
    	 $scope.favoritesresults.clips = new Array();
    	 $scope.favoritesresults.playLists = new Array();
    	 $rootScope.showNavBar = true;
    	 
    	 $scope.loadFavorites = function () {
    		   Utility.debug(" Getting  my favorites from server");
    			$http({
    				method: 'POST',
    				url:  "http://app.songwallah.com/sw/sidebar.srvc",
    				data : Utility.enhanceDataForServiceCall({
    					t : "favorites",
    					start : $scope.startfav,
    					len : $scope.len,
    					'songwallah.user' : $rootScope.userId,
    					'songwallah.guest': $rootScope.dummyId
    				}),
    				headers: {'Content-Type' : 'application/json'}
        		})
    		    .success(function(data, status) {
    		    	Utility.debug(data);			
    				if(data.processedResults != undefined && data.processedResults.clips != undefined)
    					$scope.favoritesresults.clips = $scope.favoritesresults.clips.concat(data.processedResults.clips);
    					$scope.startfav += data.processedResults.clips.length;
    				if(data.processedResults != undefined && data.processedResults.playLists != undefined)
    					$scope.favoritesresults.playLists = $scope.favoritesresults.playLists.concat(data.processedResults.playLists);
    					$scope.startfav += data.processedResults.playLists.length;
    				// load coverarts
    					Utility.loadCoverArts($http, $scope.favoritesresults.clips, 0);
    	       })
    	       .error(function(data, status) {
    	           Utility.debug("failed:" + data);         
    	       });
          }
    	 $scope.openfavorite = function(type, index){
    		 if(type == 'clip'){
    			 var ind = Playlist.addToPlaylist($scope.favoritesresults.clips[index]);
    			 //Playlist.setCurrentIndex(ind);
    			 $location.path('/clips/-9999');
    			 
    		 }else  if (type == 'playlist'){
    			 Playlist.setCurrentPlaylist($scope.favoritesresults.playLists[index]);
    			 $location.path('/playlists/-9999');
    		 }
    	 }
    	 $scope.loadMoreFavorites = function(){
    		 $scope.loadFavorites();
    	 }
    	 
    	  $scope.loadFavorites();
     }])
	 .controller('MyRecordingsCtrl', ['$scope', '$rootScope', '$http', '$location', 'Playlist', function ($scope, $rootScope, $http, $location, Playlist) {
    	 
    	 $scope.startrec = 0;
    	 $scope.len = 10;
    	 $scope.recordingsresults = new Object();
    	 $scope.recordingsresults.clips = new Array();
    	 $rootScope.showNavBar = true;
    	 $scope.recentFirst = true;
    	 
    	 $scope.loadRecordings = function () {
    		   Utility.debug(" Getting  my recordings from server");
    			$http({
    				method: 'POST',
    				url:  "http://app.songwallah.com/sw/clipaccess.srvc",
    				data : Utility.enhanceDataForServiceCall({
    					op : "recordings",
    					start : $scope.startrec,
    					len : $scope.len,
    					recentfirst : $scope.recentFirst,
    					'songwallah.user' : $rootScope.userId,
    					'songwallah.guest': $rootScope.dummyId
    				}),
    				headers: {'Content-Type' : 'application/json'}
        		})
    		    .success(function(data, status) {
    		    	Utility.debug(JSON.stringify(data));			
    				if(data.processedResults != undefined && data.processedResults.clips != undefined)
    					$scope.recordingsresults.clips = $scope.recordingsresults.clips.concat(data.processedResults.clips);
    					$scope.startrec += data.processedResults.clips.length;
    				// load coverarts
    					Utility.loadCoverArts($http, $scope.recordingsresults.clips, 0);
    	       })
    	       .error(function(data, status) {
    	           Utility.debug("failed:" + data);         
    	       });
          }
    	 $scope.openrecording = function(index){
    			 var ind = Playlist.addToPlaylist($scope.recordingsresults.clips[index]);
    			 $location.path('/clips/-9999');
    	 }
    	 $scope.loadMoreRecordings = function(){
    		 $scope.loadRecordings();
    	 }
    	 
    	  $scope.loadRecordings();
     }])	
     .controller('RecordAudioCtrl', ['$scope', '$rootScope', '$http', '$location', 'LocalClipStore', function ($scope, $rootScope, $http, $location, LocalClipStore) {
			Utility.debug("record audio controller");
			$scope.record = "Record";
			$scope.recordStatus = "";
			$scope.captureProperties = "";
			$scope.encryptedClipId = "";
			$scope.recordedTitle = "";
			$scope.recordedDesc = "";
			$scope.uri = "";
			
			$scope.captureSuccess = function(mediaFiles) {
				var i, len;
				var mediaDetails = "";

				for (i = 0, len=mediaFiles.length; i < len; i++) {
					mediaDetails += "File full path:";
					mediaDetails += mediaFiles[i].fullPath;

					mediaDetails += " Type:";
					mediaDetails += mediaFiles[i].type;

					mediaDetails += " Last modified:";
					mediaDetails += new Date(mediaFiles[i].lastModifiedDate);

					mediaDetails += " Size:";
					mediaDetails += mediaFiles[i].size;
				}
				// $("#captureProperties").css("display", "block");
				// $("#captureProperties").append(mediaDetails).trigger("create");
				// $("#captureProperties").html(mediaDetails);
				$scope.captureProperties = mediaDetails;
				$scope.recordStatus = "SUCCESS";

//				$scope.upload = $upload.upload({
//				url: 'http://app.songwallah.com/sw/AudioUpload.srvc', //upload.php script,
//				node.js route, or servlet url
//				method: 'POST', // or 'PUT',
//				headers: {'X_FILENAME': mediaFiles[0].fullPath, 'X_GENFILENAME' :
//				mediaFiles[0].fullPath},
//				// withCredentials: true,
//				//data: {myObj: $scope.myModelObj},
//				file: mediaFiles[0].fullPath, // or list of files: $files for html5 only
//				/* set the file formData name ('Content-Desposition'). Default is 'file' */
//				//fileFormDataName: myFile, //or a list of names for multiple files (html5).
//				/* customize how data is added to formData. See #40#issuecomment-28612000 for
//				sample code */
//				//formDataAppender: function(formData, key, val){}
//				}).progress(function(evt) {
//				Utility.debug('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//				}).success(function(data, status, headers, config) {
//				// file is uploaded successfully
//				Utility.debug("Success:" + data);
//				});
				// .error(function(data, status, headers, config) {
				// Utility.debug("Error:" + data);
				// });
				// .then(success, error, progress);
				// .xhr(function(xhr){xhr.upload.addEventListener(...)})//
				// access and attach any event listener to XMLHttpRequest.

				$scope.uri = mediaFiles[0].fullPath;
				var options = new FileUploadOptions();
				$scope.fileName = $scope.uri.substr($scope.uri.lastIndexOf('/')+1);
				options.fileKey="file";
				options.fileName= $scope.uri.substr($scope.uri.lastIndexOf('/')+1);
				options.mimeType="audio/mp3";

				var headers = new Object();
				headers.X_FILENAME =  $scope.fileName ;
				headers.X_GENFILENAME =  $scope.fileName ;
				headers.MOBILE =  "TRUE";
				
				options.headers = headers;

				var ft = new FileTransfer();
				ft.upload($scope.uri, "http://app.songwallah.com/sw/AudioUpload.srvc?songwallah.user=" + window.localStorage.getItem("songwallah.user"), $scope.win, $scope.fail, options);

			};

			$scope.captureError = function(error) {
				var errors = {};
//				errors[CaptureError.CAPTURE_INTERNAL_ERR] = 'Camera or microphone failed to
//				capture image or sound.';
//				errors[CaptureError.CAPTURE_APPLICATION_BUSY] = 'Camera application or audio
//				capture application is currently serving other capture request.';
//				errors[CaptureError.CAPTURE_INVALID_ARGUMENT] = 'Invalid use of the API (e.g.
//				limit parameter has value less than one).';
//				errors[CaptureError.CAPTURE_NO_MEDIA_FILES] = 'User exited camera application
//				or audio capture application before capturing anything.';
//				errors[CaptureError.CAPTURE_NOT_SUPPORTED] = 'The requested capture operation
//				is not supported.';

				var contents  = "ERROR:" + errors[error.code];

				$scope.captureProperties = contents;
				$scope.recordStatus = "ERROR";
			};

			$scope.win = function(r) {
				Utility.debug("Code = " + r.responseCode);
				Utility.debug("Response = " + r.response);
				$scope.encryptedClipId = r.response;
				Utility.debug("Sent = " + r.bytesSent);
				//=====================
					
					
				// let's move the file to a new location
				var filePath = ""; //file Entry object
				Utility.debug("$scope.uri:" + $scope.uri);
				var fileURL = $scope.uri.slice(0, 5) + "//" + $scope.uri.slice(5);
				Utility.debug("fileURL:" + fileURL);
				window.resolveLocalFileSystemURL(fileURL, function(path) {
					filePath = path;
					Utility.debug("filePath:" + filePath.name);
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
						Utility.debug("fileSystem:" + fileSystem.name);
						fileSystem.root.getDirectory("sw", {create:true, exclusive: false}, function(swDir) {
								Utility.debug("sw:" + swDir.name);
								swDir.getDirectory("clip", {create: true, exclusive: false}, function (clipDir) {
									Utility.debug("clip:" + clipDir.name);
									filePath.moveTo(clipDir, $scope.encryptedClipId + ".mp3", function(entry){}, function(fail){});
									Utility.debug("moved recording to local clip folder");
									try {
										var dt = new Date();
										var ts = dt.getTime();
										Utility.debug("going to save clip locally");
										var tempClip = {
											"ID" : $scope.encryptedClipId,
									         "title" : $scope.recordedTitle, 
									         "album" : "", 
									         "artists" : "", 
									         "composers" : "", 
									         "lyricists" : "", 
									         "lyrics" : "", 
									         "description" : $scope.recordedDesc, 
									         "genre" : "", 
									         "year" : "",
									         "keywords" : "", 
									         "coverArtUrl" : "", 
									         "url" : "", 
									         "userFileName" : "",
									         "metaData" : {
										         "format" : "", 
										         "samplingRate" : "", 
										         "channels" : "", 
										         "bitRate" : "", 
										         "duration" : ""
									         },
									         "usageData" : {
										         "uploadedDate" : Utility.formatDateTime(dt), 
										         "processedDate" : "", 
										         "IndexedDate" : "", 
										         "plays" : "0", 
										         "avgRating" : "0", 
										         "totalRatings" : "0", 
										         "totalComments" : "0", 
										         "fbShares" : "0", 
										         "emailShares" : "0"
									         },
									         "coverArtImageBytes" : "", 
									         "shortDescription" : $scope.recordedDesc, 
									         "userId" : window.localStorage.getItem("songwallah.user"), 
									         "language" : "", 
									         "encryptedId" :  $scope.encryptedClipId, 
									         "userRating" : "", 
									         "userName" : window.localStorage.getItem("songwallah.user.name"), 
									         "category" : "", 
									         "mood" : "", 
									         "start" : "0", 
									         "stop" : "-1", 
									         "canEdit" : "true", 
									         "canComment" : "true", 
									         "originatingServerPath" : "", 
									         "recorded" : "true",
									         "ts" : ts
										};
										Utility.debug("created tempClip");
										window.localStorage.setItem("clip:" + $scope.encryptedClipId, JSON.stringify(tempClip));
										LocalClipStore.saveClip(tempClip);
										Utility.debug("saved clip locally");
										// send the audio details to service
										$http({
											method: 'POST',
											url: "http://app.songwallah.com/sw/AudioDetailsUpload.srvc",
												data : Utility.enhanceDataForServiceCall({
													title : $scope.recordedTitle,
													description: $scope.recordedDesc,
													canEdit: true,
													canComment: true,
													genfilename:  $scope.fileName,
													recorded: true
												}),
												headers: {'Content-Type' : 'application/json'}
										}).
										success(function(data, status) {
											$scope.status = status;
											if(data != null){
												Utility.debug("uploaded clip details, submitted for processing");
											}
										})
										.error(function(data, status) {
											$scope.data = data || "Request failed";
											$scope.status = status;
											Utility.debug("couldn't save clip details:" + JSON.stringify(data));
										});
									} catch(excep) {
										Utility.debug("exception:" + excep);
									}
								});
							});
						});
					}, function(fail) {
						Utility.debug("failure:" + JSON.stringify(fail));
					});
				
					
			};

			$scope.fail = function fail(error) {
				alert("An error has occurred: Code = " + error.code);
				$scope.encryptedClipId = "";
			};

			$scope.recordAudio = function() {
				Utility.debug("navigator:" + (navigator !== undefined));
				Utility.debug("navigator.device:" + (navigator.device !== undefined));
				Utility.debug("navigator.device.capture:" + (navigator.device.capture !== undefined));

				navigator.device.capture.captureAudio($scope.captureSuccess, $scope.captureError);   
			};
     }])
     .controller('MyPlaylistsCtrl', ['$scope', '$rootScope', '$http', '$location', 'Playlist', function ($scope, $rootScope, $http, $location, Playlist) {
    	 
    	 $scope.startplaylist = 0;
    	 $scope.len = 10;
    	 $scope.myplaylists = new Object();
    	 $scope.myplaylists.playLists = new Array();
    	 $rootScope.showNavBar = true;
    	 
    	 $scope.loadMyPlaylists = function () {
    		   Utility.debug(" Getting  my playlists from server");
    			$http({
    				method: 'POST',
    				url:  "http://app.songwallah.com/sw/sidebar.srvc",
    				data : Utility.enhanceDataForServiceCall({
    					t : "myplaylists",
    					s : $scope.startplaylist,
    					n : $scope.len,
    					'songwallah.user' : $rootScope.userId,
    					'songwallah.guest': $rootScope.dummyId
    				}),
    				headers: {'Content-Type' : 'application/json'}
        		})
    		    .success(function(data, status) {
    		    	Utility.debug(data);			
    				if(data.processedResults != undefined && data.processedResults.playLists != undefined)
    					$scope.myplaylists.playLists = $scope.myplaylists.playLists.concat(data.processedResults.playLists);
    					$scope.startplaylist += data.processedResults.playLists.length;
    	       })
    	       .error(function(data, status) {
    	           Utility.debug("failed:" + data);         
    	       });
          }
    	 $scope.openplaylist = function(index){
    			 Playlist.setCurrentPlaylist($scope.myplaylists.playLists[index]);
    			 $location.path('/playlists/-9999');
    	 }
    	 $scope.loadMorePlaylists = function(){
    		 $scope.loadMyPlaylists();
    	 }
    	 
    	  $scope.loadMyPlaylists();
     }])
     .controller('SysLogCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    	 $scope.syslog = Utility.getSysLog();
     }])
     .controller('MyRadiosCtrl', ['$scope', '$rootScope', '$http', '$location', 'Radio', function ($scope, $rootScope, $http, $location, Radio) {
    	 
    	 $scope.radiostartpos = 0;
    	 $scope.len = 10;
    	 $scope.myradios = new Object();
    	 $scope.myradios.radiosList = new Array();
    	 $rootScope.showNavBar = true;
    	 
    	 $scope.loadMyRadios = function () {
    		   Utility.debug(" Getting  my radios from server");
    			$http({
    				method: 'POST',
    				url:  "http://app.songwallah.com/sw/radio.srvc",
    				data : Utility.enhanceDataForServiceCall({
    					op : "listradios",
    					s : $scope.radiostartpos,
    					l : $scope.len,
    					f : "my",
    					'songwallah.user' : $rootScope.userId,
    					'songwallah.guest': $rootScope.dummyId
    				}),
    				headers: {'Content-Type' : 'application/json'}
        		})
    		    .success(function(data, status) {
    		    	Utility.debug(data);			
    				if(data.processedResults != undefined && data.processedResults.radios != undefined)
    					$scope.myradios.radiosList = $scope.myradios.radiosList.concat(data.processedResults.radios);
    					$scope.radiostartpos += data.processedResults.radios.length;
    	       })
    	       .error(function(data, status) {
    	           Utility.debug("failed:" + data);         
    	       });
          }
    	 $scope.playradio = function(index){
    		 	 Radio.setCurrentRadio($scope.myradios.radiosList[index]);
    		 	 $location.path('/radios/-9999');
    	 }
    	 $scope.loadMoreRadios = function(){
    		 $scope.loadMyRadios();
    	 }
    	  $scope.loadMyRadios();
     }])
     .controller('MySettingsCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

 //   	 $scope.userid ="";
//    	 $scope.username ="";
//    	 $scope.userprofilepic ="";
//    	 $scope.userType ="";
//    	 $scope.userRole ="";
//    	 $scope.fbHandle ="";
//  	 $scope.fbLongTermCookie ="";
//    	 $scope.userNickName ="";
 //   	 $scope.usersignedin = false; 
    	 $scope.userloginpattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    	 $scope.userlogin = "";
    	 $scope.password = "";
    	 $scope.singinerror = "";
    	 $rootScope.showNavBar = true;
    	 $rootScope.navButtonState = ["disabled", "disabled", "disabled","disabled",  "active" ];

    	 
    	 
        
        $scope.swlogin = function(userlogin, userpassword) {
        	
        	Utility.debug(" Verifying user credential ");
        	// Verify user sign in details
 			$http({
				method: 'POST',
				url:  "http://app.songwallah.com/sw/signin.srvc",
				data : Utility.enhanceDataForServiceCall({
					login : userlogin, 
	    			password: userpassword
				}),
				headers: {'Content-Type' : 'application/json'}
    		})
		    .success(function(data, status) {
		    	Utility.debug(data);			
				if(data.processedResults !== undefined && data.processedResults.errorCode == 0){
					$scope.processSignInResults(data);
				}
				else if (data.errorCode !== undefined && data.errorCode != null &&  data.errorCode == 1 ){
					// error exists
					$scope.singinerror = data.errorMessage;
				}
				})
	       .error(function(data, status) {
	           Utility.debug("failed:" + data);  
	           $scope.singinerror = "Please verify your credentials"
	       });
        	
        }
        
        $scope.signout = function(){
        	// call singout service 
			 $http({
					method: 'POST',
					url:  "http://app.songwallah.com/sw/signout.srvc",
					data : Utility.enhanceDataForServiceCall({
						useraction : "signout"
					}),
					headers: {'Content-Type' : 'application/json'}
	    		})
			    .success(function(data, status) {
			    	Utility.debug("signout success");
					})
		       .error(function(data, status) {
//		    	   Utility.debug("Error in singout");
		       });
			 
		    	window.localStorage.removeItem("songwallah.user");
	        	window.localStorage.removeItem("songwallah.user.name");
	        	window.localStorage.removeItem("songwallah.user.profile.pic.url");
	        	window.localStorage.removeItem("songwallah.user.type");
	        	window.localStorage.removeItem("songwallah.user.role");
	        	window.localStorage.removeItem("songwallah.user.fb.uid");
	        	window.localStorage.removeItem("songwallah.user.fb.longtermtoken");
	        	window.localStorage.removeItem("songwallah.user.nickname");
	        	$rootScope.verifyUserSignInStatus();

        }
        
        
        $scope.processSignInResults = function(data) {
        	var signInResults = data.processedResults !== undefined ? data.processedResults : data.signInData;
        	
        	$rootScope.usersignedin = true;
        	
        	$rootScope.userid = signInResults.userId;    				
        	$rootScope.username = signInResults.userName;
        	$rootScope.userprofilepic = signInResults.userProfilePic;    				
        	$rootScope.userType = signInResults.userType;
        	$rootScope.fbHandle = signInResults.fbHandle;
        	$rootScope.fbLongTermCookie =signInResults.fbLongTermCookie;
        	$rootScope.userNickName=signInResults.userNickName;
        	$rootScope.userRole=signInResults.userRole;
        	
        	window.localStorage.setItem("songwallah.user", $rootScope.userid);
        	window.localStorage.setItem("songwallah.user.name", $rootScope.username);
        	window.localStorage.setItem("songwallah.user.profile.pic.url", $rootScope.userprofilepic);
        	window.localStorage.setItem("songwallah.user.type", $rootScope.userType);
        	window.localStorage.setItem("songwallah.user.role", $rootScope.userRole);
        	window.localStorage.setItem("songwallah.user.fb.uid", $rootScope.fbHandle);
        	window.localStorage.setItem("songwallah.user.fb.longtermtoken", $rootScope.fbLongTermCookie);
        	window.localStorage.setItem("songwallah.user.nickname", $rootScope.userNickName);
        	
        	$location.path('/myoptions');
        };
        
    	 $rootScope.verifyUserSignInStatus();
     
    	 $scope.fbLoginSuccess= function(response) {
    		 
    		    /*Utility.debug('status > '+event.status); // 1 - success, 0 - error
    		    Utility.debug('data > '+event.data); //Object response (id, name, email, etc);
    		    Utility.debug('token > '+event.token); // token user login
    		    Utility.debug('message > '+event.message);  
    	        */
    		 //Utility.debug("FB Auth Response:" + JSON.stringify(response));
			 var token = response.accessToken;
    		 if(response.status === 'connected') {
				 //FB.api('/me?fields=id,username,first_name,last_name,email,gender,birthday,picture,updated_time&access_token=' + accessToken, function(response) {
					 var fbHandle = response.id;
				 
					 //let's send the login info the server side to fill in other details if the user has just signed up...
					 $http({
						method: 'POST',
						url:  "http://app.songwallah.com/sw/signin.srvc",
						data : Utility.enhanceDataForServiceCall({
							fbhandle : fbHandle, 
							fbshorttoken: token
						}),
						headers: {'Content-Type' : 'application/json'}
		    		})
				    .success(function(data, status) {
				    	Utility.debug("FB Signin Success:" + JSON.stringify(data));			
						if(data.processedResults !== undefined && data.processedResults.errorCode == 0){
							processSignInResults(data);
						}
						else if (data.errorCode !== undefined && data.errorCode != null &&  data.errorCode == 1 ){
							// error exists
							$scope.singinerror = data.errorMessage;
						}
						})
			       .error(function(data, status) {
			           Utility.debug("signin failed:" + data);  
			           $scope.singinerror = "Please verify your credentials"
			       });
				 //});
				 //facebookConnectPlugin.getAccessToken()
				 /* according to the facebook connect plugin, the following works in iOS only...
				 facebookConnectPlugin.api("me/?fields=username,first_name,last_name,picture,email", ["user_birthday"], 
						    function (result) {
						        alert("Result: " + JSON.stringify(result));
						         alerts:
						            {
						                "id": "000000123456789",
						                "email": "myemail@example.com"
						            }
						        
						    }, 
						    function (error) { 
						        alert("Failed: " + error); 
						    });
		 			*/
    		 
			 } else {
				 Utility.debug("fb is not connected");
			 }
    	 }
    	 
    	 $scope.fbLoginFailure = function (fail) {
			 Utility.debug("fb login status check failed!:" + fail);
		 }
		 
    	 $scope.fbLogout = function() {
    		  Utility.debug('status > '+event.status); // 1 - success, 0 - error
    		  Utility.debug('message > '+event.message);
    	 }
    	 
    	 $scope.fbLogin = function() {
    		 openFB.init('154074554781826');
    		 openFB.login('', function(event) {
    			 Utility.debug("step 4: Login success:")
    			 //Utility.debug(JSON.stringiry(event));
    		       openFB.api({
    		            path: '/me',
    		            success: function(data) {
    		                //Utility.debug(JSON.stringify(data));
    		            	data.accessToken = event.access_token;
    		            	data.status = event.status;
    		            	$scope.fbLoginSuccess(data);
    		                //document.getElementById("userName").innerHTML = data.name;
    		            },
    		            error: function(data) {$scope.fbLoginFailure(data);//Utility.debug("error");
    		            }});
    		            }, function(error) {
    			 Utility.debug("Login failure:")
    			 Utility.debug(JSON.stringiry(error));    			 
    		 });
    	 }
    	 		
     }])
     .controller('SignupCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    	 
    	 $scope.firstName = "";
    	 $scope.lastName = "";
    	 $scope.nickName = "";
    	 $scope.email = "";
    	 $scope.confEmail = "";
    	 $scope.password = "";
    	 $scope.gender = "";
    	 $scope.month = "";
    	 $scope.day = "";
    	 $scope.year = "";
    	 $scope.disableSignupButton = true;
    	 $scope.validationErrorMsg = "";
    	 $scope.confmessage = "";
    	 $scope.validuser = "";
    	 $scope.validusermark = "";
    	 

    	 $scope.submitregform = function(){
    		 $scope.validationErrorMsg = "";
    		 validateFields();
    		 if($scope.validationErrorMsg == ""){
	   			$http({
	  				method: 'POST',
	  				url:  "http://app.songwallah.com/sw/signup.srvc",
	  				data : {
	  					firstname : $scope.firstName,
	  					lastname  : $scope.lastName,
	  					nickname  : $scope.nickName,
	  					email : $scope.email,
	  					password : $scope.password,
	  					gender : $scope.gender,
	  					month : $scope.moth,
	  					day : $scope.day,
	  					year : $scope.year
	  				},
	  				headers: {'Content-Type' : 'application/json'}
	      		})
	  		    .success(function(data, status) {
	  		    	 
	  		    	Utility.debug("Registration service executed successfully");
	  		    	$scope.confmessage = "Your Registration is successful. Please check your email and confirm your regigstration by clicking the confirmation link";
	  		    	alert($scope.confmessage);
	  		    	$location.path('/explore');
	  				})
	  	       .error(function(data, status) {
	  	           Utility.debug("failed:" + data + " status  " + status);  
	  	           
	  	       	});
    		}
    	 } 
    	 
    	 
    	 $scope.verifyUserExists = function(email){
    		 
    		 Utility.debug(" verifying whether User exists or not");
    		 if(email != null && email != ''){
    			 // Verify user sign in details
		  			$http({
		 				method: 'POST',
		 				url:  "http://app.songwallah.com/sw/verifyuser.srvc",
		 				data : {
		 					id : email
		 				},
		 				headers: {'Content-Type' : 'application/json'}
		     		})
		 		    .success(function(data, status) {
		 		    	 Utility.debug("success :" + data);
			 				if(data == "true"){
			 					Utility.debug(" User name is already exists");
								$scope.validuser="user name already exists. Please enter another email";
							}else{
								Utility.debug(" User name is available ");
								$scope.validusermark = "&#10004;"
								$scope.disableSignupButton = false;
							}
		 				})
		 	       .error(function(data, status) {
		 	           Utility.debug("failed:" + data + " status  " + status);  
		 	           
		 	       });
		
		    	 }
    	 } 
    	 
    	 $scope.clearErrormsg = function(){
    		 $scope.validuser = "";
    		 $scope.validusermark = "";
    		 $scope.disableSignupButton = true;
    	 }
    	 
    	 function validateFields() {
    			if($scope.firstName == "" || $scope.firstName == null){
    				$scope.validationErrorMsg = "First Name is Required";
    				return false;
    			}
    			if($scope.lastName == ""    || $scope.lastName == null){
    				$scope.validationErrorMsg = "Last Name is Required"
    				return false;
    			}
    			if($scope.email == "" || $scope.email == null){
    				$scope.validationErrorMsg = "Email is Required"
    				return false;
    			}
    			if($scope.confEmail == "" || $scope.confEmail == null){
    				$scope.validationErrorMsg = "Conf.Email is Required"
    				return false;
    			}
    			if($scope.password  == "" || $scope.password == null){
    				$scope.validationErrorMsg = "Password is Required"
    				return false;
    			}

    			if($scope.gender == "" || $scope.gender == "0"){
    				$scope.validationErrorMsg = "Gender is Required"
    				return false;
    			}

    			if($scope.month == "" || $scope.month == "0" || $scope.day == "" ||  $scope.day  == "0" || $scope.year == "" || $scope.year == "0"){
    				$scope.validationErrorMsg = "Date of Birth is Required"
    				return false;
    			}

    			if($scope.email != $scope.confEmail){
    				$scope.validationErrorMsg = "email and confirmation email are not same";
    				return false;
    			}
    		}  
     }])
     .controller('MyDeviceCtrl', ['$scope', '$rootScope', '$routeParams', '$window', '$location', '$http', '$anchorScroll', 'LocalClipStore', 'Playlist', function ($scope, $rootScope, $routeParams, $window, $location, $http, $anchorScroll, LocalClipStore, Playlist) {
        	
    	 var filter=$rootScope.selecteddevicefilter === undefined ? 1 : $rootScope.selecteddevicefilter;
    	 $rootScope.selecteddevicefilter = filter;
    	 $scope.headeritemstyle=[(filter == 1 ? "with" : "no") + "border", (filter == 2 ? "with" : "no") + "border"];
    	 $scope.recordingsSortOrder = "time";
    	 
    	 $scope.changeDeviceFilter = function (filter) {
    		 $rootScope.selecteddevicefilter = filter;
    		 $scope.headeritemstyle=[(filter == 1 ? "with" : "no") + "border", (filter == 2 ? "with" : "no") + "border"];
    		 
    		 if (filter == 2) {
    			 //let's load local recordings
    			 LocalClipStore.getAllRecordedClips($scope, $scope.recordingsSortOrder);
    		 }
    	 }
    	 
    	 $scope.changeSortOrder = function() {
    		 $scope.changeDeviceFilter(2);
    	 }
    	 
    	 $scope.swipeRight = function() {
    		 $rootScope.selecteddevicefilter = $rootScope.selecteddevicefilter - 1;
    		 if ($rootScope.selecteddevicefilter < 1)
    			 $rootScope.selecteddevicefilter = 2;
    		 $scope.changeDeviceFilter($rootScope.selecteddevicefilter);
    	 }
    	
    	 $scope.swipeLeft = function() {
    		 $rootScope.selecteddevicefilter = $rootScope.selecteddevicefilter + 1;
    		 if ($rootScope.selecteddevicefilter > 2)
    			 $rootScope.selecteddevicefilter = 1;
    		 $scope.changeDeviceFilter($rootScope.selecteddevicefilter);
    	 }
    	 
     $scope.displaydownloadsbycategory = function(type){
    	 	
    	 	$location.path('/mydownloads/' + type);
     }
     
     $scope.recordingsSortOrder = "time"; //or "title"
     
//     $scope.gotoAnchor = function (anchor){
//    	    // set the location.hash to the id of
//    	    // the element you wish to scroll to.
//    	    $location.hash(anchor  );
//
//    	    // call $anchorScroll()
//    	    $anchorScroll();
//    	  };
    	  
//     $scope.refreshDownloads = function(type){
//    	 	$rootScope.backlabel = "This Device";
//	    	switch(type){
//		     	case "1" :
//		     			$rootScope.loading = true;
//	     				LocalClipStore.getAllClips($rootScope);
//	     				$rootScope.showclips = true;
//	     				$rootScope.selectedgroup = "All";
//	     				break;
//		     	case "2":
//		     			$rootScope.loading = true;
//		     			LocalClipStore.getAllLanguages($rootScope);
//		     			$rootScope.showclips = false;
//		     			$rootScope.selectedgroup = "Languages";
//			     		break;
//		     	case "3":
//		     			$rootScope.loading = true;	
//			     		LocalClipStore.getAllAlbums($rootScope);
//		     			$rootScope.showclips = false;
//		     			$rootScope.selectedgroup = "Albums";
//	     				break;
//  			case "4" :
//  					$rootScope.loading = true;
//  					LocalClipStore.getAllArtists($rootScope);
//  					$rootScope.showclips = false;
//  					$rootScope.selectedgroup = "Artists";
//     				break;
//  			case "5" :
//  					$rootScope.loading = true;
//  					LocalClipStore.getAllCategories($rootScope);
//  					$rootScope.showclips = false;
//  					$rootScope.selectedgroup = "Categories";
//	     			break;
//  			case "6" :
//	 					$rootScope.loading = true;
//	 					LocalClipStore.getAllGenres($rootScope);
//	 					$rootScope.showclips = false;
//	 					$rootScope.selectedgroup = "Genres";
//	     				break;
//
//	    	}
//  }
//  
     
//     $scope.playCallback = function (clips) {
//    	 if (clips !== undefined && clips != null && clips.length > 0) {
//    		 if (clips.length > 1) {
//    			 //multiple clips are going to be played - play all
//    			 Playlist.clearPlaylist();
//        		 for (var i = 0; i<clips.length; i++)
//        			 Playlist.addToPlaylist(clips[i]);
//    			 Playlist.setCurrentIndex(0);
//    			 $rootScope.nowPlaying = false;
//    			 $location.path('/clips/-9999');
//    		 } else {
//    			 var index = Playlist.addToPlaylist(clips[0]);
//    			 Playlist.setCurrentIndex(index);
//    			 $location.path('/clips/-9999');
//    		 }
//    		 $scope.$apply();
//    	 }
//     }
     
//     $scope.playclip = function(clipID){
//    	LocalClipStore.getClipByID(clipID, $scope.playCallback);
//     }
     

//     $scope.showclipsbygroup = function(val){
//    	 switch($rootScope.selectedgroup){
//    	 //need to add play all here for all the results
//	     	case 'Languages' :
//	     					$rootScope.loading = true;
//	     					LocalClipStore.getClipsByLanguage(val, $rootScope);
//		     				$rootScope.showclips = true;
//		     				$rootScope.backlabel = "All Languages";
//		     				break;
//	     	
//	     	case 'Albums' :
//							$rootScope.loading = true;
//							LocalClipStore.getClipsByAlbum(val, $rootScope);
//			 				$rootScope.showclips = true;
//			 				$rootScope.backlabel = "All Albums";
//			 				break;
//
//	     	case 'Artists' :
//							$rootScope.loading = true;
//							LocalClipStore.getClipsByArtist(val, $rootScope);
//			 				$rootScope.showclips = true;
//			 				$rootScope.backlabel = "All Artists";
//			 				break;
//
//	     	case 'Categories' :
//							$rootScope.loading = true;
//							LocalClipStore.getClipsByCategory(val, $rootScope);
//			 				$rootScope.showclips = true;
//			 				$rootScope.backlabel = "All Categories";
//			 				break;
//
//	     	case 'Genres' :
//							$rootScope.loading = true;
//							LocalClipStore.getClipsByGenre(val, $rootScope);
//							$rootScope.showclips = true;
//							$rootScope.backlabel = "All Genres";
//							break;
//    	 }
//     }
     
//     $scope.deleteLocalClip = function(clipId) {
//    	 	//let's remove the clip data from WebSQL, LocalStorage
//    	 	LocalClipStore.deleteClip(clipId);
//    		window.localStorage.removeItem("clip:" + clipId);
//			
//			//let's remove the clip from local file system
//			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
//				Utility.debug("fileSystem:" + fileSystem.name);
//				fileSystem.root.getDirectory("sw", {create:false, exclusive: false}, function(swDir) {
//						Utility.debug("sw dir:" + swDir.name);
//						swDir.getDirectory("clip", {create: false, exclusive: false}, function (clipDir) {
//							Utility.debug("clip dir:" + clipDir.name);
//							clipDir.getFile(clipId + ".mp3", {create: false, exclusive: true}, function(clipFileEntry) {
//								clipFileEntry.remove(function() {
//									Utility.debug("successfully deleted file:" + clipId + ".mp3");
//								}, function(failure) {
//									Utility.debug("couldn't delete file:" + clipId + ".mp3");
//								});
//							}, function(failure) {
//								Utility.debug("couldn't get file");
//							});
//						}, function(failure) {
//							Utility.debug("couldn't get directory clip dir");
//						});
//					}, function(failure) {
//						Utility.debug("couldn't get sw dir");
//					});
//				}, function(failure) {
//					Utility.debug("couldn't get file system");
//				});
//        
//    	
//     }
     
//     if ($routeParams.refresh !== undefined && $routeParams.refresh != null && $routeParams.refresh == "true") {
//		 $scope.refreshDownloads($routeParams.type);
//	 }
	 
     
    }])
    .controller('MyDownloadsCtrl', ['$scope', '$rootScope', '$routeParams', '$window', '$location', '$http', '$anchorScroll', 'LocalClipStore', 'Playlist', function ($scope, $rootScope, $routeParams, $window, $location, $http, $anchorScroll, LocalClipStore, Playlist) {        	 
    	$scope.gotoAnchor = function (anchor){
    	    // set the location.hash to the id of
    	    // the element you wish to scroll to.
    	    $location.hash(anchor  );

    	    // call $anchorScroll()
    	    $anchorScroll();
    	  };
    	  
          $scope.goBack = function() {
     		 var type = "1";
     		 switch($rootScope.backlabel) {
     		 	case "This Device":
     		 		$location.path('/mydevice');
     		 		break;
     		 	case "All Languages" :
     		 		type = "2";
     		 		break;
     		 	case "All Albums":
     		 		type = "3";
     		 		break;
     		 	case "All Artists":
     		 		type = "4";
     		 		break;
     		 	case "All Categories":
     		 		type = "5";
     		 		break;
     		 	case "All Genres":
     		 		type = "6";
     		 		break;
     		 }
     		 if (type != 1)
     			$scope.showResultsForCategory(type);
     	 }
          
    	 $scope.showResultsForCategory = function(category){
    	 	$rootScope.backlabel = "This Device";
	    	switch(category){
		     	case "1" :
		     			$rootScope.loading = true;
	     				LocalClipStore.getAllClips($rootScope);
	     				$rootScope.showclips = true;
	     				$rootScope.selectedgroup = "All";
	     				break;
		     	case "2":
		     			$rootScope.loading = true;
		     			LocalClipStore.getAllLanguages($rootScope);
		     			$rootScope.showclips = false;
		     			$rootScope.selectedgroup = "Languages";
			     		break;
		     	case "3":
		     			$rootScope.loading = true;	
			     		LocalClipStore.getAllAlbums($rootScope);
		     			$rootScope.showclips = false;
		     			$rootScope.selectedgroup = "Albums";
	     				break;
	  			case "4" :
	  					$rootScope.loading = true;
	  					LocalClipStore.getAllArtists($rootScope);
	  					$rootScope.showclips = false;
	  					$rootScope.selectedgroup = "Artists";
	     				break;
	  			case "5" :
	  					$rootScope.loading = true;
	  					LocalClipStore.getAllCategories($rootScope);
	  					$rootScope.showclips = false;
	  					$rootScope.selectedgroup = "Categories";
		     			break;
	  			case "6" :
		 					$rootScope.loading = true;
		 					LocalClipStore.getAllGenres($rootScope);
		 					$rootScope.showclips = false;
		 					$rootScope.selectedgroup = "Genres";
		     				break;

	    	}
	    	$scope.$apply();
    	 }
     
     $scope.playCallback = function (clips) {
    	 if (clips !== undefined && clips != null && clips.length > 0) {
    		 if (clips.length > 1) {
    			 //multiple clips are going to be played - play all
    			 Playlist.clearPlaylist();
        		 for (var i = 0; i<clips.length; i++)
        			 Playlist.addToPlaylist(clips[i]);
    			 //Playlist.setCurrentIndex(0);
    			 $rootScope.nowPlaying = false;
    			 $location.path('/clips/-9999');
    		 } else {
    			 var index = Playlist.addToPlaylist(clips[0]);
    			 //Playlist.setCurrentIndex(index);
    			 $location.path('/clips/-9999');
    		 }
    		 $scope.$apply();
    	 }
     }
     
     $scope.playclip = function(clipID){
    	LocalClipStore.getClipByID(clipID, $scope.playCallback);
     }
     

     $scope.showclipsbygroup = function(val){
    	 switch($rootScope.selectedgroup){
    	 //need to add play all here for all the results
	     	case 'Languages' :
	     					$rootScope.loading = true;
	     					LocalClipStore.getClipsByLanguage(val, $rootScope);
		     				$rootScope.showclips = true;
		     				$rootScope.backlabel = "All Languages";
		     				break;
	     	
	     	case 'Albums' :
							$rootScope.loading = true;
							LocalClipStore.getClipsByAlbum(val, $rootScope);
			 				$rootScope.showclips = true;
			 				$rootScope.backlabel = "All Albums";
			 				break;

	     	case 'Artists' :
							$rootScope.loading = true;
							LocalClipStore.getClipsByArtist(val, $rootScope);
			 				$rootScope.showclips = true;
			 				$rootScope.backlabel = "All Artists";
			 				break;

	     	case 'Categories' :
							$rootScope.loading = true;
							LocalClipStore.getClipsByCategory(val, $rootScope);
			 				$rootScope.showclips = true;
			 				$rootScope.backlabel = "All Categories";
			 				break;

	     	case 'Genres' :
							$rootScope.loading = true;
							LocalClipStore.getClipsByGenre(val, $rootScope);
							$rootScope.showclips = true;
							$rootScope.backlabel = "All Genres";
							break;
    	 }
     }
     
     if ($routeParams.category !== undefined && $routeParams.category != null) {
		 $scope.showResultsForCategory($routeParams.category);
	 }	 
     
    }]);

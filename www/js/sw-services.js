'use strict';

(function () {
    var lastSearchTerm = "";
    var isPlaying = false;
    var resultsStart = 0;
    var resultsLen = 10; //default
    var newSearch = true;
    var totalPlaylistsLoaded = 0;
    var clips = new Array();
    var playlists = new Array();
    var radios= new Array();
    var currentPlaylist = new LocalPlaylist();
    
    var currentRadio = null;
    
    function saveCurrentPlaylistLocally() {
		if (currentPlaylist == null) {
			window.localStorage.removeItem("nowPlayingPlaylist");
		} else {
			window.localStorage.setItem("nowPlayingPlaylist", JSON.stringify(currentPlaylist));
		}
	};

    function openSWDB() {
    	return openDatabase('swclipsdb', '1.0', 'this db stores songwallah clip details for downloaded clips', 2 * 1024 * 1024);
    };
    
    function generatePlaceHolders(arr) {
    	var outStr = "";
    	for (var i = 0; i< arr.length; i++) {
    		outStr += "?" + (i < arr.length - 1 ? "," : "");
    	}
    	return outStr;
    };

    function collectClips(results, $scope) {
	      var len=results.rows.length;
	      var i;
	      $scope.downloadedClips = new Array();
	      var allClipIds = "";
	      var rest = new Array();
	      for(i=0; i<len; i++) {
	    	  rest.push({firstChar: results.rows.item(i).title.substring(0,1), data:{ID: results.rows.item(i).ID, title: results.rows.item(i).title, album: results.rows.item(i).album, description: results.rows.item(i).description, playAll: false}});
	    	  allClipIds += results.rows.item(i).ID + (i < len - 1 ? "," : "");
	      }
	      var playAll = new Array();
	      if (len > 0) { //only if there are any clips to add
	    	  playAll.push({firstChar:'', data: {ID: allClipIds, title: "Play All", playAll: true}});
	      }
	      $scope.downloadedClips = playAll.concat(rest);
	      $scope.loading = false;
	      $scope.$apply();
    };

    function LocalPlaylist(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl) {
		    this.currentindex = 0;
		    this.clips = new Array();
		    this.title = "Unsaved";
		    this.coverArtUrl = "img/playlist.png"; 
		    this.isTempPlaylist = true;
		    	
    		if (id !== undefined) this.ID = id;
    		if (title !== undefined) this.title = title;
    		if (description !== undefined) this.description = description;
    		if (keywords !== undefined) this.keywords = keywords;
    		if (owner !== undefined) this.owner = owner;
    		if (ownerName !== undefined) this.ownerName = ownerName;
    		if (canEdit !== undefined) this.canEdit = canEdit;
    		if (clips !== undefined) this.clips = clips;    		
    		if (currentindex !== undefined) this.currentindex = currentindex;
    		if (updatedDate !== undefined) this.updatedDate = updatedDate;
    		if (userRating !== undefined) this.userRating = userRating;
    		if (avgRating !== undefined) this.avgRating = avgRating;
    		if (emailShares !== undefined) this.emailShares = emailShares;
    		if (fbShares !== undefined) this.fbShares = fbShares;
    		if (plays !== undefined) this.plays = plays;
    		if (totalComments !== undefined) this.totalComments = totalComments;
    		if (totalRatings !== undefined) this.totalRatings = totalRatings;
    		if (userProfilePic !== undefined) this.userProfilePic = userProfilePic;
    		if (currentplayingpos !== undefined) this.currentplayingpos = currentplayingpos;
    		if (playing !== undefined) this.playing=playing;
    		if (coverArtUrl !== undefined) this.coverArtUrl = coverArtUrl;
    	};

    
    
    function setCurrentPlaylist(playlist) {
    	currentPlaylist = playlist;
    };
    
    function getCurrentPlaylist() {
    	return currentPlaylist;
    };
    
    function findById (id) {
        var clips = null,
            l = clips.length,
            i;
        var clip;
        for (i = 0; i < l; i = i + 1) {
            if (clips[i].ID === id) {
                clip = clips[i];
                break;
            }
        }
        return clip;
    };

     angular.module('swMobile.swServices', [])
     	.factory('Playlist',[
     	    function() {
     	    	return {
     	    		isClipPlaying: function(clipId) {
     	    			try {
     	    				return currentPlaylist.clips(currentPlaylist.getCurrentIndex()).ID == clipId;
     	    			} catch(exception) {
     	    				return false;
     	    			}
     	    		},
     	    		setCurrentPlaylistProps: function(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl) {
     	    			currentPlaylist = new LocalPlaylist(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl);
     	    			Playlist.saveCurrentPlaylistLocally();
     	    		},
     	    		clearPlaylist: function() {
     	    			currentPlaylist = null;
     	    			saveCurrentPlaylistLocally();
     	    		},
     	    		setCurrentPlaylist: function(obj) {
     	    			currentPlaylist = obj;
     	    		},
     	    		getCurrentPlaylist: function() {
     	    			return currentPlaylist;
     	    		},
     	    		getID: function() {
     	    			return currentPlaylist.id;
     	    		},
     	    		addToPlaylist: function(cl) {
     	    			Utility.debug("adding clip " + cl.title + " to the current playlist");
     	    			if (currentPlaylist == null) {
     	    				currentPlaylist = new LocalPlaylist();
     	    			}
     	    			var ind = currentPlaylist.clips.length;
     	    			cl.index = ind;
     	    			currentPlaylist.clips.push(cl);
  //   	    			savePlaylistLocally();
     	    			saveCurrentPlaylistLocally();
     	    			return ind;     	  
     	    		},
     	    		deleteClip: function(index) {
     	    			if (currentPlaylist !=null && currentPlaylist.clips !== undefined && currentPlaylist.clips.length > 0 ) {
     	    				if (index >=0 && index < currentPlaylist.clips.length) {
     	    					currentPlaylist.clips.splice(index, 1);
     	    				} 
     	    			}
     	    		},
     	    		clearPlaylistClips: function() {
     	    			currentPlaylist.clips = new Array();
     	    			saveCurrentPlaylistLocally();
     	    		},
     	    		setCurrentIndex: function (index) {
     	    			currentPlaylist.currentindex = index;
     	    		//	Playlist.saveCurrentPlaylistLocally();
     	    			saveCurrentPlaylistLocally();
     	    		},
     	    		getCurrentIndex: function() {
     	    			return currentPlaylist.currentindex;
     	    		},
     	    		getNextClip: function() {
     	    			currentPlaylist.currentindex +=1;
     	    			if (currentPlaylist.currentindex >= currentPlaylist.clips.length) {
     	    				currentPlaylist.currentindex = 0;
     	    			}
     	    			return currentPlaylist.clips[currentPlaylist.currentindex];
     	    		},
     	    		getPrevClip: function() {
     	    			currentPlaylist.currentindex -=1;
     	    			if (currentPlaylist.currentindex < 0) {
     	    				currentPlaylist.currentindex = currentPlaylist.clips.length - 1;
     	    			}
     	    			return currentPlaylist.clips[currentPlaylist.currentindex];
     	    		},
     	    		getClip: function(index) {
     	    			return currentPlaylist.clips[index];
     	    		},
     	    		getClips: function() {
     	    			return currentPlaylist.clips;
     	    		},
     	    		setClips: function(arr) {
     	    			currentPlaylist.clips = arr;
     	    			saveCurrentPlaylistLocally();
     	    		},
     	    		
     	    		loadCurrentPlaylistFromLocal: function() {
     	    			if (window.localStorage.getItem("nowPlayingPlaylist") != null) {
     	    				currentPlaylist = JSON.parse(window.localStorage.getItem("nowPlayingPlaylist"));
     	    			}
     	    		},
     	    		loadAllLocalPlaylists : function() {
     	    			//TODO
     	    		}
     	    	}
     	    }
     	 ])
     	 .factory('Radio',[
     	    function() {
     	    	return {     	    		
     	    		clearRadio: function() {
     	    			currentRadio = null;
     	    		},
     	    		setCurrentRadio: function(obj) {
     	    			currentRadio = obj;
     	    		},
     	    		getCurrentRadio: function() {
     	    			return currentRadio;
     	    		},
     	    		getID: function() {
     	    			return currentRadio.id;
     	    		},
     	    		getClip: function() {
     	    			return currentRadio.clip;
     	    		},
     	    		setClip: function(clip) {
     	    			currentRadio.clip = clip;
     	    		}
     	    	}
     	    }
     	 ])
     	 //TODO we need to be able to save playlists also
     	 .factory('LocalClipStore',[
     	    function() {
     	    	return {  
     	    		
     	    		determineClipLocation : function(clip) {
     	    			 new FileManager().file_exists('sw/clip', clip.ID + '.mp3', function(successPath) {
     	    				   clip.clipLocationImg = "img/device.png";
     	    				   clip.clipLocation = "device";
     	    			 }, function(failure) {
     	    				clip.clipLocationImg = "img/cloud.png";
  	    				   	clip.clipLocation = "cloud";
     	    			 });
     	    		},
     	    		loadNowPlayingClipFromLocal: function() {
     	    			if (window.localStorage.getItem("nowPlayingClip") != null) {
     	    				var tempClip = JSON.parse(window.localStorage.getItem("nowPlayingClip"));
     	    				if (window.localStorage.getItem("nowPlayingClipPosition") != null) {
     	    					tempClip.lastPlayedPos = JSON.parse(window.localStorage.getItem("nowPlayingClipPosition"));
     	    				} else {
     	    					tempClip.lastPlayedPos = 0;
     	    				}
     	    				return tempClip;
     	    			}
     	    		},
     	    		saveClip: function(clip) {
     	    			//create the db if not there
     	    			var db = openSWDB();

     	    			var clipQueryFields = "ID, title, album, artists, composers, lyricists, lyrics, description, genre, year, keywords, coverArtUrl, url, userFileName, meta_format, meta_samplingRate, meta_channels, meta_bitRate, meta_duration, usage_uploadedDate, usage_processedDate, usage_IndexedDate, usage_plays, usage_avgRating,usage_totalRatings, usage_totalComments, usage_fbShares, usage_emailShares, coverArtImageBytes, shortDescription, userId, language, encryptedId, userRating, userName, category, mood, start, stop, canEdit, canComment, originatingServerPath, recorded, ts";
     	    			var clipCreateFields = 
     	    					"ID TEXT PRIMARY KEY, " +
     	    					"title TEXT, " +
     	    					"album TEXT, " +
     	    					"artists TEXT, " +
     	    					"composers TEXT, " +
     	    					"lyricists TEXT, " +
     	    					"lyrics TEXT, " +
     	    					"description TEXT, " +
     	    					"genre TEXT, " +
     	    					"year TEXT, " +
     	    					"keywords TEXT, " +
     	    					"coverArtUrl TEXT, " +
     	    					"url TEXT, " +
     	    					"userFileName TEXT, " +
     	    					"meta_format TEXT, " +
     	    					"meta_samplingRate TEXT, " +
     	    					"meta_channels TEXT, " +
     	    					"meta_bitRate TEXT, " +
     	    					"meta_duration TEXT, " +
     	    					"usage_uploadedDate TEXT, " +
     	    					"usage_processedDate TEXT, " +
     	    					"usage_IndexedDate TEXT, " +
     	    					"usage_plays TEXT, " +
     	    					"usage_avgRating TEXT," +
     	    					"usage_totalRatings TEXT, " +
     	    					"usage_totalComments TEXT, " +
     	    					"usage_fbShares TEXT, " +
     	    					"usage_emailShares TEXT, " +
     	    					"coverArtImageBytes TEXT, " +
     	    					"shortDescription TEXT, " +
     	    					"userId TEXT, " +
     	    					"language TEXT, " +
     	    					"encryptedId TEXT, " +
     	    					"userRating TEXT, " +
     	    					"userName TEXT, " +
     	    					"category TEXT, " +
     	    					"mood TEXT, " +
     	    					"start TEXT, " +
     	    					"stop TEXT, " +
     	    					"canEdit TEXT, " +
     	    					"canComment TEXT, " +
     	    					"originatingServerPath TEXT, " +
     	    					"recorded TEXT," +
     	    					"ts INTEGER";
     	    					
     	    			var clipValuePlaceHolders = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
     	    			
     	    			db.transaction(function (tx) {  
     	    			   //CREATE THE TABLE IF NOT THERE
//     	    			   tx.executeSql('DROP TABLE IF EXISTS CLIPS', function(tx, results)
//     	    					   {
//     	    				   			Utility.debug("success in drop table clips");
//     	    					   }, function(tx, results) {
//     	    						  Utility.debug("failure in drop table clips" + results.message);
//     	    					   });
     	    			   tx.executeSql('CREATE TABLE IF NOT EXISTS CLIPS (' + clipCreateFields + ')');
     	    			   
     	    			   //create the indexes
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipartist on CLIPS(artists)', [], function(tx, success){}, function(tx, failure) {
     	    				   Utility.debug("failure in creating artist index:" + failure.message);
     	    			   }
     	    					   );
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipalbum on CLIPS(album)');
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS cliplanguage on CLIPS(language)');
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipgenre on CLIPS(genre)');
    	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipcategory on CLIPS(category)');
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipuserId on CLIPS(userId)');
     	    			   tx.executeSql('CREATE INDEX IF NOT EXISTS clipRecTime on CLIPS(ts)');

     	    			   
     	    			   //insert the clip
     	    			   var clipInsertSQL = 'INSERT INTO CLIPS (' + clipQueryFields + ') values (' + clipValuePlaceHolders + ')';
     	    				
     	    			   tx.executeSql(clipInsertSQL, [
     	    				         clip.ID,
     	    				         clip.title, 
     	    				         clip.album, 
     	    				         clip.artists, 
     	    				         clip.composers, 
     	    				         clip.lyricists, 
     	    				         clip.lyrics, 
     	    				         clip.description, 
     	    				         clip.genre, 
     	    				         clip.year,
     	    				         clip.keywords, 
     	    				         clip.coverArtUrl, 
     	    				         clip.url, 
     	    				         clip.userFileName, 
     	    				         clip.metaData.format, 
     	    				         clip.metaData.samplingRate, 
     	    				         clip.metaData.channels, 
     	    				         clip.metaData.bitRate, 
     	    				         clip.metaData.duration, 
     	    				         clip.usageData.uploadedDate, 
     	    				         clip.usageData.processedDate, 
     	    				         clip.usageData.IndexedDate, 
     	    				         clip.usageData.plays, 
     	    				         clip.usageData.avgRating, 
     	    				         clip.usageData.totalRatings, 
     	    				         clip.usageData.totalComments, 
     	    				         clip.usageData.fbShares, 
     	    				         clip.usageData.emailShares, 
     	    				         clip.coverArtImageBytes, 
     	    				         clip.shortDescription, 
     	    				         clip.userId, 
     	    				         clip.language, 
     	    				         clip.encryptedId, 
     	    				         clip.userRating, 
     	    				         clip.userName, 
     	    				         clip.category, 
     	    				         clip.mood, 
     	    				         clip.start, 
     	    				         clip.stop, 
     	    				         clip.canEdit, 
     	    				         clip.canComment, 
     	    				         clip.originatingServerPath, 
     	    				         clip.recorded,
     	    				         clip.ts === undefined ? 0 : clip.ts
     	    				],
     	    				function(success) { Utility.debug("success");}, function(tx, error) { 
     	    					Utility.debug("insert clip failed:" + error.message);
     	    					});
     	    			});
     	    		},
     	    		getAllArtists: function($scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
    	    			     $scope.values = new Array();

     	    			    tx.executeSql('SELECT DISTINCT artists FROM CLIPS WHERE artists IS NOT NULL AND artists <> "" ORDER BY artists', [], function(tx, results) {
     	    			      for(var i=0; i<results.rows.length; i++) {
     	    			    	 $scope.values.push(results.rows.item(i).artists);
     	    			      }
     	    			      $scope.loading = false;
     	    			     $scope.$apply();
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("artists retrieval failed:" + error.message);
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getClipsByArtist: function(artist, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE artists="' + artist + '"  ORDER BY title', [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clips by artists retrieval failed:" + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getAllRecordedClips: function($scope, orderby) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				var orderByClause = "";
     	    				var suffix = "ASC";
     	    				if (orderby == "time") {
     	    					orderByClause = "ts";
     	    					suffix = "DESC";
     	    				} else {
     	    					orderByClause = "title";
     	    					suffix = "ASC"
     	    				}
     	    				var clipsql = 'SELECT ID, title, album, description, coverArtImageBytes, usage_uploadedDate FROM CLIPS ORDER BY ' + orderByClause + ' ' + suffix;
     	    			    tx.executeSql(clipsql, [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("all clips retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getAllClips: function($scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				var clipsql = 'SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS ORDER BY title';
     	    			    tx.executeSql(clipsql, [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("all clips retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		deleteClip: function(clipId) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    			    tx.executeSql('DELETE FROM CLIPS where ID= ?', [clipId], function(tx, results) {
     	    			    	//do nothing if successful
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("delete by clip id failed:" + error.message);
     	    			});
     	    		},
     	    		getClipByID: function(clipId, callbackfn) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
         	    			var clipQueryFields = "ID, title, album, artists, composers, lyricists, lyrics, description, genre, year, keywords, coverArtUrl, url, usage_uploadedDate, usage_processedDate, usage_IndexedDate, usage_plays, usage_avgRating,usage_totalRatings, usage_totalComments, usage_fbShares, usage_emailShares, coverArtImageBytes, shortDescription, userId, language, userRating, userName, category, mood";
         	    			var clipIdsToQuery = clipId.split(",");
         	    			var placeHolders = generatePlaceHolders(clipIdsToQuery);
     	    			    tx.executeSql('SELECT ' + clipQueryFields + ' FROM CLIPS where ID IN (' + placeHolders + ')',clipIdsToQuery, function(tx, results) {
 	    			    		var tempClips = new Array();
 	    			    		for(var i=0; i<results.rows.length; i++) {
 	    			    			var tempClip = results.rows.item(i);
 	    			    			tempClip.usageData = {};
 	    			    			tempClip.usageData.uploadedDate = tempClip.usage_uploadedDate;
 	    			    			tempClip.usageData.processedDate =tempClip.usage_processedDate 
 	    			    			tempClip.usageData.IndexedDate=tempClip.usage_IndexedDate
 	    			    			tempClip.usageData.plays=tempClip.usage_plays
 	    			    			tempClip.usageData.avgRating=tempClip.usage_avgRating
 	    			    			tempClip.usageData.totalRatings=tempClip.usage_totalRatings
 	    			    			tempClip.usageData.totalComments=tempClip.usage_totalComments
 	    			    			tempClip.usageData.fbShares=tempClip.usage_fbShares
 	    			    			tempClip.usageData.emailShares=tempClip.usage_emailShares
 	    			    			
 	    			    			tempClips.push(tempClip);
 	    			    		}
 	    			    		callbackfn(tempClips);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clip by clip id failed:" + error.message);
     	    				callbackfn(null);
     	    			});
     	    		},
     	    		getAllAlbums: function($scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				$scope.values = new Array();
     	    			    tx.executeSql('SELECT DISTINCT album FROM CLIPS WHERE album IS NOT NULL AND album <> ""  ORDER BY album', [], function(tx, results) {
     	    			      for(var i=0; i<results.rows.length; i++) {
     	    			    	 $scope.values.push(results.rows.item(i).album);
     	    			      }
     	    			      $scope.loading = false;
     	    			     $scope.$apply();
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("albums retrieval failed " + error.message);
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getClipsByAlbum: function(album, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE album ="' + album + '" ORDER BY title', [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clips by album retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getAllLanguages : function($scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				$scope.values = new Array();
     	    			    tx.executeSql('SELECT DISTINCT language FROM CLIPS WHERE language IS NOT NULL AND language <> "" ORDER BY language', [], function(tx, results) {
     	    			      for(var i=0; i<results.rows.length; i++) {
     	    			    	 $scope.values.push(results.rows.item(i).language);
     	    			      }
     	    			      $scope.loading = false;
     	    			     $scope.$apply();
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("languages retrieval failed " + error.message);
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getClipsByLanguage: function(language, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE language= "' + language + '" ORDER BY title', [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clips by language retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getAllGenres : function($scope) {
     	    			var db = openSWDB();
     	    			
     	    			db.transaction(function(tx) {
     	    				$scope.values = new Array();
     	    			    tx.executeSql('SELECT DISTINCT genre FROM CLIPS WHERE genre IS NOT NULL AND genre <> "" ORDER BY genre', [], function(tx, results) {
     	    			      for(var i=0; i<results.rows.length; i++) {
     	    			    	 $scope.values.push(results.rows.item(i).genre);
     	    			      }
     	    			      $scope.loading = false;
     	    			     $scope.$apply();
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("genre retrieval failed " + error.message);
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getClipsByGenre : function(genre, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE genre= "' + genre + '" ORDER BY title', [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clips by genre retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getAllCategories : function($scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				$scope.values = new Array();
     	    			    tx.executeSql('SELECT DISTINCT category FROM CLIPS WHERE  category IS NOT NULL AND category <> "" ORDER BY category', [], function(tx, results) {
     	    			      for(var i=0; i<results.rows.length; i++) {
     	    			    	 $scope.values.push(results.rows.item(i).category);
     	    			      }
     	    			      $scope.loading = false;
     	    			     $scope.$apply();
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("categorys retrieval failed " + error.message);
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getClipsByCategory : function(category, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE category= "' + category + '" ORDER BY title', [], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("clips by category retrieval failed " + error);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		},
     	    		getRecordedClipsByUser : function(userId, $scope) {
     	    			var db = openSWDB();
     	    			db.transaction(function(tx) {
     	    				//TODO optimize to make sure the sql injection hole is closed
     	    			    tx.executeSql('SELECT ID, title, album, description, coverArtImageBytes FROM CLIPS WHERE userId= ? and recorded = "true" ORDER BY title', [userId], function(tx, results) {
     	    			      return collectClips(results, $scope);
     	    			    });
     	    			}, function(tx, error) {
     	    				Utility.debug("recorded clips by user retrieval failed " + error.message);
     	    				$scope.downloadedClips = new Array();
     	    				$scope.loading = false;
     	    				 $scope.$apply();
     	    			});
     	    		}
     	    	}
     	    }
     	 ])
        .factory('ClipSearchResults', [
            function () {
                return {
                	setResultsStart: function(val) {
                		resultsStart = val;
                	},
                	getResultsStart: function() {
                		return resultsStart;
                	},
                	setResultsLen: function(val) {
                		resultsLen = val;
                	},
                	getResultsLen: function() {
                		return resultsLen;
                	},
                	resetSearch: function() {
                		newSearch = false;
                		resultsStart=0;
                	},
                	isNewSearch: function() {
                		return newSearch;
                	},
                	setTotalPlaylistsLoaded: function(val) {
                		totalPlaylistsLoaded = val;
                	},
                	getTotalPlaylistsLoaded: function() {
                		return totalPlaylistsLoaded;
                	},
                    setLastSearchTerm : function(val) {
                        lastSearchTerm = val;
                    },
                    getLastSearchTerm: function() {
                        return lastSearchTerm;
                    },
                    getClips: function () {
                        return clips;
                    },
                    setClips: function(arr) {
                    	clips = arr;
                    },
                    getClip: function (index) {
                        //return findById(parseInt(employee.employeeId));
                    	return clips[index];
                    },
                    getPlaylists: function () {
                        return playlists;
                    },
                    getPlaylist: function (index) {
                        //return findById(parseInt(employee.employeeId));
                    	return playlists[index];
                    },
                    setPlaylists: function (arr) {
                    	playlists=arr;
                    },
                    getRadios: function () {
                        return radios;
                    },
                    getRadio: function (index) {
                        //return findById(parseInt(employee.employeeId));
                    	return radios[index];
                    },
                    setRadios: function (arr) {
                    	radios=arr;
                    }

                }

            }]);

}());

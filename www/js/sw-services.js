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
    
    function LocalPlaylist(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl) {
		    this.currentindex = 0;
		    this.clips = new Array();
		    this.title = "Unsaved";
		    this.coverArtUrl = "../img/playlist.png"; 
		    	
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
    	}

    var currentPlaylist = new LocalPlaylist(),
    currentRadio = null,
    
    setCurrentPlaylist = function(playlist) {
    	currentPlaylist = playlist;
    },
    getCurrentPlaylist = function() {
    	return currentPlaylist;
    },	
    findById = function (id) {
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
     	    		
     	    		setCurrentPlaylistProps: function(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl) {
     	    			currentPlaylist = new LocalPlaylist(id, title, description, keywords, owner, clips, currentindex, ownerName, canEdit, updatedDate, userRating, avgRating, emailShares, fbShares, plays, totalComments, totalRatings, userProfilePic, currentplayingpos, playing, coverArtUrl);
     	    		},
     	    		clearPlaylist: function() {
     	    			currentPlaylist = null;
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
     	    			if (currentPlaylist == null) {
     	    				currentPlaylist = new LocalPlaylist();
     	    			}
     	    			return currentPlaylist.clips.push(cl)-1;     	    			
     	    		},
     	    		clearPlaylistClips: function() {
     	    			currentPlaylist.clips = new Array();
     	    		},
     	    		setCurrentIndex: function (index) {
     	    			currentPlaylist.currentindex = index;
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

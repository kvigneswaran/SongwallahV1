angular.module('swMobile.controllers', [])
    .controller('MyDeviceCtrl', ['$scope', '$rootScope', '$window', '$location', '$http','LocalClipStore', function ($scope, $rootScope, $window, $location, $http, LocalClipStore) {
    	
     $scope.displaydownloads = function(type){
	    	switch(pageId){
		     	case 1 :
	     				$scope.downloadedClips = LocalClipStore.getAllClips();
	     				$scope.showclips = true;
	     				$scope.selectedgroup = "all";
	     				$location.path('/mydownloads');
	     				break;
		     	case 2:
			     		$scope.values = LocalClipStore.getAllLanguages();
	     				$scope.showclips = false;
	     				$scope.selectedgroup = "language";
	     				$location.path('/mydownloads');
			     		break;
		     	case 3:
			     		$scope.downloadedClips = LocalClipStore.getAllClips();
	     				$scope.showclips = false;
	     				$scope.selectedgroup = "album";
	     				$location.path('/mydownloads');
	     				break;
     			case 4 :
	     				$scope.downloadedClips = LocalClipStore.getAllClips();
	     				$scope.showclips = false;
	     				$scope.selectedgroup = "artists";
	     				$location.path('/mydownloads');
	     				break;
     			case 5 : 
	     				$scope.downloadedClips = LocalClipStore.getAllClips();
	     				$scope.showclips = false;
	     				$scope.selectedgroup = "genre";
	     				$location.path('/mydownloads');
	     				break;
     		}
     }
     
     $scope.showclipsbygroup = function(){
    	 	console.debug("get clips based on group");
     }
     
    }]);
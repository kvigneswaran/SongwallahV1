'use strict';

angular.module('swMobile', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'swMobile.controllers',
    'swMobile.swServices',
    'swMobile.swPlayer',
    'swMobile.directives',
    'ui.bootstrap.rating',
    'truncate',
    'angularFileUpload'
    
    //,'ionic',
    //,'ionic.contrib.ui.cards'
])
//.config(function ($httpProvider) {
//	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//    $httpProvider.defaults.transformRequest = function(data){
//        if (data === undefined) {
//            return data;
//        }
//        return $.param(data);
//    }
//})
.config(['$routeProvider', function ($routeProvider) {
	
	//TODO for emulate.phonegap.com
	
	$routeProvider.when('/explore', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/explore.html', controller: 'ExploreCtrl'});
	$routeProvider.when('/clipsearch', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/clip-list.html', controller: 'ClipListCtrl'});
    $routeProvider.when('/clips/:clipIndex', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/clip-detail.html', controller: 'ClipDetailCtrl'});
	$routeProvider.when('/playlists/:playlistIndex', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/playlist-detail.html', controller: 'PlaylistDetailCtrl'});	
	$routeProvider.when('/radios/:radioIndex', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/radio-detail.html', controller: 'RadioDetailCtrl'});	
    $routeProvider.when('/myoptions', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/myoptions.html', controller: 'MyOptionsCtrl'});
    $routeProvider.when('/myfavorites', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/myfavorites.html', controller: 'MyFavoritesCtrl'});
    $routeProvider.when('/record', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/recordaudio.html', controller: 'RecordAudioCtrl'});
    $routeProvider.when('/myplaylists', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/myplaylists.html', controller: 'MyPlaylistsCtrl'});
    $routeProvider.when('/myradios', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/myradios.html', controller: 'MyRadiosCtrl'});
    $routeProvider.when('/alllatestclips', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/latestuploads-list.html', controller: 'LatestUploadsCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/settings.html', controller: 'MySettingsCtrl'});
    $routeProvider.when('/signup', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/signup.html', controller: 'SignupCtrl'});
    $routeProvider.when('/mydownloads/:category', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/mydownloads.html', controller: 'MyDownloadsCtrl'});
    $routeProvider.when('/mydevice', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/mydevice.html', controller: 'MyDeviceCtrl'});  
    $routeProvider.when('/allrecentclips', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/recentclips-list.html', controller: 'RecentClipsCtrl'});
	$routeProvider.when('/localclipsearch', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/localclip-list.html', controller: 'LocalClipListCtrl'});
    $routeProvider.when('/myrecordings', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/myrecordings.html', controller: 'MyRecordingsCtrl'});
    $routeProvider.when('/syslog', {templateUrl: 'http://dev.songwallah.com:9080/sw/mobile/www/partials/syslog.html', controller: 'SysLogCtrl'});

    
    //TODO for build.phonegap.com
    /*
	$routeProvider.when('/explore', {templateUrl: 'partials/explore.html', controller: 'ExploreCtrl'});
	$routeProvider.when('/clipsearch', {templateUrl: 'partials/clip-list.html', controller: 'ClipListCtrl'});
    $routeProvider.when('/clips/:clipIndex', {templateUrl: 'partials/clip-detail.html', controller: 'ClipDetailCtrl'});
	$routeProvider.when('/playlists/:playlistIndex', {templateUrl: 'partials/playlist-detail.html', controller: 'PlaylistDetailCtrl'});	
	$routeProvider.when('/radios/:radioIndex', {templateUrl: 'partials/radio-detail.html', controller: 'RadioDetailCtrl'});	
    $routeProvider.when('/myoptions', {templateUrl: 'partials/myoptions.html', controller: 'MyOptionsCtrl'});
    $routeProvider.when('/myfavorites', {templateUrl: 'partials/myfavorites.html', controller: 'MyFavoritesCtrl'});
    $routeProvider.when('/record', {templateUrl: 'partials/recordaudio.html', controller: 'RecordAudioCtrl'});
    $routeProvider.when('/myplaylists', {templateUrl: 'partials/myplaylists.html', controller: 'MyPlaylistsCtrl'});
    $routeProvider.when('/myradios', {templateUrl: 'partials/myradios.html', controller: 'MyRadiosCtrl'});
    $routeProvider.when('/alllatestclips', {templateUrl: 'partials/latestuploads-list.html', controller: 'LatestUploadsCtrl'});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'MySettingsCtrl'});
    $routeProvider.when('/signup', {templateUrl: 'partials/signup.html', controller: 'SignupCtrl'});
    $routeProvider.when('/mydownloads/:category', {templateUrl: 'partials/mydownloads.html', controller: 'MyDownloadsCtrl'});
    $routeProvider.when('/mydevice', {templateUrl: 'partials/mydevice.html', controller: 'MyDeviceCtrl'});  
    $routeProvider.when('/allrecentclips', {templateUrl: 'partials/recentclips-list.html', controller: 'RecentClipsCtrl'});
	$routeProvider.when('/localclipsearch', {templateUrl: 'partials/localclip-list.html', controller: 'LocalClipListCtrl'});
    */
	
	$routeProvider.otherwise({redirectTo: '/explore'});
}])

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate) {
  var cardTypes = [
    { title: 'Swipe down to clear the card', image: 'img/pic.png' },
    { title: 'Where is this?', image: 'img/pic.png' },
    { title: 'What kind of grass is this?', image: 'img/pic2.png' },
    { title: 'What beach is this?', image: 'img/pic3.png' },
    { title: 'What kind of clouds are these?', image: 'img/pic4.png' }
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    card.swipe();
  };
});

'use strict';

angular.module('swMobile', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'swMobile.controllers',
    'swMobile.swServices',
    'swMobile.swPlayer',
    'swMobile.directives',
    'ui.bootstrap.rating',
    'truncate'
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
	
	//TODO uncomment next 6 lines for build.phonegap.com
	$routeProvider.when('/clipsearch', {templateUrl: 'partials/clip-list.html', controller: 'ClipListCtrl'});
    $routeProvider.when('/clips/:clipIndex', {templateUrl: 'partials/clip-detail.html', controller: 'ClipDetailCtrl'});
	$routeProvider.when('/playlists/:playlistIndex', {templateUrl: 'partials/playlist-detail.html', controller: 'PlaylistDetailCtrl'});	
	$routeProvider.when('/radios/:radioIndex', {templateUrl: 'radio-detail.html', controller: 'RadioDetailCtrl'});	
    $routeProvider.when('/myoptions', {templateUrl: 'partials/myoptions.html', controller: 'MyOptionsCtrl'});
    $routeProvider.when('/myfavorites', {templateUrl: 'partials/myfavorites.html', controller: 'MyFavoritesCtrl'});

    //TODO comment next 6 lines for build.phonegap.com
//	$routeProvider.when('/clipsearch', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/clip-list.html', controller: 'ClipListCtrl'});
//    $routeProvider.when('/clips/:clipIndex', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/clip-detail.html', controller: 'ClipDetailCtrl'});
//	$routeProvider.when('/playlists/:playlistIndex', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/playlist-detail.html', controller: 'PlaylistDetailCtrl'});	
//	$routeProvider.when('/radios/:radioIndex', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/radio-detail.html', controller: 'RadioDetailCtrl'});	
//    $routeProvider.when('/myoptions', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/myoptions.html', controller: 'MyOptionsCtrl'});
//    $routeProvider.when('/myfavorites', {templateUrl: 'http://www.songwallah.com/sw/mobile/www/partials/myfavorites.html', controller: 'MyFavoritesCtrl'});
    
	$routeProvider.otherwise({redirectTo: '/clipsearch'});
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

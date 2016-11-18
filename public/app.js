'use strict';

// Declare app level module which depends on views, and components
angular.module('homeApp', [
 'ngRoute',
 'myApp.view1',
 'myApp.view2',
 'ngMaterial',
 'ngAnimate'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
   $routeProvider
   .when("/view1", {
       templateUrl : "./view1/view1.html",
       controller: 'View1Ctrl'
   })
   .when("/view2", {
       templateUrl : "./view2/view2.html",
       controller: 'View2Ctrl'
   })
   .otherwise({redirectTo: '/view1'});
}]).
controller('mainCtrl', function($scope, appService, $timeout) {
 $scope.currentNavItem = 'page1';

 (function tick(){
        $scope.isOnline = appService.getStatus();
        console.log($scope.isOnline);
        $timeout(tick, 1000);
 })();

 

})
.service('appService', function(){


	this.status = false;
	return {

		
		getStatus : function (){
			return this.status;
		},

		setStatus : function (status) {
			//console.log('set', status);
			this.status = status;
		}

	}


});
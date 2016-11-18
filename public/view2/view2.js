'use strict';

angular.module('myApp.view2', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ui.mask'])

.controller('View2Ctrl', [ '$scope', '$http', '$q', '$timeout', 
							function($scope, $http, $q, $timeout, ngMaterial, ngAnimate) {
  $scope.currentNavItem = 'page2';

function procesarInfo() {
  	return $q(function(resolve,reject){
  		var pArray = [];
  		var iArray = [];
  		var dArray = [];

  		var sendArray = [];

  		var pgain;
  		var igain;
  		var dgain;

  		pArray = makeArray($scope.pGain);
  		iArray = makeArray($scope.iGain);
  		dArray = makeArray($scope.dGain);


  		pgain = addPoint(pArray);
  		igain = addPoint(iArray);
  		dgain = addPoint(dArray);

  		sendArray.push(pgain);
  		sendArray.push(igain);
  		sendArray.push(dgain);
  		resolve(sendArray);
  	});
  };

  $scope.sending = false;

  $scope.enviarPID = function() {

  		procesarInfo().then(function(response){
  			var p = response[0]+'p';
  			var i = response[1]+'i';
  			var d = response[2]+'d';
  			var send = p + ';' + i + ';' + d + ';';
  			console.log('send', send);
  			if(!$scope.sending){
	        	$scope.sending = true;
	  			$http({
	            method: 'GET',
	            url: '/esp8266/pid?params='+send
	            }).then(function(response){
	            	console.log("Motor", response);
	            	$timeout(function(){
	            		$scope.sending = false;
	            	},1000)
	            	
                }).catch(function(err){
	            	console.log(err);
	         	});
         	}
  		});


  };

  function makeArray(numberGain){

  		return (numberGain !== undefined) ? numberGain.split('') : undefined;
  };

  function addPoint(arrayGain){
  		return (arrayGain !== undefined) ? arrayGain[0]+arrayGain[1]+arrayGain[2]+'.'+arrayGain[3]+arrayGain[4]+arrayGain[5] : "000.000";
  };

}]);
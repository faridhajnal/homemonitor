//'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngResource'])

.controller('View1Ctrl', ['$scope','StatService','$timeout' , '$http', '$mdDialog', 'appService',
    function($scope, StatService, $timeout, $http, $mdDialog, appService) {
  
  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
  $scope.sending = false;
  $scope.currentNavItem = 'page1';

  $scope.$watch('master', function(n,o){
    console.log(n);
    if(!(n === undefined || n === null)){
      if(!$scope.sending){
        $scope.sending = true;
      $http({
            method: 'GET',
            url: '/esp8266/motor?params='+n
            }).then(function(response){
              console.log("Posición", response);
              $timeout(function(){
                $scope.sending = false;
              },500);
            }).catch(function(err){
              console.log(err);
         });          
      }
      $scope.curtainStyle = {
       "transform" : "scaleY(" + (100-n)/100 + ")"
      };
    }
    
    console.log($scope.curtainStyle);
  });

  $scope.showTabDialog = function(ev) {
    console.log('show');
      $mdDialog.show({
      controller: DialogController,
      templateUrl: 'templates/tabdialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
  };

  $scope.motorDirection = "Izquierda"; //initializing view's value

  $scope.motorSpeed = 0; //initializing view's value

  $scope.sendMotorInfo = function(){

    var dir = $scope.motorDirection === "Izquierda" ? 0 : 1;
    var speed = $scope.motorSpeed;
    var params = dir + "," + speed;

    /* Send motor info to ESP 8266 (turn and speed : [0,450]) */

    $http({
            method: 'GET',
            url: '/esp8266/motor?params='+params
            }).then(function(response){
            console.log("Motor", response);
             }).catch(function(err){
            console.log(err);
         });

    };

    /*obtain (encoder´s) position from server, every 2 seconds and refresh page */

    (function tick(){
            $http({
            method: 'GET',
            url: '/esp8266/position'
            }).then(function(response){
            var isOnline = !(response.data.message==="Device not found" || response.data === "");
            appService.setStatus(isOnline);            
            console.log("Analog", response);
            $scope.posicion = response.data.position;
             }).catch(function(err){
            console.log(err);
            });
        $timeout(tick, 2000);
    })();
    
}])
.service('StatService',['$resource', function($resource){
    return $resource('stats', {}, {
        get: {method: 'GET'}
    })
}]) ;

'use strict'

// Accesando informacion de los GPIOs para desplegar en pagina web


var PiStats = function(){
  var stats = {};


  var getTemperature = function(cb){
       stats.temperature = 28.4;

      if(cb !== undefined)
        cb(null, stats);
  };

  var getPressure = function(cb){
       stats.pressure = 22.81;

      if(cb !== undefined)
        cb(null, stats);
  };

  var getDistance = function(cb){
      stats.distance = 11;
      if(cb !== undefined)
        cb(null, stats);
  };

  var isMoving = function(cb){
       stats.motion = 'Detenido';
      if(cb !== undefined)
        cb(null, stats);
  };


  return{
    getTemperature: getTemperature,
    getPressure: getPressure,
    getDistance: getDistance,
    isMoving: isMoving,
    update: function(cb){
      getTemperature(function(err, data){
        getPressure(function(err1, data1){
          getDistance(function(err2, data2){
              isMoving(function(err3, data3){
                  cb(err3, data3);
              }); 
          });
        });
      });
    }
  };
}();

module.exports = PiStats;
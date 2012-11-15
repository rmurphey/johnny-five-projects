var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo( 3 );

  var lcd = new five.LCD({
    pins: [ 7, 8, 9, 10, 11, 12 ],
  });

  var pot = new five.Sensor( "A1" ).scale( 0, 180 );
  var range = new five.Sensor({
    pin: "A0",
    freq: 1000
  });

  pot.on("slide", function() {
    servo.move( Math.round(this.value) );
  });

  range.on( "read", function() {
    lcd.clear();
    lcd.print( "RANGE: " + Math.floor( this.normalized * 100 ) / 100 );
  });

});
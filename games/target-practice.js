var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo( 3 );

  var lcd = new five.LCD({
    pins: [ 7, 8, 9, 10, 11, 12 ],
  });

  var pot = new five.Sensor( "A1" ).scale( 0, 180 );
  var range = new five.Sensor( "A0" );

  var servoPosition = 0;
  var dist;

  servo.move( servoPosition );

  pot.on("slide", function() {
    servoPosition = Math.round( this.value );
    servo.move( servoPosition );
  });

  range.on( "read", function() {
    dist = Math.floor( this.normalized * 100 ) / 100;
  });


  function updateScreen() {
    lcd.clear();
    lcd.print( "RANGE: " + dist );
    lcd.setCursor( 0, 1 );
    lcd.print( "ANGLE: " + servoPosition );

    setTimeout( updateScreen, 2000 );
  }

  updateScreen();
});
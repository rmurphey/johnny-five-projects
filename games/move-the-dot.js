var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
  var joystick = new five.Joystick({
    // Joystick pins are an array of pins
    // Pin orders:
    //   [ up, down, left, right ]
    //   [ ud, lr ]
    pins: [ "A0", "A1" ],
    freq: 500
  });

  var lc = new five.LedControl({
    pins: {
      data: 2,
      clock: 3,
      cs: 4
    },
    devices: 1,
    isMatrix: true
  });

  lc.on( 0 );
  lc.brightness( 0, 50 );
  lc.clear( 0 );

  var currentRow = 0;
  var currentCol = 0;

  var maxRow = 7;
  var maxCol = 7;

  setDot();

  joystick.on( "axismove", function() {
    var x = this.fixed.x;
    var y = this.fixed.y;

    if ( x > 0.6 ) {
      currentCol = currentCol === 7 ? 0 : ( currentCol + 1 );
    }

    if ( x < 0.4 ) {
      currentCol = currentCol === 0 ? 7 : ( currentCol - 1 );
    }

    if ( y > 0.6 ) {
      currentRow = currentRow === 0 ? 7 : ( currentRow - 1 );
    }

    if ( y < 0.4 ) {
      currentRow = currentRow === 7 ? 0 : ( currentRow + 1 );
    }

    setDot();
  });

  function setDot() {
    var val;
    lc.clear( 0 );

    for ( var row = 0; row <= maxRow; row++ ) {
      if ( row === currentRow ) {
        val = 1 << ( maxCol - currentCol );
      } else {
        val = 0;
        lc.row( 0, row, 0 );
      }

      process.nextTick(function() { lc.row( 0, row, val ); });
    }
  }

  board.repl.inject({
    lc: lc
  });
});
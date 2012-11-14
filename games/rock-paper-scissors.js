var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
  var buttons = {
    rock: new five.Button(2),
    paper: new five.Button(3),
    scissors: new five.Button(4)
  };

  var lcd = new five.LCD({
    pins: [ 7, 8, 9, 10, 11, 12 ]
  });

  var gameOverLED = new five.Led( 13 );

  var losers = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
  };

  var choices = Object.keys( losers );
  var waiting = false;
  var computerPoints = 0;
  var playerPoints = 0;
  var totalTurns = 5;
  var isGameOver = false;
  var points = {};

  choices.forEach(function( buttonName ) {
    var button = buttons[ buttonName ];
    button.on( "up", function() {
      turn( buttonName );
    });
  });

  reset();

  function computerChoice() {
    return choices[ Math.floor( Math.random() * choices.length ) ];
  }

  function reset() {
    points = {
      player: 0,
      computer: 0
    };

    isGameOver = false;
  }

  function turn( player ) {
    if ( waiting ) { return; }

    gameOverLED.off();
    waiting = true;

    var computer = computerChoice();

    if ( player !== computer ) {
      points[ playerIsWinner( player, computer ) ? "player" : "computer" ]++;
    }

    updateScoreboard( player, computer );

    waiting = false;

    if ( points.player > 3 || points.computer > 3 ) {
      gameOver();
    }
  }

  function playerIsWinner( playerChoice, computerChoice ) {
    return losers[ computerChoice ] !== playerChoice;
  }

  function updateScoreboard( playerChoice, computerChoice ) {
    lcd.clear();
    lcd.print( "Robot : " + points.computer + " : " +
      computerChoice.substr(0, 1).toUpperCase() );
    lcd.setCursor( 0, 1 );
    lcd.print( "Human : " + points.player +   " : " +
      playerChoice.substr(0, 1).toUpperCase() );
  }

  function gameOver() {
    lcd.clear();

    lcd.print(
      points.computer > points.player ?
      'ROBOT WINS' :
      'HUMAN WINS'
    );

    gameOverLED.on();

    reset();
  }

  board.repl.inject({
    buttons: buttons,
    lcd: lcd,
    gameOverLED: gameOverLED
  })
});
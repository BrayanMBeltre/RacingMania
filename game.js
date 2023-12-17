var screenWidth = 360;
var screenHeight = 660;
var roadWidth = 250;
var sideRoadWidth = (screenWidth - roadWidth) / 2;

var im_car_green;
var im_car_red;
var im_boom;
var im_heart;
var font;
var playerSpeed = 7;
var opponents = [];
var ammets = [];
var roadMarkings = [];
var score = 0;
var lives = 3;
var infractions = 0;
var kilometers = 100;
var startScreen = true;
var cvn;

// TODO:
// - Add sound effects
// DONE - Invert oponent's car direction
// - Add a start screen
// WIP - Add side barriers : Brayan
// DONE - Add restart button
// - Add background music
// WIP - Add "Ammet"
// DONE - Add another line of cars : Brayan
// - Make the car move fixed distance when turning
// DONE - Change score for km
// DONE- When you crash against an "Ammet" get 1 infraction
// DONE- When you crash against a car you loose 1 lives

function preload() {
  im_car_green = loadImage("assets/Car_Green.png");
  im_car_red = loadImage("assets/Car_Red.png");
  im_boom = loadImage("assets/boom.png");
  im_heart = loadImage("assets/heart.png");
  font = loadFont("assets/8-bit.ttf");
  background_sound = loadSound("assets/background_music.mp3");
}

function setup() {
  cvn = createCanvas(screenWidth, screenHeight);

  //By default, rotations are specified in radians
  angleMode(DEGREES);

  // frameRate(50);  // se puede usar esto para diferentes dificultados

  // play sound
  background_sound.play();

  roadMarkings.push(new roadMarking());
  opponents.push(new Opponent());
  ammets.push(new Ammet());
  player = new Player();
}

function draw() {
  if (startScreen) {
    showStartScreen();
    return;
  }

  background(44, 44, 44);

  // Show side roads
  strokeWeight(0);
  fill(255, 255, 255);
  rect(0, 0, sideRoadWidth, screenHeight);
  rect(screenWidth - sideRoadWidth, 0, sideRoadWidth, screenHeight);

  // each 60 frames, kilometers decrease by 1
  if (frameCount % 60 === 0) {
    kilometers -= 1;
  }

  // New road markings appear after certain number of frames
  if (frameCount % 25 === 0) {
    roadMarkings.push(new roadMarking());
  }

  // Show road markings
  for (var i = roadMarkings.length - 1; i >= 0; i--) {
    roadMarkings[i].show();
    roadMarkings[i].update();

    // Remove road markings once the are off the screen
    if (roadMarkings[i].offscreen()) {
      roadMarkings.splice(i, 1);
    }
  }

  // New opponents appear after certain number of frames
  if (frameCount % 130 === 0) {
    opponents.push(new Opponent(width / 2, height, 20));
  }

  // Show opponents
  for (var i = opponents.length - 1; i >= 0; i--) {
    opponents[i].show();
    opponents[i].update();

    if (
      opponents[i].overtakenBy(player) &&
      opponents[i].isOvertakenBy === false
    ) {
      score += 5;
      opponents[i].isOvertakenBy = true;
    }

    // If opponents collide with the player, they get destroyed
    if (opponents[i].hits(player)) {
      opponents[i].boom();
      opponents.splice(i, 1);

      // Penalty for collision with opponent
      lives -= 1;
    }

    // Remove opponents once the are off the screen
    else if (opponents[i].offscreen()) {
      opponents.splice(i, 1);
    }
  }

  // New ammet appear after certain number of frames
  if (frameCount % 130 === 0) {
    ammets.push(new Ammet());
  }

  // Show ammets
  for (var i = ammets.length - 1; i >= 0; i--) {
    ammets[i].show();
    ammets[i].update();

    if (ammets[i].overtakenBy(player) && ammets[i].isOvertakenBy === false) {
      score += 5;
      ammets[i].isOvertakenBy = true;
    }

    // If ammets collide with the player, they get destroyed
    if (ammets[i].hits(player)) {
      ammets[i].boom();
      ammets.splice(i, 1);

      // Penalty for collision is +1 infraction
      infractions += 1;
    }

    // Remove ammets once the are off the screen
    else if (ammets[i].offscreen()) {
      ammets.splice(i, 1);
    }
  }

  // Show the player
  player.show();

  // Game controls
  if (keyIsDown(LEFT_ARROW)) {
    player.turnLeft();
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.turnRight();
  }

  // Show player stats
  textSize(40);
  textFont(font);
  textAlign(LEFT);
  fill(255);
  text("Km: " + kilometers, 30, 60);

  // Show infractions
  textSize(40);
  textFont(font);
  textAlign(RIGHT);
  fill(255);
  text("infractions: " + infractions, 240, 120);

  for (var i = 0; i < lives; i++) {
    image(im_heart, 30 + i * 70, height - 60);
  }

  // Check if game is over
  if (lives <= 0 || infractions >= 3) {
    noLoop();

    gameOver();
  }

  // Check if player wins
  if (kilometers <= 0) {
    noLoop();

    winningScreen();
  }
}

// game over screen
function gameOver() {
  overlay();

  textSize(60);
  textFont(font);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(255);
  text("GAME OVER", width / 2, height / 2);

  textSize(20);
  text("press ENTER to restart", width / 2, height / 2 + 60);
}

function overlay() {
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);
}

function restart() {
  opponents = [];
  ammets = [];
  score = 0;
  lives = 3;
  infractions = 0;
  kilometers = 100;

  loop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    restart();
  }
}

function winningScreen() {
  overlay();

  textSize(60);
  textFont(font);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(255);
  text("YOU WIN", width / 2, height / 2);

  textSize(20);
  text("press ENTER to restart", width / 2, height / 2 + 60);
}

function showStartScreen() {
  overlay();

  textSize(55);
  textFont(font);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(255);
  text("START GAME", width / 2, height / 2);

  textSize(20);
  text("press ENTER to start", width / 2, height / 2 + 60);

  if (!background_sound.isPlaying()) {
    background_sound.stop();
  }

  cvn.mouseClicked(startGame);

  if (keyIsDown(ENTER)) {
    startGame();
  }
}

function startGame() {
  startScreen = false;
  // background_sound.play();
}

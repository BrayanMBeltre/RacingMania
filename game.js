var roadWidth = 250;
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
var lives = 5;
var infractions = 0;

// TODO:
// - Add sound effects
// - Invert oponent's car direction
// - Add a start screen
// - Add side barriers : Brayan
// - Add restart button
// - Add background music
// - Add "Ammet"
// DONE - Add another line of cars : Brayan
// - Make the car move fixed distance when turning
// - Make
// - car stop to collision Ale - asi dices?
// - Change score for Time
// - When you crash against an "Ammet" you loose 1 life
// - When you crash against a car you loose 2 lives

function preload() {
  im_car_green = loadImage("assets/Car_Green.png");
  im_car_red = loadImage("assets/Car_Red.png");
  im_boom = loadImage("assets/boom.png");
  im_heart = loadImage("assets/heart.png");
  font = loadFont("assets/8-bit.ttf");
}

function setup() {
  createCanvas(360, 660);
  // frameRate(50);  // se puede usar esto para diferentes dificultados

  roadMarkings.push(new roadMarking());
  opponents.push(new Opponent());
  ammets.push(new Ammet());
  player = new Player();
}

function draw() {
  background(44, 44, 44);

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

      // Penalty for collision is -10, and you loose one life
      score = score >= 10 ? score - 10 : 0;
      lives -= 2;
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
  text("Score: " + score, 30, 60);

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
  lives = 5;
  infractions = 0;
  loop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    restart();
  }
}

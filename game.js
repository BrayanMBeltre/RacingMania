var roadWidth = 250;
var sideRoadWidth;

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
var showStartScreen = true;
var cnv;

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
  font = loadFont("assets/8-bit.ttf");

  im_car_green = loadImage("assets/Car_Green.png");
  im_car_red = loadImage("assets/Car_Red.png");
  im_boom = loadImage("assets/boom.png");
  im_heart = loadImage("assets/heart.png");
  im_heart_empty = loadImage("assets/heart_empty.png");
  im_warning_empty = loadImage("assets/warning_empty.svg");
  im_warning = loadImage("assets/warning.svg");

  im_left_side_road = loadImage("assets/sea.png");
  im_right_side_road = loadImage("assets/city.png");
  im_mobile_left_side_road = loadImage("assets/left_side_road.png");
  im_mobile_right_side_road = loadImage("assets/right_side_road.png");

  im_ammet = loadImage("assets/ammet.png");
  im_medium_hud_bg = loadImage("assets/medium_hud_bg.svg");
  im_small_hud_bg = loadImage("assets/small_hud_bg.svg");
  im_background_sea = loadImage("assets/sea_bg.png");
  im_rd_map = loadImage("assets/rd_map.png");
  im_logo = loadImage("assets/logo.png");
  im_right_arrow = loadImage("assets/right_arrow.svg");
  im_left_arrow = loadImage("assets/left_arrow.svg");
  im_play_button = loadImage("assets/play_button.png");

  background_sound = loadSound("assets/background_music.mp3");
  car_crash_sound = loadSound("assets/car_crash.wav");
  car_motor_sound = loadSound("assets/car_motor.wav");
  ammet_whistle_sound = loadSound("assets/ammet_whistle.wav");
  car_horn_sound = loadSound("assets/car_horn.wav");
}

function setup() {
  cnv = createCanvas(windowWidth - 30, windowHeight - 30);
  sideRoadWidth = (width - roadWidth) / 2;

  //By default, rotations are specified in radians
  angleMode(DEGREES);

  // frameRate(50);  // se puede usar esto para diferentes dificultados

  roadMarkings.push(new roadMarking());
  opponents.push(new Opponent());
  ammets.push(new Ammet());
  player = new Player();
}

function draw() {
  if (showStartScreen) {
    startScreen();

    return;
  }

  if (!background_sound.isPlaying()) {
    background_sound.play();
  }

  // if (!car_motor_sound.isPlaying()) {
  //   car_motor_sound.play();
  // }

  // Show side roads
  background(104, 104, 104);
  // on mobile devices, the left side of the road is 250px wide

  const sideWidth = (width - roadWidth) / 2;

  if (width > 500) {
    image(im_left_side_road, 0, 0, sideWidth, height);
    image(im_right_side_road, width - sideWidth, 0, sideWidth, height);
  }

  if (width <= 500) {
    image(im_mobile_left_side_road, 0, 0, sideWidth, height);
    image(im_mobile_right_side_road, width - sideWidth, 0, sideWidth, height);
  }

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
    console.log(opponents[i].y);
    if (opponents[i].y > height) {
      image(im_warning, opponents[i].x + opponents[i].w / 2 - 10, height - 50);
    }

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
      car_crash_sound.play();
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
      // ammets[i].warning();
      ammet_whistle_sound.play();
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

  image(im_left_arrow, 10, height - 50);

  // check if the mouse is pressed on the left side of the screen
  if (cnv.mouseX < width / 2 && mouseIsPressed) {
    player.turnLeft();
  }

  image(im_right_arrow, width - 50, height - 50);

  // check if the mouse is pressed on the right side of the screen
  if (mouseIsPressed && mouseX > width / 2) {
    player.turnRight();
  }

  // check if the mouse is pressed on the right side of the screen
  if (mouseIsPressed && mouseX < width / 2) {
    player.turnLeft();
  }

  // Show infractions
  image(im_medium_hud_bg, 10, 10);

  for (var i = 0; i < 3; i++) {
    image(im_warning_empty, 17 + i * 35, 20);
  }

  for (var i = 0; i < infractions; i++) {
    image(im_warning, 17 + i * 35, 20);
  }

  // Show km
  image(im_small_hud_bg, 130, 10);
  textSize(23);
  textFont(font);
  textAlign(CENTER);
  fill(0);
  text(`${kilometers} KM`, 170, 42);

  // show player lives
  image(im_medium_hud_bg, 223, 10);

  for (var i = 0; i < 3; i++) {
    // show empy heart a life is lost
    if (i >= lives) {
      image(im_heart_empty, 230 + i * 35, 20);
    } else {
      image(im_heart, 230 + i * 35, 20);
    }
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

  cnv.mouseClicked(restart);

  background_sound.stop();
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

function startGame() {
  showStartScreen = false;
}

function windowResized() {
  resizeCanvas(windowWidth - 30, windowHeight - 30);
}

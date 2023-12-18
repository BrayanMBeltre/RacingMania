var rd_map_w_start = 355;
var rd_map_h_start = 245;

var rd_map_y_start = 200;

var rd_map_x_end = 300;
var rd_map_y_end = -100;
var rd_map_w_end = 1167;
var rd_map_h_end = 804;
var totalFrames = 300;
var buttonAlpha = 0;

function startScreen() {
  this.x = lerp(
    width / 2 - rd_map_w_start / 2,
    rd_map_x_end,
    frameCount / totalFrames
  );
  this.y = lerp(rd_map_y_start, rd_map_y_end, frameCount / totalFrames);
  this.w = lerp(rd_map_w_start, rd_map_w_end, frameCount / totalFrames);
  this.h = lerp(rd_map_h_start, rd_map_h_end, frameCount / totalFrames);

  im_background_sea.resize(width * 2, height);
  image(im_background_sea, 0, 0);

  // im_rd_map.resize(this.w, this.h);
  image(im_rd_map, this.x, this.y, this.w, this.h);

  im_logo.resize(264, 74);
  image(im_logo, width / 2 - im_logo.width / 2, height / 2 + 100);

  if (frameCount > 300) {
    buttonAlpha = min(buttonAlpha + 5, 255); // Increase the alpha value gradually
  }

  // after 5 seconds, show a start button
  if (frameCount > 200) {
    tint(255, buttonAlpha);

    image(
      im_play_button,
      width / 2 - im_play_button.width / 2,
      height / 2 + 200
    );

    // Reset the tint
    tint(255);
  }

  textSize(10);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(255);
  text(`©Team5 Game Jam RD 🇩🇴 2023`, width / 2, height - 10);

  if (!background_sound.isPlaying()) {
    background_sound.stop();
  }

  cnv.mouseClicked(startGame);

  if (keyIsDown(ENTER)) {
    startGame();
  }
}

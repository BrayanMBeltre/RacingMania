function roadMarking() {
  const center = width / 2 - roadWidth / 2;
  this.w = 10;
  this.h = 30;

  this.x = floor(roadWidth / 3 - this.w / 3);
  this.y = 0;

  this.show = function () {
    strokeWeight(3);
    fill(255, 182, 58);

    // center the road marking relative to the screen
    rect(center + this.x, this.y, this.w, this.h);
    rect(center + this.x + roadWidth / 3, this.y, this.w, this.h);
  };

  this.update = function () {
    this.y += playerSpeed;
  };

  this.offscreen = function () {
    return this.y > height;
  };
}

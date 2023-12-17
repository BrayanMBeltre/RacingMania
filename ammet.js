function Ammet() {
  this.w = 71;
  this.h = 39;

  // Randomly place the opponent on the road on one of the lanes
  const segment = roadWidth / 3;
  const lane = floor(random(0, 3));
  this.x = floor(segment * lane + segment / 2 - this.w / 2) + sideRoadWidth;

  this.y = -this.h;
  this.speed = playerSpeed - 1;

  this.isOvertakenBy = false;

  this.show = function () {
    im_ammet.resize(this.w, this.h);
    image(im_ammet, this.x, this.y);
  };

  this.update = function () {
    this.y += this.speed;
  };

  this.offscreen = function () {
    return this.y > height;
  };

  this.overtakenBy = function (player) {
    if (player.y < this.y) {
      return true;
    }
  };

  this.hits = function (player) {
    if (player.y < this.y + this.h && player.y + player.h > this.y) {
      if (player.x < this.x + this.w && player.x + player.w > this.x) {
        return true;
      }
    }
  };

  this.warning = function () {
    image(im_warning, this.x - 50, this.y);
  };
}

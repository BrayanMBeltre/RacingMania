function Opponent() {
  this.w = 55;
  this.h = 100;

  this.y = height + this.h;

  // Randomly place the opponent on the road on one of the lanes
  const segment = roadWidth / 3;
  const lane = floor(random(0, 3));
  this.x = floor(segment * lane + segment / 2 - this.w / 2) + sideRoadWidth;

  // this.x = floor(random(0, roadWidth - this.w));
  this.speed = playerSpeed - 1;
  this.isOvertakenBy = false;

  this.isOvertakenBy = false;

  this.show = function () {
    im_car_green.resize(this.w, this.h);
    image(im_car_green, this.x, this.y);
  };

  this.update = function () {
    this.y -= 2;
  };

  this.offscreen = function () {
    return this.y < -this.h;
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

  this.boom = function () {
    image(im_boom, this.x - 50, this.y);
  };
}

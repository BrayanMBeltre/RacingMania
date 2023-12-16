function Ammet() {
  this.w = 80;
  this.h = 80;

  this.x = floor(random(0, width - this.w));
  this.y = -this.h;
  this.speed = playerSpeed - 1;

  this.isOvertakenBy = false;

  this.show = function () {
    // image(im_car_purple, this.x, this.y);

    strokeWeight(3);
    fill(0, 0, 255);
    rect(this.x, this.y, this.w, this.h);
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

  this.boom = function () {
    image(im_boom, this.x - 50, this.y);
  };
}

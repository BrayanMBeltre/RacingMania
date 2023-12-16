function Player() {
  this.w = 55;
  this.h = 100;

  this.x = floor(width / 2 - this.w / 2);
  this.y = floor((3 * height) / 4 - this.h / 2);

  this.show = function () {
    im_car_red.resize(this.w, this.h);
    image(im_car_red, this.x, this.y);
  };

  this.turnLeft = function () {
    this.x -= 5;
    this.x = constrain(this.x, sideRoadWidth, width - this.w);
  };

  this.turnRight = function () {
    this.x += 5;
    this.x = constrain(this.x, 0, width - sideRoadWidth - this.w);
  };
}

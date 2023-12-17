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

    // strokeWeight(1);
    // stroke(255, 0, 0);
    // rect(this.x, this.y, this.w, this.h);
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
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    const ammetCenterX = this.x + this.w / 2;
    const ammetCenterY = this.y + this.h / 2;
    const distance = dist(
      playerCenterX,
      playerCenterY,
      ammetCenterX,
      ammetCenterY
    );
    const minDistance = (player.w + this.w) / 2;

    return distance < minDistance;
  };

  this.warning = function () {
    image(im_warning, this.x - 50, this.y);
  };
}

cc.Class({
  extends: cc.Component,

  properties: {
    // When the distance between the star and main character is less than this value, collection of the point will be completed
    pickRadius: 0,
  },

  getPlayerDistance: function () {
    // Determine the distance according to the position of the Player node
    var playerPos = this.game.player.getPosition();

    // Calculate the distance between two nodes according to their positions
    var dist = this.node.position.sub(playerPos).mag();
    return dist;
  },

  onPicked: function () {
    // When the stars are being collected, invoke the interface in the Game script to generate a new star
    this.game.spawnNewStar();

    // Invoke the scoring method of the Game script
    this.game.gainScore();

    // Then destroy the current star's node
    this.node.destroy();
  },

  // use this for initialization
  onLoad: function () {},

  update: function (dt) {
    // Determine if the distance between the Star and main character is less than the collecting distance for each frame
    if (this.getPlayerDistance() < this.pickRadius) {
      // Invoke collecting behavior
      this.onPicked();
      return;
    }

    // Update the transparency of the star according to the timer in the Game script
    var opacityRatio = 1 - this.game.timer / this.game.starDuration;
    var minOpacity = 50;
    this.node.opacity =
      minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
  },
});

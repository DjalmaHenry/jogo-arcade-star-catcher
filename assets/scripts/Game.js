cc.Class({
  extends: cc.Component,

  properties: {
    // This property quotes the PreFab resource of stars
    starPrefab: {
      default: null,
      type: cc.Prefab,
    },

    // The random scale of disappearing time for stars
    minStarDuration: 0,
    maxStarDuration: 0,

    // Ground node for confirming the height of the generated star's position
    ground: {
      default: null,
      type: cc.Node,
    },

    // Player node for obtaining the jump height of the main character and controlling the movement switch of the main character
    player: {
      default: null,
      type: cc.Node,
    },

    // Reference of score label
    scoreDisplay: {
      default: null,
      type: cc.Label,
    },

    // Scoring sound effect resource
    scoreAudio: {
        default: null,
        url: cc.AudioClip
    }
  },

  // use this for initialization
  onLoad: function () {
    // Obtain the anchor point of ground level on the y axis
    this.groundY = this.ground.y + this.ground.height / 2; // "this.ground.top" may also work

    // Initialize timer
    this.timer = 0;
    this.starDuration = 0;

    // Generate a new star
    this.spawnNewStar();

    // Initialize scoring
    this.score = 0;
  },

  update: function (dt) {
    // Update timer for each frame, when a new star is not generated after exceeding duration

    // Invoke the logic of game failure
    if (this.timer > this.starDuration) {
      this.gameOver();
      return;
    }
    this.timer += dt;
  },

  spawnNewStar: function () {
    // Generate a new node in the scene with a preset template
    var newStar = cc.instantiate(this.starPrefab);

    // Put the newly added node under the Canvas node
    this.node.addChild(newStar);

    // Set up a random position for the star
    newStar.setPosition(this.getNewStarPosition());

    // Save a reference of the Game object on the Star script component
    newStar.getComponent("Star").game = this;

    // Reset timer, randomly choose a value according the scale of star duration
    this.starDuration =
      this.minStarDuration +
      Math.random() * (this.maxStarDuration - this.minStarDuration);
    this.timer = 0;
  },

  getNewStarPosition: function () {
    var randX = 0;

    // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
    var randY =
      this.groundY +
      Math.random() * this.player.getComponent("Player").jumpHeight +
      50;

    // According to the width of the screen, randomly obtain an anchor point of star on the x axis
    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;

    // Return to the anchor point of the star
    return cc.v2(randX, randY);
  },

  gainScore: function () {
    this.score += 1;

    // Update the words of the scoreDisplay Label
    this.scoreDisplay.string = "Score: " + this.score;

    // Play the scoring sound effect
    cc.audioEngine.playEffect(this.scoreAudio, false);
  },

  gameOver: function () {
    // Stop the jumping action of the Player node
    this.player.stopAllActions();

    // reload the "game" scene
    cc.director.loadScene("game");
  },
});

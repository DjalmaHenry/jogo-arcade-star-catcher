cc.Class({
  extends: cc.Component,

  properties: {
    // Main character's jump height
    jumpHeight: 0,

    // Main character's jump duration
    jumpDuration: 0,

    // Maximal movement speed
    maxMoveSpeed: 0,

    // Acceleration
    accel: 0,

    // Jumping sound effect resource
    jumpAudio: {
      default: null,
      url: cc.AudioClip,
    },
  },

  runJumpAction() {
    // Create a Jump action with a duration

    // Jump up
    var jumpUp = cc
      .moveBy(this.jumpDuration, cc.p(0, this.jumpHeight))
      .easing(cc.easeQuadraticActionOut());

    // Jump down
    var jumpDown = cc
      .moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight))
      .easing(cc.easeQuadraticActionIn());
  
    // Repeat
    return cc.repeatForever(cc.sequence(jumpUp, jumpDown, this.playJumpSound()));
  },

  playJumpSound: function () {
    // Invoke sound engine to play the sound
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },

  onKeyDown(event) {
    // Set a flag when key pressed
    switch (event.keyCode) {
      case cc.KEY.a:
        this.accLeft = true;
        break;
      case cc.KEY.d:
        this.accRight = true;
        break;
    }
  },

  onKeyUp(event) {
    // Unset a flag when key released
    switch (event.keyCode) {
      case cc.KEY.a:
        this.accLeft = false;
        break;
      case cc.KEY.d:
        this.accRight = false;
        break;
    }
  },

  onDestroy() {
    // Cancel keyboard input monitoring
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  // use this for initialization
  onLoad: function () {
    // Initialize the jump action
    var jumpAction = this.runJumpAction();
    this.node.runAction(jumpAction);

    // Acceleration direction switch
    this.accLeft = false;
    this.accRight = false;
    // The main character's current horizontal velocity
    this.xSpeed = 0;

    // Initialize the keyboard input listening
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },

  update: function (dt) {
    // Update speed of each frame according to the current acceleration direction
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    }
    // Restrict the movement speed of the main character to the maximum movement speed
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // If speed reach limit, use max speed with current direction
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed);
    }

    // Update the position of the main character according to the current speed
    this.node.x += this.xSpeed * dt;
  },
});

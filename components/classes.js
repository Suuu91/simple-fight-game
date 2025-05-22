// class for sprite and animation
class Sprite {
  constructor ({
    position, 
    imageSrc, 
    scale=1, 
    framesMax=1, 
    frameTimeGap, 
    offset={x:0,y:0}
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image() //load the img before using
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.currentFrame = 0 // current frame for animation, increase to animate
    this.frameTimeGap = frameTimeGap
    this.framesAnimated = 0
    this.offset = offset
  };

  draw() {
    context.drawImage(
      this.image, 
      // crop location
      (this.image.width / this.framesMax) * this.currentFrame, // x-coord
      0, // y-coord
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.framesAnimated++
    if (this.framesAnimated % this.frameTimeGap === 0) {
      if (this.currentFrame < this.framesMax -1 ) {
        this.currentFrame ++
      } else {
        this.currentFrame = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
};

// class for characters
class Character extends Sprite {
  constructor ({
    position, 
    velocity, 
    color, offset, 
    imageSrc, 
    scale=1, 
    framesMax=1, 
    frameTimeGap, 
    sprites,
    hitBox = {offset: {}, width: undefined, height: undefined},
    damageReceive
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.color = color
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: hitBox.width,
      height: hitBox.height,
      offset: hitBox.offset
    }
    this.isAttacking
    this.health = 100
    this.currentFrame = 0 
    this.frameTimeGap = frameTimeGap
    this.framesAnimated = 0
    this.sprites = sprites
    this.damageReceive = damageReceive
    this.dead

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  };

  update() {
    this.draw()
    if (!this.dead) this.animateFrames()
    this.hitBox.position.x = this.position.x + this.hitBox.offset.x //ensure hitbox-x goes with character
    this.hitBox.position.y = this.position.y + this.hitBox.offset.y ////ensure hitbox-y goes with character
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 26.5) {// character reach the bottom
      this.velocity.y = 0
      this.position.y = 400 // set character to ground level(round up to be a little higher)
    } else {
      this.velocity.y += gravity // apply gravity to y-velocity if in air
    }
  }

  attack() {
    this.switchSprite(`attack`)
    this.isAttacking = true
  }

  takeHit() {
    this.health -= this.damageReceive
    if (this.health <= 0) {
      this.switchSprite(`death`)
    } else {
      this.switchSprite(`hurt`)
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.framesMax-1) {
        this.dead = true
      } return
    };
    if (this.image === this.sprites.attack.image && this.currentFrame < this.framesMax -1) return // override other sprites when attacking
    if (this.image === this.sprites.hurt.image && this.currentFrame < this.framesMax -1) return // override other sprites when getting hit
    switch (sprite) {
      case `idle`:
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.currentFrame = 0 // ensure always start from the first frame when switching 
        }
        break
      case `jump`:
        if (this.image !== this.sprites.jump.image)  {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.currentFrame = 0
        }
        break
      case `run`:
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.currentFrame = 0
        }
        break
      case `fall`:
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.currentFrame = 0
        }
        break
      case `attack`:
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image
          this.framesMax = this.sprites.attack.framesMax
          this.currentFrame = 0
        }
        break
      case `hurt`:
        if (this.image !== this.sprites.hurt.image) {
          this.image = this.sprites.hurt.image
          this.framesMax = this.sprites.hurt.framesMax
          this.currentFrame = 0
        }
        break    
      case `death`:
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.currentFrame = 0
        }
        break      
    }
  }
};
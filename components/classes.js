// class for sprite and animation
class Sprite {
  constructor ({position, imageSrc, scale=1, framesMax=1, frameTimeGap}) {
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
  };

  draw() {
    context.drawImage(
      this.image, 
      // crop location
      (this.image.width / this.framesMax) * this.currentFrame, // x-coord
      0, // y-coord
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x, 
      this.position.y, 
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale
    )
  }

  update() {
    this.draw()
    this.framesAnimated++
    if (this.framesAnimated % this.frameTimeGap === 0) {
      if (this.currentFrame < this.framesMax -1 ) {
        this.currentFrame ++
      } else {
        this.currentFrame = 0
      }
    }
  }
};

// class for characters
class Character {
  constructor ({position, velocity, color, offset}) {
    this.position = position
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
      width: 100,
      height: 50,
      offset
    }
    this.isAttacking
    this.health = 100
  };

  draw() {
    context.fillStyle = this.color // fill rectangle with color
    context.fillRect(this.position.x, this.position.y, this.width, this.height) // create character rectangle
    
    // hit box 
    if (this.isAttacking) {
      context.fillStyle = `green`
      context.fillRect (this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height)
    }
  }

  update() {
    this.draw()
    this.hitBox.position.x = this.position.x + this.hitBox.offset.x //ensure hitbox-x goes with character
    this.hitBox.position.y = this.position.y ////ensure hitbox-y goes with character
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 26.5) {// character reach the bottom
      this.velocity.y = 0 
    } else {
      this.velocity.y += gravity // apply gravity to y-velocity if in air
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
};
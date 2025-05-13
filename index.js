const canvas = document.querySelector("canvas");
const context = canvas.getContext(`2d`);
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.6 // gravity to be added to characters' y velocity

class Sprite {
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
  };

  draw() {
    context.fillStyle = this.color // fill rectangle with color
    context.fillRect(this.position.x, this.position.y, this.width, this.height) // reate character rectangle
    
    // hit box 
    if (this.isAttacking) {
      context.fillStyle = `green`
      context.fillRect (
        this.hitBox.position.x,
        this.hitBox.position.y,
        this.hitBox.width,
        this.hitBox.height
      )
    }
  }

  update() {
    this.draw()
    this.hitBox.position.x = this.position.x + this.hitBox.offset.x //ensure hitbox-x goes with character
    this.hitBox.position.y = this.position.y ////ensure hitbox-y goes with character
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {// character reach the bottom
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


const player = new Sprite({
  position:{
    x: 0,
    y: 0
  }, 
  velocity:{
    x: 0,
    y: 0
  },
  color: `blue`,
  offset: {
    x: 0,
    y: 0
  }
});

const enemy = new Sprite({
  position:{
    x: 600,
    y: 100
  },
  velocity:{
    x: 0,
    y: 0
  },
  color: `red`,
  offset: {
    x: -50,
    y: 0
  }
});

const keys = {
  a: {pressed: false},
  d: {pressed: false},
  ArrowLeft: {pressed: false},
  ArrowRight: {pressed: false},
};

const rectCollision = ({rect1, rect2}) => {
  return (
    rect1.hitBox.position.x + rect1.hitBox.width >= rect2.position.x &&
      rect1.hitBox.position.x <= rect2.position.x + rect2.width &&
      rect1.hitBox.position.y + rect1.hitBox.height >= rect2.position.y &&
      rect1.hitBox.position.y <= rect2.position.y + rect2.height &&
      rect1.isAttacking 
  )
}

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillStyle = `black` //background color
  context.fillRect(0, 0, canvas.width, canvas.height) //form background
  player.update() // player character
  enemy.update() // enemy character
  
  player.velocity.x = 0 // default player x-velocity
  enemy.velocity.x = 0 // default enemy x-velocity

  // player movement
  if (keys.a.pressed && player.lastKey === `a`) {
    player.velocity.x = -3
  } else if (keys.d.pressed && player.lastKey === `d`) {
    player.velocity.x = 3
  }
  
  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === `ArrowLeft`) {
    enemy.velocity.x = -3
  } else if (keys.ArrowRight.pressed && enemy.lastKey === `ArrowRight`) {
    enemy.velocity.x = 3
  }

  // detecting hitbox
  if (rectCollision({rect1: player, rect2: enemy}) && player.isAttacking ) {
    player.isAttacking = false  
  }

  if (rectCollision({rect1: enemy, rect2: player}) && enemy.isAttacking ) {
    enemy.isAttacking = false  
  }
}
animate();

window.addEventListener(`keydown`, (e) => {
  // listen on keys pressed for player
  switch (e.key) {
    case `d`:
      keys.d.pressed = true
      player.lastKey = `d`
      break;
    case `a` :
      keys.a.pressed = true
      player.lastKey = `a`
      break
    case `w` :
      player.velocity.y = -18
      break
    case ` `:
      player.attack()
      break

    // listen on keys pressed for enemy
    case `ArrowRight`:
      keys.ArrowRight.pressed = true
      enemy.lastKey = `ArrowRight`
      break;
    case `ArrowLeft` :
      keys.ArrowLeft.pressed = true
      enemy.lastKey = `ArrowLeft`
      break
    case `ArrowUp`:
      enemy.velocity.y = -18
      break
     case `/`:
      enemy.attack()
      break
  }
})

window.addEventListener(`keyup`, (e) => {
  // listen on keys released for player
  switch (e.key) {
    case `d`:
      keys.d.pressed = false
      break;
    case `a` :
      keys.a.pressed = false
      break;

  // listen on keys released for enemy
    case `ArrowRight`:
      keys.ArrowRight.pressed = false
      break;
    case `ArrowLeft` :
      keys.ArrowLeft.pressed = false
      break;
  }
})
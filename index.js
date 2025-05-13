const canvas = document.querySelector("canvas");
const context = canvas.getContext(`2d`);

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.6 //global variable to add gravity to characters' y velocity

class Sprite {
  constructor ({position, velocity, color}) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.color = color
    this.hitBox = {
      position: this.position,
      width: 100,
      height: 50
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
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {// when the character reach the bottom
      this.velocity.y = 0 
    } else {
      this.velocity.y += gravity // if characters aren't on ground, apply gravity to y-velocity
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
  color: `blue`
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
  color: `red`
});

const keys = {
  a: {pressed: false},
  d: {pressed: false},
  ArrowLeft: {pressed: false},
  ArrowRight: {pressed: false},
};

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
  if (player.hitBox.position.x + player.hitBox.width >= enemy.position.x &&
      player.hitBox.position.x <= enemy.position.x + enemy.width &&
      player.hitBox.position.y + player.hitBox.height >= enemy.position.y &&
      player.hitBox.position.y <= enemy.position.y + enemy.height &&
      player.isAttacking 
    ) {
    player.isAttacking = false  
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
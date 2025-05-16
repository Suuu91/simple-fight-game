const canvas = document.querySelector("canvas");
const context = canvas.getContext(`2d`);
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.4 // gravity to be added to characters' y velocity

const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: `./assets/forest.png`
})

const fire = new Sprite({
  position: {
    x:60,
    y:260
  },
  imageSrc: `./assets/fire.png`,
  scale: 3,
  framesMax: 4,
  frameTimeGap: 20
})

const player = new Character({
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
  },
  imageSrc: `./assets/samurai/IDLE.png`,
  framesMax: 8,
  scale: 3.5,
  offset: {
    x: 240,
    y: 275 
  },
  frameTimeGap: 10,
  sprites: {
    idle: {
      imageSrc: `./assets/samurai/Idle.png`,
      framesMax: 8
    },
    run: {
      imageSrc: `./assets/samurai/Run.png`,
      framesMax: 8
    },
    jump: {
      imageSrc: `./assets/samurai/Jump.png`,
      framesMax: 2
    },
    attack: {
      imageSrc: `./assets/samurai/Attack.png`,
      framesMax: 6
    },
    hurt: {
      imageSrc: `./assets/samurai/Hurt.png`,
      framesMax: 4
    },
    fall: {
      imageSrc: `./assets/samurai/Fall.png`,
      framesMax: 2
    }
  }
});

const enemy = new Character({
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
  },
  imageSrc: `./assets/fighter/Idle.png`,
  framesMax: 4,
  scale: 3.2,
  offset: {
    x: 150,
    y: 260
  },
  frameTimeGap: 10,
  sprites: {
    idle: {
      imageSrc: `./assets/fighter/Idle.png`,
      framesMax: 4
    },
    run: {
      imageSrc: `./assets/fighter/Run.png`,
      framesMax: 8
    },
    jump: {
      imageSrc: `./assets/fighter/Jump.png`,
      framesMax: 2
    },
    attack: {
      imageSrc: `./assets/fighter/Attack.png`,
      framesMax: 4
    },
    hurt: {
      imageSrc: `./assets/fighter/Hurt.png`,
      framesMax: 3
    },
    fall: {
      imageSrc: `./assets/fighter/Fall.png`,
      framesMax: 2
    }
  }
});

const keys = {
  a: {pressed: false},
  d: {pressed: false},
  ArrowLeft: {pressed: false},
  ArrowRight: {pressed: false},
};

decreaseTimer()

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillStyle = `black` //background color
  context.fillRect(0, 0, canvas.width, canvas.height) //form background
  background.update() // background sprite
  fire.update()
  player.update() // player character
  enemy.update() // enemy character
  
  player.velocity.x = 0 // default player x-velocity
  enemy.velocity.x = 0 // default enemy x-velocity

  // player movement
  if (keys.a.pressed && player.lastKey === `a`) {
    player.velocity.x = -3
    player.switchSprite(`run`)
  } else if (keys.d.pressed && player.lastKey === `d`) {
    player.velocity.x = 3
    player.switchSprite(`run`)
  } else {
    player.switchSprite(`idle`) // if not moving x-axis, switch back to idle
  }
  //player jump
  if (player.velocity.y < 0) {
    player.switchSprite(`jump`)
  } else if (player.velocity.y > 0) {
    player.switchSprite(`fall`)
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === `ArrowLeft`) {
    enemy.velocity.x = -3
    enemy.switchSprite(`run`)
  } else if (keys.ArrowRight.pressed && enemy.lastKey === `ArrowRight`) {
    enemy.velocity.x = 3
    enemy.switchSprite(`run`)
  } else {
    enemy.switchSprite(`idle`)
  }
  //enemy jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite(`jump`)
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite(`fall`)
  }

  // detecting hitbox
  if (rectCollision({rect1: player, rect2: enemy}) && player.isAttacking ) {
    player.isAttacking = false
    enemy.health -= 10
    document.querySelector(`#enemyhpleft`).style.width = enemy.health + `%`  
  }

  if (rectCollision({rect1: enemy, rect2: player}) && enemy.isAttacking ) {
    player.health -= 10
    document.querySelector(`#playerhpleft`).style.width = player.health + `%`
    enemy.isAttacking = false  
  }

  // end game by eliminating opponent
  if (player.health <= 0 || enemy.health <= 0) {
    determineWin({player, enemy, timeoutId})
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
      player.velocity.y = -14
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
      enemy.velocity.y = -14
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
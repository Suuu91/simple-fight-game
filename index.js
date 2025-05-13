const canvas = document.querySelector("canvas");
const context = canvas.getContext(`2d`);

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2 //global variable to add gravity to characters' y velocity

class Sprite {
  constructor ({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.height = 150
  };

  draw() {
    context.fillStyle = `blue` //fill rectangle with color
    context.fillRect(this.position.x, this.position.y, 50, this.height) //create character rectangle
  }

  update() {
    this.draw()
    this.position.y += this.velocity.y
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {// when the character reach the bottom
      this.velocity.y = 0 
  } else {
    this.velocity.y += gravity // if characters aren't on ground, apply gravity to y-velocity
  }
}};

const player = new Sprite({
  position:{
    x: 0,
    y: 0
  }, 
  velocity:{
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
  }
});

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillStyle = `black` //background color
  context.fillRect(0, 0, canvas.width, canvas.height) //form background
  player.update() // player character
  enemy.update() // enemy character
}
animate();
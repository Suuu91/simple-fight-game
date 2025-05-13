const canvas = document.querySelector("canvas");
const context = canvas.getContext(`2d`);

canvas.width = 1024;
canvas.height = 576;

class Sprite {
  constructor (position) {
    this.position = position
  };

  draw() {
    context.fillStyle = `blue` //fill rectangle with color red
    context.fillRect(this.position.x, this.position.y, 50, 150) //create character rectangle
  }
};

const player = new Sprite({
  x: 0,
  y: 0
});

player.draw();

const enemy = new Sprite({
  x: 400,
  y: 100
});

enemy.draw();

const animate = () => {
  window.requestAnimationFrame()
}
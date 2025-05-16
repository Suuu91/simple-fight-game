const rectCollision = ({rect1, rect2}) => {
  return (
    rect1.hitBox.position.x + rect1.hitBox.width >= rect2.position.x &&
      rect1.hitBox.position.x <= rect2.position.x + rect2.width &&
      rect1.hitBox.position.y + rect1.hitBox.height >= rect2.position.y &&
      rect1.hitBox.position.y <= rect2.position.y + rect2.height &&
      rect1.isAttacking 
  )
}

// determine victory
const determineWin = ({player, enemy, timeoutId}) => {
  clearTimeout(timeoutId)
  document.querySelector(`#result`).style.display = "flex"
  if (player.health === enemy.health) {
      document.querySelector(`#result`).innerHTML = "Tie"
    } else if (player.health > enemy.health) {
      document.querySelector(`#result`).innerHTML = "Player 1 Win"
    } else if (enemy.health > player.health) {
      document.querySelector(`#result`).innerHTML = "Player 2 Win"
    }
}

// timer functionality
let timer = 60
let timeoutId
const decreaseTimer = () => {
  if (timer > 0) {
    timer--
    document.querySelector(`#timer`).innerHTML = timer
    timeoutId = setTimeout(decreaseTimer, 1000)
  } else if (timer === 0){
    determineWin({player, enemy, timeoutId})
  }
}
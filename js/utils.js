function rectangularCollision({ player, attack, enemy }) {
  let offsetD = player.directionToLeft ? attack.width - player.size.width + 2 * attack.offset.x : 0
  return (
    player.position.x + attack.offset.x + attack.width - offsetD >= enemy.position.x &&
    player.position.x + attack.offset.x - offsetD <= enemy.position.x + enemy.size.width &&
    player.position.y + attack.offset.y + attack.height >= enemy.position.y &&
    player.position.y + attack.offset.y <= enemy.position.y + enemy.size.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  text=''
  clearTimeout(timerId)
  // gsap.to('#enemyHealth', {
  //     width: enemy.health/MAX_HEALTH*100 + '%'
  //   })
  // gsap.to('#playerHealth', {
  //     width: player.health/MAX_HEALTH*100 + '%'
  //   })

  if (player.health === enemy.health) {
    text = 'Tie'
  } else if (player.health > enemy.health) {
    text = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    text = 'Player 2 Wins'
  }
  textOut(text)
}

function textOut(text){
  document.querySelector('#displayText').style.display = 'flex'
  document.querySelector('#displayText').innerHTML = text
}

function closeText(){
  document.querySelector('#displayText').style.display = 'none'
}

let timer
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    isPlaying=false
    determineWinner({ player, enemy, timerId })
  }
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

// c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1
isPlaying = true
const LAND = 350
const WALK_SPEED = 10
const RUN_SPEED = 20
const BASE_ATTACK1_DAMAGE = 10
const BASE_ATTACK2_DAMAGE = 15
const MAX_HEALTH = 100
var test = false

timer = 60
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: 'img/background-game.png'
})

const shop = new Sprite({
  position: {
    x: 630,
    y: 128
  },
  imageSrc: 'img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 256 - 25,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  size: {
    width: 70,
    height: 130
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 172
  },
  health: MAX_HEALTH,
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      imageSrc2: './img/samuraiMack2/Idle.png',
      framesMax: 8
    },
    walk: {
      imageSrc: './img/samuraiMack/Run.png',
      imageSrc2: './img/samuraiMack2/Run.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      imageSrc2: './img/samuraiMack2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      imageSrc2: './img/samuraiMack2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      imageSrc2: './img/samuraiMack2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack2.png',
      imageSrc2: './img/samuraiMack2/Attack2.png',
      framesMax: 6
    },
    attack2: {
      imageSrc: './img/samuraiMack/Attack1.png',
      imageSrc2: './img/samuraiMack2/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      imageSrc2: './img/samuraiMack2/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      imageSrc2: './img/samuraiMack2/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    attack1: {
      offset: {
        x: 0,
        y: 0
      },
      width: 270,
      height: 120,
      damage: BASE_ATTACK1_DAMAGE * 1.2
    },
    attack2: {
      offset: {
        x: -5,
        y: -40
      },
      width: 260,
      height: 160,
      damage: BASE_ATTACK2_DAMAGE * 1.5
    }
  }
})

const enemy = new Fighter({
  position: {
    x: 768 - 25,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  size: {
    width: 60,
    height: 130
  },
  color: 'violet',
  directionToLeft: true,
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 187
  },
  health: MAX_HEALTH,
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      imageSrc2: './img/kenji2/Idle.png',
      framesMax: 4
    },
    walk: {
      imageSrc: './img/kenji/Run.png',
      imageSrc2: './img/kenji2/Run.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      imageSrc2: './img/kenji2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      imageSrc2: './img/kenji2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      imageSrc2: './img/kenji2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      imageSrc2: './img/kenji2/Attack1.png',
      framesMax: 4
    },
    attack2: {
      imageSrc: './img/kenji/Attack2.png',
      imageSrc2: './img/kenji2/Attack2.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      imageSrc2: './img/kenji2/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      imageSrc2: './img/kenji2/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    attack1: {
      offset: {
        x: 25,
        y: -15
      },
      width: 220,
      height: 150,
      damage: BASE_ATTACK1_DAMAGE
    },
    attack2: {
      offset: {
        x: 50,
        y: -80
      },
      width: 200,
      height: 210,
      damage: BASE_ATTACK2_DAMAGE * 1.1
    }
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  // c.fillStyle = 'black'
  // c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  // c.fillRect(0, 0, canvas.width, canvas.height)
  //
  let oldP1 = player.position.x + player.size.width / 2
  let oldP2 = enemy.position.x + enemy.size.width / 2

  // console.log(oldP1,oldP2)
  player.update()
  enemy.update()

  if (
    (oldP1 - oldP2) *
      (player.position.x +
        player.size.width / 2 -
        enemy.position.x -
        enemy.size.width / 2) <
    0
  ) {
    player.changeDirection()
    // console.log(!player.directionToLeft?"Player nhin sang phai":"Player nhin sang trai")
    enemy.changeDirection()
    // console.log(!enemy.directionToLeft?"Enemy nhin sang phai":"Enemy nhin sang trai")
  }

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -WALK_SPEED
    player.switchSprite('walk')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = WALK_SPEED
    player.switchSprite('walk')
  } else {
    player.velocity.x = 0
    player.switchSprite('idle')
  }

  // if (player.position.x + player.width >= enemy.position.x &&
  //   player.position.x + player.width<= enemy.position.x + enemy.width &&
  //   player.position.y + player.height >= enemy.position.y &&
  //   player.position.y <= enemy.position.y + enemy.height) {
  //     player.velocity.x -=WALK_SPEED
  // }

  // if (keys.a.pressed && keys.d.pressed) {
  //   player.velocity.x = 0
  //   player.switchSprite('walk')
  // } else if (keys.a.pressed) {
  //   player.velocity.x = -WALK_SPEED
  //   player.switchSprite('walk')
  // } else if (keys.d.pressed) {
  //   player.velocity.x = WALK_SPEED
  //   player.switchSprite('walk')
  // }else{
  //   player.switchSprite('idle')
  // }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -WALK_SPEED
    enemy.switchSprite('walk')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = WALK_SPEED
    enemy.switchSprite('walk')
  } else {
    enemy.velocity.x = 0
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (player.isAttacking && player.framesCurrent === 4) {
    switch (player.state) {
      case 'attack1':
        if (
          rectangularCollision({
            player: player,
            attack: player.attackBox.attack1,
            enemy: enemy
          })
        ) {
          player.isAttacking = false
          enemy.takeHit(player.attackBox.attack1.damage)
          gsap.to('#enemyHealth', {
            width: (enemy.health / MAX_HEALTH) * 100 + '%'
          })
        }
        break
      case 'attack2':
        if (
          rectangularCollision({
            player: player,
            attack: player.attackBox.attack2,
            enemy: enemy
          })
        ) {
          player.isAttacking = false
          enemy.takeHit(player.attackBox.attack2.damage)
          gsap.to('#enemyHealth', {
            width: (enemy.health / MAX_HEALTH) * 100 + '%'
          })
        }
        break
    }
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    switch (enemy.state) {
      case 'attack1':
        if (
          rectangularCollision({
            player: enemy,
            attack: enemy.attackBox.attack1,
            enemy: player
          })
        ) {
          enemy.isAttacking = false
          player.takeHit(enemy.attackBox.attack1.damage)
          gsap.to('#playerHealth', {
            width: (player.health / MAX_HEALTH) * 100 + '%'
          })
        }
        break
      case 'attack2':
        if (
          rectangularCollision({
            player: enemy,
            attack: enemy.attackBox.attack2,
            enemy: player
          })
        ) {
          enemy.isAttacking = false
          player.takeHit(enemy.attackBox.attack2.damage)
          gsap.to('#playerHealth', {
            width: (player.health / MAX_HEALTH) * 100 + '%'
          })
        }
        break
    }
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    isPlaying = false
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!isPlaying) return
  if (!player.dead && !player.isBlocking) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        test = true
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (player.position.y == LAND) player.velocity.y = -20
        break
      case 'g':
        player.attack1()
        break
      case 'h':
        player.attack2()
        break
      case 's':
        if (player.position.y == LAND && !player.isAttacking) {
          player.isBlocking = true
          keys.a.pressed = keys.d.pressed = false
        }
        break
    }
  }

  if (!enemy.dead && !enemy.isBlocking) {
    switch (event.code) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (enemy.position.y == LAND) enemy.velocity.y = -20
        break
      case 'Numpad1':
        enemy.attack1()
        break
      case 'Numpad2':
        enemy.attack2()
        break
      case 'ArrowDown':
        if (enemy.position.y == LAND && !enemy.isAttacking) {
          enemy.isBlocking = true
          keys.ArrowLeft.pressed = keys.ArrowRight.pressed = false
        }
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      player.lastMove = 'd'
      setTimeout((test = false), 500)
      break
    case 'a':
      keys.a.pressed = false
      player.lastMove = 'a'
      break
    case 's':
      player.isBlocking = false
      break
  }

  // enemy keys
  switch (event.code) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      enemy.lastMove = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      enemy.lastMove = 'ArrowLeft'
      break
    case 'ArrowDown':
      enemy.isBlocking = false
      break
  }
})

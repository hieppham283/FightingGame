class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    size,
    color = 'red',
    directionToLeft = false,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    health,
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })

    this.velocity = velocity
    this.size = size
    this.lastKey
    this.lastMove
    this.state = 'idle'
    this.directionToLeft = directionToLeft
    this.attackBox = attackBox
    this.color = color
    this.isAttacking = false
    this.health = health
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.dead = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image2 = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
      sprites[sprite].image2.src = sprites[sprite].imageSrc2
    }
  }

  // draw(){
  //   if(!this.directionToLeft){
  //     c.drawImage(
  //     this.image,
  //     this.framesCurrent * (this.image.width / this.framesMax),
  //     0,
  //     this.image.width / this.framesMax,
  //     this.image.height,
  //     this.position.x - this.offset.x,
  //     this.position.y - this.offset.y,
  //     (this.image.width / this.framesMax) * this.scale,
  //     this.image.height * this.scale
  //   )
  //   }else{
  //     super.draw()
  //   }
  // }

  update() {
    this.draw()
    if (!this.dead) this.animateFrames()
    
    // attack boxes
    // this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    // this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    // c.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.size.width,
    //   this.size.height
    // )
    // draw the attack box
    // if (this.state=="attack1") {
    //   let offsetD = this.directionToLeft ? this.attackBox.attack1.width - this.size.width + 2 * this.attackBox.attack1.offset.x : 0
    //   c.fillRect(
    //     this.position.x + this.attackBox.attack1.offset.x - offsetD,
    //     this.position.y + this.attackBox.attack1.offset.y,
    //     this.attackBox.attack1.width,
    //     this.attackBox.attack1.height
    //   )
    // }
    // if (this.state=="attack2") {
    //   let offsetD = this.directionToLeft ? this.attackBox.attack2.width - this.size.width + 2 * this.attackBox.attack2.offset.x : 0
    //   c.fillRect(
    //     this.position.x + this.attackBox.attack2.offset.x - offsetD,
    //     this.position.y + this.attackBox.attack2.offset.y,
    //     this.attackBox.attack2.width,
    //     this.attackBox.attack2.height
    //   )
    // }

    let newPosX = this.position.x + this.velocity.x
    if (newPosX >= 0 && newPosX <= canvas.width - this.size.width)
      this.position.x = newPosX
    this.position.y += this.velocity.y

    // gravity function
    if (
      this.position.y + this.size.height + this.velocity.y >=
      canvas.height - 116
    ) {
      this.velocity.y = 0
      this.position.y = LAND
    } else this.velocity.y += gravity
  }

  changeDirection() {
    this.directionToLeft = !this.directionToLeft
  }

  attack1() {
    // if (!this.isAttacking){
    this.switchSprite('attack1')
    this.isAttacking = true
    // }
  }

  attack2() {
    // if (!this.isAttacking){
    this.switchSprite('attack2')
    this.isAttacking = true
    // }
  }

  takeHit(damage) {
    this.health -= this.isBlocking ? damage / 5 : damage

    if (this.health < 0) this.health = 0

    if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    if (this.state === 'death') {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.state === 'attack1' &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return
    if (
      this.state === 'attack2' &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.state === 'takeHit' &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        this.image = this.directionToLeft
          ? this.sprites.idle.image2
          : this.sprites.idle.image
        if (this.state !== sprite) {
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break
      case 'walk':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.walk.image2
            : this.sprites.walk.image
          this.framesMax = this.sprites.walk.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break
      case 'jump':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.jump.image2
            : this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break

      case 'fall':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.fall.image2
            : this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break

      case 'attack1':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.attack1.image2
            : this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break
      case 'attack2':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.attack2.image2
            : this.sprites.attack2.image
          this.framesMax = this.sprites.attack2.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break

      case 'takeHit':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.takeHit.image2
            : this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break

      case 'death':
        if (this.state !== sprite) {
          this.image = this.directionToLeft
            ? this.sprites.death.image2
            : this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
          this.state = sprite
        }
        break
    }
  }
}

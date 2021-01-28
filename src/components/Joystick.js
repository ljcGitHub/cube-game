import { THREE } from 'common/libs'
import Game from 'base/Game'
import UI from 'base/UI'
import Assets from 'base/Assets'
import { addEvent, removeEvent } from 'base/Event'
import Tween from 'base/Tween'

const _circle = Assets.loadTexture('circle.png')
const _round = Assets.loadTexture('round.png')

class Joystick {
  constructor(option = {}) {
    this.circleSize = 200
    this.roundSize = Math.floor(this.circleSize * 0.9)
    this.circle = this.getCircle()
    this.round = this.getRound()
    
    this.circle.material.opacity = 0.6
    this.round.material.opacity = 0.6
    
    this.initEvent()
    this.initData()
    this.initBackground()
    this.option = option
  }
  getCircle() {
    return UI.rect(this.circleSize, this.circleSize)
  }
  getRound() {
    return UI.rect(this.roundSize, this.roundSize)
  }
  initData() {
    this.position = new THREE.Vector2(this.round.position.x, this.round.position.y)
    this.maxLen = this.roundSize / 2 + Math.floor((this.circleSize - this.roundSize) / 2)
  }
  setPosition(x, y) {
    if (this.tween) this.tween.reset()
    this.round.position.x += x
    this.round.position.y += y
    this.circle.position.x += x
    this.circle.position.y += y
    this.initData()
  }
  initEvent() {
    addEvent('ui', this.circle, this.handle.bind(this))
    addEvent('ui', this.round, this.handle.bind(this))
  }
  initBackground() {
    _circle.load(texture => {
      this.circle.material.map = texture
    })
    _round.load(texture => {
      this.round.material.map = texture
    })
  }
  handle(type, data) {
    switch (type) {
      case 'touchstart':
        this.touchstart(data)
        break
      case 'touchmove':
        this.touchmove(data)
        break
      case 'touchend':
        this.touchend(data)
        break
      default:
        break
    }
  }
  touchstart(e) {
    this.isTouch = true
    this.offset = {
      x: e.touche.pageX,
      y: e.touche.pageY
    }
    this.option.touchstart && this.option.touchstart(e)
  }
  touchmove(e) {
    Game.controlsEnabled = false
    if (this.isTouch) {
      const newPosition = new THREE.Vector2(
        e.touche.pageX - this.offset.x,
        -1 * (e.touche.pageY - this.offset.y)
      )
      if (newPosition.length() > this.maxLen) {
        const no = newPosition.normalize()
        this.round.position.x = this.position.x + no.x * this.maxLen
        this.round.position.y = this.position.y + no.y * this.maxLen
      } else {
        this.round.position.x = this.position.x + newPosition.x
        this.round.position.y = this.position.y + newPosition.y
      }
      this.option.touchmove && this.option.touchmove(e)
    }
  }
  touchend(e) {
    this.isTouch = false
    this.setCenter()
    this.option.touchend && this.option.touchend(e)
    Game.controlsEnabled = true
  }
  setCenter() {
    this.getTweenOption()
    if (this.tween) {
      this.tween.reset()
      this.tween.play()
    } else {
      this.tween = Tween('Quad.easeOut', 200, (val) => {
        this.round.position.x = this.vx + this.diffX * val
        this.round.position.y = this.vy + this.diffY * val
      }, () => {
        this.round.position.x = this.position.x
        this.round.position.y = this.position.y
      })
    }
  }
  getTweenOption() {
    this.diffX = this.position.x - this.round.position.x
    this.diffY = this.position.y - this.round.position.y
    this.vx = this.round.position.x
    this.vy = this.round.position.y
  }
  destroy() {
    removeEvent(this.circle)
    removeEvent(this.round)
    UI.clear(this.circle)
    UI.clear(this.round)
  }
}

export default Joystick
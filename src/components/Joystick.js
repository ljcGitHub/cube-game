import UI from 'base/UI'
import Assets from 'base/Assets'
import {addEvent} from 'base/Event'

const _circle = Assets.loadTexture('circle.png')
const _round = Assets.loadTexture('round.png')

class Joystick {
  constructor() {
    this.size = 200
    this.circle = this.getCircle()
    this.round = this.getRound()
    this.initEvent()
    this.initBackground()
  }
  initEvent() {
    addEvent('ui', this.circle, this.handle)
    addEvent('ui', this.round, this.handle)
  }
  handle(type, data) {
    switch (type) {
      case 'touchstart':
        this.touchstart(data)
        break
      case 'touchmove':
        this.touchmove(data)
        break
      case 'touchstart':
        this.touchstart(data)
        break
      default:
        break
    }
  }
  touchstart(data) {
    this.isTouch = true
  }
  touchmove(data) {
    if (this.isTouch) {
    }
  }
  touchend(data) {
    this.isTouch = false
  }
  initBackground() {
    _circle.load(texture => {
      this.circle.material.map = texture
    })
    _round.load(texture => {
      this.round.material.map = texture
    })
  }
  getCircle() {
    return UI.rect(this.size, this.size)
  }
  getRound() {
    return UI.rect(this.size * 0.7, this.size * 0.7)
  }
  destroy() {
    removeEvent(this.circle)
    removeEvent(this.round)
  }
}
new Joystick()
export default Joystick
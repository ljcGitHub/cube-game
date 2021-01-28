import { THREE } from 'common/libs'
import Game from 'base/Game'
import Object3D from 'base/Object3D'
import CameraFollow from 'components/ThirdCameraControl'
import Joystick from 'components/Joystick'

const speed = 10

class Character extends Object3D {
  constructor(option) {
    super(option)
    this.offset = new THREE.Vector2()
    this.createdUIControlCamera()
  }
  createdUIControlCamera() {
    this.cameraFollow = new CameraFollow()
    this.cameraFollow.setControl(this, Game.camera)
    this.joystick = new Joystick({
      touchstart: this.touchstart.bind(this),
      touchmove: this.touchmove.bind(this),
      touchend: this.touchend.bind(this)
    })
    this.joystick.setPosition(0, -200)
  }
  removeUIControlCamera() {
    this.joystick.destroy()
    this.cameraFollow.destroy()
  }
  touchstart(e) {
    this.offsetX = e.touche.pageX
    this.offsetY = e.touche.pageY
    this.offset.x = 0
    this.offset.y = 0
  }
  touchmove(e) {
    const newPosition = new THREE.Vector2(
      e.touche.pageX - this.offsetX,
      e.touche.pageY - this.offsetY
    ).normalize()
    this.offset.x = newPosition.x * this.joystick.maxLen
    this.offset.y = newPosition.y * this.joystick.maxLen
    this.offset = this.offset.normalize()
  }
  touchend(data) {
    this.offset.x = 0
    this.offset.y = 0
  }
  update(step) {
    super.update()
    this.force.push({
      x: this.offset.x * speed * step,
      y: 0,
      z: this.offset.y * speed * step
    })
  }
  destroy() {
    this.removeUIControlCamera()
    super.destroy()
  }
}

export default Character

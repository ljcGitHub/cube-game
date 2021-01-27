import { THREE } from 'common/libs'
import Game from 'base/Game'

const deg = Math.PI / 180

// 相机跟随速度
class CameraFollow {
  constructor() {
    this.radius = 30
    this.angle = 60
  }
  setControl(player, camera) {
    this.player = player
    this.camera = camera
    this.update()
  }
  update() {
    if (this.camera && this.player) {
      Game.nextTick(() => {
        const x = Math.sin(this.angle * deg)
        const y = Math.cos(this.angle * deg)
        let playerCamPos = new THREE.Vector3()
        const offset = new THREE.Vector3(0, x * this.radius, y * this.radius)
        playerCamPos.copy(this.player.position)
        playerCamPos.add(offset)
        // this.camera.position.copy(playerCamPos)
        // this.camera.lookAt(this.player.position)
        this.update()
      })
    }
  }
  destroy() {
    Game.nextTick(() => {
      this.camera = null
      this.player = null
    })
  }
}
export default CameraFollow
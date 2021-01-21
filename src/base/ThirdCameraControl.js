import { THREE } from 'common/libs'

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
      const x = -1 * Math.sin(this.angle * deg)
      const y = Math.cos(this.angle * deg)
      let playerCamPos = new THREE.Vector3()
      const offset = new THREE.Vector3(x * this.radius, y * this.radius, 0)
      playerCamPos.copy(this.player.position)
      playerCamPos.add(offset)
      this.camera.position.copy(playerCamPos)
      this.camera.lookAt(this.player.position)
    }
  }
}
export default new CameraFollow()
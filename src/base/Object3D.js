import { THREE } from 'common/libs'
import { guid } from 'common/utils/math'

const propsValue = {
  content: [], // 显示内容
  position: new THREE.Vector3(), // 位置
  rotation: new THREE.Vector3(), // 旋转
  rigidBody: null, // 刚体检测
  static: false, // 静态物体
  trigger: false, // 触发器
  force: [], // 力
  rigidBodyType: '', // 刚体标签
  rigidBodyFilter: [], // 根据刚体标签过滤碰撞的刚体
  showBoxAxes: false, // 是否显示轴
  showBoxDebug: false, // 是否显示刚体的BOX盒子
  boxColor: 0x19be6b, // BOX盒子颜色
  tag: '' // 标签
}

class Object3D {
  constructor(option = {}) {
    const props = { ...propsValue, ...option }
    this.uid = guid()
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
    this.positionChange = true
    this.updateRigidBody()
  }
  update(step) {
  }
  updateRigidBody() {
    if (this.rigidBody && this.positionChange) {
      this.positionChange = false
      this.rigidBody.setPosition(this.position)
      this.rigidBody.setRotation(this.rotation)
    }
  }
  setPosition(ps) {
    this.positionChange = true
    this.position.copy(ps)
    this.updateRigidBody()
  }
  setRotation(rs) {
    this.rotation.set(rs.rotation.x, rs.rotation.y, rs.rotation.z)
  }
  render(dt) {
  }
  collision(boxs) {
  }
  destroy() {
  }
}

export default Object3D
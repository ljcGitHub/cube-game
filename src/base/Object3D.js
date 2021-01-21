import { THREE } from 'common/libs'

const propsValue = {
  content: [], // 显示内容
  position: new THREE.Vector3(), // 位置
  rotation: new THREE.Vector3(), // 旋转
  rigidBody: null, // 刚体检测
  static: false, // 静态物体
  trigger: false, // 触发器
  showBoxAxes: false, // 是否显示轴
  showBoxDebug: false, // 是否显示刚体的BOX盒子
  boxColor: 0x19be6b, // BOX盒子颜色
  tag: '' // 标签
}
const guid = function () {
  return 'uxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

class Object3D {
  constructor(option = {}) {
    const props = { ...propsValue, ...option }
    this.uid = guid()
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
    this.postionChange = true
    this.updateRigidBody()
  }
  update(step) {
  }
  updateRigidBody() {
    if (this.rigidBody && this.postionChange) {
      this.postionChange = false
      this.rigidBody.setPosition(this.position)
      this.rigidBody.setRotation(this.rotation)
    }
  }
  movePostion(x = 0, y = 0, z = 0) {
    this.position.x += x
    this.position.y += y
    this.position.z += z
    this.rigidBody && this.rigidBody.movePostion(this.position)
  }
  setPosition(ps) {
    this.postionChange = true
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
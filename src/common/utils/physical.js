import { THREE } from 'common/libs'

const epsilon = Number.EPSILON // 无穷数字
let v = new THREE.Vector3()
const vector3Identify = (v1, v2, vs, vf) => {
  if (v2.isVector3) return v.copy(v1)[vs](v2)
  return v.copy(v1)[vf](v2)
}
// 向量相加
const add = (v1, v2) => vector3Identify(v1, v2, 'add', 'addScalar')
// 向量相减
const sub = (v1, v2) => vector3Identify(v1, v2, 'sub', 'subScalar')
// 向量相乘
const multiply = (v1, v2) => vector3Identify(v1, v2, 'multiply', 'multiplyScalar')
// 向量相除
const divide = (v1, v2) => vector3Identify(v1, v2, 'divide', 'divideScalar')
// 点积
const dot = (v1, v2) => vector3Identify(v1, v2, 'dot', 'dot')

// AABB-AABB
export const intersectAABB = function (box1, box2) {
  const { min: amin, max: amax } = box1
  const { min: bmin, max: bmax } = box2
  var x1 = amin.x >= bmin.x && amin.x <= bmax.x
  var x2 = bmin.x >= amin.x && bmin.x <= amax.x
  var y1 = amin.y >= bmin.y && amin.y <= bmax.y
  var y2 = bmin.y >= amin.y && bmin.y <= amax.y
  var z1 = amin.z >= bmin.z && amin.z <= bmax.z
  var z2 = bmin.z >= amin.z && bmin.z <= amax.z
  return (x1 || x2) && (y1 || y2) && (z1 || z2)
}

// OBB-AABB/OBB
export const intersectOBB = function (box1, box2) {
  const v = sub(box1.center, box2.center)
  const VA = box1.unityVector
  const VB = box2.unityVector
  const T = [dot(v, VA[0]), dot(v, VA[1]), dot(v, VA[2])]
  let R = [[], [], []]
  let FR = [[], [], []]
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      R[i][k] = dot(VA[i], VB[k])
      FR[i][k] = Math.abs(R[i][k]) + epsilon
    }
  }
  for (let i = 0; i < 3; i++) {
    ra = box0.extents[i];
    rb = box1.extents[0] * FR[i][0] + box1.extents[1] * FR[i][1] + box1.extents[2] * FR[i][2]
    t = Math.abs(T[i])
    if (t > ra + rb) return false
  }
  // B's basis vectors
  for (var k = 0; k < 3; k++) {
    ra = box0.extents[0] * FR[0][k] + box0.extents[1] * FR[1][k] + box0.extents[2] * FR[2][k]
    rb = box1.extents[k]
    t = Math.abs(T[0] * R[0][k] + T[1] * R[1][k] + T[2] * R[2][k])
    if (t > ra + rb) return false;
  }

  //9 cross products
  //L = A0 x B0
  ra = box0.extents[1] * FR[2][0] + box0.extents[2] * FR[1][0]
  rb = box1.extents[1] * FR[0][2] + box1.extents[2] * FR[0][1]
  t = Math.abs(T[2] * R[1][0] - T[1] * R[2][0])
  if (t > ra + rb) return false

  //L = A0 x B1
  ra = box0.extents[1] * FR[2][1] + box0.extents[2] * FR[1][1]
  rb = box1.extents[0] * FR[0][2] + box1.extents[2] * FR[0][0]
  t = Math.abs(T[2] * R[1][1] - T[1] * R[2][1])
  if (t > ra + rb) return false

  //L = A0 x B2
  ra = box0.extents[1] * FR[2][2] + box0.extents[2] * FR[1][2]
  rb = box1.extents[0] * FR[0][1] + box1.extents[1] * FR[0][0]
  t = Math.abs(T[2] * R[1][2] - T[1] * R[2][2])
  if (t > ra + rb) return false

  //L = A1 x B0
  ra = box0.extents[0] * FR[2][0] + box0.extents[2] * FR[0][0]
  rb = box1.extents[1] * FR[1][2] + box1.extents[2] * FR[1][1]
  t = Math.abs(T[0] * R[2][0] - T[2] * R[0][0])
  if (t > ra + rb) return false

  //L = A1 x B1
  ra = box0.extents[0] * FR[2][1] + box0.extents[2] * FR[0][1];
  rb = box1.extents[0] * FR[1][2] + box1.extents[2] * FR[1][0];
  t = Math.abs(T[0] * R[2][1] - T[2] * R[0][1]);
  if (t > ra + rb) return false;

  //L = A1 x B2
  ra = box0.extents[0] * FR[2][2] + box0.extents[2] * FR[0][2]
  rb = box1.extents[0] * FR[1][1] + box1.extents[1] * FR[1][0]
  t = Math.abs(T[0] * R[2][2] - T[2] * R[0][2])
  if (t > ra + rb) return false

  //L = A2 x B0
  ra = box0.extents[0] * FR[1][0] + box0.extents[1] * FR[0][0]
  rb = box1.extents[1] * FR[2][2] + box1.extents[2] * FR[2][1]
  t = Math.abs(T[1] * R[0][0] - T[0] * R[1][0])
  if (t > ra + rb) return false

  //L = A2 x B1
  ra = box0.extents[0] * FR[1][1] + box0.extents[1] * FR[0][1]
  rb = box1.extents[0] * FR[2][2] + box1.extents[2] * FR[2][0]
  t = Math.abs(T[1] * R[0][1] - T[0] * R[1][1])
  if (t > ra + rb) return false

  //L = A2 x B2
  ra = box0.extents[0] * FR[1][2] + box0.extents[1] * FR[0][2]
  rb = box1.extents[0] * FR[2][1] + box1.extents[1] * FR[2][0]
  t = Math.abs(T[1] * R[0][2] - T[0] * R[1][2])
  if (t > ra + rb) return false
  return true
}

// 获取碰撞之后正确的位置
export const collisionResponse = function (box1, box2) {
  let keys = ['x', 'y', 'z']
  let move = { x: 0, y: 0, z: 0 }
  keys.forEach(key => {
    let d1
    let delta = box1.move[key]
    if (delta > 0) {
      d1 = box2.min[key] - box1.max[key]
      if (d1 < delta) {
        move[key] = d1
      }
    } else if (delta < 0) {
      d1 = box2.max[key] - box1.min[key]
      if (d1 > delta) {
        move[key] = d1
      }
    }
  })
  for (const key in move) {
    const _move = Math.abs(move[key])
    const _boxmove = Math.abs(box1.move[key])
    if (_boxmove + 1 < _move) {
      move[key] = 0
    }
  }
  return new THREE.Vector3(move.x, move.y, move.z)
}

export const forceCheck = function (boxs) {
  for (let i = 0; i < boxs.length; i++) {
    const item = boxs[i]
    for (let j = 0; j < item.force.length; j++) {
      const force = item.force[j]
      for (const key in force) {
        item.rigidBody.min[key] += force[key]
        item.rigidBody.max[key] += force[key]
        item.rigidBody.move[key] += force[key]
        item.rigidBody.position[key] += force[key]
        item.position[key] += force[key]
      }
    }
  }
  return boxs
}

export const octreesCheck = function (boxs) {
  const check = []
  for (let i = 0; i < boxs.length; i++) {
    const item = boxs[i]
    if (!check[i]) check[i] = []
    if (!item.static) {
      for (let j = 0; j < boxs.length; j++) {
        const _item = boxs[j]
        if (!check[j]) check[j] = []
        if (_item.uid !== item.uid && !check[i].includes(_item)) {
          let isCollision = false
          if (item.rigidBody.isAABB && _item.rigidBody.isAABB) {
            isCollision = intersectAABB(item.rigidBody, _item.rigidBody)
          } else {
            isCollision = intersectOBB(item.rigidBody, _item.rigidBody)
          }
          if (isCollision) {
            if (!item.trigger && !_item.trigger) {
              const itemPostion = collisionResponse(item.rigidBody, _item.rigidBody)
              const _itemPostion = collisionResponse(_item.rigidBody, item.rigidBody)
              if (!item.newPostions) item.newPostions = []
              if (!_item.newPostions) _item.newPostions = []
              item.newPostions.push(itemPostion)
              _item.newPostions.push(_itemPostion)
            }
            if (!_item.static) {
              check[i].push(_item)
              check[j].push(item)
            }
          }
        }
      }
    }
  }
  return check
}

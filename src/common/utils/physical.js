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
  const b1_min = { ...box1.min }
  const b1_max = { ...box1.max }
  const b2_min = { ...box2.min }
  const b2_max = { ...box2.max }
  let keys = ['x', 'y', 'z']
  let keyIndexs = [['y', 'z'], ['x', 'z'], ['x', 'y']]
  let move = { x: 0, y: 0, z: 0 }
  keys.forEach((key, kindex) => {
    const keyIndex = keyIndexs[kindex]
    const _g = keyIndex[0]
    const _b = keyIndex[1]
    if (b1_max[_g] > b2_min[_g] &&
      b1_min[_g] < b2_max[_g] &&
      b1_max[_b] > b2_min[_b] &&
      b1_min[_b] < b2_max[_b]) {
      let d1
      let delta = box1.move[key]
      if (delta > 0) {
        d1 = b2_min[key] - b1_max[key]
        if (d1 < delta) {
          move[key] = d1
        }
      } else if (delta < 0) {
        d1 = b2_max[key] -b1_min[key]
        if (d1 > delta) {
          move[key] = d1
        }
      }
    }
  })
  for (const key in move) {
    const abs = Math.abs(box1.move[key])
    if (abs >= 0.01 && 1 + abs < Math.abs(move[key])) {
      move[key] = 0
    }
  }
  return new THREE.Vector3(move.x, move.y, move.z)
}

export const octreesCheck = function (boxs) {
  const check = []
  const octrees = {}
  for (let i = 0; i < boxs.length; i++) {
    const obj = boxs[i]
    const body = obj.rigidBody
    if (body) {
      const keys = octreesIndex(body)
      keys.forEach(key => {
        if (!octrees[key]) octrees[key] = []
        octrees[key].push({
          index: i,
          box: obj
        })
      })
    }
  }
  Object.keys(octrees).forEach(key => {
    const collisions = octrees[key]
    for (let i = 0; i < collisions.length; i++) {
      const item = collisions[i]
      if (!check[item.index]) check[item.index] = []
      if (!item.box.static) {
        for (let j = 0; j < collisions.length; j++) {
          const _item = collisions[j]
          if (!check[_item.index]) check[_item.index] = []
          if (_item.box.uid !== item.box.uid && !check[item.index].includes(_item.box)) {
            let isCollision = false
            if (item.box.rigidBody.isAABB && _item.box.rigidBody.isAABB) {
              isCollision = intersectAABB(item.box.rigidBody, _item.box.rigidBody)
            } else {
              isCollision = intersectOBB(item.box.rigidBody, _item.box.rigidBody)
            }
            if (isCollision) {
              if (!item.box.trigger && !_item.box.trigger) {
                const itemPostion = collisionResponse(item.box.rigidBody, _item.box.rigidBody)
                const _itemPostion = collisionResponse(_item.box.rigidBody, item.box.rigidBody)
                if (!item.box.newPostions) item.box.newPostions = []
                if (!_item.box.newPostions) _item.box.newPostions = []
                item.box.newPostions.push(itemPostion)
                _item.box.newPostions.push(_itemPostion)
              }
              if (!_item.box.static) {
                check[item.index].push(_item.box)
                check[_item.index].push(item.box)
              }
            }
          }
        }
      }
    }
  })

  return check
}

export const octreesIndex = function (box) {
  const size = 24
  const { x: minX, y: minY, z: minZ } = box.min
  const { x: maxX, y: maxY, z: maxZ } = box.max
  const minkey = `${Math.floor(minX / size)}-${Math.floor(minY / size)}-${Math.floor(minZ / size)}`
  const maxkey = `${Math.floor(maxX / size)}-${Math.floor(maxY / size)}-${Math.floor(maxZ / size)}`
  if (minkey === maxkey) return [maxkey]
  return [minkey, maxkey]
}
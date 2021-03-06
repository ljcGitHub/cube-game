import { THREE } from 'common/libs'

const EPSILON = Number.EPSILON // 无穷数字
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

const Vector3Keys = ['x', 'y', 'z']

const step =  1 / 60

// AABB-AABB
export const sweptAABB = function (box1, box2) {
  // 计算进入。进出的位置
  let force = { ...box1.force }
  let keyIndexs = [['y', 'z'], ['x', 'z'], ['x', 'y']]
  Vector3Keys.forEach((key, kindex) => {
    const keyIndex = keyIndexs[kindex]
    const _g = keyIndex[0]
    const _b = keyIndex[1]
    const __g = box1.max[_g] > box2.min[_g] && box1.min[_g] < box2.max[_g]
    const __b = box1.max[_b] > box2.min[_b] && box1.min[_b] < box2.max[_b]
    const bianJieZhi = (box1.max[_g] == box2.min[_g]) ||
      (box1.min[_g] == box2.max[_g]) ||
      (box1.max[_b] == box2.min[_b]) ||
      (box1.min[_b] == box2.max[_b])
    if ((__g && __b) || bianJieZhi) {
      let d1
      let delta = box1.force[key]
      if (delta > 0 && box1.max[key] <= box2.min[key]) {
        d1 = box2.min[key] - box1.max[key]
        if (d1 < delta) {
          force[key] = d1
        }
      } else if (delta < 0 && box1.min[key] >= box2.max[key]) {
        d1 = box2.max[key] - box1.min[key]
        if (d1 > delta) {
          force[key] = d1
        }
      }
    }
  })
  for (const key in force) {
    const af = box1.force[key]
    const f = force[key]
    if ((af > 0 && f < 0) || (af < 0 && f > 0)) {
      force[key] = 0
    }
  }
  return force
}

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
      FR[i][k] = Math.abs(R[i][k]) + EPSILON
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

export const computingResultantForce = function (boxs) {
  const newBoxs = []
  for (let i = 0; i < boxs.length; i++) {
    const item = boxs[i]
    const body = item.rigidBody
    item.check = []
    body.isGrounded = false
    newBoxs.push(item)
  }
  return newBoxs
}

export const beforeResultantForce = function (data, force) {
  return {
    min: {
      x: data.min.x + force.x,
      y: data.min.y + force.y,
      z: data.min.z + force.z
    },
    max: {
      x: data.max.x + force.x,
      y: data.max.y + force.y,
      z: data.max.z + force.z
    }
  }
}

export const physicalUpdate = function (data) {
  const check = []
  const boxs = computingResultantForce(data)
  while (boxs.length) {
    const item = boxs.shift()
    const itemBody = item.rigidBody
    const force = itemBody.force
    for (let i = 0; i < boxs.length; i++) {
      const _item = boxs[i]
      const _itemBody = _item.rigidBody
      let isCollision = false
      let isFilter = false
      // 判断是否刚体过滤
      if (item.rigidBodyType || _item.rigidBodyType) {
        if (item.rigidBodyFilter.includes(_item.rigidBodyType) || _item.rigidBodyFilter.includes(item.rigidBodyType)) {
          isFilter = true
        }
      }
      // 刚体需要检测碰撞
      if (isFilter === false) {
        // 刚体类型检测
        if (itemBody.isAABB && _itemBody.isAABB) {
          if (!item.trigger && !_item.trigger) {
            const forceY = itemBody.force.y
            const _forceY = _itemBody.force.y
            itemBody.force = sweptAABB(itemBody, _itemBody)
            _itemBody.force = sweptAABB(_itemBody, itemBody)
            isCollision = intersectAABB(beforeResultantForce(itemBody, force), _itemBody)
            if (forceY <  0 && itemBody.force.y === 0) {
              itemBody.isGrounded = true
            }
            if (_forceY < 0 && _itemBody.force.y === 0) {
              _itemBody.isGrounded = true
            }
          } else {
            isCollision = intersectAABB(beforeResultantForce(itemBody, force), _itemBody)
          }
        } else {
          isCollision = intersectOBB(beforeResultantForce(itemBody, force), _itemBody)
        }
        // 刚体检测结果
        if (isCollision) {
          if (!_item.static) {
            item.check.push(_item)
          }
          if (!item.static) {
            _item.check.push(item)
          }
        }
      }
    }
    check.push(item)
  }
  return check
}

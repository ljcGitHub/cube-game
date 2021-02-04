import Game from 'base/Game'
import Scene from 'base/Scene'
import Object3D from 'base/Object3D'
import Physical from 'base/Physical'
import { THREE } from 'common/libs'
import Character from 'components/Character'

var scene = new Scene()


var objPush = new Object3D({
  rigidBody: new Physical({ width: 6, height: 3, depth: 6 }),
  boxColor: 0xf4b0b0, // BOX盒子颜色 红
  position: new THREE.Vector3(-18, 0, -18),
  tag: 'push',
  trigger: true,
  showBoxDebug: true,
  showBoxWireframe: false
})
scene.add(objPush)


var obj0 = new Object3D({
  rigidBody: new Physical({ width: 6, height: 3, depth: 6 }),
  boxColor: 0xf3f3f3, // BOX盒子颜色
  position: new THREE.Vector3(-18, 2, 0),
  tag: '0',
  rigidBodyType: '0', // 刚体标签
  rigidBodyFilter: [], // 根据刚体标签过滤碰撞的刚体
  gravity: true,
  showBoxDebug: true,
  showBoxWireframe: false
})
scene.add(obj0)

var obj = new Object3D({
  rigidBody: new Physical({ width: 13, height: 2, depth: 12 }),
  boxColor: 0xd1f6d5, // BOX盒子颜色 绿色
  position: new THREE.Vector3(8, 2, 0),
  tag: '1',
  showBoxDebug: true,
  showBoxWireframe: false
})
scene.add(obj)

var objs = new Object3D({
  rigidBody: new Physical({ width: 4, height: 2, depth: 4 }),
  boxColor: 0xddc1d5, // BOX盒子颜色 粉红色
  position: new THREE.Vector3(6, 4, 0),
  gravity: true,
  showBoxDebug: true,
  showBoxWireframe: false
})
scene.add(objs)

var obj1 = new Character({
  rigidBody: new Physical({ width: 1, height: 2, depth: 1 }),
  position: new THREE.Vector3(0, 8, 0),
  boxColor: 0xf3f3f3, // BOX盒子颜色
  tag: '2',
  rigidBodyFilter: ['0'], // 根据刚体标签过滤碰撞的刚体
  showBoxAxes: false,
  showBoxDebug: true,
  showBoxWireframe: true
})
scene.add(obj1)


var obj3 = new Object3D({
  rigidBody: new Physical({ width: 120, height: 1, depth: 120 }),
  boxColor: 0xd8d5d5, // BOX盒子颜色
  position: new THREE.Vector3(0, 0, 0),
  tag: '3',
  static: true,
  showBoxDebug: true,
  showBoxWireframe: false
})
scene.add(obj3)

obj.rigidBody.name = '1'
obj1.rigidBody.name = '2'
obj3.rigidBody.name = '3'

scene.showBoxDebug()

obj1.collision = function(boxs) {
  if (boxs.length) {
    document.querySelector('.board').innerHTML = '碰撞了'
  } else {
    document.querySelector('.board').innerHTML = ''
  }
}

window.obj1 = obj1

Game.run()

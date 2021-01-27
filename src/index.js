import Game from 'base/Game'
import Scene from 'base/Scene'
import Object3D from 'base/Object3D'
import Physical from 'base/Physical'
import { THREE } from 'common/libs'
import Character from 'components/Character'

var scene = new Scene()

var obj = new Object3D({
  rigidBody: new Physical({ width: 13, height: 6, depth: 12 }),
  boxColor: 0xf8f8f8, // BOX盒子颜色
  position: new THREE.Vector3(8, 18, 0),
  tag: '1',
  force: [
    new THREE.Vector3(0, -1, 0)
  ],
  showBoxDebug: true
})
scene.add(obj)

var obj1 = new Character({
  rigidBody: new Physical({ width: 4, height: 5, depth: 4 }),
  position: new THREE.Vector3(0, 8, 0),
  boxColor: 0xdcdcdc, // BOX盒子颜色
  tag: '2',
  force: [
    new THREE.Vector3(0, -1, 0)
  ],
  showBoxAxes: true,
  showBoxDebug: true
})
scene.add(obj1)


var obj3 = new Object3D({
  rigidBody: new Physical({ width: 120, height: 1, depth: 120 }),
  boxColor: 0x898989, // BOX盒子颜色
  position: new THREE.Vector3(0, 0, 0),
  tag: '3',
  gravity: false,
  showBoxDebug: true
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

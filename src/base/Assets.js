import { THREE } from 'common/libs'

const baseUrl = '/assets/'

const join = function (...rest) {
  return rest.join('').replace('//', '/')
}

const cloneGltf = function (gltf) {
  const clone = {
    animations: gltf.animations,
    scene: gltf.scene.clone(true)
  }
  const skinnedMeshes = {}
  gltf.scene.traverse(node => {
    if (node.isSkinnedMesh) {
      skinnedMeshes[node.name] = node;
    }
  })
  const cloneBones = {}
  const cloneSkinnedMeshes = {}
  clone.scene.traverse(node => {
    if (node.isBone) {
      cloneBones[node.name] = node;
    }
    if (node.isSkinnedMesh) {
      cloneSkinnedMeshes[node.name] = node;
    }
  })
  for (let name in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[name];
    const skeleton = skinnedMesh.skeleton;
    const cloneSkinnedMesh = cloneSkinnedMeshes[name];
    const orderedCloneBones = [];
    for (let i = 0; i < skeleton.bones.length; ++i) {
      const cloneBone = cloneBones[skeleton.bones[i].name]
      orderedCloneBones.push(cloneBone)
    }
    cloneSkinnedMesh.bind(
      new Skeleton(orderedCloneBones, skeleton.boneInverses),
      cloneSkinnedMesh.matrixWorld)
  }
  return clone
}

const assets = {}

class Loading {
  constructor(type, url) {
    this.url = url
    this.type = type
    this.textureLoader = new THREE.TextureLoader()
    this.modelLoader = new THREE.GLTFLoader()
  }
  load(cb) {
    switch (this.type) {
      case 'texture':
        return cb(this.textureLoader.load(this.url))
      case 'model':
        if (assets[this.url]) {
          cb(cloneGltf(assets[this.url]))
        } else {
          this.modelLoader.load(this.url, (gltf) => {
            assets[this.url] = gltf
            cb(cloneGltf(assets[this.url]))
          })
        }
        return 
      default:
        break;
    }
  }
}

class Assets {
  loadTexture(url) {
    return new Loading('texture', join(baseUrl, '/texture/', url))
  }
  loadModel(url) {
    return new Loading('model', join(baseUrl, '/model/', url))
  }
}

export default new Assets()
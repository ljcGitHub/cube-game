import { THREE } from 'common/libs'

const baseUrl = '/assets/'

const join = function (...rest) {
  return rest.join('').replace('//', '/')
}

class Loading {
  constructor(type, url) {
    this.url = url
    this.type = type
  }
  load(cb) {
    switch (this.type) {
      case 'texture':
        return cb(new THREE.TextureLoader().load(this.url))
      case 'model':
        return cb(new THREE.TextureLoader().load(this.url))
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
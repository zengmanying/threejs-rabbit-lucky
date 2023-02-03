import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Chest {
  constructor(game) {
    this.scene = game.scene
    this.target = null
    this.animations = null
    this.init()
  }
  init() {
    const loader = new GLTFLoader()
    loader.load("./assets/mod/chest/scene.gltf", gltf => {
      this.target = gltf.scene
      this.animations = gltf.animations
      this.target.scale.set(.005, .005, .005)
      this.target.position.set(0, 0.3, 2)
      this.target.traverse(c => {
        c.castShadow = true
        c.receiveShadow = true
        if (c.material && c.material.map) {
            c.material.map.encoding = THREE.sRGBEncoding
        }
    });
      this.mixer = new THREE.AnimationMixer(this.target)
      // this.mixer.addEventListener('finished', this.finishedAnimation.bind(this))
      this.scene.add(this.target)
    })
  }
}
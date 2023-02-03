import * as THREE from "three"
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VS, FS } from "./shander"
import Chest from "./chest"
export default class Game {
  constructor(element) {
    this.parentEl = element
    this.init()
  }

  init() {
    // camera
    const fov = 60
    const aspect = 1920 / 1080
    const near = 1.0
    const far = 10000.0
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(0, 1.3, 5)
    this.camera.rotation.set(-0.25, 0, 0)

    // scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000001)
    this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.002)

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight) 
    this.renderer.domElement.id = "game-canvas"
    this.parentEl.appendChild(this.renderer.domElement)
    this.createControls();
    this.addLight()
    this.addPlane()
    this.addSky()
    this.addChest()
    this.animate()
  }
  createControls() {
    this.controls = new TrackballControls( this.camera, this.renderer.domElement )
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 1.2
    this.controls.panSpeed = 0.8
  }
  addLight() {
    this.directLight = new THREE.DirectionalLight(0xFFFFFF, 1)
    this.directLight.position.set(-10, 200, 10);
    this.directLight.target.position.set(0, 0, 0);
    this.directLight.castShadow = true;
    this.directLight.shadow.bias = -0.001;
    this.directLight.shadow.mapSize.width = 4096;
    this.directLight.shadow.mapSize.height = 4096;
    this.directLight.shadow.camera.near = 0.1;
    this.directLight.shadow.camera.far = 1000.0;
    this.directLight.shadow.camera.left = 100;
    this.directLight.shadow.camera.right = -100;
    this.directLight.shadow.camera.top = 100;
    this.directLight.shadow.camera.bottom = -100;
    const lightHelp = new THREE.DirectionalLightHelper(this.directLight, 5)
    this.scene.add(lightHelp)
    this.scene.add(this.directLight);
  }
  addChest() {
    this.chest = new Chest(this)
  }
  addPlane() {
      let loader = new GLTFLoader();
      loader.load("./assets/mod/pokemon_center_scene/scene.gltf", gltf => {
          let target = gltf.scene;
          target.scale.set(1.2, 1.2, 1.2);
          target.position.set(3, 0, 6.5)
          target.rotation.set(0,-.8,0)
          target.traverse(c => {
              c.castShadow = true;
              c.receiveShadow = true;
              if (c.material && c.material.map) {
                  c.material.map.encoding = THREE.sRGBEncoding;
              }
          });
          this.scene.add(target);
      })
  }
  addSky() {
      const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 1);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      this.scene.add(hemiLight);

      const uniforms = {
          "topColor": { value: new THREE.Color(0x0077ff) },
          "bottomColor": { value: new THREE.Color(0xffffff) },
          "offset": { value: 33 },
          "exponent": { value: 0.6 }
      };
      uniforms["topColor"].value.copy(hemiLight.color);

      this.scene.fog.color.copy(uniforms["bottomColor"].value);

      const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
      const skyMat = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: VS,
          fragmentShader: FS,
          side: THREE.BackSide
      });

      const sky = new THREE.Mesh(skyGeo, skyMat);
      this.scene.add(sky);
  }
  animate() {
    requestAnimationFrame(() => {
      this.animate()
    })
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
  }
  destroy() {}
}
import * as THREE from "three";
import { random, pickRandom } from "../utils/math";
import { carLightsFragment, carLightsVertex } from "../shaders/carLights";

export class CarLights {
  constructor(webgl, options, colors, speed, fade) {
    this.webgl = webgl;
    this.options = options;
    this.colors = colors;
    this.speed = speed;
    this.fade = fade;
  }

  init() {
    const options = this.options;
    const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const aOffset = [], aMetrics = [], aColor = [];

    let colors = this.colors;
    if (Array.isArray(colors)) colors = colors.map((c) => new THREE.Color(c));
    else colors = new THREE.Color(colors);

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = random(options.carLightsRadius);
      const length = random(options.carLightsLength);
      const speed = random(this.speed);
      const carLane = i % options.lanesPerRoad;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
      laneX += random(options.carShiftX) * laneWidth;
      const offsetY = random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(options.length);
      const carWidth = random(options.carWidthPercentage) * laneWidth;

      aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
      aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
      aMetrics.push(radius, length, speed, radius, length, speed);

      const color = pickRandom(colors);
      aColor.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

    const material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign(
        { uTime: { value: 0 }, uTravelLength: { value: options.length }, uFade: { value: this.fade } },
        this.webgl.fogUniforms,
        options.distortion.uniforms,
      ),
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace("#include <getDistortion_vertex>", options.distortion.getDistortion);
    };

    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.webgl.scene.add(this.mesh);
  }

  update(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}
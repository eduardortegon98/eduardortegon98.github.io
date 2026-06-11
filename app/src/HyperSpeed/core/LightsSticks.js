import * as THREE from "three";
import { random, pickRandom } from "../utils/math";
import { sideSticksFragment, sideSticksVertex } from "../shaders/sideSticks";

export class LightsSticks {
  constructor(webgl, options) {
    this.webgl = webgl;
    this.options = options;
  }

  init() {
    const options = this.options;
    const instanced = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1));
    instanced.instanceCount = options.totalSideLightSticks;

    const stickoffset = options.length / (options.totalSideLightSticks - 1);
    const aOffset = [], aColor = [], aMetrics = [];

    let colors = options.colors.sticks;
    if (Array.isArray(colors)) colors = colors.map((c) => new THREE.Color(c));
    else colors = new THREE.Color(colors);

    for (let i = 0; i < options.totalSideLightSticks; i++) {
      aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());
      const color = pickRandom(colors);
      aColor.push(color.r, color.g, color.b);
      aMetrics.push(random(options.lightStickWidth), random(options.lightStickHeight));
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));

    const material = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(
        { uTravelLength: { value: options.length }, uTime: { value: 0 } },
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
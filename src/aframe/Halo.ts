import AframeComponent from "../interfaces/AframeComponent";

export const halo = {
  schema: {
      // Here we define our properties, their types and default values
      red: { type: "number", default: 0.6 },
      green: {type: "number", default: 1.0},
      blue: {type: "number", default: 0.9},
      opacity: { type: "number", default: 0.5 },
      c: {type: "number", default: 0.3},
      enabled: {type: "boolean", default: false}
  },

  init: function () {
      // Get the ref of the object to which the component is attached
      const obj = this.el.getObject3D("mesh");

      // Modify the material
      obj.material = new THREE.ShaderMaterial(
      {
          uniforms: {
              "r": {value: this.data.red},
              "g": {value: this.data.green},
              "b": {value: this.data.blue},
              "a": {value: this.data.opacity},
              "c": {value: this.data.c}
          },
          vertexShader:
          `
          varying vec3 vNormal;

          void main()
          {
              vNormal = normalize( normalMatrix * normal );
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
          `,
          fragmentShader:
          `
          varying vec3 vNormal;
          uniform float r;
          uniform float g;
          uniform float b;
          uniform float a;
          uniform float c;

          void main()
          {
              float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
              gl_FragColor = vec4(r, g, b, a) * intensity;
          }`,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true
      });
  },

  update: function () {},

  tick: function () {},

  remove: function () {},

  pause: function () {},

  play: function () {}

} as AframeComponent;

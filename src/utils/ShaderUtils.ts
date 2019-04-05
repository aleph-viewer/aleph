export class ShaderUtils {
  static haloVertex: string = `
    varying vec3 vNormal;

    void main()
    {
        vNormal = normalize( normalMatrix * normal );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

  static haloFragment: string = `
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
    }
  `;

  static getHaloMaterial(
    red: Number = 0.5,
    green: Number = 0.5,
    blue: number = 0.5,
    alpha: number = 0.1,
    chrominace: number = 0.5
  ): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        r: { value: red },
        g: { value: green },
        b: { value: blue },
        a: { value: alpha },
        c: { value: chrominace }
      },
      vertexShader: this.haloVertex,
      fragmentShader: this.haloFragment,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
  }
}

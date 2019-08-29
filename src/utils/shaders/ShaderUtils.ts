import haloFragmentS from '../../assets/shaders/halo/halo.frag';
import haloVertexS from '../../assets/shaders/halo/halo.vert';

export class ShaderUtils {
  public static getHaloMaterial(
    red: number = 0.5,
    green: number = 0.5,
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
      vertexShader: haloVertexS,
      fragmentShader: haloFragmentS,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
  }
}

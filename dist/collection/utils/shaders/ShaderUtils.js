import haloFragmentS from "../../assets/shaders/halo/halo.frag";
import haloVertexS from "../../assets/shaders/halo/halo.vert";
export class ShaderUtils {
    static getHaloMaterial(red = 0.5, green = 0.5, blue = 0.5, alpha = 0.1, chrominace = 0.5) {
        //return new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000 } )
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

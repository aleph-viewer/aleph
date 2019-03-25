import { AframeComponent, AframeObject } from "../interfaces/interfaces";

export class AlHalo implements AframeComponent {
  public static getObject(): AframeObject {
    return {
      schema: {},

      vertexShader: `
      varying vec3 vNormal;

      void main()
      {
          vNormal = normalize( normalMatrix * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
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

      init(): void {},
      update(): void {},
      tick(): void {},
      remove(): void {},
      pause(): void {},
      play(): void {}
    } as AframeObject;
  }

  public static getName(): string {
    return "al-halo";
  }
}

export class GLTFUtils {
  static setup(gltf: any): { mesh: THREE.Object3D; maxDist: number } {
    // todo: add animation, gltf camera support e.g.
    // https://github.com/donmccurdy/three-gltf-viewer/blob/master/src/viewer.js#L183
    // allow specifying envmap? https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_gltf.html#L92
    const obj = gltf.scene || gltf.scenes[0];

    let mesh: THREE.Mesh;

    if (obj instanceof THREE.Mesh) {
      mesh = obj;
    } else {
      obj.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          mesh = child;
        }
      });
    }

    let geom = mesh.geometry;

    if (geom instanceof THREE.BufferGeometry) {
      geom = new THREE.Geometry().fromBufferGeometry(
        mesh.geometry as THREE.BufferGeometry
      );
    }

    let maxDist = (geom as THREE.Geometry).vertices.reduce((a, b) => {
      return new THREE.Vector3(Math.min(a.length(), b.length()), 0, 0);
    }).x;

    return { mesh, maxDist };
  }
}

export class RaycasterUtils {

    static castRay(raycaster: THREE.Raycaster, focusObject: THREE.Object3D, camera: THREE.Camera, rayType: 
        ): { hitPosition: THREE.Vector3, hitNormal: THREE.Vector3 | null } | null 
        {
            let hitPosition = new THREE.Vector3(0, 0, 0);
            let hitNormal = new THREE.Vector3(0, 0, 0);


        switch (mode) {
          case Mode.MESH: {
            // TODO: This could be slow given every widget calls it
            let intersects: THREE.Intersection[] = raycaster.intersectObjects(loadedDataParent.children);
    
            if (intersects.length <= 0) {
              return null;
            }
    
            // Only set new normal from camera if in camera locking mode
            let hitNormal = null;
            if (camera) {
              hitNormal = intersects[0].point.clone().sub(camera.position.clone()).normalize();
            }
    
            return {hitPosition: intersects[0].point, hitNormal};
          }
          case Mode.SLICES: {
            let sliceHelper = stackHelper as AMI.StackHelper;
            let intersects = raycaster.intersectObject(sliceHelper.slice.mesh);
            if (intersects.length <= 0) {
              return null;
            }
    
            // Only set new normal from camera if in camera locking mode
            let hitNormal = null;
            if (camera) {
              hitNormal = intersects[0].face.normal;
            }
    
            return {hitPosition: intersects[0].point, hitNormal: hitNormal};
          }
          case Mode.VOLUME: {
            let hitPosition = new THREE.Vector3(0, 0, 0);
            let hitNormal = new THREE.Vector3(0, 0, 0);
        
            let volumeHelper = stackHelper as AMI.VolumeRenderingHelper;
            let ray_result = VolumeRay(
              volumeHelper,
              raycaster.ray.origin,
              raycaster.ray.direction,
              Constants.cameraValues.far,
              hitPosition,
              // Discard as DICOM Normals are incorrect
              hitNormal
            );
            if (ray_result === 0) {
              return null;
            }
    
            hitNormal = sceneCenter.sub(hitPosition).normalize();
    
            return {hitPosition, hitNormal};
          }
        }
        return null;
      }
}
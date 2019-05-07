import { Component, Prop } from "@stencil/core";
import { DisplayMode } from "../../enums";
import { GetUtils, ThreeUtils } from "../../utils";
import { Constants } from "../../Constants";
type Entity = import("aframe").Entity;

@Component({
  tag: "al-bounding-box",
  styleUrl: "al-bounding-box.css",
  shadow: true
})
export class AlBoundingBox {
  @Prop() srcLoaded: boolean;
  @Prop() boundingBoxEnabled: boolean;
  @Prop() boundingBox: THREE.Box3;
  @Prop() displayMode: DisplayMode;
  @Prop() targetEntity: Entity;
  @Prop() graphEnabled: boolean;
  @Prop() boundingEntity: Entity;
  @Prop() mesh: THREE.Mesh;

  render() {
    if (this.srcLoaded && this.boundingBoxEnabled) {
        let size: THREE.Vector3 = new THREE.Vector3();
        this.boundingBox.getSize(size);
  
        // if targetEntity is a gltf, use its position (center). 
        // if it's a volume, the origin is in the bottom left, so get the position sub the geometry center
        let position: THREE.Vector3;
  
        switch (this.displayMode) {
          case DisplayMode.MESH: {
            position = this.targetEntity.object3D.position.clone();
            break;
          }
          case DisplayMode.VOLUME:
          case DisplayMode.SLICES: {
            position = this.targetEntity.object3D.position
              .clone()
              .add(GetUtils.getGeometryCenter(this.mesh.geometry));
            break;
          }
        }
  
        if (this.displayMode === DisplayMode.VOLUME) {
          return (
            <a-entity
              position={ThreeUtils.vector3ToString(position)}
              al-bounding-box={`
                scale: ${ThreeUtils.vector3ToString(size)};
                color: ${Constants.colorValues.red};
              `}
              al-node-spawner={`
                graphEnabled: ${this.graphEnabled};
              `}
              class="collidable"
              ref={el => (this.boundingEntity = el)}
            />
          );
        } else {
          return (
            <a-entity
              position={ThreeUtils.vector3ToString(position)}
              al-bounding-box={`
                scale: ${ThreeUtils.vector3ToString(size)};
                color: ${Constants.colorValues.red};
              `}
              ref={el => (this.boundingEntity = el)}
            />
          );
        }
      }
  
      return null;
  }
}

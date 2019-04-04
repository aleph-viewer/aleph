import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils, AlGraphEvents } from "../utils";
import { AlGraphEntryType } from "../enums/AlGraphEntryType";

interface AlAngleState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.CylinderGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
}

interface AlAngleObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  elMouseDown(_event: CustomEvent): void;
  elRaycasterIntersected(_event: CustomEvent): void;
  elRaycasterIntersectedCleared(_event: CustomEvent): void;
}

export class AlAngle implements AframeRegistry {
  public static get Object(): AlAngleObject {
    return {
      schema: {
        selected: { type: "boolean" },
        nodeLeftPosition: { type: "vec3" },
        nodeRightPosition: { type: "vec3" },
        nodeCenterPosition: { type: "vec3" }
      },

      bindListeners(): void {
        this.elMouseDown = this.elMouseDown.bind(this);
        this.elRaycasterIntersected = this.elRaycasterIntersected.bind(this);
        this.elRaycasterIntersectedCleared = this.elRaycasterIntersectedCleared.bind(
          this
        );
        this.createMesh = this.createMesh.bind(this);
      },

      addListeners(): void {
        this.el.addEventListener("mousedown", this.elMouseDown, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected,
          { capture: false, once: false, passive: true }
        );
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared,
          { capture: false, once: false, passive: true }
        );
      },

      removeListeners(): void {
        this.el.removeEventListener("mousedown", this.elMouseDown);
        this.el.removeEventListener(
          "raycaster-intersected",
          this.elRaycasterIntersected
        );
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.elRaycasterIntersectedCleared
        );
      },

      elMouseDown(_event: CustomEvent): void {
        ThreeUtils.waitOneFrame(() => {
          this.el.sceneEl.emit(
            AlGraphEvents.SELECTED,
            { type: AlGraphEntryType.ANGLE, id: this.el.id },
            true
          );
        });
      },

      elRaycasterIntersected(_event: CustomEvent): void {
        let state = this.state as AlAngleState;
        state.hovered = true;
        this.el.sceneEl.emit(
          AlGraphEvents.INTERSECTION,
          { id: this.el.id },
          true
        );
      },

      elRaycasterIntersectedCleared(_event: CustomEvent): void {
        let state = this.state as AlAngleState;
        state.hovered = false;
        this.el.sceneEl.emit(AlGraphEvents.INTERSECTION_CLEARED, {}, true);
      },

      createMesh() {
        const nodeLeftPosition = ThreeUtils.objectToVector3(
          this.data.nodeLeftPosition
        );
        const nodeRightPosition = ThreeUtils.objectToVector3(
          this.data.nodeRightPosition
        );
        const nodeCenterPosition = ThreeUtils.objectToVector3(
          this.data.nodeCenterPosition
        );

        let centoid = nodeLeftPosition
          .clone()
          .add(nodeRightPosition)
          .divideScalar(2);

        var orientation = new THREE.Matrix4();
        orientation.lookAt(
          nodeCenterPosition,
          centoid,
          new THREE.Object3D().up
        );
        orientation.multiply(
          new THREE.Matrix4().set(
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            -1,
            0,
            0,
            0,
            0,
            0,
            1
          )
        );

        var geometry = new THREE.TorusGeometry(
          this.data.radius,
          this.data.radius,
          this.data.height,
          6,
          4
        );
        let material = new THREE.MeshBasicMaterial();
        material.depthTest = false;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.applyMatrix(orientation);
        mesh.renderOrder = 996;

        this.state.geometry = geometry;
        this.state.material = material;
        this.state.mesh = mesh;

        this.el.setObject3D("mesh", mesh);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.bindListeners();
        this.addListeners();

        this.state = {
          selected: true,
          hovered: false
        } as AlAngleState;
      },

      update(oldData): void {
        let state = this.state as AlAngleState;
        state.selected = this.data.selected;

        // If height or radius has changed, create a new mesh
        if (
          oldData &&
          (oldData.radius !== this.data.radius ||
            oldData.height !== this.data.height)
        ) {
          this.createMesh();
        }
      },

      tickFunction(): void {
        let state = this.state as AlAngleState;

        if (state.hovered) {
          state.material.color = new THREE.Color(Constants.nodeColors.hovered);
        } else if (state.selected) {
          state.material.color = new THREE.Color(Constants.nodeColors.selected);
        } else {
          state.material.color = new THREE.Color(Constants.nodeColors.normal);
        }
      },

      tick() {
        this.tickFunction();
      },

      remove(): void {
        this.removeListeners();
        this.el.removeObject3D("mesh");
      }
    } as AlAngleObject;
  }

  public static get Tag(): string {
    return "al-angle";
  }
}

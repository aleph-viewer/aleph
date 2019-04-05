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
  pointerDown(_event: CustomEvent): void;
  pointerOver(_event: CustomEvent): void;
  pointerOut(_event: CustomEvent): void;
}

export class AlAngle implements AframeRegistry {
  public static get Object(): AlAngleObject {
    return {
      schema: {
        selected: { type: "boolean" },
        nodeLeftPosition: { type: "vec3" },
        nodeRightPosition: { type: "vec3" },
        nodeCenterPosition: { type: "vec3" },
        radius: { type: "number" },
        angle: { type: "number" }
      },

      bindListeners(): void {
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
        this.createMesh = this.createMesh.bind(this);
      },

      addListeners(): void {
        this.el.addEventListener("mousedown", this.pointerDown, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener("raycaster-intersected", this.pointerOver, {
          capture: false,
          once: false,
          passive: true
        });
        this.el.addEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut,
          { capture: false, once: false, passive: true }
        );
      },

      removeListeners(): void {
        this.el.removeEventListener("mousedown", this.pointerDown);
        this.el.removeEventListener("raycaster-intersected", this.pointerOver);
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut
        );
      },

      pointerDown(_event: CustomEvent): void {
        this.el.sceneEl.emit(
          AlGraphEvents.SELECTED,
          { type: AlGraphEntryType.ANGLE, id: this.el.id },
          true
        );
      },

      pointerOver(_event: CustomEvent): void {
        let state = this.state as AlAngleState;
        state.hovered = true;
        this.el.sceneEl.emit(
          AlGraphEvents.POINTER_OVER,
          { id: this.el.id },
          true
        );
      },

      pointerOut(_event: CustomEvent): void {
        let state = this.state as AlAngleState;
        state.hovered = false;
        this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, true);
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

        let centoid = new THREE.Vector3();
        centoid.x = (nodeRightPosition.x + nodeLeftPosition.x) / 2;
        centoid.y = (nodeRightPosition.y + nodeLeftPosition.y) / 2;
        centoid.z = (nodeRightPosition.z + nodeLeftPosition.z) / 2;

        var orientation = new THREE.Matrix4();
        orientation.lookAt(
          nodeCenterPosition,
          centoid,
          new THREE.Object3D().up
        );
        orientation.multiply(
          new THREE.Matrix4().set(
            -1,
            0,
            0,
            0,
            0,
            0,
            -1,
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
          this.data.radius * 0.1,
          this.data.radius * 0.01,
          6,
          4,
          this.data.angle
        );
        let material = new THREE.MeshBasicMaterial();
        material.depthTest = false;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.applyMatrix(orientation);

        this.state.geometry = geometry;
        this.state.material = material;
        this.state.mesh = mesh;

        this.el.setObject3D("mesh", mesh);
        (this.el.object3D as THREE.Object3D).renderOrder = 996;
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

        this.createMesh();
      },

      update(oldData): void {
        let state = this.state as AlAngleState;
        state.selected = this.data.selected;

        // If height or radius has changed, create a new mesh
        if (oldData && oldData.angle !== this.data.angle) {
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

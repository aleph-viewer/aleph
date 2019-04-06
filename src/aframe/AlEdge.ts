import { AframeRegistry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils, AlGraphEvents, ShaderUtils } from "../utils";
import { AlGraphEntryType } from "../enums";

interface AlEdgeState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.CylinderGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  outlineGeometry: THREE.CylinderGeometry;
  outlineMaterial: THREE.MeshBasicMaterial;
  outlineMesh: THREE.Mesh;
}

interface AlEdgeObject extends AframeComponent {
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

export class AlEdge implements AframeRegistry {
  public static get Object(): AlEdgeObject {
    return {
      schema: {
        selected: { type: "boolean" },
        node1: { type: "vec3" },
        node2: { type: "vec3" },
        length: { type: "number" },
        radius: { type: "number" },
        nodeScale: { type: "number" }
      },

      bindListeners(): void {
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
        this.createMesh = this.createMesh.bind(this);
      },

      addListeners(): void {
        this.el.sceneEl.addEventListener("mousedown", this.pointerDown, {
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
        this.el.sceneEl.removeEventListener("mousedown", this.pointerDown);
        this.el.removeEventListener("raycaster-intersected", this.pointerOver);
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut
        );
      },

      pointerDown(_event: CustomEvent): void {
        let state = this.state as AlEdgeState;
        if (state.hovered) {
          this.el.sceneEl.emit(
            AlGraphEvents.SELECTED,
            { type: AlGraphEntryType.EDGE, id: this.el.id },
            false
          );
        }
      },

      pointerOver(_event: CustomEvent): void {
        let state = this.state as AlEdgeState;
        state.hovered = true;
        this.el.sceneEl.emit(
          AlGraphEvents.POINTER_OVER,
          { id: this.el.id },
          false
        );
      },

      pointerOut(_event: CustomEvent): void {
        let state = this.state as AlEdgeState;
        state.hovered = false;
        this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, false);
      },

      createMesh() {
        const node1Pos = ThreeUtils.objectToVector3(this.data.node1);
        const node2Pos = ThreeUtils.objectToVector3(this.data.node2);

        var orientation = new THREE.Matrix4();
        orientation.lookAt(node1Pos, node2Pos, new THREE.Object3D().up);
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

        let geometry = new THREE.CylinderGeometry(
          this.data.radius,
          this.data.radius,
          this.data.length,
          6,
          4
        );
        let material = new THREE.MeshBasicMaterial();
        // material.depthTest = false;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.applyMatrix(orientation);

        this.state.geometry = geometry;
        this.state.material = material;
        this.state.mesh = mesh;

        let outlineGeometry = new THREE.CylinderGeometry(
          this.data.radius,
          this.data.radius,
          this.data.length - this.data.nodeScale * 2,
          6,
          4
        );
        let outlineMaterial = ShaderUtils.getHaloMaterial();
        const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

        this.state.outlineGeometry = outlineGeometry;
        this.state.outlineMaterialt = outlineMaterial;
        this.state.outlineMesh = outlineMesh;

        mesh.add(outlineMesh);

        this.el.setObject3D("mesh", mesh);
        (this.el.object3D as THREE.Object3D).renderOrder = 997;
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
        } as AlEdgeState;
      },

      update(oldData): void {
        let state = this.state as AlEdgeState;
        state.selected = this.data.selected;

        // If length or radius has changed, create a new mesh
        if (
          oldData &&
          (oldData.radius !== this.data.radius ||
            oldData.length !== this.data.length)
        ) {
          this.createMesh();
        }
      },

      tickFunction(): void {
        let state = this.state as AlEdgeState;

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
    } as AlEdgeObject;
  }

  public static get Tag(): string {
    return "al-edge";
  }
}

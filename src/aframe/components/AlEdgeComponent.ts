import { Entity } from "aframe";
import { Constants } from "../../Constants";
import { AlGraphEntryType } from "../../enums";
import { AlGraphEvents, ThreeUtils } from "../../utils";
import { ShaderUtils } from "../../utils/shaders/ShaderUtils";
import { BaseComponent } from "./BaseComponent";

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
interface AlEdgeComponent extends BaseComponent {
  tickFunction(): void;
  pointerDown(_event: CustomEvent): void;
  pointerOver(_event: CustomEvent): void;
  pointerOut(_event: CustomEvent): void;
}

export default AFRAME.registerComponent("al-edge", {
  schema: {
    selected: { type: "boolean" },
    node1: { type: "vec3" },
    node2: { type: "vec3" },
    length: { type: "number" },
    radius: { type: "number" },
    nodeScale: { type: "number" },
    scale: { type: "number" }
  },

  init(): void {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );
    this.bindMethods();
    this.addEventListeners();

    this.state = {
      selected: true,
      hovered: false
    } as AlEdgeState;
  },

  bindMethods(): void {
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerOver = this.pointerOver.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
    this.createMesh = this.createMesh.bind(this);
    this.getMatrix = this.getMatrix.bind(this);
  },

  addEventListeners(): void {
    this.el.sceneEl.addEventListener("mousedown", this.pointerDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener("raycaster-intersected", this.pointerOver, {
      capture: true,
      once: false,
      passive: true
    });
    this.el.addEventListener("raycaster-intersected-cleared", this.pointerOut, {
      capture: false,
      once: false,
      passive: true
    });
  },

  removeEventListeners(): void {
    this.el.sceneEl.removeEventListener("mousedown", this.pointerDown);
    this.el.removeEventListener("raycaster-intersected", this.pointerOver);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut
    );
  },

  pointerDown(_event: CustomEvent): void {
    const state = this.state as AlEdgeState;
    if (state.hovered) {
      this.el.sceneEl.emit(
        AlGraphEvents.SELECTED,
        { type: AlGraphEntryType.EDGE, id: this.el.id },
        false
      );
    }
  },

  pointerOver(_event: CustomEvent): void {
    const state = this.state as AlEdgeState;
    state.hovered = true;
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OVER, { id: this.el.id }, false);
  },

  pointerOut(_event: CustomEvent): void {
    const state = this.state as AlEdgeState;
    state.hovered = false;
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, false);
  },

  getMatrix(): THREE.Matrix4 {
    // Set up vector of cylinder to be direction from 1 to 2; so that scale works properly
    const node1Pos = ThreeUtils.objectToVector3(this.data.node1);
    const node2Pos = ThreeUtils.objectToVector3(this.data.node2);

    const scale = new THREE.Matrix4();
    scale.makeScale(this.data.scale, this.data.scale, 1);
    // console.log(scale);

    const mult = new THREE.Matrix4();
    mult.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);

    const orientation = new THREE.Matrix4();
    orientation.lookAt(node1Pos, node2Pos, new THREE.Object3D().up);

    // 0 === x Scale, 5 === Y scale, 10 === Z scale
    orientation.multiply(scale);
    orientation.multiply(mult);
    return orientation;
  },

  createMesh() {
    const geometry = new THREE.CylinderGeometry(
      this.data.radius,
      this.data.radius,
      this.data.length,
      6,
      4
    );
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.applyMatrix(this.getMatrix());

    this.state.geometry = geometry;
    this.state.material = material;
    this.state.mesh = mesh;

    const outlineGeometry = new THREE.CylinderGeometry(
      this.data.radius,
      this.data.radius,
      this.data.length - this.data.nodeScale * 2,
      6,
      4
    );
    const outlineMaterial = ShaderUtils.getHaloMaterial();
    const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

    this.state.outlineGeometry = outlineGeometry;
    this.state.outlineMaterialt = outlineMaterial;
    this.state.outlineMesh = outlineMesh;

    mesh.add(outlineMesh);

    this.el.setObject3D("mesh", mesh);
    (this.el.object3D as THREE.Object3D).renderOrder =
      Constants.topLayerRenderOrder - 2;
  },

  // tslint:disable-next-line: no-any
  update(oldData: any): void {
    const state = this.state as AlEdgeState;
    state.selected = this.data.selected;

    // If length or radius has changed, create a new mesh
    if (
      oldData &&
      (oldData.radius !== this.data.radius ||
        oldData.length !== this.data.length ||
        oldData.scale !== this.data.scale)
    ) {
      this.createMesh();
    }
  },

  tickFunction(): void {
    const el = this.el;
    const state = this.state as AlEdgeState;

    // update color
    if (state.hovered) {
      state.material.color = new THREE.Color(Constants.buttonColors.hover);
    } else if (state.selected) {
      state.material.color = new THREE.Color(Constants.buttonColors.active);
    } else {
      state.material.color = new THREE.Color(Constants.buttonColors.up);
    }

    const text: Entity = el.firstChild;

    if (text) {
      const obj3d: THREE.Object3D = text.object3D;

      // show/hide label
      if (state.hovered) {
        obj3d.visible = true;
      } else {
        obj3d.visible = false;
      }
    }
  },

  tick() {
    this.tickFunction();
  },

  remove(): void {
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
  }
} as AlEdgeComponent);

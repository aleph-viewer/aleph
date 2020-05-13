import { Constants } from "../../Constants";
import { AlGraphEntryType } from "../../enums";
import { AlGraphEvents } from "../../utils";
import { ShaderUtils } from "../../utils/shaders/ShaderUtils";

AFRAME.registerComponent("al-angle", {
  schema: {
    angle: { type: "number" },
    edge0Pos: { type: "vec3" },
    edge1Pos: { type: "vec3" },
    length: { type: "number" },
    minFrameMS: { type: "number", default: 15 },
    position: { type: "vec3" },
    radius: { type: "number" },
    scale: { type: "number" },
    selected: { type: "boolean" }
  },

  init() {
    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      this.data.minFrameMS,
      this
    );
    this.bindMethods();
    this.addEventListeners();

    this.state = {
      selected: true,
      hovered: false
    };

    this.createMesh();
  },

  bindMethods() {
    this.createMesh = this.createMesh.bind(this);
    this.getMatrix = this.getMatrix.bind(this);
    this.objectToVector3 = this.objectToVector3.bind(this);
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
    this.pointerOver = this.pointerOver.bind(this);
  },

  objectToVector3(vec) {
    const res = new THREE.Vector3();
    res.x = vec.x;
    res.y = vec.y;
    res.z = vec.z;
    return res;
  },

  addEventListeners() {
    this.el.addEventListener("mousedown", this.pointerDown, {
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

  removeEventListeners() {
    this.el.removeEventListener("mousedown", this.pointerDown);
    this.el.removeEventListener("raycaster-intersected", this.pointerOver);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut
    );
  },

  pointerDown(_event) {
    this.el.sceneEl.emit(
      AlGraphEvents.SELECTED,
      { type: AlGraphEntryType.ANGLE, id: this.el.id },
      true
    );
  },

  pointerOver(_event) {
    const state = this.state;
    state.hovered = true;
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OVER, { id: this.el.id }, true);
  },

  pointerOut(_event) {
    const state = this.state;
    state.hovered = false;
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, true);
  },

  getMatrix() {
    // Set up vector of cylinder to be direction from 1 to 2; so that scale works properly
    const edgePos0 = this.objectToVector3(
      this.data.edge0Pos
    );
    const edgePos1 = this.objectToVector3(
      this.data.edge1Pos
    );

    const scale = new THREE.Matrix4();
    scale.makeScale(this.data.scale, this.data.scale, 1);

    const mult = new THREE.Matrix4();
    mult.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);

    const orientation = new THREE.Matrix4();
    orientation.lookAt(edgePos0, edgePos1, new THREE.Object3D().up);

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
    mesh.position.copy(this.objectToVector3(this.data.position));

    this.state.geometry = geometry;
    this.state.material = material;
    this.state.mesh = mesh;

    const outlineGeometry = new THREE.CylinderGeometry(
      this.data.radius,
      this.data.radius,
      this.data.length,
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
      Constants.topLayerRenderOrder - 3;
  },

  // tslint:disable-next-line: no-any
  update(oldData: any) {
    const state = this.state;
    state.selected = this.data.selected;

    // If height or radius has changed, create a new mesh
    if (
      oldData &&
      (oldData.angle !== this.data.angle || oldData.scale !== this.data.scale)
    ) {
      this.createMesh();
    }
  },

  tickFunction() {
    const el = this.el;
    const state = this.state;

    if (state.hovered) {
      state.material.color = new THREE.Color(Constants.buttonColors.hover);
    } else if (state.selected) {
      state.material.color = new THREE.Color(Constants.buttonColors.active);
    } else {
      state.material.color = new THREE.Color(Constants.buttonColors.up);
    }

    const text = el.firstChild;

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

  remove() {
    this.removeEventListeners();
    this.el.removeObject3D("mesh");
  }
});

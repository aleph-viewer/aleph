import { Constants } from "../../Constants";
import { AlGraphEntryType } from "../../enums";
import { AlGraphEvents } from "../../utils";
import { ShaderUtils } from "../../utils/shaders/ShaderUtils";

AFRAME.registerComponent("al-node", {
  schema: {
    graphEnabled: { type: "boolean" },
    minFrameMS: { type: "number", default: 15 },
    scale: { type: "number", default: 1 },
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

    const data = this.data;
    const el = this.el;
    const camera = el.sceneEl.camera.el.object3DMap.camera;

    if (data.scale < Constants.minNodeSize) {
      data.scale = Constants.minNodeSize;
    }

    const geometry = new THREE.SphereGeometry(data.scale, 16, 16);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    const outlineGeometry = new THREE.SphereGeometry(data.scale, 16, 16);
    const outlineMaterial = ShaderUtils.getHaloMaterial();
    const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
    mesh.add(outlineMesh);

    el.setObject3D("mesh", mesh);
    (el.object3D as THREE.Object3D).renderOrder =
      Constants.topLayerRenderOrder - 1;

    this.state = {
      selected: true,
      hovered: false,
      geometry,
      material,
      mesh,
      outlineGeometry,
      outlineMaterial,
      outlineMesh,
      camera,
      dragging: false
    };
  },

  bindMethods() {
    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.pointerOver = this.pointerOver.bind(this);
    this.pointerOut = this.pointerOut.bind(this);
  },

  addEventListeners() {
    this.el.sceneEl.addEventListener("mousedown", this.pointerDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.addEventListener("mouseup", this.pointerUp, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.addEventListener("mouseup", this.pointerUp, {
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
    this.el.sceneEl.removeEventListener("mousedown", this.pointerDown);
    this.el.sceneEl.removeEventListener("mouseup", this.pointerUp);
    this.el.removeEventListener("mouseup", this.pointerUp);
    this.el.removeEventListener("raycaster-intersected", this.pointerOver);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.pointerOut
    );
  },

  pointerDown(_event: CustomEvent) {
    const state = this.state;
    if (state.hovered) {
      this.el.sceneEl.emit(
        AlGraphEvents.SELECTED,
        { type: AlGraphEntryType.NODE, id: this.el.id },
        true
      );

      if (this.data.graphEnabled) {
        const stat = this.state;
        stat.mouseDown = true;
        this.el.sceneEl.emit(AlGraphEvents.POINTER_DOWN, {}, true);
      }
    }
  },

  pointerUp(_event: MouseEvent) {
    const state = this.state;
    if (this.data.graphEnabled) {
      state.dragging = false;
      state.mouseDown = false;
      this.el.sceneEl.emit(AlGraphEvents.POINTER_UP, {}, true);
    }
  },

  pointerOver(_event: CustomEvent) {
    const state = this.state;
    state.hovered = true;
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OVER, { id: this.el.id }, true);
  },

  pointerOut(_event: CustomEvent) {
    const state = this.state;
    state.hovered = false;
    if (state.mouseDown && state.selected) {
      state.dragging = true;
    }
    this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, true);
  },

  update() {
    const state = this.state;
    state.selected = this.data.selected;
  },

  tickFunction() {
    const el = this.el;
    const state = this.state;

    if (this.data.graphEnabled && state.dragging) {
      this.el.sceneEl.emit(AlGraphEvents.DRAGGED, { id: this.el.id }, true);
    }

    // update color
    if (state.hovered || state.dragging) {
      state.material.color = new THREE.Color(Constants.buttonColors.hover);
    } else if (state.selected) {
      state.material.color = new THREE.Color(Constants.buttonColors.active);
    } else {
      state.material.color = new THREE.Color(Constants.buttonColors.up);
    }

    const text = el.firstChild;

    if (text) {
      const obj3d = text.object3D;

      // show/hide label
      if (state.hovered || state.dragging) {
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

import { AframeRegistryEntry, AframeComponent } from "../interfaces";
import { Constants } from "../Constants";
import { ThreeUtils, ShaderUtils } from "../utils";
import { AlGraphEvents } from "../utils";
import { AlGraphEntryType } from "../enums";

interface AlNodeState {
  selected: boolean;
  hovered: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  outlineGeometry: THREE.SphereGeometry;
  outlineMaterial: THREE.ShaderMaterial;
  outlineMesh: THREE.Mesh;
  camera: THREE.Camera;
  target: THREE.Vector3;
  dragging: boolean;
  mouseDown: boolean;
}

interface AlNodeObject extends AframeComponent {
  update(oldData): void;
  tickFunction(): void;
  tick(): void;
  remove(): void;
  bindListeners(): void;
  addListeners(): void;
  removeListeners(): void;
  pointerDown(_event: CustomEvent): void;
  pointerUp(_event: MouseEvent): void;
  pointerOver(_event: CustomEvent): void;
  pointerOut(_event: CustomEvent): void;
}

export class AlNode implements AframeRegistryEntry {
  public static get Object(): AlNodeObject {
    return {
      schema: {
        target: { type: "vec3" },
        scale: { type: "number", default: 1 },
        selected: { type: "boolean" },
        graphEnabled: { type: "boolean" }
      },

      bindListeners(): void {
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
      },

      addListeners(): void {
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
        this.el.sceneEl.removeEventListener("mouseup", this.pointerUp);
        this.el.removeEventListener("mouseup", this.pointerUp);
        this.el.removeEventListener("raycaster-intersected", this.pointerOver);
        this.el.removeEventListener(
          "raycaster-intersected-cleared",
          this.pointerOut
        );
      },

      pointerDown(_event: CustomEvent): void {
        let state = this.state as AlNodeState;
        if (state.hovered) {
          this.el.sceneEl.emit(
            AlGraphEvents.SELECTED,
            { type: AlGraphEntryType.NODE, id: this.el.id },
            true
          );

          if (this.data.graphEnabled) {
            let state = this.state as AlNodeState;
            state.mouseDown = true;
            this.el.sceneEl.emit(AlGraphEvents.POINTER_DOWN, {}, true);
          }
        }
      },

      pointerUp(_event: MouseEvent): void {
        let state = this.state as AlNodeState;
        if (this.data.graphEnabled) {
          state.dragging = false;
          state.mouseDown = false;
          this.el.sceneEl.emit(AlGraphEvents.POINTER_UP, {}, true);
        }
      },

      pointerOver(_event: CustomEvent): void {
        let state = this.state as AlNodeState;
        state.hovered = true;
        this.el.sceneEl.emit(
          AlGraphEvents.POINTER_OVER,
          { id: this.el.id },
          true
        );
      },

      pointerOut(_event: CustomEvent): void {
        let state = this.state as AlNodeState;
        state.hovered = false;
        if (state.mouseDown && state.selected) {
          state.dragging = true;
        }
        this.el.sceneEl.emit(AlGraphEvents.POINTER_OUT, {}, true);
      },

      init(): void {
        this.tickFunction = AFRAME.utils.throttle(
          this.tickFunction,
          Constants.minFrameMS,
          this
        );
        this.bindListeners();
        this.addListeners();

        const data = this.data;
        let el = this.el;

        const camera = el.sceneEl.camera.el.object3DMap.camera;
        const geometry = new THREE.SphereGeometry(data.scale, 16, 16);
        let material = new THREE.MeshBasicMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        let outlineGeometry = new THREE.SphereGeometry(data.scale, 16, 16);
        let outlineMaterial = ShaderUtils.getHaloMaterial();
        const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
        mesh.add(outlineMesh);

        el.setObject3D("mesh", mesh);
        (el.object3D as THREE.Object3D).renderOrder = 998;

        let targetPos = ThreeUtils.objectToVector3(data.target);

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
          target: targetPos,
          dragging: false
        } as AlNodeState;
      },

      update(): void {
        let state = this.state as AlNodeState;
        state.target = this.data.target;
        state.selected = this.data.selected;
      },

      tickFunction(): void {
        let state = this.state as AlNodeState;
        if (this.data.graphEnabled && state.dragging) {
          this.el.sceneEl.emit(
            AlGraphEvents.DRAGGING,
            { id: this.el.id },
            true
          );
        }

        if (state.hovered || state.dragging) {
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
    } as AlNodeObject;
  }

  public static get Tag(): string {
    return "al-node";
  }
}

export class AlNodeEvents {
  static ANIMATION_STARTED: string = "al-animation-started";
}

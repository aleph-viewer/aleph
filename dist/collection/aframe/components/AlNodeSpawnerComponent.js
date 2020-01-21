import { ThreeUtils } from "../../utils";
import { AlGraphEvents } from "../../utils/GraphUtils";
export class AlNodeSpawnerEvents {
}
AlNodeSpawnerEvents.VALID_TARGET = "al-valid-target";
AlNodeSpawnerEvents.ADD_NODE = "al-add-node";
export default AFRAME.registerComponent("al-node-spawner", {
    schema: {
        graphEnabled: { type: "boolean" }
    },
    init() {
        this.bindMethods();
        this.addEventListeners();
        this.state = {
            left: false,
            intersecting: false
        };
    },
    bindMethods() {
        this.canvasMouseDown = this.canvasMouseDown.bind(this);
        this.pointerOver = this.pointerOver.bind(this);
        this.pointerOut = this.pointerOut.bind(this);
        this.elClick = this.elClick.bind(this);
        this.canvasMouseUp = this.canvasMouseUp.bind(this);
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
    },
    addEventListeners() {
        this.el.sceneEl.canvas.addEventListener("mousedown", this.canvasMouseDown, {
            capture: false,
            once: false,
            passive: true
        });
        this.el.sceneEl.canvas.addEventListener("mouseup", this.canvasMouseUp, {
            capture: false,
            once: false,
            passive: true
        });
        this.el.addEventListener("raycaster-intersected", this.pointerOver, {
            capture: false,
            once: false,
            passive: true
        });
        this.el.addEventListener("raycaster-intersected-cleared", this.pointerOut, false);
        this.el.addEventListener("click", this.elClick, {
            capture: false,
            once: false,
            passive: true
        });
        this.el.addEventListener("mousedown", this.pointerDown, {
            capture: false,
            once: false,
            passive: true
        });
        this.el.addEventListener("mouseup", this.pointerUp, {
            capture: false,
            once: false,
            passive: true
        });
    },
    removeEventListeners() {
        this.el.sceneEl.canvas.removeEventListener("mousedown", this.canvasMouseDown);
        this.el.sceneEl.canvas.removeEventListener("mouseup", this.canvasMouseUp);
        this.el.removeEventListener("raycaster-intersected", this.pointerOver);
        this.el.removeEventListener("raycaster-intersected-cleared", this.pointerOut);
        this.el.removeEventListener("click", this.elClick);
        this.el.removeEventListener("mousedown", this.pointerDown);
        this.el.removeEventListener("mouseup", this.pointerUp);
    },
    canvasMouseDown(event) {
        this.state.left = event.button === 0;
    },
    canvasMouseUp(_event) {
        ThreeUtils.waitOneFrame(() => {
            this.state.left = false;
        });
    },
    pointerOver(_event) {
        this.state.intersecting = true;
        this.el.sceneEl.emit(AlNodeSpawnerEvents.VALID_TARGET, { valid: true }, false);
    },
    pointerOut(_event) {
        this.state.intersecting = false;
        this.el.sceneEl.emit(AlNodeSpawnerEvents.VALID_TARGET, { valid: false }, false);
    },
    pointerDown(_event) {
        if (this.data.graphEnabled) {
            this.el.sceneEl.emit(AlGraphEvents.POINTER_DOWN, {}, false);
        }
    },
    pointerUp(_event) {
        if (this.data.graphEnabled) {
            this.el.sceneEl.emit(AlGraphEvents.POINTER_UP, {}, false);
        }
    },
    elClick(event) {
        if (this.state.left && this.data.graphEnabled) {
            this.el.sceneEl.emit(AlNodeSpawnerEvents.ADD_NODE, { aframeEvent: event }, false);
        }
    },
    remove() {
        this.removeEventListeners();
    }
});

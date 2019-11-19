import { Constants } from "../../Constants";
import { DisplayMode, Orientation } from "../../enums";
import { AMIUtils, EventUtils, Utils } from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";
import { VolumetricLoader } from "../../utils/VolumetricLoader";
export class AlVolumeEvents {
}
AlVolumeEvents.DEFAULT_RENDER_STEPS = "al-default-render-steps";
AlVolumeEvents.ERROR = "al-volume-error";
AlVolumeEvents.LOADED = "al-volume-loaded";
AlVolumeEvents.SLICES_MAX_INDEX = "al-volume-slices-max-index";
AlVolumeEvents.VOLUME_RAY_REQUEST = "al-volume-ray-requested";
AlVolumeEvents.VOLUME_RAY_CAST = "al-volume-ray-cast";
// tslint:disable-next-line: max-classes-per-file
export class AlVolumeCastType {
}
AlVolumeCastType.CREATE = "create";
AlVolumeCastType.DRAG = "drag";
export default AFRAME.registerComponent("al-volume", {
    schema: {
        controlsType: { type: "string" },
        displayMode: { type: "string" },
        slicesIndex: { type: "number" },
        slicesOrientation: { type: "string" },
        src: { type: "string" },
        srcLoaded: { type: "boolean" },
        volumeSteps: { type: "number" },
        volumeWindowCenter: { type: "number" },
        volumeWindowWidth: { type: "number" }
    },
    init() {
        this.tickFunction = AFRAME.utils.throttle(this.tickFunction, Constants.minFrameMS, this);
        this.loader = new VolumetricLoader();
        this.state = {
            bufferScene: new THREE.Scene(),
            bufferSceneTextureHeight: this.el.sceneEl.canvas.clientHeight,
            bufferSceneTextureWidth: this.el.sceneEl.canvas.clientWidth,
            debounce: false,
            frameTime: window.performance.now(),
            loaded: false,
            lastRenderTime: 0,
            volumeSteps: 0
        };
        this.bindMethods();
        this.addEventListeners();
        this.createBufferTexture();
        this.debouncedRenderBufferScene = EventUtils.debounce(this.renderBufferScene, Constants.minFrameMS).bind(this);
    },
    bindMethods() {
        this.addEventListeners = this.addEventListeners.bind(this);
        this.denormaliseVolumeSteps = this.denormaliseVolumeSteps.bind(this);
        this.castVolumeRay = this.castVolumeRay.bind(this);
        this.createBufferTexture = this.createBufferTexture.bind(this);
        this.getDefaultVolumeSteps = this.getDefaultVolumeSteps.bind(this);
        this.handleStack = this.handleStack.bind(this);
        this.onInteraction = this.onInteraction.bind(this);
        this.onInteractionFinished = this.onInteractionFinished.bind(this);
        this.removeEventListeners = this.removeEventListeners.bind(this);
        this.renderBufferScene = this.renderBufferScene.bind(this);
        this.rendererResize = this.rendererResize.bind(this);
        this.updateSlicesStack = this.updateSlicesStack.bind(this);
        this.updateVolumeStack = this.updateVolumeStack.bind(this);
    },
    addEventListeners() {
        this.el.sceneEl.addEventListener("rendererresize", this.rendererResize, false);
        this.el.sceneEl.addEventListener(AlControlEvents.INTERACTION, this.onInteraction, false);
        this.el.sceneEl.addEventListener(AlControlEvents.INTERACTION_FINISHED, this.onInteractionFinished, false);
        this.el.sceneEl.addEventListener(AlVolumeEvents.VOLUME_RAY_REQUEST, this.castVolumeRay, false);
    },
    removeEventListeners() {
        this.el.sceneEl.removeEventListener("rendererresize", this.rendererResize);
        this.el.sceneEl.removeEventListener(AlControlEvents.INTERACTION, this.onInteraction);
        this.el.sceneEl.removeEventListener(AlControlEvents.INTERACTION_FINISHED, this.onInteractionFinished);
        this.el.sceneEl.addEventListener(AlVolumeEvents.VOLUME_RAY_REQUEST, this.castVolumeRay);
    },
    castVolumeRay(event) {
        const camPos = event.detail.cameraPosition;
        const camDir = event.detail.cameraDirection;
        const intersection = event.detail.intersection;
        const hitPosition = new THREE.Vector3();
        const hitNormal = new THREE.Vector3();
        const rayResult = AMIUtils.volumeRay(this.state.stackhelper, camPos, camDir, Constants.camera.far, hitPosition, hitNormal);
        this.el.sceneEl.emit(AlVolumeEvents.VOLUME_RAY_CAST, {
            hitPosition,
            intersection,
            rayResult,
            hitNormal,
            type: event.detail.type
        });
    },
    createBufferTexture() {
        this.state.bufferSceneTexture = new THREE.WebGLRenderTarget(this.state.bufferSceneTextureWidth, this.state.bufferSceneTextureHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
        this.el.sceneEl
            .object3D.background = this.state.bufferSceneTexture.texture;
    },
    onInteraction(event) {
        if (this.state.stackhelper && event.detail.needsRender) {
            this.state.volumeSteps = 2;
        }
    },
    onInteractionFinished(event) {
        if (this.state.stackhelper && event.detail.needsRender) {
            this.state.volumeSteps = this.denormaliseVolumeSteps(this.data.volumeSteps);
        }
        this.state.debounce = false;
    },
    getDefaultVolumeSteps() {
        // default to 128 steps for desktop (2 ^ 7), 32 steps for mobile (2 ^ 5)
        let power;
        if (AFRAME.utils.device.isMobile()) {
            power = 5;
        }
        else {
            power = 7;
        }
        const steps = Math.pow(2, power);
        return steps;
    },
    denormaliseVolumeSteps(normalisedValue) {
        const steps = Math.pow(2, normalisedValue * 10);
        return steps;
    },
    rendererResize() {
        const state = this.state;
        const needsResize = state.bufferSceneTextureWidth !== this.el.sceneEl.canvas.clientWidth ||
            state.bufferSceneTextureHeight !== this.el.sceneEl.canvas.clientHeight;
        if (needsResize && this.data.displayMode === DisplayMode.VOLUME) {
            state.bufferSceneTextureWidth = this.el.sceneEl.canvas.clientWidth;
            state.bufferSceneTextureHeight = this.el.sceneEl.canvas.clientHeight;
            this.state.volumeSteps = this.data.volumeSteps;
        }
    },
    renderBufferScene() {
        if (this.data.displayMode === DisplayMode.VOLUME) {
            this.createBufferTexture();
            this.state.stackhelper.steps = this.state.volumeSteps;
            const prev = window.performance.now();
            this.el.sceneEl.renderer.render(this.state.bufferScene, this.el.sceneEl.camera, this.state.bufferSceneTexture);
            const post = window.performance.now();
            const renderTime = post - prev;
            this.state.lastRenderTime = renderTime;
            this.state.volumeSteps = 0;
        }
    },
    // tslint:disable-next-line: no-any
    handleStack(stack) {
        const state = this.state;
        const el = this.el;
        state.stack = stack;
        switch (this.data.displayMode) {
            case DisplayMode.SLICES: {
                state.stackhelper = new AMI.StackHelper(state.stack);
                state.stackhelper.bbox.visible = false;
                state.stackhelper.border.color = Constants.colors.blue;
                break;
            }
            case DisplayMode.VOLUME: {
                // Get LUT Canvas
                const lutCanvases = el.sceneEl.parentEl.querySelector("#lut-canvases");
                // Create the LUT Helper
                state.lutHelper = new AMI.LutHelper(lutCanvases);
                state.lutHelper.luts = AMI.LutHelper.presetLuts();
                state.lutHelper.lutsO = AMI.LutHelper.presetLutsO();
                state.stackhelper = new AMI.VolumeRenderHelper(state.stack);
                state.stackhelper.textureLUT = state.lutHelper.texture;
                state.stackhelper.steps = this.getDefaultVolumeSteps();
                break;
            }
            default: {
                break;
            }
        }
        // If a hot reload of the display, reset the mesh
        if (el.object3DMap.mesh) {
            el.removeObject3D("mesh");
        }
        // If slices mode, set stackhelper as the mesh
        if (this.data.displayMode === DisplayMode.SLICES) {
            el.setObject3D("mesh", this.state.stackhelper);
        }
        else {
            // Else place it in the buffer scene
            if (this.state.bufferScene.children.length) {
                this.state.bufferScene.remove(this.state.bufferScene.children[0]);
            }
            this.state.bufferScene.add(this.state.stackhelper);
        }
        if (!this.state.loaded) {
            el.sceneEl.emit(AlVolumeEvents.LOADED, state.stackhelper, false);
            this.state.loaded = true;
        }
    },
    updateSlicesStack() {
        if (!this.state.stackhelper ||
            (this.state.stackhelper &&
                !this.state.stackhelper.slice)) {
            return;
        }
        const orientationIndex = Object.keys(Orientation).indexOf(this.data.slicesOrientation.toUpperCase());
        // based off zCosine, x:1 = saggital, y:1 = coronal, z:1 = axial
        const zCosine = this.state.stackhelper.stack
            .zCosine;
        let orientationOffset;
        // If DICOM's up axis is X, offset the viewer's orientation by 1
        if (Math.round(zCosine.x) === 1) {
            orientationOffset = 1;
        }
        // If the DICOM's up is Y, offset the viewer's orientation by 2
        else if (Math.round(zCosine.y) === 1) {
            orientationOffset = 2;
        }
        // Else Orientation matches viewer orientation, no offset
        else {
            orientationOffset = 0;
        }
        // Wrap the orientationIndex so that it may never exceed 2
        const displayOrientationIndex = Math.round((orientationIndex + orientationOffset) % 3);
        const stackOrientationIndex = Math.round((orientationIndex + orientationOffset + 2) % 3);
        const slicesIndexMax = this.state.stackhelper.stack.dimensionsIJK[Object.keys(this.state.stackhelper.stack.dimensionsIJK)[stackOrientationIndex]] - 1;
        let index;
        if (stackOrientationIndex !== this._lastStackOrientationIndex ||
            this.data.slicesIndex === undefined) {
            // set default
            index = Math.floor(slicesIndexMax * 0.5);
            this.el.sceneEl.emit(AlVolumeEvents.SLICES_MAX_INDEX, slicesIndexMax, false);
        }
        else {
            index = slicesIndexMax * this.data.slicesIndex;
        }
        this._lastStackOrientationIndex = stackOrientationIndex;
        // brightness
        const windowCenterMax = this.state.stackhelper.stack.minMax[1];
        const windowCenter = Math.floor(Utils.reverseNumber(windowCenterMax * this.data.volumeWindowCenter, 0, windowCenterMax));
        // contrast
        const windowWidthMax = this.state.stackhelper.stack.minMax[1] -
            this.state.stackhelper.stack.minMax[0];
        const windowWidth = Math.floor(windowWidthMax * this.data.volumeWindowWidth);
        // update the stackhelper
        this.state
            .stackhelper.orientation = displayOrientationIndex;
        this.state.stackhelper.index = index;
        this.state
            .stackhelper.slice.windowCenter = windowCenter;
        this.state.stackhelper.slice.windowWidth = windowWidth;
    },
    updateVolumeStack() {
        if (!this.state.stackhelper) {
            return;
        }
        // brightness
        const windowCenterMax = this.state.stackhelper.stack.minMax[1];
        const windowCenter = Math.floor(Utils.reverseNumber(windowCenterMax * this.data.volumeWindowCenter, 0, windowCenterMax));
        // contrast
        const windowWidthMax = this.state.stackhelper.stack.minMax[1] -
            this.state.stackhelper.stack.minMax[0];
        const windowWidth = Math.floor(windowWidthMax * this.data.volumeWindowWidth);
        // update the stackhelper
        this.state
            .stackhelper.windowCenter = windowCenter;
        this.state
            .stackhelper.windowWidth = windowWidth;
    },
    // tslint:disable-next-line: no-any
    update(oldData) {
        const state = this.state;
        const el = this.el;
        if (!this.data.src) {
            return;
        }
        if (oldData && oldData.src !== this.data.src) {
            // loading
            this.loader.load(this.data.src, el).then(stack => {
                this.handleStack(stack);
            });
        }
        else if (oldData &&
            oldData.displayMode !== this.data.displayMode &&
            state.stack) {
            // switching display mode
            this.removeEventListeners();
            this.handleStack(state.stack);
            this.addEventListeners();
            // if in volume mode, create a buffer texture
            if (this.data.displayMode === DisplayMode.VOLUME) {
                this.createBufferTexture();
                // allow some time for the stackhelper to update
                setTimeout(() => {
                    const defaultVolumeSteps = this.getDefaultVolumeSteps();
                    const normalised = Math.log2(defaultVolumeSteps) / 10;
                    this.el.sceneEl.emit(AlVolumeEvents.DEFAULT_RENDER_STEPS, normalised, false);
                    this.state.volumeSteps = defaultVolumeSteps;
                }, Constants.volumeStepsDelay);
            }
            else {
                this.el.sceneEl.object3D.background = null;
            }
        }
        switch (this.data.displayMode) {
            case DisplayMode.SLICES: {
                this.updateSlicesStack();
                break;
            }
            case DisplayMode.VOLUME: {
                this.updateVolumeStack();
                if (oldData && oldData.volumeSteps !== this.data.volumeSteps) {
                    this.state.volumeSteps = this.denormaliseVolumeSteps(this.data.volumeSteps);
                }
                // if the controls type has changed, re-render the buffer scene
                if (oldData &&
                    oldData.controlsType &&
                    oldData.controlsType !== this.data.controlsType) {
                    setTimeout(() => {
                        this.state.volumeSteps = this.denormaliseVolumeSteps(this.data.volumeSteps);
                    }, Constants.volumeStepsDelay);
                }
                // if the volumeSteps changed
                if (oldData &&
                    oldData.volumeWindowCenter &&
                    oldData.volumeWindowCenter !== this.data.volumeWindowCenter) {
                    this.state.debounce = true;
                    this.state.stackhelper.stack.windowCenter = this.data.volumeWindowCenter;
                    this.state.volumeSteps = this.denormaliseVolumeSteps(this.data.volumeSteps);
                }
                // if the volumeWindowWidth changed
                if (oldData &&
                    oldData.volumeWindowWidth &&
                    oldData.volumeWindowWidth !== this.data.volumeWindowWidth) {
                    this.state.debounce = true;
                    this.state.stackhelper.stack.windowWidth = this.data.volumeWindowWidth;
                    this.state.volumeSteps = this.denormaliseVolumeSteps(this.data.volumeSteps);
                }
                break;
            }
            default: {
                break;
            }
        }
    },
    tickFunction() {
        if (!this.state.stackhelper) {
            return;
        }
        if (this.data.displayMode === DisplayMode.SLICES) {
            this.el.setObject3D("mesh", this.state.stackhelper);
        }
        if (this.state.volumeSteps > 0 && !this.state.debounce) {
            this.renderBufferScene();
        }
    },
    tick() {
        this.tickFunction();
    },
    remove() {
        if (this.data.displayMode === DisplayMode.SLICES) {
            this.el.removeObject3D("mesh");
        }
        this.removeEventListeners();
        this.el.sceneEl.object3D.background = null;
    }
});

import { ComponentDefinition } from 'aframe';
import { Constants } from '../../Constants';
import { AlCamera } from '../../interfaces';
import { ThreeUtils } from '../../utils';
import { AlControlEvents } from '../../utils/AlControlEvents';
import { AlTrackballControls } from '../../utils/AlTrackballControls';

interface AlTrackballControlState {
  animationCache: AlCamera[];
  cameraAnimationCache: THREE.Vector3[];
  // tslint:disable-next-line: no-any
  controls: AlTrackballControls; // THREE.TrackballControls;
  mouseDown: boolean;
  wheelCounter1: number;
  wheelCounter2: number;
  wheelInterval: number;
  wheelMarker: boolean;
}

interface AlTrackballControlComponent extends ComponentDefinition {
  dependencies: string[];
  tickFunction(): void;
  mouseUp(event: MouseEvent): void;
  mouseDown(event: MouseEvent): void;
  mouseMove(event: MouseEvent): void;
  canvasWheel(event: WheelEvent): void;
  onWheel(): void;
  handleAnimationCache(event: CustomEvent): void;
}

export default AFRAME.registerComponent('al-trackball-control', {
  dependencies: ['camera'],

  schema: {
    animating: { type: 'boolean', default: false },
    controlPosition: { type: 'vec3' },
    controlTarget: { type: 'vec3' },
    dynamicDampingFactor: { default: 0.1 },
    enabled: { type: 'boolean', default: true },
    maxDistance: { type: 'number', default: 8000 },
    minDistance: { type: 'number', default: 0 },
    noPan: { type: 'boolean', default: false },
    noRotate: { type: 'boolean', default: false },
    noZoom: { type: 'boolean', default: false },
    panSpeed: { type: 'number', default: 0.3 },
    rotateSpeed: { type: 'number', default: 1.0 },
    screenHeight: { type: 'number', default: 0 },
    screenLeft: { type: 'number', default: 0 },
    screenTop: { type: 'number', default: 0 },
    screenWidth: { type: 'number', default: 0 },
    staticMoving: { type: 'boolean', default: true },
    zoomSpeed: { type: 'number', default: 0.5 }
  },

  bindMethods() {
    this.canvasWheel = this.canvasWheel.bind(this);
    this.getCameraState = this.getCameraState.bind(this);
    this.handleAnimationCache = this.handleAnimationCache.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
  },

  addListeners() {
    window.addEventListener('mouseup', this.mouseUp, {
      capture: false,
      once: false,
      passive: true
    });
    window.addEventListener('mousemove', this.mouseMove, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.canvas.addEventListener('mousedown', this.mouseDown, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.canvas.addEventListener('wheel', this.canvasWheel, {
      capture: false,
      once: false,
      passive: true
    });
    this.el.sceneEl.oncontextmenu = e => {
      e.preventDefault();
    };
    this.el.sceneEl.addEventListener(
      AlControlEvents.ANIMATION_STARTED,
      this.handleAnimationCache,
      false
    );
  },

  removeListeners() {
    window.removeEventListener('mouseup', this.mouseUp);
    window.removeEventListener('mousemove', this.mouseMove),
      this.el.sceneEl.canvas.removeEventListener('mousedown', this.mouseDown);
    this.el.sceneEl.canvas.removeEventListener('wheel', this.canvasWheel);
    this.el.sceneEl.removeEventListener(
      AlControlEvents.ANIMATION_STARTED,
      this.handleAnimationCache,
      false
    );
  },

  handleAnimationCache(event: CustomEvent) {
    this.state.animationCache = event.detail.slerpPath;

    const camera = this.el.getObject3D('camera') as THREE.Camera;

    this.state.cameraAnimationCache = ThreeUtils.getSlerp3Path(
      camera.up.clone(),
      (this.state.controls as AlTrackballControls).up0
    );
  },

  mouseUp(_event: MouseEvent) {
    document.body.style.cursor = 'grab';
    const controls = this.state.controls;

    if (controls.enabled) {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION_FINISHED,
        {
          cameraState: this.getCameraState(),
          needsRender: this.state.mouseDown
        },
        false
      );
    }

    this.state.mouseDown = false;
  },

  mouseDown(_event: MouseEvent) {
    this.state.mouseDown = true;
    document.body.style.cursor = 'grabbing';
  },

  mouseMove(_event: MouseEvent) {
    if (this.state.mouseDown) {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION,
        { cameraState: this.getCameraState() },
        false
      );
    }
  },

  onWheel() {
    const state = this.state;

    state.wheelMarker = false;
    state.wheelCounter2 = state.wheelCounter1;

    setTimeout(() => {
      if (state.wheelCounter2 === state.wheelCounter1) {
        state.wheelMarker = true;
        state.wheelCounter1 = 0;
        state.wheelCounter2 = 0;
        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION_FINISHED,
          {
            cameraState: this.getCameraState(),
            needsRender: true
          },
          false
        );
      } else {
        this.onWheel();
      }
    }, state.wheelInterval);
  },

  canvasWheel(_event: WheelEvent) {
    const state = this.state;

    state.wheelCounter1 += 1;

    if (state.wheelMarker) {
      this.onWheel();
    }

    this.el.sceneEl.emit(
      AlControlEvents.INTERACTION,
      { cameraState: this.getCameraState() },
      false
    );
  },

  init() {
    const el = this.el;
    const data = this.data;
    document.body.style.cursor = 'grab';

    this.tickFunction = AFRAME.utils.throttle(
      this.tickFunction,
      Constants.minFrameMS,
      this
    );

    // tslint:disable-next-line: no-any
    const controls = new AlTrackballControls(
      el.getObject3D('camera'),
      el.sceneEl.renderer.domElement
    );

    // Convert the controlPosition & controlTarget Objects into THREE.Vector3
    const controlPosition = ThreeUtils.objectToVector3(data.controlPosition);
    const controlTarget = ThreeUtils.objectToVector3(data.controlTarget);

    controls.object.position.copy(controlPosition);
    el.getObject3D('camera').position.copy(controlPosition);
    controls.target.copy(controlTarget);

    const animationCache = [];

    (this.state as AlTrackballControlState) = {
      animationCache,
      cameraAnimationCache: null,
      controls,
      mouseDown: false,
      wheelCounter1: 0,
      wheelCounter2: undefined,
      wheelInterval: 50,
      wheelMarker: true
    };

    this.bindMethods();
    this.addListeners();

    // wait a frame before emitting initialised event
    ThreeUtils.waitOneFrame(() => {
      this.el.sceneEl.emit(
        AlControlEvents.INTERACTION,
        { cameraState: this.getCameraState() },
        false
      );
    });
  },

  getCameraState(): AlCamera {
    return {
      position: this.state.controls.object.position,
      target: this.state.controls.target
    } as AlCamera;
  },

  // tslint:disable-next-line: no-any
  update(_oldData: any) {
    const controls = this.state.controls;
    const data = this.data;

    controls.target = ThreeUtils.objectToVector3(data.controlTarget);
    controls.dynamicDampingFactor = data.dynamicDampingFactor;
    controls.enabled = data.enabled;
    controls.maxDistance = data.maxDistance;
    controls.minDistance = data.minDistance;
    controls.noPan = data.noPan;
    controls.noRotate = data.noRotate;
    controls.noZoom = data.noZoom;
    controls.panSpeed = data.panSpeed;
    controls.rotateSpeed = data.rotateSpeed;
    controls.screen.height = data.screenHeight;
    controls.screen.left = data.screenLeft;
    controls.screen.top = data.screenTop;
    controls.screen.width = data.screenWidth;
    controls.staticMoving = data.screenHeight;
    controls.zoomSpeed = data.zoomSpeed;

    this.el
      .getObject3D('camera')
      .position.copy(ThreeUtils.objectToVector3(data.controlPosition));
  },

  tickFunction() {
    const controls = this.state.controls;
    if (!controls.enabled) {
      return;
    }

    if (this.data.animating) {
      const nextFrame: AlCamera = this.state.animationCache.shift();
      const nextCamera: THREE.Vector3 = this.state.cameraAnimationCache.shift();

      if (nextFrame && nextFrame.position && nextFrame.target) {
        const camera = this.el.getObject3D('camera') as THREE.Camera;

        controls.object.position.copy(nextFrame.position);
        camera.position.copy(nextFrame.position);

        // Need to align Up vector as well to re-orient correctly
        // inside the Quaternion space that trackball uses
        if (nextCamera) {
          camera.up.copy(nextCamera);
        }
        controls.target.copy(nextFrame.target);

        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION,
          {
            cameraState: this.getCameraState()
          },
          false
        );
      }

      if (this.state.animationCache.length === 0) {
        this.el.sceneEl.emit(AlControlEvents.ANIMATION_FINISHED, {}, false);
        this.el.sceneEl.emit(
          AlControlEvents.INTERACTION_FINISHED,
          {
            cameraState: this.getCameraState(),
            needsRender: true
          },
          false
        );
      }
    }

    if (controls.enabled) {
      controls.update();
    }
  },

  tick() {
    this.tickFunction();
  },

  remove() {
    this.removeListeners();
    let state = this.state as AlTrackballControlState;
    state.controls.dispose();
    state = null;
  }
} as AlTrackballControlComponent);

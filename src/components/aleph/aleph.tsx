import {
  Component,
  Prop,
  State,
  Method,
  Event,
  EventEmitter
} from "@stencil/core";
import { Store, Action } from "@stencil/redux";
import {
  appSetSrc,
  appSetSrcLoaded,
  appAddTool,
  appRemoveTool,
  appSelectTool,
  appUpdateTool,
  appLoadTools,
  appSetDisplayMode,
  appSetOrientation,
  appSetToolsVisible,
  appSetToolsEnabled,
  appSetOptionsVisible,
  appSetOptionsEnabled,
  appSetBoundingBoxVisible,
  appSetSlicesIndex,
  appSetSlicesWindowWidth,
  appSetSlicesWindowCenter,
  appSetVolumeSteps,
  appSetVolumeWindowWidth,
  appSetVolumeWindowCenter,
  appSetCameraAnimating
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import { AlToolSerial, AlCameraSerial, AlAppState } from "../../interfaces";
import { GetUtils, ThreeUtils, CreateUtils } from "../../utils";
import { Constants } from "../../Constants";
import { MeshFileType, Orientation, DisplayMode } from "../../enums";
import {
  AlToolEvents,
  AlToolSpawnerEvents,
  AlGltfModelEvents,
  AlOrbitControlEvents
} from "../../aframe";
type Entity = import("aframe").Entity;
type Scene = import("aframe").Scene;

@Component({
  tag: "uv-aleph",
  styleUrl: "aleph.css",
  shadow: false
})
export class Aleph {
  //#region Private variables
  private _stack: any;
  private _stackHelper: AMI.StackHelper;

  private _targetEntity: Entity;
  private _splashBack: THREE.Mesh;
  private _scene: Scene;
  private _boundingSphereRadius: number;
  private _validTarget: boolean;
  private _camera: Entity;
  private _tcontrols: THREE.OrbitControls;
  private _intersectingTool: boolean;

  private _lastCameraPosition: THREE.Vector3;
  //#endregion

  //#region Redux states, props & methods
  @Prop({ context: "store" }) store: Store;
  @Prop() dracoDecoderPath: string | null;
  @Prop() width: string = "640px";
  @Prop() height: string = "480px";
  @Prop() debug: boolean = false;
  @Prop() spinnerColor: string = "#fff";

  appSetSrc: Action;
  appSetSrcLoaded: Action;
  appAddTool: Action;
  appRemoveTool: Action;
  appSelectTool: Action;
  appUpdateTool: Action;
  appLoadTools: Action;
  appSetDisplayMode: Action;
  appSetOrientation: Action;
  appSetToolsVisible: Action;
  appSetToolsEnabled: Action;
  appSetOptionsVisible: Action;
  appSetOptionsEnabled: Action;
  appSetBoundingBoxVisible: Action;
  appSetSlicesIndex: Action;
  appSetSlicesWindowWidth: Action;
  appSetSlicesWindowCenter: Action;
  appSetVolumeSteps: Action;
  appSetVolumeWindowWidth: Action;
  appSetVolumeWindowCenter: Action;
  appSetCameraAnimating: Action;

  @State() src: string | null;
  @State() srcLoaded: boolean;
  @State() selectedTool: string;
  @State() tools: AlToolSerial[];
  @State() displayMode: DisplayMode;
  @State() orientation: Orientation;
  @State() toolsVisible: boolean;
  @State() toolsEnabled: boolean;
  @State() optionsVisible: boolean;
  @State() optionsEnabled: boolean;
  @State() boundingBoxVisible: boolean;
  @State() slicesIndex: number;
  @State() slicesWindowWidth: number;
  @State() slicesWindowCenter: number;
  @State() volumeSteps: number;
  @State() volumeWindowWidth: number;
  @State() volumeWindowCenter: number;
  @State() cameraAnimating: boolean;

  @Method()
  async load(src: string) {
    // validate
    const fileExtension: string = GetUtils.getFileExtension(src);

    if (Object.values(MeshFileType).includes(fileExtension)) {
      if (this.displayMode !== DisplayMode.MESH) {
        throw new Error(
          "When setting 'src' to a mesh file you must set 'displayMode' to 'mesh'"
        );
      }
    } else {
      if (this.displayMode === DisplayMode.MESH) {
        throw new Error(
          "When setting 'src' to a non-mesh file you must set 'displayMode' to either 'slices' or 'volume'"
        );
      }
    }

    if (this.src) {
      this.appSetSrc(null); // shows loading spinner and resets gltf-model
      setTimeout(() => {
        this.appSetSrc(src);
      }, 1000);
    } else {
      this.appSetSrc(src);
    }
  }

  @Method()
  async setDisplayMode(displayMode: DisplayMode) {
    this.appSetDisplayMode(displayMode);
  }

  @Method()
  async loadTools(tools: AlToolSerial[]) {
    this._loadTools(tools);
  }

  @Method()
  async selectTool(toolId: string) {
    this._selectTool(toolId, true);
  }

  @Method()
  async setToolsEnabled(enabled: boolean) {
    this._setToolsEnabled(enabled);
  }

  @Method()
  async setBoundingBoxVisible(visible: boolean) {
    this._setBoundingBoxVisible(visible);
  }

  @Event() onLoad: EventEmitter;
  @Event() onSave: EventEmitter;
  @Event() onToolsChanged: EventEmitter;
  @Event() onSelectedToolChanged: EventEmitter;
  //#endregion

  componentWillLoad() {
    CreateUtils.createAframeComponents();

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: {
          src,
          srcLoaded,
          selectedTool,
          tools,
          displayMode,
          orientation,
          toolsVisible,
          toolsEnabled,
          optionsVisible,
          optionsEnabled,
          boundingBoxVisible,
          slicesIndex,
          slicesWindowWidth,
          slicesWindowCenter,
          volumeSteps,
          volumeWindowWidth,
          volumeWindowCenter,
          cameraAnimating
        }
      } = state;

      return {
        src,
        srcLoaded,
        selectedTool,
        tools,
        displayMode,
        orientation,
        toolsVisible,
        toolsEnabled,
        optionsVisible,
        optionsEnabled,
        boundingBoxVisible,
        slicesIndex,
        slicesWindowWidth,
        slicesWindowCenter,
        volumeSteps,
        volumeWindowWidth,
        volumeWindowCenter,
        cameraAnimating
      };
    });

    this.store.mapDispatchToProps(this, {
      appSetSrc,
      appSetSrcLoaded,
      appAddTool,
      appRemoveTool,
      appSelectTool,
      appUpdateTool,
      appLoadTools,
      appSetDisplayMode,
      appSetOrientation,
      appSetToolsVisible,
      appSetToolsEnabled,
      appSetOptionsVisible,
      appSetOptionsEnabled,
      appSetBoundingBoxVisible,
      appSetSlicesIndex,
      appSetSlicesWindowWidth,
      appSetSlicesWindowCenter,
      appSetVolumeSteps,
      appSetVolumeWindowWidth,
      appSetVolumeWindowCenter,
      appSetCameraAnimating
    });

    // set up event handlers
    this._srcLoaded = this._srcLoaded.bind(this);
    this._addToolEventHandler = this._addToolEventHandler.bind(this);
    this._validTargetEventHandler = this._validTargetEventHandler.bind(this);
    this._toolSelectedEventHandler = this._toolSelectedEventHandler.bind(this);
    this._intersectingToolEventHandler = this._intersectingToolEventHandler.bind(
      this
    );
    this._intersectionClearedEventHandler = this._intersectionClearedEventHandler.bind(
      this
    );
    this._toolMovedEventHandler = this._toolMovedEventHandler.bind(this);
    this._controlsInitEventHandler = this._controlsInitEventHandler.bind(this);
    this._controlsEnabledHandler = this._controlsEnabledHandler.bind(this);
    this._controlsDisabledHandler = this._controlsDisabledHandler.bind(this);
    this._animationFinished = this._animationFinished.bind(this);

    this._lastCameraPosition = new THREE.Vector3(0, 0, 0);
  }

  //#region Rendering Methods
  private _renderSpinner(): JSX.Element {
    if (!this.srcLoaded) {
      return (
        <a-entity
          cursor
          position="0 0 -2"
          rotation="0 0 0"
          animation="property: rotation; to: 0 120 0; loop: true; dur: 1000; easing: easeInOutQuad"
          geometry="primitive: al-spinner;"
          scale="0.05 0.05 0.05"
          material={`color: ${this.spinnerColor};`}
        />
      );
    }

    return null;
  }

  private _renderSrc(): JSX.Element {
    if (!this.src) {
      return null;
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return (
          <a-entity
            al-tool-spawner={`
              toolsEnabled: ${this.toolsEnabled};
            `}
            class="collidable"
            id="target-entity"
            ref={(el: Entity) => (this._targetEntity = el)}
            al-gltf-model={`
              src: url(${this.src});
              dracoDecoderPath: ${this.dracoDecoderPath};
            `}
            position="0 0 0"
            scale="1 1 1"
          />
        );
      }
      default: {
        return (
          <a-entity
            al-tool-spawner={`
            toolsEnabled: ${this.toolsEnabled};
          `}
            class="collidable"
            id="target-entity"
            ref={(el: Entity) => (this._targetEntity = el)}
            al-volumetric-model={`
              src: url(${this.src});
            `}
            position="0 0 0"
            scale="1 1 1"
          />
        );
      }
    }
  }

  private _renderTools(): JSX.Element {
    const outTools: JSX.Element[] = [];
    const dataTools: AlToolSerial[] = this.tools;

    for (var i = 0; i < dataTools.length; i++) {
      if (i < dataTools.length) {
        const tool: AlToolSerial = dataTools[i];
        outTools.push(
          <a-entity
            class="collidable"
            id={tool.id}
            rotation="0 0 0"
            position={tool.position}
            al-tool={`
              target: ${tool.target};
              scale: ${tool.scale};
              selected: ${this.selectedTool === tool.id};
              toolsEnabled: ${this.toolsEnabled};
              text: ${tool.text};
              textOffset: ${tool.textOffset};
            `}
          />
        );
      }
    }
    return outTools;
  }

  private _renderLights(): JSX.Element {
    return [
      <a-entity
        light="type: directional; color: #ffffff; intensity: 0.75"
        position="1 1 1"
      />,
      <a-entity
        light="type: directional; color: #002958; intensity: 0.5"
        position="-1 -1 -1"
      />,
      <a-entity light="type: ambient; color: #d0d0d0; intensity: 1" />
    ];
  }

  private _renderCamera(): JSX.Element {
    let camData = {
      position: this._lastCameraPosition,
      target: new THREE.Vector3(0, 0, 0)
    } as AlCameraSerial;
    let mesh: THREE.Mesh;
    let radius: number = 1;

    // IF we're animating to a tool
    // TODO: Differentiate between Tool -> Tool && Target -> Target animations
    if (this.cameraAnimating) {
      // Get camera state from tool and set as result
      let result = GetUtils.getCameraStateFromTool(
        GetUtils.getToolById(this.selectedTool, this.tools)
      );
      // If we returned a result AND the difference between the last position and the result position is not 0
      const diff = result.position.distanceTo(this._lastCameraPosition);
      if (result && diff !== 0) {
        camData = result;
        this._lastCameraPosition = camData.position;
        mesh = this._targetEntity.object3DMap.mesh as THREE.Mesh;
        radius = mesh.geometry.boundingSphere.radius;
      }
    }

    return (
      <a-camera
        id="mainCamera"
        cursor="rayOrigin: mouse"
        raycaster="objects: .collidable"
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls="enabled: false"
        far={Constants.cameraValues.far}
        al-orbit-control={`
      maxPolarAngle: ${Constants.cameraValues.maxPolarAngle};
      minDistance: ${Constants.cameraValues.minDistance};
      screenSpacePanning: true;
      rotateSpeed: ${Constants.cameraValues.rotateSpeed};
      zoomSpeed: ${Constants.cameraValues.zoomSpeed};
      enableDamping: true;
      dampingFactor: ${Constants.cameraValues.dampingFactor};
      targetPosition: ${ThreeUtils.vector3ToString(camData.target)};
      cameraPosition: ${ThreeUtils.vector3ToString(camData.position)};
      boundingRadius: ${radius};
      cameraAnimating: ${this.cameraAnimating}
    `}
        ref={el => (this._camera = el)}
      >
        {this._renderSpinner()}
      </a-camera>
    );
  }

  private _renderScene(): JSX.Element {
    return (
      <a-scene
        embedded
        renderer="colorManagement: true;"
        vr-mode-ui="enabled: false"
        ref={el => (this._scene = el)}
      >
        {this._renderSrc()}
        {this._renderTools()}
        {this._renderLights()}
        {this._renderCamera()}
      </a-scene>
    );
  }

  render(): JSX.Element {
    return (
      <div
        id="al-wrapper"
        style={{
          width: this.width,
          height: this.height
        }}
      >
        {this._renderScene()}
      </div>
    );
  }
  //#endregion

  //#region Private methods
  private _loadTools(tools: AlToolSerial[]): void {
    // remove all existing tools
    while (this.tools.length) {
      this.appRemoveTool(this.tools[this.tools.length - 1].id);
    }

    this.appLoadTools(tools);
    this.onToolsChanged.emit(this.tools);
  }

  private _addTool(tool: AlToolSerial): void {
    this.appAddTool(tool);
    this.onToolsChanged.emit(this.tools);
    this._selectTool(tool.id, false);
  }

  private _selectTool(toolId: string, animate: boolean): void {
    if (animate && toolId !== this.selectedTool) {
      this.appSetCameraAnimating(true); // todo: can we pass boolean to appSelectTool to set cameraAnimating in the state?
    }
    this.appSelectTool(toolId);
    this.onSelectedToolChanged.emit(this.selectedTool);
  }

  private _setToolsEnabled(enabled: boolean): void {
    this.appSetToolsEnabled(enabled);
  }

  private _setBoundingBoxVisible(visible: boolean): void {
    this.appSetBoundingBoxVisible(visible);
  }

  private _srcLoaded(): void {
    const mesh: THREE.Mesh = this._targetEntity.object3DMap.mesh as THREE.Mesh;
    mesh.geometry.computeBoundingSphere();
    this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;
    this.appSetSrcLoaded(true);
    this.onLoad.emit({
      selectedTool: this.selectedTool,
      tools: this.tools
    } as AlAppState);
    let result = GetUtils.getCameraStateFromEntity(this._targetEntity);
    if (result) {
      this._lastCameraPosition = result.position;
    }
  }
  //#endregion

  //#region Event Handlers
  private _animationFinished(_event: CustomEvent): void {
    this.appSetCameraAnimating(false);
  }

  private _controlsEnabledHandler(_event: CustomEvent): void {
    this._tcontrols.enabled = true;
  }

  private _controlsDisabledHandler(_event: CustomEvent): void {
    this._tcontrols.enabled = false;
  }

  private _controlsInitEventHandler(event: CustomEvent): void {
    this._tcontrols = event.detail.controls;
    this._splashBack = event.detail.splashBack;
    this._scene.sceneEl.object3D.add(this._splashBack);
  }

  private _intersectionClearedEventHandler(_evt): void {
    this._intersectingTool = false;
  }

  private _intersectingToolEventHandler(_evt): void {
    this._intersectingTool = true;
  }

  private _addToolEventHandler(event: CustomEvent): void {
    if (this.toolsEnabled && this._validTarget && !this._intersectingTool) {
      let intersection: THREE.Intersection = event.detail.detail.intersection;

      const newTool: AlToolSerial = CreateUtils.createTool(
        this.tools,
        this._targetEntity.object3D.position,
        intersection.point,
        this._boundingSphereRadius
      );

      this._addTool(newTool);
    }
  }

  private _validTargetEventHandler(event: CustomEvent): void {
    this._validTarget = event.detail.payload;
  }

  private _toolSelectedEventHandler(event: CustomEvent): void {
    this._selectTool(event.detail.id, false);
  }

  private _toolMovedEventHandler(event: CustomEvent): void {
    const toolId: string = event.detail.id;
    const raycaster = this._camera.components.raycaster as any;

    // First try target
    let intersection = raycaster.getIntersection(
      this._targetEntity
    ) as THREE.Intersection;

    if (!intersection) {
      // Next try splashback
      intersection = (raycaster.raycaster as THREE.Raycaster).intersectObject(
        this._splashBack
      )[0];
    }

    if (intersection) {
      this.appUpdateTool({
        id: toolId,
        position: ThreeUtils.vector3ToString(intersection.point)
      });
    } else {
      console.log("No intersection!");
    }
  }

  private _addEventListeners(): void {
    if (this._scene) {
      this._scene.addEventListener(
        AlOrbitControlEvents.ANIMATION_FINISHED,
        this._animationFinished,
        false
      );
      this._scene.addEventListener(
        AlOrbitControlEvents.INIT,
        this._controlsInitEventHandler,
        false
      );
      this._scene.addEventListener(
        AlToolEvents.CONTROLS_ENABLED,
        this._controlsEnabledHandler,
        false
      );
      this._scene.addEventListener(
        AlToolEvents.CONTROLS_DISABLED,
        this._controlsDisabledHandler,
        false
      );
      this._scene.addEventListener(
        AlToolEvents.DRAGGING,
        this._toolMovedEventHandler,
        false
      );
      this._scene.addEventListener(
        AlToolSpawnerEvents.ADD_TOOL,
        this._addToolEventHandler,
        false
      );
      this._scene.addEventListener(
        AlToolEvents.SELECTED,
        this._toolSelectedEventHandler,
        false
      );
      this._scene.addEventListener(
        AlToolSpawnerEvents.VALID_TARGET,
        this._validTargetEventHandler,
        false
      );

      if (this._targetEntity) {
        this._targetEntity.addEventListener(
          AlGltfModelEvents.LOADED,
          this._srcLoaded,
          false
        );
      }

      if (this._camera) {
        this._camera.addEventListener(
          AlToolEvents.INTERSECTION,
          this._intersectingToolEventHandler,
          false
        );
        this._camera.addEventListener(
          AlToolEvents.INTERSECTION_CLEARED,
          this._intersectionClearedEventHandler,
          false
        );
      }
    }
  }
  //#endregion

  componentDidLoad() {}

  componentDidUpdate() {
    this._addEventListeners();

    // Turns debug text inside the models invisible
    // TODO: Wire to debug variable
    if (this.debug) {
      try {
        const mat = (this._camera.object3DMap.text as THREE.Mesh)
          .material as THREE.Material;
        if (mat) {
          mat.transparent = true;
        }
      } catch {}
    }
  }
}

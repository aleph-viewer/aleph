import { KeyDown } from "@edsilv/key-codes";
import "@edsilv/stencil-redux";
import { Action, Store } from "@edsilv/stencil-redux";
import "@ionic/core";
import {
  Component,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State
} from "@stencil/core";
import { Sphere } from "three";
import "../../aframe";
import { AlGltfModelEvents, AlNodeSpawnerEvents } from "../../aframe";
import {
  AlVolumeCastType,
  AlVolumeEvents
} from "../../aframe/components/al-volume";
import "../../assets/OrbitControls.js";
import { Constants } from "../../Constants";
import {
  AlGraphEntryType,
  ControlsType,
  DisplayMode,
  Material,
  Orientation,
  Units
} from "../../enums";
import {
  Angles,
  BoundingBox,
  Edges,
  Lights,
  Nodes,
  OrbitCamera,
  Scene,
  Src,
  TrackballCamera
} from "../../functional-components/aframe";
import { AlAngle, AlCamera, AlEdge, AlGraph, AlNode } from "../../interfaces";
import {
  appClearAngles,
  appClearEdges,
  appClearNodes,
  appDeleteAngle,
  appDeleteEdge,
  appDeleteNode,
  appSelectAngle,
  appSelectEdge,
  appSelectNode,
  appSetAngle,
  appSetBoundingBoxEnabled,
  appSetCamera,
  appSetControlsEnabled,
  appSetControlsType,
  appSetDisplayMode,
  appSetEdge,
  appSetGraphEnabled,
  appSetMaterial,
  appSetNode,
  appSetOrientation,
  appSetSlicesIndex,
  appSetSlicesMaxIndex,
  appSetSrc,
  appSetSrcLoaded,
  appSetUnits,
  appSetVolumeSteps,
  appSetVolumeWindowCenter,
  appSetVolumeWindowWidth
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import {
  AlGraphEvents,
  EventUtils,
  GraphUtils,
  ThreeUtils,
  Utils
} from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";
import { ModelContainer } from "../../functional-components/aframe/ModelContainer";

type AEntity = import("aframe").Entity;
type AScene = import("aframe").Scene;
//#endregion

@Component({
  tag: "al-viewer",
  styleUrl: "al-viewer.css",
  shadow: false
})
export class Aleph {
  //#region Private variables
  private _boundingBox: THREE.Box3;
  private _boundingSphereRadius: number;
  private _camera: AEntity;
  private _debouncedAppSetCamera: (state: AlCamera) => void;
  private _hovered: string | null = null;
  private _isShiftDown: boolean = false;
  private _isWebGl2: boolean = true;
  // tslint:disable-next-line: no-any
  private _loadedObject: any;
  private _scene: AScene;
  private _sceneDistance: number;
  private _targetEntity: AEntity;
  private _validTarget: boolean;
  private _boundingEntity: AEntity;
  //#endregion

  //#region props
  @Prop({ context: "store" }) public store: Store;
  @Prop() public dracoDecoderPath: string | null;
  @Prop() public envMapPath: string | null;
  @Prop() public width: string = "640";
  @Prop() public height: string = "480";
  //#endregion

  //#region actions
  public appClearAngles: Action;
  public appClearEdges: Action;
  public appClearNodes: Action;
  public appDeleteAngle: Action;
  public appDeleteEdge: Action;
  public appDeleteNode: Action;
  public appSelectAngle: Action;
  public appSelectEdge: Action;
  public appSelectNode: Action;
  public appSetAngle: Action;
  public appSetBoundingBoxEnabled: Action;
  public appSetCamera: Action;
  public appSetControlsEnabled: Action;
  public appSetControlsType: Action;
  public appSetDisplayMode: Action;
  public appSetEdge: Action;
  public appSetGraphEnabled: Action;
  public appSetMaterial: Action;
  public appSetNode: Action;
  public appSetOrientation: Action;
  public appSetSlicesIndex: Action;
  public appSetSlicesMaxIndex: Action;
  public appSetSrc: Action;
  public appSetSrcLoaded: Action;
  public appSetUnits: Action;
  public appSetVolumeSteps: Action;
  public appSetVolumeWindowCenter: Action;
  public appSetVolumeWindowWidth: Action;
  //#endregion

  //#region state
  @State() public angles: Map<string, AlAngle>;
  @State() public boundingBoxEnabled: boolean;
  @State() public camera: AlCamera;
  @State() public controlsEnabled: boolean;
  @State() public controlsType: ControlsType;
  @State() public displayMode: DisplayMode;
  @State() public edges: Map<string, AlEdge>;
  @State() public graphEnabled: boolean;
  @State() public material: Material;
  @State() public nodes: Map<string, AlNode>;
  @State() public nodesVisible: boolean;
  @State() public optionsEnabled: boolean;
  @State() public optionsVisible: boolean;
  @State() public orientation: Orientation;
  @State() public selected: string;
  @State() public slicesIndex: number;
  @State() public slicesMaxIndex: number;
  @State() public src: string | null;
  @State() public srcLoaded: boolean;
  @State() public units: Units;
  @State() public volumeSteps: number;
  @State() public volumeWindowCenter: number;
  @State() public volumeWindowWidth: number;
  //#endregion

  //#region general methods

  @Method()
  public async load(src: string, displayMode?: DisplayMode): Promise<void> {
    // validate
    if (this.src) {
      this._setSrc(null); // shows loading spinner and resets gltf-model
      setTimeout(() => {
        this._setSrc(src, displayMode);
      }, Constants.minLoadingMS);
    } else {
      this._setSrc(src, displayMode);
    }
  }

  @Method()
  public async resize(): Promise<void> {
    this._resize();
  }

  //#endregion

  //#region node methods

  @Method()
  public async setNode(node: [string, AlNode]): Promise<void> {
    this._setNode(node);
  }

  @Method()
  public async setGraph(graph: AlGraph): Promise<void> {
    this._setGraph(graph);
  }

  @Method()
  public async deleteNode(nodeId: string): Promise<void> {
    this._deleteNode(nodeId);
  }

  @Method()
  public async clearGraph(): Promise<void> {
    this._clearGraph();
  }

  @Method()
  public async selectNode(nodeId: string): Promise<void> {
    this._selectNode(nodeId, true);
  }

  @Method()
  public async deleteEdge(edgeId: string): Promise<void> {
    this._deleteEdge(edgeId);
  }

  @Method()
  public async deleteAngle(angleId: string): Promise<void> {
    this._deleteAngle(angleId);
  }

  //#endregion

  //#region Edge Methods

  /** Creates or updates an edge in the graph */
  @Method()
  public async setEdge(edge: [string, AlEdge]): Promise<void> {
    this._setEdge(edge);
  }
  //#endregion

  //#region control panel methods

  @Method()
  public async recenter(): Promise<void> {
    this._recenter();
  }

  @Method()
  public async setBoundingBoxEnabled(visible: boolean): Promise<void> {
    this._setBoundingBoxEnabled(visible);
  }

  @Method()
  public async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this._setDisplayMode(displayMode);
  }

  @Method()
  public async setControlsEnabled(enabled: boolean): Promise<void> {
    this._setControlsEnabled(enabled);
  }

  @Method()
  public async setControlsType(type: ControlsType): Promise<void> {
    this._setControlsType(type);
  }

  @Method()
  public async setGraphEnabled(enabled: boolean): Promise<void> {
    this._setGraphEnabled(enabled);
  }

  @Method()
  public async setMaterial(material: Material): Promise<void> {
    this._setMaterial(material);
  }

  @Method()
  public async setOrientation(orientation: Orientation): Promise<void> {
    this._setOrientation(orientation);
  }

  @Method()
  public async setSlicesIndex(index: number): Promise<void> {
    this._setSlicesIndex(index);
  }

  @Method()
  public async setUnits(units: Units): Promise<void> {
    this._setUnits(units);
  }

  @Method()
  public async setVolumeSteps(steps: number): Promise<void> {
    this._setVolumeSteps(steps);
  }

  @Method()
  public async setVolumeBrightness(brightness: number): Promise<void> {
    this._setVolumeWindowCenter(brightness);
  }

  @Method()
  public async setVolumeContrast(contrast: number): Promise<void> {
    this._setVolumeWindowWidth(contrast);
  }

  //#endregion

  //#region events
  /** Fires whenever the internal state changes passing an object describing the state. */
  @Event() public changed: EventEmitter;

  /** Fires when an object is loaded passing either the object or a stackhelper for volumetric data. */
  @Event() public loaded: EventEmitter;

  //#endregion

  protected async componentWillLoad() {
    this._isWebGl2 = ThreeUtils.isWebGL2Available();

    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: {
          angles,
          boundingBoxEnabled,
          camera,
          controlsEnabled,
          controlsType,
          displayMode,
          edges,
          graphEnabled,
          material,
          nodes,
          orientation,
          selected,
          slicesIndex,
          slicesMaxIndex,
          src,
          srcLoaded,
          units,
          volumeSteps,
          volumeWindowCenter,
          volumeWindowWidth
        }
      } = state;

      return {
        angles,
        boundingBoxEnabled,
        camera,
        controlsEnabled,
        controlsType,
        displayMode,
        edges,
        graphEnabled,
        material,
        nodes,
        orientation,
        selected,
        slicesIndex,
        slicesMaxIndex,
        src,
        srcLoaded,
        units,
        volumeSteps,
        volumeWindowCenter,
        volumeWindowWidth
      };
    });

    this.store.mapDispatchToProps(this, {
      appClearAngles,
      appClearEdges,
      appClearNodes,
      appDeleteAngle,
      appDeleteEdge,
      appDeleteNode,
      appSelectAngle,
      appSelectEdge,
      appSelectNode,
      appSetAngle,
      appSetBoundingBoxEnabled,
      appSetCamera,
      appSetControlsEnabled,
      appSetControlsType,
      appSetDisplayMode,
      appSetEdge,
      appSetGraphEnabled,
      appSetMaterial,
      appSetNode,
      appSetOrientation,
      appSetSlicesIndex,
      appSetSlicesMaxIndex,
      appSetSrc,
      appSetSrcLoaded,
      appSetUnits,
      appSetVolumeSteps,
      appSetVolumeWindowCenter,
      appSetVolumeWindowWidth
    });

    // set up event handlers
    this._controlsAnimationFinishedHandler = this._controlsAnimationFinishedHandler.bind(
      this
    );
    this._controlsInteractionHandler = this._controlsInteractionHandler.bind(
      this
    );
    this._graphEntryDraggedHandler = this._graphEntryDraggedHandler.bind(this);
    this._graphEntryPointerDownHandler = this._graphEntryPointerDownHandler.bind(
      this
    );
    this._graphEntryPointerOutHandler = this._graphEntryPointerOutHandler.bind(
      this
    );
    this._graphEntryPointerOverHandler = this._graphEntryPointerOverHandler.bind(
      this
    );
    this._graphEntryPointerUpHandler = this._graphEntryPointerUpHandler.bind(
      this
    );
    this._graphEntrySelectedHandler = this._graphEntrySelectedHandler.bind(
      this
    );
    this._graphEntryValidTargetHandler = this._graphEntryValidTargetHandler.bind(
      this
    );
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._keyUpHandler = this._keyUpHandler.bind(this);
    this._controlsInteractionFinishedHandler = this._controlsInteractionFinishedHandler.bind(
      this
    );
    this._slicesMaxIndexHandler = this._slicesMaxIndexHandler.bind(this);
    this._spawnNodeHandler = this._spawnNodeHandler.bind(this);
    this._srcLoadedHandler = this._srcLoadedHandler.bind(this);
    this._volumeDefaultRenderStepsHandler = this._volumeDefaultRenderStepsHandler.bind(
      this
    );
    this._volumeRaycastHandler = this._volumeRaycastHandler.bind(this);

    // debounced event handlers
    this._debouncedAppSetCamera = EventUtils.debounce(
      this.appSetCamera,
      Constants.minFrameMS
    ).bind(this);
  }

  private _renderScene() {
    if (this.camera && this._getMesh()) {
      console.log(Utils.getCameraNearFromSceneDistance(this._sceneDistance));
      console.log(Utils.getCameraFarFromSceneDistance(this._sceneDistance));
      console.log(this.camera.position);
    }
    return (
      <Scene
        cb={ref => {
          this._scene = ref as AScene;
          this._scene.addEventListener("loaded", () => {
            this._scene.sceneEl.renderer.toneMapping = (THREE as any).ACESFilmicToneMapping;
          });
        }}
        isWebGl2={this._isWebGl2}
      >
        <ModelContainer>
          <Src
            cb={ref => {
              this._targetEntity = ref;
            }}
            controlsType={this.controlsType}
            displayMode={this.displayMode}
            dracoDecoderPath={this.dracoDecoderPath}
            envMapPath={this.envMapPath}
            graphEnabled={this.graphEnabled}
            orientation={this.orientation}
            slicesIndex={this.slicesIndex}
            src={this.src}
            srcLoaded={this.srcLoaded}
            volumeSteps={this.volumeSteps}
            volumeWindowCenter={this.volumeWindowCenter}
            volumeWindowWidth={this.volumeWindowWidth}
          />
          <BoundingBox
            cb={ref => {
              this._boundingEntity = ref;
            }}
            boundingBox={this._boundingBox}
            boundingBoxEnabled={this.boundingBoxEnabled}
            color={Constants.colors.white}
            displayMode={this.displayMode}
            graphEnabled={this.graphEnabled}
            mesh={this._getMesh()}
            srcLoaded={this.srcLoaded}
            targetEntity={this._targetEntity}
          />
        </ModelContainer>
        <Nodes
          boundingSphereRadius={this._boundingSphereRadius}
          camera={this._scene ? this._scene.camera : null}
          cameraPosition={this.camera ? this.camera.position : null}
          controlsType={this.controlsType}
          fontSize={Constants.fontSizeMedium}
          graphEnabled={this.graphEnabled}
          nodes={this.nodes}
          selected={this.selected}
        />
        <Edges
          boundingSphereRadius={this._boundingSphereRadius}
          camera={this._scene ? this._scene.camera : null}
          cameraPosition={this.camera ? this.camera.position : null}
          controlsType={this.controlsType}
          displayMode={this.displayMode}
          edges={this.edges}
          edgeSize={Constants.edgeSize}
          fontSize={Constants.fontSizeSmall}
          nodes={this.nodes}
          selected={this.selected}
          units={this.units}
        />
        <Angles
          angles={this.angles}
          boundingSphereRadius={this._boundingSphereRadius}
          camera={this._scene ? this._scene.camera : null}
          cameraPosition={this.camera ? this.camera.position : null}
          controlsType={this.controlsType}
          edges={this.edges}
          edgeSize={Constants.edgeSize}
          fontSize={Constants.fontSizeSmall}
          nodes={this.nodes}
          selected={this.selected}
        />
        {(() => {
          switch (this.controlsType) {
            case ControlsType.TRACKBALL: {
              return (
                <TrackballCamera
                  cb={ref => {
                    this._camera = ref;
                  }}
                  animating={
                    this.camera && this.camera.animating
                      ? this.camera.animating
                      : false
                  }
                  controlPosition={ThreeUtils.vector3ToString(
                    this.camera
                      ? this.camera.position
                      : new THREE.Vector3(0, 0, 0)
                  )}
                  controlTarget={ThreeUtils.vector3ToString(
                    this.camera
                      ? this.camera.target
                      : new THREE.Vector3(0, 0, 0)
                  )}
                  dampingFactor={Constants.camera.dampingFactor}
                  enabled={this.controlsEnabled}
                  far={this._sceneDistance
                    ? Utils.getCameraFarFromSceneDistance(this._sceneDistance)
                    : Constants.camera.far
                  }
                  fov={Constants.camera.fov}
                  graphEnabled={this.graphEnabled}
                  near={this._sceneDistance
                    ? Utils.getCameraNearFromSceneDistance(this._sceneDistance)
                    : Constants.camera.near
                  }
                  panSpeed={Constants.camera.panSpeed}
                  rotateSpeed={Constants.camera.trackballRotateSpeed}
                  screenHeight={this._scene ? this._scene.canvas.height : 0}
                  screenWidth={this._scene ? this._scene.canvas.width : 0}
                  zoomSpeed={Constants.camera.trackballZoomSpeed}
                />
              );
            }
            case ControlsType.ORBIT: {
              return (
                <OrbitCamera
                  cb={ref => {
                    this._camera = ref;
                  }}
                  animating={
                    this.camera && this.camera.animating
                      ? this.camera.animating
                      : false
                  }
                  controlPosition={ThreeUtils.vector3ToString(
                    this.camera
                      ? this.camera.position
                      : new THREE.Vector3(0, 0, 0)
                  )}
                  controlTarget={ThreeUtils.vector3ToString(
                    this.camera
                      ? this.camera.target
                      : new THREE.Vector3(0, 0, 0)
                  )}
                  dampingFactor={Constants.camera.dampingFactor}
                  enabled={this.controlsEnabled}
                  far={this._sceneDistance
                    ? Utils.getCameraFarFromSceneDistance(this._sceneDistance)
                    : Constants.camera.far
                  }
                  fov={Constants.camera.fov}
                  graphEnabled={this.graphEnabled}
                  maxPolarAngle={Constants.camera.maxPolarAngle}
                  minDistance={Constants.camera.minDistance}
                  minPolarAngle={Constants.camera.minPolarAngle}
                  panSpeed={Constants.camera.orbitPanSpeed}
                  near={this._sceneDistance
                    ? Utils.getCameraNearFromSceneDistance(this._sceneDistance)
                    : Constants.camera.near
                  }
                  rotateSpeed={Constants.camera.orbitRotateSpeed}
                  zoomSpeed={Constants.camera.orbitZoomSpeed}
                />
              );
            }
            default: {
              return null;
            }
          }
        })()}
        <Lights
          ambientLightColor={Constants.lights.ambientLightColor}
          ambientLightIntensity={Constants.lights.ambientLightIntensity}
        />
      </Scene>
    );
  }

  public render() {
    return (
      <div
        id="al-container"
        class={this.displayMode}
        style={{
          width: Utils.addCssUnits(this.width),
          height: Utils.addCssUnits(this.height)
        }}
      >
        <div id="lut-container">
          <div id="lut-min">0.0</div>
          <div id="lut-canvases" />
          <div id="lut-max">1.0</div>
        </div>
        {this._renderScene()}
        {this.src && !this.srcLoaded && (
          <div id="spinner">
            <div class="square" />
          </div>
        )}
      </div>
    );
  }
  //#endregion

  //#region Private Methods

  private _resize(): void {
    if (this._scene) {
      // tslint:disable-next-line: no-any
      (this._scene as any).resize();
    }
  }

  private _createEdge(node1Id: string, node2Id: string): void {
    // check if there is already an edge connecting these two nodes
    const match: [string, AlEdge] | undefined = Array.from(this.edges).find(
      ([_id, edge]) => {
        return (
          (edge.node1Id === node1Id && edge.node2Id === node2Id) ||
          (edge.node1Id === node2Id && edge.node2Id === node1Id)
        );
      }
    );

    if (!match) {
      const newEdge: AlEdge = {
        node1Id,
        node2Id
      };
      const edgeId: string = GraphUtils.getNextId(
        AlGraphEntryType.EDGE,
        this.edges
      );

      this._setEdge([edgeId, newEdge]);
    }
  }

  private _createAngle(edge1Id: string, edge2Id: string): void {
    // check if there is already an angle connecting these two edges
    const match: [string, AlAngle] | undefined = Array.from(this.angles).find(
      ([_id, angle]) => {
        return (
          (angle.edge1Id === edge1Id && angle.edge2Id === edge2Id) ||
          (angle.edge1Id === edge2Id && angle.edge2Id === edge1Id)
        );
      }
    );
    if (!match) {
      const edge1 = this.edges.get(edge1Id);
      const edge2 = this.edges.get(edge2Id);

      if (
        edge1.node1Id === edge2.node1Id ||
        edge1.node1Id === edge2.node2Id ||
        edge1.node2Id === edge2.node1Id ||
        edge1.node2Id === edge2.node2Id
      ) {
        const newAngle: AlAngle = {
          edge1Id,
          edge2Id
        };
        const angleId: string = GraphUtils.getNextId(
          AlGraphEntryType.ANGLE,
          this.angles
        );

        this._setAngle([angleId, newAngle]);
      } else {
        console.warn("cannot create angle: edges not connected");
      }
    } else {
      console.warn("cannot create angle: angle already exists");
    }
  }

  private _stateChanged(): void {
    this.changed.emit(this.store.getState().app);
  }

  private _setGraph(graph: AlGraph): void {
    if (graph.nodes) {
      const nodes: Map<string, AlNode> = new Map(graph.nodes);
      nodes.forEach((value: AlNode, key: string) => {
        this.appSetNode([key, value]);
      });
    }

    if (graph.edges) {
      const edges: Map<string, AlEdge> = new Map(graph.edges);
      edges.forEach((value: AlEdge, key: string) => {
        this.appSetEdge([key, value]);
      });
    }

    if (graph.angles) {
      const angles: Map<string, AlAngle> = new Map(graph.angles);
      angles.forEach((value: AlAngle, key: string) => {
        this.appSetAngle([key, value]);
      });
    }

    this._stateChanged();
  }

  private _clearGraph(): void {
    // todo: can this be a single appClearGraph action?
    this.appClearNodes();
    this.appClearEdges();
    this.appClearAngles();
    this._stateChanged();
  }

  private _deleteNode(nodeId: string): void {
    this.appDeleteNode(nodeId);
    this._stateChanged();
  }

  private _setNode(node: [string, AlNode]): void {
    this.appSetNode(node);
    this._stateChanged();
  }

  private _animateBetween(
    animationStart: AlCamera,
    animationEndVec3: THREE.Vector3
  ): void {
    const defaultCamera: AlCamera = Utils.getCameraStateFromMesh(
      this._getMesh(),
      this._sceneDistance
    );

    const animationEnd = {
      position: animationEndVec3,
      target: defaultCamera.target.clone()
    } as AlCamera;

    if (animationEndVec3) {
      const diffPos: number = animationEnd.position.distanceTo(
        this.camera.position
      );
      const diffTarg: number = animationEnd.target.distanceTo(
        this.camera.target
      );

      const needsPos = diffPos / Constants.maxAnimationSteps > Number.EPSILON;
      const needsTarg = diffTarg / Constants.maxAnimationSteps > Number.EPSILON;

      if (needsPos || needsTarg) {
        animationEnd.position.copy(animationEndVec3.clone());

        const slerpPath = ThreeUtils.getSlerpCameraPath(
          animationStart,
          animationEnd,
          needsPos,
          needsTarg
        );

        this._scene.emit(
          AlControlEvents.ANIMATION_STARTED,
          { slerpPath },
          false
        );

        this.appSetCamera({
          animating: true
        });

        this._stateChanged();
      }
    }
  }

  private _selectNode(nodeId: string | null, animate: boolean = false): void {
    if (animate && nodeId !== this.selected) {
      const animationStart = {
        position: this.camera.position.clone(),
        target: this.camera.target.clone()
      } as AlCamera;

      const animationEndVec3: THREE.Vector3 = Utils.getCameraPositionFromNode(
        this.nodes.get(nodeId),
        this._boundingSphereRadius,
        this.camera.target
      );

      this.appSelectNode(nodeId);
      this._animateBetween(animationStart, animationEndVec3);
    } else {
      this.appSelectNode(nodeId);
      this._stateChanged();
    }
  }

  private _setEdge(edge: [string, AlEdge]): void {
    this.appSetEdge(edge);
    this._stateChanged();
  }

  private _deleteEdge(edgeId: string): void {
    this.appDeleteEdge(edgeId);
    this._stateChanged();
  }

  private _recenter(): void {
    const cameraState: AlCamera = Utils.getCameraStateFromMesh(
      this._getMesh(),
      this._sceneDistance
    );

    const animationStart = {
      position: this.camera.position.clone(),
      target: this.camera.target.clone()
    } as AlCamera;

    // deselect current node
    this._selectNode(null);
    // todo: this also applies to edges and angles because it's setting state.selected to null.
    // think about whether this should be generic

    this._animateBetween(animationStart, cameraState.position);
  }

  private _selectEdge(edgeId: string): void {
    this.appSelectEdge(edgeId);
    this._stateChanged();
  }

  private _setAngle(angle: [string, AlAngle]): void {
    this.appSetAngle(angle);
    this._stateChanged();
  }

  private _selectAngle(angleId: string): void {
    this.appSelectAngle(angleId);
    this._stateChanged();
  }

  private _deleteAngle(angleId: string): void {
    this.appDeleteAngle(angleId);
    this._stateChanged();
  }

  private _setBoundingBoxEnabled(visible: boolean): void {
    this.appSetBoundingBoxEnabled(visible);
    this._stateChanged();
  }

  private _setControlsEnabled(enabled: boolean): void {
    this.appSetControlsEnabled(enabled);
    this._stateChanged();
  }

  private _setControlsType(type: ControlsType): void {
    this.appSetControlsType(type);
    this._scene.camera.up.copy(this._targetEntity.object3D.up);
    this._stateChanged();
  }

  private _setGraphEnabled(enabled: boolean): void {
    this.appSetGraphEnabled(enabled);
    this._stateChanged();
  }

  private _setMaterial(material: Material): void {
    this.appSetMaterial(material);
    this._stateChanged();
  }

  private _setOrientation(orientation: Orientation): void {
    this.appSetOrientation(orientation);
    this._stateChanged();
  }

  private _setSlicesIndex(index: number): void {
    this.appSetSlicesIndex(index);
    this._stateChanged();
  }

  private _setUnits(units: Units): void {
    this.appSetUnits(units);
    this._stateChanged();
  }

  private _setVolumeSteps(steps: number): void {
    this.appSetVolumeSteps(steps);
    this._stateChanged();
  }

  private _setVolumeWindowCenter(center: number): void {
    this.appSetVolumeWindowCenter(center);
    this._stateChanged();
  }

  private _setVolumeWindowWidth(width: number): void {
    this.appSetVolumeWindowWidth(width);
    this._stateChanged();
  }

  private _setDisplayMode(displayMode: DisplayMode): void {
    this.appSetDisplayMode(displayMode);
    this._stateChanged();
  }

  private _setSrc(src: string, displayMode?: DisplayMode): void {
    this.appSetSrc([src, displayMode]);
    this._stateChanged();
  }

  private _getMesh(): THREE.Mesh | null {
    let mesh: THREE.Mesh | null = null;

    if (this._targetEntity && this.displayMode === DisplayMode.MESH) {
      const model = this._targetEntity.object3DMap.mesh;

      if (model instanceof THREE.Mesh) {
        mesh = model;
      } else if (model) {
        model.traverse(child => {
          if (child instanceof THREE.Mesh && mesh === null) {
            mesh = child;
            return mesh;
          }
        });
      }
    } else if (this._loadedObject && this._loadedObject._bBox) {
      mesh = this._loadedObject._bBox._mesh;
    } else if (this._loadedObject) {
      mesh = this._loadedObject._mesh;
    }

    return mesh;
  }

  // tslint:disable-next-line: no-any
  private _srcLoadedHandler(ev: any): void {
    this._loadedObject = ev.detail;

    let cameraState: AlCamera;

    // if it's a gltf scene, there will be a _loadedObject.model
    // use this to get the bounding box.
    // otherwise use _getMesh()
    if (this._loadedObject.model) {
      this._boundingBox = Utils.getBoundingBox(this._loadedObject.model);
      const sphere: Sphere = new Sphere();
      this._boundingSphereRadius = this._boundingBox.getBoundingSphere(
        sphere
      ).radius;
      this._sceneDistance = Utils.getSceneDistanceFromModel(
        this._loadedObject.model,
        Constants.zoomFactor,
        Constants.fov
      );
      cameraState = Utils.getCameraStateFromModel(
        this._loadedObject.model,
        this._sceneDistance
      );
    } else {
      // there's no model, use the mesh
      const mesh: THREE.Mesh | null = this._getMesh();
      // Compute the bounding sphere of the mesh
      mesh.geometry.computeBoundingSphere();
      mesh.geometry.computeBoundingBox();
      this._boundingBox = Utils.getBoundingBox(mesh);
      this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;
      this._sceneDistance = Utils.getSceneDistanceFromMesh(
        mesh,
        Constants.zoomFactor,
        Constants.fov
      );
      cameraState = Utils.getCameraStateFromMesh(
        mesh,
        this._sceneDistance,
      );
    }

    if (cameraState) {
      this.appSetCamera(cameraState);
    }

    this.appSetSrcLoaded(true);
    this._stateChanged();
    this.loaded.emit(ev.detail);
  }

  //#endregion

  //#region Event Handlers
  private _keyDownHandler(event: KeyboardEvent) {
    this._isShiftDown = event.shiftKey;

    if (event.keyCode === KeyDown.Delete) {
      if (this.selected) {
        if (this.nodes.has(this.selected)) {
          this._deleteNode(this.selected);
        } else if (this.edges.has(this.selected)) {
          this._deleteEdge(this.selected);
        } else if (this.angles.has(this.selected)) {
          this._deleteAngle(this.selected);
        }
      }
    }
  }

  private _keyUpHandler(_event: KeyboardEvent) {
    this._isShiftDown = false;
  }

  private _graphEntryPointerUpHandler(_event: CustomEvent): void {
    this.appSetControlsEnabled(true);
    ThreeUtils.enableControls(this._camera, true, this.controlsType);
  }

  private _graphEntryPointerDownHandler(_event: CustomEvent): void {
    this.appSetControlsEnabled(false);
    ThreeUtils.enableControls(this._camera, false, this.controlsType);
  }

  private _graphEntryPointerOutHandler(_event: CustomEvent): void {
    this._hovered = null;
  }

  private _graphEntryPointerOverHandler(event: CustomEvent): void {
    this._hovered = event.detail.id;
  }

  private _controlsInteractionHandler(event: CustomEvent): void {
    // This means that graph elements will rescale while animating
    // However this causes Redux to update every frame that we animate,
    // which causes the VDOM to update every frame
    const cameraState = event.detail.cameraState as AlCamera;
    this.appSetCamera(cameraState);
  }

  private _controlsInteractionFinishedHandler(event: CustomEvent): void {
    const cameraState = event.detail.cameraState as AlCamera;
    this._debouncedAppSetCamera(cameraState);
  }

  private _spawnNodeHandler(event: CustomEvent): void {
    // IF creating a new node and NOT intersecting an existing node
    if (
      this.graphEnabled && // Nodes are enabled
      this._validTarget && // Target is valid
      this._hovered === null // Not intersecting a Node already
    ) {
      let newNode: AlNode;
      const nodeId: string = GraphUtils.getNextId(
        AlGraphEntryType.NODE,
        this.nodes
      );
      const intersection: THREE.Intersection =
        event.detail.aframeEvent.detail.intersection;

      if (this.displayMode === DisplayMode.VOLUME && intersection) {
        this._scene.emit(AlVolumeEvents.VOLUME_RAY_REQUEST, {
          cameraPosition: this._camera.object3D.children[0].position.clone(),
          cameraDirection: this._camera.getAttribute("raycaster").direction,
          intersection,
          type: AlVolumeCastType.CREATE
        });
      } else if (intersection) {
        newNode = {
          targetId: this.src,
          position: ThreeUtils.vector3ToString(intersection.point),
          scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
          normal: ThreeUtils.vector3ToString(intersection.face.normal),
          title: nodeId
        };
      }

      if (newNode) {
        const previousSelected = this.selected;
        this._setNode([nodeId, newNode]);

        if (
          this._isShiftDown && // Shift is down
          this.nodes.has(previousSelected) // A Node is already selected
        ) {
          this._createEdge(previousSelected, nodeId);
          this._selectNode(nodeId);
        }
      }
    }
  }

  private _volumeRaycastHandler(event: CustomEvent): void {
    const hitPosition = event.detail.hitPosition;
    const rayResult = event.detail.rayResult;

    switch (event.detail.type) {
      case AlVolumeCastType.CREATE: {
        let newNode: AlNode;
        const nodeId: string = GraphUtils.getNextId(
          AlGraphEntryType.NODE,
          this.nodes
        );

        if (rayResult) {
          newNode = {
            targetId: this.src,
            position: ThreeUtils.vector3ToString(hitPosition),
            scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
            title: nodeId
          };
        }

        if (newNode) {
          const previousSelected = this.selected;
          this._setNode([nodeId, newNode]);

          if (
            this._isShiftDown && // Shift is down
            this.nodes.has(previousSelected) // A Node is already selected
          ) {
            this._createEdge(previousSelected, nodeId);
            this._selectNode(nodeId);
          }
        }
        break;
      }
      case AlVolumeCastType.DRAG: {
        const nodeId = this.selected;

        if (!rayResult) {
          const distance = this._camera.object3D.children[0].position.distanceTo(
            this._targetEntity.getAttribute("position")
          );

          hitPosition.copy(this._camera.object3D.children[0].position);
          hitPosition.add(
            this._camera
              .getAttribute("raycaster")
              .direction.clone()
              .multiplyScalar(distance * 1.5)
          );
        }

        this._setNode([
          nodeId,
          {
            position: ThreeUtils.vector3ToString(hitPosition)
          }
        ]);
        const eventName = nodeId + Constants.movedEventName;
        this._scene.emit(eventName, {}, true);
        break;
      }
      default: {
        break;
      }
    }
  }

  private _graphEntryValidTargetHandler(event: CustomEvent): void {
    this._validTarget = event.detail.valid;
  }

  private _controlsAnimationFinishedHandler(_event: CustomEvent): void {
    this.appSetCamera({
      animating: false
    });
  }

  private _graphEntrySelectedHandler(event: CustomEvent): void {
    if (!this.graphEnabled) {
      return;
    }

    const type: AlGraphEntryType = event.detail.type;
    const id: string = event.detail.id;

    switch (type) {
      case AlGraphEntryType.NODE: {
        if (
          this._hovered !== null &&
          this.nodes.has(this._hovered) && // We're intersecting a node
          (this.selected !== null && this.nodes.has(this.selected)) && // We have a node already selected
          this.selected !== this._hovered && // The selected & intersecting elements are not the same
          this._isShiftDown // The shift key is down
        ) {
          this._createEdge(this.selected, this._hovered);
        }
        this._selectNode(id);
        break;
      }
      case AlGraphEntryType.EDGE: {
        if (
          this._hovered !== null &&
          this.edges.has(this._hovered) && // We're intersecting an edge
          (this.selected !== null && this.edges.has(this.selected)) && // We have an edge already selected
          this.selected !== this._hovered && // The selected & intersecting elements are not the same
          this._isShiftDown // The shift key is down
        ) {
          // We're intersecting an edge
          this._createAngle(this.selected, this._hovered);
        }
        this._selectEdge(id);
        break;
      }
      case AlGraphEntryType.ANGLE: {
        this._selectAngle(id);
        break;
      }
      default: {
        break;
      }
    }
  }

  private _graphEntryDraggedHandler(event: CustomEvent): void {
    const nodeId: string = event.detail.id;
    // tslint:disable-next-line: no-any
    const raycaster = this._camera.components.raycaster as any;
    const raycasterAttribute = this._camera.getAttribute("raycaster");
    const hitPosition = new THREE.Vector3();

    let validLocation = false;

    if (this.displayMode === DisplayMode.VOLUME) {
      const intersection = raycaster.getIntersection(
        this._boundingEntity
      ) as THREE.Intersection;

      if (intersection) {
        this._scene.emit(AlVolumeEvents.VOLUME_RAY_REQUEST, {
          cameraPosition: this._camera.object3D.children[0].position.clone(),
          cameraDirection: this._camera.getAttribute("raycaster").direction,
          intersection,
          type: AlVolumeCastType.DRAG
        });
      }
    } else {
      const intersection = raycaster.getIntersection(
        this._targetEntity
      ) as THREE.Intersection;

      if (intersection) {
        hitPosition.copy(intersection.point);
        validLocation = true;
      }

      // IF not a valid location, dangle in space
      if (!validLocation) {
        const distance = this._camera.object3D.children[0].position.distanceTo(
          this._targetEntity.getAttribute("position")
        );

        hitPosition.copy(this._camera.object3D.children[0].position);
        hitPosition.add(
          raycasterAttribute.direction.clone().multiplyScalar(distance * 1.5)
        );
      } else {
        hitPosition.copy(intersection.point);
      }

      this._setNode([
        nodeId,
        {
          position: ThreeUtils.vector3ToString(hitPosition)
        }
      ]);
      const eventName = nodeId + Constants.movedEventName;
      this._scene.emit(eventName, {}, true);
    }
  }

  private _volumeDefaultRenderStepsHandler(event: CustomEvent): void {
    this.appSetVolumeSteps(event.detail);
    this._stateChanged();
  }

  private _slicesMaxIndexHandler(event: CustomEvent): void {
    this.appSetSlicesMaxIndex(event.detail);
  }

  private _addEventListeners(): void {
    window.addEventListener("keydown", this._keyDownHandler, false);
    window.addEventListener("keyup", this._keyUpHandler, false);

    this._scene.addEventListener(
      AlVolumeEvents.VOLUME_RAY_CAST,
      this._volumeRaycastHandler,
      false
    );

    this._scene.addEventListener(
      AlControlEvents.ANIMATION_FINISHED,
      this._controlsAnimationFinishedHandler,
      false
    );

    this._scene.addEventListener(
      AlControlEvents.INTERACTION,
      this._controlsInteractionHandler,
      false
    );

    this._scene.addEventListener(
      AlControlEvents.INTERACTION_FINISHED,
      this._controlsInteractionFinishedHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_UP,
      this._graphEntryPointerUpHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_DOWN,
      this._graphEntryPointerDownHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.DRAGGED,
      this._graphEntryDraggedHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.SELECTED,
      this._graphEntrySelectedHandler,
      false
    );

    this._scene.addEventListener(
      AlNodeSpawnerEvents.ADD_NODE,
      this._spawnNodeHandler,
      false
    );

    this._scene.addEventListener(
      AlNodeSpawnerEvents.VALID_TARGET,
      this._graphEntryValidTargetHandler,
      false
    );

    this._scene.addEventListener(
      AlGltfModelEvents.LOADED,
      this._srcLoadedHandler,
      false
    );

    this._scene.addEventListener(
      AlVolumeEvents.DEFAULT_RENDER_STEPS,
      this._volumeDefaultRenderStepsHandler,
      false
    );
    this._scene.addEventListener(
      AlVolumeEvents.LOADED,
      this._srcLoadedHandler,
      false
    );
    this._scene.addEventListener(
      AlVolumeEvents.SLICES_MAX_INDEX,
      this._slicesMaxIndexHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_OVER,
      this._graphEntryPointerOverHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_OUT,
      this._graphEntryPointerOutHandler,
      false
    );
  }
  //#endregion

  public componentDidUpdate() {
    if (this._scene) {
      this._addEventListeners();
    }
  }
}

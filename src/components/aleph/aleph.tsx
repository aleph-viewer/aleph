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
  appAddNode,
  appRemoveNode,
  appSelectNode,
  appUpdateNode,
  appLoadNodes,
  appSetDisplayMode,
  appSetOrientation,
  appSetNodesVisible,
  appSetNodesEnabled,
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
import { AlNodeSerial, AlCameraSerial, AlAppState } from "../../interfaces";
import { GetUtils, ThreeUtils, CreateUtils } from "../../utils";
import { Constants } from "../../Constants";
import { MeshFileType, Orientation, DisplayMode } from "../../enums";
import {
  AlNodeEvents,
  AlNodeSpawnerEvents,
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
  private _backBoard: Entity;
  private _scene: Scene;
  private _boundingSphereRadius: number;
  private _validTarget: boolean;
  private _camera: Entity;
  private _tcontrols: THREE.OrbitControls;
  private _intersectingNode: boolean;
  private _container: HTMLElement;

  private _mouseDownDebounced: boolean;

  private _lastCameraPosition: THREE.Vector3;
  private _lastCameraTarget: THREE.Vector3;
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
  appAddNode: Action;
  appRemoveNode: Action;
  appSelectNode: Action;
  appUpdateNode: Action;
  appLoadNodes: Action;
  appSetDisplayMode: Action;
  appSetOrientation: Action;
  appSetNodesVisible: Action;
  appSetNodesEnabled: Action;
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
  @State() selectedNode: string;
  @State() nodes: AlNodeSerial[];
  @State() displayMode: DisplayMode;
  @State() orientation: Orientation;
  @State() nodesVisible: boolean;
  @State() nodesEnabled: boolean;
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
  async load(src: string): Promise<void> {
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
  async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this.appSetDisplayMode(displayMode);
  }

  @Method()
  async loadNodes(nodes: AlNodeSerial[]): Promise<void> {
    this._loadNodes(nodes);
  }

  @Method()
  async selectNode(nodeId: string): Promise<void> {
    this._selectNode(nodeId, true);
  }

  @Method()
  async setNodesEnabled(enabled: boolean): Promise<void> {
    this._setNodesEnabled(enabled);
  }

  @Method()
  async setBoundingBoxVisible(visible: boolean): Promise<void> {
    this._setBoundingBoxVisible(visible);
  }

  @Method()
  async removeNode(nodeId: string): Promise<void> {
    this._removeNode(nodeId);
  }

  @Event() onLoad: EventEmitter;
  @Event() onSave: EventEmitter;
  @Event() onNodesChanged: EventEmitter;
  @Event() onSelectedNodeChanged: EventEmitter;
  //#endregion

  componentWillLoad() {
    CreateUtils.createAframeComponents();

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: {
          src,
          srcLoaded,
          selectedNode,
          nodes,
          displayMode,
          orientation,
          nodesVisible,
          nodesEnabled,
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
        selectedNode,
        nodes,
        displayMode,
        orientation,
        nodesVisible,
        nodesEnabled,
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
      appAddNode,
      appRemoveNode,
      appSelectNode,
      appUpdateNode,
      appLoadNodes,
      appSetDisplayMode,
      appSetOrientation,
      appSetNodesVisible,
      appSetNodesEnabled,
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
    this._addNodeEventHandler = this._addNodeEventHandler.bind(this);
    this._validTargetEventHandler = this._validTargetEventHandler.bind(this);
    this._nodeSelectedEventHandler = this._nodeSelectedEventHandler.bind(this);
    this._intersectingNodeEventHandler = this._intersectingNodeEventHandler.bind(
      this
    );
    this._intersectionClearedEventHandler = this._intersectionClearedEventHandler.bind(
      this
    );
    this._nodeMovedEventHandler = this._nodeMovedEventHandler.bind(this);
    this._controlsInitEventHandler = this._controlsInitEventHandler.bind(this);
    this._controlsEnabledHandler = this._controlsEnabledHandler.bind(this);
    this._controlsDisabledHandler = this._controlsDisabledHandler.bind(this);
    this._animationFinished = this._animationFinished.bind(this);
    this._controlsMoved = this._controlsMoved.bind(this);

    this._lastCameraPosition = new THREE.Vector3(0, 0, 0);
    this._lastCameraTarget = new THREE.Vector3(0, 0, 0);
    this._mouseDownDebounced = false;
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
          al-fixed-to-orbit-camera={`
            distanceFromTarget: 0.5
            target: ${this._lastCameraTarget};
          `}
        />
      );
    }

    return null;
  }

  private _renderSrc(): JSX.Element {
    if (!this.src) {
      return null;
    }

    let backScale = 0;

    if (this._boundingSphereRadius) {
      backScale = this._boundingSphereRadius * Constants.splashBackSize;
      console.log("backScale: ", backScale);
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return (
          <a-entity
            al-node-spawner={`
              nodesEnabled: ${this.nodesEnabled};
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
          >
            <a-entity
              ref={el => (this._backBoard = el)}
              class="collidable"
              id="back-board"
              geometry={`primitive: plane; height: ${backScale}; width: ${backScale}`}
              al-fixed-to-orbit-camera={`
                distanceFromTarget: ${
                  this._boundingSphereRadius ? this._boundingSphereRadius : 2
                };
                target: ${this._lastCameraTarget};
              `}
              material={`
                wireframe: true;
                side: double;
              `}
            />
          </a-entity>
        );
      }
      default: {
        return (
          <a-entity
            al-node-spawner={`
            nodesEnabled: ${this.nodesEnabled};
          `}
            class="collidable"
            id="target-entity"
            ref={(el: Entity) => (this._targetEntity = el)}
            al-volumetric-model={`
              src: url(${this.src});
            `}
            position="0 0 0"
            scale="1 1 1"
          >
            <a-entity
              ref={el => (this._backBoard = el)}
              class="collidable"
              id="back-board"
              geometry={`primitive: plane; height: ${backScale}; width: ${backScale}`}
              al-fixed-to-orbit-camera={`
                distanceFromTarget: ${
                  this._boundingSphereRadius ? this._boundingSphereRadius : 2
                };
                target: ${this._lastCameraTarget};
              `}
              material={`
                wireframe: true;
                side: double;
              `}
            />
          </a-entity>
        );
      }
    }
  }

  private _renderNodes(): JSX.Element {
    const outNodes: JSX.Element[] = [];
    const dataNodes: AlNodeSerial[] = this.nodes;

    for (var i = 0; i < dataNodes.length; i++) {
      if (i < dataNodes.length) {
        const node: AlNodeSerial = dataNodes[i];

        let textOffset = new THREE.Vector3(0.1, 0.1, 0.01);
        textOffset.multiplyScalar(node.scale);

        outNodes.push(
          <a-entity
            class="collidable"
            id={node.id}
            rotation="0 0 0"
            position={node.position}
            al-node={`
              target: ${node.target};
              scale: ${node.scale};
              selected: ${this.selectedNode === node.id};
              nodesEnabled: ${this.nodesEnabled};
            `}
          >
            <a-entity
              //geometry="primitive: plane; height: auto; width: auto"
              text={`
                value: ${node.text};
                side: double;
                baseline: bottom;
                anchor: left;
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              id={`${node.id}-label"`}
            />
          </a-entity>
        );
      }
    }
    return outNodes;
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
      target: this._lastCameraTarget
    } as AlCameraSerial;
    let mesh: THREE.Mesh;
    let radius: number = 1;

    // IF we're animating to a node
    // TODO: Differentiate between Node -> Node && Target -> Target animations
    if (this.cameraAnimating) {
      // Get camera state from node and set as result
      let result = GetUtils.getCameraStateFromNode(
        GetUtils.getNodeById(this.selectedNode, this.nodes),
        this._boundingSphereRadius
      );
      // If we returned a result AND the difference between the last position and the result position is not 0
      const diffPos: number = result.position.distanceTo(
        this._lastCameraPosition
      );
      const diffTarg: number = result.target.distanceTo(this._lastCameraTarget);
      if (result && (diffPos !== 0 || diffTarg !== 0)) {
        camData = result;
        this._lastCameraPosition = camData.position;
        this._lastCameraTarget = camData.target;
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
        {this._renderNodes()}
        {this._renderLights()}
        {this._renderCamera()}
      </a-scene>
    );
  }

  render(): JSX.Element {
    return (
      <div
        ref={el => (this._container = el)}
        id="al-container"
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
  private _loadNodes(nodes: AlNodeSerial[]): void {
    // remove all existing nodes
    while (this.nodes.length) {
      this._removeNode(this.nodes[this.nodes.length - 1].id);
    }

    this.appLoadNodes(nodes);
    this.onNodesChanged.emit(this.nodes);
  }

  private _addNode(node: AlNodeSerial): void {
    this.appAddNode(node);
    this._selectNode(node.id, false);
    this.onNodesChanged.emit(this.nodes);
  }

  private _removeNode(nodeId: string): void {
    this.appRemoveNode(nodeId);
    this.onNodesChanged.emit(this.nodes);
  }

  private _selectNode(nodeId: string, animate: boolean): void {
    if (animate && nodeId !== this.selectedNode) {
      this.appSetCameraAnimating(true); // todo: can we pass boolean to appSelectNode to set cameraAnimating in the state?
    }
    this.appSelectNode(nodeId);
    this.onSelectedNodeChanged.emit(this.selectedNode);
  }

  private _setNodesEnabled(enabled: boolean): void {
    this.appSetNodesEnabled(enabled);
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
      selectedNode: this.selectedNode,
      nodes: this.nodes
    } as AlAppState);
    let result = GetUtils.getCameraStateFromEntity(this._targetEntity);
    if (result) {
      this._lastCameraPosition = result.position;
    }
  }
  //#endregion

  //#region Event Handlers
  private _controlsMoved(event: CustomEvent): void {
    this._lastCameraPosition = event.detail.position;
    this._lastCameraTarget = event.detail.target;
  }
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
  }

  private _intersectionClearedEventHandler(_evt): void {
    this._intersectingNode = false;
  }

  private _intersectingNodeEventHandler(_evt): void {
    this._intersectingNode = true;
  }

  private _addNodeEventHandler(event: CustomEvent): void {
    if (this.nodesEnabled && this._validTarget && !this._intersectingNode) {
      let intersection: THREE.Intersection = event.detail.detail.intersection;

      const newNode: AlNodeSerial = CreateUtils.createNode(
        this.nodes,
        this._targetEntity.object3D.position,
        intersection.point,
        this._boundingSphereRadius
      );

      this._addNode(newNode);
    }
  }

  private _validTargetEventHandler(event: CustomEvent): void {
    this._validTarget = event.detail.payload;
  }

  private _nodeSelectedEventHandler(event: CustomEvent): void {
    this._selectNode(event.detail.id, false);
  }

  private _nodeMovedEventHandler(event: CustomEvent): void {
    const nodeId: string = event.detail.id;
    const raycaster = this._camera.components.raycaster as any;

    // First try target
    let intersection = raycaster.getIntersection(
      this._targetEntity
    ) as THREE.Intersection;

    if (!intersection) {
      intersection = raycaster.getIntersection(
        this._backBoard
      ) as THREE.Intersection;
    }

    if (intersection) {
      this.appUpdateNode({
        id: nodeId,
        position: ThreeUtils.vector3ToString(intersection.point)
      });
    } else {
      console.log("No intersection!");
    }
  }

  private _addEventListeners(): void {
    if (this._scene) {
      this._scene.addEventListener(
        AlOrbitControlEvents.HAS_MOVED,
        this._controlsMoved,
        false
      );
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
        AlNodeEvents.CONTROLS_ENABLED,
        this._controlsEnabledHandler,
        false
      );
      this._scene.addEventListener(
        AlNodeEvents.CONTROLS_DISABLED,
        this._controlsDisabledHandler,
        false
      );
      this._scene.addEventListener(
        AlNodeEvents.DRAGGING,
        this._nodeMovedEventHandler,
        false
      );
      this._scene.addEventListener(
        AlNodeSpawnerEvents.ADD_NODE,
        this._addNodeEventHandler,
        false
      );
      this._scene.addEventListener(
        AlNodeEvents.SELECTED,
        this._nodeSelectedEventHandler,
        false
      );
      this._scene.addEventListener(
        AlNodeSpawnerEvents.VALID_TARGET,
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
          AlNodeEvents.INTERSECTION,
          this._intersectingNodeEventHandler,
          false
        );
        this._camera.addEventListener(
          AlNodeEvents.INTERSECTION_CLEARED,
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

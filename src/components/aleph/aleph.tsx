//#region Imports
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
  appSetBoundingBoxVisible,
  appSetCameraAnimating,
  appSetCamera,
  appSetControlsEnabled,
  appSetDisplayMode,
  appSetEdge,
  appSetNode,
  appSetNodesEnabled,
  appSetOrientation,
  appSetSlicesIndex,
  appSetSlicesWindowCenter,
  appSetSlicesWindowWidth,
  appSetSrc,
  appSetSrcLoaded,
  appSetVolumeSteps,
  appSetVolumeWindowCenter,
  appSetVolumeWindowWidth
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import {
  AlNodeSerial,
  AlCameraSerial,
  AlAppState,
  AlEdgeSerial,
  AlAngleSerial
} from "../../interfaces";
import { GetUtils, ThreeUtils, CreateUtils } from "../../utils";
import { Constants } from "../../Constants";
import { MeshFileType, Orientation, DisplayMode } from "../../enums";
import {
  AlGltfModelEvents,
  AlNodeEvents,
  AlNodeSpawnerEvents,
  AlOrbitControlEvents
} from "../../aframe";
type Entity = import("aframe").Entity;
type Scene = import("aframe").Scene;
//#endregion

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
  private _intersectingNode: string | null = null;
  private _isShiftDown: boolean = false;

  private _animationStart: AlCameraSerial;
  private _animationEnd: AlCameraSerial;

  @Prop({ context: "store" }) store: Store;
  @Prop() dracoDecoderPath: string | null;
  @Prop() width: string = "640px";
  @Prop() height: string = "480px";
  @Prop() debug: boolean = false;
  @Prop() spinnerColor: string = "#fff";

  //#region actions
  appClearAngles: Action;
  appClearEdges: Action;
  appClearNodes: Action;
  appDeleteAngle: Action;
  appDeleteEdge: Action;
  appDeleteNode: Action;
  appSelectAngle: Action;
  appSelectEdge: Action;
  appSelectNode: Action;
  appSetAngle: Action;
  appSetBoundingBoxVisible: Action;
  appSetCameraAnimating: Action;
  appSetCamera: Action;
  appSetControlsEnabled: Action;
  appSetDisplayMode: Action;
  appSetEdge: Action;
  appSetNode: Action;
  appSetNodesEnabled: Action;
  appSetOrientation: Action;
  appSetSlicesIndex: Action;
  appSetSlicesWindowCenter: Action;
  appSetSlicesWindowWidth: Action;
  appSetSrc: Action;
  appSetSrcLoaded: Action;
  appSetVolumeSteps: Action;
  appSetVolumeWindowCenter: Action;
  appSetVolumeWindowWidth: Action;
  //#endregion

  //#region state
  @State() angles: Map<string, AlAngleSerial>;
  @State() boundingBoxVisible: boolean;
  @State() cameraAnimating: boolean;
  @State() camera: AlCameraSerial;
  @State() controlsEnabled: boolean;
  @State() displayMode: DisplayMode;
  @State() edges: Map<string, AlEdgeSerial>;
  @State() nodes: Map<string, AlNodeSerial>;
  @State() nodesEnabled: boolean;
  @State() nodesVisible: boolean;
  @State() optionsEnabled: boolean;
  @State() optionsVisible: boolean;
  @State() orientation: Orientation;
  @State() selected: string;
  @State() slicesIndex: number;
  @State() slicesWindowCenter: number;
  @State() slicesWindowWidth: number;
  @State() src: string | null;
  @State() srcLoaded: boolean;
  @State() volumeSteps: number;
  @State() volumeWindowCenter: number;
  @State() volumeWindowWidth: number;
  //#endregion

  //#region src methods

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
      this._setSrc(null); // shows loading spinner and resets gltf-model
      setTimeout(() => {
        this._setSrc(src);
      }, 500);
    } else {
      this._setSrc(src);
    }
  }

  //#endregion

  //#region node methods

  @Method()
  async setNode(node: [string, AlNodeSerial]): Promise<void> {
    this._setNode(node);
  }

  @Method()
  async setNodes(nodes: Map<string, AlNodeSerial>): Promise<void> {
    this._setNodes(nodes);
  }

  @Method()
  async deleteNode(nodeId: string): Promise<void> {
    this._deleteNode(nodeId);
  }

  @Method()
  async clearNodes(): Promise<void> {
    this._clearNodes();
  }

  @Method()
  async selectNode(nodeId: string): Promise<void> {
    this._selectNode(nodeId, true);
  }

  //#endregion

  //#region Edge Methods
  @Method()
  async setEdge(edge: [string, AlEdgeSerial]): Promise<void> {
    this._setEdge(edge);
  }

  // @Method()
  // async setEdges(edges: Map<string, AlEdgeSerial>): Promise<void> {
  //   this._setEdges(edges);
  // }

  // @Method()
  // async deleteEdge(edgeId: string): Promise<void> {
  //   this._deleteEdge(edgeId);
  // }

  // @Method()
  // async clearEdges(): Promise<void> {
  //   this._clearEdges();
  // }

  // @Method()
  // async selectEdge(edgeId: string): Promise<void> {
  //   this._selectEdge(edgeId, true);
  // }
  //#endregion

  //#region control panel methods

  @Method()
  async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this.appSetDisplayMode(displayMode);
  }

  @Method()
  async setNodesEnabled(enabled: boolean): Promise<void> {
    this._setNodesEnabled(enabled);
  }

  @Method()
  async setBoundingBoxVisible(visible: boolean): Promise<void> {
    this._setBoundingBoxVisible(visible);
  }

  //#endregion

  @Event() onChanged: EventEmitter;

  componentWillLoad() {
    CreateUtils.createAframeComponents();

    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: {
          angles,
          boundingBoxVisible,
          camera,
          cameraAnimating,
          controlsEnabled,
          displayMode,
          edges,
          nodes,
          nodesEnabled,
          orientation,
          selected,
          slicesIndex,
          slicesWindowCenter,
          slicesWindowWidth,
          src,
          srcLoaded,
          volumeSteps,
          volumeWindowCenter,
          volumeWindowWidth
        }
      } = state;

      return {
        angles,
        boundingBoxVisible,
        camera,
        cameraAnimating,
        controlsEnabled,
        displayMode,
        edges,
        nodes,
        nodesEnabled,
        orientation,
        selected,
        slicesIndex,
        slicesWindowCenter,
        slicesWindowWidth,
        src,
        srcLoaded,
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
      appSetBoundingBoxVisible,
      appSetCamera,
      appSetCameraAnimating,
      appSetControlsEnabled,
      appSetDisplayMode,
      appSetEdge,
      appSetNode,
      appSetNodesEnabled,
      appSetOrientation,
      appSetSlicesIndex,
      appSetSlicesWindowCenter,
      appSetSlicesWindowWidth,
      appSetSrc,
      appSetSrcLoaded,
      appSetVolumeSteps,
      appSetVolumeWindowCenter,
      appSetVolumeWindowWidth
    });

    // set up event handlers
    //this._animationFinished = this._animationFinished.bind(this);
    this._canvasMouseDown = this._canvasMouseDown.bind(this);
    this._canvasMouseUp = this._canvasMouseUp.bind(this);
    this._controlsDisabledHandler = this._controlsDisabledHandler.bind(this);
    this._controlsEnabledHandler = this._controlsEnabledHandler.bind(this);
    this._controlsUpdated = this._controlsUpdated.bind(this);
    this._intersectingNodeEventHandler = this._intersectingNodeEventHandler.bind(
      this
    );
    this._intersectionClearedEventHandler = this._intersectionClearedEventHandler.bind(
      this
    );
    this._nodeMovedEventHandler = this._nodeMovedEventHandler.bind(this);
    this._nodeSelectedEventHandler = this._nodeSelectedEventHandler.bind(this);
    this._setNodeEventHandler = this._setNodeEventHandler.bind(this);
    this._srcLoaded = this._srcLoaded.bind(this);
    this._validTargetEventHandler = this._validTargetEventHandler.bind(this);
  }

  //#region Render Methods
  private _renderSpinner(): JSX.Element {
    if (!this.srcLoaded) {
      return (
        <a-entity
          al-fixed-to-orbit-camera={`
          distanceFromTarget: 20;
          target: ${
            this.camera ? this.camera.position : new THREE.Vector3(0, 0, 0)
          };
        `}
        >
          <a-entity
            animation="property: rotation; to: 0 120 0; loop: true; dur: 1000; easing: easeInOutQuad"
            geometry="primitive: al-spinner;"
            material={`color: ${this.spinnerColor};`}
          />
        </a-entity>
      );
    }

    return null;
  }
  private _renderSrc(): JSX.Element {
    if (!this.src) {
      return null;
    }

    let backScale: number = 0;
    let backBoard: JSX.Element | null = null;

    if (this._boundingSphereRadius) {
      backScale = this._boundingSphereRadius * Constants.splashBackSize;

      backBoard = (
        <a-entity
          class="collidable"
          id="back-board"
          geometry={`primitive: plane; height: ${backScale}; width: ${backScale}`}
          al-fixed-to-orbit-camera={`
          distanceFromTarget: ${this._boundingSphereRadius};
          target: ${
            this.camera ? this.camera.target : new THREE.Vector3(0, 0, 0)
          };
        `}
          material={`
          wireframe: true;
          side: double;
        `}
          ref={el => (this._backBoard = el)}
        />
      );
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return [
          <a-entity
            al-node-spawner={`
              nodesEnabled: ${this.nodesEnabled};
            `}
            al-edge-spawner
            class="collidable"
            id="target-entity"
            al-gltf-model={`
              src: url(${this.src});
              dracoDecoderPath: ${this.dracoDecoderPath};
            `}
            position="0 0 0"
            scale="1 1 1"
            ref={(el: Entity) => (this._targetEntity = el)}
          />,
          backBoard
        ];
      }
      default: {
        // TODO: Update this to new method
        return [
          <a-entity
            al-node-spawner={`
              nodesEnabled: ${this.nodesEnabled};
            `}
            al-edge-spawner
            class="collidable"
            id="target-entity"
            al-volumetric-model={`
              src: url(${this.src});
            `}
            position="0 0 0"
            scale="1 1 1"
            ref={(el: Entity) => (this._targetEntity = el)}
          />,
          backBoard
        ];
      }
    }
  }

  private _renderNodes(): JSX.Element {
    return [...this.nodes].map((n: [string, AlNodeSerial]) => {
      const [nodeId, node] = n;

      let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
      textOffset.multiplyScalar(node.scale);

      return (
        <a-entity
          class="collidable"
          id={nodeId}
          position={node.position}
          al-look-to-camera
          al-node={`
            target: ${node.target};
            scale: ${node.scale};
            selected: ${this.selected === nodeId};
            nodesEnabled: ${this.nodesEnabled};
          `}
        >
          <a-entity
            geometry={`primitive: plane; width: ${this._boundingSphereRadius *
              Constants.fontSize}; height: auto;`}
            material="color: #aaa"
            text={`
              value: ${node.text};
              side: double;
              align: center;
              baseline: bottom;
              anchor: center;
            `}
            al-render-overlaid
            position={ThreeUtils.vector3ToString(textOffset)}
            id={`${nodeId}-label`}
          />
        </a-entity>
      );
    });
  }

  private _renderEdges(): JSX.Element {
    return [...this.edges].map((n: [string, AlEdgeSerial]) => {
      const [edgeId, edge] = n;

      return (
        <a-entity
          class="collidable"
          id={edgeId}
          /*al-edge={`
            node1: ${edge.node1};
            node2: ${edge.node2};
          `}*/
          line={`
            start: ${this.nodes.get(edge.node1Id).position}
            end: ${this.nodes.get(edge.node2Id).position}
          `}
        >
          <a-entity
            id={`${edgeId}-title`}
            al-look-to-camera
            text={`
            value: ${edgeId}
            side: double;
            baseline: bottom;
            anchor: center;
          `}
          />
        </a-entity>
      );
    });
  }

  private _renderLights(): JSX.Element {
    return [
      <a-entity
        id="light-1"
        light="type: directional; color: #ffffff; intensity: 0.75"
        position="1 1 1"
      />,
      <a-entity
        id="light-2"
        light="type: directional; color: #002958; intensity: 0.5"
        position="-1 -1 -1"
      />,
      <a-entity
        id="light-3"
        light="type: ambient; color: #d0d0d0; intensity: 1"
      />
    ];
  }

  private _renderCamera(): JSX.Element {
    let animation = "";
    let animation__2 = "";

    if (this.cameraAnimating) {
      animation = `
        isRawProperty: true;
        property: al-orbit-control.controlPosition;
        from: ${this._animationStart.position};
        to: ${this._animationEnd.position};
        elasticity: 200;
        dur: 1000;
        ease: easeInOutSine;
      `;
      animation__2 = `
        isRawProperty: true;
        property: al-orbit-control.controlTarget;
        from: ${this._animationStart.target};
        to: ${this._animationEnd.target};
        elasticity: 200;
        dur: 1000;
        ease: easeInOutSine;
      `;
    }

    return (
      <a-camera
        animation={animation}
        animation__2={animation__2}
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls="enabled: false"
        far={Constants.cameraValues.far}
        id="mainCamera"
        cursor="rayOrigin: mouse"
        raycaster="objects: .collidable"
        al-orbit-control={`
          maxPolarAngle: ${Constants.cameraValues.maxPolarAngle};
          minDistance: ${Constants.cameraValues.minDistance};
          screenSpacePanning: true;
          rotateSpeed: ${Constants.cameraValues.rotateSpeed};
          zoomSpeed: ${Constants.cameraValues.zoomSpeed};
          enableDamping: true;
          dampingFactor: ${Constants.cameraValues.dampingFactor};
          controlTarget: ${ThreeUtils.vector3ToString(
            this.camera ? this.camera.target : new THREE.Vector3(0, 0, 0)
          )};
          controlPosition: ${ThreeUtils.vector3ToString(
            this.camera ? this.camera.position : new THREE.Vector3(0, 0, 0)
          )};
          enabled: ${this.controlsEnabled};
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
        ortho
      >
        {this._renderSrc()}
        {this._renderNodes()}
        {this._renderEdges()}
        {this._renderLights()}
        {this._renderCamera()}
        />
      </a-scene>
    );
  }

  render(): JSX.Element {
    return (
      <div
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

  //#region Private Methods
  private _createEdge(node1: string, node2: string): void {
    const newEdge: AlEdgeSerial = {
      node1Id: node1,
      node2Id: node2
    };
    const edgeId: string = GetUtils.getNextEdgeId(this.edges);

    this._setEdge([edgeId, newEdge]);
  }
  private _getAppState(): AlAppState {
    // todo: can we watch the store object?
    return this.store.getState().app;
  }

  private _clearNodes(): void {
    this.appClearNodes();
    this.onChanged.emit(this._getAppState());
  }

  private _setNodes(nodes: Map<string, AlNodeSerial>): void {
    nodes.forEach((value: AlNodeSerial, key: string) => {
      this.appSetNode([key, value]);
    });
    this.onChanged.emit(this._getAppState());
  }

  private _deleteNode(nodeId: string): void {
    this.appDeleteNode(nodeId);
    this.onChanged.emit(this._getAppState());
  }

  private _setNode(node: [string, AlNodeSerial]): void {
    window.setTimeout(() => {
      this.appSetNode(node);
      this.onChanged.emit(this._getAppState());
    }, Constants.minFrameMS);
  }

  private _setEdge(edge: [string, AlEdgeSerial]): void {
    this.appSetEdge(edge);
    this.onChanged.emit(this._getAppState());
  }

  private _selectNode(nodeId: string, animate: boolean): void {
    if (animate && nodeId !== this.selected) {

      this._animationStart = this.camera;
      this._animationEnd = this.camera;

      let result: AlCameraSerial | null = GetUtils.getCameraStateFromNode(
        this.nodes.get(this.selected),
        this._boundingSphereRadius
      );

      if (result) {
        const diffPos: number = result.position.distanceTo(
          this.camera.position
        );

        let diffTarg: number;
        this.camera.target?  diffTarg = result.target.distanceTo(this.camera.target) : diffTarg = 0;

        if (diffPos > 0 || diffTarg > 0) {
          diffPos > 0? this._animationEnd.position = result.position : null;
          diffTarg > 0? this._animationEnd.target = result.target : null;
          this.appSetCameraAnimating(true); 
        }
      }
    }
    this.appSelectNode(nodeId);
    this.onChanged.emit(this._getAppState());
  }

  private _setNodesEnabled(enabled: boolean): void {
    this.appSetNodesEnabled(enabled);
    this.onChanged.emit(this._getAppState());
  }

  private _setBoundingBoxVisible(visible: boolean): void {
    this.appSetBoundingBoxVisible(visible);
    this.onChanged.emit(this._getAppState());
  }

  private _setSrc(src: string): void {
    this.appSetSrc(src);
    this.onChanged.emit(this._getAppState());
  }

  private _srcLoaded(): void {
    const mesh: THREE.Mesh = this._targetEntity.object3DMap.mesh as THREE.Mesh;
    mesh.geometry.computeBoundingSphere();
    this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;

    let result = GetUtils.getCameraStateFromEntity(this._targetEntity);
    if (result) {
      this.appSetCamera({
        position: result.position,
        target: result.target
      });
    }

    this.appSetSrcLoaded(true);
    this.onChanged.emit(this._getAppState());
  }
  //#endregion

  //#region Event Handlers
  private _canvasMouseDown(event: MouseEvent) {
    this._isShiftDown = event.shiftKey;
  }

  private _canvasMouseUp(_event: MouseEvent) {
    this._isShiftDown = false;
  }

  private _controlsUpdated(event: CustomEvent): void {
    this.appSetCamera(event.detail.cameraSerial);
  }

  private _controlsEnabledHandler(_event: CustomEvent): void {
    this.appSetControlsEnabled(true);
    ThreeUtils.enableCamera(this._camera, true);
  }

  private _controlsDisabledHandler(_event: CustomEvent): void {
    this.appSetControlsEnabled(false);
    ThreeUtils.enableCamera(this._camera, false);
  }

  private _intersectionClearedEventHandler(_event): void {
    this._intersectingNode = null;
  }

  private _intersectingNodeEventHandler(event): void {
    this._intersectingNode = event.detail.id;
  }

  private _setNodeEventHandler(event: CustomEvent): void {
    // IF creating a new node and NOT intersecting an existing node
    if (
      this.nodesEnabled && // Nodes are enabled
      this._validTarget && // Target is valid
      this._intersectingNode === null // Not intersecting a Node already
    ) {
      let intersection: THREE.Intersection = event.detail.detail.intersection;

      const nodeId: string = GetUtils.getNextNodeId(this.nodes);

      const newNode: AlNodeSerial = {
        target: ThreeUtils.vector3ToString(
          this._targetEntity.object3D.position
        ),
        position: ThreeUtils.vector3ToString(intersection.point),
        scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
        text: nodeId
      };

      const previousSelected = this.selected;

      this._setNode([nodeId, newNode]);

      if (
        this._isShiftDown && // Shift is down
        this.selected // A Node is already selected
      ) {
        this._createEdge(previousSelected, nodeId);
      }
    }
  }

  private _validTargetEventHandler(event: CustomEvent): void {
    this._validTarget = event.detail.valid;
  }

  private _nodeSelectedEventHandler(event: CustomEvent): void {
    // ELSE IF intersecting a node and it is NOT the selected node
    if (
      this._intersectingNode !== null && // We're are intersecting a node
      this.nodesEnabled && // Nodes are enabled
      this.selected !== null && // We have a node already selected
      this.selected !== this._intersectingNode && // The selected & intersecting nodes are not the same
      this._isShiftDown // The shift key is down
    ) {
      this._createEdge(this.selected, this._intersectingNode);
    }
    this._selectNode(event.detail.id, false);
  }

  private _nodeMovedEventHandler(event: CustomEvent): void {
    const nodeId: string = event.detail.id;
    const raycaster = this._camera.components.raycaster as any;

    // First try target
    let intersection = raycaster.getIntersection(
      this._targetEntity
    ) as THREE.Intersection;

    // Try backboard
    if (!intersection) {
      intersection = raycaster.getIntersection(
        this._backBoard
      ) as THREE.Intersection;
    }

    // TODO: Add Edge Position event
    if (intersection) {
      this._setNode([
        nodeId,
        {
          position: ThreeUtils.vector3ToString(intersection.point)
        }
      ]);
      const eventName = nodeId + Constants.movedEventString;
      this._scene.emit(eventName, {}, true);
    } else {
      console.log("No intersection!");
    }
  }

  private _addEventListeners(): void {
    this._scene.canvas.addEventListener("mousedown", this._canvasMouseDown, {
      capture: false,
      once: false,
      passive: true
    });

    this._scene.canvas.addEventListener("mouseup", this._canvasMouseUp, {
      capture: false,
      once: false,
      passive: true
    });

    this._scene.addEventListener(
      AlOrbitControlEvents.UPDATED,
      this._controlsUpdated,
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
      this._setNodeEventHandler,
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

    this._scene.addEventListener(
      AlGltfModelEvents.LOADED,
      this._srcLoaded,
      false
    );

    this._scene.addEventListener(
      AlNodeEvents.INTERSECTION,
      this._intersectingNodeEventHandler,
      false
    );

    this._scene.addEventListener(
      AlNodeEvents.INTERSECTION_CLEARED,
      this._intersectionClearedEventHandler,
      false
    );
  }
  //#endregion

  componentDidLoad() {}

  componentDidUpdate() {
    if (this._scene) {
      this._addEventListeners();
    }

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

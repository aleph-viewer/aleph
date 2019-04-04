//#region Imports
import {
  Component,
  Element,
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
import { GetUtils, ThreeUtils, CreateUtils, GraphUtils, AlGraphEvents } from "../../utils";
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

  private _container: HTMLElement;
  private _targetEntity: Entity;
  private _backBoard: Entity;
  private _scene: Scene;
  private _boundingSphereRadius: number;
  private _validTarget: boolean;
  private _camera: Entity;
  private _graphIntersection: string | null = null;
  private _isShiftDown: boolean = false;

  // This needs to be removed ASAP - Fixes a perceieved issue with Aframe & Depth Testing
  private _numEmptyNodes: number;

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

  //#region general methods

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
      }, Constants.minLoadingMS);
    } else {
      this._setSrc(src);
    }
  }

  @Method()
  public resize(): void {
    if (this.srcLoaded) {
      const camera: THREE.PerspectiveCamera = this._scene.sceneEl
        .camera as THREE.PerspectiveCamera;
      const renderer: THREE.Renderer = this._scene.sceneEl.renderer;
      camera.aspect =
        this._container.offsetWidth / this._container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        this._container.offsetWidth,
        this._container.offsetHeight
      );
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
    this._animationFinished = this._animationFinished.bind(this);
    this._canvasMouseDownHandler = this._canvasMouseDownHandler.bind(this);
    this._canvasMouseUpHandler = this._canvasMouseUpHandler.bind(this);
    this._controlsDisabledHandler = this._controlsDisabledHandler.bind(this);
    this._controlsEnabledHandler = this._controlsEnabledHandler.bind(this);
    this._controlsUpdatedHandler = this._controlsUpdatedHandler.bind(this);
    this._intersectingGraphHandler = this._intersectingGraphHandler.bind(
      this
    );
    this._intersectionGraphClearedHandler = this._intersectionGraphClearedHandler.bind(
      this
    );
    this._nodeMovedEventHandler = this._nodeMovedEventHandler.bind(this);
    this._graphSelectedHandler = this._graphSelectedHandler.bind(this);
    this._setNodeEventHandler = this._setNodeEventHandler.bind(this);
    this._srcLoaded = this._srcLoaded.bind(this);
    this._validTargetEventHandler = this._validTargetEventHandler.bind(this);

    this._numEmptyNodes = 3;
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
        return [
          <a-entity
            al-node-spawner={`
              nodesEnabled: ${this.nodesEnabled};
            `}
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
    let result = this.camera ? this.getEmptyNodes(this._numEmptyNodes) : [];
    result.push(
      [...this.nodes].map((n: [string, AlNodeSerial]) => {
        const [nodeId, node] = n;

        let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        textOffset.multiplyScalar(node.scale);

        return (
          <a-entity
            class="collidable"
            id={nodeId}
            position={node.position}
            al-node={`
            target: ${node.target};
            scale: ${node.scale};
            selected: ${this.selected === nodeId};
            nodesEnabled: ${this.nodesEnabled};
          `}
          >
            <a-entity
              text={`
              value: ${node.text};
              side: double;
              align: center;
              baseline: bottom;
              anchor: center;
              width: ${Constants.fontSize * this._boundingSphereRadius}
            `}
              al-look-to-camera
              al-render-overlaid-text
              position={ThreeUtils.vector3ToString(textOffset)}
              id={`${nodeId}-label`}
            />
          </a-entity>
        );
      })
    );

    return result;
  }

  private _renderEdges(): JSX.Element {
    return [...this.edges].map((n: [string, AlEdgeSerial]) => {
      const [edgeId, edge] = n;
      const node1 = this.nodes.get(edge.node1Id);
      const node2 = this.nodes.get(edge.node2Id);

      if (node1 && node2) {
        const sv = ThreeUtils.stringToVector3(node1.position);
        const ev = ThreeUtils.stringToVector3(node2.position);

        let dir = ev.clone().sub(sv);
        let dist = dir.length();
        dir = dir.normalize().multiplyScalar(dist * 0.5);
        let centoid = sv.clone().add(dir);
        //console.log("centoid: ", centoid);

        let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        let scale = (node1.scale + node2.scale) / 2;
        let radius = this._boundingSphereRadius * Constants.edgeSize;
        textOffset.multiplyScalar(scale);

        return (
          <a-entity
            class="collidable"
            id={edgeId}
            position={ThreeUtils.vector3ToString(centoid)}
            // This.SelectedEdge
            al-edge={`
              height: ${dist};
              node1: ${node1.position};
              node2: ${node2.position};
              selected: ${false};
              radius: ${radius};
            `}
          >
            <a-entity
              id={`${edgeId}-title`}
              text={`
                value: ${dist.toFixed(Constants.decimalPlaces) + " units"};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSize * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              al-look-to-camera
              al-render-overlaid-text
            />
          </a-entity>
        );
      } else {
        return;
      }
    });
  }

  private _renderAngles(): JSX.Element {
    return [...this.angles].map((n: [string, AlAngleSerial]) => {
      const [angleId, angle] = n;
      const edge1 = this.edges.get(angle.edge1Id);
      const edge2 = this.edges.get(angle.edge2Id);

      if (edge1 && edge2) {
        let centralNode;
        let node1;
        let node2;
        // IF E1N1 === E2N1
        if (edge1.node1Id === edge2.node1Id) {
          centralNode = this.nodes.get(edge2.node1Id);
          node1 = this.nodes.get(edge1.node2Id);
          node2 = this.nodes.get(edge2.node2Id);
        }
        // IF E1N1 === E2N2
        else if (edge1.node1Id === edge2.node2Id) {
          centralNode = this.nodes.get(edge2.node2Id);
          node1 = this.nodes.get(edge1.node2Id);
          node2 = this.nodes.get(edge2.node1Id);
        }
        // IF E1N2 === E2N1
        else if (edge1.node2Id === edge2.node1Id) {
          centralNode = this.nodes.get(edge2.node1Id);
          node1 = this.nodes.get(edge1.node1Id);
          node2 = this.nodes.get(edge2.node2Id);
        }
        // IF E1N2 === E2N2
        else if (edge1.node2Id === edge2.node2Id) {
          centralNode = this.nodes.get(edge2.node2Id);
          node1 = this.nodes.get(edge1.node1Id);
          node2 = this.nodes.get(edge2.node1Id);
        }

        let dir1: THREE.Vector3 = node1.clone().sub(centralNode).normalize();
        let dir2: THREE.Vector3 = node2.clone().sub(centralNode).normalize();
        let angle = dir2.angleTo(dir1);

        let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        let scale = (node1.scale + node2.scale + centralNode.scale) / 3;
        let radius = this._boundingSphereRadius * Constants.edgeSize;
        textOffset.multiplyScalar(scale);

        return (
          <a-entity
            class="collidable"
            id={angleId}
            position={ThreeUtils.vector3ToString(centralNode.position)}
            al-angle={`
              selected: ${false};
              nodeLeftPosition: ${ThreeUtils.vector3ToString(node1.position)};
              nodeRightPosition: ${ThreeUtils.vector3ToString(node2.position)};
              nodeCenterPosition: ${ThreeUtils.vector3ToString(centralNode.position)};
            `}
          >
            <a-entity
              id={`${angleId}-title`}
              text={`
                value: ${angle.toFixed(Constants.decimalPlaces) + " units"};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSize * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              al-look-to-camera
              al-render-overlaid-text
            />
          </a-entity>
        );
      } else {
        return;
      }
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
    return (
      <a-camera
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
          animating: ${
            this.camera && this.camera.animating ? this.camera.animating : false
          }
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
        {this._renderAngles()}
        {this._renderEdges()}
        {this._renderNodes()}
        {this._renderLights()}
        {this._renderCamera()}
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
        ref={el => (this._container = el)}
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
    const edgeId: string = GraphUtils.getNextEdgeId(this.edges);

    this._setEdge([edgeId, newEdge]);
  }

  private _createAngle(edge1: string, edge2: string): void {
    const newAngle: AlAngleSerial = {
      edge1Id: edge1,
      edge2Id: edge2
    };
    const angleId: string = GraphUtils.getNextAngleId(this.angles);

    this._setAngle([angleId, newAngle]);
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
    ThreeUtils.waitOneFrame(() => {
      this.appSetNode(node);
      this.onChanged.emit(this._getAppState());
    });
  }

  private _setEdge(edge: [string, AlEdgeSerial]): void {
    this.appSetEdge(edge);
    this.onChanged.emit(this._getAppState());
  }

  private _selectNode(nodeId: string, animate: boolean): void {
    if (animate && nodeId !== this.selected) {
      let animationStart = {
        position: this.camera.position.clone(),
        target: this.camera.target.clone()
      } as AlCameraSerial;
      let animationEnd = {
        position: new THREE.Vector3(-1, -1, -1),
        target: new THREE.Vector3(-1, -1, -1)
      } as AlCameraSerial;

      let result: AlCameraSerial | null = GetUtils.getCameraStateFromNode(
        this.nodes.get(nodeId),
        this._boundingSphereRadius
      );

      if (result) {
        const diffPos: number = result.position.distanceTo(
          this.camera.position
        );

        let diffTarg: number;
        this.camera.target
          ? (diffTarg = result.target.distanceTo(this.camera.target))
          : (diffTarg = 0);

        if (diffPos > 0 || diffTarg > 0) {
          diffPos > 0
            ? animationEnd.position.copy(result.position)
            : animationEnd.position.copy(this.camera.position);
          diffTarg > 0
            ? animationEnd.target.copy(result.target)
            : animationEnd.target.copy(this.camera.target);
          ThreeUtils.sendAnimationCache(
            this._scene,
            animationStart,
            animationEnd,
            diffPos > 0,
            diffTarg > 0
          );
          // todo: should sendAnimationCache be emitting the ANIMATION_STARTED event,
          // or should it be happening here?
          ThreeUtils.waitOneFrame(() => {
            this.appSetCamera({
              animating: true
            });
            this.appSelectNode(nodeId);
            this.onChanged.emit(this._getAppState());
          });
        }
      }
    } else {
      this.appSelectNode(nodeId);
      this.onChanged.emit(this._getAppState());
    }
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
    this._numEmptyNodes += 3;
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
  private _canvasMouseDownHandler(event: MouseEvent) {
    this._isShiftDown = event.shiftKey;
  }

  private _canvasMouseUpHandler(_event: MouseEvent) {
    this._isShiftDown = false;
  }

  private _controlsUpdatedHandler(event: CustomEvent): void {
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

  private _intersectionGraphClearedHandler(_event): void {
    this._graphIntersection = null;
  }

  private _intersectingGraphHandler(event): void {
    this._graphIntersection = event.detail.id;
  }

  private _setNodeEventHandler(event: CustomEvent): void {
    // IF creating a new node and NOT intersecting an existing node
    if (
      this.nodesEnabled && // Nodes are enabled
      this._validTarget && // Target is valid
      this._graphIntersection === null // Not intersecting a Node already
    ) {
      let intersection: THREE.Intersection = event.detail.detail.intersection;

      const nodeId: string = GraphUtils.getNextNodeId(this.nodes);

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
        ThreeUtils.waitOneFrame(() => {
          this._createEdge(previousSelected, nodeId);
        });
      }
    }
  }

  private _validTargetEventHandler(event: CustomEvent): void {
    this._validTarget = event.detail.valid;
  }

  private _animationFinished(_event: CustomEvent): void {
    this.appSetCamera({
      animating: false
    });
  }

  // TODO: Add Angle selection by accounting for type of the selected graph item
  private _graphSelectedHandler(event: CustomEvent): void {
    // ELSE IF intersecting a node and it is NOT the selected node
    if (
      this._graphIntersection !== null && // We're are intersecting a node
      this.nodesEnabled && // Nodes are enabled
      this.selected !== null && // We have a node already selected
      this.selected !== this._graphIntersection && // The selected & intersecting nodes are not the same
      this._isShiftDown // The shift key is down
    ) {
      this._createEdge(this.selected, this._graphIntersection);
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
      //console.log("emit: ", eventName);
      this._scene.emit(eventName, {}, true);
    } else {
      //console.log("No intersection!");
    }
  }

  private getEmptyNodes(maxEmptyNodes: number): any[] {
    let result = [];

    for (let i = 0; i < maxEmptyNodes; i++) {
      let emptyNode = (
        <a-entity
          id={"nodeEmpty-" + i}
          position="0 0 0"
          al-node={`
            target: "0 0 0";
            scale: "0.1 0.1 0.1";
            selected: "false";
            nodesEnabled: ${this.nodesEnabled};
          `}
          visible="false"
        />
      );
      result.push(emptyNode);
    }
    return result;
  }

  private _addEventListeners(): void {
    this._scene.canvas.addEventListener("mousedown", this._canvasMouseDownHandler, {
      capture: false,
      once: false,
      passive: true
    });

    this._scene.canvas.addEventListener("mouseup", this._canvasMouseUpHandler, {
      capture: false,
      once: false,
      passive: true
    });

    this._scene.addEventListener(
      AlOrbitControlEvents.ANIMATION_FINISHED,
      this._animationFinished,
      false
    );

    this._scene.addEventListener(
      AlOrbitControlEvents.UPDATED,
      this._controlsUpdatedHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.CONTROLS_ENABLED,
      this._controlsEnabledHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.CONTROLS_DISABLED,
      this._controlsDisabledHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.DRAGGING,
      this._nodeMovedEventHandler,
      false
    );

    this._scene.addEventListener(
      AlNodeSpawnerEvents.ADD_NODE,
      this._setNodeEventHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.SELECTED,
      this._graphSelectedHandler,
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
      AlGraphEvents.INTERSECTION,
      this._intersectingGraphHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.INTERSECTION_CLEARED,
      this._intersectionGraphClearedHandler,
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

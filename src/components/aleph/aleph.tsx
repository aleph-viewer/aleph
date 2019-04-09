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
import { KeyDown } from "@edsilv/key-codes";
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
  appSetGraphEnabled,
  appSetNode,
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
import {
  GetUtils,
  ThreeUtils,
  CreateUtils,
  GraphUtils,
  AlGraphEvents
} from "../../utils";
import { Constants } from "../../Constants";
import { MeshFileType, Orientation, DisplayMode } from "../../enums";
import {
  AlGltfModelEvents,
  AlNodeSpawnerEvents,
  AlOrbitControlEvents
} from "../../aframe";
import { AlGraphEntryType } from "../../enums";
import { AlGraph } from "../../interfaces/AlGraph";
import { AlVolumetricSlicesEvents } from "../../aframe/AlVolumetricSlices";
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
  private _backboard: Entity;
  private _backboardVisible: boolean = false;
  private _scene: Scene;
  private _boundingSphereRadius: number;
  private _validTarget: boolean;
  private _camera: Entity;
  private _graphIntersection: string | null = null;
  private _isShiftDown: boolean = false;

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
  appSetGraphEnabled: Action;
  appSetNode: Action;
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
  @State() graphEnabled: boolean;
  @State() nodes: Map<string, AlNodeSerial>;
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
  async setGraph(graph: AlGraph): Promise<void> {
    if (graph.nodes) {
      const nodes: Map<string, AlNodeSerial> = new Map(graph.nodes);
      nodes.forEach((value: AlNodeSerial, key: string) => {
        this.appSetNode([key, value]);
      });
    }

    if (graph.edges) {
      const edges: Map<string, AlEdgeSerial> = new Map(graph.edges);
      edges.forEach((value: AlEdgeSerial, key: string) => {
        this.appSetEdge([key, value]);
      });
    }

    if (graph.angles) {
      const angles: Map<string, AlAngleSerial> = new Map(graph.angles);
      angles.forEach((value: AlAngleSerial, key: string) => {
        this.appSetAngle([key, value]);
      });
    }

    this.onChanged.emit(this._getAppState());
  }

  @Method()
  async deleteNode(nodeId: string): Promise<void> {
    this._deleteNode(nodeId);
  }

  @Method()
  async clearGraph(): Promise<void> {
    this._clearGraph();
  }

  @Method()
  async selectNode(nodeId: string): Promise<void> {
    this._selectNode(nodeId, true);
  }

  @Method()
  async deleteEdge(edgeId: string): Promise<void> {
    this._deleteEdge(edgeId);
  }

  @Method()
  async deleteAngle(angleId: string): Promise<void> {
    this._deleteAngle(angleId);
  }

  //#endregion

  //#region Edge Methods
  @Method()
  async setEdge(edge: [string, AlEdgeSerial]): Promise<void> {
    this._setEdge(edge);
  }
  //#endregion

  //#region control panel methods

  @Method()
  async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this.appSetDisplayMode(displayMode);
  }

  @Method()
  async setGraphEnabled(enabled: boolean): Promise<void> {
    this._setGraphEnabled(enabled);
  }

  @Method()
  async setBoundingBoxVisible(visible: boolean): Promise<void> {
    this._setBoundingBoxVisible(visible);
  }

  @Method()
  async setSlicesIndex(index: number): Promise<void> {
    this._setSlicesIndex(index);
  }
  //#endregion

  @Event() onChanged: EventEmitter;
  @Event() onLoad: EventEmitter;

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
          graphEnabled,
          nodes,
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
        graphEnabled,
        nodes,
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
      appSetGraphEnabled,
      appSetNode,
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
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._keyUpHandler = this._keyUpHandler.bind(this);
    this._controlsDisabledHandler = this._controlsDisabledHandler.bind(this);
    this._controlsEnabledHandler = this._controlsEnabledHandler.bind(this);
    this._controlsUpdatedHandler = this._controlsUpdatedHandler.bind(this);
    this._intersectingGraphHandler = this._intersectingGraphHandler.bind(this);
    this._intersectionGraphClearedHandler = this._intersectionGraphClearedHandler.bind(
      this
    );
    this._nodeMovedEventHandler = this._nodeMovedEventHandler.bind(this);
    this._graphSelectedHandler = this._graphSelectedHandler.bind(this);
    this._spawnNodeEventHandler = this._spawnNodeEventHandler.bind(this);
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

    let backscale: number = 0;
    let backboard: JSX.Element | null = null;

    if (this._boundingSphereRadius) {
      backscale = this._boundingSphereRadius * Constants.splashBackSize;

      backboard = (
        <a-entity
          class="collidable"
          id="back-board"
          geometry={`primitive: plane; height: ${backscale}; width: ${backscale}`}
          al-fixed-to-orbit-camera={`
          distanceFromTarget: ${this._boundingSphereRadius};
          target: ${
            this.camera ? this.camera.target : new THREE.Vector3(0, 0, 0)
          };
        `}
          material={`
          wireframe: ${this._backboardVisible};
          transparent: true;
          opacity: ${this._backboardVisible ? `1.0` : `0.0`};
          side: double;
        `}
          ref={el => (this._backboard = el)}
        />
      );
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return [
          <a-entity
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
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
          backboard
        ];
      }
      case DisplayMode.SLICES: {
        let ent = (
          <a-entity
            al-node-spawner={`
            graphEnabled: ${this.graphEnabled};
          `}
            class="collidable"
            id="target-entity"
            al-volumetric-slices={`
            src: ${this.src};
            index: ${this.slicesIndex};
          `}
            position="0 0 0"
            scale="1 1 1"
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
        return [ent, backboard];
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
          al-node={`
            target: ${node.target};
            scale: ${node.scale};
            selected: ${this.selected === nodeId};
            graphEnabled: ${this.graphEnabled};
          `}
        >
          <a-entity
            text={`
              value: ${node.text};
              side: double;
              align: center;
              baseline: bottom;
              anchor: center;
              width: ${Constants.fontSizeMedium * this._boundingSphereRadius}
            `}
            al-look-to-camera
            al-render-overlaid-text
            visible={`${this.selected === nodeId}`}
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
      const node1 = this.nodes.get(edge.node1Id);
      const node2 = this.nodes.get(edge.node2Id);

      if (node1 && node2) {
        const sv = ThreeUtils.stringToVector3(node1.position);
        const ev = ThreeUtils.stringToVector3(node2.position);

        let dir = ev.clone().sub(sv);
        let dist = dir.length();
        dir = dir.normalize().multiplyScalar(dist * 0.5);
        let centoid = sv.clone().add(dir);

        let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        let scale = (node1.scale + node2.scale) / 2;
        let radius = this._boundingSphereRadius * Constants.edgeSize;
        textOffset.multiplyScalar(scale);

        return (
          <a-entity
            class="collidable"
            id={edgeId}
            position={ThreeUtils.vector3ToString(centoid)}
            al-edge={`
              length: ${dist};
              node1: ${node1.position};
              node2: ${node2.position};
              selected: ${this.selected === edgeId};
              radius: ${radius};
              nodeScale: ${scale};
            `}
          >
            <a-entity
              id={`${edgeId}-title`}
              text={`
                value: ${dist.toFixed(Constants.decimalPlaces) + " m"};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSizeSmall * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              visible={`${this.selected === edgeId}`}
              al-look-to-camera
              al-render-overlaid-text
            />
          </a-entity>
        );
      }
    });
  }

  private _renderAngles(): JSX.Element {
    return [...this.angles].map((n: [string, AlAngleSerial]) => {
      const [angleId, angle] = n;
      const edge1 = this.edges.get(angle.edge1Id);
      const edge2 = this.edges.get(angle.edge2Id);

      if (edge1 && edge2) {
        let radius = this._boundingSphereRadius * Constants.edgeSize;
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

        const node1Pos = ThreeUtils.stringToVector3(node1.position);
        const node2Pos = ThreeUtils.stringToVector3(node2.position);
        const centralPos = ThreeUtils.stringToVector3(centralNode.position);

        let dir1: THREE.Vector3 = node1Pos
          .clone()
          .sub(centralPos)
          .normalize();
        let dir2: THREE.Vector3 = node2Pos
          .clone()
          .sub(centralPos)
          .normalize();
        let angle = dir2.angleTo(dir1);

        let edge1Pos: THREE.Vector3 = dir1.clone().multiplyScalar(radius * 25);
        let edge2Pos: THREE.Vector3 = dir2.clone().multiplyScalar(radius * 25);
        let length = edge1Pos.clone().distanceTo(edge2Pos.clone());
        let position: THREE.Vector3 = edge1Pos
          .clone()
          .add(edge2Pos.clone())
          .divideScalar(2);

        let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        let scale = (node1.scale + node2.scale + centralNode.scale) / 3;
        textOffset.multiplyScalar(scale);

        return (
          <a-entity
            class="collidable"
            id={angleId}
            position={centralNode.position}
            al-angle={`
              selected: ${this.selected === angleId};
              edge0Pos: ${ThreeUtils.vector3ToString(edge1Pos)};
              edge1Pos: ${ThreeUtils.vector3ToString(edge2Pos)};
              position: ${ThreeUtils.vector3ToString(position)};
              length: ${length};
              radius: ${radius};
              angle: ${angle};
            `}
          >
            <a-entity
              id={`${angleId}-title`}
              text={`
                value: ${THREE.Math.radToDeg(angle).toFixed(
                  Constants.decimalPlaces
                ) + " deg"};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSizeSmall * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(
                position.clone().add(textOffset)
              )}
              visible={`${this.selected === angleId}`}
              al-look-to-camera
              al-render-overlaid-text
            />
          </a-entity>
        );
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
        renderer="colorManagement: true; sortObjects: true;"
        vr-mode-ui="enabled: false"
        ref={el => (this._scene = el)}
      >
        {this._renderSrc()}
        {this._renderNodes()}
        {this._renderEdges()}
        {this._renderAngles()}
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
  private _createEdge(node1Id: string, node2Id: string): void {
    // check if there is already an edge connecting these two nodes
    const match: [string, AlEdgeSerial] | undefined = [...this.edges].find(
      ([_id, edge]) => {
        return (
          (edge.node1Id === node1Id && edge.node2Id === node2Id) ||
          (edge.node1Id === node2Id && edge.node2Id === node1Id)
        );
      }
    );

    if (!match) {
      const newEdge: AlEdgeSerial = {
        node1Id: node1Id,
        node2Id: node2Id
      };
      const edgeId: string = GraphUtils.getNextId(
        AlGraphEntryType.EDGE,
        this.edges
      );

      this._setEdge([edgeId, newEdge]);
    } else {
      console.log("edge already exists");
    }
  }

  private _createAngle(edge1Id: string, edge2Id: string): void {
    // check if there is already an angle connecting these two edges
    const match: [string, AlAngleSerial] | undefined = [...this.angles].find(
      ([_id, angle]) => {
        return (
          (angle.edge1Id === edge1Id && angle.edge2Id === edge2Id) ||
          (angle.edge1Id === edge2Id && angle.edge2Id === edge1Id)
        );
      }
    );
    if (!match) {
      const newAngle: AlAngleSerial = {
        edge1Id: edge1Id,
        edge2Id: edge2Id
      };
      const angleId: string = GraphUtils.getNextId(
        AlGraphEntryType.ANGLE,
        this.angles
      );

      this._setAngle([angleId, newAngle]);
    } else {
      console.log("angle already exists");
    }
  }

  private _getAppState(): AlAppState {
    // todo: can we watch the store object?
    return this.store.getState().app;
  }

  private _clearGraph(): void {
    this.appClearNodes();
    this.appClearEdges();
    this.appClearAngles();
    this.onChanged.emit(this._getAppState());
  }

  private _deleteNode(nodeId: string): void {
    this.appDeleteNode(nodeId);
    this.onChanged.emit(this._getAppState());
  }

  private _setNode(node: [string, AlNodeSerial]): void {
    //ThreeUtils.waitOneFrame(() => {
    this.appSetNode(node);
    this.onChanged.emit(this._getAppState());
    //});
  }

  private _selectNode(nodeId: string, animate: boolean = false): void {
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
          const slerpPath: number[] = ThreeUtils.getSlerpPath(
            animationStart,
            animationEnd,
            diffPos > 0,
            diffTarg > 0
          );
          //ThreeUtils.waitOneFrame(() => {
          this._scene.emit(
            AlOrbitControlEvents.ANIMATION_STARTED,
            { slerpPath },
            false
          );
          this.appSetCamera({
            animating: true
          });
          this.appSelectNode(nodeId);
          this.onChanged.emit(this._getAppState());
          //});
        }
      }
    } else {
      this.appSelectNode(nodeId);
      this.onChanged.emit(this._getAppState());
    }
  }

  private _setEdge(edge: [string, AlEdgeSerial]): void {
    this.appSetEdge(edge);
    this.onChanged.emit(this._getAppState());
  }

  private _deleteEdge(edgeId: string): void {
    this.appDeleteEdge(edgeId);
    this.onChanged.emit(this._getAppState());
  }

  private _selectEdge(edgeId: string): void {
    this.appSelectEdge(edgeId);
    this.onChanged.emit(this._getAppState());
  }

  private _setAngle(angle: [string, AlAngleSerial]): void {
    this.appSetAngle(angle);
    this.onChanged.emit(this._getAppState());
  }

  private _selectAngle(angleId: string): void {
    this.appSelectAngle(angleId);
    this.onChanged.emit(this._getAppState());
  }

  private _deleteAngle(angleId: string): void {
    this.appDeleteAngle(angleId);
    this.onChanged.emit(this._getAppState());
  }

  private _setGraphEnabled(enabled: boolean): void {
    this.appSetGraphEnabled(enabled);
    this.onChanged.emit(this._getAppState());
  }

  private _setBoundingBoxVisible(visible: boolean): void {
    this.appSetBoundingBoxVisible(visible);
    this.onChanged.emit(this._getAppState());
  }

  private _setSlicesIndex(index: number): void {
    this.appSetSlicesIndex(index);
    this.onChanged.emit(this._getAppState());
  }

  private _setSrc(src: string): void {
    this.appSetSrc(src);
    this.onChanged.emit(this._getAppState());
  }

  private _srcLoaded(ev: any): void {
    const aframeMesh: THREE.Mesh = this._targetEntity.object3DMap
      .mesh as THREE.Mesh;
    let mesh: THREE.Mesh;

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        mesh = aframeMesh;
        break;
      }
      case DisplayMode.SLICES: {
        mesh = aframeMesh.children[1].children[0] as THREE.Mesh;
        break;
      }
      case DisplayMode.VOLUME: {
        break;
      }
    }

    let result: AlCameraSerial = GetUtils.getCameraStateFromMesh(mesh);
    this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;

    if (result) {
      this.appSetCamera(result);
    }

    this.appSetSrcLoaded(true);
    this.onChanged.emit(this._getAppState());
    this.onLoad.emit(ev.detail);
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

  private _spawnNodeEventHandler(event: CustomEvent): void {
    // IF creating a new node and NOT intersecting an existing node
    if (
      this.graphEnabled && // Nodes are enabled
      this._validTarget && // Target is valid
      this._graphIntersection === null // Not intersecting a Node already
    ) {
      let intersection: THREE.Intersection = event.detail.detail.intersection;

      const nodeId: string = GraphUtils.getNextId(
        AlGraphEntryType.NODE,
        this.nodes
      );

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
        this.nodes.has(previousSelected) // A Node is already selected
      ) {
        this._createEdge(previousSelected, nodeId);
        this._selectNode(nodeId);
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

  private _graphSelectedHandler(event: CustomEvent): void {
    // todo: change to graphEnabled
    if (!this.graphEnabled) {
      return;
    }

    const type: AlGraphEntryType = event.detail.type;
    const id: string = event.detail.id;

    switch (type) {
      case AlGraphEntryType.NODE: {
        if (
          this._graphIntersection !== null &&
          this.nodes.has(this._graphIntersection) && // We're intersecting a node
          (this.selected !== null && this.nodes.has(this.selected)) && // We have a node already selected
          this.selected !== this._graphIntersection && // The selected & intersecting elements are not the same
          this._isShiftDown // The shift key is down
        ) {
          this._createEdge(this.selected, this._graphIntersection);
        }
        this._selectNode(id);
        break;
      }
      case AlGraphEntryType.EDGE: {
        if (
          this._graphIntersection !== null &&
          this.edges.has(this._graphIntersection) && // We're intersecting an edge
          (this.selected !== null && this.edges.has(this.selected)) && // We have an edge already selected
          this.selected !== this._graphIntersection && // The selected & intersecting elements are not the same
          this._isShiftDown // The shift key is down
        ) {
          // We're intersecting an edge
          this._createAngle(this.selected, this._graphIntersection);
        }
        this._selectEdge(id);
        break;
      }
      case AlGraphEntryType.ANGLE: {
        this._selectAngle(id);
        break;
      }
    }
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
        this._backboard
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
    }
  }

  private _addEventListeners(): void {
    document.addEventListener("keydown", this._keyDownHandler, false);
    document.addEventListener("keyup", this._keyUpHandler, false);

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
      AlGraphEvents.POINTER_UP,
      this._controlsEnabledHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_DOWN,
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
      this._spawnNodeEventHandler,
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
      AlVolumetricSlicesEvents.LOADED,
      this._srcLoaded,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_OVER,
      this._intersectingGraphHandler,
      false
    );

    this._scene.addEventListener(
      AlGraphEvents.POINTER_OUT,
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

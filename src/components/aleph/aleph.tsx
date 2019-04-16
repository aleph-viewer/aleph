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
  AlNode,
  AlCamera,
  AlAppState,
  AlEdge,
  AlAngle
} from "../../interfaces";
import {
  GetUtils,
  ThreeUtils,
  CreateUtils,
  GraphUtils,
  AlGraphEvents,
  AMIUtils
} from "../../utils";
import { Constants } from "../../Constants";
import { Orientation, DisplayMode } from "../../enums";
import {
  AlGltfModelEvents,
  AlNodeSpawnerEvents,
  AlOrbitControlEvents
} from "../../aframe";
import { AlGraphEntryType } from "../../enums";
import { AlGraph } from "../../interfaces/AlGraph";
import { AlVolumeEvents } from "../../aframe/AlVolume";
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
  private _backboard: Entity;
  private _backboardVisible: boolean = false;
  private _boundingBox: THREE.Box3;
  private _boundingSphereRadius: number;
  private _camera: Entity;
  private _graphIntersection: string | null = null;
  private _isShiftDown: boolean = false;
  private _mesh: THREE.Mesh;
  private _scene: Scene;
  private _targetEntity: Entity;
  private _validTarget: boolean;
  private _volumeHelper: AMI.VolumeRenderHelper;
  private _volumeCaster: THREE.Raycaster;

  @Prop({ context: "store" }) store: Store;
  @Prop() dracoDecoderPath: string | null;
  @Prop() width: string = "640px";
  @Prop() height: string = "480px";
  @Prop() debug: boolean = false;

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
  @State() angles: Map<string, AlAngle>;
  @State() boundingBoxVisible: boolean;
  @State() camera: AlCamera;
  @State() controlsEnabled: boolean;
  @State() displayMode: DisplayMode;
  @State() edges: Map<string, AlEdge>;
  @State() graphEnabled: boolean;
  @State() nodes: Map<string, AlNode>;
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
  async resize(): Promise<void> {
    if (this._scene) {
      (this._scene as any).resize();
    }
  }

  //#endregion

  //#region node methods

  @Method()
  async setNode(node: [string, AlNode]): Promise<void> {
    this._setNode(node);
  }

  @Method()
  async setGraph(graph: AlGraph): Promise<void> {
    this._setGraph(graph);
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
  async setEdge(edge: [string, AlEdge]): Promise<void> {
    this._setEdge(edge);
  }
  //#endregion

  //#region control panel methods

  @Method()
  async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this._setDisplayMode(displayMode);
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

  @Method()
  async setOrientation(orientation: Orientation): Promise<void> {
    this._setOrientation(orientation);
  }

  @Method()
  async setSlicesWindowCenter(center: number): Promise<void> {
    this._setSlicesWindowCenter(center);
  }

  @Method()
  async setSlicesWindowWidth(width: number): Promise<void> {
    this._setSlicesWindowWidth(width);
  }

  @Method()
  async setVolumeSteps(steps: number): Promise<void> {
    this._setVolumeSteps(steps);
  }

  @Method()
  async setVolumeWindowCenter(center: number): Promise<void> {
    this._setVolumeWindowCenter(center);
  }

  @Method()
  async setVolumeWindowWidth(width: number): Promise<void> {
    this._setVolumeWindowWidth(width);
  }

  //#endregion

  @Event() changed: EventEmitter;
  @Event() loaded: EventEmitter;

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
  // private _renderSpinner() {
  //   if (!this.srcLoaded) {
  //     return (
  //       <a-entity
  //         al-fixed-to-orbit-camera={`
  //         distanceFromTarget: 20;
  //         target: ${
  //           this.camera ? this.camera.position : new THREE.Vector3(0, 0, 0)
  //         };
  //       `}
  //       >
  //         <a-entity
  //           animation="property: rotation; to: 0 120 0; loop: true; dur: 1000; easing: easeInOutQuad"
  //           geometry="primitive: al-spinner;"
  //           material={`color: ${this.spinnerColor};`}
  //         />
  //       </a-entity>
  //     );
  //   }

  //   return null;
  // }

  private _renderSpinner() {
    if (this.src && !this.srcLoaded) {
      return (
        <div id="spinner">
          <div class="square" />
        </div>
      );
    }
  }

  private _renderBackboard() {
    if (!this.src) {
      return null;
    }

    let backscale: number = 0;

    if (this._boundingSphereRadius) {
      backscale = this._boundingSphereRadius * Constants.backboardSize;

      return (
        <a-entity
          class="collidable"
          id="backboard"
          geometry={`primitive: plane; height: ${backscale}; width: ${backscale}`}
          al-fixed-to-orbit-camera={`
          distanceFromTarget: ${this._boundingSphereRadius * 2};
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

    return null;
  }

  private _renderSrc() {
    if (!this.src) {
      return null;
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return (
          <a-entity
            class="collidable"
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            al-gltf-model={`
              src: url(${this.src});
              dracoDecoderPath: ${this.dracoDecoderPath};
            `}
            position="0 0 0"
            scale="1 1 1"
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
      case DisplayMode.SLICES:
      case DisplayMode.VOLUME: {
        return (
          <a-entity
            id="target-entity"
            class="collidable"
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            al-volume={`
              srcLoaded: ${this.srcLoaded};
              src: ${this.src};
              displayMode: ${this.displayMode};
              slicesIndex: ${this.slicesIndex};
              slicesOrientation: ${this.orientation};
              slicesWindowWidth: ${this.slicesWindowWidth};
              slicesWindowCenter: ${this.slicesWindowCenter};
              volumeSteps: ${this.volumeSteps};
              volumeWindowCenter: ${this.volumeWindowCenter};
              volumeWindowWidth: ${this.volumeWindowWidth};
            `}
            position="0 0 0"
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
    }
  }

  private _renderBoundingBox() {
    if (this.srcLoaded && this.boundingBoxVisible) {
      let size: THREE.Vector3 = new THREE.Vector3();
      this._boundingBox.getSize(size);

      // if targetEntity is a gltf, use its position (center). if it's a volume, the origin is in the bottom left, so get the position sub the geometry center
      const position: THREE.Vector3 =
        this.displayMode === DisplayMode.MESH
          ? this._targetEntity.object3D.position.clone()
          : this._targetEntity.object3D.position
              .clone()
              .add(GetUtils.getGeometryCenter(this._mesh.geometry));

      return (
        <a-entity
          position={ThreeUtils.vector3ToString(position)}
          al-bounding-box={`
            scale: ${ThreeUtils.vector3ToString(size)};
            color: ${Constants.colorValues.red};
        `}
        />
      );
    }

    return null;
  }

  private _renderNodes() {
    return Array.from(this.nodes).map((n: [string, AlNode]) => {
      const [nodeId, node] = n;

      let textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
      textOffset.multiplyScalar(node.scale);

      return (
        <a-entity
          class="collidable"
          id={nodeId}
          position={node.position}
          al-node={`
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

  private _renderEdges() {
    return Array.from(this.edges).map((n: [string, AlEdge]) => {
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
                value: ${dist.toFixed(Constants.angleUnitsDecimalPlaces) +
                  " m"};
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

  private _renderAngles() {
    return Array.from(this.angles).map((n: [string, AlAngle]) => {
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
                  Constants.angleUnitsDecimalPlaces
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

  private _renderLights() {
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

  private _renderCamera() {
    return (
      <a-camera
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls="enabled: false"
        far={Constants.cameraValues.far}
        id="mainCamera"
        cursor="rayOrigin: mouse"
        raycaster="objects: .collidable;"
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
        {/* {this._renderSpinner()} */}
      </a-camera>
    );
  }

  private _renderScene() {
    return (
      <a-scene
        embedded
        renderer="colorManagement: true; sortObjects: true;"
        vr-mode-ui="enabled: false"
        ref={el => (this._scene = el)}
      >
        {this._renderBackboard()}
        {this._renderSrc()}
        {this._renderBoundingBox()}
        {this._renderNodes()}
        {this._renderEdges()}
        {this._renderAngles()}
        {this._renderLights()}
        {this._renderCamera()}
      </a-scene>
    );
  }

  render() {
    return (
      <div
        id="al-container"
        style={{
          width: this.width,
          height: this.height
        }}
      >
        <div id="lut-container">
          <div id="lut-min">0.0</div>
          <div id="lut-canvases" />
          <div id="lut-max">1.0</div>
        </div>
        {this._renderScene()}
        {this._renderSpinner()}
      </div>
    );
  }
  //#endregion

  //#region Private Methods
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
    const match: [string, AlAngle] | undefined = Array.from(this.angles).find(
      ([_id, angle]) => {
        return (
          (angle.edge1Id === edge1Id && angle.edge2Id === edge2Id) ||
          (angle.edge1Id === edge2Id && angle.edge2Id === edge1Id)
        );
      }
    );
    if (!match) {
      let edge1 = this.edges.get(edge1Id);
      let edge2 = this.edges.get(edge2Id);

      if (
        edge1.node1Id === edge2.node1Id ||
        edge1.node1Id == edge2.node2Id ||
        edge1.node2Id == edge2.node1Id ||
        edge1.node2Id === edge2.node2Id
      ) {
        const newAngle: AlAngle = {
          edge1Id: edge1Id,
          edge2Id: edge2Id
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

  private _selectNode(nodeId: string, animate: boolean = false): void {
    if (animate && nodeId !== this.selected) {
      let animationStart = {
        position: this.camera.position.clone(),
        target: this.camera.target.clone()
      } as AlCamera;

      let animationEnd = {
        position: new THREE.Vector3(-1, -1, -1),
        target: this.camera.target.clone()
      } as AlCamera;

      let result: THREE.Vector3 = GetUtils.getCameraPositionFromNode(
        this.nodes.get(nodeId),
        this._boundingSphereRadius,
        this.camera.target
      );

      if (result) {
        const diffPos: number = result.distanceTo(this.camera.position);

        if (diffPos > 0) {
          animationEnd.position.copy(result.clone());

          const slerpPath: number[] = ThreeUtils.getSlerpPath(
            animationStart,
            animationEnd,
            diffPos > 0,
            false
          );

          this._scene.emit(
            AlOrbitControlEvents.ANIMATION_STARTED,
            { slerpPath },
            false
          );

          this.appSetCamera({
            animating: true
          });

          this.appSelectNode(nodeId);
          this._stateChanged();
        }
      }
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

  private _setGraphEnabled(enabled: boolean): void {
    this.appSetGraphEnabled(enabled);
    this._stateChanged();
  }

  private _setBoundingBoxVisible(visible: boolean): void {
    this.appSetBoundingBoxVisible(visible);
    this._stateChanged();
  }

  private _setSlicesIndex(index: number): void {
    this.appSetSlicesIndex(index);
    this._stateChanged();
  }

  private _setOrientation(orientation: Orientation): void {
    this.appSetOrientation(orientation);
    this._stateChanged();
  }

  private _setSlicesWindowCenter(center: number): void {
    this.appSetSlicesWindowCenter(center);
    this._stateChanged();
  }

  private _setSlicesWindowWidth(width: number): void {
    this.appSetSlicesWindowWidth(width);
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

  private _setSrc(src: string): void {
    this.appSetSrc(src);
    this._stateChanged();
  }

  private _srcLoaded(ev: any): void {
    const aframeMesh: THREE.Mesh = this._targetEntity.object3DMap
      .mesh as THREE.Mesh;

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        this._mesh = aframeMesh;
        this._volumeHelper = null;
        break;
      }
      case DisplayMode.SLICES: {
        this._mesh = ev.detail._bBox._mesh;
        this._volumeHelper = null;
        break;
      }
      case DisplayMode.VOLUME: {
        this._mesh = ev.detail._mesh;
        this._volumeHelper = ev.detail;
        break;
      }
    }

    this._mesh.geometry.computeBoundingSphere();
    this._boundingSphereRadius = this._mesh.geometry.boundingSphere.radius;
    this._boundingBox = GetUtils.getBoundingBox(this._mesh);

    let cameraState: AlCamera = GetUtils.getCameraStateFromMesh(this._mesh);

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
      let intersection: THREE.Intersection =
        event.detail.aframeEvent.detail.intersection;

      const nodeId: string = GraphUtils.getNextId(
        AlGraphEntryType.NODE,
        this.nodes
      );

      let newNode: AlNode;

      if (this.displayMode === DisplayMode.VOLUME && intersection) {
        let hitPosition = new THREE.Vector3();
        let hitNormal = new THREE.Vector3();

        let rayResult = AMIUtils.volumeRay(
          this._volumeHelper,
          this._camera.object3D.children[0].position.clone(),
          this._camera.getAttribute("raycaster").direction,
          Constants.cameraValues.far,
          hitPosition,
          hitNormal
        );

        if (rayResult) {
          newNode = {
            position: ThreeUtils.vector3ToString(hitPosition),
            scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
            text: nodeId
          };
        }
      } else if (intersection) {
        newNode = {
          targetId: "0",
          position: ThreeUtils.vector3ToString(intersection.point),
          scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
          text: nodeId
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

    if (intersection && this.displayMode === DisplayMode.VOLUME) {
      let hitPosition = new THREE.Vector3();
      let hitNormal = new THREE.Vector3();

      let rayResult = AMIUtils.volumeRay(
        this._volumeHelper,
        this._camera.object3D.children[0].position.clone(),
        this._camera.getAttribute("raycaster").direction,
        Constants.cameraValues.far,
        hitPosition,
        hitNormal
      );

      if (rayResult && intersection) {
        this._setNode([
          nodeId,
          {
            position: ThreeUtils.vector3ToString(hitPosition)
          }
        ]);
        const eventName = nodeId + Constants.movedEventString;
        this._scene.emit(eventName, {}, true);
      }
    } else if (intersection && this.displayMode !== DisplayMode.VOLUME) {
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

    this._scene.addEventListener(AlVolumeEvents.LOADED, this._srcLoaded, false);

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

//#region Imports
import {
  Component,
  Prop,
  State,
  Method,
  Event,
  EventEmitter
} from '@stencil/core';
import { Store, Action } from '@stencil/redux';
import { KeyDown } from '@edsilv/key-codes';
import '../../aframe';
import {
  AlGltfModelEvents,
  AlNodeSpawnerEvents,
  AlOrbitControlEvents
} from '../../aframe';
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
} from '../../redux/actions';
import { configureStore } from '../../redux/store';
import { AlNode, AlCamera, AlEdge, AlAngle } from '../../interfaces';
import {
  GetUtils,
  ThreeUtils,
  GraphUtils,
  AlGraphEvents,
  AMIUtils,
  EventUtils
} from '../../utils';
import { Constants } from '../../Constants';
import { Orientation, DisplayMode } from '../../enums';
import { AlGraphEntryType } from '../../enums';
import { AlGraph } from '../../interfaces/AlGraph';
import { AlVolumeEvents } from '../../aframe/components/AlVolumeComponent';

type Entity = import('aframe').Entity;
type Scene = import('aframe').Scene;
//#endregion

@Component({
  tag: 'uv-aleph',
  styleUrl: 'aleph.css',
  shadow: false
})
export class Aleph {
  //#region Private variables
  private _boundingBox: THREE.Box3;
  private _boundingSphereRadius: number;
  private _camera: Entity;
  private _debouncedAppSetCamera: (state: AlCamera) => void;
  private _hovered: string | null = null;
  private _isShiftDown: boolean = false;
  private _isWebGl2: boolean = true;
  private _loadedObject: any;
  private _scene: Scene;
  private _targetEntity: Entity;
  private _validTarget: boolean;
  private _boundingEntity: Entity;
  private _lights: Entity[];

  @Prop({ context: 'store' }) store: Store;
  @Prop() dracoDecoderPath: string | null;
  @Prop() width: string = '640';
  @Prop() height: string = '480';

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
  appSetBoundingBoxEnabled: Action;
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
  @State() boundingBoxEnabled: boolean;
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
  async load(src: string, displayMode?: DisplayMode): Promise<void> {
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
  async resize(): Promise<void> {
    this._resize();
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

  /** Creates or updates an edge in the graph */
  @Method()
  async setEdge(edge: [string, AlEdge]): Promise<void> {
    this._setEdge(edge);
  }
  //#endregion

  //#region control panel methods

  @Method()
  async recenter(): Promise<void> {
    this._recenter();
  }

  @Method()
  async setDisplayMode(displayMode: DisplayMode): Promise<void> {
    this._setDisplayMode(displayMode);
  }

  @Method()
  async setGraphEnabled(enabled: boolean): Promise<void> {
    this._setGraphEnabled(enabled);
  }

  @Method()
  async setBoundingBoxEnabled(visible: boolean): Promise<void> {
    this._setBoundingBoxEnabled(visible);
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

  /** Fires whenever the internal state changes passing an object describing the state. */
  @Event() changed: EventEmitter;

  /** Fires when an object is loaded passing either the object or a stackhelper for volumetric data. */
  @Event() loaded: EventEmitter;

  componentWillLoad() {
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
        boundingBoxEnabled,
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
      appSetBoundingBoxEnabled,
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
    this._spawnNodeHandler = this._spawnNodeHandler.bind(this);
    this._srcLoaded = this._srcLoaded.bind(this);

    // debounced event handlers
    this._debouncedAppSetCamera = EventUtils.debounce(
      this.appSetCamera,
      Constants.minFrameMS
    ).bind(this);

    this._lights = [];
  }

  private _renderSpinner() {
    if (this.src && !this.srcLoaded) {
      return (
        <div id='spinner'>
          <div class='square' />
        </div>
      );
    }
  }

  private _renderSrc() {
    if (!this.src) {
      return null;
    }

    switch (this.displayMode) {
      case DisplayMode.MESH: {
        return (
          <a-entity
            class='collidable'
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            al-gltf-model={`
              src: url(${this.src});
              dracoDecoderPath: ${this.dracoDecoderPath};
            `}
            position='0 0 0'
            scale='1 1 1'
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
      case DisplayMode.SLICES: {
        return (
          <a-entity
            id='target-entity'
            class='collidable'
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
              isWebGl2: ${this._isWebGl2};
            `}
            position='0 0 0'
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
      case DisplayMode.VOLUME: {
        return (
          <a-entity
            id='target-entity'
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
              isWebGl2: ${this._isWebGl2};
            `}
            position='0 0 0'
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
    }
  }

  private _renderBoundingBox() {
    if (this.srcLoaded && this.boundingBoxEnabled) {
      let size: THREE.Vector3 = new THREE.Vector3();
      this._boundingBox.getSize(size);

      // if targetEntity is a gltf, use its position (center). if it's a volume, the origin is in the bottom left, so get the position sub the geometry center
      let position: THREE.Vector3;

      switch (this.displayMode) {
        case DisplayMode.MESH: {
          position = this._targetEntity.object3D.position.clone();
          break;
        }
        case DisplayMode.VOLUME:
        case DisplayMode.SLICES: {
          position = this._targetEntity.object3D.position
            .clone()
            .add(GetUtils.getGeometryCenter(this._getMesh().geometry));
          break;
        }
      }

      if (this.displayMode === DisplayMode.VOLUME) {
        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${Constants.colorValues.red};
            `}
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            class='collidable'
            ref={el => (this._boundingEntity = el)}
          />
        );
      } else {
        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${Constants.colorValues.red};
            `}
            ref={el => (this._boundingEntity = el)}
          />
        );
      }
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
          class='collidable'
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
              value: ${node.title};
              side: double;
              align: center;
              baseline: bottom;
              anchor: center;
              width: ${Constants.fontSizeMedium * this._boundingSphereRadius}
            `}
            al-look-to-camera
            al-render-overlaid
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
            class='collidable'
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
                  (this.displayMode === DisplayMode.MESH ? 'm' : 'mm')};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSizeSmall * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              visible={`${this.selected === edgeId}`}
              al-look-to-camera
              al-render-overlaid
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

        // get the edge with the smallest length
        // set the distance from the connecting node to be 20% of the smallest length, unless it exceeds a max
        const smallestLength: number = Math.min(
          centralPos.distanceTo(node1Pos),
          centralPos.distanceTo(node2Pos)
        );

        let distanceFromCentralNode: number = Math.min(
          smallestLength * 0.25,
          radius * 25
        );

        distanceFromCentralNode = Math.max(
          distanceFromCentralNode,
          radius * 10
        );

        let edge1Pos: THREE.Vector3 = dir1
          .clone()
          .multiplyScalar(distanceFromCentralNode);
        let edge2Pos: THREE.Vector3 = dir2
          .clone()
          .multiplyScalar(distanceFromCentralNode);
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
            class='collidable'
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
                ) + ' deg'};
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
              al-render-overlaid
            />
          </a-entity>
        );
      }
    });
  }

  private _renderLights() {
    return [
      <a-entity
        id='light-1'
        light='type: directional; color: #ffffff; intensity: 0.5'
        position='1 1 1'
        ref={el => (this._lights[0] = el)}
      />,
      <a-entity
        id='light-2'
        light='type: directional; color: #ffffff; intensity: 0.5'
        position='-1 -1 -1'
        ref={el => (this._lights[1] = el)}
      />,
      <a-entity
        id='light-3'
        light='type: ambient; color: #d0d0d0; intensity: 1'
      />
    ];
  }

  private _renderCamera() {
    return [
      <a-camera
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls='enabled: false'
        far={Constants.cameraValues.far}
        id='mainCamera'
        cursor='rayOrigin: mouse'
        raycaster='objects: .collidable;'
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
      />,
      this._renderLights()
    ];
  }

  private _renderScene() {
    return (
      <a-scene
        embedded
        renderer={`
          colorManagement: true;
          sortObjects: true;
          webgl2: ${this._isWebGl2};
          antialias: true;
        `}
        vr-mode-ui='enabled: false'
        ref={el => (this._scene = el)}
      >
        {this._renderBoundingBox()}
        {this._renderSrc()}
        {this._renderNodes()}
        {this._renderEdges()}
        {this._renderAngles()}
        {this._renderCamera()}
      </a-scene>
    );
  }

  render() {
    return (
      <div
        id='al-container'
        style={{
          width: GetUtils.addCssUnits(this.width),
          height: GetUtils.addCssUnits(this.height)
        }}
      >
        <div id='lut-container'>
          <div id='lut-min'>0.0</div>
          <div id='lut-canvases' />
          <div id='lut-max'>1.0</div>
        </div>
        {this._renderScene()}
        {this._renderSpinner()}
      </div>
    );
  }
  //#endregion

  //#region Private Methods

  private _resize(): void {
    if (this._scene) {
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
        node1Id: node1Id,
        node2Id: node2Id
      };
      const edgeId: string = GraphUtils.getNextId(
        AlGraphEntryType.EDGE,
        this.edges
      );

      this._setEdge([edgeId, newEdge]);
    } else {
      console.log('edge already exists');
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
        console.warn('cannot create angle: edges not connected');
      }
    } else {
      console.warn('cannot create angle: angle already exists');
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

  private _animateBetween(
    animationStart: AlCamera,
    animationEndVec3: THREE.Vector3
  ): void {
    let animationEnd = {
      position: animationEndVec3,
      target: this.camera.target.clone()
    } as AlCamera;

    if (animationEndVec3) {
      const diffPos: number = animationEndVec3.distanceTo(this.camera.position);

      if (diffPos > 0) {
        animationEnd.position.copy(animationEndVec3.clone());

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

        this._stateChanged();
      }
    }
  }

  private _selectNode(nodeId: string | null, animate: boolean = false): void {
    if (animate && nodeId !== this.selected) {
      let animationStart = {
        position: this.camera.position.clone(),
        target: this.camera.target.clone()
      } as AlCamera;

      let animationEndVec3: THREE.Vector3 = GetUtils.getCameraPositionFromNode(
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
    let cameraState: AlCamera = GetUtils.getCameraStateFromMesh(
      this._getMesh()
    );

    let animationStart = {
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

  private _setGraphEnabled(enabled: boolean): void {
    this.appSetGraphEnabled(enabled);
    this._stateChanged();
  }

  private _setBoundingBoxEnabled(visible: boolean): void {
    this.appSetBoundingBoxEnabled(visible);
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

  private _setSrc(src: string, displayMode?: DisplayMode): void {
    this.appSetSrc([src, displayMode]);
    this._stateChanged();
  }

  private _getStackHelper(): AMI.VolumeRenderHelper | null {
    let stackhelper: AMI.VolumeRenderHelper | null = null;

    if (this.displayMode === DisplayMode.VOLUME) {
      stackhelper = this._loadedObject;
    }

    return stackhelper;
  }

  private _getMesh(): THREE.Mesh | null {
    let mesh: THREE.Mesh | null = null;

    if (this.displayMode == DisplayMode.MESH) {
      const model = this._targetEntity.object3DMap.mesh;

      if (model instanceof THREE.Mesh) {
        mesh = model;
      } else {
        model.traverse(child => {
          if (child instanceof THREE.Mesh && mesh === null) {
            mesh = child;
            return mesh;
          }
        });
      }
    } else if (this._loadedObject._bBox) {
      mesh = this._loadedObject._bBox._mesh;
    } else {
      mesh = this._loadedObject._mesh;
    }

    return mesh;
  }

  private _srcLoaded(ev: any): void {
    this._loadedObject = ev.detail;

    let mesh: THREE.Mesh | null = this._getMesh();

    if (mesh) {
      // Compute the bounding sphere of the mesh
      mesh.geometry.computeBoundingSphere();
      //console.log('bounding center: ', mesh.geometry.boundingSphere.center);
      this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;
      this._boundingBox = GetUtils.getBoundingBox(mesh);
      this._boundingBox.translate(mesh.geometry.boundingSphere.center);

      let cameraState: AlCamera = GetUtils.getCameraStateFromMesh(mesh);

      if (cameraState) {
        this.appSetCamera(cameraState);
      }

      this.appSetSrcLoaded(true);
      this._stateChanged();
      this.loaded.emit(ev.detail);
    } else {
      throw new Error('Unable to find a mesh in loaded object');
    }
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
    ThreeUtils.enableOrbitControls(this._camera, true);
  }

  private _graphEntryPointerDownHandler(_event: CustomEvent): void {
    this.appSetControlsEnabled(false);
    ThreeUtils.enableOrbitControls(this._camera, false);
  }

  private _graphEntryPointerOutHandler(_event: CustomEvent): void {
    this._hovered = null;
  }

  private _graphEntryPointerOverHandler(event: CustomEvent): void {
    this._hovered = event.detail.id;
  }

  private _controlsInteractionHandler(event: CustomEvent): void {
    let cameraState = event.detail.cameraState as AlCamera;
    this._updateLights(cameraState);
  }

  private _updateLights(cameraState: AlCamera) {
    if (this.displayMode === DisplayMode.MESH) {
      this._lights.forEach(light => {
        let direction = cameraState.position.clone().normalize();
        light.object3D.position.copy(direction);
      });
    }
  }

  private _controlsInteractionFinishedHandler(event: CustomEvent): void {
    let cameraState = event.detail.cameraState as AlCamera;
    this._debouncedAppSetCamera(cameraState);
    // this._lightController.setAttribute(
    //   "position",
    //   ThreeUtils.vector3ToString(cameraState.position)
    // );
  }

  private _spawnNodeHandler(event: CustomEvent): void {
    // IF creating a new node and NOT intersecting an existing node
    if (
      this.graphEnabled && // Nodes are enabled
      this._validTarget && // Target is valid
      this._hovered === null // Not intersecting a Node already
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
          this._getStackHelper(),
          this._camera.object3D.children[0].position.clone(),
          this._camera.getAttribute('raycaster').direction,
          Constants.cameraValues.far,
          hitPosition,
          hitNormal
        );

        if (rayResult) {
          newNode = {
            position: ThreeUtils.vector3ToString(hitPosition),
            scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
            title: nodeId
          };
        }
      } else if (intersection) {
        newNode = {
          targetId: '0',
          position: ThreeUtils.vector3ToString(intersection.point),
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
    }
  }

  private _graphEntryDraggedHandler(event: CustomEvent): void {
    const nodeId: string = event.detail.id;
    const raycaster = this._camera.components.raycaster as any;
    const raycasterAttribute = this._camera.getAttribute('raycaster');
    let intersection;
    let hitPosition = new THREE.Vector3();
    let validLocation = false;
    let orbitPosition = this._camera.object3D.children[0].position;

    if (this.displayMode === DisplayMode.VOLUME) {
      // First try bounding box
      intersection = raycaster.getIntersection(
        this._boundingEntity
      ) as THREE.Intersection;

      if (intersection) {
        let hitNormal = new THREE.Vector3();

        let rayResult = AMIUtils.volumeRay(
          this._getStackHelper(),
          orbitPosition.clone(),
          raycasterAttribute.direction,
          Constants.cameraValues.far,
          hitPosition,
          hitNormal
        );

        if (rayResult) {
          validLocation = true;
        }
      }
    } else {
      // First try target
      intersection = raycaster.getIntersection(
        this._targetEntity
      ) as THREE.Intersection;

      if (intersection) {
        hitPosition.copy(intersection.point);
        validLocation = true;
      }
    }

    // IF not a valid location, dangle in space
    if (!validLocation) {
      let distance = orbitPosition.distanceTo(
        this._targetEntity.getAttribute('position')
      );

      hitPosition.copy(orbitPosition);
      hitPosition.add(
        raycasterAttribute.direction.clone().multiplyScalar(distance * 1.5)
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

    // let geom = new THREE.Geometry();
    // geom.vertices.push(raycasterAttribute.origin);
    // geom.vertices.push(raycasterAttribute.direction.multiplyScalar(100));

    // (this._scene.object3D as THREE.Scene).add(
    //   new THREE.Line(geom, new THREE.LineBasicMaterial())
    // );
  }

  private _addEventListeners(): void {
    window.addEventListener('keydown', this._keyDownHandler, false);
    window.addEventListener('keyup', this._keyUpHandler, false);

    this._scene.addEventListener(
      AlOrbitControlEvents.ANIMATION_FINISHED,
      this._controlsAnimationFinishedHandler,
      false
    );

    this._scene.addEventListener(
      AlOrbitControlEvents.INTERACTION, // todo: make this a more generic event
      this._controlsInteractionHandler,
      false
    );

    this._scene.addEventListener(
      AlOrbitControlEvents.INTERACTION_FINISHED, //todo: make this a more generic event
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
      this._srcLoaded,
      false
    );

    this._scene.addEventListener(AlVolumeEvents.LOADED, this._srcLoaded, false);

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

  componentDidLoad() {}

  componentDidUpdate() {
    if (this._scene) {
      this._addEventListeners();
    }
  }
}

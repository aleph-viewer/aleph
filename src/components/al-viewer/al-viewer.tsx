import { KeyDown } from "@edsilv/key-codes";
import { Action, Store } from "@edsilv/stencil-redux";
import "@edsilv/stencil-redux";
import {
  Component,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State
} from "@stencil/core";
import "../../aframe";
import { AlGltfModelEvents, AlNodeSpawnerEvents } from "../../aframe";
import { AlVolumeEvents } from "../../aframe/components/AlVolumeComponent";
import { Constants } from "../../Constants";
import {
  AlGraphEntryType,
  ControlsType,
  DisplayMode,
  Material,
  Orientation,
  Units
} from "../../enums";
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
  appSetSlicesWindowCenter,
  appSetSlicesWindowWidth,
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
  AMIUtils,
  EventUtils,
  GetUtils,
  GraphUtils,
  ThreeUtils
} from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";

type Entity = import("aframe").Entity;
type Scene = import("aframe").Scene;
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
  private _camera: Entity;
  private _debouncedAppSetCamera: (state: AlCamera) => void;
  private _hovered: string | null = null;
  private _isShiftDown: boolean = false;
  private _isWebGl2: boolean = true;
  // tslint:disable-next-line: no-any
  private _loadedObject: any;
  private _scene: Scene;
  private _targetEntity: Entity;
  private _validTarget: boolean;
  private _boundingEntity: Entity;
  private _lights: Entity[];
  //#endregion

  //#region props
  @Prop({ context: "store" }) public store: Store;
  @Prop() public dracoDecoderPath: string | null;
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
  public appSetSlicesWindowCenter: Action;
  public appSetSlicesWindowWidth: Action;
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
  @State() public slicesWindowCenter: number;
  @State() public slicesWindowWidth: number;
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
  public async setSlicesWindowCenter(center: number): Promise<void> {
    this._setSlicesWindowCenter(center);
  }

  @Method()
  public async setSlicesWindowWidth(width: number): Promise<void> {
    this._setSlicesWindowWidth(width);
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
  public async setVolumeWindowCenter(center: number): Promise<void> {
    this._setVolumeWindowCenter(center);
  }

  @Method()
  public async setVolumeWindowWidth(width: number): Promise<void> {
    this._setVolumeWindowWidth(width);
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
          slicesWindowCenter,
          slicesWindowWidth,
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
        slicesWindowCenter,
        slicesWindowWidth,
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
      appSetSlicesWindowCenter,
      appSetSlicesWindowWidth,
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
        <div id="spinner">
          <div class="square" />
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
      case DisplayMode.SLICES: {
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
              isWebGl2: ${this._isWebGl2};
            `}
            position="0 0 0"
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
      // This is seperate from the slice entity as it will store the volume render,
      // preventing long load times when switching mode
      // Node spawner is on the bounding box in
      // volume mode; as the "volume" is in a different scene
      case DisplayMode.VOLUME: {
        return (
          <a-entity
            id="target-entity"
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
            position="0 0 0"
            ref={(el: Entity) => (this._targetEntity = el)}
          />
        );
      }
      default: {
        return;
      }
    }
  }

  private _renderBoundingBox() {
    if (this.srcLoaded) {
      const size: THREE.Vector3 = new THREE.Vector3();
      this._boundingBox.getSize(size);
      const mesh = this._getMesh();

      if (!mesh) { return null; }

      const meshGeom = mesh.geometry;
      let position: THREE.Vector3;

      let opacity;
      if (this.boundingBoxEnabled) {
        opacity = 1;
      } else {
        opacity = 0;
      }

      if (this.displayMode === DisplayMode.VOLUME) {
        position = this._targetEntity.object3D.position
          .clone()
          .add(GetUtils.getGeometryCenter(meshGeom));

        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
              scale: ${ThreeUtils.vector3ToString(size)};
              color: ${Constants.colorValues.white};
              opacity: ${opacity};
            `}
            al-node-spawner={`
              graphEnabled: ${this.graphEnabled};
            `}
            class="collidable"
            ref={el => (this._boundingEntity = el)}
          />
        );
      } else {
        switch (this.displayMode) {
          case DisplayMode.MESH: {
            if (this._boundingBox.intersectsBox(meshGeom.boundingBox)) {
              // Check if mesh intersects bounding box; if it does apply the offset
              const offset = meshGeom.boundingSphere.center.clone();
              position = this._targetEntity.object3D.position
                .clone()
                .add(offset);
            } else {
              position = this._targetEntity.object3D.position.clone();
            }
            break;
          }
          case DisplayMode.SLICES: {
            position = this._targetEntity.object3D.position
              .clone()
              .add(GetUtils.getGeometryCenter(meshGeom));
            break;
          }
          default: {
            break;
          }
        }

        return (
          <a-entity
            position={ThreeUtils.vector3ToString(position)}
            al-bounding-box={`
                scale: ${ThreeUtils.vector3ToString(size)};
                color: ${Constants.colorValues.white};
                opacity: ${opacity};
              `}
            ref={el => (this._boundingEntity = el)}
          />
        );
      }
    }
  }

  private _renderNodes() {
    return Array.from(this.nodes).map((n: [string, AlNode]) => {
      const [nodeId, node] = n;
      const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
        this._scene.camera,
        ThreeUtils.stringToVector3(node.position),
        this.camera.position
      );
      const entityScale =
        (frustrumDistance / this._boundingSphereRadius) *
        Constants.frustrumScaleFactor;

      const textOffset: THREE.Vector3 = new THREE.Vector3(0, 4, 0);
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
          scale={` ${entityScale} ${entityScale} ${entityScale};`}
        >
          <a-entity
            text={`
              value: ${node.title};
              side: double;
              align: center;
              baseline: bottom;
              anchor: center;
              width: ${Constants.fontSizeMedium * this._boundingSphereRadius};
              zOffset: ${0.0000001};
            `}
            position={ThreeUtils.vector3ToString(textOffset)}
            al-render-overlaid
            visible={`${this.selected === nodeId}`}
            id={`${nodeId}-label`}
            al-billboard-baggins={`
              controlsType: ${this.controlsType};
              cameraPosition: ${ThreeUtils.vector3ToString(
                this.camera.position
              )};
              worldPosition: ${ThreeUtils.vector3ToString(
                ThreeUtils.stringToVector3(node.position).add(textOffset)
              )}
            `}
            al-background={`
                text: ${node.title};
                boundingRadius: ${Constants.fontSizeMedium *
                  this._boundingSphereRadius};
            `}
          ></a-entity>
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
        const dist = dir.length();
        dir = dir.normalize().multiplyScalar(dist * 0.5);
        const centoid = sv.clone().add(dir);

        const textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        const scale = (node1.scale + node2.scale) / 2;
        const radius = this._boundingSphereRadius * Constants.edgeSize;
        textOffset.multiplyScalar(scale);

        const textV = this._convertUnits(dist);

        const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
          this._scene.camera,
          centoid.clone(),
          this.camera.position
        );
        const entityScale =
          (frustrumDistance / this._boundingSphereRadius) *
          Constants.frustrumScaleFactor;

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
              scale: ${entityScale};
            `}
          >
            <a-entity
              id={`${edgeId}-title`}
              text={`
                value: ${textV};
                side: double;
                align: center;
                baseline: bottom;
                anchor: center;
                width: ${Constants.fontSizeSmall * this._boundingSphereRadius}
              `}
              position={ThreeUtils.vector3ToString(textOffset)}
              visible={`${this.selected === edgeId}`}
              scale={` ${entityScale} ${entityScale} ${entityScale};`}
              al-billboard-baggins={`
                controlsType: ${this.controlsType};
                cameraPosition: ${ThreeUtils.vector3ToString(
                  this.camera.position
                )};
                worldPosition: ${ThreeUtils.vector3ToString(
                  centoid.clone().add(textOffset.clone())
                )};
              `}
              al-background={`
                  text: ${textV};
                  boundingRadius: ${Constants.fontSizeSmall *
                    this._boundingSphereRadius};
              `}
              al-render-overlaid
            ></a-entity>
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
        const radius = this._boundingSphereRadius * Constants.edgeSize;
        const node1Pos = ThreeUtils.stringToVector3(node1.position);
        const node2Pos = ThreeUtils.stringToVector3(node2.position);
        const centralPos = ThreeUtils.stringToVector3(centralNode.position);

        const dir1: THREE.Vector3 = node1Pos
          .clone()
          .sub(centralPos)
          .normalize();
        const dir2: THREE.Vector3 = node2Pos
          .clone()
          .sub(centralPos)
          .normalize();
        const angl = dir2.angleTo(dir1);

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

        const edge1Pos: THREE.Vector3 = dir1
          .clone()
          .multiplyScalar(distanceFromCentralNode);
        const edge2Pos: THREE.Vector3 = dir2
          .clone()
          .multiplyScalar(distanceFromCentralNode);
        const length = edge1Pos.clone().distanceTo(edge2Pos.clone());
        const position: THREE.Vector3 = edge1Pos
          .clone()
          .add(edge2Pos.clone())
          .divideScalar(2);

        const textOffset: THREE.Vector3 = new THREE.Vector3(0, 2.5, 0);
        const scale = (node1.scale + node2.scale + centralNode.scale) / 3;
        textOffset.multiplyScalar(scale);

        const textV =
          THREE.Math.radToDeg(angl).toFixed(Constants.unitsDecimalPlaces) +
          " deg";

        const frustrumDistance = ThreeUtils.getFrustrumSpaceDistance(
          this._scene.camera,
          centralPos.clone(),
          this.camera.position
        );
        const entityScale =
          (frustrumDistance / this._boundingSphereRadius) *
          Constants.frustrumScaleFactor;

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
              scale: ${entityScale};
            `}
          >
            <a-entity
              id={`${angleId}-title`}
              scale={` ${entityScale} ${entityScale} ${entityScale};`}
              text={`
                value: ${textV};
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
              al-billboard-baggins={`
                controlsType: ${this.controlsType};
                cameraPosition: ${ThreeUtils.vector3ToString(
                  this.camera.position
                )};
                worldPosition: ${ThreeUtils.vector3ToString(
                  ThreeUtils.stringToVector3(centralNode.position).add(
                    textOffset.clone()
                  )
                )};
              `}
              al-background={`
                text: ${textV};
                boundingRadius: ${Constants.fontSizeSmall *
                  this._boundingSphereRadius};
              `}
              al-render-overlaid
            ></a-entity>
          </a-entity>
        );
      }
    });
  }

  private _renderLights() {
    return [
      <a-entity
        id="light-1"
        light="type: directional; color: #ffffff; intensity: 0.5"
        position="1 1 1"
        ref={el => (this._lights[0] = el)}
      />,
      <a-entity
        id="light-2"
        light="type: directional; color: #ffffff; intensity: 0.5"
        position="-1 -1 -1"
        ref={el => (this._lights[1] = el)}
      />,
      <a-entity
        id="light-3"
        light="type: ambient; color: #d0d0d0; intensity: 1"
      />
    ];
  }

  // tslint:disable-next-line: no-any
  private _renderOrbitCamera(): any {
    return (
      <a-camera
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls="enabled: false"
        far={Constants.cameraValues.far}
        id="mainCamera"
        al-cursor="rayOrigin: mouse"
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
      />
    );
  }

  // tslint:disable-next-line: no-any
  private _renderTrackballCamera(): any {
    return (
      <a-camera
        fov={Constants.cameraValues.fov}
        near={Constants.cameraValues.near}
        look-controls="enabled: false"
        far={Constants.cameraValues.far}
        id="mainCamera"
        al-cursor="rayOrigin: mouse"
        raycaster="objects: .collidable;"
        al-trackball-control={`
          screenLeft: ${0};
          screenTop: ${0};
          screenWidth: ${this._scene ? this._scene.canvas.width : 0};
          screenHeight: ${this._scene ? this._scene.canvas.height : 0};
          rotateSpeed: ${Constants.cameraValues.rotateSpeed * 5};
          zoomSpeed: ${Constants.cameraValues.zoomSpeed * 5};
          panSpeed: ${Constants.cameraValues.panSpeed};
          dynamicDampingFactor: ${Constants.cameraValues.dampingFactor};
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
      />
    );
  }

  private _renderControls() {
    switch (this.controlsType) {
      case ControlsType.TRACKBALL: {
        return this._renderTrackballCamera();
      }
      case ControlsType.ORBIT: {
        return this._renderOrbitCamera();
      }
      default: {
        return null;
      }
    }
  }

  private _renderCamera() {
    return [this._renderControls(), this._renderLights()];
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
        vr-mode-ui="enabled: false"
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

  public render() {
    return (
      <div
        id="al-container"
        class={this.displayMode}
        style={{
          width: GetUtils.addCssUnits(this.width),
          height: GetUtils.addCssUnits(this.height)
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

  private _resize(): void {
    if (this._scene) {
      // tslint:disable-next-line: no-any
      (this._scene as any).resize();
    }
  }

  private _convertUnits(dist: number): string {
    if (this.displayMode === DisplayMode.MESH) {
      // if in mesh mode, units are always meters by default
      switch (this.units) {
        case Units.METERS: {
          return dist.toFixed(Constants.unitsDecimalPlaces) + this.units;
        }
        case Units.MILLIMETERS: {
          // convert m to mm
          return (
            (dist / 0.001).toFixed(Constants.unitsDecimalPlaces) + this.units
          );
        }
        default: {
          break;
        }
      }
    } else {
      // if in volume mode, units are always millimeters by default
      switch (this.units) {
        case Units.METERS: {
          // convert mm to m
          return (
            (dist / 1000.0).toFixed(Constants.unitsDecimalPlaces) + this.units
          );
        }
        case Units.MILLIMETERS: {
          return dist.toFixed(Constants.unitsDecimalPlaces) + this.units;
        }
        default: {
          break;
        }
      }
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
    } else {
      // tslint:disable-next-line: no-console
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
    const defaultCamera: AlCamera = GetUtils.getCameraStateFromMesh(
      this._getMesh()
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

      const animationEndVec3: THREE.Vector3 = GetUtils.getCameraPositionFromNode(
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
    const cameraState: AlCamera = GetUtils.getCameraStateFromMesh(
      this._getMesh()
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

  private _setSlicesWindowCenter(center: number): void {
    this.appSetSlicesWindowCenter(center);
    this._stateChanged();
  }

  private _setSlicesWindowWidth(width: number): void {
    this.appSetSlicesWindowWidth(width);
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

  private _getStackHelper(): AMI.VolumeRenderHelper | null {
    let stackhelper: AMI.VolumeRenderHelper | null = null;

    if (this.displayMode === DisplayMode.VOLUME) {
      stackhelper = this._loadedObject;
    }

    return stackhelper;
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
    } else if (this._loadedObject._bBox) {
      mesh = this._loadedObject._bBox._mesh;
    } else {
      mesh = this._loadedObject._mesh;
    }

    return mesh;
  }

  // tslint:disable-next-line: no-any
  private _srcLoaded(ev: any): void {
    this._loadedObject = ev.detail;

    const mesh: THREE.Mesh | null = this._getMesh();

    if (mesh) {
      // Compute the bounding sphere of the mesh
      mesh.geometry.computeBoundingSphere();
      mesh.geometry.computeBoundingBox();
      this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;
      this._boundingBox = GetUtils.getBoundingBox(mesh);
      const cameraState: AlCamera = GetUtils.getCameraStateFromMesh(mesh);
      this._updateLights(cameraState);

      if (cameraState) {
        this.appSetCamera(cameraState);
      }

      this.appSetSrcLoaded(true);
      this._stateChanged();
      this.loaded.emit(ev.detail);
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
    const cameraState = event.detail.cameraState as AlCamera;
    this._updateLights(cameraState);
  }

  private _updateLights(cameraState: AlCamera) {
    if (this.displayMode === DisplayMode.MESH) {
      this._lights.forEach(light => {
        const direction = cameraState.position.clone().normalize();
        light.object3D.position.copy(direction);
      });
    }
  }

  private _controlsInteractionFinishedHandler(event: CustomEvent): void {
    const cameraState = event.detail.cameraState as AlCamera;
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
      const intersection: THREE.Intersection =
        event.detail.aframeEvent.detail.intersection;

      const nodeId: string = GraphUtils.getNextId(
        AlGraphEntryType.NODE,
        this.nodes
      );

      let newNode: AlNode;

      if (this.displayMode === DisplayMode.VOLUME && intersection) {
        const hitPosition = new THREE.Vector3();
        const hitNormal = new THREE.Vector3();

        const rayResult = AMIUtils.volumeRay(
          this._getStackHelper(),
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
            title: nodeId
          };
        }
      } else if (intersection) {
        newNode = {
          targetId: "0",
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
    let intersection;
    const hitPosition = new THREE.Vector3();
    let validLocation = false;
    const orbitPosition = this._camera.object3D.children[0].position;

    if (this.displayMode === DisplayMode.VOLUME) {
      // First try bounding box
      intersection = raycaster.getIntersection(
        this._boundingEntity
      ) as THREE.Intersection;

      if (intersection) {
        const hitNormal = new THREE.Vector3();

        const rayResult = AMIUtils.volumeRay(
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
      const distance = orbitPosition.distanceTo(
        this._targetEntity.getAttribute("position")
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
    window.addEventListener("keydown", this._keyDownHandler, false);
    window.addEventListener("keyup", this._keyUpHandler, false);

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

  public componentDidUpdate() {
    if (this._scene) {
      this._addEventListeners();
    }
  }
}

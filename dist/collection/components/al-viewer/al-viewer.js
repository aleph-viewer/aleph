import { KeyDown } from "@edsilv/key-codes";
import { h } from "@stencil/core";
import "../../aframe";
import { AlGltfModelEvents, AlNodeSpawnerEvents } from "../../aframe";
import { AlVolumeCastType, AlVolumeEvents } from "../../aframe/components/AlVolumeComponent";
import { Constants } from "../../Constants";
import { AlGraphEntryType, ControlsType, DisplayMode } from "../../enums";
import { Angles, BoundingBox, Edges, Lights, Nodes, OrbitCamera, Scene, Src, TrackballCamera } from "../../functional-components/aframe";
import { appClearAngles, appClearEdges, appClearNodes, appDeleteAngle, appDeleteEdge, appDeleteNode, appSelectAngle, appSelectEdge, appSelectNode, appSetAngle, appSetBoundingBoxEnabled, appSetCamera, appSetControlsEnabled, appSetControlsType, appSetDisplayMode, appSetEdge, appSetGraphEnabled, appSetMaterial, appSetNode, appSetOrientation, appSetSlicesIndex, appSetSlicesMaxIndex, appSetSrc, appSetSrcLoaded, appSetUnits, appSetVolumeSteps, appSetVolumeWindowCenter, appSetVolumeWindowWidth } from "../../redux/actions";
import { configureStore } from "../../redux/store";
import { AlGraphEvents, EventUtils, GraphUtils, ThreeUtils, Utils } from "../../utils";
import { AlControlEvents } from "../../utils/AlControlEvents";
//#endregion
export class Aleph {
    constructor() {
        this._hovered = null;
        this._isShiftDown = false;
        this._isWebGl2 = true;
        this.width = "640";
        this.height = "480";
    }
    //#endregion
    //#region general methods
    async load(src, displayMode) {
        // validate
        if (this.src) {
            this._setSrc(null); // shows loading spinner and resets gltf-model
            setTimeout(() => {
                this._setSrc(src, displayMode);
            }, Constants.minLoadingMS);
        }
        else {
            this._setSrc(src, displayMode);
        }
    }
    async resize() {
        this._resize();
    }
    //#endregion
    //#region node methods
    async setNode(node) {
        this._setNode(node);
    }
    async setGraph(graph) {
        this._setGraph(graph);
    }
    async deleteNode(nodeId) {
        this._deleteNode(nodeId);
    }
    async clearGraph() {
        this._clearGraph();
    }
    async selectNode(nodeId) {
        this._selectNode(nodeId, true);
    }
    async deleteEdge(edgeId) {
        this._deleteEdge(edgeId);
    }
    async deleteAngle(angleId) {
        this._deleteAngle(angleId);
    }
    //#endregion
    //#region Edge Methods
    /** Creates or updates an edge in the graph */
    async setEdge(edge) {
        this._setEdge(edge);
    }
    //#endregion
    //#region control panel methods
    async recenter() {
        this._recenter();
    }
    async setBoundingBoxEnabled(visible) {
        this._setBoundingBoxEnabled(visible);
    }
    async setDisplayMode(displayMode) {
        this._setDisplayMode(displayMode);
    }
    async setControlsEnabled(enabled) {
        this._setControlsEnabled(enabled);
    }
    async setControlsType(type) {
        this._setControlsType(type);
    }
    async setGraphEnabled(enabled) {
        this._setGraphEnabled(enabled);
    }
    async setMaterial(material) {
        this._setMaterial(material);
    }
    async setOrientation(orientation) {
        this._setOrientation(orientation);
    }
    async setSlicesIndex(index) {
        this._setSlicesIndex(index);
    }
    async setUnits(units) {
        this._setUnits(units);
    }
    async setVolumeSteps(steps) {
        this._setVolumeSteps(steps);
    }
    async setVolumeBrightness(brightness) {
        this._setVolumeWindowCenter(brightness);
    }
    async setVolumeContrast(contrast) {
        this._setVolumeWindowWidth(contrast);
    }
    //#endregion
    async componentWillLoad() {
        this._isWebGl2 = ThreeUtils.isWebGL2Available();
        // redux
        this.store.setStore(configureStore({}));
        this.store.mapStateToProps(this, state => {
            const { app: { angles, boundingBoxEnabled, camera, controlsEnabled, controlsType, displayMode, edges, graphEnabled, material, nodes, orientation, selected, slicesIndex, slicesMaxIndex, src, srcLoaded, units, volumeSteps, volumeWindowCenter, volumeWindowWidth } } = state;
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
        this._controlsAnimationFinishedHandler = this._controlsAnimationFinishedHandler.bind(this);
        this._controlsInteractionHandler = this._controlsInteractionHandler.bind(this);
        this._graphEntryDraggedHandler = this._graphEntryDraggedHandler.bind(this);
        this._graphEntryPointerDownHandler = this._graphEntryPointerDownHandler.bind(this);
        this._graphEntryPointerOutHandler = this._graphEntryPointerOutHandler.bind(this);
        this._graphEntryPointerOverHandler = this._graphEntryPointerOverHandler.bind(this);
        this._graphEntryPointerUpHandler = this._graphEntryPointerUpHandler.bind(this);
        this._graphEntrySelectedHandler = this._graphEntrySelectedHandler.bind(this);
        this._graphEntryValidTargetHandler = this._graphEntryValidTargetHandler.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this._controlsInteractionFinishedHandler = this._controlsInteractionFinishedHandler.bind(this);
        this._slicesMaxIndexHandler = this._slicesMaxIndexHandler.bind(this);
        this._spawnNodeHandler = this._spawnNodeHandler.bind(this);
        this._srcLoadedHandler = this._srcLoadedHandler.bind(this);
        this._volumeDefaultRenderStepsHandler = this._volumeDefaultRenderStepsHandler.bind(this);
        this._volumeRaycastHandler = this._volumeRaycastHandler.bind(this);
        // debounced event handlers
        this._debouncedAppSetCamera = EventUtils.debounce(this.appSetCamera, Constants.minFrameMS).bind(this);
    }
    _renderScene() {
        return (h(Scene, { cb: ref => {
                this._scene = ref;
            }, isWebGl2: this._isWebGl2 },
            h(Src, { cb: ref => {
                    this._targetEntity = ref;
                }, controlsType: this.controlsType, displayMode: this.displayMode, dracoDecoderPath: this.dracoDecoderPath, graphEnabled: this.graphEnabled, orientation: this.orientation, slicesIndex: this.slicesIndex, src: this.src, srcLoaded: this.srcLoaded, volumeSteps: this.volumeSteps, volumeWindowCenter: this.volumeWindowCenter, volumeWindowWidth: this.volumeWindowWidth }),
            h(BoundingBox, { cb: ref => {
                    this._boundingEntity = ref;
                }, boundingBox: this._boundingBox, boundingBoxEnabled: this.boundingBoxEnabled, color: Constants.colors.white, displayMode: this.displayMode, graphEnabled: this.graphEnabled, mesh: this._getMesh(), srcLoaded: this.srcLoaded, targetEntity: this._targetEntity }),
            h(Nodes, { boundingSphereRadius: this._boundingSphereRadius, camera: this._scene ? this._scene.camera : null, cameraPosition: this.camera ? this.camera.position : null, controlsType: this.controlsType, fontSize: Constants.fontSizeMedium, graphEnabled: this.graphEnabled, nodes: this.nodes, selected: this.selected }),
            h(Edges, { boundingSphereRadius: this._boundingSphereRadius, camera: this._scene ? this._scene.camera : null, cameraPosition: this.camera ? this.camera.position : null, controlsType: this.controlsType, displayMode: this.displayMode, edges: this.edges, edgeSize: Constants.edgeSize, fontSize: Constants.fontSizeSmall, nodes: this.nodes, selected: this.selected, units: this.units }),
            h(Angles, { angles: this.angles, boundingSphereRadius: this._boundingSphereRadius, camera: this._scene ? this._scene.camera : null, cameraPosition: this.camera ? this.camera.position : null, controlsType: this.controlsType, edges: this.edges, edgeSize: Constants.edgeSize, fontSize: Constants.fontSizeSmall, nodes: this.nodes, selected: this.selected }),
            (() => {
                switch (this.controlsType) {
                    case ControlsType.TRACKBALL: {
                        return (h(TrackballCamera, { cb: ref => {
                                this._camera = ref;
                            }, animating: this.camera && this.camera.animating
                                ? this.camera.animating
                                : false, controlPosition: ThreeUtils.vector3ToString(this.camera
                                ? this.camera.position
                                : new THREE.Vector3(0, 0, 0)), controlTarget: ThreeUtils.vector3ToString(this.camera
                                ? this.camera.target
                                : new THREE.Vector3(0, 0, 0)), dampingFactor: Constants.camera.dampingFactor, enabled: this.controlsEnabled, far: Constants.camera.far, fov: Constants.camera.fov, near: Constants.camera.near, panSpeed: Constants.camera.panSpeed, rotateSpeed: Constants.camera.trackballRotateSpeed, screenHeight: this._scene ? this._scene.canvas.height : 0, screenWidth: this._scene ? this._scene.canvas.width : 0, zoomSpeed: Constants.camera.trackballZoomSpeed }));
                    }
                    case ControlsType.ORBIT: {
                        return (h(OrbitCamera, { cb: ref => {
                                this._camera = ref;
                            }, animating: this.camera && this.camera.animating
                                ? this.camera.animating
                                : false, controlPosition: ThreeUtils.vector3ToString(this.camera
                                ? this.camera.position
                                : new THREE.Vector3(0, 0, 0)), controlTarget: ThreeUtils.vector3ToString(this.camera
                                ? this.camera.target
                                : new THREE.Vector3(0, 0, 0)), dampingFactor: Constants.camera.dampingFactor, enabled: this.controlsEnabled, far: Constants.camera.far, fov: Constants.camera.fov, maxPolarAngle: Constants.camera.maxPolarAngle, minDistance: Constants.camera.minDistance, minPolarAngle: Constants.camera.minPolarAngle, panSpeed: Constants.camera.orbitPanSpeed, near: Constants.camera.near, rotateSpeed: Constants.camera.orbitRotateSpeed, zoomSpeed: Constants.camera.orbitZoomSpeed }));
                    }
                    default: {
                        return null;
                    }
                }
            })(),
            h(Lights, null)));
    }
    render() {
        return (h("div", { id: "al-container", class: this.displayMode, style: {
                width: Utils.addCssUnits(this.width),
                height: Utils.addCssUnits(this.height)
            } },
            h("div", { id: "lut-container" },
                h("div", { id: "lut-min" }, "0.0"),
                h("div", { id: "lut-canvases" }),
                h("div", { id: "lut-max" }, "1.0")),
            this._renderScene(),
            this.src && !this.srcLoaded && (h("div", { id: "spinner" },
                h("div", { class: "square" })))));
    }
    //#endregion
    //#region Private Methods
    _resize() {
        if (this._scene) {
            // tslint:disable-next-line: no-any
            this._scene.resize();
        }
    }
    _createEdge(node1Id, node2Id) {
        // check if there is already an edge connecting these two nodes
        const match = Array.from(this.edges).find(([_id, edge]) => {
            return ((edge.node1Id === node1Id && edge.node2Id === node2Id) ||
                (edge.node1Id === node2Id && edge.node2Id === node1Id));
        });
        if (!match) {
            const newEdge = {
                node1Id,
                node2Id
            };
            const edgeId = GraphUtils.getNextId(AlGraphEntryType.EDGE, this.edges);
            this._setEdge([edgeId, newEdge]);
        }
    }
    _createAngle(edge1Id, edge2Id) {
        // check if there is already an angle connecting these two edges
        const match = Array.from(this.angles).find(([_id, angle]) => {
            return ((angle.edge1Id === edge1Id && angle.edge2Id === edge2Id) ||
                (angle.edge1Id === edge2Id && angle.edge2Id === edge1Id));
        });
        if (!match) {
            const edge1 = this.edges.get(edge1Id);
            const edge2 = this.edges.get(edge2Id);
            if (edge1.node1Id === edge2.node1Id ||
                edge1.node1Id === edge2.node2Id ||
                edge1.node2Id === edge2.node1Id ||
                edge1.node2Id === edge2.node2Id) {
                const newAngle = {
                    edge1Id,
                    edge2Id
                };
                const angleId = GraphUtils.getNextId(AlGraphEntryType.ANGLE, this.angles);
                this._setAngle([angleId, newAngle]);
            }
            else {
                console.warn("cannot create angle: edges not connected");
            }
        }
        else {
            console.warn("cannot create angle: angle already exists");
        }
    }
    _stateChanged() {
        this.changed.emit(this.store.getState().app);
    }
    _setGraph(graph) {
        if (graph.nodes) {
            const nodes = new Map(graph.nodes);
            nodes.forEach((value, key) => {
                this.appSetNode([key, value]);
            });
        }
        if (graph.edges) {
            const edges = new Map(graph.edges);
            edges.forEach((value, key) => {
                this.appSetEdge([key, value]);
            });
        }
        if (graph.angles) {
            const angles = new Map(graph.angles);
            angles.forEach((value, key) => {
                this.appSetAngle([key, value]);
            });
        }
        this._stateChanged();
    }
    _clearGraph() {
        // todo: can this be a single appClearGraph action?
        this.appClearNodes();
        this.appClearEdges();
        this.appClearAngles();
        this._stateChanged();
    }
    _deleteNode(nodeId) {
        this.appDeleteNode(nodeId);
        this._stateChanged();
    }
    _setNode(node) {
        this.appSetNode(node);
        this._stateChanged();
    }
    _animateBetween(animationStart, animationEndVec3) {
        const defaultCamera = Utils.getCameraStateFromMesh(this._getMesh());
        const animationEnd = {
            position: animationEndVec3,
            target: defaultCamera.target.clone()
        };
        if (animationEndVec3) {
            const diffPos = animationEnd.position.distanceTo(this.camera.position);
            const diffTarg = animationEnd.target.distanceTo(this.camera.target);
            const needsPos = diffPos / Constants.maxAnimationSteps > Number.EPSILON;
            const needsTarg = diffTarg / Constants.maxAnimationSteps > Number.EPSILON;
            if (needsPos || needsTarg) {
                animationEnd.position.copy(animationEndVec3.clone());
                const slerpPath = ThreeUtils.getSlerpCameraPath(animationStart, animationEnd, needsPos, needsTarg);
                this._scene.emit(AlControlEvents.ANIMATION_STARTED, { slerpPath }, false);
                this.appSetCamera({
                    animating: true
                });
                this._stateChanged();
            }
        }
    }
    _selectNode(nodeId, animate = false) {
        if (animate && nodeId !== this.selected) {
            const animationStart = {
                position: this.camera.position.clone(),
                target: this.camera.target.clone()
            };
            const animationEndVec3 = Utils.getCameraPositionFromNode(this.nodes.get(nodeId), this._boundingSphereRadius, this.camera.target);
            this.appSelectNode(nodeId);
            this._animateBetween(animationStart, animationEndVec3);
        }
        else {
            this.appSelectNode(nodeId);
            this._stateChanged();
        }
    }
    _setEdge(edge) {
        this.appSetEdge(edge);
        this._stateChanged();
    }
    _deleteEdge(edgeId) {
        this.appDeleteEdge(edgeId);
        this._stateChanged();
    }
    _recenter() {
        const cameraState = Utils.getCameraStateFromMesh(this._getMesh());
        const animationStart = {
            position: this.camera.position.clone(),
            target: this.camera.target.clone()
        };
        // deselect current node
        this._selectNode(null);
        // todo: this also applies to edges and angles because it's setting state.selected to null.
        // think about whether this should be generic
        this._animateBetween(animationStart, cameraState.position);
    }
    _selectEdge(edgeId) {
        this.appSelectEdge(edgeId);
        this._stateChanged();
    }
    _setAngle(angle) {
        this.appSetAngle(angle);
        this._stateChanged();
    }
    _selectAngle(angleId) {
        this.appSelectAngle(angleId);
        this._stateChanged();
    }
    _deleteAngle(angleId) {
        this.appDeleteAngle(angleId);
        this._stateChanged();
    }
    _setBoundingBoxEnabled(visible) {
        this.appSetBoundingBoxEnabled(visible);
        this._stateChanged();
    }
    _setControlsEnabled(enabled) {
        this.appSetControlsEnabled(enabled);
        this._stateChanged();
    }
    _setControlsType(type) {
        this.appSetControlsType(type);
        this._scene.camera.up.copy(this._targetEntity.object3D.up);
        this._stateChanged();
    }
    _setGraphEnabled(enabled) {
        this.appSetGraphEnabled(enabled);
        this._stateChanged();
    }
    _setMaterial(material) {
        this.appSetMaterial(material);
        this._stateChanged();
    }
    _setOrientation(orientation) {
        this.appSetOrientation(orientation);
        this._stateChanged();
    }
    _setSlicesIndex(index) {
        this.appSetSlicesIndex(index);
        this._stateChanged();
    }
    _setUnits(units) {
        this.appSetUnits(units);
        this._stateChanged();
    }
    _setVolumeSteps(steps) {
        this.appSetVolumeSteps(steps);
        this._stateChanged();
    }
    _setVolumeWindowCenter(center) {
        this.appSetVolumeWindowCenter(center);
        this._stateChanged();
    }
    _setVolumeWindowWidth(width) {
        this.appSetVolumeWindowWidth(width);
        this._stateChanged();
    }
    _setDisplayMode(displayMode) {
        this.appSetDisplayMode(displayMode);
        this._stateChanged();
    }
    _setSrc(src, displayMode) {
        this.appSetSrc([src, displayMode]);
        this._stateChanged();
    }
    // private _getStackHelper(): AMI.VolumeRenderHelper | null {
    //   let stackhelper: AMI.VolumeRenderHelper | null = null;
    //   if (this.displayMode === DisplayMode.VOLUME) {
    //     stackhelper = this._loadedObject;
    //   }
    //   return stackhelper;
    // }
    _getMesh() {
        let mesh = null;
        if (this._targetEntity && this.displayMode === DisplayMode.MESH) {
            const model = this._targetEntity.object3DMap.mesh;
            if (model instanceof THREE.Mesh) {
                mesh = model;
            }
            else if (model) {
                model.traverse(child => {
                    if (child instanceof THREE.Mesh && mesh === null) {
                        mesh = child;
                        return mesh;
                    }
                });
            }
        }
        else if (this._loadedObject && this._loadedObject._bBox) {
            mesh = this._loadedObject._bBox._mesh;
        }
        else if (this._loadedObject) {
            mesh = this._loadedObject._mesh;
        }
        return mesh;
    }
    // tslint:disable-next-line: no-any
    _srcLoadedHandler(ev) {
        this._loadedObject = ev.detail;
        const mesh = this._getMesh();
        if (mesh) {
            // Compute the bounding sphere of the mesh
            mesh.geometry.computeBoundingSphere();
            mesh.geometry.computeBoundingBox();
            this._boundingSphereRadius = mesh.geometry.boundingSphere.radius;
            this._boundingBox = Utils.getBoundingBox(mesh);
            const cameraState = Utils.getCameraStateFromMesh(mesh);
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
    _keyDownHandler(event) {
        this._isShiftDown = event.shiftKey;
        if (event.keyCode === KeyDown.Delete) {
            if (this.selected) {
                if (this.nodes.has(this.selected)) {
                    this._deleteNode(this.selected);
                }
                else if (this.edges.has(this.selected)) {
                    this._deleteEdge(this.selected);
                }
                else if (this.angles.has(this.selected)) {
                    this._deleteAngle(this.selected);
                }
            }
        }
    }
    _keyUpHandler(_event) {
        this._isShiftDown = false;
    }
    _graphEntryPointerUpHandler(_event) {
        this.appSetControlsEnabled(true);
        ThreeUtils.enableControls(this._camera, true, this.controlsType);
    }
    _graphEntryPointerDownHandler(_event) {
        this.appSetControlsEnabled(false);
        ThreeUtils.enableControls(this._camera, false, this.controlsType);
    }
    _graphEntryPointerOutHandler(_event) {
        this._hovered = null;
    }
    _graphEntryPointerOverHandler(event) {
        this._hovered = event.detail.id;
    }
    _controlsInteractionHandler(event) {
        // This means that graph elements will rescale while animating
        // However this causes Redux to update every frame that we animate,
        // which causes the VDOM to update every frame
        const cameraState = event.detail.cameraState;
        this.appSetCamera(cameraState);
    }
    _controlsInteractionFinishedHandler(event) {
        const cameraState = event.detail.cameraState;
        this._debouncedAppSetCamera(cameraState);
    }
    _spawnNodeHandler(event) {
        // IF creating a new node and NOT intersecting an existing node
        if (this.graphEnabled && // Nodes are enabled
            this._validTarget && // Target is valid
            this._hovered === null // Not intersecting a Node already
        ) {
            let newNode;
            const nodeId = GraphUtils.getNextId(AlGraphEntryType.NODE, this.nodes);
            const intersection = event.detail.aframeEvent.detail.intersection;
            if (this.displayMode === DisplayMode.VOLUME && intersection) {
                this._scene.emit(AlVolumeEvents.VOLUME_RAY_REQUEST, {
                    cameraPosition: this._camera.object3D.children[0].position.clone(),
                    cameraDirection: this._camera.getAttribute("raycaster").direction,
                    intersection,
                    type: AlVolumeCastType.CREATE
                });
            }
            else if (intersection) {
                newNode = {
                    targetId: this.src,
                    position: ThreeUtils.vector3ToString(intersection.point),
                    scale: this._boundingSphereRadius / Constants.nodeSizeRatio,
                    title: nodeId
                };
            }
            if (newNode) {
                const previousSelected = this.selected;
                this._setNode([nodeId, newNode]);
                if (this._isShiftDown && // Shift is down
                    this.nodes.has(previousSelected) // A Node is already selected
                ) {
                    this._createEdge(previousSelected, nodeId);
                    this._selectNode(nodeId);
                }
            }
        }
    }
    _volumeRaycastHandler(event) {
        const hitPosition = event.detail.hitPosition;
        const rayResult = event.detail.rayResult;
        switch (event.detail.type) {
            case AlVolumeCastType.CREATE: {
                let newNode;
                const nodeId = GraphUtils.getNextId(AlGraphEntryType.NODE, this.nodes);
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
                    if (this._isShiftDown && // Shift is down
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
                    const distance = this._camera.object3D.children[0].position.distanceTo(this._targetEntity.getAttribute("position"));
                    hitPosition.copy(this._camera.object3D.children[0].position);
                    hitPosition.add(this._camera
                        .getAttribute("raycaster")
                        .direction.clone()
                        .multiplyScalar(distance * 1.5));
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
    _graphEntryValidTargetHandler(event) {
        this._validTarget = event.detail.valid;
    }
    _controlsAnimationFinishedHandler(_event) {
        this.appSetCamera({
            animating: false
        });
    }
    _graphEntrySelectedHandler(event) {
        if (!this.graphEnabled) {
            return;
        }
        const type = event.detail.type;
        const id = event.detail.id;
        switch (type) {
            case AlGraphEntryType.NODE: {
                if (this._hovered !== null &&
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
                if (this._hovered !== null &&
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
    _graphEntryDraggedHandler(event) {
        const nodeId = event.detail.id;
        // tslint:disable-next-line: no-any
        const raycaster = this._camera.components.raycaster;
        const raycasterAttribute = this._camera.getAttribute("raycaster");
        const hitPosition = new THREE.Vector3();
        let validLocation = false;
        if (this.displayMode === DisplayMode.VOLUME) {
            const intersection = raycaster.getIntersection(this._boundingEntity);
            if (intersection) {
                this._scene.emit(AlVolumeEvents.VOLUME_RAY_REQUEST, {
                    cameraPosition: this._camera.object3D.children[0].position.clone(),
                    cameraDirection: this._camera.getAttribute("raycaster").direction,
                    intersection,
                    type: AlVolumeCastType.DRAG
                });
            }
        }
        else {
            const intersection = raycaster.getIntersection(this._targetEntity);
            if (intersection) {
                hitPosition.copy(intersection.point);
                validLocation = true;
            }
            // IF not a valid location, dangle in space
            if (!validLocation) {
                const distance = this._camera.object3D.children[0].position.distanceTo(this._targetEntity.getAttribute("position"));
                hitPosition.copy(this._camera.object3D.children[0].position);
                hitPosition.add(raycasterAttribute.direction.clone().multiplyScalar(distance * 1.5));
            }
            else {
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
    _volumeDefaultRenderStepsHandler(event) {
        this.appSetVolumeSteps(event.detail);
        this._stateChanged();
    }
    _slicesMaxIndexHandler(event) {
        this.appSetSlicesMaxIndex(event.detail);
    }
    _addEventListeners() {
        window.addEventListener("keydown", this._keyDownHandler, false);
        window.addEventListener("keyup", this._keyUpHandler, false);
        this._scene.addEventListener(AlVolumeEvents.VOLUME_RAY_CAST, this._volumeRaycastHandler, false);
        this._scene.addEventListener(AlControlEvents.ANIMATION_FINISHED, this._controlsAnimationFinishedHandler, false);
        this._scene.addEventListener(AlControlEvents.INTERACTION, this._controlsInteractionHandler, false);
        this._scene.addEventListener(AlControlEvents.INTERACTION_FINISHED, this._controlsInteractionFinishedHandler, false);
        this._scene.addEventListener(AlGraphEvents.POINTER_UP, this._graphEntryPointerUpHandler, false);
        this._scene.addEventListener(AlGraphEvents.POINTER_DOWN, this._graphEntryPointerDownHandler, false);
        this._scene.addEventListener(AlGraphEvents.DRAGGED, this._graphEntryDraggedHandler, false);
        this._scene.addEventListener(AlGraphEvents.SELECTED, this._graphEntrySelectedHandler, false);
        this._scene.addEventListener(AlNodeSpawnerEvents.ADD_NODE, this._spawnNodeHandler, false);
        this._scene.addEventListener(AlNodeSpawnerEvents.VALID_TARGET, this._graphEntryValidTargetHandler, false);
        this._scene.addEventListener(AlGltfModelEvents.LOADED, this._srcLoadedHandler, false);
        this._scene.addEventListener(AlVolumeEvents.DEFAULT_RENDER_STEPS, this._volumeDefaultRenderStepsHandler, false);
        this._scene.addEventListener(AlVolumeEvents.LOADED, this._srcLoadedHandler, false);
        this._scene.addEventListener(AlVolumeEvents.SLICES_MAX_INDEX, this._slicesMaxIndexHandler, false);
        this._scene.addEventListener(AlGraphEvents.POINTER_OVER, this._graphEntryPointerOverHandler, false);
        this._scene.addEventListener(AlGraphEvents.POINTER_OUT, this._graphEntryPointerOutHandler, false);
    }
    //#endregion
    componentDidUpdate() {
        if (this._scene) {
            this._addEventListeners();
        }
    }
    static get is() { return "al-viewer"; }
    static get originalStyleUrls() { return {
        "$": ["al-viewer.css"]
    }; }
    static get styleUrls() { return {
        "$": ["al-viewer.css"]
    }; }
    static get properties() { return {
        "dracoDecoderPath": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string | null",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "draco-decoder-path",
            "reflect": false
        },
        "width": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "width",
            "reflect": false,
            "defaultValue": "\"640\""
        },
        "height": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "height",
            "reflect": false,
            "defaultValue": "\"480\""
        }
    }; }
    static get contextProps() { return [{
            "name": "store",
            "context": "store"
        }]; }
    static get states() { return {
        "angles": {},
        "boundingBoxEnabled": {},
        "camera": {},
        "controlsEnabled": {},
        "controlsType": {},
        "displayMode": {},
        "edges": {},
        "graphEnabled": {},
        "material": {},
        "nodes": {},
        "nodesVisible": {},
        "optionsEnabled": {},
        "optionsVisible": {},
        "orientation": {},
        "selected": {},
        "slicesIndex": {},
        "slicesMaxIndex": {},
        "src": {},
        "srcLoaded": {},
        "units": {},
        "volumeSteps": {},
        "volumeWindowCenter": {},
        "volumeWindowWidth": {}
    }; }
    static get events() { return [{
            "method": "changed",
            "name": "changed",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Fires whenever the internal state changes passing an object describing the state."
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }, {
            "method": "loaded",
            "name": "loaded",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Fires when an object is loaded passing either the object or a stackhelper for volumetric data."
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get methods() { return {
        "load": {
            "complexType": {
                "signature": "(src: string, displayMode?: DisplayMode) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }, {
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "DisplayMode": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "resize": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setNode": {
            "complexType": {
                "signature": "(node: [string, AlNode]) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "AlNode": {
                        "location": "import",
                        "path": "../../interfaces"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setGraph": {
            "complexType": {
                "signature": "(graph: AlGraph) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "AlGraph": {
                        "location": "import",
                        "path": "../../interfaces"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "deleteNode": {
            "complexType": {
                "signature": "(nodeId: string) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "clearGraph": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "selectNode": {
            "complexType": {
                "signature": "(nodeId: string) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "deleteEdge": {
            "complexType": {
                "signature": "(edgeId: string) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "deleteAngle": {
            "complexType": {
                "signature": "(angleId: string) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setEdge": {
            "complexType": {
                "signature": "(edge: [string, AlEdge]) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "AlEdge": {
                        "location": "import",
                        "path": "../../interfaces"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "Creates or updates an edge in the graph",
                "tags": []
            }
        },
        "recenter": {
            "complexType": {
                "signature": "() => Promise<void>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setBoundingBoxEnabled": {
            "complexType": {
                "signature": "(visible: boolean) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setDisplayMode": {
            "complexType": {
                "signature": "(displayMode: DisplayMode) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "DisplayMode": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setControlsEnabled": {
            "complexType": {
                "signature": "(enabled: boolean) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setControlsType": {
            "complexType": {
                "signature": "(type: ControlsType) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "ControlsType": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setGraphEnabled": {
            "complexType": {
                "signature": "(enabled: boolean) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setMaterial": {
            "complexType": {
                "signature": "(material: Material) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "Material": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setOrientation": {
            "complexType": {
                "signature": "(orientation: Orientation) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "Orientation": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setSlicesIndex": {
            "complexType": {
                "signature": "(index: number) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setUnits": {
            "complexType": {
                "signature": "(units: Units) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "Units": {
                        "location": "import",
                        "path": "../../enums"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setVolumeSteps": {
            "complexType": {
                "signature": "(steps: number) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setVolumeBrightness": {
            "complexType": {
                "signature": "(brightness: number) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "setVolumeContrast": {
            "complexType": {
                "signature": "(contrast: number) => Promise<void>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    }
                },
                "return": "Promise<void>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
}

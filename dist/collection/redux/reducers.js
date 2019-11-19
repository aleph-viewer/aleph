import { combineReducers } from "redux";
import { MeshFileType } from "../enums";
import { ControlsType } from "../enums/ControlsType";
import { DisplayMode } from "../enums/DisplayMode";
import { Material } from "../enums/Material";
import { Orientation } from "../enums/Orientation";
import { Units } from "../enums/Units";
import { Utils } from "../utils";
import { TypeKeys } from "./actions";
export const getInitialState = () => {
    return {
        angles: new Map(),
        boundingBoxEnabled: false,
        camera: null,
        controlsEnabled: true,
        controlsType: ControlsType.TRACKBALL,
        displayMode: DisplayMode.MESH,
        edges: new Map(),
        material: Material.DEFAULT,
        nodes: new Map(),
        graphEnabled: false,
        orientation: Orientation.CORONAL,
        selected: null,
        slicesIndex: 0.5,
        slicesMaxIndex: undefined,
        src: null,
        srcLoaded: false,
        units: Units.METERS,
        volumeSteps: 0.5,
        volumeStepsHighEnabled: false,
        volumeWindowCenter: 0.5,
        volumeWindowWidth: 1.0
    };
};
export const app = (state = getInitialState(), action) => {
    switch (action.type) {
        //#region src
        case TypeKeys.APP_SET_SRC: {
            const [src, plDisplayMode] = action.payload;
            let displayMode;
            if (plDisplayMode) {
                displayMode = plDisplayMode;
            }
            else if (src) {
                const fileExtension = Utils.getFileExtension(src);
                const fileEnd = Utils.getFileEndCharacters(src, 3);
                if (Object.values(MeshFileType).includes(fileExtension) ||
                    Object.values(MeshFileType).includes(fileEnd)) {
                    displayMode = DisplayMode.MESH;
                }
                else {
                    displayMode = DisplayMode.SLICES; // if not a mesh, default to slices
                }
            }
            else {
                displayMode = DisplayMode.MESH;
            }
            return Object.assign({}, getInitialState(), { displayMode,
                src });
        }
        case TypeKeys.APP_SET_SRC_LOADED: {
            return Object.assign({}, state, { controlsEnabled: action.payload, srcLoaded: action.payload, boundingBoxEnabled: state.displayMode !== DisplayMode.MESH
                    ? true
                    : state.boundingBoxEnabled, controlsType: state.displayMode === DisplayMode.MESH
                    ? ControlsType.ORBIT
                    : ControlsType.TRACKBALL, units: state.displayMode !== DisplayMode.MESH
                    ? Units.MILLIMETERS
                    : Units.METERS });
        }
        //#endregion
        //#region nodes
        case TypeKeys.APP_SET_NODE: {
            // updates a map key if it already exists, otherwise adds it.
            const [key, value] = action.payload;
            // sanitise
            const sanitisedValue = JSON.parse(JSON.stringify(value));
            // merge with the current value (if any)
            const currentValue = state.nodes.get(key);
            const nextValue = Object.assign({}, currentValue, sanitisedValue);
            // if the key already exists, keep the current selected
            // otherwise select the new key.
            return Object.assign({}, state, { selected: currentValue ? state.selected : key, nodes: new Map(state.nodes).set(key, nextValue) });
        }
        case TypeKeys.APP_DELETE_NODE: {
            return Object.assign({}, state, { selected: state.selected === action.payload ? null : state.selected, nodes: new Map(Array.from(state.nodes).filter(([key]) => key !== action.payload)), edges: new Map(Array.from(state.edges).filter(([_key, edge]) => action.payload !== edge.node1Id && action.payload !== edge.node2Id)) });
        }
        case TypeKeys.APP_SELECT_NODE: {
            return Object.assign({}, state, { selected: action.payload });
        }
        case TypeKeys.APP_CLEAR_NODES: {
            return Object.assign({}, state, { nodes: new Map() });
        }
        //#endregion
        //#region edges
        case TypeKeys.APP_SET_EDGE: {
            // updates a map key if it already exists, otherwise adds it.
            const [key, value] = action.payload;
            // sanitise
            const sanitisedValue = JSON.parse(JSON.stringify(value));
            // merge with the current value (if any)
            const currentValue = state.edges.get(key);
            const nextValue = Object.assign({}, currentValue, sanitisedValue);
            // if the key already exists, keep the current selected
            // otherwise select the new key.
            return Object.assign({}, state, { selected: currentValue ? state.selected : key, edges: new Map(state.edges).set(key, nextValue) });
        }
        case TypeKeys.APP_DELETE_EDGE: {
            return Object.assign({}, state, { selected: state.selected === action.payload ? null : state.selected, edges: new Map(Array.from(state.edges).filter(([key]) => key !== action.payload)), angles: new Map(Array.from(state.angles).filter(([_key, angle]) => action.payload !== angle.edge1Id &&
                    action.payload !== angle.edge2Id)) });
        }
        case TypeKeys.APP_SELECT_EDGE: {
            return Object.assign({}, state, { selected: action.payload });
        }
        case TypeKeys.APP_CLEAR_EDGES: {
            return Object.assign({}, state, { edges: new Map() });
        }
        //#endregion
        //#region angles
        case TypeKeys.APP_SET_ANGLE: {
            // updates a map key if it already exists, otherwise adds it.
            const [key, value] = action.payload;
            // sanitise
            const sanitisedValue = JSON.parse(JSON.stringify(value));
            // merge with the current value (if any)
            const currentValue = state.angles.get(key);
            const nextValue = Object.assign({}, currentValue, sanitisedValue);
            // if the key already exists, keep the current selected
            // otherwise select the new key.
            return Object.assign({}, state, { selected: currentValue ? state.selected : key, angles: new Map(state.angles).set(key, nextValue) });
        }
        case TypeKeys.APP_DELETE_ANGLE: {
            return Object.assign({}, state, { selected: state.selected === action.payload ? null : state.selected, angles: new Map(Array.from(state.angles).filter(([key]) => key !== action.payload)) });
        }
        case TypeKeys.APP_SELECT_ANGLE: {
            return Object.assign({}, state, { selected: action.payload });
        }
        case TypeKeys.APP_CLEAR_ANGLES: {
            return Object.assign({}, state, { angles: new Map() });
        }
        //#endregion
        //#region control panel
        case TypeKeys.APP_SET_DISPLAY_MODE: {
            return Object.assign({}, state, { displayMode: action.payload, boundingBoxEnabled: action.payload === DisplayMode.SLICES ? true : false });
        }
        case TypeKeys.APP_SET_ORIENTATION: {
            return Object.assign({}, state, { slicesIndex: 0.5, orientation: action.payload });
        }
        case TypeKeys.APP_SET_MATERIAL: {
            return Object.assign({}, state, { material: action.payload });
        }
        case TypeKeys.APP_SET_NODES_ENABLED: {
            return Object.assign({}, state, { graphEnabled: action.payload });
        }
        case TypeKeys.APP_SET_BOUNDINGBOX_ENABLED: {
            return Object.assign({}, state, { boundingBoxEnabled: action.payload });
        }
        //#endregion
        //#region volumes
        case TypeKeys.APP_SET_SLICES_INDEX: {
            return Object.assign({}, state, { slicesIndex: action.payload });
        }
        case TypeKeys.APP_SET_SLICES_MAX_INDEX: {
            return Object.assign({}, state, { slicesMaxIndex: action.payload });
        }
        case TypeKeys.APP_SET_UNITS: {
            return Object.assign({}, state, { units: action.payload });
        }
        case TypeKeys.APP_SET_VOLUME_STEPS: {
            return Object.assign({}, state, { volumeSteps: action.payload });
        }
        case TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH: {
            return Object.assign({}, state, { volumeWindowWidth: action.payload });
        }
        case TypeKeys.APP_SET_VOLUME_WINDOW_CENTER: {
            return Object.assign({}, state, { volumeWindowCenter: action.payload });
        }
        //#endregion
        //#region camera
        case TypeKeys.APP_SET_CAMERA: {
            return Object.assign({}, state, { camera: Object.assign({}, state.camera, action.payload) });
        }
        case TypeKeys.APP_SET_CONTROLS_ENABLED: {
            return Object.assign({}, state, { controlsEnabled: action.payload });
        }
        case TypeKeys.APP_SET_CONTROLS_TYPE: {
            return Object.assign({}, state, { controlsType: action.payload });
        }
        default: {
            return Object.assign({}, state);
        }
        //#endregion
    }
};
// tslint:disable-next-line: no-any
export const rootReducer = combineReducers({
    app
});

import { combineReducers } from "redux";
import { MeshFileType } from "../enums";
import { ControlsType } from "../enums/ControlsType";
import { DisplayMode } from "../enums/DisplayMode";
import { Material } from "../enums/Material";
import { Orientation } from "../enums/Orientation";
import { Units } from "../enums/Units";
import { AlAngle, AlAppState, AlEdge, AlNode } from "../interfaces";
import { GetUtils } from "../utils";
import { ActionTypes, TypeKeys } from "./actions";

export const getInitialState = () => {
  return {
    angles: new Map<string, AlAngle>(),
    boundingBoxEnabled: false,
    camera: null,
    controlsEnabled: true,
    controlsType: ControlsType.ORBIT,
    displayMode: DisplayMode.MESH,
    edges: new Map<string, AlEdge>(),
    material: Material.DEFAULT,
    nodes: new Map<string, AlNode>(),
    graphEnabled: false,
    orientation: Orientation.CORONAL,
    selected: null,
    slicesIndex: 0,
    slicesWindowCenter: 0,
    slicesWindowWidth: 0,
    src: null,
    srcLoaded: false,
    units: Units.METERS,
    volumeSteps: 16,
    volumeWindowCenter: 0,
    volumeWindowWidth: 0
  } as AlAppState;
};

// todo: split app reducer into src, nodes, edges, etc reducers and combine them
export const app = (
  state: AlAppState = getInitialState(),
  action: ActionTypes
) => {
  switch (action.type) {
    //#region src
    case TypeKeys.APP_SET_SRC: {
      const [src, plDisplayMode] = action.payload;
      let displayMode: DisplayMode;

      if (plDisplayMode) {
        displayMode = plDisplayMode;
      } else if (src) {
        const fileExtension: string = GetUtils.getFileExtension(src);
        if (Object.values(MeshFileType).includes(fileExtension)) {
          displayMode = DisplayMode.MESH;
        } else {
          displayMode = DisplayMode.SLICES; // if not a mesh, default to slices
        }
      } else {
        displayMode = DisplayMode.MESH;
      }

      return {
        ...state,
        angles: new Map<string, AlAngle>(),
        controlsEnabled: false,
        displayMode,
        edges: new Map<string, AlEdge>(),
        nodes: new Map<string, AlNode>(),
        orientation: Orientation.CORONAL,
        selected: null,
        slicesIndex: 0,
        slicesWindowCenter: 0,
        slicesWindowWidth: 0,
        src,
        srcLoaded: false,
        volumeSteps: 16,
        volumeWindowCenter: 0,
        volumeWindowWidth: 0
      };
    }
    case TypeKeys.APP_SET_SRC_LOADED: {
      return {
        ...state,
        controlsEnabled: action.payload,
        srcLoaded: action.payload,
        boundingBoxEnabled:
          state.displayMode !== DisplayMode.MESH
            ? true
            : state.boundingBoxEnabled,
        units:
          state.displayMode !== DisplayMode.MESH
            ? Units.MILLIMETERS
            : Units.METERS
      };
    }
    //#endregion
    //#region nodes
    case TypeKeys.APP_SET_NODE: {
      // updates a map key if it already exists, otherwise adds it.
      const [key, value] = action.payload;

      // sanitise
      const sanitisedValue = JSON.parse(JSON.stringify(value));

      // merge with the current value (if any)
      const currentValue: AlNode | undefined = state.nodes.get(key);
      const nextValue: AlNode = {
        ...currentValue,
        ...sanitisedValue
      };

      // if the key already exists, keep the current selected
      // otherwise select the new key.
      return {
        ...state,
        selected: currentValue ? state.selected : key,
        nodes: new Map(state.nodes).set(key, nextValue)
      };
    }
    case TypeKeys.APP_DELETE_NODE: {
      return {
        ...state,
        selected: state.selected === action.payload ? null : state.selected,
        nodes: new Map(
          [...state.nodes].filter(([key]) => key !== action.payload)
        ),
        edges: new Map(
          [...state.edges].filter(
            ([_key, edge]) =>
              action.payload !== edge.node1Id && action.payload !== edge.node2Id
          )
        )
      };
    }
    case TypeKeys.APP_SELECT_NODE: {
      return {
        ...state,
        selected: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_NODES: {
      return {
        ...state,
        nodes: new Map<string, AlNode>()
      };
    }
    //#endregion
    //#region edges
    case TypeKeys.APP_SET_EDGE: {
      // updates a map key if it already exists, otherwise adds it.
      const [key, value] = action.payload;

      // sanitise
      const sanitisedValue = JSON.parse(JSON.stringify(value));

      // merge with the current value (if any)
      const currentValue: AlEdge | undefined = state.edges.get(key);
      const nextValue: AlEdge = {
        ...currentValue,
        ...sanitisedValue
      };

      // if the key already exists, keep the current selected
      // otherwise select the new key.
      return {
        ...state,
        selected: currentValue ? state.selected : key,
        edges: new Map(state.edges).set(key, nextValue)
      };
    }
    case TypeKeys.APP_DELETE_EDGE: {
      return {
        ...state,
        selected: state.selected === action.payload ? null : state.selected,
        edges: new Map(
          [...state.edges].filter(([key]) => key !== action.payload)
        ),
        angles: new Map(
          [...state.angles].filter(
            ([_key, angle]) =>
              action.payload !== angle.edge1Id &&
              action.payload !== angle.edge2Id
          )
        )
      };
    }
    case TypeKeys.APP_SELECT_EDGE: {
      return {
        ...state,
        selected: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_EDGES: {
      return {
        ...state,
        edges: new Map<string, AlEdge>()
      };
    }
    //#endregion
    //#region angles
    case TypeKeys.APP_SET_ANGLE: {
      // updates a map key if it already exists, otherwise adds it.
      const [key, value] = action.payload;

      // sanitise
      const sanitisedValue = JSON.parse(JSON.stringify(value));

      // merge with the current value (if any)
      const currentValue: AlAngle | undefined = state.angles.get(key);
      const nextValue: AlAngle = {
        ...currentValue,
        ...sanitisedValue
      };

      // if the key already exists, keep the current selected
      // otherwise select the new key.
      return {
        ...state,
        selected: currentValue ? state.selected : key,
        angles: new Map(state.angles).set(key, nextValue)
      };
    }
    case TypeKeys.APP_DELETE_ANGLE: {
      return {
        ...state,
        selected: state.selected === action.payload ? null : state.selected,
        angles: new Map(
          [...state.angles].filter(([key]) => key !== action.payload)
        )
      };
    }
    case TypeKeys.APP_SELECT_ANGLE: {
      return {
        ...state,
        selected: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_ANGLES: {
      return {
        ...state,
        angles: new Map<string, AlAngle>()
      };
    }
    //#endregion
    //#region control panel
    case TypeKeys.APP_SET_DISPLAY_MODE: {
      return {
        ...state,
        displayMode: action.payload,
        boundingBoxEnabled:
          action.payload !== DisplayMode.MESH ? true : state.boundingBoxEnabled
      };
    }
    case TypeKeys.APP_SET_ORIENTATION: {
      return {
        ...state,
        slicesIndex: undefined,
        orientation: action.payload
      };
    }
    case TypeKeys.APP_SET_MATERIAL: {
      return {
        ...state,
        material: action.payload
      };
    }
    case TypeKeys.APP_SET_NODES_ENABLED: {
      return {
        ...state,
        graphEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE: {
      return {
        ...state,
        boundingBoxEnabled: action.payload
      };
    }
    //#endregion
    //#region volumes
    case TypeKeys.APP_SET_SLICES_INDEX: {
      return {
        ...state,
        slicesIndex: action.payload
      };
    }
    case TypeKeys.APP_SET_SLICES_WINDOW_WIDTH: {
      return {
        ...state,
        slicesWindowWidth: action.payload
      };
    }
    case TypeKeys.APP_SET_SLICES_WINDOW_CENTER: {
      return {
        ...state,
        slicesWindowCenter: action.payload
      };
    }
    case TypeKeys.APP_SET_UNITS: {
      return {
        ...state,
        units: action.payload
      };
    }
    case TypeKeys.APP_SET_VOLUME_STEPS: {
      return {
        ...state,
        volumeSteps: action.payload
      };
    }
    case TypeKeys.APP_SET_VOLUME_WINDOW_WIDTH: {
      return {
        ...state,
        volumeWindowWidth: action.payload
      };
    }
    case TypeKeys.APP_SET_VOLUME_WINDOW_CENTER: {
      return {
        ...state,
        volumeWindowCenter: action.payload
      };
    }
    //#endregion
    //#region camera
    case TypeKeys.APP_SET_CAMERA: {
      return {
        ...state,
        camera: {
          ...state.camera,
          ...action.payload
        }
      };
    }
    case TypeKeys.APP_SET_CONTROLS_ENABLED: {
      return {
        ...state,
        controlsEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_CONTROLS_TYPE: {
      return {
        ...state,
        controlsType: action.payload
      };
    }
    default: {
      return {
        ...state
      };
    }
    //#endregion
  }
};

// tslint:disable-next-line: no-any
export const rootReducer = (combineReducers as any)({
  app
});

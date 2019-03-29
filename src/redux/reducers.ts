import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";
import {
  AlAppState,
  AlNodeSerial,
  AlEdgeSerial,
  AlAngleSerial
} from "../interfaces";

export const getInitialState = () => {
  return {
    angles: new Map<string, AlAngleSerial>(),
    boundingBoxVisible: false,
    camera: null,
    cameraAnimating: false,
    controlsEnabled: true,
    displayMode: DisplayMode.MESH,
    edges: new Map<string, AlEdgeSerial>(),
    nodes: new Map<string, AlNodeSerial>(),
    nodesEnabled: false,
    orientation: Orientation.CORONAL,
    selectedAngle: null,
    selectedEdge: null,
    selectedNode: null,
    slicesIndex: undefined,
    slicesWindowCenter: undefined,
    slicesWindowWidth: undefined,
    src: null,
    srcLoaded: false,
    volumeSteps: undefined,
    volumeWindowCenter: undefined,
    volumeWindowWidth: undefined
  };
};

export const app = (
  state: AlAppState = getInitialState(),
  action: ActionTypes
) => {
  switch (action.type) {
    //#region src
    case TypeKeys.APP_SET_SRC: {
      return {
        ...state,
        src: action.payload,
        srcLoaded: false,
        selectedNode: null,
        nodes: new Map<string, AlNodeSerial>(),
        edges: new Map<string, AlEdgeSerial>(),
        angles: new Map<string, AlAngleSerial>()
      };
    }
    case TypeKeys.APP_SET_SRC_LOADED: {
      return {
        ...state,
        srcLoaded: action.payload
      };
    }
    //#endregion
    //#region nodes
    case TypeKeys.APP_SET_NODE: {
      // updates a node if it already exists, otherwise adds it.
      // if it already exists, the current selectedNode is kept, otherwise it's set to the new node's id.
      const [nodeId, node] = action.payload;

      return {
        ...state,
        selectedNode: state.nodes.has(nodeId) ? state.selectedNode : nodeId,
        nodes: new Map(state.nodes).set(nodeId, node)
      };
    }
    case TypeKeys.APP_DELETE_NODE: {
      return {
        ...state,
        selectedNode:
          state.selectedNode === action.payload ? null : state.selectedNode,
        nodes: new Map(
          [...state.nodes].filter(([nodeId]) => nodeId !== action.payload)
        )
      };
    }
    case TypeKeys.APP_SELECT_NODE: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_NODES: {
      return {
        ...state,
        nodes: new Map<string, AlNodeSerial>()
      };
    }
    //#endregion
    //#region edges
    case TypeKeys.APP_SET_EDGE: {
      // updates an edge if it already exists, otherwise adds it.
      // if it already exists, the current selectedEdge is kept, otherwise it's set to the new edge's id.
      const [edgeId, edge] = action.payload;

      return {
        ...state,
        selectedEdge: state.edges.has(edgeId) ? state.selectedEdge : edgeId,
        edges: new Map(state.edges).set(edgeId, edge)
      };
    }
    case TypeKeys.APP_DELETE_EDGE: {
      return {
        ...state,
        selectedEdge:
          state.selectedEdge === action.payload ? null : state.selectedEdge,
        edges: new Map(
          [...state.edges].filter(([edgeId]) => edgeId !== action.payload)
        )
      };
    }
    case TypeKeys.APP_SELECT_EDGE: {
      return {
        ...state,
        selectedEdge: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_EDGES: {
      return {
        ...state,
        edges: new Map<string, AlEdgeSerial>()
      };
    }
    //#endregion
    //#region angles
    case TypeKeys.APP_SET_ANGLE: {
      // updates an angle if it already exists, otherwise adds it.
      // if it already exists, the current selectedAngle is kept, otherwise it's set to the new angle's id.
      const [angleId, angle] = action.payload;

      return {
        ...state,
        selectedAngle: state.angles.has(angleId)
          ? state.selectedAngle
          : angleId,
        angles: new Map(state.angles).set(angleId, angle)
      };
    }
    case TypeKeys.APP_DELETE_ANGLE: {
      return {
        ...state,
        selectedAngle:
          state.selectedAngle === action.payload ? null : state.selectedAngle,
        angles: new Map(
          [...state.angles].filter(([angleId]) => angleId !== action.payload)
        )
      };
    }
    case TypeKeys.APP_SELECT_ANGLE: {
      return {
        ...state,
        selectedAngle: action.payload
      };
    }
    case TypeKeys.APP_CLEAR_ANGLES: {
      return {
        ...state,
        angles: new Map<string, AlAngleSerial>()
      };
    }
    //#endregion
    //#region control panel
    case TypeKeys.APP_SET_DISPLAY_MODE: {
      return {
        ...state,
        boundingBoxVisible: action.payload === DisplayMode.SLICES, // default to bounding box visible in slices mode
        displayMode: action.payload
      };
    }
    case TypeKeys.APP_SET_ORIENTATION: {
      return {
        ...state,
        slicesIndex: undefined,
        orientation: action.payload
      };
    }
    case TypeKeys.APP_SET_NODES_ENABLED: {
      return {
        ...state,
        nodesEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE: {
      return {
        ...state,
        boundingBoxVisible: action.payload
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
    case TypeKeys.APP_SET_CAMERA_ANIMATING: {
      return {
        ...state,
        cameraAnimating: action.payload
      };
    }
    case TypeKeys.APP_SET_CAMERA: {
      return {
        ...state,
        camera: action.payload
      };
    }
    case TypeKeys.APP_SET_CONTROLS_ENABLED: {
      return {
        ...state,
        controlsEnabled: action.payload
      };
    }
    //#endregion
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});

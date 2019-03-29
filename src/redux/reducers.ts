import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";
import { AlAppState, AlNodeSerial } from "../interfaces";

export const getInitialState = () => {
  return {
    boundingBoxVisible: false,
    displayMode: DisplayMode.MESH,
    optionsEnabled: false,
    optionsVisible: true,
    orientation: Orientation.CORONAL,
    selectedNode: null,
    slicesIndex: undefined,
    slicesWindowCenter: undefined,
    slicesWindowWidth: undefined,
    src: null,
    srcLoaded: false,
    nodes: new Map<string, AlNodeSerial>(),
    nodesEnabled: false,
    nodesVisible: true,
    volumeSteps: undefined,
    volumeWindowCenter: undefined,
    volumeWindowWidth: undefined,
    cameraAnimating: false
  };
};

export const app = (
  state: AlAppState = getInitialState(),
  action: ActionTypes
) => {
  switch (action.type) {
    case TypeKeys.APP_SET_SRC: {
      return {
        ...state,
        src: action.payload,
        srcLoaded: false,
        nodes: new Map<string, AlNodeSerial>()
      };
    }
    case TypeKeys.APP_SET_SRC_LOADED: {
      return {
        ...state,
        srcLoaded: action.payload
      };
    }
    case TypeKeys.APP_SET_NODE: {
      // updates a node if it already exists, otherwise adds it.
      // if it already exists, the current selectedNode is kept, otherwise it's set to the new node's id.
      return {
        ...state,
        selectedNode: state.nodes.has(action.payload.id)
          ? state.selectedNode
          : action.payload.id,
        nodes: new Map(state.nodes).set(action.payload.id, action.payload)
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
    case TypeKeys.APP_SET_NODES_VISIBLE: {
      return {
        ...state,
        nodesVisible: action.payload
      };
    }
    case TypeKeys.APP_SET_NODES_ENABLED: {
      return {
        ...state,
        nodesEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_OPTIONS_VISIBLE: {
      return {
        ...state,
        optionsVisible: action.payload
      };
    }
    case TypeKeys.APP_SET_OPTIONS_ENABLED: {
      return {
        ...state,
        optionsEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_BOUNDINGBOX_VISIBLE: {
      return {
        ...state,
        boundingBoxVisible: action.payload
      };
    }
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
    case TypeKeys.APP_SET_CAMERA_ANIMATING: {
      return {
        ...state,
        cameraAnimating: action.payload
      };
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});

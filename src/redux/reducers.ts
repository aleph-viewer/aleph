import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { GetUtils } from "../utils";
import { DisplayMode } from "../enums/DisplayMode";
import { Orientation } from "../enums/Orientation";
import { AlAppState } from "../interfaces";

export const getInitialState = () => {
  return {
    boundingBoxVisible: false,
    displayMode: DisplayMode.MESH,
    optionsEnabled: false,
    optionsVisible: true,
    orientation: Orientation.CORONAL,
    selectedTool: null,
    slicesIndex: undefined,
    slicesWindowCenter: undefined,
    slicesWindowWidth: undefined,
    src: null,
    srcLoaded: false,
    tools: [],
    toolsEnabled: false,
    toolsVisible: true,
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
    case TypeKeys.APP_SET_SRC: {
      return {
        ...state,
        src: action.payload,
        srcLoaded: false,
        tools: []
      };
    }
    case TypeKeys.APP_SET_SRC_LOADED: {
      return {
        ...state,
        srcLoaded: action.payload
      };
    }
    case TypeKeys.APP_ADD_TOOL: {
      return {
        ...state,
        tools: [...state.tools, action.payload]
      };
    }
    case TypeKeys.APP_REMOVE_TOOL: {
      const index: number = GetUtils.getToolIndex(action.payload, state.tools);
      return {
        ...state,
        selectedTool:
          state.selectedTool === action.payload ? null : state.selectedTool,
        tools: [...state.tools.slice(0, index), ...state.tools.slice(index + 1)]
      };
    }
    case TypeKeys.APP_SELECT_TOOL: {
      return {
        ...state,
        selectedTool: action.payload
      };
    }
    case TypeKeys.APP_UPDATE_TOOL: {
      return {
        ...state,
        tools: state.tools.map(tool => {
          if (tool.id !== action.payload.id) {
            return tool;
          }

          return {
            ...tool,
            ...action.payload
          };
        })
      };
    }
    case TypeKeys.APP_LOAD_TOOLS: {
      return {
        ...state,
        tools: action.payload
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
    case TypeKeys.APP_SET_TOOLS_VISIBLE: {
      return {
        ...state,
        toolsVisible: action.payload
      };
    }
    case TypeKeys.APP_SET_TOOLS_ENABLED: {
      return {
        ...state,
        toolsEnabled: action.payload
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
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});

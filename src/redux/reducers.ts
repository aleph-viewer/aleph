import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { Tool } from '../interfaces/Tool';
import { GetUtils } from '../utils/utils';
import { DisplayMode } from '../enums/DisplayMode';

interface AppState {
  src: string | null;
  srcLoaded: boolean;
  tools: Tool[];
  selectedTool: number | null;
}

export const getInitialState = () => {
  return {
    src: null,
    srcLoaded: false,
    selectedTool: null,
    tools: []
  };
};

export const app = (state: AppState = getInitialState(), action: ActionTypes) => {

  switch (action.type) {
    case TypeKeys.APP_SET_SRC: {
      return {
        ...state,
        src: action.payload,
        srcLoaded: false
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
        selectedTool: (state.selectedTool === action.payload) ? null : state.selectedTool,
        tools: [
          ...state.tools.slice(0, index),
          ...state.tools.slice(index + 1)
        ]
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
        tools: state.tools.map((tool) => {
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
    case TypeKeys.APP_SAVE_TOOLS: {
      console.log(JSON.stringify(state.tools));
      return {
        ...state
      };
    }
    case TypeKeys.APP_SET_DISPLAY: {
      return {
        ...state,
        boundingBoxVisible: action.payload === DisplayMode.SLICES, // default to bounding box visible in slices mode
        display: action.payload
      };
    }
    case TypeKeys.APP_SET_ORIENTATION: {
      return {
        ...state,
        THREEJSSceneNeedsUpdate: true,
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
    case TypeKeys.APP_SET_TOOL_TYPE: {
      return {
        ...state,
        toolType: action.payload
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
    case TypeKeys.APP_SET_THREEJS_SCENE_NEEDS_UPDATE: {
      return {
        ...state,
        THREEJSSceneNeedsUpdate: action.payload
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
    case TypeKeys.APP_SET_ANGLE_TOOL_ENABLED: {
      return {
        ...state,
        angleToolEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_ANNOTATION_TOOL_ENABLED: {
      return {
        ...state,
        annotationToolEnabled: action.payload
      };
    }
    case TypeKeys.APP_SET_RULER_TOOL_ENABLED: {
      return {
        ...state,
        rulerToolEnabled: action.payload
      };
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});

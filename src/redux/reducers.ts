import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { Tool } from '../Tool';
import { Utils } from '../utils/Utils';

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
  }
};

export const app = (state: AppState = getInitialState(), action: ActionTypes) => {

  switch (action.type) {
    case TypeKeys.APP_SET_SRC: {
      return {
        ...state,
        src: action.payload,
        srcLoaded: false
      }
    }
    case TypeKeys.APP_SET_SRC_LOADED: {
      return {
        ...state,
        srcLoaded: action.payload
      }
    }
    case TypeKeys.APP_ADD_TOOL: {
      return {
        ...state,
        tools: [...state.tools, action.payload]
      }
    }
    case TypeKeys.APP_REMOVE_TOOL: {
      const index: number = Utils.getToolIndex(action.payload, state.tools);
      return {
        ...state,
        selectedTool: (state.selectedTool === action.payload) ? null : state.selectedTool,
        tools: [
          ...state.tools.slice(0, index),
          ...state.tools.slice(index + 1)
        ]
      }
    }
    case TypeKeys.APP_SELECT_TOOL: {
      return {
        ...state,
        selectedTool: action.payload
      }
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
          }
        })
      }
    }
    case TypeKeys.APP_SAVE_TOOLS: {
      console.log(JSON.stringify(state.tools));
      return {
        ...state
      }
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});

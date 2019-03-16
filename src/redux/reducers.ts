import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { Tool } from '../Tool';

interface AppState {
  tools: Tool[];
}

export const getInitialState = () => {
  return {
    selectedTool: null,
    tools: []
  }
};

export const app = (state: AppState = getInitialState(), action: ActionTypes) => {

  switch (action.type) {
    case TypeKeys.APP_ADD_TOOL: {
      return {
        ...state,
        tools: [...state.tools, action.payload]
      }
    }
    case TypeKeys.APP_REMOVE_TOOL: {
      return {
        ...state,
        selectedTool: null,
        tools: [
          ...state.tools.slice(0, action.payload),
          ...state.tools.slice(action.payload + 1)
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

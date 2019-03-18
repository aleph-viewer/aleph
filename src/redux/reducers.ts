import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { Tool } from '../interfaces/Tool';
import { Utils } from '../utils/Utils';

interface AppState {
  tools: Tool[];
  selectedTool: number | null;
}

export const getInitialState = () => {
  return {
    selectedTool: null,
    tools: [{"id":1,"position":"9.44080898451908 -2.6658874101881747 -1.3672344825947391","color":"#8cb7ff","selectedColor":"#005cf2"},{"id":3,"position":"2.024138841123051 5.502448747192732 -19.72579870356846","color":"#8cb7ff","selectedColor":"#005cf2"},{"id":5,"position":"-1.7392712095140936 -4.9028220850469895 -11.692082259474734","color":"#8cb7ff","selectedColor":"#005cf2"}]
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

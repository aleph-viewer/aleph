import { combineReducers } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { Cube } from '../Cube';

interface AppState {
  boxEnabled: boolean;
  cubes: Cube[];
}

export const getInitialState = () => {
  return {
    boxEnabled: false,
    cubes: []
  }
};

export const app = (state: AppState = getInitialState(), action: ActionTypes) => {

  switch (action.type) {
    case TypeKeys.APP_SET_BOX_ENABLED: {
      return {
        ...state,
        boxEnabled: action.payload
      }
    }
    case TypeKeys.APP_ADD_CUBES: {
      return {
        ...state,
        cubes: [...state.cubes, ...action.payload]
      }
    }
    case TypeKeys.APP_REMOVE_CUBES: {
      return {
        ...state,
        cubes: state.cubes.splice(0, state.cubes.length - action.payload)
      }
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});
